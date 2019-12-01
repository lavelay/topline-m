<template>
  <div class='container'>
    <van-nav-bar left-arrow
                 @click-left="$router.back()"
                 title="登录"></van-nav-bar>
    <van-cell-group>
      <van-field label="手机号"
                 v-model.trim="loginForm.mobile"
                 @blur="checkMobile"
                 :error-message="errForm.mobile"
                 placeholder="请输入手机号" />
      <van-field label="验证码"
                 v-model.trim="loginForm.code"
                 @blur="checkCode"
                 :error-message="errForm.code"
                 placeholder="请输入验证码">
        <van-button class="p5"
                    slot="button"
                    size="mini"
                    type="primary">
          发送验证码
        </van-button>
      </van-field>
    </van-cell-group>
    <div class="btn_box">
      <van-button type="info"
                  @click="login"
                  block
                  round>登 录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'

export default {
  name: 'user-login',
  data () {
    return {
      loginForm: {
        mobile: '',
        code: ''
      },
      errForm: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    ...mapMutations(['setUser']),
    async login () {
      this.checkMobile()
      this.checkCode()
      if (!this.errForm.code && !this.errForm.mobile) {
        try {
          const data = await login(this.loginForm)
          this.setUser(data)
          this.$router.push(this.$route.query.redirectUrl || '/user')
          this.$toast.success('登陆成功')
        } catch (e) {
          this.$toast.fail('用户名或密码错误')
        }
      }
    },
    checkMobile () {
      if (!this.loginForm.mobile) {
        this.errForm.mobile = '请输入手机号'
        return false
      }
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errForm.mobile = '格式不正确'
        return false
      }
      this.errForm.mobile = ''
    },
    checkCode () {
      if (!this.loginForm.code) {
        this.errForm.code = '请输入验证码'
        return false
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errForm.code = '为6位数字'
        return false
      }
      this.errForm.code = ''
    }
  }
}
</script>

<style scoped lang='less'>
.p5 {
  padding: 0 5px;
}
.btn_box {
  padding: 10px;
  .van-button {
    height: 32px;
    line-height: 30px;
  }
}
</style>
