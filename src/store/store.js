import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'
import user from './modules/user'
import permission from './modules/permission'

Vue.use(Vuex)

export default new Vuex.Store({
  /* plugins: [createPersistedState({ storage: window.sessionStorage })], */
  modules: {
    user,
    permission
  }
})
