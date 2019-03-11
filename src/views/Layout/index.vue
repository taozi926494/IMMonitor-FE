<template>
    <div class="layout">
        <Layout class="container">
            <Sider ref="side1" hide-trigger collapsible :width="230" :collapsed-width="78" v-model="isCollapsed">
                <div class="project_name">
                  <span>通讯软件危险监测系统</span>
                </div>
                <Menu :on-open-change="selectMenuFn" active-name="1-1" theme="dark" width="auto" :class="menuitemClasses">
                    <MenuItem
                    class="menuList"
                    v-for="(item, index) in menu"
                    :key="index"
                    :name="item.name"
                    :to="item.path">
                        <Icon :type="item.icon" />
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
                    <Button @click="doCheck">轮训检查</Button>
                    <Button @click="doGetMsg">接收消息</Button>
                  </div>
                  <div class="layout-header-bar-right">
                    <Dropdown trigger="click" style="margin-left: 20px">
                      <a href="javascript:void(0)">
                        <Avatar shape="square" :src="headImgUrl ? headImgUrl : require('@/assets/images/headpic.png')" size="large" />
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
    </div>
</template>
<style lang="scss" scoped>
.menuList{
  display: flex;
  align-items: center;
  justify-content: center;
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
// import axios from '@/tools/api.request'
// import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
export default {
  name: 'IndexPage',
  data () {
    return {
      isCollapsed: false,
      menu: [
        {title: '控制台', icon: 'ios-chatbubbles', name: '1-1', path: '/'},
        {title: '群管理', icon: 'ios-contacts', name: '1-2', path: '/group'},
        {title: '个人中心', icon: 'ios-contact', name: '1-3', path: '/user'}
      ],
      headImgUrl: null
    }
  },
  components: {
    
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'groups'
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
    console.log(this.userInfo.uin)
    if (!this.userInfo.uin) {
      this.wxInit()
    }
  },
  methods: {
    // openDB (name) {
    //   let request = window.indexedDB.open(name)
    //   request.onerror = function (e) {
    //     console.log(e)
    //   }
    //   request.onsuccess = function (e) {
    //     return e.target.result
    //   }
    // },
    collapsedSider () {
      this.$refs.side1.toggleCollapse()
    },
    selectMenuFn (name) {
      console.log(name)
    },
    async wxInit () {
      try {
        let data = await this.$store.dispatch('wxInit')
        console.log(data)
        if (data && data.code === 200) {
          this.getGroupContact()
        }
      } catch (error) {

      }
    },
    async getGroupContact () {
      try {
        let groups_ret = await this.$store.dispatch('getGroupContact')
        console.log(groups_ret)
        this.syckCheck()
      } catch (error) {
        console.log(error)
      }
    },
    async syckCheck () {
      try {
        let check_ret = await this.$store.dispatch('syckCheck')
        console.log('check_ret', check_ret)
        if (check_ret.code == 200) {
          if (check_ret.data.message_status == 2 || check_ret.data.message_status == 4 || check_ret.data.message_status == 6) {
            let msg_ret = await this.$store.dispatch('getGroupMsg')
            
            if (msg_ret.code == 200) {
              if (msg_ret.data) {
                this.$store.commit('HANDLE_GROUP_MSG', msg_ret.data.group_msg_list)
              }
            }
            this.$store.dispatch('setMsgCheckStatus', false)
            this.syckCheck()
          }
        } else {
          alert(check_ret.msg)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async doCheck() {
    let check_ret = await this.$store.dispatch('syckCheck')
      console.log(check_ret)
    },
    async doGetMsg() {
      let msg_ret = await this.$store.dispatch('getGroupMsg')
       console.log(msg_ret)
      if (msg_ret.code == 200) {
        if (msg_ret.data) {
          this.$store.commit('HANDLE_GROUP_MSG', msg_ret.data.group_msg_list)
        }
      }
    }
  }
  
}
</script>
