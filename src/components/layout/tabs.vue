<template>
  <el-tabs v-model="editableTabsValue" type="card" @tab-remove="removeTab" @jump='addTab'>
    <el-tab-pane :key="item.name" v-for="(item) in editableTabs" :label="item.title" :closable="item.isClose" :name="item.name" style="height:800px;width: 100%;">
      <el-scrollbar style="height: 100%;width: 100%;">
        <keep-alive>
          <component :is="item.content"></component>
        </keep-alive>
      </el-scrollbar>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Main from '@/views/Main.vue'
import utils from '@/utils/utils' // 组件间通信实例
import { mapActions, mapGetters } from 'vuex'
export default {
  created () {
  },
  components: {
    Main
  },
  computed: {
    ...mapGetters([
    ])
  },
  data () {
    return {
      editableTabsValue: '/Main',
      editableTabs: [{
        title: '系统首页',
        name: '/Main',
        content: Main,
        isClose: false
      }]
    }
  },
  mounted () {
    var that = this // 指定当前实例
    utils.$on('jump', function (targetName, key) {
      that.addTab(targetName, key)
    })
  },
  methods: {
    ...mapActions([]),
    addTab (targetName, key) {
      let res = true
      this.editableTabs.forEach(item => {
        if (item.name === key) {
          res = false
        }
      })
      if (res) {
        try {
          let Acomponent = resolve => require(['@/views/' + key + '.vue'], resolve)
          this.editableTabs.push({
            title: targetName,
            name: key,
            content: Acomponent,
            isClose: true
          })
        } catch (error) {
          console.log(error)
        }
      }
      this.editableTabsValue = key
    },
    removeTab (targetName, name) {
      let tabs = this.editableTabs
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }
      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter(tab => tab.name !== targetName)
    }
  },
  watch: {
    // 'model': function (newval, oldval) { }
  }
}
</script>
<style lang="less">
.el-tab-pane {
  .el-scrollbar__wrap {
    //禁止横向滚动条的出现
    overflow-x: hidden;
  }
}
</style>
