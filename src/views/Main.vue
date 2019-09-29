<template>
  <div>
    <el-row :gutter="10">
      <el-col :lg="3" :xl="2">
        <label>用户状态:{{state}}</label>
      </el-col>
      <el-col :lg="3" :xl="2">
        <div class="grid-content bg-purple">在线人数:{{OnlineNum}}</div>
      </el-col>
      <el-col :lg="3" :xl="2">
        <el-button type="primary" @click="connect">{{btnVal}}</el-button>
      </el-col>
    </el-row>
    <div class="web-im">
      <el-row :gutter="10">
        <el-col :lg="3" :xl="2">
          <div class="header im-title">聊天室</div>
        </el-col>
         <el-col :lg="3" :xl="2">
          <el-button @click="()=>{messageList=[]}">清屏</el-button>
        </el-col>
      </el-row>
      <el-scrollbar ref="scrollbar" style="height: 100%;">
        <div class="box-card">
          <div class="li" :key="item.id" v-for="item in messageList">
            <template v-if="item.type===1">
              <p class="join-tips">{{ getName(item.nickname)+':'+item.msg}}</p>
            </template>
            <template v-else>
              <div class="img">{{item.nickname}}</div>
              <p class="message-box">{{item.msg}}</p>
            </template>
          </div>
        </div>
      </el-scrollbar>
      <div class="footer im-input">
        <el-input type="text" class="handle-input" v-model="msg" @keyup.enter.native="send" placeholder="请输入内容"></el-input>
        <el-button type="success" @click="send">发送</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  created () {
    this.signal.off('ReceiveMsg')
    this.signal.on('ReceiveMsg', res => {
      this.messageList.push(res)
      setTimeout(() => { // 滚动条滑到最底部显示最新消息
        var container = this.$refs['scrollbar'].wrap
        container.scrollTop = container.scrollHeight
      }, 0)
    })
    this.signal.on('OnlineNum', res => {
      this.OnlineNum = res
    })
    this.signal.on('ChatStop', res => {
      this.connect()
    })
    this.signal.onclose(() => {
      this.ChangeState()
    })
  },
  computed: {
  },
  data () {
    return {
      state: '离线',
      btnVal: '断开',
      OnlineNum: 0,
      msg: '',
      messageList: []
    }
  },
  mounted () {
    this.signal.start().then(() => {
      this.ChangeState()
    })
  },
  methods: {
    connect () {
      if (this.signal.connectionState === 0) {
        this.signal.start().then(() => {
          this.ChangeState()
        })
      } else {
        this.signal.stop().then(() => {
          this.ChangeState()
        })
      }
    },
    ChangeState () {
      this.state = this.signal.connectionState === 1 ? '在线' : '离线'
      this.btnVal = this.signal.connectionState === 1 ? '断开' : '重连'
    },
    getName (name) {
      if (name === this.$store.getters.username) {
        return '我'
      }
      return name
    },
    send () {
      this.signal.invoke('SendMsg', this.msg).catch(err => console.error(err.toString()))
      this.msg = ''
    }
  },
  watch: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.handle-input {
  width: 180px;
  display: inline-block;
}
.box-card {
  width: 360px;
  height: 360px;
}
</style>
