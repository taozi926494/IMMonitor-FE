<template>
    <div class="layout">
        <Layout class="container">
            <Sider ref="side1" hide-trigger collapsible :width="230" :collapsed-width="78" v-model="isCollapsed">
                <div class="project_name">
                  <span>通讯软件危险监测系统</span>
                </div>
                <Menu active-name="1-1" theme="dark" width="auto" :class="menuitemClasses">
                  <MenuItem
                  class="menuList"
                  v-for="(item, index) in menu"
                  :key="index"
                  :name="item.name"
                  :to="item.path">
                      <icon class="iconStyle" :type='item.icon' />
                      <span>{{item.title}}</span>
                  </MenuItem>
                </Menu>
            </Sider>
            <Layout>
                <Header class="layout-header-bar">
                  <div class="layout-header-bar-left">
                    <Icon @click="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu" size="40"></Icon>
                    <div class="layout-header-bar-left-company">
                      <img src="@/assets/images/logo.png" alt="">
                      <span>国家工程实验室</span>
                    </div>
                    <!-- <Button @click="doCheck">轮训检查</Button>
                    <Button @click="doGetMsg">接收消息</Button> -->
                  </div>
                  <div class="layout-header-bar-right">
                    <Dropdown trigger="click" style="margin-left: 20px">
                      <a href="javascript:void(0)">
                        <Avatar shape="square" :src="selfHeadImage" size="large" />
                        <Icon class="avatar-icon" type="md-arrow-dropdown" />
                      </a>
                      <DropdownMenu slot="list">
                        <DropdownItem>个人中心</DropdownItem>
                        <DropdownItem>登出</DropdownItem>
                      </DropdownMenu>
                  </Dropdown>
                  </div>
                </Header>
                <Content :style="{margin: '1px', background: '#fff', width: '100%', overflow: 'scroll', padding: '20px'}">
                  <router-view/>
                </Content>
                
            </Layout>
        </Layout>
        <!-- 产生 警报声音 -->
        <div class="originalAudio">
          <audio
            ref='audioEl'
            autobuffer
            controls="controls"
            id="myAudio">
            <source
              src="../../assets/warning.mp3"
              type="audio/mpeg">
          </audio>
        </div>

        <Drawer id="alarmDrawer" title="危险消息列表" :closable="false" v-model="alarmDrawerShow">
          <div class="alarmMsgBox" v-for="(group_val, group_key) in alarmMsgs" :key=group_key>
            <div class="title">
              来自群: {{ group_val.GroupNickName }}
            </div>
            <p v-for="(msg, msgId) in group_val.msg" :key="msgId"> {{msg.Content}} </p>
          </div> 
        </Drawer>
        <div id="alarmMsgTip" @click="alarmDrawerShow = !alarmDrawerShow">
          <i class="alarm-num"> {{ alarmCount }}</i>
          <Icon type="md-notifications" />
          
        </div> 
    </div>
</template>

<style lang="scss" scoped>
@import './index.scss';
</style>


<script>
// import axios from 'axios'
// import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
export default {
  name: 'IndexPage',
  data () {
    return {
      isCollapsed: false,
      menu: [
        {title: '控制台', icon: 'ios-chatbubbles', name: '1-1', path: '/'},
        {title: '群管理', icon: 'ios-contacts', name: '1-2', path: '/grouplist'},
        {title: '个人中心', icon: 'ios-contact', name: '1-3', path: '/user'}
      ],
      alarmDrawerShow: false,
      alarmCount: 0
    }
  },
  
  components: {
    
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'groups',
      'selfHeadImage',
      'otherUsersHeadImage',
      'warningTime',
      'warningMaxNum',
      'warningTipDuration',
      'alarmMsgs'
    ]),
    rotateIcon () {
      return [
        'menu-icon',
        this.isCollapsed ? 'rotate-icon' : ''
      ]
    },
    menuitemClasses () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    }
  },
  mounted () {
    if (!this.userInfo.uin) {
      this.wxInit()
    }
  },
  updated () {
    let count = 0
    for (let group_idk in this.alarmMsgs) {
      let group = this.alarmMsgs[group_idk]
      count += Object.keys(group.msg).length
    }
    this.alarmCount = count
  },
  methods: {
    collapsedSider () {
      this.$refs.side1.toggleCollapse()
    },
    playWarningAudioFn () {
      let audioEl = this.$refs.audioEl
      if (audioEl.paused) {
        audioEl.play()
      }
    },
    async wxInit () {
      try {
        let data = await this.$store.dispatch('wxInit')
        await this.$store.dispatch('getSelfHeadImage', {
          uin: data.data.uin,
          username: data.data.UserName
        })
        if (data && data.code === 200) {
          this.getGroupContact()
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getGroupContact () {
      try {
        let groups_ret = await this.$store.dispatch('getGroupContact')
        groups_ret.data.map((group) => {
          this.$store.dispatch('getGroupHeadImage', {
            group_id: group.group_id,
            username: group.UserName
          }).then((groupHeadImage) => {
            Object.assign(group, {'HeadImgUrl': groupHeadImage})
          })
          this.$store.commit('SET_GROUPS', groups_ret.data)
        })
        this.syckCheck()
      } catch (error) {
        console.log(error)
      }
    },
    async syckCheck () {
      try {
        let check_ret = await this.$store.dispatch('syckCheck')
        // 如果检查返回成功
        if (check_ret.code == 200) {
          // 2、4、6代表有新消息
          if (check_ret.data.message_status == 2 || check_ret.data.message_status == 4 || check_ret.data.message_status == 6) {
            let msg_ret = await this.$store.dispatch('getGroupMsg')
            if (msg_ret.code == 200 && msg_ret.data) {
              this.getMegUserHeadImage(msg_ret.data)
            }
            this.syckCheck()
          } else {
            //  msg_status 等于其他都是没有新消息，继续调用sync_check接口
            this.syckCheck()
          }

        } else {
          // 检查新消息返回失败（已过期需要重新登录）
          alert(check_ret.msg)
        }
      } catch (error) {
        console.log('error', error)
      }
    },
    // 获取最新消息后检查在store中是否有头像 没有就请求获取并存储
    getMegUserHeadImage (data) {
       if (data.group_msg_list.msg_list.length > 0) {
        data.group_msg_list.msg_list.map((itemMsg) => {
          let HeadPath = null
          for (let i = 0; i < this.otherUsersHeadImage.length; i++) {
            if (
              this.otherUsersHeadImage[i].username === itemMsg.FromUserName
            ) {
              HeadPath = this.otherUsersHeadImage[i].headPath
              break
            }
          }

          /**
           *  给每一条消息添加头像url及时间
           */
          if (HeadPath) {
            Object.assign(itemMsg, {
              'UserHeadImage': HeadPath,
              'SendTime': (new Date()).valueOf()
            })
          } else {
            let chatRoomId = this.groups.find((e) => {
              if (e.group_id === itemMsg.group_id) {
                return e.EncryChatRoomId
              }
            })
            this.$store.dispatch('getOtherHeadImage', {
              group_id: itemMsg.group_id,
              encry_chatroom_id: chatRoomId.EncryChatRoomId,
              username: itemMsg.FromUserName,
              user_nickname: itemMsg.FromUserNickName
            }).then((headPath) => {
              this.$store.commit('SET_OTHER_USER_HEAD_IMAGE', {
                group_id: itemMsg.group_id,
                username: itemMsg.FromUserName,
                headPath: headPath
              })
              Object.assign(itemMsg, {
                'UserHeadImage': headPath,
                'SendTime': (new Date()).valueOf()
              })
              return
            })
          }
        })
        this.$store.commit('HANDLE_GROUP_MSG', data.group_msg_list)
        this.checkWarningAlert(this.groups)
      }
    },
    checkWarningAlert (groups) {
      groups.map((group) => {
        // 当前时间的前n秒
        let danger_msg_counter = 0;
        let beforTime =new Date().valueOf() - this.warningTime
        let alermMsg = {
          group_id: group.group_id,
          GroupNickName: group.NickName,
          msg: {}
        }
        for (let i = 0; i < group.msg_list.length; i++) {
          let msg = group.msg_list[i]
          if (msg.SendTime > beforTime) {
            if (msg.detectedArr.length > 0){
              ++danger_msg_counter;
              alermMsg['msg'][msg.MsgId] = msg
            } else {
              break;
            }
          }
        }
        if (danger_msg_counter >= this.warningMaxNum) {
          this.playWarningAudioFn()
          this.$Notice.warning({
            title: `群：${group.NickName}近期违规消息过多`,
            desc: `这个群有${danger_msg_counter}个警告`,
            duration: this.warningTipDuration
          });
          console.log(alermMsg)
          this.$store.commit('SET_WARNING_GROUPID', group.group_id)
          this.$store.commit('SET_ALARM_MSGS', alermMsg)
        }
      }) 
    }
  }
}
</script>
