<template>
  <div v-if="responseStyle === 'left' && type === 'Text'" class="response-chat">
    <img :src="headImgUrl" alt="">
    <div class="chat-left">
      <p>{{ content }}</p>
      <span v-show="isDanger">
        <a
          v-for="(item, index) in detectedArr"
          :key="index"
          :title="formatTipContent(item.result_label)"
          :style="{backgroundColor: formatTipBg(item.result_label)}">
          {{ formatTip(item.result_label) }}
        </a>
      </span>
    </div>
  </div>
  <div v-else-if="responseStyle === 'right' && type === 'Text'"  class="send-chat">
    <div class="chat-right">
      <p>{{ content }}</p>
      <span v-show="isDanger">
        <a
          v-for="(item, index) in detectedArr"
          :key="index"
          :title="formatTipContent(item.result_label)"
          :style="{backgroundColor: formatTipBg(item.result_label)}">
          {{ formatTip(item.result_label) }}
        </a>
      </span>
    </div>
    <img :src="headImgUrl ? headImgUrl : require('../../assets/images/toux2.jpg')" alt="">
  </div>
  <div v-else-if="responseStyle === 'left' && type === 'Audio'" class="response-audio-chat">
    <div class="audio-chat-box-left">
      <img :src="headImgUrl ? headImgUrl : require('../../assets/images/toux1.jpeg')">
      <div
        @click='playAudioFn'
        class="chat-left">
        <span v-show="isDanger">
          <a
            v-for="(item, index) in detectedArr"
            :key="index"
            :title="formatTipContent(item.result_label)"
            :style="{backgroundColor: formatTipBg(item.result_label)}">
            {{ formatTip(item.result_label) }}
          </a>
        </span>
        <CustormIcon :icon='leftAudioPlay'/>
        <b>{{ countTime }}s</b>
      </div>
    </div>
    <div class="audioText-left">
      <p>{{ content }}</p>
    </div>
  </div>
  <div v-else-if="responseStyle === 'right' && type === 'Audio'" class="send-audio-chat">
    <div class="audio-chat-box-right">
      <div
        @click='playAudioFn'
        class="chat-right">
        <span v-show="isDanger">
          <a
            v-for="(item, index) in detectedArr"
            :key="index"
            :title="formatTipContent(item.result_label)"
            :style="{backgroundColor: formatTipBg(item.result_label)}">
            {{ formatTip(item.result_label) }}
          </a>
        </span>
        <b>{{ countTime }}s</b>
        <CustormIcon :icon='rightAudioPlay'/>
      </div>
      <img :src="headImgUrl ? headImgUrl : require('../../assets/images/toux2.jpg')">
    </div>
    <div class="audioText-right">
      <p>{{ content }}</p>
    </div>
  </div>
  <div v-else-if="responseStyle === 'left' && type === 'Image'" class="response-image-chat">
    <div class="image-chat-box-left">
      <img :src="headImgUrl ? headImgUrl : require('../../assets/images/toux1.jpeg')">
      <div
        @click='checkImage'
        class="chat-left">
        <span v-show="isDanger">
          <a
            v-for="(item, index) in detectedArr"
            :key="index"
            :title="formatTipContent(item.result_label)"
            :style="{backgroundColor: formatTipBg(item.result_label)}">
            {{ formatTip(item.result_label) }}
          </a>
        </span>
        <img :src="NewFileUrl" alt="">
      </div>
    </div>
  </div>
  <div v-else-if="responseStyle === 'right' && type === 'Image'" class="send-image-chat">
    <div class="image-chat-box-right">
      <div
        @click='checkImage'
        class="chat-right">
        <img :src="NewFileUrl" alt="">
        <span v-show="isDanger">
          <a
            v-for="(item, index) in detectedArr"
            :key="index"
            :title="formatTipContent(item.result_label)"
            :style="{backgroundColor: formatTipBg(item.result_label)}">
            {{ formatTip(item.result_label) }}
          </a>
        </span>
      </div>
      <img :src="headImgUrl ? headImgUrl : require('../../assets/images/toux2.jpg')">
    </div>
  </div>
</template>


<script>
import  './index.scss'
import CustormIcon from '@/components/CustormIcon'
export default {
  name: 'weChatNewsComponent',
  data () {
    return {
      leftAudioPlay: 'icon-goutongye_yuyin_you_00',
      rightAudioPlay: 'icon-goutongye_yuyin_zuo_00',
    }
  },
  computed: {
    NewFileUrl: function () {
      return `http://172.16.111.6:5000${this.fileUrl}`
      // return `http://localhost:5000${this.fileUrl}`

      // 上线
      // return this.fileUrl
    }
  },
  components: {
    CustormIcon
  },
  props: {
    // 左右样式判断
    responseStyle: {
      type: String
    },
    // 消息类型
    type: {
      type: String,
      default: 'Text'
    },
    // 消息内容 文字消息/语音翻译消息
    content: {
      type: String,
      default: ''
    },
    // 涉嫌的词汇tip数组
    detectedArr: {
      type: Array,
      default: []
    },
    // 图片地址或者音频地址
    fileUrl: {
      type: String
    },
    // 图像地址
    headImgUrl: {
      type: String
    },
    countTime: {
      type: String,
      default: '--'
    },
    isDanger: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    playAudioFn () {
      this.$emit('click', this.fileUrl)
    },
    formatTipContent (id) {
      switch (id) {
        case 1: return '色情'
        case 2: return '性感'
        case 3: return '暴恐'
        case 4: return '恶心'
        case 5: return '水印码'
        // case 6: return '二维码'
        // case 7: return '条形码'
        case 8: return '政治人物'
        case 9: return '敏感词'
        case 21: return '暴恐违禁'
        case 22: return '文本色情'
        case 23: return '政治敏感'
        case 24: return '恶意推广'
        case 25: return '低俗辱骂'
        // case 16: return '低质灌水'
      }
    },
    formatTip (id) {
      switch (id) {
        case 1: return '色'
        case 2: return '性'
        case 3: return '暴'
        case 4: return '恶'
        case 5: return '水'
        // case 6: return '二'
        // case 7: return '条'
        case 8: return '政'
        case 9: return '敏'
        case 21: return '暴'
        case 22: return '色'
        case 23: return '政'
        case 24: return '恶'
        case 25: return '骂'
        // case 26: return '水'
      }
    },
    formatTipBg (id) {
      switch (id) {
        case 1: return '#f9dd15'
        case 2: return '#f99315'
        case 3: return '#f91515'
        case 4: return '#58f915'
        case 5: return '#1590f9'
        // case 6: return '#1590f9'
        // case 7: return '#1590f9'
        case 8: return '#171615'
        case 9: return '#ea5b17'
        case 21: return '#f91515'
        case 22: return '#f9dd15'
        case 23: return '#171615'
        case 24: return '#58f915'
        case 25: return '#ea7817'
        // case 16: return '#e8e45c'
      }
    },
    checkImage () {
      this.$store.commit('SET_PREVIEW_IMG_URL', this.NewFileUrl)
    },
  }
}
</script>
