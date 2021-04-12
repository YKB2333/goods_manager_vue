<template>
  <div class="login-container">
    <img width="210px" class="mt30 ml30" :src="require('@/assets/images/zhongshang.png')" alt="">
    <div class="content-wrapper row center-y">
      <img class="flex-1" :src="require('@/assets/images/computer.png')" alt="">
      <div v-show="loginStatus == 1" class="login-form" >
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" auto-complete="on" label-position="left">
        <div class="title-container">
          <div class="title">{{ $config.projectName }}</div>
        </div>
        <el-form-item prop="username">
          <img :src="require('@/assets/images/user.png')" alt="">
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入登录账号"
            name="username"
            type="text"
            auto-complete="on"
          />
        </el-form-item>
        <el-form-item prop="password">
          <img :src="require('@/assets/images/password.png')" alt="">
          <el-input
            ref="password"
            name="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入登录密码"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <div>
          <span style="color:#3893FF;cursor: pointer;" class="fs16 fr pt10" @click="loginStatus=2;$refs['loginForm'].resetFields();">忘记密码？</span>
        </div>
        <el-button :loading="loading" type="primary" size="large" style="width:100%;border-radius:25px;margin-top:40px;padding:16px 0;font-size:20px;" @click.native.prevent="handleLogin">登录</el-button>
      </el-form>
      </div>

      <div v-show="loginStatus == 2" class="login-form" style="padding-top:60px;" >
        <el-form ref="vscodeForm" :model="vscodeForm" :rules="vscodeRules" auto-complete="on" label-position="left">
          <div class="title-container">
            <div style="margin-bottom:36px;" class="title">手机找回</div>
          </div>
          <el-form-item prop="mobile">
            <img :src="require('@/assets/images/user.png')" alt="">
            <el-input
              ref="mobile"
              v-model="vscodeForm.mobile"
              placeholder="请输入手机号"
              name="mobile"
              type="text"
              auto-complete="on"
            />
          </el-form-item>
          <el-form-item prop="code">
            <img :src="require('@/assets/images/pro.png')" alt="">
            <el-input
              class="pr100"
              ref="code"
              v-model="vscodeForm.code"
              placeholder="请输入验证码"
            />
            <span class="show-pwd mr30">
              <el-button :loading="vCodeBtnLoading" type="text" @click="sendFindPwdSms" :disabled="disabledVCodeBtn">{{ vCodeBtnText }}</el-button>
            </span>
          </el-form-item>
          <el-form-item prop="newPwd">
            <img :src="require('@/assets/images/password.png')" alt="">
            <el-input
              ref="newPwd"
              name="newPwd"
              v-model="vscodeForm.newPwd"
              placeholder="请输入新密码"
            />
          </el-form-item>
          <el-form-item prop="confirmPwd">
            <img :src="require('@/assets/images/password.png')" alt="">
            <el-input
              ref="confirmPwd"
              name="confirmPwd"
              v-model="vscodeForm.confirmPwd"
              placeholder="请再次输入新密码"
            />
          </el-form-item>
          <div>
          </div>
          <el-button :loading="submitMobilebtnLoading" type="primary" size="large" style="width:100%;border-radius:25px;margin-top:24px;padding:16px 0;font-size:20px;" @click.native.prevent="submit" >提交</el-button>
          <div style="color:#3893FF;" class="center-x mt20">
            <span style="cursor:pointer;" @click="loginStatus=1;$refs['vscodeForm'].resetFields();">去登录</span>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
let intervalTime = 60
import { Base64 } from 'js-base64'
// import CanvasNest from 'canvas-nest.js'
import { getUrlParam, checkEmail, checkMobile } from '@/utils'
export default {
  name: 'Login',
  components: {},
  data() {
    const rePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.vscodeForm.newPwd) {
        callback(new Error("两次密码不匹配"));
      } else {
        callback();
      }
    };
    const validatePhone = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('手机号码不能为空'))
      } else {
        if(!checkMobile(value)){
          callback(new Error('手机号码格式错误'))
        }else{
          callback()
        }
      }
    }
    return {
      vCodeTime: intervalTime, // 可以重新发送的时间间隔
      disabledVCodeBtn: false, // 禁用获取验证码按钮
      vCodeBtnText: '获取验证码', 
      vCodeInterval: null, // 验证码可以重新的获取定时器
      vCodeBtnLoading: false,
      loginStatus:1,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message:"用户名不能为空" }],
        password: [{ required: true, trigger: 'blur', message:"密码不能为空" }]
      },
      vscodeForm:{
        newPwd: '',
        confirmPwd: '',
        mobile: '', // 手机号码
        code: '', // 验证码
      },
      vscodeRules:{
        mobile: [{ required: true, trigger: 'blur', validator:validatePhone}],
        code:[{ required: true, trigger: 'blur',message: "验证码不能为空",  }],
        newPwd:[{ required: true, trigger: 'blur', message: "密码不能为空", }],
        confirmPwd:[{ required: true, trigger: 'blur', validator: rePassCheck }]
      },
      passwordType: 'password',
      loading: false,
      submitMobilebtnLoading:false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    },
    vCodeTime(val) {
      if (val === 0) {
        this.vCodeTime = intervalTime
        this.disabledVCodeBtn = false
        this.vCodeBtnText = '获取验证码'
        clearInterval(this.vCodeInterval)
      } 
    }
  },
  created() {

  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    sendFindPwdSms() {
      let mobile = this.vscodeForm.mobile.trim()
      if (mobile === '') {
        this.$message.warning('请输入手机号')
        return
      }
      if (!checkMobile(mobile)) {
        this.$message.warning('手机号码格式不正确')
        return
      }
      this.vCodeBtnLoading = true
      this.$put(`/account/sendFindPwdSms`, {mobile})
        .then(res => {
          this.$message.success('短信已发送，请注意查收!')
          this.disabledVCodeBtn = true
          this.vCodeBtnText = `${intervalTime}s`
          this.vCodeInterval = setInterval(() => {
            this.vCodeBtnText = `${this.vCodeTime}s`
            this.vCodeTime--
          }, 1000)
        }).finally(() => {
          this.vCodeBtnLoading = false
        })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          let account = this.loginForm.username
          let pwd = this.loginForm.password
          this.loading = true
          this.$store.dispatch('Login', { account, pwd })
            .then(() => {
              this.$message.success('登录成功')
              this.$router.push({ path: this.redirect || '/' })
            }).catch(() => {
            }).finally(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submit(){
      this.$refs.vscodeForm.validate(valid => {
        if (valid) {
          let code = this.vscodeForm.code
          let mobile = this.vscodeForm.mobile
          let newPwd = this.vscodeForm.newPwd
          this.submitMobilebtnLoading = true
        this.$post(`/account/verifyFindCodeAndModifyPwd`,{code: code,mobile: mobile,newPwd: this.$base64.encode(newPwd)})
          .then(res => {
              this.$alert('返回登录页', '密码重置成功', {
                confirmButtonText: '确定',
                showClose: false,
                callback: action => {
                  // this.$router.replace('/login')
                  location.reload()
                }
              })
            }).finally(() => {
              this.submitMobilebtnLoading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
      })
    }
  }
}
</script>

<style lang="scss">
  .login-container {
    .el-input {
      font-size: 18px;
      flex: 1;
      input {
        width: 96%;
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        color: #000;
        caret-color: #A9A9A9;
        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px #fff inset !important;
        }
      }
    }
    .el-form-item {
      border:2px solid rgba(238,238,238,1);
      border-radius:25px;
      padding-left: 10px;
      color: #A9A9A9;
      >div{
        display: flex;
        align-items: center;
      }
      img{
        width: 40px;
      }
    }
    .el-form-item:nth-child(1){
      margin-bottom: 30px;
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>

.login-container {
  overflow: hidden;
  background:#304156;
  height: 100%;
  width: 100%;
  position: relative;
  .content-wrapper{
    >img{
      width:80%;
      max-width: 800px;
    }
    @media screen and (max-width:960px){
      >img{
        display: none;
      }
      transform: translate(-50%, -50%);
      .login-form{
        margin-left: 0;
      }
    }
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-76%, -50%);
    height: 100%;
  }
  .login-form {
    transform:scale(0.9,0.9);
    margin-left: 10%;
    z-index: 999;
    padding: 80px 50px 100px;
    border-radius:20px;
    background-color: #fff;
    position: relative;
    width: 70%;
    min-width: 420px;
    max-width: 500px;
    max-height: 550px;
    height:80%;
    flex-shrink: 0;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 30px;
      color: #333333;
      margin-bottom: 69px;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size:18px;
      right: 0px;
      cursor: pointer;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 2px;
    font-size: 16px;
    color: #3594FF;
    cursor: pointer;
    user-select: none;
  }
}
</style>
