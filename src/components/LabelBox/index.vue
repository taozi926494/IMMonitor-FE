<template>
  <div class="labelbox-container">
    <div class="labelbox-left" :style="{backgroundColor: labelBg, color: labelColor}">
      <Icon class="iconstyle" :size='iconSize' :type="iconType" />
      <span>{{ labelName }}</span>
    </div>
    <div class="labelbox-right">
      <count-to :end="countNum" class="countBox" count-class="count-text" unit-class="unit-class">
        <span v-if='showPercent' slot="right">&nbsp;%</span>
      </count-to>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.labelbox-container{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  border-radius: 6px;
  .labelbox-left{
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
    border-radius: 6px 0 0 6px;
    span{
      font-size: 14px;
    }
  }
  .labelbox-right{
    flex: 1.5;
    display: flex;
    align-items: center;
    justify-content: center;
    .countBox{
      width: 100%;
      height: 100%;
      font-size: 30px;
      font-weight: 520;
    }
  }
}
</style>

<script>
import countTo from '@/components/count-to'
export default {
  components: {
    countTo
  },
  props: {
    iconType: {
      type: String,
      default: 'ios-people'
    },
    iconSize: {
      type: Number,
      default: 30
    },
    labelName: {
      type: String,
      default: 'label'
    },
    labelBg: {
      type: String,
      default: '#333'
    },
    labelColor: {
      type: String,
      default: '#fff'
    },
    countNum: {
      type: Number,
      default: 0
    },
    showPercent: {
      type: Boolean,
      default: false
    }
  }
}
</script>
