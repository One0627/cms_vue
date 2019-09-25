<template>
  <el-row type="flex" v-loading="loading">
    <el-col :span="6" class="row-bg">
      <el-form :model="pwdInfo" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="登录名">
          <el-input type="text" v-model="pwdInfo.userNo" disabled></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input type="text" v-model="pwdInfo.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input type="text" v-model="pwdInfo.userTel" disabled></el-input>
        </el-form-item>
        <el-form-item label="使用状态">
          <el-input type="text" v-model="pwdInfo.state" disabled></el-input>
        </el-form-item>
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input type="password" v-model="pwdInfo.oldPwd" clearable></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input type="password" v-model="pwdInfo.newPwd" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPwd">
          <el-input type="password" v-model="pwdInfo.checkPwd" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  created () {
    this.pwdInfo.userNo = this.userno
    this.pwdInfo.userName = this.username
    this.pwdInfo.userTel = this.usertel
  },
  data () {
    const validatePwd = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value === this.pwdInfo.oldPwd) {
        callback(new Error('新密码不能和旧密码一致'))
      } else {
        if (this.pwdInfo.checkPwd !== '') {
          this.$refs.ruleForm.validateField('checkPwd')
        }
        validatePwd(rule, value, callback)
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.pwdInfo.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        validatePwd(rule, value, callback)
      }
    }
    return {
      pwdInfo: {
        userNo: '',
        userName: '',
        userTel: '',
        oldPwd: '',
        newPwd: '',
        checkPwd: '',
        state: '正常'
      },
      loading: false,
      rules: {
        newPwd: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPwd: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        oldPwd: [
          { validator: validatePwd, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'username',
      'userno',
      'usertel'
    ])
  },
  methods: {
    ...mapActions([
      'changePwd'
    ]),
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.pwdInfo.oldPwd = this.md5(this.pwdInfo.oldPwd)
          this.pwdInfo.newPwd = this.md5(this.pwdInfo.newPwd)
          this.changePwd(this.pwdInfo).then(res => {
            if (res) {
              this.$message.success('密码修改成功，请重新登录!')
            } else {
              this.$message.warning('密码修改失败，请重新尝试！')
            }
            this.loading = false
          }).catch(err => {
            this.$message.error(err.message)
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.row-bg {
  margin-left: 100px;
}
</style>
