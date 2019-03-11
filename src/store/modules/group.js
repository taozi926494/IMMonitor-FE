import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
// import mock_groups from '@/mock/groups'
const BaseUrl = 'http://localhost:5000'

Vue.use(Vuex)

const group = {
  state: {
    groups: [],
    previewImgUrl: null
  },
  mutations: {
    SET_GROUPS: (state, groups) => {
      state.groups = groups
    },
    SET_PREVIEW_IMG_URL: (state, previewImgUrl) => {
      state.previewImgUrl = previewImgUrl
    },
    HANDLE_GROUP_MSG: (state, msg_dict) => {
      // console.log(msg_dict.msg_list_detected)
      // console.log(msg_dict.msg_list)
      // console.log(state.groups)
      if (msg_dict) {
        for (let i = 0; i < msg_dict.msg_list.length; i++) {
          let msg = msg_dict.msg_list[i]
          
          msg.detectedArr = []
          for (let d_i = 0; d_i < msg_dict.msg_list_detected.length; d_i++) {
            let detect_result = msg_dict.msg_list_detected[d_i]
            if (detect_result.msg_id == msg.MsgId) {
              msg.detectedArr.push(detect_result)
            }
          }
          
          for (let j = 0; j < state.groups.length; j++) {
            if (msg.group_id == state.groups[j].group_id) {
              state.groups[j].msg_list.push(msg)
            }
          }
        }
      }
    }
  },
  actions: {
    syckCheck() {
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url: `${BaseUrl}/wx/message/sync_check`,
          withCredentials: true
        }).then((e) => {
          resolve(e.data)
        })
      })
    },
    getGroupMsg() {
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url: `${BaseUrl}/wx/message/get_msg`,
          withCredentials: true
        }).then((e) => {
          if (e && e.data && e.data.code === 200) {
            return resolve(e.data)
          }
          reject(e)
        })
      })
    },

    // 获取群信息
    getGroupContact ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url: `${BaseUrl}/wx/contact/get_group_contact`,
          withCredentials: true
        }).then((e) => {
          if (e && e.data && e.data.code === 200) {
            commit('SET_GROUPS', e.data.data)
            resolve(e.data)
            return
          } 
          reject(e)
        })
      })
    },    
  }
}

export default group