<template>
  <div class="playlists-container">
    <div class="top-card">
      <el-card :body-style="{ padding: '10px' }">
        <img :src="topList.coverImgUrl" class="image">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
        <div class="info-wrap">
          <el-tag type="danger">精品歌单</el-tag>
          <h3>{{ topList.name }}</h3>
          <div class="description">{{ topList.description }}</div>
        </div>
      </el-card>
    </div>

    <!-- tab栏 顶部 -->
    <div class="tab-container">
      <el-menu :default-active="'全部'" active-text-color="#23aaf2" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="全部" @click="tag = '全部'">全部</el-menu-item>
        <el-menu-item index="欧美" @click="tag = '欧美'">欧美</el-menu-item>
        <el-menu-item index="华语" @click="tag = '华语'">华语</el-menu-item>
        <el-menu-item index="流行" @click="tag = '流行'">流行</el-menu-item>
        <el-menu-item index="说唱" @click="tag = '说唱'">说唱</el-menu-item>
        <el-menu-item index="摇滚" @click="tag = '摇滚'">摇滚</el-menu-item>
        <el-menu-item index="民谣" @click="tag = '民谣'">民谣</el-menu-item>
        <el-menu-item index="电子" @click="tag = '电子'">电子</el-menu-item>
        <el-menu-item index="轻音乐" @click="tag = '轻音乐'">轻音乐</el-menu-item>
        <el-menu-item index="影视原声" @click="tag = '影视原声'">影视原声</el-menu-item>
        <el-menu-item index="ACG" @click="tag = 'ACG'">ACG</el-menu-item>
        <el-menu-item index="怀旧" @click="tag = '怀旧'">怀旧</el-menu-item>
        <el-menu-item index="治愈" @click="tag = '治愈'">治愈</el-menu-item>
        <el-menu-item index="旅行" @click="tag = '旅行'">旅行</el-menu-item>
      </el-menu>

      <!-- tab的内容区域 -->
      <div class="tab-content">
        <div class="items">
          <div class="item" v-for="item in list" :key="item.id" @click="tuijiangedan(item.id)">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{ item.playCount }}</span>
              </div>
              <img :src="item.coverImgUrl" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页器  total总条数  current-page当前页数  page-size每页多少条数据 -->
    <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next" :total="total" :current-page="page" :page-size="20"> </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'recommend',
  data () {
    return {
      // 总条数
      total: 0,
      // 页码
      page: 1,
      // 精品歌单
      topList: {},
      // 歌单列表
      list: [],
      // 当前选择的数据
      tag: '全部'
    }
  },
  watch: {
    tag () {
      // 顶部精品歌单
      this.topData()
      // 歌单列表
      this.listData()
      // 切换歌单类型时 修改页码值为一
      this.page = 1
    }
  },
  created () {
    // 顶部精品歌单
    this.topData()
    // 歌单列表
    this.listData()
  },
  methods: {
    async topData () {
      const { data: res } = await this.$axios.get('/api/top/playlist/highquality', {
        params: {
          limit: 1,
          cat: this.tag
        }
      })
      //  console.log(res);
      this.topList = res.playlists[0]
    },
    async listData () {
      const { data: resone } = await this.$axios.get('/api/top/playlist/', {
        params: {
          limit: 10,
          // 起始的值 （页码-1）*每页多少条数据
          offset: (this.page - 1) * 10,
          cat: this.tag
        }
      })
      // console.log(resone);
      this.total = resone.total
      this.list = resone.playlists
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      // 保存页码
      this.page = val
      // 重新获取数据
      this.listData()
    },
    tuijiangedan (id) {
      // 跳转并携带数据即可
      this.$router.push(`/home/playlist?q=${id}`)
    }
  }
}
</script>

<style></style>
