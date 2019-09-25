<template>
  <div>
    <el-table :data="tableData" height="680" border style="width: 100%">
      <el-table-column v-for="item in tableConfig.head" :prop="item.value" :key="item.value" :formatter="format" :label="item.title" :sortable="item.sort">
      </el-table-column>
      <el-table-column label="操作" width="300">
        <!-- <template slot-scope="scope">
          <el-button size="mini" v-show="$store.getters.CurrentState('user', 'UserInfo').update" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" v-show="$store.getters.CurrentState('user', 'UserInfo').delete" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template> -->
        <!-- <component :is="tableConfig.operation"></component> -->
        <component :is="this.tableConfig.operation"></component>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
const c = {
  template: `
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
        `
}
export default {
  name: 'tables',
  created () {
    console.log(this.tableConfig.operation)
  },
  components: {
    'operation': c.template
  },
  props: {
    tableConfig: {
      required: true
    },
    tableData: {
      required: true
    },
    formatMethod: {
      type: Function
    }
  },
  data () {
    return {

    }
  },
  methods: {
    format (row, column) {
      let col = this.formatMethod(row, column)
      if (col === undefined) {
        return row[column.property]
      }
      return col
    },
    handleEdit (index, row) {
      this.$emit('handleEdit', index, row)
    },
    handleDelete (index, row) {
      this.$emit('handleDelete', index, row)
    }
  }
}
</script>
