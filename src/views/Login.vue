<template>
  <el-container class="login-container">
    <el-card class="card">
      <el-row type="flex" class="row-bg" justify="center">
        <el-form :rules="rules" :model="UserInfo" status-icon ref="loginForm" label-width="100px">
          <el-form-item label="账号" prop="userNo">
            <el-input type="text" v-model="UserInfo.userNo" ref="userNo" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="passWord">
            <el-input type="passWord" v-model="UserInfo.passWord" @keyup.enter.native="onLogin" ref="passWord" clearable></el-input>
          </el-form-item>
          <el-form-item label="记住密码">
            <el-switch v-model="remember"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onLogin" v-loading.fullscreen.lock="loading" element-loading-text="Login...">登录</el-button>
            <el-button @click="resetForm('loginForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-card>
  </el-container>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { Base64 } from 'js-base64'
export default {
  name: 'login',
  created () {
    if (localStorage.getItem('remember')) {
      let UserInfo = Base64.decode(localStorage.getItem('UserInfo'))
      this.UserInfo.userNo = UserInfo.userNo // localStorage.getItem('UserInfo')
      this.UserInfo.passWord = UserInfo.passWord // localStorage.getItem('UserInfo')
      this.remember = true
    }
    localStorage.clear()
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
          this.login(this.UserInfo).then(res => {
            if (res.result) {
              if (this.remember) {
                localStorage.setItem('remember', this.remember)
                localStorage.setItem('UserInfo', Base64.encode(this.UserInfo))
              } else {
                localStorage.removeItem('remember')
                localStorage.removeItem('UserInfo')
              }
              this.$message.success(res.message) // 登录成功的提示
              this.$router.push('main')
            } else {
              this.$message.warning(res.message)
            }
            this.loading = false
          }).catch(res => {
            this.$message.warning(res.message)
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
<style scoped >
.login-container {
  justify-content: center;
  align-items: center;
}
</style>
