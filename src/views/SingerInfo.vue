<template>
  <div class="singerinfo-container">

    <div class="top">
      <!-- 顶部卡片 -->
      <el-card :body-style="{ padding: '0px' }">
        <img :src="singer.artist.cover" class="image">
        <div style="padding: 14px;" class="info">
          <h1>{{ singer.artist.name }}</h1>
          <img :src="singer.identify.imageUrl" :title="singer.identify.imageDesc" class="icon">
          <div class="rank" v-if="singer.artist.rank">Rank：{{ singer.artist.rank.rank }}</div>
          <div class="gender">性别：{{ singer.user.gender }}</div>
          <div class="birthday">生日：不详</div>
          <div class="province">省份：暂无</div>
          <div class="city">城市：暂无</div>
          <div class="reg">注册时间：{{ singer.user.createTime }}</div>
          <div class="bottom clearfix">
            <time class="briefDesc">个人介绍：{{ singer.artist.briefDesc }}</time>
          </div>
        </div>
      </el-card>

      <el-menu :default-active="'1'" active-text-color="#23aaf2" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1" @click="hotmusic">热门歌曲(50)</el-menu-item>
        <el-menu-item index="2" @click="allmusic">全部歌曲(按时间排序)</el-menu-item>
      </el-menu>

      <el-table :data="musicList" style="width: 100%">
        <el-table-column label="歌名" width="250px">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
            <!-- mv的图标 -->
            <span v-if="scope.row.mv != 0" class="iconfont icon-mv" @click="toMv(scope.row.mv)" style="color: red;margin-left: 5px;"></span>
          </template>
        </el-table-column>
        <el-table-column label="专辑" width="400px">
          <template slot-scope="scope">{{ scope.row.al.name }}</template>
        </el-table-column>
        <el-table-column label="播放">
          <template slot-scope="scope"><i class="el-icon-video-play" style="font-size: 20px; cursor: pointer;" @click="play(scope.row.id)"></i></template>
        </el-table-column>
      </el-table>
      <!-- 分页符 -->
      <el-pagination v-show="isshow" @current-change="handleCurrentChange" :background="true" layout="prev, pager, next" :current-page="page" :total="total" :limit="limit">
      </el-pagination>
    </div>

    <!-- 相似歌手 -->
    <div class="simi">
      <span class="title">相似歌手</span>
      <div v-if="simisinger.length == 0" style="margin-top: 50px;">暂无相似歌手</div>
      <div class="item" v-else>
        <div class="info" v-for="item in simisinger" :key="item.id" @click="toself(item.id)">
          <el-image :src="item.picUrl" lazy class="image"></el-image>
          <span class="singername">{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SingerInfo',
  data () {
    return {
      // 分页
      page: 1,
      limit: 20,
      total: 0,
      // 歌手详情
      singer: {
        artist: {
          cover: '',
          rank: {
            rank: ''
          }
        },
        identify: {},
        user: {
          createTime: '',
          gender: 0
        }
      },
      // 相似歌手
      simisinger: [],
      // 热门歌曲
      musicList: [],
      isshow: false
    }
  },
  created () {
    this.getSingerInfo()
    this.simi()
    this.hotmusic()
  },
  methods: {
    async getSingerInfo () {
      const { data: res } = await this.$axios.get('/api/artist/detail', {
        params: {
          id: this.$route.query.q
        }
      })
      if (res.data.user === undefined) {
        return this.$message.error('获取歌手信息失败')
      }
      this.singer = res.data
      this.singer.user.createTime = this.$dayjs(res.data.user.createTime).format('YYYY-MM-DD HH:mm:ss')
      switch (res.data.user.gender) {
        case 0:
          res.data.user.gender = '保密'
          break
        case 1:
          res.data.user.gender = '男'
          break
        case 2:
          res.data.user.gender = '女'
          break
      }
    },
    // 相似歌手
    async simi () {
      const { data: res } = await this.$axios.get('/api/simi/artist', {
        params: {
          id: this.$route.query.q
        }
      })
      this.simisinger = res.artists
    },
    // 热门音乐
    async hotmusic () {
      this.isshow = false
      const { data: res } = await this.$axios.get('/api/artist/top/song', {
        params: {
          id: this.$route.query.q
        }
      })
      this.musicList = res.songs
    },
    // 全部音乐
    async allmusic () {
      this.isshow = true
      const { data: restwo } = await this.$axios.get('/api/artist/songs', {
        params: {
          id: this.$route.query.q
        }
      })
      this.total = restwo.songs.length
      const { data: resone } = await this.$axios.get('/api/artist/songs', {
        params: {
          id: this.$route.query.q,
          limit: this.limit,
          order: 'time',
          offset: (this.page - 1) * this.limit
        }
      })
      this.musicList = resone.songs
    },
    // 相关歌手
    toself (id) {
      this.$router.push(`/home/singerinfo?q=${id}`)
      this.getSingerInfo()
      this.simi()
      this.hotmusic()
    },
    // 分页
    handleCurrentChange (val) {
      this.page = val
      this.allmusic()
    },
    async play (id) {
      this.$store.commit('playMusic')
      this.$store.state.mid = id
    },
    toMv (id) {
      this.$router.push(`/home/mv?q=${id}`)
    }
  }
}
</script>

<style lang="css" scoped>
.briefDesc {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 5px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}
</style>
