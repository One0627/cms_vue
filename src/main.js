import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App.vue'
import router from './router'
import store from './store/store'
import signal from './utils/signalR'
import md5 from 'js-md5'
import Base64 from 'js-base64'
Vue.use(ElementUI, { size: 'small', zIndex: 3000 })
Vue.use(signal)
Vue.prototype.md5 = md5
Vue.prototype.Base64 = Base64
// require('./mock') // 引入mock数据，关闭则注释该行

Vue.config.productionTip = false

let vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
Vue.use({
  vm
})
