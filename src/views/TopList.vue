<template>
  <div class="toplist-container">
    <div class="item-wrap">
      <div class="item" style="display: flex; flex-wrap: wrap; justify-content: space-between;">
        <el-card :body-style="{ padding: '0px' }" v-for="item in toplist" :key="item.id" style="margin: 0 40px 20px 0;">
          <img :src="item.coverImgUrl" class="image" title="嘿嘿嘿">
          <div style="padding: 14px;">
            <span>{{ item.name }}</span>
            <div class="bottom clearfix">
              <time class="time">最近更新: {{ $dayjs(item.updateTime).format('YYYY-MM-DD')  }} ({{ item.updateFrequency }})</time>
              <div class="playCount">播放了 {{ item.playCount }} 次</div>
              <div class="desc">{{item.description}}</div>
              <el-button type="text" class="button" @click="toPlayList(item.id)">查看全部></el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'toplist',
  data () {
    return {
      // 储存获取数据
      toplist: [],
      // musicList: [],
      loading: true
    }
  },
  created () {
    this.getTopList()
  },
  methods: {
    async getTopList () {
      this.$api.getTopLists().then(val => {
        this.toplist = val
      })
      // setTimeout(async () => {
      //   const { data: resone } = await this.$axios.get('/api/playlist/track/all', {
      //     params: {
      //       id: res.list[0].id,
      //       limit: 7
      //     }
      //   })
      //   this.musicList = resone.songs
      // }, 2000)
    },
    toPlayList (id) {
      this.$router.push(`/home/playlist?q=${id}`)
    }
  }
}
</script>

<style lang="css" scoped>
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

.el-card {
  display: inline-block;
  width: 250px;
  min-height: 480px;
}

.el-card:hover {
  transform: translateX(20px);
  transition: all 0.7s ease;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
  margin-top: 10px;
}

.time,
.playCount {
  font-size: 13px;
  color: #999;
  margin: 5px 0;
}

.desc {
  letter-spacing: 1px;
  font-size: 13px;
  color: lightseagreen;
}

.playCount:hover,
.desc:hover {
  transform: translateX(10px);
  transition: all 0.7s ease;
}

.button:hover {
  transform: translateX(5px);
  transition: all 0.7s ease;
}
</style>
