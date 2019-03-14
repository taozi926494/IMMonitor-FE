import Vue from 'vue'
import Router from 'vue-router'
import Console from './views/Console'
import Layout from './views/Layout'
import Login from './views/Login'
import GroupList from './views/GroupList'
import User from './views/User'
import GroupInfo from './views/GroupInfo'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: '',
      redirect: '/console',
      component: Layout,
      children: [
        {
          path: '/console',
          name: 'console',
          component: Console
        },
        {
          path: '/grouplist',
          name: 'grouplist',
          component: GroupList
        },
        {
          path: '/groupinfo/:group_id',
          name: 'groupinfo',
          component: GroupInfo,
        },
        {
          path: '/user',
          name: 'user',
          component: User
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
