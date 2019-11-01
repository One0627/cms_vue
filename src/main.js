import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App.vue'
import router from './router'
import store from './store/store'
import signal from './utils/signalR'
import BASE_URL from '../global'
Vue.use(ElementUI, { size: 'small', zIndex: 3000 })
Vue.use(signal)
Vue.prototype.BASE_URL = BASE_URL
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
