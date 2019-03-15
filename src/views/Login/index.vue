<template>
  <div class="login">
    <div class="login_header">
      <img class="logo" src="../../assets/images/policelogo.png">
      <h2 class="title">通讯软件危险侦查系统</h2>
    </div>
    <div class="login_container">
      <div class="login_qrcode_box">
        <img :src="qrCodeSrc" >
        <h2 @click="clickFn">{{ qrCodeMessage }}</h2>
      </div>
    </div>
    <div class="copyright">
      <span>提升政府治理能力国家工程实验室 ©️ 2018 - 2019</span>
      <img src="../../assets/images/logo.png">
    </div>
  </div>
</template>

<script>
let timer
export default {
  name: 'login',
  data () {
    return {
      mobile: '',
      password: '',
      qrCodeSrc: null,
      isLogin: false,
      checkLogin: false,
      qrCodeMessage: '使用手机微信扫码登录',
      initCount: 0
    }
  },
  created () {
    this.$store.commit('CLEAR_UIN')
    this.getQrcode()
  },
  methods: {
    async getQrcode () {
      try {
        let data = await this.$store.dispatch('getQrcode')
        if (data && data.code === 200) {
          this.qrCodeSrc = `data:image/png;base64,${data.data.qrcode}`
          timer = setInterval(() => {
            this.initCount += 2
            if (this.initCount === 60) {
              clearInterval(timer)
              this.qrCodeMessage = '二维码过期，请刷新页面'
              return
            }
            if (!this.isLogin && !this.checkLogin) {
              this.checkLogin = true
              this.getLoginStatus()
            }
          }, 2000)
        }
      } catch (error) {

      }
    },
    async getLoginStatus () {
      try {
        let data = await this.$store.dispatch('getIsLogin')
        this.checkLogin = false
        if (data.code === 200) {
          clearInterval(timer)
          this.qrCodeMessage = '登录成功'
          this.isLogin = true
          this.$router.push('/')
        } else if (data.code === 201) {
          this.qrCodeMessage = '请在手机上确认登录'
        } else if (data.code === 400) {
          // this.qrCodeMessage = '请在手机上确认登录'
        } else {
          this.qrCodeMessage = '登录超时，请重新获取二维码'
        }
      } catch (error) {

      }
    },
    clickFn () {
      this.getLoginStatus()
    }
  }
}
</script>

<style lang="scss" scoped>
.login{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("../../assets/images/loginbg.jpg");
  background-size: cover;
  padding: 20px 30px;
  .login_header{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: fixed;
    top: 20px;
    left: 20px;
    img{
      width: 45px;
      height: 50px;
      margin-right: 12px;
    }
    h2{
      color: #E4BF47;
    }
  }
  .login_container{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 999;
    .login_qrcode_box{
      width: 300px;
      height: 390px;
      background-color: #eeeeee;
      box-shadow: 0 0 5px 6px rgba(0, 0, 0, .3);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: column;
      padding: 50px 0;
      img{
        width: 200px;
        height: 200px;
        background-color: #d8d8d8;
      }
      h2{
        font-size: 18px;
        color: #333;
        font-weight: normal;
      }
    }
  }
  .copyright{
    position: fixed;
    right: 20px;
    bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    img{
      width: 30px;
      height: 30px;
      margin-left: 10px;
    }
    span{
      font-size: 12px;
      color: #fff;
    }
  }
}
</style>

