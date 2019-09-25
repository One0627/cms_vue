<template>
  <div>
    <el-row>
      <el-button @click="addNode('addFirstLevel')">添加顶级节点</el-button>
    </el-row>
    <el-row>
      <el-tree ref="tree" key="id" :data="menuData" node-key="id" :expand-on-click-node="false" default-expand-all>
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ data.name }}</span>
          <span style="margin-left:100px;">
            <i style='color:blue' class='el-icon-plus' title='新增' @click="addNode('addChild',node,data)" />&nbsp;
            <i style='color:#409EFF' class='el-icon-edit' title='修改' @click="editNode(data)" />&nbsp;
            <i style='color:red' class='el-icon-delete' title='删除' @click="delNode(node, data)" />&nbsp;
            <i style='color:#7CFC00' class='el-icon-upload2' v-show="data.menuNo !== 1 " title='上移' @click="upNode(data)" />&nbsp;
            <i style='color:#FFD700' class='el-icon-download' v-show="node.parent.childNodes[node.parent.childNodes.length - 1] !== node " title='下移' @click="downNode(data)" />
          </span>
        </span>
      </el-tree>
    </el-row>

    <!-- 新增/编辑弹出框 -->
    <el-dialog :title="addAndEditDialogTitle" :visible.sync="addAndEditDialogVisible" width="30%">
      <el-form ref="addAndEditForm" :model="addAndEditForm" label-width="118px">
        <el-form-item label="id:" v-if="false">
          <el-input v-model="addAndEditForm.id" ref="id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="父级菜单id:" v-if="false">
          <el-input v-model="addAndEditForm.parentId" ref="parentId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="父级菜单名称:" v-show="pnameShowState">
          <el-input v-model="addAndEditForm.pname" ref="pname" class="addAndEditForm-input" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称:">
          <el-input v-model="addAndEditForm.name" ref="name" class="addAndEditForm-input"></el-input>
        </el-form-item>
        <el-form-item label="url:">
          <el-input v-model="addAndEditForm.url" ref="url" class="addAndEditForm-input"> <template slot="prepend">{{addAndEditForm.purl}}</template></el-input>
          <label title="仅支持添加components文件夹下vue文件" style="font-size: 8px;margin-left: 8px;color: red;">请填写文件名</label>
        </el-form-item>
        <el-form-item label="icon:">
          <el-input v-model="addAndEditForm.icon" ref="icon" class="addAndEditForm-input"><template slot="append">预览:<i slot="suffix" :class="addAndEditForm.icon"></i></template></el-input>
        </el-form-item>
        <el-form-item label="排序号:">
          <el-input v-model="addAndEditForm.menuNo" ref="menuNo" class="addAndEditForm-input" @keyup.native="validateOrderNum" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAndEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import menu from '@/api/menu'
export default {
  props: {

  },
  data () {
    return {
      addAndEditDialogTitle: '新增',
      addAndEditDialogVisible: false,
      delDialogVisible: false,
      pnameShowState: false,
      addAndEditForm: {
        id: '',
        parentId: '',
        pname: '',
        name: '',
        purl: '',
        url: '',
        icon: '',
        menuNo: 0
      },
      menuData: []
    }
  },
  computed: {

  },
  created () {
    this.listAllMenu()
  },
  mounted () {

  },
  watch: {

  },
  methods: {
    listAllMenu () {
      menu.MenuTree().then(res => {
        this.menuData = res.data
      }).catch(err => {
        this.$message.warning(err.message)
      })
    },
    addNode (type, node, data) {
      if (node && node.level >= 2) {
        this.$message.error('最多只支持二级！')
        return false
      }
      this.pnameShowState = true
      this.addAndEditDialogTitle = '新增'
      let q = {
        menuNo: this.menuData.length + 1
      }
      if (type !== 'addFirstLevel') { // 新增一级
        q.parentId = data.id
        q.pname = data.name
        q.purl = data.url + '/'
        q.menuNo = node.childNodes.length + 1
      } else {
        this.pnameShowState = false
      }
      this.bindFormData(q)
    },
    editNode (data) {
      this.pnameShowState = false
      this.addAndEditDialogTitle = '修改'
      if (data.url.indexOf('/') > -1) {
        data.purl = data.url.split('/')[0] + '/'
        data.url = data.url.split('/')[1]
      }
      this.bindFormData(data)
    },
    bindFormData (data) {
      this.addAndEditForm.id = data.id
      this.addAndEditForm.parentId = data.parentId
      this.addAndEditForm.pname = data.pname
      this.addAndEditForm.name = data.name
      this.addAndEditForm.url = data.url
      this.addAndEditForm.purl = data.purl
      this.addAndEditForm.icon = data.icon
      this.addAndEditForm.menuNo = data.menuNo
      this.addAndEditDialogVisible = true
    },
    delNode (node, data) {
      if (data.children && data.children.length !== 0) {
        this.$message.error('此菜单有子菜单，不可删除！')
        return false
      } else {
        this.$confirm(data.name + '  是否确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          menu.DeleteNode({ id: data.id }).then(res => {
            if (res.data.state) {
              this.$message.success(res.data.message)
              this.listAllMenu()
            } else {
              this.$message.warning(res.data.message)
            }
          }).catch(err => {
            this.$message.warning(err.message)
          })
        }).catch(() => { })
      }
    },
    upNode (data) {
      menu.UpNode(data).then(res => {
        if (res.data.state) {
          this.listAllMenu()
        } else {
          this.$message.warning(res.data.message)
        }
      }).catch(err => {
        this.$message.warning(err.message)
      })
    },
    downNode (data) {
      menu.DownNode(data).then(res => {
        if (res.data.state) {
          this.listAllMenu()
        } else {
          this.$message.warning(res.data.message)
        }
      }).catch(err => {
        this.$message.warning(err.message)
      })
    },
    save () {
      let validateRs = this.validateForm()
      if (!validateRs) {
        return
      }
      let params = {
        id: this.addAndEditForm.id,
        name: this.addAndEditForm.name,
        url: this.addAndEditForm.url,
        icon: this.addAndEditForm.icon,
        parentId: this.addAndEditForm.parentId,
        menuNo: this.addAndEditForm.menuNo
      }
      if (this.addAndEditForm.purl !== undefined) {
        params.url = this.addAndEditForm.purl + this.addAndEditForm.url
      }

      menu.AddOrEditNode(params).then(res => {
        if (res.data.state) {
          this.$message.success(res.data.message)
          this.addAndEditDialogVisible = false
          this.listAllMenu()
        } else {
          this.$message.warning(res.data.message)
        }
      }).catch(err => {
        this.$message.warning(err.message)
      })
    },
    validateOrderNum () {
      this.addAndEditForm.menuNo = this.addAndEditForm.menuNo.replace(/[^.\d]/g, null)
      this.addAndEditForm.menuNo = this.addAndEditForm.menuNo.replace('.', null)
    },
    validateForm () {
      if (this.addAndEditForm.name === '' || this.addAndEditForm.name === undefined) {
        this.$message.warning({
          message: '菜单名称不能为空！',
          center: true
        })
        this.$refs.name.focus()
        return false
      }

      if (this.addAndEditForm.url === '' || this.addAndEditForm.url === undefined) {
        this.$message.warning({
          message: 'url不能为空！',
          center: true
        })
        this.$refs.url.focus()
        return false
      }
      return true
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
.addAndEditForm-input {
  width: 65%;
}
</style>
