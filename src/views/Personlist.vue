<template>
  <div class="personlist-container">
    <div class="items" v-show="show">
      <div class="item" v-for="item in personlist" :key="item.id">
        <div class="img-wrap" @click="toplaylist(item.id)">
          <img :src="item.coverImgUrl" alt="点击进入歌单">
          <div class="info">
            <span class="playlistname">{{ item.name }}</span>
            <span class="playcount">播放次数:{{ item.playCount }}</span>
            <span class="trackcount">总数:{{ item.trackCount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      personlist: [],
      show: false
    }
  },
  async created () {
    const { data: resfour } = await this.$axios.get('/api/login/status')
    if (resfour.data.profile !== null && resfour.data.account !== null) {
      this.$axios({
        url: '/api/user/playlist',
        method: 'get',
        params: {
          uid: resfour.data.profile.userId
        }
      }).then(res => {
        // console.log(res.data.playlist)
        this.personlist = res.data.playlist
        this.show = true
      })
    }
  },
  methods: {
    toplaylist (id) {
      this.$router.push(`/home/playlist?q=${id}`)
    }
  }
}
</script>

<style>
</style>
