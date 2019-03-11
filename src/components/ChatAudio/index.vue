<template>
<div>
  <!-- 来自于别人 -->
  <div v-if="responseStyle === 'left'" class="response-audio-chat">
    <div class="audio-chat-box-left">
      <img :src="require('../../assets/images/toux1.jpeg')">
      <div
        @click.self='playAudioFn'
        class="chat-left">
         <Icon type="ios-volume-up" />
        <span v-show="isDanger">暴</span>
        <b>{{ countTime ? countTime : altogetherTimer }}</b>
      </div>
    </div>
    <div class="audioText-left">大手大脚卡上大卡司好久</div>
  </div>

  <!-- 来自于自己 -->
  <div v-else class="send-audio-chat">
    <div class="audio-chat-box-right">
      <div
     
        @click.self='playAudioFn'
        class="chat-right">
        <span v-show="isDanger">黄</span>
        <b>{{ countTime ? countTime : altogetherTimer }}</b>
      </div>
      <img :src="require('../../assets/images/toux2.jpg')">
    </div>
    <div class="audioText-right">大手大脚卡上大卡司大厦将颠撒谎搭建大叔控快点哈说好久</div>
  </div>
</div>
</template>

<style lang="scss" scoped>
img{
  width: 40px;
  height: 40px;
  position: relative;
  top: 0;
}
.chat-left, .chat-right{
  min-height: 40px;
  position: relative;
  top: 0;
  text-align: left;
  border-radius: 5px;
  padding: 8px 10px;
  max-width: 330px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chat-left {
  margin-left: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
}
.chat-right{
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #9EEA6A;
}
.chat-left:before, .chat-right:after{   /*用伪类写出小三角形*/
  content: '';
  display: block;
  width: 0;
  height: 0;
  border: 8px solid transparent;
  position: absolute;
  top: 11px;
}
.chat-left:before{
  border-right: 8px solid #fff;
  left: -16px;
}
.chat-right:after{
  border-left: 8px solid #9EEA6A;
  right: -16px;
}
.originalAudio{
  width: 0;
  height: 0;
  audio{
    width: 0;
    height: 0;
  }
}
.audioText-left, .audioText-right{
  font-size: 12px;
  max-width: 200px;
  min-height: 40px;
  background: #fff;
  margin-top: 5px;
  padding: 8px;
  position: relative;
  display: flex;
  align-items: center;
  text-align: left;
}
.response-audio-chat{
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  .audio-chat-box-left{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .chat-left{
      min-width: 100px;
      position: relative;
      span{
        position: absolute;
        right: -26px;
        top: 0px;
        width: 20px;
        height: 20px;
        color: #fff;
        font-size: 12px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #ff0000;
      }
      b{
        font-size: 14px;
        font-weight: normal;
      }
    }
  }
  .audioText-left{
    left: 57px;
  }
}
.send-audio-chat{
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  .audio-chat-box-right{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .chat-right{
      min-width: 100px;
      position: relative;
      span{
        position: absolute;
        left: -26px;
        top: 0px;
        width: 20px;
        height: 20px;
        color: #fff;
        font-size: 12px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #ff0000;
      }
      b{
        font-size: 14px;
        font-weight: normal;
      }
    }
  }
  .audioText-right{
    right: 57px;
  }
}
</style>

<script>
// import Icon from '../iconComponent'
let timer
let timer2
export default {
  data () {
    return {
      altogetherTimer: null, // 音频总时长
      countTime: null, // 倒计时时间
      leftAudioPlay: 'icon-goutongye_yuyin_you_00',
      rightAudioPlay: 'icon-goutongye_yuyin_zuo_00'
    }
  },
  components: {
    // Icon
  },
  props: {
    responseStyle: {
      type: String
    },
    source: {
      type: String,
      default: 'http://music.163.com/song/media/outer/url?id=431795489.mp3'
    },
    isDanger: {
      type: Boolean,
      default: true
    },
    audioTime: {
      type: Number,
      default: 10
    }
  },
  watch: {
    countTime: function (val, oldVal) {
      if (val === 0) {
        clearInterval(timer2)
        this.responseStyle === 'left'
          ? this.leftAudioPlay = 'icon-goutongye_yuyin_you_00'
          : this.rightAudioPlay = 'icon-goutongye_yuyin_zuo_00'
      }
    }
  },
  methods: {
    // oncanplaythrough 事件在视频/音频（audio/video）可以正常播放且无需停顿和缓冲时触发
    oncanplaythrough () {
      this.altogetherTimer = Math.round(this.$refs.audioEl.duration) === Infinity ? 0 : Math.round(this.$refs.audioEl.duration)
    },
    playAudioFn (e) {
      let index = 0
      let audioEl = this.$refs.audioEl
      // let audioEl = e.path[2].children[2].audioEl
      // console.log(e.path[2].children[2].children[0])
      // console.log(this.$refs.audioEl)
      if (audioEl.paused && this.altogetherTimer) {
        audioEl.play()
        clearInterval(timer) // 清除计时器
        clearInterval(timer2) // 清除计时器
        timer = setInterval(() => {
          this.countTime = this.altogetherTimer - Math.round(audioEl.currentTime)
        }, 1000)
        timer2 = setInterval(() => {
          if (this.responseStyle === 'left') {
            let num = index++
            if (num <= 3) return this.leftAudioPlay = `icon-goutongye_yuyin_you_0${num}`
            this.leftAudioPlay = 'icon-goutongye_yuyin_you_01'
            index = 2
          } else {
            let num = index++
            if (num <= 3) return this.rightAudioPlay = `icon-goutongye_yuyin_zuo_0${num}`
            this.rightAudioPlay = 'icon-goutongye_yuyin_zuo_01'
            index = 2
          }
        }, 500)
      } else {
        audioEl.pause()
        clearInterval(timer) // 清除计时器
        clearInterval(timer2) // 清除计时器
        this.responseStyle === 'left'
          ? this.leftAudioPlay = 'icon-goutongye_yuyin_you_00'
          : this.rightAudioPlay = 'icon-goutongye_yuyin_zuo_00'
      }
    }
  }
}
</script>
