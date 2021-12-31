import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 音乐
    mid: '',
    url: ''
  },
  mutations: {
    // 播放音乐的api
    async playMusic (state) {
      const { data: res } = await Vue.prototype.$axios.get('/api/song/url', {
        params: {
          id: state.mid
        }
      })
      state.url = res.data[0].url
    }
  },
  actions: {}
})

export default store
