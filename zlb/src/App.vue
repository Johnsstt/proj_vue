<template>
    <transition :name="ios?'changeView':''">
        <router-view></router-view>
    </transition>
</template>

<script type="text/babel">
    import api from './api/api.js'
    const API =new api();
    export default{
        data(){
            return{
                ios:util.browser.versions.ios
            }
        },
        mounted(){
            this.getUserInfo()
        },
        methods:{
            getUserInfo(){
                let param = {};
                API.getUserInfo(param).then((res)=> {
                    const {rs,code}=res;
                    if(code==200){
                        this.$store.dispatch('getUserInfo',rs);
                    }
                })
            },
        }
    }



</script>
<style>
    .changeView-enter-active, .changeView-leave-active {
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
    }
</style>

