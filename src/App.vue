<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style>
@import './style/_include/_all.scss';
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
body, div, span, small, p, em, i, b,
th, td, dl, dt, dd, ul, ol, li,
h1, h2, h3, h4, h5, h6, form, textarea { padding:0; margin:0 }
a { cursor:pointer; text-decoration:none }
a img { border:none }
ul, ol { list-style:none }
table { border-spacing:0; border-collapse:collapse }
input:focus, select:focus, textarea:focus, select:hover, button { margin:0; outline:none }

/* disable firefox gradient */
input, button { background-image:none; }

body, div, span, small, p, em, i, b,
th, td, dl, dt, dd, ul, ol, li, a,
em, i, b{
  font-style: normal;
}
input,textarea{
  color: #666666
}

*,input,textarea {
  -webkit-tap-highlight-color: rgba(0,0,0,0);
}
a,button {
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  -webkit-user-modify:read-only; 
}

input,select { -webkit-appearance:none; appearance: none; }


select::-ms-expand { display:none; }

input[type=radio]::-ms-check,
input[type=checkbox]::-ms-check { display:none; }

input[type=text]::-ms-clear,
input[type=tel]::-ms-clear,
input[type=number]::-ms-clear { display:none; }

html,body{
  -webkit-overflow-scrolling: touch;
  font-family: NotoSansHans-Medium, Noto Sans S Chinese, PingFangSC_L;
  width: 100%;
  height: 100%;
}
body {font-size:1.2rem;}


::-webkit-input-placeholder { /* WebKit browsers */
color: #999; }
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
color: #999; }
::-moz-placeholder { /* Mozilla Firefox 19+ */
color: #999; }
:-ms-input-placeholder { /* Internet Explorer 10+ */
color: #999; }
input:focus::-webkit-input-placeholder{ color:#999; }

input::-webkit-input-speech-button {display: none}


/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar
{
  display: none;
  background-color: #fff;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track
{
  -webkit-box-shadow: inset 0 0 1px rgba(0,0,0,0);
  border-radius: 10px;
  background-color: #F5F5F5;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb
{
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #555;
}

input[type="button"], input[type="submit"], input[type="search"], input[type="reset"] {
  -webkit-appearance: none;
}

textarea { -webkit-appearance: none;}

html,body{
  height: 100%;
  width: 100%;
  background-color: #F5F5F5;
}
.clear{
  zoom:1;
}
.clear:before,.clear:after{
  content: '';
  display: block;
  clear: both;
}
#app{
  margin: 0px;
}


</style>
