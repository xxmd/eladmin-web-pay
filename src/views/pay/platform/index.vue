<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <el-form inline>
          <el-form-item label="平台名称">
            <el-input v-model="query.name" clearable/>
          </el-form-item>
          <el-form-item label="平台域名">
            <el-input v-model="query.domainName" clearable/>
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input v-model="query.contact" clearable/>
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
        <el-form-item label="平台名称" prop="name">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="平台域名" prop="domainName">
          <el-input v-model="form.domainName"/>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="form.contact"/>
        </el-form-item>
        <el-form-item label="平台排序" prop="sort">
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
      lazy
      :data="crud.data"
      row-key="id"
      @select="crud.selectChange"
      @select-all="crud.selectAllChange"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column label="平台名称" prop="name"/>
      <el-table-column label="平台域名" prop="domainName"/>
      <el-table-column label="联系方式" prop="contact"/>
      <el-table-column label="商户数量" prop="merchantList.length">
        <template slot-scope="scope">
          <el-link :disabled="scope.row.merchantList.length === 0" type="primary" @click="toMerchantPage(scope.row)">
            {{ scope.row.merchantList.length }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="平台排序" prop="sort"/>
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
            :disabled-dle="scope.row.merchantList.length > 0"
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
import crudUser from '@/api/system/user'

const defaultForm = { id: null, name: null, domainName: null, contact: null, sort: 999, enabled: true, remark: null }
export default {
  name: 'Platform',
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
        name: [
          { required: true, message: '请输入平台名称', trigger: 'blur' }
        ],
        domainName: [
          { required: true, message: '请输入平台域名', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ]
      },
      permission: {
        add: ['admin', 'pay:platform:create'],
        edit: ['admin', 'pay:platform:update'],
        del: ['admin', 'pay:platform:delete']
      }
    }
  },
  methods: {
    toMerchantPage(row) {
      this.$router.push({
        path: '/pay/merchant',
        query: {
          platformId: row.id
        }
      })
    },
    changeEnabled(data, val) {
      const operation = val ? '启用' : '禁用'
      this.$confirm('此操作将 "' + operation + '" ' + data.name + ', 是否继续？', '提示', {
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
