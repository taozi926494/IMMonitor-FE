<template>
  <div class="chat-window-container" :class="{ animated: css_animated, heartBeat: css_heartBeat, slideInUp: css_slideInUp }" @animationend="delteAnimation">
    <Drawer :title="`${group.NickName}（成员列表）`" :closable="false" v-model="showGroupList">
      <p
      v-for="(groupMember, index) in group.MemberList"
      :key="index"
      class="chat-groupList">
        <img src="../../assets/images/toux2.jpg" >
        <span>{{ groupMember.NickName }}</span>
      </p>
    </Drawer>
    <div class="Rate-box">
      <div class="rate-left">
        <div class="immonitor-text">违规指数：</div>
        <Rate disabled v-model="rateVaule" />
      </div>
      <span v-show="showInfoBtn" @click="() => ( toLink(group.group_id) )">详情</span>
    </div>
     <div class="chat-header">
      <span>
        <div v-show="showTopBtn" @click="() => ( neverTop(group.group_id) )" class="neverTop-box">
          <CustormIcon class="iconStyle" icon='icon-neverTop'/>
          <span>置顶</span>
        </div>
        <img :src="group.HeadImgUrl" alt="">
        <b>{{ group.NickName }}</b>
      </span>
      <div
        @click="openGroupPeopleList"
        class="chat-groupNum">
          <CustormIcon icon='icon-groupNum'/>
          <span>({{group.MemberCount}}人)</span>
        </div>
    </div>
    <div class="chat-content">
      <div class="chat-inner-container" ref="scrollPanel">
        <div class="content">
          <ul>
            <li v-for="msg in group.msg_list" :key="msg.MsgId" class="response-chat">
              <Message 
                :response-style="userInfo.NickName !== msg.FromUserNickName ? 'left' : 'right'"
                :type="msg.Type"
                :content="msg.Content"
                :detectedArr="msg.detectedArr"
                :fileUrl='msg.FilePath'
                :headImgUrl='msg.UserHeadImage'
                :nickName='msg.FromUserNickName'
                />
            </li>
          </ul>
        </div>
     </div>
    </div>
    <div class="chat-input-box">
      <textarea v-model="introduct" placeholder="Add a bio to your profile"></textarea>
      <button @click="() => { sendMsg(group) }">发送</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss';
</style>

<script>
// import Icon from '../iconComponent'
// import './index.scss';
import 'animate.css'
import Message from '@/components/Message'
import { mapGetters } from 'vuex'
import CustormIcon from '@/components/CustormIcon'

export default {
  data () {
    return {
      isRead: true,
      showGroupList: false,
      leftAudioPlay: 'icon-goutongye_yuyin_you_00',
      rightAudioPlay: 'icon-goutongye_yuyin_zuo_00',
      introduct: '',
      source: 'http://music.163.com/song/media/outer/url?id=431795489.mp3',
      altogetherTimer: null, // 音频总时长
      accomplishData: null, // 当前播放进度比
      // animate动画
      css_animated: false,
      css_heartBeat: false,
      css_slideInUp: false
    }
  },
  computed: {
    ...mapGetters(["userInfo", "groups", "warningGroupId", "selfHeadImage"]),
    rateVaule: function () {
      return this.group.rateVal ? this.group.rateVal : 0
    }
  },
  watch: {
    warningGroupId: function () {
      if (this.warningGroupId == this.group.group_id) {
        this.css_animated = true
        this.css_heartBeat = true
        this.css_isdanger = true
      }
    }
  },
  updated () {
    this.$refs.scrollPanel.scrollTop = this.$refs.scrollPanel.scrollHeight
  },
  props: {
    group: null,
    showTopBtn: {
      type: Boolean,
      default: true
    },
    showInfoBtn: {
      type: Boolean,
      default: true
    }
  },
  components: {
    CustormIcon,
    Message
  },
  methods: {
    neverTop (group_id) {
      this.$store.commit('SET_TOP', group_id)
      this.css_animated = true
      this.css_slideInUp = true
    },
    toLink (group_id) {
      this.$router.push(`/groupinfo/${group_id}`)
    },
    openGroupPeopleList () {
      this.showGroupList = true
    },
    donghua () {
      this.css_animated = true
      this.css_heartBeat = true
    },
    delteAnimation() {
      this.css_animated = false
      this.css_heartBeat = false
      this.css_slideInUp = false
      // 设置warningGroupId为空 以便下次触发
      this.$store.commit('SET_WARNING_GROUPID', null)
    },
    // 发送消息
    async sendMsg (group) {
      let response = await this.$store.dispatch('sendMsg', {
        to_username: group.UserName,
        content: this.introduct
      })
      if (response && response.code === 200) {
        this.$store.commit('ADD_SEND_MSG', {
          Content: this.introduct,
          FilePath: null,
          FromUserDisplayName: null,
          FromUserName: this.userInfo.UserName,
          FromUserNickName: this.userInfo.NickName,
          MsgId: new Date().valueOf() + Math.ceil(Math.random() * 10000),
          SendTime: new Date().valueOf(),
          Type: "Text",
          UserHeadImage: this.selfHeadImage,
          date_created: new Date(),
          detectedArr: [],
          group_id: group.group_id,
          user_uin: this.userInfo.uin,
        })
        this.introduct = ''
      }
    }
  }
}
</script>
