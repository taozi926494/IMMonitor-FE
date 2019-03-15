import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
// import mock_groups from '@/mock/groups'
// const BaseUrl = 'http://172.16.111.6:5000'
const BaseUrl = 'http://localhost:5000'

// 上线
// const BaseUrl = ''

Vue.use(Vuex)

const group = {
  state: {
    groups: [],
    previewImgUrl: null,
    warningGroupId: null,
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
        if (group.group_id === id) {
          _group_index = index
        }
      })
      let group_top = state.groups.splice(_group_index, 1)[0]
      state.groups.unshift(group_top)
    },
    HANDLE_GROUP_MSG: (state, msg_dict) => {
      if (msg_dict) {
        for (let i = 0; i < msg_dict.msg_list.length; i++) {
          let msg = msg_dict.msg_list[i]
          msg.detectedArr = []
          // 首先循环收到的消息数组及检测结果数组
          // 给对应的消息加上检测结果
          for (let d_i = 0; d_i < msg_dict.msg_list_detected.length; d_i++) {
            let detect_result = msg_dict.msg_list_detected[d_i]
            if (detect_result.msg_id == msg.MsgId) {
              msg.detectedArr.push(detect_result)
            }
          }
          // 向群组中添加消息
          for (let j = 0; j < state.groups.length; j++) {
            if (msg.group_id == state.groups[j].group_id) {
              state.groups[j].msg_list.push(msg)
              if (!state.groups[j].hasOwnProperty('dangerCount')) {
                Vue.set(state.groups[j], 'dangerCount', msg.detectedArr.length)
              } else {
                state.groups[j].dangerCount += msg.detectedArr.length
              }
              
              /**
             * Taoz: 2019-03-15 01:18
             * 给一个违规消息标志位，判断最近收到的消息中是否有违规消息
             * 如果不是违规消息，不需要报警，不然会造成正常消息重复报警的情况
             * 这个标志位会在checkAlarm检查是否超过违规阈值的函数中中清零
             */
              if (msg.detectedArr.length > 0) {
                if (!state.groups[j].hasOwnProperty('violating')) {
                  Vue.set(state.groups[j], 'violating', true)
                } else {
                  state.groups[j].violating = true
                }
              } else {
                if (!state.groups[j].hasOwnProperty('violating')) {
                  Vue.set(state.groups[j], 'violating', false)
                } else {
                  state.groups[j].violating = false
                }
              }

            }
          }
        }
      }
    },
    ADD_SEND_MSG: (state, msg) => {
      for (let i = 0; i < state.groups.length; i++) {
        if (state.groups[i].group_id === msg.group_id) {
          state.groups[i].msg_list.push(msg)
          break
        }
      }
    },
    RESET_VIOLATING: (state, group_id) => {
      for (let i = 0; i < state.groups.length; i++) {
        if (state.groups[i].group_id == group_id) {
          state.groups[i].violating = false
          break;
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
    },
    // 获取群的历史消息
    getGroupHistoryMsg ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url: `${BaseUrl}/wx/message/groups_lastmsg`,
          params: {
            uin: payload.uin
          },
          withCredentials: true
        }).then((e) => {
          if (e && e.data && e.data.code === 200) {
            resolve(e.data.data)
          }
        })
      })
    }  
  }
}

export default group
