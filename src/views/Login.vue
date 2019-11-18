<template>
  <div class="login">
    <div class="logo">
      <img src="" alt="">
      <span>海纳惠捷商务TTS管理系统</span>
    </div>
    <div class="login-input">
      <el-form :model="UserInfo" status-icon :rules="rules" ref="loginForm" class="demo-ruleForm">
        <el-form-item prop="userNo">
          <el-input v-model="UserInfo.userNo" clearable placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input show-password v-model="UserInfo.passWord" autocomplete="off" @keyup.enter.native="onLogin" placeholder="密码" clearable></el-input>
        </el-form-item>
        <el-form-item label="记住密码">
          <el-switch v-model="remember"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onLogin" :loading="loading">{{loginStr}}</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="resetForm('loginForm')">重置</el-button>
        </el-form-item> -->
      </el-form>
      <p class='register'>还没有账号？联系管理员</p>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { Base64 } from 'js-base64'
export default {
  name: 'login',
  components: {
  },
  created () {
    if (localStorage.getItem('remember')) {
      let UserInfo = JSON.parse(Base64.decode(localStorage.getItem('UserInfo')))
      this.UserInfo.userNo = UserInfo.userNo // localStorage.getItem('UserInfo')
      this.UserInfo.passWord = UserInfo.passWord // localStorage.getItem('UserInfo')
      this.remember = true
    }
    // localStorage.clear()
  },
  computed: {
    ...mapGetters([])
  },
  data () {
    // userNo 验证
    const validateuserNo = (rule, value, callback) => {
      if (!/^[A-Za-z0-9]+$/.test(value)) {
        callback(new Error('请输入由英文数字组成的用户名'))
      } else {
        callback()
      }
    }
    // pwd 验证
    const validatePwd = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    return {
      loginStr: '登录',
      UserInfo: {
        userNo: '',
        passWord: ''
      },
      loading: false,
      remember: false,
      rules: {
        userNo: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { required: true, trigger: 'blur', validator: validateuserNo },
          { required: true, trigger: 'change', validator: validateuserNo }
        ],
        passWord: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { required: true, trigger: 'blur', validator: validatePwd },
          { required: true, trigger: 'change', validator: validatePwd }
        ]
      }
    }
  },
  methods: {
    ...mapActions([
      'login'
    ]),
    onLogin () {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          this.loading = true
          this.loginStr = '登陆中...'
          this.login(this.UserInfo).then(res => {
            if (res.result) {
              if (this.remember) {
                localStorage.setItem('remember', this.remember)
                localStorage.setItem('UserInfo', Base64.encode(JSON.stringify(this.UserInfo)))
              } else {
                localStorage.clear()
              }
              this.$message.success(res.message) // 登录成功的提示
              this.$router.push('main')
            } else {
              this.$message.warning(res.message)
              this.loginStr = '重新登录'
            }
          }).catch(res => {
            this.$message.warning(res.message)
            this.loginStr = '重新登录'
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang='scss'>
.login {
  width: 100%;
  height: 100%;
  background: rgb(48, 49, 62);
  background-image: url("~@/assets/bg.jpg");
  background-repeat: no-repeat;
  background-position: center top;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  .logo {
    color: rgb(3, 174, 189);
    font-size: 30px;
    // font-style: italic;
    font-weight: bold;
    margin-bottom: 20px;
    img {
      width: 74px;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
  .login-input {
    width: 260px;
    padding: 10px;
    margin-top: 10px;
    .el-input {
      // margin-bottom: 20px;
      .el-input__inner {
        border-radius: 30px !important;
        text-align: center;
      }
    }
    .el-button {
      border-radius: 30px !important;
      width: 260px;
      background: rgb(3, 174, 189);
      color: #fff;
      border: 0;
    }
    .register {
      text-align: right;
      margin: 10px;
      a {
        color: #fff;
      }
    }
  }
}
</style>+
