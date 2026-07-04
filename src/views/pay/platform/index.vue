<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <el-form inline>
          <el-form-item label="平台名称">
            <el-input v-model="query.name" clearable />
          </el-form-item>
          <el-form-item label="平台接口">
            <el-input v-model="query.endpoint" clearable />
          </el-form-item>
          <el-form-item label="平台网站">
            <el-input v-model="query.website" clearable />
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input v-model="query.contact" clearable />
          </el-form-item>
          <el-form-item label="更新时间">
            <date-range-picker v-model="query.updateTime" />
          </el-form-item>
          <rrOperation />
        </el-form>
      </div>
      <crudOperation :permission="permission" />
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
      <el-form ref="form" inline :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="平台名称" prop="name">
          <el-input v-model="form.name" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="平台接口" prop="endpoint">
          <el-input v-model="form.endpoint" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="平台网址" prop="website">
          <el-input v-model="form.website" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="form.contact" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" style="width: 370px;" />
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
      <el-table-column type="selection" width="55" />
      <el-table-column label="平台名称" prop="name" />
      <el-table-column label="平台接口" prop="endpoint" />
      <el-table-column label="平台网址" prop="website" />
      <el-table-column label="联系方式" prop="contact" />
      <el-table-column label="备注" prop="remark" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column prop="updateBy" label="更新者" />
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
import crudItem from '@/api/pay/platform'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import DateRangePicker from '@/components/DateRangePicker'

const defaultForm = { id: null, name: null, endpoint: null, website: null, contact: null, remark: null }
export default {
  name: 'Dept',
  components: { crudOperation, rrOperation, udOperation, DateRangePicker },
  cruds() {
    return CRUD({ title: '', url: crudItem.BASE_URL, crudMethod: { ...crudItem }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 设置数据字典
  dicts: ['dept_status'],
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入平台名称', trigger: 'blur' }
        ],
        endpoint: [
          { required: true, message: '请输入接口地址', trigger: 'blur' }
        ],
        website: [
          { required: true, message: '请输入平台网站', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ]
      },
      permission: {
        add: ['admin', 'pay:platform:add'],
        edit: ['admin', 'pay:platform:edit'],
        del: ['admin', 'pay:platform:del']
      }
    }
  },
  methods: {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
