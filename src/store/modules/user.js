import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
const BaseUrl = 'http://localhost:5000'
Vue.use(Vuex)

const user = {
  state: {
    userInfo: {
      uin: null,
      UserName: null,
      NickName: null,
      HeadImgUrl: null,
      loginStatus: null
    }
  },
  mutations: {
    SET_LOGIN_STATUS: (state, payload) => {
      state.userInfo.loginStatus = payload
    },
    setUin (state, payload) {
      state.userInfo.uin = payload
    },
    setUserName (state, payload) {
      state.userInfo.UserName = payload
    },
    setNickName (state, payload) {
      state.userInfo.NickName = payload
    },
    setHeadImgUrl (state, payload) {
      state.userInfo.HeadImgUrl = payload
    }
  },
  actions: {
    
    // 获取登录二维码
    getQrcode ({ commit }, payload) {
      // let params = {
      //   queryType: payload.queryType,
      //   idcard: payload.idcard
      // }
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url: `${BaseUrl}/wx/login/qrcode`,
          withCredentials: true
        }).then((e) => {
          resolve(e.data)
        })
      }
      )
    },
    // 检查是否登录接口
    getIsLogin ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url: `${BaseUrl}/wx/login/checklogin`,
          withCredentials: true
        }).then((e) => {
          if (e.data.code === 200) {
            commit('SET_LOGIN_STATUS', true)
          }
          resolve(e.data) 
        })
      })
    },
   
    // 初始化个人信息
    wxInit ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url: `${BaseUrl}/wx/login/init`,
          withCredentials: true
        }).then((e) => {
          if (e && e.data && e.data.data) {
            commit('setUin', e.data.data.uin)
            commit('setUserName', e.data.data.UserName)
            commit('setNickName', e.data.data.NickName)
          }
          resolve(e.data)
        })
      }
      )
    }
  }
}

export default user
