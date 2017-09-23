<template>
  <transition :name="'changeView'">
	  <keep-alive>
	    <router-view></router-view>
	  </keep-alive>
  </transition>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

body {
  background-color: #fbf9fe;
}



/*.changeView-enter-active, .changeView-leave-active {
        transition: all .3s;
        -webkit-transform: translate3d(0, 0, 0);
        -moz-transform: translate3d(0, 0, 0);
        -ms-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        -ms-backface-visibility: hidden;
        backface-visibility: hidden;
        -webkit-perspective:1000;
        -moz-perspective: 1000;
        -ms-perspective: 1000;
        perspective: 1000;
    }
    .changeView-enter, .changeView-leave-to {
        -webkit-transform: scale(1.5);
        -moz-transform: scale(1.5);
        -ms-transform: scale(1.5);
        -o-transform: scale(1.5);
        transform: scale(1.5);
        opacity: 0;
    }*/


    /*左右移动*/
    /*.changeView-enter-active, .changeView-leave-active {
        transition: all 0.3s linear;
        transform: translate3d(0, 0, 0);
    }
    .changeView-enter, .changeView-leave-to {
        transform: translate3d(100%, 0, 0);
        opacity: 0;
    }*/


</style>
