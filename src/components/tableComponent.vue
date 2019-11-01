<template>
  <table class="mailTable" :style="styleObject" v-if="s_showByRow">
    <tr v-for="index in rowCount" :key="index">
      <td class="column">{{tableData[index*4-4].key}}</td>
      <td>{{tableData[index*4-4].value}}</td>
      <td class="column">{{tableData[index*4-3] !== undefined ? tableData[index*4-3].key : ''}}</td>
      <td>{{tableData[index*4-3] !== undefined ? tableData[index*4-3].value : ''}}</td>
      <td class="column">{{tableData[index*4-2] !== undefined ? tableData[index*4-2].key : ''}}</td>
      <td>{{tableData[index*4-2] !== undefined ? tableData[index*4-2].value : ''}}</td>
      <td class="column">{{tableData[index*4-1] !== undefined ? tableData[index*4-1].key : ''}}</td>
      <td>{{tableData[index*4-1] !== undefined ? tableData[index*4-1].value : ''}}</td>
    </tr>
  </table>
  <table class="mailTable" :style="styleObject" v-else>
    <tr v-for="index in rowCount" :key="index">
      <td class="column">{{tableData[index-1].key}}</td>
      <td>{{tableData[index-1].value}}</td>
      <td class="column">{{tableData[rowCount+index-1] !== undefined ? tableData[rowCount+index-1].key : ''}}</td>
      <td>{{tableData[rowCount+index-1] !== undefined ? tableData[rowCount+index-1].value : ''}}</td>
      <td class="column">{{tableData[rowCount*2+index-1] !== undefined ? tableData[rowCount*2+index-1].key : ''}}</td>
      <td>{{tableData[rowCount*2+index-1] !== undefined ? tableData[rowCount*2+index-1].value : ''}}</td>
      <td class="column">{{tableData[rowCount*3+index-1] !== undefined ? tableData[rowCount*3+index-1].key : ''}}</td>
      <td>{{tableData[rowCount*3+index-1] !== undefined ? tableData[rowCount*3+index-1].value : ''}}</td>
    </tr>
  </table>
</template>

<script>
export default {
  data () {
    return {
      styleObject: {},
      s_showByRow: true
    }
  },
  props: ['tableData', 'tableStyle', 'showByRow'],
  computed: {
    rowCount: function () {
      return Math.ceil(this.tableData.length / 4)
    }
  },
  created () {
    this.styleObject = this.tableStyle
    if (this.showByRow !== undefined) {
      this.s_showByRow = this.showByRow
    }
  }
}
</script>
<style scoped lang="less">
.mailTable,
.mailTable tr,
.mailTable tr td {
  border: 1px solid #e6eaee;
}
.mailTable {
  font-size: 12px;
  color: #71787e;
}
.mailTable tr td {
  border: 1px solid #e6eaee;
  width: 150px;
  height: 35px;
  line-height: 35px;
  box-sizing: border-box;
  padding: 0 10px;
}
.mailTable tr td.column {
  background-color: #eff3f6;
  color: #909399;
}
</style>
