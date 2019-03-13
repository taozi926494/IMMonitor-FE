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
      <span>详情</span>
    </div>
     <div class="chat-header">
      <span>
        <div @click="() => ( neverTop(group.group_id) )" class="neverTop-box">
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
                :response-style="userInfo.UserName !== msg.FromUserName ? 'left' : 'right'"
                :type="msg.Type"
                :content="msg.Content"
                :detectedArr="msg.detectedArr"
                :fileUrl='msg.FilePath'
                :headImgUrl='msg.UserHeadImage'
                />
            </li>
          </ul>
        </div>
     </div>
    </div>
    <div class="chat-input-box">
      <textarea v-model="introduct" placeholder="Add a bio to your profile"></textarea>
    </div>
  </div>
</template>

<script>
// import Icon from '../iconComponent'
import 'animate.css'
import './index.scss';
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
    ...mapGetters(["userInfo", "groups", "warningGroupId"]),
    rateVaule: function () {
      return this.group.rateVal ? this.group.rateVal : 0
    }
  },
  watch: {
    warningGroupId: function () {
      if (this.warningGroupId == this.group.group_id) {
        this.css_animated = true
        this.css_heartBeat = true
      }
    }
  },
  
  updated () {
    this.$refs.scrollPanel.scrollTop = this.$refs.scrollPanel.scrollHeight
  },
  props: {
    group: null,
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
    }
  }
}
</script>
