<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <el-form inline>
          <el-form-item label="订单号">
            <el-input v-model="query.orderNumber" clearable/>
          </el-form-item>
          <el-form-item label="所属商户">
            <el-select
              v-model="query.merchantId"
              filterable
              clearable
              placeholder=""
            >
              <el-option
                v-for="item in merchantOptions"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="query.productName" clearable/>
          </el-form-item>
          <el-form-item label="支付方式">
            <el-select
              v-model="query.methodId"
              filterable
              clearable
              placeholder=""
            >
              <el-option
                v-for="item in methodOptions"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支付状态">
            <el-select
              v-model="query.payStatus"
              filterable
              clearable
              placeholder=""
            >
              <el-option
                v-for="item in dict.pay_status"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="更新时间">
            <date-range-picker v-model="query.updateTime"/>
          </el-form-item>
          <rrOperation/>
        </el-form>
      </div>
      <crudOperation :permission="permission"/>
    </div>
    <!--表单组件-->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="500px"
    >
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="所属商户" prop="merchant.id">
          <el-select
            :disabled="crud.status.inEditMode"
            v-model="form.merchant.id"
            filterable
            placeholder=""
            @change="onMerchantChange"
          >
            <el-option
              v-for="item in merchantOptions"
              :key="item.id"
              :label="item.label"
              :value="item.id"
              :disabled="!item.enabled"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input :disabled="crud.status.inEditMode" v-model="form.productName"/>
        </el-form-item>
        <el-form-item label="商品价格" prop="productPrice">
          <el-input :disabled="crud.status.inEditMode" v-model="form.productPrice"/>
        </el-form-item>
        <el-form-item label="商品数量" prop="productQuantity">
          <el-input-number :disabled="crud.status.inEditMode" v-model="form.productQuantity" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="支付方式" prop="method">
          <el-select
            :disabled="crud.status.inEditMode"
            v-model="form.method.id"
            filterable
            clearable
            placeholder=""
          >
            <el-option
              v-for="item in merchantMethodOptions"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      row-key="id"
      @select="crud.selectChange"
      @select-all="crud.selectAllChange"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column label="订单号" prop="orderNumber"/>
      <el-table-column label="所属商户">
        <template slot-scope="scope">
          {{ formatMerchant(scope.row.merchant) }}
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="productName"/>
      <el-table-column label="商品价格" prop="productPrice"/>
      <el-table-column label="商品数量" prop="productQuantity"/>
      <el-table-column label="订单金额">
        <template slot-scope="scope">
          {{ computeOrderAmount(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column label="支付方式" prop="method">
        <template slot-scope="scope">
          {{ scope.row.method.label }}
        </template>
      </el-table-column>
      <el-table-column label="支付链接" prop="payUrl" show-overflow-tooltip/>
      <el-table-column label="支付状态" prop="payStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.payStatus === 'PAID' ? 'success' : 'danger'">
            {{ dict.label.pay_status[scope.row.payStatus] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="payTime" label="支付时间"/>
      <el-table-column label="备注" prop="remark"/>
      <el-table-column prop="updateTime" label="更新时间"/>
      <el-table-column prop="updateBy" label="更新者"/>
      <el-table-column
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import crudItem from '@/api/pay/order'
import merchantApi from '@/api/pay/merchant'
import methodApi from '@/api/pay/method'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import DateRangePicker from '@/components/DateRangePicker'
import { validatePrice } from '@/utils/validate'

const defaultForm = {
  id: null,
  merchant: { id: null },
  method: {id : null},
  productName: null,
  productPrice: null,
  productQuantity: null,
  remark: null
}
export default {
  name: 'Merchant',
  components: { crudOperation, rrOperation, udOperation, DateRangePicker },
  cruds() {
    return CRUD({ title: '', url: crudItem.BASE_URL, crudMethod: { ...crudItem } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 设置数据字典
  dicts: ['pay_method', 'pay_status'],
  data() {
    return {
      methodOptions: [],
      merchantOptions: [],
      merchantMethodOptions: [],
      rules: {
        'merchant.id': [
          { required: true, message: '请选择归属商户', trigger: 'change' }
        ],
        productName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        productPrice: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { validator: validatePrice, trigger: 'blur' }
        ],
        productQuantity: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        method: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ]
      },
      permission: {
        add: ['admin', 'pay:order:create'],
        edit: ['admin', 'pay:order:update'],
        del: ['admin', 'pay:order:delete']
      }
    }
  },
  created() {
    this.loadMerchantOptions();
    this.loadMethodOptions();
  },
  methods: {
    onMerchantChange() {
      const merchantId = this.form.merchant.id;
      if (!merchantId) {
        this.form.method.id = null;
        return;
      }
      this.merchantMethodOptions = this.merchantOptions.find(item => item.id === merchantId).methodList;
      const ids = this.merchantMethodOptions.map(item => item.id);
      if (!ids.includes(this.form.method.id)) {
        this.form.method.id = null;
      }
    },
    loadMethodOptions() {
      methodApi.findAll().then(res => {
        this.methodOptions = res
      }).catch(error => {
        this.$notify.error({
          title: '查询支付方式列表异常',
          message: error.message,
          duration: 0
        })
      })
    },
    computeOrderAmount(order) {
      if (!order) {
        return ''
      }
      const amount = order.productPrice * order.productQuantity
      return amount.toFixed(2)
    },
    formatMerchant(merchant) {
      if (!merchant || !merchant.platform) {
        return ''
      }
      return `${merchant.platform.name}_${merchant.merchantId}`
    },
    loadMerchantOptions() {
      merchantApi.findAll().then(res => {
        this.merchantOptions = res.map(it => {
          it.label = this.formatMerchant(it);
          it.enabled = it.platform.enabled && it.enabled;
          return it
        })
      }).catch(error => {
        this.$notify.error({
          title: '查询商户列表异常',
          message: error.message,
          duration: 0
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
