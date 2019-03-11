<template>
  <svg @click="clickFn" :class='`icon ${className}`' aria-hidden="true">
    <use :xlink:href='`#${icon}`'></use>
  </svg>
</template>

<style lang="scss" scoped>
  .icon {
    width: 20px;
    height: 20px;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>

<script>
export default {
  name: 'iconComponent',
  props: {
    icon: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    }
  },
  methods: {
    clickFn () {
      this.$emit('click')
    }
  }
}
</script>
