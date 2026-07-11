<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
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
        <el-form-item label="标签" prop="label">
          <el-input v-model="form.label"/>
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input v-model="form.value"/>
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
      lazy
      :data="crud.data"
      row-key="id"
      @select="crud.selectChange"
      @select-all="crud.selectAllChange"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column label="标签" prop="label"/>
      <el-table-column label="值" prop="value"/>
      <el-table-column label="绑定商户数量">
        <template slot-scope="scope">
          <el-link :disabled="scope.row.payMerchantList.length === 0" type="primary">{{scope.row.payMerchantList.length}}</el-link>
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
            :disabled-dle="scope.row.payMerchantList.length > 0"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import crudItem from '@/api/pay/method'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import DateRangePicker from '@/components/DateRangePicker'

const defaultForm = { id: null, label: null, value: null, remark: null }
export default {
  name: 'PayMethod',
  components: { crudOperation, rrOperation, udOperation, DateRangePicker },
  cruds() {
    return CRUD({ title: '', url: crudItem.BASE_URL, crudMethod: { ...crudItem } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 设置数据字典
  dicts: [],
  data() {
    return {
      rules: {
        label: [
          { required: true, message: '请输入标签', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入值', trigger: 'blur' }
        ]
      },
      permission: {
        add: ['admin', 'pay:method:create'],
        edit: ['admin', 'pay:method:update'],
        del: ['admin', 'pay:method:delete']
      }
    }
  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
