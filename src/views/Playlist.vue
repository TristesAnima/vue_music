<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap">
        <!-- 封面 -->
        <img :src="playlist.coverImgUrl" alt="" />
      </div>
      <div class="info-wrap">
        <p class="title">{{ playlist.name }}</p>
        <div class="author-wrap">
          <!-- 头像 -->
          <img class="avatar" :src="playlist.creator.avatarUrl" alt="" />
          <span class="name">{{ playlist.creator.nickname }}</span>
          <span class="time">{{ playlist.createTime }}</span>
        </div>
        <div class="play-wrap">
          <span class="iconfont icon-circle-play"></span>
          <span class="text">播放全部</span>
        </div>
        <div class="tag-wrap">
          <span class="title">标签</span>
          <!-- 标签分类 -->
          <ul>
            <li v-for="item in playlist.tags" :key="item.id">{{ item }}</li>
          </ul>
        </div>
        <div class="desc-wrap">
          <span class="title">简介:</span>
          <span class="desc">{{ playlist.description }}</span>
        </div>
      </div>
    </div>

    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲列表" name="1">
        <el-table :data="playlistAll" empty-text="Loading...." style="width: 100%" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" @row-click="playMusic">
          <el-table-column width="180">
            <template slot-scope="scope">
              <img :src="scope.row.al.picUrl" alt="加载失败 尝试刷新吧!" style="width: 50px; height: 50px; border-radius: 5px">
            </template>
          </el-table-column>
          <el-table-column label="音乐标题" width="180">
            <template slot-scope="scope">
              {{ scope.row.name }}
              <span v-if="scope.row.mv != 0" class="iconfont icon-mv" @click.stop.prevent="toMv(scope.row.mv)" style="color: red;margin: 6px 0 0 5px;"></span>
            </template>
          </el-table-column>
          <el-table-column label="歌手">
            <template slot-scope="scope">
              {{ scope.row.ar[0].name }}
            </template>
          </el-table-column>
          <el-table-column label="专辑">
            <template slot-scope="scope">
              {{ scope.row.al.name }}
            </template>
          </el-table-column>
          <el-table-column label="时长">
            不详
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="评论" name="2">
        <!-- 用户评论发布功能 -->
        <div class="userComment">
          <el-input class="comm" type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea">
          </el-input>
          <div>
            <el-button class="btn" type="primary" icon="el-icon-edit" @click="sendComment()">发表</el-button>
          </div>
        </div>

        <el-tabs v-model="activeName">
          <el-tab-pane :label="`精彩评论 (${hotCount})`" name="first">
            <!-- 精彩评论 -->
            <div class="comment-wrap">
              <div class="comments-wrap">
                <div class="item" v-for="item in hotComment" :key="item.id">
                  <div class="icon-wrap">
                    <!-- 头像 -->
                    <img :src="item.user.avatarUrl" alt="" />
                  </div>
                  <div class="content-wrap">
                    <div class="content">
                      <!-- 昵称 -->
                      <span class="name">{{ item.user.nickname }}: </span>
                      <span class="comment">{{ item.content }}</span>
                      <span class="likecount" @click="comeon(item.user.userId)"><i class="el-icon-sugar"></i>&nbsp;{{ item.likedCount }}</span>
                    </div>
                    <div class="re-content" v-if="item.beReplied.length != 0">
                      <!-- 评论的回复 -->
                      <span class="name">{{ item.beReplied[0].user.nickname }}：</span>
                      <span class="comment">{{ item.beReplied[0].user.content }}</span>
                    </div>
                    <div class="date">{{ item.time }}</div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane :label="`最新评论 (${total})`" name="second">
            <!-- 最新评论 -->
            <div class="comment-wrap">
              <div class="comments-wrap">
                <div class="item" v-for="item in comments" :key="item.id">
                  <div class="icon-wrap">
                    <img :src="item.user.avatarUrl" alt="" />
                  </div>
                  <div class="content-wrap">
                    <div class="content">
                      <span class="name">{{ item.user.nickname }}：</span>
                      <span class="comment">{{ item.content }}</span>
                      <span class="likecount" @click="comeon(item.user.userId)"><i class="el-icon-sugar"></i>&nbsp;{{ item.likedCount }}</span>
                    </div>
                    <div class="re-content" v-if="item.beReplied.length != 0">
                      <span class="name">{{ item.beReplied[0].user.nickname }}：</span>
                      <span class="comment">{{ item.beReplied[0].content }}</span>
                    </div>
                    <div class="date">{{ item.time }}</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 分页器 -->
            <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next" :total="total" :current-page="page" :page-size="5"> </el-pagination>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'playlist',
  data () {
    return {
      activeName: 'first',
      activeIndex: '1',
      // 总条数
      total: 0,
      // 页码
      page: 1,
      // 歌单详情数据
      playlist: {
        creator: {
          avatarUrl: ''
        }
      },
      // 全部歌曲
      playlistAll: [],
      // 热门评论
      hotComment: [],
      // 热门评论的个数
      hotCount: 0,
      // 普通评论
      comments: [],
      // 发送的评论
      textarea: ''
    }
  },
  async created () {
    // 获取歌单详情
    const { data: res } = await this.$axios.get('/api/playlist/detail', {
      params: {
        id: this.$route.query.q
      }
    })
    this.playlist = res.playlist
    this.playlist.creator.avatarUrl = res.playlist.creator.avatarUrl

    // 全部歌曲
    const { data: ress } = await this.$axios.get('/api/playlist/track/all', {
      params: {
        id: this.$route.query.q
      }
    })
    this.playlistAll = ress.songs

    // 获取最新评论
    this.getNewComment()
    this.gethotcomment()
  },
  methods: {
    // 播放音乐
    async playMusic (row) {
      this.$store.state.mid = row.id
      this.$store.commit('playMusic')
    },
    async gethotcomment () {
      // 获取热评
      const { data: resone } = await this.$axios.get('/api/comment/hot', {
        params: {
          id: this.$route.query.q,
          // 传递类型
          type: 2
        }
      })
      this.hotComment = resone.hotComments
      this.hotCount = resone.total
      // 热评评论时间格式化
      for (let i = 0; i < this.hotComment.length; i++) {
        this.hotComment[i].time = this.$dayjs(resone.hotComments[i].time).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    // 获取最新评论
    async getNewComment () {
      const { data: restwo } = await this.$axios.get('/api/comment/playlist', {
        params: {
          id: this.$route.query.q,
          limit: 10,
          offset: (this.page - 1) * 10
        }
      })
      // 总个数
      this.total = restwo.total
      // 评论数据
      this.comments = restwo.comments
      for (let i = 0; i < this.comments.length; i++) {
        this.comments[i].time = this.$dayjs(restwo.comments[i].time).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    async handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      // 保存页码
      this.page = val
      // 重新获取数据
      // 获取最新评论
      const { data: restwo } = await this.$axios.get('/api/comment/playlist', {
        params: {
          id: this.$route.query.q,
          limit: 10,
          // 根据页码计算
          offset: (this.page - 1) * 10
        }
      })
      // console.log(restwo)
      // 总个数
      this.total = restwo.total
      // 评论数据
      this.comments = restwo.comments
      for (let i = 0; i < this.comments.length; i++) {
        this.comments[i].time = this.$dayjs(restwo.comments[i].time).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    toMv (id) {
      this.$router.push(`/home/mv?q=${id}`)
    },
    // 发送评论
    async sendComment () {
      if (this.textarea === '') {
        this.$message.warning('请填写字段')
        return false
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

        const { data: res } = await this.$axios.get('/api/comment?', {
          params: {
            t: 1,
            type: 2,
            id: this.$route.query.q,
            content: this.textarea
          }
        })
        if (res.code === 200) {
          // 在获取一遍最新评论数据 {此处直接调用方法评论不能实时显示 所以只能在请求一遍}
          this.getNewComment()
          this.textarea = ''
          this.$message.success('评论成功')
        } else {
          return this.$message.error('评论失败')
        }
      } else {
        this.$message.info('请先登录')
      }
    },
    // 点赞评论
    async comeon (id) {
      const { data: res } = await this.$axios.get('/api/comment/like', {
        params: {
          id: this.$route.query.q,
          cid: id,
          type: 2,
          t: 1
        }
      })
      if (res.code === 200) {
        document.querySelector('.likecount').style.color = 'red'
        this.getNewComment()
        this.gethotcomment()
        this.$message.info(res.msg)
      } else {
        document.querySelector('.likecount').style.color = '#c7c9cc'
        this.$message.error('点赞失败')
      }
    }
  }
}
</script>

<style></style>
