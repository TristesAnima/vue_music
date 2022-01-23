<template>
  <div class="sendmsg-container">
    <div class="cardmsg">
      <div class="message">
        <!-- 对方 -->
        <div class="duifang">
          <div class="item" v-for="item in historymsg" :key="item.id">
            <el-avatar class="photo" :src="item.fromUser.avatarUrl"></el-avatar>
            <p class="time" style="display: inline-block; color: black;">{{ item.fromUser.nickname }}</p>
            <el-card class="box-card" :body-style="{padding: '5px'}">
              <p class="type" style="display: inline-block;">{{ JSON.parse(item.msg).title }}：</p>
              <p style="margin-bottom: 5px; display: inline-block;">{{ JSON.parse(item.msg).msg }}</p>
              <div class="main">
                <!-- 歌单 -->
                <img v-if="JSON.parse(item.msg).album" :src="JSON.parse(item.msg).album.picUrl" @click="toplaylist(JSON.parse(item.msg).album.id)">
                <!-- MV -->
                <img v-else-if="JSON.parse(item.msg).mv" :src="JSON.parse(item.msg).mv.imgurl" @click="tomv(JSON.parse(item.msg).mv.id)">
                <span v-if="JSON.parse(item.msg).mv" class="iconfont icon-play"></span>
                <!-- 专辑名称 -->
                <span v-if="JSON.parse(item.msg).album">{{ JSON.parse(item.msg).album.name }}</span>
                <p class="name">{{ item.fromUser.nickname }}</p>
              </div>
              <div class="bottom">
                <time class="time">{{ item.time }}</time>
              </div>
            </el-card>
          </div>
        </div>
        <!-- 自己 -->
        <div class="me">
          <div class="item">
            <el-avatar class="photo" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" style=" margin-left: calc(100% - 45px);"></el-avatar>
            <el-card class="box-card" style="text-align: right;">
              1231
            </el-card>
          </div>
        </div>
      </div>

      <el-divider></el-divider>

      <!-- 发送功能 -->
      <div class="sendmsg">
        <el-input class="text" type="textarea" :rows="4" placeholder="请输入内容" v-model="message">
        </el-input>
        <el-button type="primary" class="send" plain @click="sendmsg">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      historymsg: [],
      message: ''
    }
  },
  created () {
    this.getUserDeatail()
  },
  methods: {
    async getUserDeatail () {
      this.$api.getUserDeatail(this.$route.query.q).then(res => {
        if (res.code === 200) {
          this.historymsg = res.msgs
          for (let i = 0; i < res.msgs.length; i++) {
            this.historymsg[i].time = this.$dayjs(this.historymsg[i].time).format('MM-DD HH:mm:ss')
          }
          this.$message.success('获取信息成功')
        } else {
          this.$message.error('获取信息失败')
        }
      })
    },
    // 去歌单页面
    toplaylist (id) {
      // this.$router.push(`/home/playlist?q=${id}`)
      const h = this.$createElement
      this.$message({
        message: h('p', null, [
          h('span', null, '功能暂未开发 '),
          h('i', { style: 'color: teal' }, 'Element ui')
        ])
      })
    },
    tomv (id) {
      this.$router.push(`/home/mv?q=${id}`)
    },
    // 发信息
    async sendmsg () {
      const { data: res } = await this.$axios.post('/api/send/text', {
        data: {
          user_ids: this.$route.query.q,
          msg: this.message
        }
      })
      const h = this.$createElement
      this.$message({
        type: 'warning',
        message: h('p', null, [
          h('span', null, '错误请求 '),
          h('i', { style: 'color: teal' }, `${res.code}`)
        ])
      })
      this.message = ''
    }
  }
}
</script>

<style lang="css" scoped>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}
</style>
