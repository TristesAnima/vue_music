import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// axios请求拦截器
import axiosInit from './static/js/request.js'
// 导入公用的api
import * as Api from '@/static/js/api.js'
// 导入 vue-aplayer
import APlayer from '@moefe/vue-aplayer'
// 导入 Element_ui
import ElementUI from 'element-ui'
// 导入 Element-ui 样式
import 'element-ui/lib/theme-chalk/index.css'

// 时间格式化工具
import dayjs from 'dayjs'

// 导入全局初始化样式
import './static/css/index.css'
// 移动端初始化样式
import './static/css/mobilephone.css'

// 全局使用插件 Element-ui
Vue.use(ElementUI)
// 全局使用插件 vue-aplayer
Vue.use(APlayer, {
  defaultCover: '',
  productionTip: true
})
// 挂载到Vue实例上
Vue.prototype.$axios = axiosInit
Vue.prototype.$api = Api
Vue.prototype.$dayjs = dayjs

Vue.config.productionTip = false

new Vue({
  render: (h) => h(App),
  // 挂载到Vue示例上
  router,
  store
}).$mount('#app')
