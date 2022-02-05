<template>
  <div class="mv-container">
    <div class="mv-wrap">
      <h3 class="title">mv详情</h3>
      <!-- mv -->
      <div class="video-wrap">
        <video controls autoplay :src="url"></video>
      </div>

      <!-- mv信息 -->
      <div class="info-wrap">
        <div class="singer-info">
          <div class="avatar-wrap">
            <!-- 头像 -->
            <img :src="icon" alt="" />
          </div>
          <!-- 歌手名 -->
          <span class="name">{{ mvInfo.artistName }}</span>
        </div>
        <div class="mv-info">
          <h2 class="title">{{ mvInfo.name }}</h2>
          <span class="date">发布：2014-11-04</span>
          <!-- 播放次数 -->
          <span class="number">播放：{{ mvInfo.playCount }}次</span>
          <!-- 描述 -->
          <p class="desc">
            {{ mvInfo.desc }}
          </p>
        </div>
      </div>

      <!-- 精彩评论 -->
      <div class="comment-wrap">
        <!-- 用户评论发布功能 -->
        <div class="userComment">
          <el-input class="comm" type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea">
          </el-input>
          <div>
            <el-button class="btn" type="primary" icon="el-icon-edit" @click="sendComment()">发表</el-button>
          </div>
        </div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="精彩评论" name="first">
            <!-- 精彩评论 -->
            <div class="comments-wrap">
              <div class="item" v-for="item in hotComment" :key="item.id">
                <div class="icon-wrap">
                  <img :src="item.user.avatarUrl" alt="" />
                </div>
                <div class="content-wrap">
                  <div class="content">
                    <span class="name">{{ item.user.nickname }}: </span>
                    <span class="comment">{{ item.content }}</span>
                    <span class="likecount" @click="comeon(item.user.userId)"><i class="iconfont icon-dianzan"></i>&nbsp;{{ item.likedCount }}</span>
                  </div>
                  <div class="re-content" v-if="item.beReplied.length != 0">
                    <span class="name">{{ item.beReplied[0].user.nickname }}：</span>
                    <span class="comment">{{ item.beReplied[0].user.content }}</span>
                  </div>
                  <div class="date">{{ item.time }}</div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane :label="`最新评论 (${total})`" name="second">
            <!-- 最新评论 -->
            <div class="comments-wrap">
              <div class="item" v-for="item in comments" :key="item.id">
                <div class="icon-wrap">
                  <img :src="item.user.avatarUrl" alt="" />
                </div>
                <div class="content-wrap">
                  <div class="content">
                    <span class="name">{{ item.user.nickname }}：</span>
                    <span class="comment">{{ item.content }}</span>
                    <span class="likecount" @click="comeon(item.user.userId)"><i class="iconfont icon-dianzan"></i>&nbsp;{{ item.likedCount }}</span>
                  </div>
                  <div class="re-content" v-if="item.beReplied.length != 0">
                    <span class="name">{{ item.beReplied[0].user.nickname }}：</span>
                    <span class="comment">{{ item.beReplied[0].content }}</span>
                  </div>
                  <div class="date">{{ item.time }}</div>
                </div>
              </div>
            </div>
            <!-- 分页器 -->
            <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next" :total="total" :current-page="page" :page-size="5" :limit="limit">
            </el-pagination>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 相关MV -->
    <div class="mv-recommend">
      <h3 class="title">相关推荐</h3>
      <div class="mvs">
        <div class="items">
          <div class="item" v-for="item in simiMvs" :key="item.id">
            <div class="img-wrap">
              <img :src="item.cover" alt="" />
              <span class="iconfont icon-24gf-play" @click="playmv(item.id)"></span>
              <div class="num-wrap">
                <div class="iconfont icon-24gf-play"></div>
                <div class="num">{{ item.playCount }}</div>
              </div>
              <span class="time">{{ item.duration }}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{ item.name }}</div>
              <div class="singer">{{ item.artists.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mv',
  data () {
    return {
      activeName: 'first',
      activeIndex: '1',
      // 总条数
      total: 0,
      // 页码
      page: 1,
      // 页容量
      limit: 10,
      // mv地址
      url: '',
      // 相关的 mv
      simiMvs: [],
      // mv 的信息
      mvInfo: {},
      // 歌手头像
      icon: '',
      // 热门评论
      hotComment: [],
      // 热门评论的个数
      hotCount: 0,
      // 普通评论
      comments: [],
      // 评论内容
      textarea: '',
      type: 1
    }
  },
  created () {
    this.mvurl()
    this.simiMv()
    this.mvsInfo()
    // 获取最新评论
    this.getNewComment()
  },
  watch: {
    '$route.query.q' () {
      this.mvurl()
      this.simiMv()
      this.mvsInfo()
      // 获取最新评论
      this.getNewComment()
    }
  },
  methods: {
    async mvurl () {
      this.$api.mvurl(this.$route.query.q).then(val => {
        this.url = val
      })
    },
    async simiMv () {
      this.$api.simiMvs(this.$route.query.q).then(val => {
        this.simiMvs = val

        // 时间格式化
        for (let i = 0; i < this.simiMvs.length; i++) {
          const duration = this.simiMvs[i].duration
          // 毫秒 s/1000
          // 分 m/60
          // 秒 350 % 60
          let min = parseInt(duration / 1000 / 60)
          min = min < 10 ? '0' + min : min
          let sec = parseInt((duration / 1000) % 60)
          sec = sec < 10 ? '0' + sec : sec
          this.simiMvs[i].duration = `${min}:${sec}`
          this.simiMvs[i].playCount = parseInt(this.simiMvs[i].playCount / 10000) + '万'
        }
      })
    },
    async mvsInfo () {
      // 获取 mv 的信息
      this.$api.mvsInfo(this.$route.query.q).then(async val => {
        this.mvInfo = val
        if (this.mvInfo != null) {
        // 获取 歌手 信息
          const { data: resthree } = await this.$axios.get('/api/artists', {
            params: {
              id: val.artistId
            }
          })
          this.icon = resthree.artist.picUrl
        }
      })
    },
    // 获取评论
    async getNewComment () {
      this.$api.getMvNewComment(this.$route.query.q).then(val => {
        this.comments = val.comments
        this.total = val.total
        this.hotComment = val.hotComments
        // 普通评论时间格式化
        for (let i = 0; i < this.comments.length; i++) {
          this.comments[i].time = this.$dayjs(val.comments[i].time).format('YYYY-MM-DD HH:mm:ss')
        }
        // 热评评论时间格式化
        for (let i = 0; i < this.hotComment.length; i++) {
          this.hotComment[i].time = this.$dayjs(val.hotComments[i].time).format('YYYY-MM-DD HH:mm:ss')
        }
      })
    },
    // 发送评论
    async sendComment () {
      if (this.textarea === '') {
        return this.$message.warning('请填写字段')
      }
      const { data: resfour } = await this.$axios.get('/api/login/status')
      if (resfour.data.profile !== null && resfour.data.account !== null) {
        const confirmResult = await this.$confirm('您正在发送评论, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消发送')
        }

        this.$api.sendComment(this.$route.query.q, this.textarea, this.type).then(val => {
          if (val.code === 200) {
            this.getNewComment()
            this.textarea = ''
            this.$message.success('评论成功')
          } else {
            const h = this.$createElement
            this.$message({
              type: 'error',
              message: h('p', null, [
                h('span', null, `${val.data.dialog.title} `),
                h('span', { style: 'color: teal' }, val.data.dialog.subtitle)
              ])
            })
          }
        })
      } else {
        this.$message.info('请先登录')
      }
    },
    async handleCurrentChange (val) {
      // 保存页码
      this.page = val
      // 重新获取数据
      // 获取最新评论
      this.getNewComment()
    },
    async playmv (id) {
      // // 跳转并携带数据即可
      this.$router.push(`mv?q=${id}`)
    },
    // 点赞评论
    async comeon (id) {
      const { data: resfour } = await this.$axios.get('/api/login/status')
      if (resfour.data.profile !== null && resfour.data.account !== null) {
        const { data: res } = await this.$axios.get('/api/comment/like', {
          params: {
            id: this.$route.query.q,
            cid: id,
            type: 1,
            t: 1
          }
        })
        if (res.code === 200) {
          document.querySelector('.likecount').style.color = 'red'
          this.getNewComment()
          this.$message.info(res.msg)
        } else {
          document.querySelector('.likecount').style.color = '#c7c9cc'
          this.$message.error('点赞失败')
        }
      } else {
        this.$message.error('请先登录在进行评论')
      }
    }
  }
}
</script>

<style></style>
