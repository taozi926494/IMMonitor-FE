<template>
  <div v-if="group" class="chat_page_container">
    <div class="chat_info_top_box">
      <div class="chat_window">
        <GroupPanel :showInfoBtn='false' :showTopBtn='false' class="chat-window-container" :group="group"/>
      </div>
      <div class="chat_info_topright_box">
        <div class="chat_info_box">
          <div class="labelbox">
            <LabelBox 
            labelName='违规消息数'
            labelBg='#ed3f14'
            :countNum='statistic.detect_count'
            />
          </div>
          <div class="labelbox">
            <LabelBox 
            showPercent
            labelName='违规消息占比'
            labelBg='#e46cbb'
            :countNum='statistic.msg_percent'
            />
          </div>
        </div>
        <div class="danger_message_list">
          <span>
            <Icon type="md-notifications" />
            违规消息列表
          </span>
          <div class="outer-container">
            <div class="inner-container" ref="scrollWindow">
              <ul class="content">
                <li v-for="(item, index) in warningMsgList" :key="index">
                  <Message 
                  :responseStyle="userInfo.UserName !== item.FromUserName ? 'left' : 'right'"
                  :type='item.Type'
                  :content='item.Content'
                  :detectedArr='item.detectedArr'
                  :fileUrl='item.FilePath'
                  :headImgUrl='item.UserHeadImage'
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chat_info_bottom_box">
      <div class="danger_title">
        <CustormIcon class="danger_icon" icon='icon-danger'/>
        <span>群危险人物(TOP 3)：</span>
      </div>
      <div class="danger_top_box">
        <div v-for="(wordcloud, index) in wordcloudArr" :key="index">
          <WordCloud
            class="danger_info_box"
            :name="wordcloud.name" 
            :headImgUrl="wordcloud.headImgUrl"
            :chartData="wordcloud.keywords" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat_page_container{
  width: 100%;
  .chat_info_top_box{
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    .chat_window{
      width: 460px;
      .chat-window-container{
        margin-bottom: 0;
      }
    }
    .chat_info_topright_box{
      width: 500px;
      .chat_info_box{
        display: flex;
        align-content: flex-start;
        .labelbox{
          box-sizing: border-box;
          background-color: white;
          box-shadow: 0 0 5px rgba(0, 0, 0, .3);
          flex: 0 0 48%;
          margin-right: 15px;
          margin-bottom: 15px;
          border-radius: 6px;
          &:nth-child(2n) {
            margin-right: 0;
          }
        }
      }
      .danger_message_list{
        width: 100%;
        height: 390px;
        box-shadow: 0 0 5px rgba(0, 0, 0, .3);
        box-sizing: border-box;
        & > span{
          height: 35px;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #797878;
          color: #fff;
        }
        .outer-container{
          width: 100%;
          height: 355px;
          position: relative;
          overflow: hidden;
          text-align: left;
          box-sizing: border-box;
          background-color: #dfdfdf;
          .inner-container {
            width: 100%;
            position: absolute; 
            left: 0;
            bottom: 0;
            overflow-x: hidden;
            overflow-y: scroll;
            height: 355px;
            padding: 20px 30px;
            .content{
              width: 100%;
              height: 355px;
              li{
                display: flex;
                align-items: center;
                justify-content: flex-start;
                margin-bottom: 10px;
                .user_Info{
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  b{
                    font-size: 12px;
                    width: 60px;
                    overflow:hidden;
                    text-overflow:ellipsis;
                    white-space:nowrap
                  }
                  img{
                    width: 30px;
                    height: 30px;
                  }
                }
                .message{
                  font-size: 15px;
                }
              }
            }
          }
           /* for Chrome */
          .inner-container::-webkit-scrollbar {
            display: none;
          }
        }
      }
    }
  }
  .chat_info_bottom_box{
    width: 100%;
    box-sizing: border-box;
    padding: 0 15px;
    .danger_title{
      width: 100%;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .danger_icon{
        width: 30px;
        height: 30px;
        margin-right: 6px;
      }
    }
    .danger_top_box{
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .danger_info_box{
        width: 290px;
        margin-right: 18px;
      }
    }
  }
}
</style>

<script>
import GroupPanel from '@/components/GroupPanel'
import LabelBox from '@/components/LabelBox'
import WordCloud from '@/components/MyCharts'
import CustormIcon from '@/components/CustormIcon'
import axios from 'axios'
import Message from '@/components/Message'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      wordcloudArr: [],
      statistic: {
        group_count: 0,
        msg_count: 0,
        detect_count: 0,
        msg_percent: 0,
      },
      tmp: []
    }
  },
  computed: {
    ...mapGetters(['otherUsersHeadImage', 'userInfo', 'groups']),
    group: function () {
      let group = this.groups.find((group) => {
        if (group.group_id === Number(this.$route.params.group_id)) {
          return group
        }
      })
      return group
    },
    warningMsgList: function () {
      let list = this.group.msg_list.filter((msg) => {
        return msg.detectedArr.length > 0
      })
      return list
    }
  },
  components: {
    GroupPanel,
    LabelBox,
    WordCloud,
    CustormIcon,
    Message
  },
  updated () {
    this.$refs.scrollWindow.scrollTop = this.$refs.scrollWindow.scrollHeight
  },
  mounted() {
    this.getWordCloud()
    this.getStatistic()
  },
  methods: {
    getStatistic() {
      axios({
        method: 'get',
        url: 'http://172.16.111.6:5000/analysis/statistic',
        params: {
          uin: this.userInfo.uin,
        },
        withCredentials: true
      }).then((res) => {
        this.statistic = res.data.data
        if (this.statistic.msg_count > 0) {
          this.statistic.msg_percent = Math.round(this.statistic.detect_count / this.statistic.msg_count * 100)
        }
      })
    },
    async HandleDataWordCloud (wordcloud) {
      /*
                                 [
        {                          {
        "Taoz": {                    name: "Taoz",
          "keywords": {              headImgUrl: null   
            "垃圾": 2                 keywords: [
          }                            {
        },               =>              name: '垃圾',
        "袁公萍": {                       value: 2
          "keywords": {                },
            "操他妈": 1,               ...
            "傻逼": 2,                ]
          }                        },
        }                        ...
                                ]
      */
      
      // 先转为数组
      for (let member in wordcloud) {
        let kwArr = []
        let memberHeadImgUrl = null
        // let tmp = null
        for (let kw in wordcloud[member].keywords) {
          let t = {
            name : null,
            value: 0
          }
          t.name = kw
          t.value = wordcloud[member].keywords[kw]
          kwArr.push(t)
        }
        // 去获取对应的头像
        let userObj = this.group.MemberList.find((user) => {
          return user.NickName === member
        })
        if (userObj && userObj.NickName === member) {
          let HeadPath = null
          for (let i = 0; i < this.otherUsersHeadImage.length; i++) {
            if (
              this.otherUsersHeadImage[i].username === userObj.UserName &&
              this.otherUsersHeadImage[i].headPath
            ) {
              HeadPath = this.otherUsersHeadImage[i].headPath
              break
            }
          }
          if (HeadPath) {
            memberHeadImgUrl = HeadPath
            this.tmp = {
              name: member,
              keywords: kwArr,
              headImgUrl: memberHeadImgUrl
            }
            this.wordcloudArr.push(this.tmp)
          } else {
            let ImgSrc = await this.$store.dispatch('getOtherHeadImage', {
              group_id: this.group.group_id,
              encry_chatroom_id: this.group.EncryChatRoomId,
              username: userObj.UserName,
              user_nickname: userObj.NickName
            })
            this.tmp = {
              name: member,
              keywords: kwArr,
              headImgUrl: ImgSrc
            }
            this.wordcloudArr.push(this.tmp)
          }
        }
      }
      // 再排序取出最前面的三个
      this.wordcloudArr.sort((a, b) => {
        return b.keywords.length - a.keywords.length
      }).slice(0, 3)
    },
    getWordCloud() {
      axios({
        method: 'get',
        url: 'http://172.16.111.6:5000/analysis/member_wordcloud',
        params: {
          group_id: this.group.group_id
        },
        withCredentials: true
      }).then((res) => {
        this.HandleDataWordCloud(res.data.data)
      })
    }
  }
}
</script>
