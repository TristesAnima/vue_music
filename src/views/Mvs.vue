<template>
  <div class="mvs-container">
    <!-- 分类切换 -->
    <el-menu :default-active="'全部'" active-text-color="#23aaf2" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="全部" @click="area = '全部'">全部</el-menu-item>
      <el-menu-item index="内地" @click="area = '内地'">内地</el-menu-item>
      <el-menu-item index="港台" @click="area = '港台'">港台</el-menu-item>
      <el-menu-item index="韩国" @click="area = '韩国'">韩国</el-menu-item>
      <el-menu-item index="欧美" @click="area = '欧美'">欧美</el-menu-item>
      <el-menu-item index="日本" @click="area = '日本'">日本</el-menu-item>
    </el-menu>

    <el-menu :default-active="'全部'" active-text-color="#dd6d60" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="全部" @click="type = '全部'">全部</el-menu-item>
      <el-menu-item index="官方版" @click="type = '官方版'">官方版</el-menu-item>
      <el-menu-item index="原生" @click="type = '原生'">原生</el-menu-item>
      <el-menu-item index="现场版" @click="type = '现场版'">现场版</el-menu-item>
      <el-menu-item index="网易出品" @click="type = '网易出品'">网易出品</el-menu-item>
    </el-menu>

    <el-menu :default-active="'上升最快'" active-text-color="#ffcd40" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="上升最快" @click="order = '上升最快'">上升最快</el-menu-item>
      <el-menu-item index="最热" @click="order = '最热'">最热</el-menu-item>
      <el-menu-item index="最新" @click="order = '最新'">最新</el-menu-item>
    </el-menu>

    <!-- mv容器 -->

    <!-- 推荐MV -->
    <div class="mvs">
      <div class="items">
        <div class="item" v-for="item in list" :key="item.id" @click="toMv(item.id)">
          <el-image :src="item.cover"></el-image>
          <div class="num-wrap">
            <div class="iconfont icon-play"></div>
            <div class="num">{{ item.playCount }}</div>
          </div>
          <div class="info-wrap">
            <div class="name">{{ item.name }}</div>
            <div class="singer">{{ item.artistName }}</div>
          </div>
        </div>
      </div>

      <!-- 分页器 -->
      <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next" :total="total" :current-page="page" :page-size="5" :limit="limit"> </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mvs',
  data () {
    return {
      // 总条数
      total: 20,
      // 页码
      page: 1,
      // 页容量
      limit: 8,
      // 地区
      area: '全部',
      // 类型
      type: '全部',
      // 排序
      order: '全部',
      // 偏移数量
      offset: '',
      // 查询的值
      list: ''
    }
  },
  watch: {
    area () {
      // 获取列表数据
      this.page = 1
      this.getList()
    },
    type () {
      // 获取列表数据
      this.page = 1
      this.getList()
    },
    order () {
      // 获取列表数据
      this.page = 1
      this.getList()
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 获取列表数据
    async getList () {
      this.$api.getMvLists(this.area, this.type, this.order, this.limit, this.page).then(val => {
        this.list = val

        for (let i = 0; i < this.list.length; i++) {
          this.list[i].playCount = parseInt(this.list[i].playCount / 10000) + '万'
        }
        // 接口问题
        if (val.count) {
          this.total = val.count
        }
      })
    },
    // 页码改变的回调函数
    handleCurrentChange (val) {
      this.page = val
      this.getList()
    },
    toMv (id) {
      this.$router.push(`/home/mv?q=${id}`)
    }
  }
}
</script>

<style></style>
