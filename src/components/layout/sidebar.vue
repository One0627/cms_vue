<template>
  <el-menu :unique-opened='true' :router="false" text-color="#ffffff" active-text-color="#cccccc" collapse-transition :collapse="isCollapse">
    <sideItem :node="node" :key="node.path" v-for="node in nodes" />
  </el-menu>
</template>
<script>
import sideItem from '@/components/layout/side-item.vue'
export default {
  name: 'sidebar',
  props: {
    nodes: {
      required: true
    },
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  components: {
    sideItem
  },
  methods: {
  }
}
</script>
