<template>
  <div>
    <el-row>
      <el-select v-model="QueryType" placeholder="请选择" class="handle-select mr10" @change="selectOptionChange">
        <el-option label="登陆名" value="userNo"></el-option>
        <el-option label="真实姓名" value="userName"></el-option>
        <el-option label="电话号码" value="userTel"></el-option>
        <el-option label="使用状态" value="userState"></el-option>
      </el-select>

      <el-input v-model="QueryString" placeholder="请输入" class="handle-input mr10" clearable v-show="QueryStringState"></el-input>

      <el-select v-model="QueryString" placeholder="请选择使用状态" class="handle-select mr10" v-show="!QueryStringState">
        <el-option label="正常" value="1"></el-option>
        <el-option label="禁用" value="0"></el-option>
      </el-select>
      <el-button type="primary" @click="search" icon="el-icon-search" v-show="$store.getters.CurrentState('user', 'UserInfo').search" title="清空查询输入框再点击查询按钮即可查询所有的数据">查询</el-button>
      <el-button type="primary" @click="handleAdd" v-show="$store.getters.CurrentState('user', 'UserInfo').add" icon="el-icon-plus">新增</el-button>
    </el-row>
    <el-row>
      <!-- <Tables :tableConfig="this.tableConfig" :tableData="tableData" @handleEdit="handleEdit" @handleDelete="handleDelete" :formatMethod="handleFormat" v-loading="loading" element-loading-text="数据加载中..." /> -->
      <el-table :data="tableData" height="680" border style="width: 100%" v-loading="loading" element-loading-text="数据加载中...">
        <el-table-column v-for="item in head" :prop="item.value" :key="item.value" :formatter="handleFormat" :label="item.title" :sortable="item.sort">
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" v-show="$store.getters.CurrentState('user', 'UserInfo').update" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" v-show="$store.getters.CurrentState('user', 'UserInfo').delete" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :current-page="currentPage" :page-size="pageSize" :page-sizes="pageSizes" :total="total" style="float: right">
      </el-pagination>
    </el-row>

    <!-- 编辑弹出框 -->
    <el-dialog :title="editDialogTitle" :visible.sync="editDialogVisible" width="25%">
      <el-form ref="addAndEditForm" :model="addAndEditForm" label-width="118px">
        <el-form-item label="登录名:">
          <el-input v-model="addAndEditForm.userNo" ref="userNo" class="addAndEditForm-input" :disabled="addAndEditForm.nameDisabled"></el-input>
          <label title="登录名唯一且不能修改" style="font-size: 12px;margin-left: 8px;color: red;">登录名...</label>
        </el-form-item>
        <el-form-item label="真实姓名:">
          <el-input v-model="addAndEditForm.userName" ref="userName" class="addAndEditForm-input"></el-input>
        </el-form-item>
        <el-form-item label="密码:" v-show="addAndEditForm.passwordShowState">
          <el-input v-model="addAndEditForm.password" ref="password" class="addAndEditForm-input"></el-input>
        </el-form-item>
        <el-form-item label="电话号码:">
          <el-input v-model="addAndEditForm.userTel" ref="userTel" class="addAndEditForm-input"></el-input>
        </el-form-item>

        <el-form-item label="角色:">
          <el-select v-model="addAndEditForm.roleIds" multiple filterable :filter-method="filterRoles" ref="role" placeholder="请选择" class="addAndEditForm-input">
            <el-option v-for="item in roleSelect" :key="item.roleNo" :label="item.roleName" :value="item.roleId">
              <span style="float: left; width:220px; font-size: 12px">{{ item.roleName }}({{ item.roleNo }})</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="使用状态:">
          <el-select v-model="addAndEditForm.userState" ref="userState" placeholder="请选择" class="addAndEditForm-input">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="正常" value="1"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/* import Tables from '../tables.vue' */
import user from '@/api/user'
import role from '@/api/role'
import { mapGetters, mapActions } from 'vuex'
// import * as signalR from '@aspnet/signalr'
// import signal from '../../utils/signalR'
export default {
  created () {
    this.search()
    var that = this
    this.signal.on('ReceiveUpdate', function (res) {
      console.log(res)
      that.search()
    })
  },
  props: {
  },
  components: {
    /* Tables */
  },
  data () {
    return {
      head: [
        {
          value: 'userId',
          title: '编号',
          sort: true
        }, {
          value: 'userNo',
          title: '登录名'
        }, {
          value: 'userName',
          title: '真实姓名'
        }, {
          value: 'userTel',
          title: '电话号码'
        }, {
          value: 'userState',
          title: '使用状态'
        }],
      loading: false,
      tableData: [],
      QueryType: '',
      QueryString: '',
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 25, 50, 100],
      total: 0,
      QueryStringState: true,
      editDialogVisible: false,
      editDialogTitle: '修改',
      roleSelect: '',
      addAndEditForm: {
        userId: '',
        userNo: '',
        nameDisabled: false,
        userName: '',
        password: '',
        passwordShowState: true,
        userTel: '',
        roleIds: '',
        userState: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'CurrentState'
    ])
  },
  methods: {
    ...mapActions([
    ]),
    selectOptionChange (val) {
      if (val === 'userState') {
        this.QueryStringState = false
      } else {
        this.QueryStringState = true
      }
      this.QueryString = ''
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.search()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.search()
    },
    search () {
      this.loading = true
      let Query = {
        QueryType: this.QueryType,
        QueryString: this.QueryString,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      user.UserInfoList(Query).then(res => {
        this.tableData = res.data.tableData
        this.total = res.data.total
        this.loading = false
      }).catch(err => {
        this.$message.warning(err.message)
        this.loading = false
      })
    },
    handleAdd () {
      this.editDialogVisible = true
      this.editDialogTitle = '新增'
      this.addAndEditForm.nameDisabled = false
      this.addAndEditForm.passwordShowState = true
      let row = {
        userState: '1',
        password: null
      }
      this.bindFormData(row)
    },
    handleEdit (index, row) {
      this.editDialogVisible = true
      this.editDialogTitle = '编辑'
      this.addAndEditForm.nameDisabled = true
      this.addAndEditForm.passwordShowState = false
      this.bindFormData(row)
    },
    bindFormData (item) {
      this.addAndEditForm.userId = item.userId
      this.addAndEditForm.userNo = item.userNo
      this.addAndEditForm.userName = item.userName
      // this.addAndEditForm.password = item.password
      this.addAndEditForm.userTel = item.userTel
      this.addAndEditForm.userState = item.userState + ''
      this.addAndEditForm.roleIds = item.roleIds
      this.filterRoles()
    },
    filterRoles () {
      role.GetRoleSelect().then(res => {
        this.roleSelect = res.data
      }).catch(err => {
        this.$message.warning(err.message)
      })
    },
    handleDelete (index, row) {
      this.signal.invoke('SendNotice', row.userId, 'message').catch(err => console.error(err.toString()))
      if (row.userState === 1) {
        this.$message.error({
          message: '该用户处于正常状态，不能删除！',
          center: true
        })
      } else {
        this.$confirm('是否确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          user.DeleteUser({ userId: row.userId }).then(res => {
            if (res.data.state) {
              this.$message.success(res.data.message)
              this.search()
            } else {
              this.$message.warning(res.data.message)
            }
          }).catch(err => {
            this.$message.warning(err.message)
          })
        }).catch(() => {

        })
      }
    },
    handleFormat (row, column) {
      let col = ''
      if (column.property === 'userState') {
        switch (row.userState) {
          case 0:
            col = '禁用'
            break
          case 1:
            col = '正常'
            break
          default:
            col = '正常'
        }
      }
      if (col === '') {
        return row[column.property]
      }
      return col
    },
    save () {
      user.AddOrEditUser(this.addAndEditForm).then(res => {
        if (res.data.state) {
          this.$message.success(res.data.message)
          this.editDialogVisible = false
          this.search()
        } else {
          this.$message.warning(res.data.message)
        }
      }).catch(err => {
        this.$message.warning(err.message)
      })
    }
  },
  watch: {

  }
}
</script>

<style scoped lang="less">
.el-row {
  margin-bottom: 20px;
}
.handle-select {
  width: 180px;
}
.handle-input {
  width: 300px;
  display: inline-block;
}
.mr10 {
  margin-right: 10px;
}
.addAndEditForm-input {
  width: 51%;
}
</style>
