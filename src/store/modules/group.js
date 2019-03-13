import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
// import mock_groups from '@/mock/groups'
const BaseUrl = 'http://172.16.111.6:5000'
// const BaseUrl = 'http://localhost:5000'

// 上线
// const BaseUrl = ''

Vue.use(Vuex)

const group = {
  state: {
    groups: [],
    previewImgUrl: null,
    warningGroupId: null
  },
  mutations: {
    SET_WARNING_GROUPID: (state, groupid) => {
      state.warningGroupId = groupid
    },
    SET_GROUPS: (state, groups) => {
      state.groups = groups
    },
    SET_PREVIEW_IMG_URL: (state, previewImgUrl) => {
      state.previewImgUrl = previewImgUrl
    },
    SET_TOP: (state, id) => {
      let _group_index
      state.groups.find((group, index) => {
        console.log(group.group_id, id)
        if (group.group_id === id) {
          _group_index = index
        }
      })
      console.log('group index', _group_index)
      let group_top = state.groups.splice(_group_index, 1)[0]
      console.log('group_top', group_top)
      state.groups.unshift(group_top)
      console.log(state.groups)
    },
    HANDLE_GROUP_MSG: (state, msg_dict) => {
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
              if (!state.groups[j].hasOwnProperty('dangerCount')) {
                Vue.set(state.groups[j], 'dangerCount', msg.detectedArr.length)
              } else {
                state.groups[j].dangerCount += msg.detectedArr.length
              }
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
    // 获取群头像
    getGroupHeadImage ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url: `${BaseUrl}/wx/contact/get_head_img`,
          params: {
            group_id: payload.group_id,
            username: payload.username,
          },
          withCredentials: true
        }).then((e) => {
          if (e && e.data && e.data.code === 200) {
            // commit('SET_GROUP_HEAD_IMAGE', e.data.data)
            resolve(`${BaseUrl}${e.data.data.FilePath}`)
          }
        })
      })
    }  
  }
}

export default group
