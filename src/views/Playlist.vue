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
          <span class="iconfont icon-bofang"></span>
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
        <el-table :data="playlistAll" empty-text="Loading...." style="width: 100%" :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }" @row-click="playMusic">
          <el-table-column width="180">
            <template slot-scope="scope">
              <div class="plays-wrap">
                <img :src="scope.row.al.picUrl" alt="加载失败 尝试刷新吧!" style="width: 50px; height: 50px; border-radius: 5px" />
                <span class="iconfont icon-bofang"></span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="音乐标题" width="180">
            <template slot-scope="scope">
              {{ scope.row.name }}
              <span v-if="scope.row.mv != 0" class="iconfont icon-movie-line" @click.stop.prevent="toMv(scope.row.mv)" style="color: red; margin: 0 2px; display: inline-block; vertical-align: middle"></span>
              <span v-if="scope.row.fee === 1" class="span iconfont icon-VIP" style="color: red; font-size: 23px; display: inline-block; vertical-align: middle"></span>
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
          <el-table-column label="时长" prop="dt"> </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="评论" name="2">
        <!-- 用户评论发布功能 -->
        <div class="userComment">
          <el-input class="comm" type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea"> </el-input>
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
                      <span class="likecount" @click="comeon(item.user.userId)"><i class="iconfont icon-dianzan"></i>&nbsp;{{ item.likedCount }}</span>
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
import { time } from '../static/js/timeTool'
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
      limit: 25,
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
      textarea: '',
      // 类型
      type: 2
    }
  },
  async created () {
    this.$api.getPlayListsInfo(this.$route.query.q).then((val) => {
      this.playlist = val
      this.playlist.creator.avatarUrl = val.creator.avatarUrl
    })
    this.allMusic()
    // 获取最新评论
    this.getNewComment()
    this.gethotcomment()
  },
  methods: {
    allMusic () {
      // 全部歌曲
      this.$api.getAllMusic(this.$route.query.q, this.limit).then((val) => {
        this.playlistAll = val
        for (let i = 0; i < val.length; i++) {
          this.playlistAll[i].dt = time(val[i].dt)
        }
      })
    },
    // 播放音乐
    async playMusic (row) {
      this.$store.state.mid = row.id
      this.$store.commit('playMusic')
    },
    async gethotcomment () {
      this.$api.gethotcomment(this.$route.query.q).then((val) => {
        this.hotComment = val.hotComments
        this.hotCount = val.total
        // 热评评论时间格式化
        for (let i = 0; i < this.hotComment.length; i++) {
          this.hotComment[i].time = this.$dayjs(val.hotComments[i].time).format('YYYY-MM-DD HH:mm:ss')
        }
      })
    },
    // 获取最新评论
    async getNewComment () {
      this.$api.getNewComment(this.$route.query.q, this.page).then((val) => {
        // 总个数
        this.total = val.total
        // 评论数据
        this.comments = val.comments
        for (let i = 0; i < this.comments.length; i++) {
          this.comments[i].time = this.$dayjs(val.comments[i].time).format('YYYY-MM-DD HH:mm:ss')
        }
      })
    },
    async handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      // 保存页码
      this.page = val
      // 重新获取数据
      // 获取最新评论
      this.getNewComment()
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
        }).catch((err) => err)

        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消发送')
        }

        this.$api.sendComment(this.$route.query.q, this.textarea, this.type).then((val) => {
          if (val.code === 200) {
            this.getNewComment()
            this.textarea = ''
            this.$message.success('评论成功')
          } else {
            const h = this.$createElement
            this.$message({
              type: 'error',
              message: h('p', null, [h('span', null, `${val.data.dialog.title} `), h('span', { style: 'color: teal' }, val.data.dialog.subtitle)])
            })
          }
        })
      } else {
        this.$message.info('请先登录')
      }
    },
    // 点赞评论
    async comeon (id) {
      const { data: resfour } = await this.$axios.get('/api/login/status')
      if (resfour.data.profile !== null && resfour.data.account !== null) {
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
      } else {
        this.$message.error('请先登录在进行评论')
      }
    }
  }
}
</script>

<style></style>
