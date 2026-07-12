<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <el-form inline>
          <el-form-item label="归属平台">
            <el-select
              v-model="query.platformId"
              filterable
              clearable
              placeholder=""
            >
              <el-option
                v-for="item in platformOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商户id">
            <el-input v-model="query.merchantId" clearable/>
          </el-form-item>
          <el-form-item label="md5密钥">
            <el-input v-model="query.md5SecretKey" clearable/>
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
        <el-form-item label="归属平台" prop="platform.id">
          <el-select
            v-model="form.platform.id"
            filterable
            placeholder=""
          >
            <el-option
              v-for="item in platformOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户id" prop="merchantId">
          <el-input v-model="form.merchantId"/>
        </el-form-item>
        <el-form-item label="md5密钥" prop="md5SecretKey">
          <el-input v-model="form.md5SecretKey"/>
        </el-form-item>
        <el-form-item label="支付方式" prop="methodList">
          <el-select
            v-model="form.methodList"
            multiple
            placeholder=""
          >
            <el-option
              v-for="item in methodOptions"
              :key="item.id"
              :label="item.label"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户排序" prop="sort">
          <el-input-number v-model="form.sort" :min="1" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="是否启用" prop="enabled">
          <el-switch v-model="form.enabled"/>
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
      <el-table-column label="归属平台" prop="platform.name"/>
      <el-table-column label="商户id" prop="merchantId"/>
      <el-table-column label="md5密钥" prop="md5SecretKey"/>
      <el-table-column label="支付方式" prop="methodList">
        <template slot-scope="scope">
          {{ formatMethodList(scope.row.methodList) }}
        </template>
      </el-table-column>
      <el-table-column label="商户排序" prop="sort"/>
      <el-table-column label="是否启用" prop="enabled">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="changeEnabled(scope.row, scope.row.enabled)"
          />
        </template>
      </el-table-column>
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
import crudItem from '@/api/pay/merchant'
import platformApi from '@/api/pay/platform'
import methodApi from '@/api/pay/method'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import DateRangePicker from '@/components/DateRangePicker'

const defaultForm = {
  id: null,
  platform: { id: null },
  merchantId: null,
  md5SecretKey: null,
  methodList: [],
  sort: 999,
  enabled: true,
  remark: null
}
export default {
  name: 'Merchant',
  components: { crudOperation, rrOperation, udOperation, DateRangePicker },
  cruds() {
    return CRUD({
      title: '', url: crudItem.BASE_URL, crudMethod: { ...crudItem },
      queryOnPresenterCreated: false
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 设置数据字典
  dicts: ['dept_status'],
  data() {
    return {
      platformOptions: [],
      methodOptions: [],
      rules: {
        'platform.id': [
          { required: true, message: '请选择归属平台', trigger: 'change' }
        ],
        merchantId: [
          { required: true, message: '请输入商户id', trigger: 'blur' }
        ],
        md5SecretKey: [
          { required: true, message: '请输入md5密钥', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入商户排序', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '请选择是否启用', trigger: 'change' }
        ]
      },
      permission: {
        add: ['admin', 'pay:merchant:create'],
        edit: ['admin', 'pay:merchant:update'],
        del: ['admin', 'pay:merchant:delete']
      }
    }
  },
  created() {
    this.handleQueryParam()
    this.loadPlatformOptions()
    this.loadMethodOptions()
  },
  methods: {
    handleQueryParam() {
      const platformId = this.$route.query.platformId
      if (platformId) {
        this.$set(this.query, 'platformId', Number(platformId))
        this.crud.toQuery()
      } else {
        this.crud.toQuery()
      }
    },
    formatMethodList: function(methodList) {
      if (!methodList) {
        return ''
      }
      return methodList.map(item => item.label).join(' ')
    },
    loadPlatformOptions() {
      platformApi.findAll().then(res => {
        this.platformOptions = res
      }).catch(error => {
        this.$notify.error({
          title: '查询平台列表异常',
          message: error.message,
          duration: 0
        })
      })
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
    changeEnabled(data, val) {
      const operation = val ? '启用' : '禁用'
      this.$confirm('此操作将 "' + operation + '" ' + data.merchantId + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudItem.edit(data).then(res => {
          this.crud.notify(operation + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(error => {
          this.$notify.error({
            title: '修改平台状态异常',
            message: error.message,
            duration: 0
          })
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
