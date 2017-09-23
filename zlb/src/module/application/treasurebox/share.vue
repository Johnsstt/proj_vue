<template>
    <div class="container" v-cloak>
        <div class="page-wrap">
            <div class="check-list">
                <mu-checkbox name="group" :nativeValue="item.label" v-model="chkedList" :label="item.label" v-for="(item, index) in chklist"/>
                <p class="att">公开后教室其它成员可以在教室资源库中看到该消息</p>              
            </div>            
            <div>
                <ul class="pro-list">
                    <li class="pro-item" v-for="(item, index) in proList">
                        <span class="time">{{item.time}}</span>
                        <p class="desc">{{item.desc}}</p>
                        <div class="pic">
                            <img :src="ios ? iosImg : loadUrl"  :data-echo="iosImg" v-if="item.pics.type==1" />
                            <img :src="ios ? iosImg : loadUrl"  :data-echo="loadUrl" v-if="item.pics.type==3" />
                        </div>                        
                    </li>
                </ul>
            </div>
            
        </div>
    </div>
</template>

<script type="text/babel" async>
    import api from '../../../api/api.js'
    import {imagedomain} from '../../../api/api.js'
    import BScroll from 'better-scroll'
    const API = new api();
    export default{
        data(){
            return{               
                imagedomain:imagedomain,
                ios:util.browser.versions.ios,
                chklist: [
                    {
                        label: '雅思英语'
                    },
                    {
                        label: '英四级'
                    },
                    {
                        label: '数学、语文'
                    },
                    {
                        label: '日期选择'
                    }
                ],
                chkedList: [],
                proList: [
                    {
                        time: '上午 11:56',
                        desc: '学员风采的课堂视频，主体为表演',
                        pics: { type: 1},
                        tag: '教学视频',
                    }
                ],
                iosImg: require('../../../assets/imgLoad.png'),
                loadUrl: require('../../../assets/imgLoad.png'),
            }
        },
        methods: {
            
        },
        mounted () {
                           
        }
    }
</script>

<style scoped>
    .container {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        height:100%;
    }
    
    .check-list{
        padding: 0.2rem 0.12rem 0.1rem 0.12rem;
        border-bottom: 1px solid #ccc;

    }
    .check-list .mu-checkbox{        
        width: 50%;        
        position: relative;
    }
    .check-list .mu-checkbox-wrapper{
        webkit-justify-content: flex-start;
        -ms-flex-pack: justify;
        justify-content: flex-start;
    }
    .check-list .att{
        font-size:12px;
        color:#9fa5b0;
        text-align:left;
    }
    
    .pro-list{padding:.12rem .11rem; }
    .pro-list .pro-item{
        width: 100%;
        height: 2.9rem;

    }
    .pro-item .time{
        font-size:14px;
        color:#9ca2ae;
        text-align:left;
    }
    .pro-item .desc{
        font-size:16px;
        color:#626979;
        line-height:16px;
        text-align:left;
        margin-top: 0.05rem;
        margin-bottom: 0.05rem;
    }
    .pro-item .pic{
        width: 3.51rem;
        height: 1.75rem;
        background:#eaeaea;
    }
    .pro-item .pic img{
        width: 100%;
        height: 1.75rem;
    }
   
    
</style>