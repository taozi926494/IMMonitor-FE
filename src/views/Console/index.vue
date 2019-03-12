<template>
  <div class="chat_page_container">
    <!-- <Button class="get_msg" @click="get_msg">拉取新消息</Button> -->
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
// import msg_list from "@/mock/msg_list"
// import msg_detect from "@/mock/msg_detect"
// import groups from '@/mock/groups'
// import mock_groups from '@/mock/groups'
// import mock_msg_list from '@/mock/msg_list'
// import mock_msg_detect_list from '@/mock/msg_detect'

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
  mounted () {
    // this.groups = mock_groups
    // this.$store.commit('SET_GROUPS', mock_groups)
    // let msg = {
    //   msg_list: mock_msg_list,
    //   msg_list_detected: mock_msg_detect_list
    // }
    // console.log(msg)
    // console.log(this.groups)
    
    // this.$store.commit('HANDLE_GROUP_MSG', msg)
    // console.log(this.groups)
  },
  methods: {
    get_msg() {
      // console.log('get_msg')
    }
  }
};
</script>
