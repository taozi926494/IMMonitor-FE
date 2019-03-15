<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
<<<<<<< HEAD
=======
import { mapGetters } from 'vuex'

>>>>>>> 9956b86d6d3a1c9779a2546382d9393e72355a91
export default {
  name: 'app'
}
</script>

<style lang="scss">
@import './style/_include/_all.scss';
</style>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}
div::-webkit-scrollbar-track-piece { 
    background-color:#f8f8f8;
  }
div::-webkit-scrollbar {
  width:0px;
  /* height:9px; */
}
div::-webkit-scrollbar-thumb {
  background-color: #e4e2eb;
  background-clip:padding-box;
  min-height:28px;
}
div::-webkit-scrollbar-thumb:hover {
  background-color:#bbb;
}
</style>
