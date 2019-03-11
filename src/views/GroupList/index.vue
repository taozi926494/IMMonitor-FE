<template>
  <div>
    
    <Row :gutter="16">
        <Col span="6">
          <div class="count-card">
            <div class="icon-box">
              <Icon type="ios-people" />
              <span>群总数</span>
              
            </div>
            <count-to :end="statistic.group_count" count-class="count-text" unit-class="unit-class">
            </count-to>
          </div>
        </Col>


        <Col span="6">
          <div class="count-card">
            <div class="icon-box" style="background: #19be6b">
              <Icon type="ios-chatbubbles" />
              <span>总消息数</span>
              
            </div>
            <count-to :end="statistic.msg_count" count-class="count-text" unit-class="unit-class">
            </count-to>
          </div>
        </Col>

        <Col span="6">
          <div class="count-card">
            <div class="icon-box" style="background: #ed3f14">
              <Icon type="ios-warning" />
              <span>违规消息数</span>
              
            </div>
            <count-to :end="statistic.detect_count" count-class="count-text" unit-class="unit-class">
            </count-to>
          </div>
        </Col>

        <Col span="6">
          <div class="count-card">
            <div class="icon-box" style="background: #E46CBB">
              <Icon type="ios-people"></Icon>
              <span>违规消息占比</span>
            </div>
            <count-to :end="statistic.msg_percent" count-class="count-text" unit-class="unit-class">
              <span class="slot-text" slot="right">&nbsp;%</span>
            </count-to>
          </div>
        </Col>

    </Row>

  </div>
</template>

<script>
import countTo from '@/components/count-to'
import { mapGetters } from 'vuex'
import axios from 'axios'
import './index.scss'
export default {
  name: "home",
  data () {
    return {
      statistic: {
        group_count: 0,
        msg_count: 0,
        detect_count: 0,
        msg_percent: 0
      }
    }
  },
  components: {
    countTo
  },
  computed: {
    ...mapGetters(["userInfo", "groups"])
  },
  mounted() {
    this.get_msg()
  },
  methods: {
    get_msg() {
      var _self = this;
       axios({
          method: 'get',
          url: 'http://localhost:5000/analysis/statistic?uin=2879490841',
          params: {
            uin: _self.userInfo.uin,
            username: _self.userInfo.UserName,
          },
          withCredentials: true
        }).then((res) => {
          _self.statistic = res.data.data
          if (_self.statistic.msg_count > 0) {
            _self.statistic.msg_percent = Math.round(_self.statistic.detect_count / _self.statistic.msg_count * 100)
          }
        })
    }
  }
}
</script>
