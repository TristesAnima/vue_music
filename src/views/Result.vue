<template>
  <div class="result-container">
    <el-tabs>

      <div class="title-wrap">
        <!-- 标题 -->
        <h2 class="title">{{ $route.query.q }}</h2>
        <span class="sub-title">找到 {{ count }} 个结果</span>
      </div>

      <el-tabs v-model="activeIndex">
        <el-tab-pane label="歌曲" name="songs">
          <el-table :data="songList" style="width: 100%" stripe :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" @row-click="playMusic">
            <el-table-column label="音乐标题">
              <template slot-scope="scope">
                <span class="span">{{ scope.row.name }}</span>
                <span v-if="scope.row.fee === 1" class="span iconfont icon-VIP" style="color: red; font-size: 23px;"></span>
                <span v-if="scope.row.mv != 0" class="span iconfont icon-movie-line" @click.stop.prevent="toMv(scope.row.mv)" style="color: red; font-size: 15px;"></span>
                <span v-if="scope.row.privilege.maxbr === 999000" class="span iconfont icon-wusunyinzhi" style="color: red; font-size: 28px;"></span>
              </template>
            </el-table-column>
            <el-table-column label="歌手">
              <template slot-scope="scope" v-if="scope.row.ar">
                <div @click.stop.prevent="tosingerInfo(scope.row.ar[0].id)">
                  {{ scope.row.ar[0].name }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="专辑">
              <template slot-scope="scope" v-if="scope.row.al">
                {{ scope.row.al.name }}
              </template>
            </el-table-column>
            <el-table-column prop="dt" label="时长">
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="歌单" name="lists">
          <div class="items">
            <div v-for="item in playlists" :key="item.id" class="item" @click="toPlaylist(item.id)">
              <div class="img-wrap">
                <div class="num-wrap">
                  播放量:
                  <span class="num">{{ item.playCount }}</span>
                </div>
                <img :src="item.coverImgUrl" alt="" />
                <span class="iconfont icon-24gf-play"></span>
              </div>
              <p class="name">{{ item.name }}</p>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="MV" name="mv">
          <div class="items mv">
            <div v-for="item in mv" :key="item.id" class="item" @click="toMV(item.id)">
              <div class="img-wrap">
                <!-- 封面 -->
                <img :src="item.cover" alt="" />
                <span class="iconfont icon-24gf-play"></span>
                <div class="num-wrap">
                  <div class="iconfont icon-24gf-play"></div>
                  <!-- 播放次数 -->
                  <div class="num">{{ item.playCount }}</div>
                </div>
                <!-- 持续时间 -->
                <span class="time">{{ item.duration }}</span>
              </div>
              <div class="info-wrap">
                <!-- mv名 -->
                <div class="name">{{ item.name }}</div>
                <!-- 歌手名 -->
                <div class="singer">{{ item.artistName }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="歌手" name="singer">
          <div class=" singer">
            <div class="item" v-for="item in singerList" :key="item.id" @click="tosingerInfo(item.id)">
              <el-avatar :size="100" :src="item.picUrl"></el-avatar>
              <span class="title" style="color: #268ff9;">{{ item.name }}</span>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="用户" name="user">
          <div class="users">
            <div class="item" v-for="item in users" :key="item.id">
              <el-avatar :size="100" :src="item.avatarUrl"></el-avatar>
              <span class="title" style="color: #268ff9;">{{ item.nickname }}</span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-tabs>
    <el-pagination @current-change="handleCurrentChange" :background="true" layout="prev, pager, next" :current-page="page" :total="count" :limit="limit">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'result',
  data () {
    return {
      // 网易云类型切换时改变的类型
      activeIndex: 'songs',
      // 保存 查询歌曲
      songList: [],
      // 保存歌单的字段
      playlists: [],
      // 保存mv的字段
      mv: [],
      // 保存歌手的字段
      singerList: [],
      // 保存用户字段
      users: [],
      // 搜索结果的总数
      count: 0,
      // 分页
      page: 1,
      limit: 15
    }
  },
  // 生命周期钩子 回调函数
  created () {
    this.searchresult()
  },
  // 侦听器
  watch: {
    activeIndex () {
      this.page = 1
      this.allclass()
    },
    // 页码改变再获取一次其他类
    page () {
      this.allclass()
    },
    // 监听搜索的值变化
    '$route.query.q' (val) {
      this.page = 1
      this.allclass()
    }
  },
  // 方法
  methods: {
    searchresult () {
      this.$api.searchres(this.$route.query.q, this.limit, this.page).then(val => {
        this.songList = val.songs
        this.$nextTick(() => {
          for (let i = 0; i < this.songList.length; i++) {
            let min = parseInt(this.songList[i].dt / 1000 / 60)
            let sec = parseInt((this.songList[i].dt / 1000) % 60)
            if (min < 10) {
              min = '0' + min
            }
            if (sec < 10) {
              sec = '0' + sec
            }
            this.songList[i].dt = min + ':' + sec
          }
        })
        // 保存总数
        this.count = val.songCount
      })
    },
    // 获取其他分类
    allclass () {
      let type = 1
      let limit = 10
      switch (this.activeIndex) {
        case 'songs':
          type = 1
          limit = 10
          break
        case 'lists':
          type = 1000
          limit = 20
          break
        case 'mv':
          type = 1004
          limit = 16
          break
        case 'singer':
          type = 100
          limit = 21
          break
        case 'user':
          type = 1002
          limit = 21
          break

        default:
          break
      }

      this.$axios({
        url: '/api/cloudsearch',
        method: 'get',
        params: {
          keywords: this.$route.query.q,
          type,
          // 获取的数据量
          limit,
          offset: (this.page - 1) * limit
        }
      }).then(res => {
        // 获取歌曲
        if (type === 1) {
          // 歌曲
          this.songList = res.data.result.songs
          // 计算歌曲时间
          for (let i = 0; i < this.songList.length; i++) {
            let min = parseInt(this.songList[i].dt / 1000 / 60)
            let sec = parseInt((this.songList[i].dt / 1000) % 60)
            if (min < 10) {
              min = '0' + min
            }
            if (sec < 10) {
              sec = '0' + sec
            }
            this.songList[i].dt = min + ':' + sec
          }
          // 保存总数
          this.count = res.data.result.songCount
        } else if (type === 1000) {
          // 获取歌单

          // 歌单的逻辑
          this.playlists = res.data.result.playlists
          // 总数
          this.count = res.data.result.playlistCount
          // 处理 播放次数
          for (let i = 0; i < this.playlists.length; i++) {
            if (this.playlists[i].playCount > 100000) {
              this.playlists[i].playCount = parseInt(this.playlists[i].playCount / 10000) + '万'
            }
          }
        } else if (type === 1004) {
          // 保存mv数据
          this.mv = res.data.result.mvs
          // 总数
          this.count = res.data.result.mvCount
          // 处理数据
          for (let i = 0; i < this.mv.length; i++) {
            // 时间
            let min = parseInt(this.mv[i].duration / 1000 / 60)
            let sec = parseInt((this.mv[i].duration / 1000) % 60)
            if (min < 10) {
              min = '0' + min
            }
            if (sec < 10) {
              sec = '0' + sec
            }
            this.mv[i].duration = min + ':' + sec

            // 播放次数
            if (this.mv[i].playCount > 100000) {
              this.mv[i].playCount = parseInt(this.mv[i].playCount / 10000) + '万'
            }
          }
        } else if (type === 100) {
          // 歌手
          if (res.data.result.artistCount === 0) {
            return this.$message.warning('暂无此歌手')
          }
          this.singerList = res.data.result.artists
          this.count = res.data.result.artistCount
        } else if (type === 1002) {
          // 用户
          if (res.data.result.userprofileCount === undefined) {
            return this.$message.warning('暂无用户')
          }
          this.users = res.data.result.userprofiles
          this.count = res.data.result.userprofileCount
        }
      })
      // 标签改变在获取一次列表数据
      this.searchresult()
    },
    toMv (id) {
      this.$router.push(`/home/mv?q=${id}`)
    },
    // 去 MV 页面
    toMV (id) {
      this.$router.push(`/home/mv?q=${id}`)
    },
    // 去歌单详情页
    toPlaylist (id) {
      // 跳转并携带数据即可
      this.$router.push(`/home/playlist?q=${id}`)
    },
    playMusic (row) {
      this.$store.state.mid = row.id
      this.$store.commit('playMusic')
    },
    // 去歌手详情页
    tosingerInfo (id) {
      this.$router.push(`/home/singerinfo?q=${id}`)
    },
    // 分页
    handleCurrentChange (val) {
      this.page = val
      this.searchresult()
    }
  }
}
</script>

<style></style>
