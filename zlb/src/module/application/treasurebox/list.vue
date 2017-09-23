<template>
    <div class="container" ref="container" v-cloak>

        <div class="page-wrap" v-refresh="refresh">

            <div class="refresh" ref="refresh">
                <mu-circular-progress :size="30" />
            </div>
            <div class="tab-wrap">
                <div>
                <ul class="tab-list" >
                    <li :class="[ 'tab-item',  { 'active': index == activeTab } ]" v-for="(item,index) in tablist" @click="handleTabChange(index)">
                        <span>{{item.title}}</span>
                    </li>                    
                </ul>
                </div>
                <span class="upload-add-btn" @click="addCategoryFn">                    
                </span>
            </div>
                        
            <div v-if="activeTab === idx" v-for="(ele, idx) in tablist">
                <div class="upload-area">
                    <span class="upload-btn" @click="uploadResourcesFn">上传{{idx}}</span>
                    <span class="capacity-txt">容量：{{capacity.currentSize}} / {{capacity.totalSize}}</span>
                </div>
                <ul class="pro-list">
                    <li class="pro-item" v-for="(item, index) in proList">
                        <span class="time">{{item.time}}</span>
                        <p class="desc">{{item.desc}}</p>

                        <div class="location-pic" v-if="item.location" @click="toDetailFn('location')">
                            <img :src="ios ? iosImg : loadUrl"  :data-echo="iosImg" v-if="item.pics.type==1" />
                            <img :src="ios ? iosImg : loadUrl"  :data-echo="loadUrl" v-if="item.pics.type==3" />
                        </div>
                        <div class="net-info" v-if="item.net" @click="toDetailFn('net')">
                            <div class="net-pic">
                                <img :src="ios ? iosImg : loadUrl"  :data-echo="iosImg" v-if="item.pics.type==1" />
                                <img :src="ios ? iosImg : loadUrl"  :data-echo="loadUrl" v-if="item.pics.type==3" />
                            </div>
                            <p class="net-desc">
                                <span class="title">{{item.title}}</span>
                                <span class="subtitle">{{item.subtitle}}</span>
                            </p>                                
                        </div>

                        <div class="extra-area">
                            <div class="tag-item">
                                <span>{{item.tag}}</span>
                            </div>
                            <div class="opreate">
                                <span @click="shareFn" class="share">转发</span>
                                <span @click="delFn" class="del">删除</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            
        </div>

        <div class="pop" v-show="isPopShow">
            <div class="msk"></div>
            <div class="link-component">
                <div class="link-top">
                    <div>
                        <router-link :to="'/app/treasurebox/addLocationResources'" class="location"><em></em>本地资源</router-link>
                    </div>
                    <div>
                        
                        <router-link :to="'/app/treasurebox/addNetworkResources'" class="net"><em></em>网络资源</router-link>                        
                    </div>
                </div>
                <div class="link-bottom" @click="popCanelFn"><span>取消</span></div>
            </div>
        </div>

    </div>
</template>

<script type="text/babel" async>
    import api from '../../../api/api.js'
    import {imagedomain} from '../../../api/api.js'
    import BScroll from 'better-scroll'
    const API = new api();
    let scroll;
    export default{
        data(){
            return{
                tablist:[{
                    title:'全部'
                },{
                    title:'教学视频'
                },{
                    title: '备课本'
                },{
                    title: '教课书'
                },{
                    title: '数学书本'
                },{
                    title: '学员风采'
                },{
                    title: '保持多久'
                }],
                capacity: {
                    currentSize: 3,
                    totalSize: 10
                },
                imagedomain:imagedomain,
                ios:util.browser.versions.ios,
                proList: [
                    {
                        time: '上午 11:56',
                        desc: '学员风采的课堂视频，主体为表演',
                        pics: { type: 1},
                        location: true,
                        tag: '教学视频',
                    },
                    {
                        time: '上午 11:56',
                        desc: '学员风采的课堂视频，主体为表演',
                        pics: { type: 1},
                        location: true,
                        tag: '教学视频',
                    },
                    {
                        time: '上午 11:56',
                        desc: '学员风采的课堂视频，主体为表演',
                        pics: { type: 1},
                        location: true,
                        tag: '教学视频',
                    },                  
                    {
                        time: '上午 11:56',
                        desc: '学员风采的课堂视频，主体为表演',
                        pics: {type: 3},
                        title: '孩子上课注意力能保持多久',
                        subtitle: 'pan.baidu.com',
                        net:true,
                        tag: '网络视频'
                    }
                ],
                iosImg: require('../../../assets/imgLoad.png'),
                loadUrl: require('../../../assets/imgLoad.png'),
                activeTab: 0,
                isPopShow: false,
                parentInfo:{appCode:'APP_HOMEWORK',title:'温故知新'}
            }
        },
        methods: {
            handleTabChange (val) {
                this.activeTab = val;
            },
            addCategoryFn(){
                this.$router.push({path:'/app/treasurebox/addCategory'})
            },
            uploadResourcesFn() {
                this.isPopShow = true;
            },
            popCanelFn () {
                this.isPopShow = false;
            },
            shareFn() {
                this.$router.push({path:'/app/treasurebox/share'})
            },
            delFn() {},
            toDetailFn(param) {
                if(param === 'location') {
                    console.log('去本地详情');
                }else if(param === 'net') {
                    console.log('去网络详情');
                }
            },
            /*
             * @description：下拉刷新
             * @update: (2017-05-11)
             */
            refresh() {
                this.$nextTick(function(){
                    this.scroll.refresh();
                    echo.render();                    
                });
            },
            /*
             * @description: 获取子组件信息
             *
             * @update: cxy (2017-04-17)
             */
            getSonInfo(info){
                this.classCheck=info.classCheck;
                this.buttonColorCheck();
                this.classList=info.classList;
            },
            /*
             * @description: 按钮颜色检测
             *
             * @update: cxy (2017-03-08)
             */
            buttonColorCheck(){
                if (this.classCheck && this.contentCheck) {
                    this.buttonColor = true
                } else {
                    this.buttonColor = false
                }
            },
            _initScroll() {
                scroll = new BScroll(this.$refs.container, {
                    probeType: 3, //延迟到事件完毕触发
                    bounce: true,
                    preventDefault:false
                })
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
                unload: false,
            });
            this.scroll.on('scroll', () => {
                echo.render();
            })       
            this.$nextTick(function () {
                this.refresh();
            });           
        }
    }
</script>

<style scoped>
    .page-wrap{width: 100%;height: 100%;}
    .pop{width: 100%; height: 100%;}
    .pop .msk{position: absolute; z-index: 9; left: 0; top:0;  width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4);}
    .pop .link-component{position: absolute; bottom: .5rem; z-index: 99; width: 3.5rem;height:1.2rem; margin:0.12rem 0.13rem;}
    .link-component .link-top{color:#A1A1A1; text-align: center; }
    .link-top a{display:inline-block;width:3.5rem;height:.5rem;line-height:.5rem;color:#666;position: relative;}
    .link-top em{display: inline-block; position: absolute;}
    .link-top .location{border-bottom: 1px solid #f5f5f5; border-top-left-radius: 5px; border-top-right-radius: 5px; background: #fff;}
    .link-top .net {background: #fff;border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;}
    .link-top .location em{display: inline-block; background:url('../../../assets/locationIcon.png') no-repeat; background-size: .16rem; width: 0.17rem; height: 0.17rem; top: .15rem; left: 1.2rem;}
    .link-top .net em{display: inline-block;background:url('../../../assets/netIcon.png') no-repeat; background-size: .18rem; width: 0.18rem; height: 0.18rem; top: .15rem; left: 1.2rem;}
    .link-component .link-bottom{color:#6FAAFF;text-align: center;background: #fff; height:.5rem; line-height: .5rem; border-radius: 5px; margin-top: .14rem;}

    .container {
        position: relative;
        top: 0;
        bottom: 0;
        width: 100%;
        height:100%;
        overflow: hidden;               
    }
    .tab-wrap{overflow: hidden;padding:0 .11rem;position: relative;}
    .tab-wrap .tab-list{float:left;width:3.2rem;height:0.5rem;}
    .tab-wrap .upload-add-btn{
        display: inline-block;
        float: right;
        width: 0.17rem;
        height: 0.17rem;        
        background: center url('../../../assets/add.png') no-repeat;
        background-size: 0.17rem;
        margin-top: 0.14rem;   
    }
    .tab-list {        
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
        white-space: nowrap;
        display: flex;
    }
    .tab-list .tab-item{        
        color:#9ca2ae;
        padding:.12rem .11rem;
        margin-right: .1rem;
    }
    .tab-list .tab-item.active{
        border-bottom:2px solid #67a5ff;
        color:#67a5ff;
    }
    
    .upload-area{position:relative;margin: 0.12rem 0;border:1px solid #DEEFFF;border-left:none;border-right:none;padding: 0.08rem 0;}
    .upload-area .upload-btn{
        display: inline-block;
        background:rgba(103,165,255,0.80);
        border:2px solid #ffffff;
        box-shadow:0 0 3px 0 #cbe6ff;
        border-radius: 1rem;
        width: 1.42rem;
        height: .34rem;
        line-height: .3rem;
        text-align: center;
        color: #fff;
        margin-left: 1.15rem;
    }
    .upload-area .capacity-txt{
        font-size:11px;
        color:#9ca2ae;
        text-align:center;
        position: absolute;
        right: .13rem;
        top: .16rem;
    }
    .pro-list{padding:.12rem .11rem; }
    .pro-list .pro-item{
        width: 100%;
        /*height: 2.9rem;*/

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
    .pro-item .location-pic{
        width: 3.51rem;
        height: 1.75rem;
        background:#eaeaea;
    }
    .pro-item .location-pic img{
        width: 100%;
        height: 1.75rem;
    }
    .pro-item .net-info{
        overflow:auto;
        _height:1%;
        background:#fafafa;
        border:1px solid #f4faff;        
    }
    .pro-item .net-pic{
        float: left;
        width: 0.65rem;
        height: 0.65rem;
    }
    .pro-item .net-pic img{

        width: 100%;
    }
    .pro-item .net-desc{

        margin-left: .05rem;
        padding-top: 0.11rem;
        float: left;
    }
    .pro-item .net-desc span{
        display: block;
    }
    .net-desc .title{
        font-size:16px;
        color:#5b5e62;
        letter-spacing:-0.15px;
        text-align:left;
    }
    .net-desc .subtitle{
        font-size:14px;
        color:#999999;
        letter-spacing:-0.15px;
        text-align:left;
    }
    .pro-item .extra-area{
        width: 100%;
        overflow: hidden;
        margin-top: 0.08rem;
    }
    .extra-area .tag-item{
        float: left;
        background:#ffc0c0;
        border-radius:100px;
        color:#fff;
        text-align: center;
        width:0.64rem;
        height:.2rem;
        line-height: .2rem;
    }
    .tag-item span{
        font-size:12px;
        color:#fff;
        
    }
    .extra-area .opreate{float: right;}
    .opreate span{
        display: inline-block; 
        font-size:11px;
        color:#9ca2ae;
        letter-spacing:-0.12px;
        text-align:left;
    }
    .opreate .share{
        background: center left url(../../../assets/share.png) no-repeat;
        background-size: 0.15rem;
        padding-left: 0.18rem;
    }
    .opreate .del{
        background: center left url(../../../assets/del.png) no-repeat;
        background-size: 0.15rem;
        padding-left: 0.18rem;
    }
</style>