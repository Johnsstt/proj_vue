<template>
    <div class="list-wrap">
        <ul class="list">
            <li class="item" v-for="(item,index) in list" v-if="list">
                <span class="title">{{item.title}}</span>
                <p class="recommend"><span class="rec-label">推荐人：</span>{{item.recommend}}</p>
                <div class="pos">
                    <span class="age">年龄：{{item.age}}</span>
                    <span class="tel">手机：{{item.tel}}</span>
                </div>
            </li>
        </ul>
        <mu-raised-button label="我要介绍" fullWidth class="demo-raised-button" @click="submitEvent"/>
    </div>
</template>
<style>
    body{
        background-color:#f5f5f5;
    }
</style>
<script>
    import api from '../../../api/api.js'
    import BScroll from 'better-scroll'

    const API = new api();

    export default{
        data(){
            return{
                list: [
                    {
                        title: '张三',
                        recommend: '小王',
                        age:34,
                        tel: '1234555'
                    },
                    {
                        title: '张三',
                        recommend: '小王',
                        age:34,
                        tel: '1234555'
                    }
                ]
            }
        },
        mounted () {
            this.scroll = new BScroll(this.$refs.container, {
                probeType: 3,
                bounce: true,
                preventDefault:false
            })
            echo.init({
                offset: 0,
                throttle: 0,
                unload: false
            });
            this.scroll.on('scroll', () => {
                echo.render();
            })
        },
        methods: {
            submitEvent() {

            }
        }
    }
</script>

<style scoped>
    .list-wrap{positon:relative;width:100%;height:100%;}
    .list-wrap .list{padding-left:0.13rem;padding-right:0.15rem;}
    .list-wrap .list .item{
        position: relative;
        width:3.49rem;
        height:1.28rem;
        background: #fcfdff;
        margin-top:0.12rem;
        background: center bottom url('../../../assets/listBg.png') no-repeat;
        background-size:3.42rem 0.66rem;
    }
    .item .title{position:absolute;left:0.12rem;top:0.12rem;font-size:18px;color:#67a5ff;}
    .item .recommend{position:absolute;right:0.12rem;top:0.12rem;font-size:13px;color:#464950;}
    .recommend .rec-label{color:#a3a8b2;}
    .item .pos{position:absolute; left:0.12rem; bottom:0.13rem;}
    .item .pos span{display: block; color:#c6c7cb;}
    .demo-raised-button{
        background: #67a5ff;
        color:#fff;
        position: absolute;
        bottom:0;
    }


</style>
