<template>
  <div class="chat_page_container">
    <Button class="get_msg" @click="get_msg">拉取新消息</Button>
    <GroupPanel v-for="group in groups" :key="group.id" :group="group" class="chat_window" />
    <div v-show='previewImgUrl' class="preview-image-box" @click="$store.commit('SET_PREVIEW_IMG_URL', null)">
      <img :src="previewImgUrl" alt="">
    </div>
  </div>
</template>


<script>
// @ is an alias to /src
import './index.scss'
import { mapGetters } from "vuex";
import GroupPanel from "@/components/GroupPanel";
import msg_list from "@/mock/msg_list"
import msg_detect from "@/mock/msg_detect"

export default {
  name: "home",
  data () {
    return {
      showPerviewImage: false,
    }
  },
  components: {
    GroupPanel
  },
  computed: {
    ...mapGetters(["userInfo", "groups", "previewImgUrl"])
  },
  methods: {
    get_msg() {
      console.log('get_msg')
      // msg_list.map((item) => {
      //   let detectedArr = []
      //   msg_detect.map((e) => {
      //     if (item.MsgId === e.msg_id) {
      //       detectedArr.push(e)
      //     }
      //   })
      //   Object.assign(item, {'detectedArr': detectedArr})
      // })

      
    }
  }
};
</script>
