import Vue from 'vue'
import Router from 'vue-router'
// 引入nprogress进度条
import NProgress from 'nprogress'
// 引入nprogress进度条的样式
import 'nprogress/nprogress.css'
import Layout from '@/components/layout/Layout.vue'
import store from './store/store.js'
import { getToken } from './common/auth'
import { Notification } from 'element-ui'

Vue.use(Router)
// hidden为true时 侧边导航不显示
export const constantRouterMap = [
  {
    path: '/404',
    component: resolve => require(['@/views/404.vue'], resolve),
    name: '404',
    meta: {
      title: 'NoPage'
    },
    hidden: true
  },
  {
    path: '/',
    hidden: true,
    redirect: 'Main'
  },
  {
    path: '/login',
    name: 'login',
    hidden: true,
    component: resolve => require(['@/views/Login.vue'], resolve),
    meta: {
      title: '登录'
    }
  },
  {
    // share页
    path: '/Main',
    name: 'Main',
    component: Layout,
    meta: { icon: 'el-icon-s-home', title: '系统首页' }
  },
  {
    path: '/Personal',
    name: 'Personal',
    hidden: true,
    meta: { title: '个人中心' }
  },
  {
    path: '*',
    hidden: true,
    redirect: { path: '/404' }
  }
]

export const asyncRouterMap = []

const router = new Router({
  mode: 'history',
  routes: constantRouterMap
})

const whiteList = ['/login'] // 白名单
router.beforeEach((to, from, next) => {
  // 开启进度条
  NProgress.start()
  if (to.meta.title) {
    // 切换title名字
    document.title = '后台管理系统' // to.meta.title
  } else {
    document.title = '页面走丢了'
  }
  if (getToken()) {
    // 如果已经就是要去login了，就不需要拦截了
    if (to.path === '/login' || to.name === '404') {
      next()
      NProgress.done() // 这种情况不会触发router的后置钩子，所以这里需要单独处理
    } else {
      // 有token，没有permissions
      if (store.getters.routers.length === 0) {
        Notification({
          message: '成功获取Token，等待服务器返回用户信息...',
          type: 'success'
        })
        store
          .dispatch('pullUserInfo')
          .then(resp => {
            Notification({
              message: '用户信息获取成功',
              type: 'success'
            })
            store.dispatch('GenerateRoutes', resp.permissions).then(() => {
              // 动态添加可访问路由表
              // router.addRoutes(store.getters.addRouters)
              // console.log(to)
              // console.log({...to})
              // hack方法 确保addRoutes已完成，set the replace: true so the navigation will not leave a history record
              // 这样我们就可以简单的通过 `next(to)` 巧妙的避开之前的那个问题了。这行代码重新进入 `router.beforeEach` 这个钩子，这时候再通过 `next()` 来释放钩子，就能确保所有的路由都已经挂载完成了。
              next({
                ...to,
                replace: true
              })
            })
          })
          .catch(() => {
            store.dispatch('logout').then(() => {
              next('/login')
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      // 白名单，免密登录
      next()
    } else {
      // 否则就跳动登录页面
      next('/login')
      NProgress.done() // 这种情况不会触发router的后置钩子，所以这里需要单独处理
    }
  }
})

router.afterEach(() => {
  // 关闭进度条
  NProgress.done()
})
export default router
