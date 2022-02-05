<template>
  <div class="discovery-container">
    <!-- 轮播图 -->
    <el-carousel :interval="4000" type="card">
      <!-- 循环获取到的接口数据 -->
      <el-carousel-item v-for="item in banners" :key="item.id">
        <img :src="item.imageUrl" alt="" />
      </el-carousel-item>
    </el-carousel>

    <!-- 推荐歌单 -->
    <div class="recommend">
      <h3 class="title">
        推荐歌单
      </h3>
      <div class="items">
        <div class="item" v-for="item in list" :key="item.id" @click="tuijiangedan(item.id)">
          <div class="img-wrap">
            <div class="desc-wrap">
              <span class="desc">{{ item.copy }}</span>
            </div>
            <img :src="item.picUrl" alt="" />
            <div class="num-wrap">
              <div class="num">{{ item.playCount }}</div>
              <div class="iconfont icon-24gf-play"></div>
            </div>
            <span class="iconfont icon-24gf-play"></span>
          </div>
          <p class="name">{{ item.name }}</p>
        </div>
      </div>
    </div>

    <!-- 推荐音乐 -->
    <div class="news">
      <h3 class="title">
        最新音乐
      </h3>
      <el-table :data="music" empty-text="Loading...." style="width: 100%" @row-click="playMusic">
        <el-table-column>
          <template slot-scope="scope">
            <div class="img-wrap">
              <el-image style="width: 100%; border-radius: 5px;" :src="scope.row.picUrl" lazy></el-image>
              <span class="iconfont icon-bofang"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="歌名" width="500">
        </el-table-column>
        <el-table-column label="歌手">
          <template slot-scope="scope">
            {{ scope.row.song.artists[0].name }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 推荐MV -->
    <div class="mvs">
      <h3 class="title">推荐MV</h3>
      <div class="items">
        <div class="item" v-for="item in mvs" :key="item.id" @click="tuijianmv(item.id)">
          <div class="img-wrap">
            <img :src="item.picUrl" alt="" />
            <span class="iconfont icon-24gf-play"></span>
            <div class="num-wrap">
              <div class="iconfont icon-24gf-play"></div>
              <div class="num">{{ item.playCount }}</div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="name">{{ item.name }}</div>
            <div class="singer">{{ item.artistName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'discovery',
  data () {
    return {
      // 轮播图
      banners: [],
      // 推荐歌单
      list: [],
      // 推荐音乐
      music: [],
      // 最新MV
      mvs: []
    }
  },
  async created () {
    // 轮播图接口
    this.$api.getBanners().then(response => {
      this.banners = response
    })
    // 推荐歌单接口
    this.$api.recommandLists().then(response => {
      this.list = response
      // 音乐的播放次数
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].playCount = parseInt(this.list[i].playCount / 10000) + '万'
      }
    })
    // 推荐音乐
    this.$api.recommandMusic().then(response => {
      this.music = response
    })
    // 最新mv
    this.$api.recommandMv().then(response => {
      this.mvs = response
    })
  },
  methods: {
    async playMusic (val) {
      this.$store.state.mid = val.id
      this.$store.commit('playMusic')
    },
    tuijiangedan (id) {
      // 跳转并携带数据即可
      this.$router.push(`/home/playlist?q=${id}`)
    },
    tuijianmv (id) {
      // 跳转并携带数据即可
      this.$router.push(`/home/mv?q=${id}`)
    }
  }
}
</script>

<style></style>
