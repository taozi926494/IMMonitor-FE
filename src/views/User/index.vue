<template>
  <div class="app-container">
   <Card class="userinfo-card">
     <img :src="infoCardHeader" class="head-bg">
     <img :src="userInfo.HeadImgUrl" class="avatar">
     <p class="username">{{userInfo.NickName}}</p>
     <div class="info">
       <p>监测群: <strong>{{groups.length}}</strong> 个</p>
       <p>已接收消息: <strong>{{groups.length}}</strong> 条</p>
     </div>
   </Card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import './index.scss'
export default {
  name: 'user',
  data () {
    return {
      infoCardHeader: require('@/assets/images/infoCardHeader.jpg'),
      userInfo: {
        HeadImgUrl: 'http://localhost:5000/static/wxheadimg/user_1812385440.png',
        NickName: 'Taoz'
      },
      groups: [1, 2, 3, 34,34, 34]
    }
  },
  // computed: {
  //   ...mapGetters(["userInfo", "groups"])
  // },
}
</script>
