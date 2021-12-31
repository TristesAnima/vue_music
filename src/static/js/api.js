import axios from 'axios'

// discovery页面
// 轮播图
export const getBanners = async () => {
  const { data: res } = await axios.get('/api/banner')
  return res.banners
}
// 推荐歌单
export const recommandLists = async () => {
  const { data: resone } = await axios.get('/api/personalized', {
    params: {
      // 获取的数据量
      limit: 15
    }
  })
  return resone.result
}
// 推荐歌曲
export const recommandMusic = async () => {
  const { data: restwo } = await axios.get('/api/personalized/newsong')
  return restwo.result
}
// 最新mv
export const recommandMv = async () => {
  const { data: resthree } = await axios.get('/api/personalized/mv')
  return resthree.result
}

// playlists 界面
// export const topDatas = async ()=>{
// const { data: resfour } = await axios.get('/api/top/playlist/highquality', {
//   params: {
//     limit: 1,
//     cat: this.tag
//   }
// })
// return resfour.playlists[0]
// }
