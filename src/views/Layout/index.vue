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
                  <router-view>
                  </router-view>
                  <Spin class="loadingStyle" v-if='groups.length > 0 ? false : true'>
                    <Icon type="ios-loading" size=38 class="demo-spin-icon-load"></Icon>
                    <div class="text">{{ loadingStatus }}...</div>
                  </Spin>
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
    </div>
</template>
<style lang="scss" scoped>
.loadingStyle{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
  .text{
    font-size: 16px;
    margin-top: 8px;
  }
}
.originalAudio{
  width: 0;
  height: 0;
  audio{
    width: 0;
    height: 0;
  }
}
.menuList{
  display: flex;
  align-items: center;
  justify-content: center;
}
.ivu-layout-content {
  background-color: #F5F7F9 !important;
}
.iconStyle::before{
  font-size: 20px;
}
.ivu-menu-item{
  font-size: 15px;
  i{
    margin-right: 0;
  }
}
.layout{
    background: #f5f7f9;
    position: relative;
    overflow: hidden;
    height: 100%;
    .container{
      height: 100%;
    }
    .project_name{
      height: 80px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: -1px 1px 1px 1px rgba(0, 0, 0, .7);
      z-index: 999;
      position: relative;
      width: 100%;
      box-sizing: border-box;
      span{
        font-size: 18px;
        padding: 0 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .layout-header-bar{
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px 0 0;
    box-sizing: border-box;
    .layout-header-bar-left{
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .layout-header-bar-left-company{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-left: 8px;
        img{
          width: 35px;
          height: 35px;
          margin-right: 8px;
        }
        span{
          font-size: 16px;
        }
      }
    }
  }
}
.menu-icon{
    transition: all .3s;
    cursor: pointer;
}
.avatar-icon{
  cursor: pointer;
}
.rotate-icon{
    transform: rotate(-90deg);
}
.menu-item span{
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
    margin-left: 10px;
}
.menu-item i{
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
}
.collapsed-menu span{
    width: 0px;
    transition: width .2s ease;
    margin: 0;
}
.collapsed-menu i{
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
}
</style>

<script>
import Vue from 'vue'
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
      loadingStatus: '登录成功'
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
      'warningTipDuration'
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
  created () {
    if (!this.userInfo.uin) {
      this.wxInit()
      this.loadingStatus = '初始化个人信息'
    }
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
          this.loadingStatus = '获取群数据中'
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
            if (this.otherUsersHeadImage[i].username === itemMsg.FromUserName) {
              HeadPath = this.otherUsersHeadImage[i].headPath
              break
            }
          }
          /**
           *  给每一条消息添加头像url及时间
           */
          if (HeadPath) {
            Vue.set(itemMsg, 'UserHeadImage', HeadPath)
            Vue.set(itemMsg, 'SendTime', (new Date()).valueOf())
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
              Vue.set(itemMsg, 'UserHeadImage', headPath)
              Vue.set(itemMsg, 'SendTime', (new Date()).valueOf())
              return
            })
          }
        })
        this.$store.commit('HANDLE_GROUP_MSG', data.group_msg_list)
        this.checkWarningAlert(this.groups)
        this.checkWarningRate(this.groups)
      }
    },
    // 检查是否超过警告 超出就报警
    checkWarningAlert (groups) {
      groups.map((group) => {
        // 当前时间的前n秒
        let danger_msg_counter = 0;
        let beforTime = new Date().valueOf() - this.warningTime
        for (let i = 0; i < group.msg_list.length; i++) {
          let msg = group.msg_list[i]
          if (msg.SendTime > beforTime) {
            if (msg.detectedArr.length > 0){
              ++danger_msg_counter;
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
          this.$store.commit('SET_WARNING_GROUPID', group.group_id)
        }
      }) 
    },
    // 检查违规条数、来评定星级
    checkWarningRate (groups) {
      let arr = []
      groups.map((item) => {
        if (item.dangerCount) {
          arr.push(item.dangerCount)
        }
      })
      if (arr.length > 0) {
        let MaxDangerVal = arr.sort().pop()
        groups.map((item) => {
          let Divisor = MaxDangerVal / 5
          Vue.set(item, 'rateVal', Math.ceil(item.dangerCount / Divisor))
        })
      }
      this.$store.commit('SET_GROUPS', groups)
    }
  }
}
</script>
