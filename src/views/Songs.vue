<template>
  <div class="songs-container">
    <el-menu :default-active="'0'" active-text-color="#23aaf2" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="0" @click="type = 0">全部</el-menu-item>
      <el-menu-item index="7" @click="type = 7">华语</el-menu-item>
      <el-menu-item index="96" @click="type = 96">欧美</el-menu-item>
      <el-menu-item index="8" @click="type = 8">日本</el-menu-item>
      <el-menu-item index="16" @click="type = 16">韩国</el-menu-item>
    </el-menu>

    <el-table :data="lists" stripe style="width: 100%" @row-click="playMusic">
      <el-table-column type="index" label="" width="80">
      </el-table-column>
      <el-table-column label="封面">
        <template slot-scope="scope">
          <el-image :src="scope.row.album.picUrl" lazy></el-image>
        </template>
      </el-table-column>
      <el-table-column label="音乐标题">
        <template slot-scope="scope">
          <label>{{ scope.row.name }}</label>
          <!-- 防止事件冒泡 .stop.prevent -->
          <span v-if="scope.row.mvid != 0" class="iconfont icon-mv" @click.stop.prevent="toMv(scope.row.mvid)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="album.artists[0].name" label="歌手">
      </el-table-column>
      <el-table-column prop="album.name" label="专辑">
      </el-table-column>
      <el-table-column prop="duration" label="时长">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'songs',
  data () {
    return {
      // 歌曲列表
      lists: [],
      type: 0,
      loading: true
    }
  },
  created () {
    this.$message.info('此页面请求歌曲数据较多，请耐心等待')
    this.getList()
  },
  watch: {
    type () {
      this.getList()
    }
  },
  methods: {
    // 获取列表数据
    async getList () {
      this.$api.getLists(this.type).then(val => {
        this.lists = val
        // 处理时长 毫秒 => 分秒
        for (let i = 0; i < this.lists.length; i++) {
          const duration = this.lists[i].duration
          // 毫秒 s/1000
          // 分 m/60
          // 秒 350 % 60
          let min = parseInt(duration / 1000 / 60)
          min = min < 10 ? '0' + min : min
          let sec = parseInt((duration / 1000) % 60)
          sec = sec < 10 ? '0' + sec : sec
          // console.log(min + '|' + sec)
          this.lists[i].duration = `${min}:${sec}`
        }
      })
    },
    // 播放歌曲
    async playMusic (val) {
      this.$store.state.mid = val.id
      this.$store.commit('playMusic')
    },
    toMv (id) {
      this.$router.push(`/home/mv?q=${id}`)
    }
  }
}
</script>

<style></style>
