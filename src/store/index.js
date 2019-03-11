import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import group from './modules/group'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    group
  },
  getters
})

export default store
