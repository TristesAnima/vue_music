<template>
  <div class="toLogin-container">

    <div class="box" v-show="show">
      <el-tag class="toggle" @click="getewm(); show = !show">{{ show ? '扫码登陆' : '手机号登陆' }}</el-tag>
      <!-- <el-button class="toggle" @click="show = !show">{{ show ? '扫码登陆' : '手机号登陆' }}</el-button> -->
      <div class="img">
        <img src="@/assets/logo.png">
      </div>
      <div class="title">
        mxPlayer
      </div>
      <el-form label-width="80px">
        <div class="card">
          <el-form-item label="手机号:">
            <el-input v-model.trim="phone"></el-input>
          </el-form-item>
          <el-form-item label="密码:">
            <el-input v-model.trim="password" show-password></el-input>
          </el-form-item>
        </div>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form>
    </div>

    <div class="erweima" v-show="!show">
      <el-tag type="danger" class="toggle" @click="show = !show">{{ show ? '扫码登陆' : '手机号登陆' }}</el-tag>
      <img :src="erweima.qrimg">
      <div class="status">{{ statusText }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tologin',
  data () {
    return {
      phone: '',
      password: '',
      messageData: [],
      show: true,
      erweima: {},
      statusText: '',
      // 储存定时器
      timer: null
    }
  },
  watch: {
    statusText () {
      if (this.statusText === '授权登陆成功') {
        this.$message.success('登录成功')
        this.$router.push('/home')
        clearInterval(this.timer)
        this.timer = null
      }
    }
  },
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    login () {
      if (this.phone === '' && this.password === '') {
        this.$message.warning('账号或密码不能为空')
        return false
      } else {
        this.$axios({
          url: '/api/login/cellphone',
          method: 'post',
          data: {
            phone: this.phone,
            password: this.password
          }
        }).then(response => {
          if (response.data.code === 200) {
            this.messageData = response.data
            // 1.存储 token
            sessionStorage.setItem('token', this.messageData.token)
            this.$message.success('登录成功')
            this.$router.replace('/home')
          } else if (response.data.code === 509) {
            this.$message.error('密码次数超过限制')
            return false
          } else if (response.data.code === 502) {
            this.$message.error('账号或密码错误')
            return false
          }
        })
      }
    },
    reset () {
      this.phone = ''
      this.password = ''
    },
    // 二维码接口
    async getewm () {
      const { data: res } = await this.$axios.get('/api/login/qr/key')
      window.sessionStorage.setItem('unikey', res.data.unikey)
      // 获取图片
      if (res.data.unikey) {
        const { data: resone } = await this.$axios.get('/api/login/qr/create', {
          params: {
            key: res.data.unikey,
            qrimg: res.data.unikey
          }
        })
        this.erweima = resone.data

        this.timer = setInterval(async () => {
        // 获取二维码状态信息
          if (this.erweima) {
            const { data: restwo } = await this.$axios.get('/api/login/qr/check', {
              params: {
                key: window.sessionStorage.getItem('unikey')
              }
            })
            switch (restwo.code) {
              case 800:
                this.statusText = restwo.message
                break
              case 801:
                this.statusText = restwo.message
                break
              case 802:
                this.statusText = restwo.message
                break
              case 803:
                this.statusText = restwo.message
                break
            }
          }
        }, 2500)
      }
    }
  }
}
</script>

<style scoped>
</style>
