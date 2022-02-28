import Vue from 'vue'
// discovery页面------------------------------------------------------------------------------------------------------------------------------------------------
// 轮播图
export const getBanners = async () => {
  const { data: res } = await Vue.prototype.$axios.get('/api/banner')
  return res.banners
}
// 推荐歌单
export const recommandLists = async () => {
  const { data: res } = await Vue.prototype.$axios.get('/api/personalized', {
    params: {
      // 获取的数据量
      limit: 15
    }
  })
  return res.result
}
// 推荐歌曲
export const recommandMusic = async () => {
  const { data: restwo } = await Vue.prototype.$axios.get('/api/personalized/newsong')
  return restwo.result
}
// 最新mv
export const recommandMv = async () => {
  const { data: res } = await Vue.prototype.$axios.get('/api/personalized/mv')
  return res.result
}

// playlists 界面---------------------------------------------------------------------------------------------------------------------------------------------------
// 顶部显示
export const topDatas = async (tag) => {
  const { data: res } = await Vue.prototype.$axios.get('/api/top/playlist/highquality', {
    params: {
      limit: 1,
      cat: tag
    }
  })
  return res.playlists[0]
}
// 推荐歌单
export const listDatas = async (page, tag) => {
  const { data: res } = await Vue.prototype.$axios.get('/api/top/playlist', {
    params: {
      limit: 10,
      // 起始的值 （页码-1）*每页多少条数据
      offset: (page - 1) * 10,
      cat: tag
    }
  })
  return res
}

// songs 界面------------------------------------------------------------------------------------------------------------------------------------------------------
export const getLists = async (type) => {
  const { data: res } = await Vue.prototype.$axios.get('/api/top/song', {
    params: {
      type
    }
  })
  return res.data
}

// Mvs 界面--------------------------------------------------------------------------------------------------------------------------------------------------------
export const getMvLists = async (area, type, order, limit, page) => {
  const { data: res } = await Vue.prototype.$axios.get('/api/mv/all', {
    params: {
      area: area,
      type: type,
      order: order,
      //  数量
      limit: limit,
      //  偏移值
      offset: (page - 1) * limit
    }
  })
  return res.data
}

// topList 界面----------------------------------------------------------------------------------------------------------------------------------------------------
export const getTopLists = async () => {
  const { data: res } = await Vue.prototype.$axios.get('/api/toplist')
  return res.list
}

// 歌手界面--------------------------------------------------------------------------------------------------------------------------------------------------------
export const getSinger = async (type, area, limit, page) => {
  const { data: res } = await Vue.prototype.$axios.get('/api/artist/list', {
    params: {
      type: type,
      area: area,
      limit: limit,
      offset: (page - 1) * limit
    }
  })
  return res.artists
}

// 用户音乐列表---------------------------------------------------------------------------------------------------------------------------------------------------
export const getPersonMusicList = async (uid) => {
  const { data: res } = await Vue.prototype.$axios.get('/api/user/playlist', {
    params: {
      uid
    }
  })
  return res.playlist
}

// result界面---------------------------------------------------------------------------------------------------------------------------------------------------
// 搜索结果api
export const searchres = async (keywords, limit, page) => {
  const { data: res } = await Vue.prototype.$axios.get('/api/cloudsearch', {
    params: {
      keywords,
      type: 1,
      // 获取的数据量
      limit,
      offset: (page - 1) * limit
    }
  })
  return res.result
}

export const add = async (playListid, mId) => {
  const { data: res } = await Vue.prototype.$axios.get('/api/playlist/tracks', {
    params: {
      op: 'add',
      tracks: mId,
      pid: playListid
    }
  })
  return res
}

// playlist 界面-------------------------------------------------------------------------------------------------------------------------------------
// 封面信息
export const getPlayListsInfo = async (id) => {
  const { data: res } = await Vue.prototype.$axios.get('/api/playlist/detail', {
    params: {
      id
    }
  })
  return res.playlist
}
// 歌单歌曲
export const getAllMusic = async (id, limit) => {
  const { data: res } = await Vue.prototype.$axios.get('/api/playlist/track/all', {
    params: {
      id,
      limit
    }
  })
  return res.songs
}
// 歌单热门评论
export const gethotcomment = async (id) => {
  const { data: res } = await Vue.prototype.$axios.get('/api/comment/hot', {
    params: {
      id,
      type: 2
    }
  })
  return res
}
// 最新评论
export const getNewComment = async (id, page) => {
  const { data: res } = await Vue.prototype.$axios.get('/api/comment/playlist', {
    params: {
      id,
      limit: 10,
      offset: (page - 1) * 10
    }
  })
  return res
}
// 发送评论
export const sendComment = async (id, textarea, type) => {
  const { data: res } = await Vue.prototype.$axios.get('/api/comment?', {
    params: {
      t: 1,
      type,
      id,
      content: textarea
    }
  })
  return res
}

// Mv 界面------------------------------------------------------------------------------------------------------------------------------------------------
// mv 的 url
export const mvurl = async (id) => {
  const { data: res } = await Vue.prototype.$axios.get('/api/mv/url', {
    params: {
      id
    }
  })
  return res.data.url
}
// 获取相关的mv
export const simiMvs = async (mvid) => {
  const { data: res } = await Vue.prototype.$axios.get('/api/simi/mv', {
    params: {
      mvid
    }
  })
  return res.mvs
}
// 获取 mv 的信息
export const mvsInfo = async (mvid) => {
  const { data: res } = await Vue.prototype.$axios.get('/api/mv/detail', {
    params: {
      mvid
    }
  })
  return res.data
}
// 获取评论
export const getMvNewComment = async (id) => {
  const { data: res } = await Vue.prototype.$axios.get('/api/comment/mv', {
    params: {
      id,
      limit: 10
    }
  })
  return res
}

// detail 界面---------------------------------------------------------------------------------------------------------------------------------------------
export const detail = async () => {
  const { data: res } = await Vue.prototype.$axios.get('/api/user/account')
  return res
}

// 发送私信界面---------------------------------------------------------------------------------------------------------------------------------------------
export const getUserDeatail = async (uid) => {
  const { data: res } = await Vue.prototype.$axios.get('/api/msg/private/history', {
    params: {
      uid
    }
  })
  return res
}

// 获取用户私信列表界面-------------------------------------------------------------------------------------------------------------------------------------
export const getPrivateMsg = async () => {
  const { data: res } = await Vue.prototype.$axios.get('/api/msg/private', {
    limit: 30
  })
  return res
}
