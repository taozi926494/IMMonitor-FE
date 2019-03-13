<template>
  <Row :gutter="20">
    <i-col span="8">
      <Card class="userinfo-card">
        <img :src="infoCardHeader" class="head-bg">
        <img :src="selfHeadImage" class="avatar">
        <p class="username">{{userInfo.NickName}}</p>
        <div class="info">
          <p>监测群: <strong>{{groups.length}}</strong> 个</p>
          <p>已接收消息: <strong>{{groups.length}}</strong> 条</p>
        </div>
    </Card>
    </i-col>
    <i-col span="16">
      <Card class="settings">
        <p slot="title">
            <Icon type="ios-settings" />
            危险报警设置
        </p>
        <!--TODO： 展示危险报警设置目的 <a href="#" slot="extra" @click.prevent="changeLimit"> -->
          <a href="#" slot="extra" @click.prevent="changeLimit">
            在{{ formatTime }}内收到 {{ warningMaxNum }}条违规消息，系统报警
        </a>
        <div class="settings">
          <Form :label-width="160">
            
            <FormItem label="危险报警消息阈值">
                <InputNumber :min="1" v-model="warningMaxNum"  size="large"></InputNumber>
            </FormItem>
            <FormItem label="危险报警时间段">
                <InputNumber :min="0" 
                v-model="warningTime_h" size="large"></InputNumber>小时
                <InputNumber :min="0" 
                v-model="warningTime_m" size="large"></InputNumber>分钟
                <InputNumber :min="1" 
                v-model="warningTime_s" size="large"></InputNumber>秒
            </FormItem>
            <FormItem label="报警提示框停留时间">
                <InputNumber :min="1" :step="5" v-model="warningTipDuration" size="large"></InputNumber>
            </FormItem>
          </Form>
        </div>
      </Card>
    </i-col>
  </Row>
</template>

<script>
import { mapGetters } from 'vuex'
import './index.scss'
export default {
  name: 'user',
  computed: {
    ...mapGetters([
      'selfHeadImage']),
    warningTipDuration: {
      get() {
        return this.$store.state.user.warningTipDuration
      },
      set(v) {
        this.$store.commit('SET_WARNING_TIP_DURATION', v)
      }
    },
    warningMaxNum: {
      get() {
        return this.$store.state.user.warningMaxNum
      },
      set(v) {
        this.$store.commit('SET_WARNING_MAX_NUM', v)
      }
    },

    warningTime_h: {
      get() {
        let secondTime = parseInt(this.$store.state.user.warningTime / 1000); // 秒
        let minuteTime = 0;// 分

        if(secondTime > 60) {//如果秒数大于60
            //获取分钟，除以60取整数，得到所有分钟
            minuteTime = parseInt(secondTime / 60);
            //如果分钟大于60，将分钟转换成小时
            if(minuteTime > 60) {
                //获取小时，获取分钟除以60，得到整数小时
                return parseInt(minuteTime / 60);
            } else {
              return 0
            }
        } else {
          return 0
        }
      },
      set(v) {
        let all_second = v * 1000 * 3600 + this.warningTime_m * 60 * 1000 + this.warningTime_s * 1000
        this.$store.commit('SET_WARNING_TIME', all_second)
      }
    },
    warningTime_m: {
      get() {
        let secondTime = parseInt(this.$store.state.user.warningTime / 1000); // 秒
        // 获取分钟，除以60取整数，得到总的整数分钟
        let minuteTime = parseInt(secondTime / 60);
        //如果总的分钟大于60
        if(minuteTime > 60) {
            minuteTime = parseInt(minuteTime % 60);
            return minuteTime
        }
        else {
          return minuteTime
        }
      },
      set(v) {
        let all_second = this.warningTime_h * 1000 * 3600 + v * 1000 * 60 + this.warningTime_s * 1000
        this.$store.commit('SET_WARNING_TIME', all_second)
      }
    },
    warningTime_s: {
      get() {
        let secondTime = parseInt(this.$store.state.user.warningTime / 1000); // 秒
        return parseInt(secondTime % 60);
      },
      set(v) {
        let all_second = this.warningTime_h * 1000 * 3600 + this.warningTime_m  * 1000 * 60 + v * 1000
        this.$store.commit('SET_WARNING_TIME', all_second)
      }
    },
    formatTime: function () {
        var secondTime = this.$store.state.user.warningTime / 1000
        var minuteTime = 0;// 分
        var hourTime = 0;// 小时
        if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
            //获取分钟，除以60取整数，得到整数分钟
            minuteTime = parseInt(secondTime / 60);
            //获取秒数，秒数取佘，得到整数秒数
            secondTime = parseInt(secondTime % 60);
            //如果分钟大于60，将分钟转换成小时
            if(minuteTime > 60) {
                //获取小时，获取分钟除以60，得到整数小时
                hourTime = parseInt(minuteTime / 60);
                //获取小时后取佘的分，获取分钟除以60取佘的分
                minuteTime = parseInt(minuteTime % 60);
            }
        }
        var result = "" + parseInt(secondTime) + "秒";

        if(minuteTime > 0) {
            result = "" + parseInt(minuteTime) + "分" + result;
        }
        if(hourTime > 0) {
            result = "" + parseInt(hourTime) + "小时" + result;
        }
        return result;
    }
  },
  data () {
    return {
      infoCardHeader: require('@/assets/images/infoCardHeader.jpg'),
      userInfo: {
        NickName: 'Taoz'
      },
      groups: [1, 2, 3, 34,34, 34],
    }
  }
}
</script>
