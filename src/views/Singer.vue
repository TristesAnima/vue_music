<template>
  <div class="singer-container">
    <!-- 分类切换 -->
    <el-menu :default-active="'-1'" active-text-color="#23aaf2" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="-1" @click="type = '-1'">全部</el-menu-item>
      <el-menu-item index="1" @click="type = '1'">男歌手</el-menu-item>
      <el-menu-item index="2" @click="type = '2'">女歌手</el-menu-item>
      <el-menu-item index="3" @click="type = '3'">乐队</el-menu-item>
    </el-menu>
    <el-menu :default-active="'-1'" active-text-color="#23aaf2" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="-1" @click="area = '-1'">全部</el-menu-item>
      <el-menu-item index="7" @click="area = '7'">华语</el-menu-item>
      <el-menu-item index="96" @click="area = '96'">欧美</el-menu-item>
      <el-menu-item index="8" @click="area = '8'">日本</el-menu-item>
      <el-menu-item index="16" @click="area = '16'">韩国</el-menu-item>
      <el-menu-item index="0" @click="area = '0'">其它</el-menu-item>
    </el-menu>

    <div class="items">
      <div class="item">
        <el-card :body-style="{ padding: '0px',width: '250px' }" v-for="item in getSingers" :key="item.id">
          <el-image :src="item.picUrl" lazy class="image"></el-image>
          <div style="padding: 14px;">
            <span class="artist">{{ item.name }}</span>
            <div class="bottom clearfix">
              <time class="fansCount">粉丝：暂无数据</time>
              <el-button type="text" class="button" @click="toSingerInfo(item.id)">进入主页></el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <el-pagination @current-change="handleCurrentChange" :background="true" layout="prev, pager, next" :current-page="page" :total="total" :limit="limit">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'singer',
  data () {
    return {
      type: '',
      area: '',
      getSingers: [],
      // 分页功能
      limit: 32,
      page: 1,
      total: 320
    }
  },
  watch: {
    type () {
      this.getSingersInfo()
    },
    area () {
      this.getSingersInfo()
    }
  },
  created () {
    this.getSingersInfo()
  },
  methods: {
    async getSingersInfo () {
      this.$api.getSinger(this.type, this.area, this.limit, this.page).then(val => {
        this.getSingers = val
      })
    },
    // 页码改变的回调函数
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.page = val
      this.getSingersInfo()
    },
    toSingerInfo (id) {
      this.$router.push(`/home/singerinfo?q=${id}`)
    }
  }
}
</script>

<style lang="css" scoped>
.fansCount {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
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
