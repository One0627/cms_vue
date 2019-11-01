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
    <el-upload class="upload-demo" ref="upload" :action="this.BASE_URL+'/Test/UploadFile'" :headers="{Authorization:'Bearer '+$store.getters.token}" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false" accept="image/*" list-type="picture" multiple>
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <el-button size="small" type="primary" @click="excelExport">excel导出</el-button>
    <div class="pull-right">
      <el-upload class="upload-demo" ref="upload1" :action="this.BASE_URL + '/Test/ImportExcel'" accept=".xls,.xlsx" :auto-upload="true" :file-list="fileList" :before-upload="beforeUpload">
        <el-button slot="trigger" size="small" type="primary" style="margin-right:20px">上传excel</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过5mb</div>
      </el-upload>
    </div>
  </div>
</template>
<script>
import excel from '@/api/excel'
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
      btnVal: '重连',
      OnlineNum: 0,
      msg: '',
      messageList: [],
      fileList: []
    }
  },
  mounted () {
    this.signal.start().then(() => {
      this.ChangeState()
    })
  },
  methods: {
    beforeUpload (file) {
      // console.log(file,'文件');
      this.files = file
      const extension = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!extension && !extension2) {
        this.$message.warning('上传模板只能是 xls、xlsx格式!')
        return false
      }
      if (!isLt5M) {
        this.$message.warning('上传模板大小不能超过 5MB!')
        return false
      }
      this.fileName = file.name
      /* setTimeout(() => {
        // this.submitUpload1()
        return true
      }, 500)
      return false // 返回false不会自动上传 */
    },

    // 上传excel
    submitUpload1 () {
      console.log('上传' + this.files.name)
      if (this.fileName === '') {
        this.$message.warning('请选择要上传的文件！')
        return false
      }
      let fileFormData = new FormData()
      fileFormData.append('code', 't_pathology_info_excel')
      fileFormData.append('description', 'excel上传测试')
      // filename是键，file是值，就是要传的文件，test是要传的文件名
      fileFormData.append('files', this.files, this.fileName)
      let requestConfig = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      // 执行上传excel
      this.axios.post(this.BASE_URL + '/Test/ImportExcel', fileFormData, requestConfig).then(resp => {
        if (resp.data.status !== 200) {
          this.$message.error('excel上传失败，请重新上传')
        } else {
          this.$message.success('excel上传成功')
        }
      }).catch((e) => {
        // console.log(e);
        this.$message.error('excel上传失败，请重新上传')
      }).finally()
    },
    excelExport () {
      excel.export().then(res => {
        var blob = new Blob([res.data], {
          type: 'application/vnd.ms-excel;charset=utf-8'
        })
        // 针对于IE浏览器的处理, 因部分IE浏览器不支持createObjectURL
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, res.fileName)
        } else {
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download = res.fileName // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
        }
      })
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    handleRemove (file, fileList) {
      console.log(fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
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
