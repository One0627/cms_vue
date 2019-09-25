<template>
  <div>
    <el-row>
      <el-select v-model="QueryType" placeholder="请选择" class="handle-select mr10" @change="selectOptionChange">
        <el-option label="英文名" value="roleNo"></el-option>
        <el-option label="角色中文名" value="roleName"></el-option>
      </el-select>

      <el-input v-model="QueryString" placeholder="请输入" class="handle-input mr10" clearable v-show="QueryStringState"></el-input>

      <el-select v-model="QueryString" placeholder="请选择使用状态" class="handle-select mr10" v-show="!QueryStringState">
        <el-option label="正常" value="1"></el-option>
        <el-option label="禁用" value="0"></el-option>
      </el-select>
      <el-button type="primary" @click="search" icon="el-icon-search" v-show="$store.getters.CurrentState( 'RoleInfo').search" title="清空查询输入框再点击查询按钮即可查询所有的数据">查询</el-button>
      <el-button type="primary" @click="handleAdd" v-show="$store.getters.CurrentState('RoleInfo').add" icon="el-icon-plus">新增</el-button>
    </el-row>
    <el-row>
      <!-- <Tables :tableConfig="this.tableConfig" :tableData="tableData" @handleEdit="handleEdit" @handleDelete="handleDelete" :formatMethod="handleFormat" v-loading="loading" element-loading-text="数据加载中..." /> -->
      <el-table :data="tableData" height="680" border style="width: 100%" v-loading="loading" element-loading-text="数据加载中...">
        <el-table-column v-for="item in head" :prop="item.value" :key="item.value" :formatter="handleFormat" :label="item.title" :sortable="item.sort">
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button size="mini" v-show="$store.getters.CurrentState( 'RoleInfo').update" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" v-show="$store.getters.CurrentState( 'RoleInfo').delete" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :current-page="currentPage" :page-size="pageSize" :page-sizes="pageSizes" :total="total" style="float: right">
      </el-pagination>
    </el-row>

    <!-- 编辑弹出框 -->
    <el-dialog :title="editDialogTitle" :visible.sync="editDialogVisible" width="45%">
      <el-form ref="addAndEditForm" :model="addAndEditForm" label-width="118px">
        <el-form-item label="角色英文名称:">
          <el-input v-model="addAndEditForm.roleNo" ref="roleNo" class="addAndEditForm-input" :disabled="addAndEditForm.roleDisabled"></el-input>
          <label title="角色英文名称唯一且不能修改" style="font-size: 12px;margin-left: 8px;color: red;">角色英文名称...</label>
        </el-form-item>
        <el-form-item label="角色中文名称:">
          <el-input v-model="addAndEditForm.roleName" ref="roleName" class="addAndEditForm-input"></el-input>
        </el-form-item>

        <el-form-item label="菜单权限信息:">
          <div class="block">
            <el-tree ref="tree" show-checkbox :key="0" :data="menuData" node-key="id" :expand-on-click-node="false" default-expand-all :default-checked-keys="defaultCheckedArr">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ data.name }}</span>
                <span style='margin-left:40px;'>
                  <template v-if="addAndEditForm.permissions.find(x=>x.menuId===data.id)!==null">
                    <el-checkbox v-for="(item,index) of addAndEditForm.permissions.find(x=>x.menuId===data.id)" v-show="typeof(addAndEditForm.permissions.find(x=>x.menuId===data.id)[index])==='boolean'" :index="index+''" :key="item.menuId" v-model="addAndEditForm.permissions.find(x=>x.menuId===data.id)[index]" :label="checkStr(index)" style="margin-left: -20px;"></el-checkbox>
                  </template>
                  <template v-else-if="!data.children||data.children.length===0">
                    <el-checkbox v-for="(item,index) of permissions" v-show="typeof(permissions[index])==='boolean'" :index="index" :key="item.id" @change="permissChange(node,index,$event)" :label="checkStr(index)" style="margin-left: -20px;"></el-checkbox>
                  </template>
                </span>
              </span>
            </el-tree>
          </div>
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
import role from '@/api/role'
import menu from '@/api/menu'
import { mapGetters, mapActions } from 'vuex'
export default {
  created () {
    this.search()
  },
  props: {

  },
  data () {
    return {
      head: [
        {
          value: 'roleId',
          title: '编号',
          sort: true
        }, {
          value: 'roleNo',
          title: '角色英文名称'
        }, {
          value: 'roleName',
          title: '角色中文名称'
        }],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
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
      editDialogTitle: '新增',
      defaultExpandArr: [], // 默认展开的节点
      defaultCheckedArr: [], // 默认被选择的节点
      addAndEditForm: {
        roleId: '',
        roleNo: '',
        roleDisabled: false,
        roleName: '',
        permissions: []
      },
      permissions: {
        menuId: '',
        search: false,
        add: false,
        delete: false,
        update: false,
        import: false,
        export: false,
        _lock: false
      },
      menuData: []
    }
  },
  computed: {
    ...mapGetters([
      'CurrentState'
    ])
  },
  mounted () {

  },
  watch: {

  },
  methods: {
    permissChange (node, index, data) {
      let menuId = node.data.id
      let checked = node.checked
      if (checked) {
        let permission = {
          menuId,
          search: null,
          add: null,
          delete: null,
          update: null,
          import: null,
          export: null,
          _lock: null
        }
        permission[index] = data
        this.addAndEditForm.permissions.push(permission)
      }
    },
    ...mapActions([
    ]),
    selectOptionChange (val) {
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
      role.RoleInfolist(Query).then(res => {
        this.tableData = res.data.tableData
        this.total = res.data.total
        this.loading = false
      }).catch(err => {
        this.$message.warning(err.message)
        this.loading = false
      })
    },
    handleAdd () {
      this.editDialogTitle = '新增'
      this.addAndEditForm.roleDisabled = false
      let row = {
        permissions: []
      }
      this.bindFormData(row)
    },
    handleEdit (index, row) {
      this.editDialogTitle = '修改'
      this.addAndEditForm.roleDisabled = true
      this.bindFormData(row)
    },
    bindFormData (item) {
      this.listAllMenu()
      this.addAndEditForm.roleId = item.roleId
      this.addAndEditForm.roleNo = item.roleNo
      this.addAndEditForm.roleName = item.roleName
      this.addAndEditForm.permissions = item.permissions
      this.defaultCheckedArr = []
      item.permissions.forEach(item => {
        this.defaultCheckedArr.push(item.menuId)
      })
    },
    listAllMenu () {
      menu.MenuTree().then(res => {
        this.menuData = res.data
        this.editDialogVisible = true
      }).catch(err => {
        this.$message.warning(err.message)
        this.loading = false
      })
    },
    handleDelete (index, row) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        /* DeleteUser().then(res => {
          if (res.data.state) {
            this.$message.success(res.data.message)
            this.search()
          } else {
            this.$message.warning(res.data.message)
          }
        }).catch(err => {
          this.$message.warning(err.message)
        }) */
      }).catch(() => { })
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
      var rolePermis = {
        roleId: this.addAndEditForm.roleId,
        roleNo: this.addAndEditForm.roleNo,
        roleName: this.addAndEditForm.roleName,
        permissions: [] // this.addAndEditForm.permissions
      }
      this.$refs.tree.getCheckedKeys().forEach(item => {
        let permis = this.addAndEditForm.permissions.find(per => {
          return per.menuId === item
        })
        if (permis === undefined) {
          permis = { menuId: item }
        }
        rolePermis.permissions.push(permis)
      })
      this.$refs.tree.getHalfCheckedKeys().forEach(item => {
        rolePermis.permissions.push({ menuId: item })
      })
      role.AddOrEditRole(rolePermis).then(res => {
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
    },
    handleCheckChange (data, checked, indeterminate) {
      if (checked) {
        console.log(this.$refs.tree.getCheckedKeys())
      }
    },
    checkStr (a) {
      let b = ''
      switch (a) {
        case 'search':
          b = '查询'
          break
        case 'add':
          b = '添加'
          break
        case 'delete':
          b = '删除'
          break
        case 'update':
          b = '编辑'
          break
        case 'import':
          b = '导入'
          break
        case 'export':
          b = '导出'
          break
        case '_lock':
          b = '锁定'
          break
      }
      return b
    }
  },
  components: {

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
