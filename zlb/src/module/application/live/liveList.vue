<template>
        <div class="container" ref="container" v-cloak>
            <div class="list" v-refresh="refresh" v-load="loadMore">
                <div class="refresh">
                    <mu-circular-progress :size="30" />
                </div>
                <li class="list_item" v-for="(live,index) in liveList" @click="liveFun(live)">
                    <div class="item_inner" :style="{backgroundImage:live.snapshotUrl?'url('+live.snapshotUrl+')':'url('+domain+'/www/static/images/liveVideo/zhibo_list_bg.png'+')',backgroundSize:'cover'}">
                        <div class="live_state" flex="main:center cross:center">
                            <span class="blueBall" flex-box="0" v-if="live.state==1"></span>
                            <span v-text="live.liveState" flex-box="0"></span>
                        </div>
                        <div class="white_box" flex="main:center cross:center">
                            <div class="whiteboard" flex-box="0">
                                <div class="time" flex="main:center" v-text="live.BeginTime"></div>
                                <div class="title" flex="main:center">
                                    <span class="class_name" flex-box="0" v-text="live.title"></span>
                                </div>
                                <div class="blue_line"></div>
                                <div v-if="live.state==1">
                                    <div class="numWrapper" flex="main:center cross:center">
                                        <span>人数:</span>
                                        <span class="num" v-text="live.personNum"></span>
                                    </div>
                                </div>
                                <div class="live_time" v-if="live.state==-1" flex="cross:center main:center">
                                    <span class="smallFont">倒计时</span>
                                    <span class="bigFont" v-text="(new Date(live.expirTime*1000).getUTCDate()-1)*24+new Date(live.expirTime*1000).getUTCHours()"></span>
                                    <span class="smallFont">时</span>
                                    <span class="bigFont" v-text="new Date(live.expirTime*1000).getUTCMinutes()"></span>
                                    <span class="smallFont">分</span>
                                    <span class="bigFont" v-text="new Date(live.expirTime*1000).getUTCSeconds()"></span>
                                    <span class="smallFont">秒</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </div>
            <mu-toast v-if="toast" :message="msg" @close="hideToast"/>
            <div class="nothing" v-if="liveList.length==0"></div>
        </div>
</template>
<script type="text/babel">
    import {imagedomain} from '../../../api/api.js'
    import {domain} from '../../../api/api.js'
    import api from '../../../api/api.js'
    import BScroll from 'better-scroll'
    const API = new api();
    export default{
        data () {
            return {
                page: 1,
                classId: this.$route.query.classId,
                pageTotal: 0,
                imagedomain: imagedomain,
                domain:domain,
                isScroll: true,
                msg: '',
                toast: false,
                liveList: 0,
                timer: '',
                ownId: 0,
                nowTime: new Date(),
                scroll:''
            }
        },
        mounted () {
            this.scroll = new BScroll(this.$refs.container, {
                probeType: 3,
                bounce: true,
                preventDefault:false
            })
            this.$nextTick(function () {
                clearInterval(this.timer);
                this.refresh();
            });
        },
        methods: {
            propsTitle(){
                //TODO:客户端读取标题信息
                util.JsBridge('propsTitle', {
                    title:util.toUniCode('课堂直播'),
                    color: '#67a5ff'
                }, (res)=> {
                })
            },
            timeRefresh(){
                if (new Date() - this.nowTime > 7000) {
                    this.refresh();
                } else {
                    this.nowTime = new Date();
                }
            },
            refresh () {
                clearInterval(this.timer);
                this.nowTime=new Date();
                this.page=1;
                let param = {
                    page: 1,
                    classId: this.classId
                };
                API.getLiveList(param).then(res=> {
                    let {code,rs}=res;
                    if (code == 200) {
                        this.liveList = rs.pageList
                        this.expirTimeFun();
                        this.liveList.forEach((obj)=> {
                            obj.BeginTime = util.changeDate(obj.playBeginTime)
                            if (obj.state === 1) {
                                obj.liveState = '直播中'
                            } else if (obj.state === -1) {
                                obj.liveState = '预约直播'
                            } else {
                                obj.liveState = '历史记录'
                            }
                        })
                        this.pageTotal = rs.pageTotal;
                        this.ownId = rs.ownId;
                    } else {
                        this.msg = res.msg;
                        this.showToast();
                    }
                    this.$nextTick(function(){
                        this.scroll.refresh();
                        this.propsTitle();
                    })
                });
            },
            loadMore () {
                this.page++;
                if (this.page > this.pageTotal) {
                    return;
                }
                let param = {
                    page: this.page,
                    classId: this.classId
                };
                clearInterval(this.timer);
                API.getLiveList(param).then(res=> {
                    this.propsTitle();
                    let {code,rs}=res;
                    if (code == 200) {
                        if(rs.pageTotal){
                            this.pageTotal=rs.pageTotal;
                        }
                        this.liveList = this.liveList.concat(rs.pageList)
                        this.expirTimeFun();
                        this.liveList.forEach((obj)=> {
                            obj.BeginTime = util.changeDate(obj.playBeginTime)
                            if (obj.state === 1) {
                                obj.liveState = '直播中'
                            } else if (obj.state === -1) {
                                obj.liveState = '预约直播'
                            } else {
                                obj.liveState = '历史记录'
                            }
                        })
                        this.ownId = rs.ownId;
                        this.$nextTick(function(){
                            this.scroll.refresh();
                        })
                    } else {
                        this.msg = res.msg;
                        this.showToast();
                    }
                });
            },
            /*
             * @description: 倒计时
             *
             * @update: cxy (2017-03-25)
             */
            expirTimeFun(){
                this.timer = setInterval(()=> {
                    this.timeRefresh();
                    for (var i = 0; i < this.liveList.length; i++) {
                        if (this.liveList[i].expirTime > 0) {
                            this.liveList[i].expirTime = this.liveList[i].expirTime - 1;
                        }
                    }
                }, 1000)
            },
            showToast () {
                this.toast = true
                if (this.toastTimer) clearTimeout(this.toastTimer)
                this.toastTimer = setTimeout(() => {
                    this.toast = false
                }, 2000)
            },
            hideToast () {
                this.toast = false
                if (this.toastTimer) clearTimeout(this.toastTimer)
            },
            /*
             * @description: 处理直播状态中间件
             *
             * @update: cxy (2017-03-29)
             */
            liveFun(liveObj){
                //直播中
                if (liveObj.state == 1) {
                    let type;
                    if (this.ownId == liveObj.userId) {
                        //TODO: 直播者
                        type = 1
                    } else {
                        //TODO: 观看者
                        type = -1
                    }
                    this.live(liveObj, type);
                    //预约直播
                } else if (liveObj.state == -1) {
                    let type;
                    if (this.ownId == liveObj.userId) {
                        //TODO: 直播者
                        type = 1
                    } else {
                        //TODO: 观看者
                        type = -1
                    }
                    this.orderLive(liveObj, type);
                } else {
                    this.lived(liveObj.historyVideoUrl);
                }
            },
            /*
             * @description: 历史记录观看
             *
             * @update: cxy (2017-03-29)
             */
            lived(url){
                const arr = [{imgUrl: 'http://pili-demand.bestjlb.com/'+url, type: 3,noDownLoad:1}]
                util.JsBridge('picesSwiper', {
                    picesList: arr,
                    picesIndex: 0
                }, (res)=> {
                })
            },
            /*
             * @description: 直播
             *
             * @update: cxy (2017-03-29)
             */
            live(obj, type){
                util.JsBridge('live', {
                    liveId: obj.tid,
                    type: type,
                    videoPlayUrl: obj.videoPlayUrl
                }, (res)=> {
                    if(res.refreshList==1){
                        this.refresh()
                    }
                })
            },
            /*
             * @description: 预约直播
             *
             * @update: cxy (2017-03-29)
             */
            orderLive(obj, type){
                util.JsBridge('orderLive', {
                    liveId: obj.tid,
                    type: type,
                    playBeginTime: obj.playBeginTime,
                    videoPlayUrl: obj.videoPlayUrl,
                    title:obj.title
                }, (res)=> {
                    if(res.refreshList==1){
                        this.refresh()
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .nothing {
        background: url("images/nothing.png") no-repeat center center;
        height: 2rem;
        width: 2rem;
        background-size: contain;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        z-index: 1;
    }

    .fade-enter-active {
        transition: opacity .5s
    }

    .fade-enter {
        opacity: 0
    }
    .container {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        height:100%;
        overflow: hidden;
    }
    .container .list {
        padding: 0.12rem !important;
    }

    .container .list .list_item {
        box-shadow: 0px 0px 4px 0px #d4deec;
        border-radius: 0.05rem;
        width: 100%;
        height: 1.94rem;
        margin-bottom: 0.12rem;
        position: relative;
        overflow: hidden;
    }

    .container .list .list_item:nth-last-child(1) {
        margin-bottom: 0 !important;
    }

    .container .list .list_item .item_inner {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }

    .container .list .list_item .live_state {
        background: #fff;
        border: 1px solid #9cc4fd;
        border-radius: 1rem;
        padding: 0 0.14rem;
        height: 0.24rem;
        color: #666;
        font-size: 0.12rem;
        position: absolute;
        right: 0.05rem;
        top: 0.02rem;
    }

    .container .list .list_item .living {
        padding: 0 0.07rem;
    }

    .container .list .list_item .live_state .blueBall {
        background: #67a5ff;
        width: 0.06rem;
        height: 0.06rem;
        border-radius: 100%;
        margin-right: 0.04rem;
    }

    .container .list .list_item .white_box {
        width: 2.35rem;
        height: 1.1rem;
        border: 1px solid #fff;
        opacity: 0.79;
        margin: 0 auto;
        margin-top: 0.49rem;
    }

    .container .list .list_item .white_box .whiteboard {
        background: rgba(255, 255, 255, 0.79);
        width: 2.29rem;
        height: 1.04rem;
    }

    .container .list .list_item .white_box .whiteboard .time {
        margin-top: 0.12rem;
        color: #666;
        font-size: 0.14rem;
    }

    .container .list .list_item .white_box .whiteboard .title {
        font-size: 0.16rem;
        color: #333;
        margin-top: 0.03rem;
    }

    .container .list .list_item .white_box .whiteboard .blue_line {
        height: 2px;
        width: 0.3rem;
        margin: 0.03rem auto;
        background: #67a5ff;
    }

    .container .list .list_item .white_box .whiteboard .numWrapper {
        margin-top: 0.09rem;
        font-size: 0.14rem;
        color: #666;
    }

    .container .list .list_item .white_box .whiteboard .numWrapper .num {
        margin-left: 0.07rem;
    }

    .container .list .list_item .white_box .whiteboard .live_time {
        text-align: center;
        margin-top: 0.06rem;
    }

    .container .list .list_item .white_box .whiteboard .live_time .smallFont {
        font-size: 0.12rem;
        color: #999;
    }

    .container .list .list_item .white_box .whiteboard .live_time .bigFont {
        font-size: 0.18rem;
        margin: 0 0.08rem;
        color: #67a5ff;
    }

    .container .list .list_item .white_box .whiteboard .live_time .smallFont:nth-last-child(1) {
        margin-right: 0;
    }

    .mu-toast {
        top: 50%;
        width: 50%;
        margin-left: 1rem;
        text-align: center;
    }

    .mu-circular-progress {
        margin: 0.1rem 0;
    }

    .refreshInfo {
        color: #666;
        margin: 0.1rem 0;
        display: none;
    }

</style>

