import { constantRouterMap } from '@/router'
/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param routesMap
 */
/* function filterAsyncRouter (asyncRouterMap, routesMap) {
  const accessedRouters = asyncRouterMap.filter(route => {
    return routesMap.includes(route.path)
  })
  return accessedRouters
} */

const SET_ROUTERS = 'SET_ROUTERS'
const SET_ADDROUTERS = 'SET_ADDROUTERS'

const permission = {
  state: {
    addRouters: '',
    routers: ''
  },
  mutations: {
    [SET_ROUTERS] (state, routers) {
      state.routers = routers
    },
    [SET_ADDROUTERS] (state, routers) {
      state.addRouters = routers
    }
  },
  actions: {
    GenerateRoutes ({ commit }, routers) {
      return new Promise((resolve, reject) => {
        /* const { permissions: p } = routers
        const routersMap = p.split(',')
        let accessedRouters = filterAsyncRouter(asyncRouterMap, routersMap) */
        commit(SET_ROUTERS, constantRouterMap.concat(routers))
        commit(SET_ADDROUTERS, routers)
        resolve()
      })
    }
  },
  getters: {
    addRouters: state => state.addRouters,
    routers: state => state.routers,
    CurrentState: state => (key, chil) => {
      var a = state.addRouters.find(x => {
        return x.name === key
      })
      if (a.children != null) {
        a = a.children.find(x => {
          return x.name === chil
        })
      }
      return a.meta
    }
  }
}

export default permission
