<template>
  <div class="chat_page_container">
    
    <GroupPanel :group="groups[0]" class="chat_window" />

    <i-circle
        :size="250"
        :trail-width="4"
        :stroke-width="5"
        :percent="75"
        stroke-linecap="square"
        stroke-color="#43a3fb">
        <div class="demo-Circle-custom">
            <h1>42,001,776</h1>
            <p>消费人群规模</p>
            <span>
                总占人数
                <i>75%</i>
            </span>
        </div>
    </i-circle>
  </div>
</template>

<script>
import './index.scss'
import GroupPanel from '@/components/GroupPanel'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters(['groups'])
  },
  components: {
    GroupPanel
  }
}
</script>
