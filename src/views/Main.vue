<template>
  <div>
    <el-button type="primary" @click="get">{{number}}</el-button>
    <iframe src="http://www.baidu.com" width="100%" height="100%" frameborder="0" scrolling="auto" style="position:absolute;"></iframe>
  </div>
</template>
<script>
export default {
  name: '',
  data () {
    return {
      number: 0
    }
  },
  methods: {
    get () {
      console.log(this.number = this.signal.connectionState)
      if (this.signal.connectionState === 0) {
        this.signal.start()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
