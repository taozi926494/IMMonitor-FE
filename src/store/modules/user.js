import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
// const BaseUrl = 'http://172.16.111.6:5000'
const BaseUrl = 'http://localhost:5000'

// 上线
// const BaseUrl = ''
Vue.use(Vuex)

const user = {
  state: {
    userInfo: {
      uin: null,
      // UserName: null,
      UserName: '@2f4aed76524f619be4e382173d80bfab',
      NickName: null,
      HeadImgUrl: null,
      loginStatus: null
    },
    otherUsersHeadImage: [],
    selfHeadImage: null,
    warningTime: 5000,
    warningMaxNum: 2,
    warningTipDuration: 10,  // 报警提示框弹出时长

    // {
    //   '1': {
    //     GroupNickName: 'xxx',
    //     msg: {
    //       '1233434234': {Content: 'xx', FromUserName: 'xxx'}
    //     }
    //   }
    // }
    alarmMsgs: {},
  },
  mutations: {
    SET_LOGIN_STATUS: (state, payload) => {
      state.userInfo.loginStatus = payload
    },
    SET_SELF_HEAD_IMAGE: (state, payload) => {
      state.selfHeadImage = payload
    },
    SET_OTHER_USER_HEAD_IMAGE: (state, payload) => {
      state.otherUsersHeadImage.push(payload)
    },
    SET_UIN (state, payload) {
      state.userInfo.uin = payload
    },
    SET_USER_NAME (state, payload) {
      state.userInfo.UserName = payload
    },
    SET_NICK_NAME (state, payload) {
      state.userInfo.NickName = payload
    },
    SET_WARNING_TIME (state, payload) {
      state.warningTime = payload
    },
    SET_WARNING_MAX_NUM (state, payload) {
      state.warningMaxNum = payload
    },
    SET_WARNING_TIP_DURATION(state, duration) {
      state.warningTipDuration = duration
    },
    SET_ALARM_MSGS(state, alarmObjtRec) {
        // 如果该群不在state的alarmMsgs里面
        // 新增该group为key
        let group_id = (alarmObjtRec.group_id)
        if (!state.alarmMsgs.hasOwnProperty(group_id)) {
          Vue.set(state.alarmMsgs, 
            group_id, 
            {
              'GroupNickName': alarmObjtRec.GroupNickName,
              'msg': alarmObjtRec.msg
            })
        } else {
          // 如果state里面已经有该群的记录了
          // 在msg里面继续循环
          let msgInstate = state.alarmMsgs[group_id]['msg']
          for (let msgIdKey in alarmObjtRec.msg) {
            // 如果msgkey不在group中
            // 新增一个key
            if (!msgInstate.hasOwnProperty(msgIdKey)) {
              Vue.set(msgInstate, msgIdKey, alarmObjtRec.msg[msgIdKey])
            }
          }
        }
    },
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
            commit('SET_UIN', e.data.data.uin)
            commit('SET_USER_NAME', e.data.data.UserName)
            commit('SET_NICK_NAME', e.data.data.NickName)
          }
          resolve(e.data)
        })
      })
    },
    // 获取个人头像
    getSelfHeadImage ({ commit }, payload) {
      axios({
        method: 'get',
        url: `${BaseUrl}/wx/contact/get_head_img`,
        params: {
          uin: payload.uin,
          username: payload.username,
        },
        withCredentials: true
      }).then((e) => {
        if (e && e.data && e.data.code === 200) {
          commit('SET_OTHER_USER_HEAD_IMAGE', {
            username: payload.username,
            headPath: `${BaseUrl}${e.data.data.FilePath}`
          })
          commit('SET_SELF_HEAD_IMAGE', `${BaseUrl}${e.data.data.FilePath}`)
        }
      })
    },
    // 获取发送人的头像
    getOtherHeadImage ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url: `${BaseUrl}/wx/contact/get_member_head_img`,
          params: {
            group_id: payload.group_id,
            encry_chatroom_id: payload.encry_chatroom_id,
            username: payload.username,
            user_nickname: payload.user_nickname,
          },
          withCredentials: true
        }).then((e) => {
          resolve(`${BaseUrl}${e.data.data.FilePath}`)
        })
      })
    },
    sendMsg({commit}, msg) {
      return new Promise((resolve, rejectt) => {
        axios({
          method: 'get',
          url: `${BaseUrl}/wx/message/send_msg`,
          params: {
            to_username: msg.to_username,
            content: msg.content,
          },
          withCredentials: true
        }).then((e) => {
          resolve(e.data)
        })
      })
    },
    sendMsgToFileHelper({commit}, content) {
      let msg = {
        to_username: 'filehelper',
        content: content,
      }
      return this.sendMsg(msg)
    }
  }
}

export default user
