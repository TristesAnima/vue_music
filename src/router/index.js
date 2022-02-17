import Vue from 'vue'
import VueRouter from 'vue-router'
// 访问权限设置导入
import arr from './arr.js'

// 解决点击重复路由会报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch((err) => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home/discovery'
  },
  {
    // 主界面
    path: '/home',
    component: () => import('@/components/Home/home.vue'),
    redirect: '/home/discovery',
    children: [
      { path: 'discovery', component: () => import('@/views/Discovery.vue') },
      { path: 'playlists', component: () => import('@/views/Playlists.vue') },
      { path: 'songs', component: () => import('@/views/Songs.vue') },
      { path: 'mvs', component: () => import('@/views/Mvs.vue') },
      { path: 'toplist', component: () => import('@/views/TopList.vue') },
      { path: 'mv', component: () => import('@/views/Mv.vue') },
      { path: 'playlist', component: () => import('@/views/Playlist.vue') },
      { path: 'result', component: () => import('@/views/Result.vue') },
      { path: 'personlist', component: () => import('@/views/Personlist.vue') },
      { path: 'detail', component: () => import('@/views/Detail.vue') },
      { path: 'singer', component: () => import('@/views/Singer.vue') },
      { path: 'singerinfo', component: () => import('@/views/SingerInfo.vue') },
      { path: 'privatemsg', component: () => import('@/views/PrivateMsg.vue') },
      { path: 'sendmsg', component: () => import('@/views/SendMsg.vue') }
    ]
  },
  {
    // 真实登陆界面
    path: '/tologin',
    component: () => import('@/components/Login/toLogin.vue')
  }
]

const router = new VueRouter({
  routes
})

// 全局前置守卫 控制访问权限

// 路由开始跳转时
router.beforeEach(function (to, from, next) {
  if (arr.indexOf(to.path) !== -1) {
    Vue.prototype.$axios.get('/api/login/status').then((res) => {
      if (res.data.data.profile !== null && res.data.data.account !== null) {
        next()
        window.scrollTo(0, 0)
      } else {
        Vue.prototype.$message.warning('您还没有登录,请先登录')
        window.scrollTo(0, 0)
        next('/tologin')
      }
    })
  } else {
    next()
    window.scrollTo(0, 0)
  }
})

// 当路由跳转结束后
router.afterEach(() => {})

export default router
