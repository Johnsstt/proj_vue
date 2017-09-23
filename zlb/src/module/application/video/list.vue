<template>
    <div class="container" ref="container" v-cloak>
        <ul class="list" v-refresh="refresh" v-load="loadMore" ref="loadY">
            <div class="refresh">
                <mu-circular-progress :size="30" />
            </div>
            <li class="list_item" v-for="(item,index) in videoList">
                <div class="list_main" @click.stop="toDetail(item.tid)">
                    <div class="title" flex="cross:center">
                        <div class="img_wrapper" flex-box="0">
                            <avatar v-if="!item.userPhoto" :userId="item.userId" :userName="item.userName"></avatar>
                            <img v-if="item.userPhoto" :src="item.userPhoto+'?imageView2/0/w/80/format/jpeg'">
                        </div>
                        <span class="name" flex-box="1" v-text="item.userName"></span>
                        <span class="time" flex-box="0" v-text="item.createTime"></span>
                    </div>
                    <div class="list_content" v-html="item.content"></div>
                    <div class="assign_homework" v-if="item.pices&&item.pices.length>0">
                        <img :src="ios?imagedomain+item.pices[0].imgUrl+'?imageView2/0/w/301/q/1/format/jpeg':loadUrl"  :data-echo="imagedomain+item.pices[0].imgUrl+'?imageView2/0/w/702/format/jpeg'" v-if="item.pices[0].type==1"/>
                        <img :src="ios?imagedomain+item.pices[0].imgUrl+'?vframe/jpeg/offset/1/w/301':loadUrl" :data-echo="imagedomain+item.pices[0].imgUrl+'?vframe/jpeg/offset/1/w/702'" v-if="item.pices[0].type==3"/>
                        <span class="num" flex="main:center cross:center" v-if="item.pices.length>0"
                              v-text="item.pices.length"></span>
                        <div class="play" v-if="item.pices[0].type==3"></div>
                    </div>
                </div>
                <div class="list_slide" v-if="item.claimPics&&item.claimPics.length>0">
                    <div class="unSlide" flex="main:justify cross:center" @click="slideFuc(index)">
                        <span class="color3">我的认领</span>
                        <span class="slideIcon" :class="{'slideIconTop':item.isSlide}"></span>
                    </div>
                    <transition name="fade">
                        <div v-if="item.isSlide">
                            <ul class="slided" flex>
                                <li class="slided_item" flex-box="0" v-for="(pic,m) in item.claimPics"
                                    @click="clientSwiper(item.claimPics,m)">
                                    <img :src="imagedomain+pic.imgUrl+'?imageView2/0/w/280/format/jpeg'"
                                         v-if="pic.type==1">
                                    <img :src="imagedomain+pic.imgUrl+'?vframe/jpeg/offset/1/w/280'" v-if="pic.type==3">
                                    <div class="play" v-if="pic.type==3"></div>
                                </li>
                            </ul>
                        </div>
                    </transition>
                </div>
            </li>
        </ul>
        <mu-toast v-if="toast" :message="msg" @close="hideToast"/>
        <div class="nothing" v-if="videoList.length==0"></div>
    </div>
</template>
<script type="text/babel">
    import {imagedomain} from '../../../api/api.js'
    import avatar from '../../../components/defaultAvatar.vue'
    import api from '../../../api/api.js'
    import BScroll from 'better-scroll'
    const API = new api();
    export default{
        data () {
            return {
                videoList: 0,
                page: 1,
                classId: this.$route.query.classId,
                pageTotal: 0,
                imagedomain: imagedomain,
                role: this.$route.query.role,
                msg: '',
                toast: false,
                scroll: '',
                ios:util.browser.versions.ios,
                loadUrl:require('../../../assets/imgLoad.png')
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
            if(this.$store.state.app.list.length>0){
                this.videoList=this.$store.state.app.list;
                this.$nextTick(function(){
                    this.scroll.scrollTo(0, this.$store.state.app.saveY);
                    this.page=this.$store.state.app.page;
                    this.pageTotal=this.$store.state.app.pageTotal;
                    this.scroll.refresh();
                    echo.render()
                })
            }else{
                this.$nextTick(function () {
                    this.refresh();
                });
            }
        },
        components: {
            avatar
        },
        methods: {
            /*
             * @description: 客户端头部初始化
             *
             * @update: cxy (2017-03-07)
             */
            propsTitle(){
                //TODO:客户端读取标题信息
                util.JsBridge('propsTitle', {
                    title: util.toUniCode('学员风采'),
                    color: '#67a5ff'
                }, (res)=> {
                })
            },

            toDetail(tid){
                this.$store.dispatch('getList',{list:this.videoList,page:this.page,pageTotal:this.pageTotal,saveY:parseFloat(getComputedStyle(this.$refs.loadY, null).getPropertyValue("-webkit-transform").substring(7).split(',')[5])});
                if (this.role == '1') {
                    this.$router.push({path: '/app/video/detail', query: {tid: tid, classId: this.classId}})
                } else {
                    this.$router.push({path: '/app/video/tchDetail', query: {tid: tid, classId: this.classId}})
                }
            },
            /*
             * @description: 客户端浏览文件
             *
             * @update: cxy (2017-03-09)
             */
            clientSwiper(pices, index){
                let arr = Array.prototype.toString.call(pices) === '[object String]' ? JSON.parse(JSON.stringify(JSON.parse(pices))) : JSON.parse(JSON.stringify(pices))
                arr.forEach(function (e) {
                    e.imgUrl = imagedomain + e.imgUrl;
                    if (e.type == 3) {
                        e.coverUrl = imagedomain + e.imgUrl + '?vframe/jpeg/offset/1';
                    }
                })
                //TODO:客户端浏览文件
                util.JsBridge('picesSwiper', {
                    picesList: arr,
                    picesIndex: index
                }, (res)=> {
                })
            },

            slideFuc(index){
                this.videoList[index].isSlide = !this.videoList[index].isSlide;
                this.refreshScroll()
            },

            /*
             * @description: 下拉刷新
             *
             * @update: lwq (2017-03-03)
             */

            refresh () {
                this.page = 1;
                let param = {
                    page: 1,
                    classId: this.classId
                };
                API.getVideoList(param).then(res=> {
                    let {code,rs}=res;
                    if (code == 200) {
                        if (rs.pageList) {
                            rs.pageList.forEach((el) => {
                                el.isSlide = false;
                                if (el.pices) {
                                    el.pices = JSON.parse(el.pices)
                                } else {
                                    el.pices = [];
                                }
                                if (el.createTime) {
                                    el.createTime = util.changeDate(el.createTime)
                                }
                            });
                        } else {
                            rs.pageList = [];
                        }
                        this.pageTotal = rs.pageTotal;
                        this.videoList = rs.pageList;
                    } else {
                        this.msg = res.msg;
                        this.showToast();
                    }
                    this.$nextTick(function () {
                        this.scroll.refresh();
                        echo.render();
                        this.propsTitle();
                    })
                });
            },
            /*
             * @description: 懒加载
             *
             * @update: lwq (2017-03-08)
             */

            loadMore () {
                this.page++;
                if (this.page > this.pageTotal) {
                    return;
                }
                let param = {
                    page: this.page,
                    classId: this.classId
                };
                API.getVideoList(param).then(res=> {
                    let {code,rs}=res;
                    if (code == 200) {
                        if (rs.pageTotal) {
                            this.pageTotal = rs.pageTotal;
                        }
                        if (rs.pageList) {
                            rs.pageList.forEach((el, index)=> {
                                el.isSlide = false;
                                if (el.pices) {
                                    el.pices = JSON.parse(el.pices)
                                } else {
                                    el.pices = [];
                                }
                                if (el.createTime) {
                                    el.createTime = util.changeDate(el.createTime)
                                }
                                this.videoList.push(el);
                            });
                        }
                        this.refreshScroll()
                    } else {
                        this.msg = res.msg;
                        this.showToast();
                    }
                });
            },
            /*
             * @description: 显示保存结果信息
             *
             * @update: cxy (2017-03-07)
             */
            showToast () {
                this.toast = true
                if (this.toastTimer) clearTimeout(this.toastTimer)
                this.toastTimer = setTimeout(() => {
                    this.toast = false
                }, 2000)
            },
            /*
             * @description: 隐藏保存结果信息
             *
             * @update: cxy (2017-03-07)
             */
            hideToast () {
                this.toast = false
                if (this.toastTimer) clearTimeout(this.toastTimer)
            },
            /*
             * @description: 刷新滚动区域
             *
             * @update: cxy (2017-04-17)
             */
            refreshScroll(){
                this.$nextTick(function(){
                    this.scroll.refresh();
                })
            }
        }
    }
</script>
<style scoped>
    .nothing {
        background: url("./images/nothing.png") no-repeat center center;
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

    .play {
        height: 0.6rem;
        width: 0.6rem;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        margin: auto;
        background: url('./images/play.png') no-repeat center center;
        background-size: contain;
        z-index: 1;
    }

    .container {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        height:100%;
        overflow: hidden;
    }
    .container .list .list_item {
        padding-top: 0.12rem;
        position: relative;
        border-bottom: 0.12rem solid #EFF3F6;
    }

    .container .list .list_item:nth-last-child(1) {
        margin-bottom: 0 !important;
    }

    .container .list .list_item .list_main {
        padding-bottom: 0.08rem;
    }

    .container .list .list_item .list_main .title {
        height: 0.4rem;
        padding: 0 0.12rem;
    }

    /*老师头像*/
    .container .list .list_item .list_main .title .img_wrapper {
        height: 0.4rem;
        width: 0.4rem;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 0.1rem;
    }

    .container .list .list_item .list_main .title .img_wrapper img {
        display: block;
        height: 100%;
        width: 100%;
        object-fit: cover;
        -o-object-fit: cover;
        object-position: top;
        -o-object-position: top;
    }

    /*教师名称*/
    .container .list .list_item .list_main .title .name {
        color: #626979;
        font-size: 0.16rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    /*时间*/
    .container .list .list_item .list_main .title .time {
        color: #999;
        font-size: 0.14rem;
    }

    /*作业内容*/
    .container .list .list_item .list_main .list_content {
        padding: 0.1rem 0.12rem 0 0.12rem;
        font-size: 0.15rem;
        color: #626979;
        line-height: 0.22rem;
        text-align: justify;
    }

    /*布置作业附件*/
    .container .list .list_item .list_main .assign_homework {
        height: 1.73rem;
        overflow: hidden;
        position: relative;
        padding: 0 0.12rem;
        margin-top: 0.08rem;
    }

    .container .list .list_item .list_main .assign_homework img {
        display: block;
        height: 100%;
        width: 100%;
        object-fit: cover;
        -o-object-fit: cover;
        object-position: top;
        -o-object-position: top;
    }

    .container .list .list_item .list_main .assign_homework .num {
        background: rgba(0, 0, 0, 0.40);
        border-radius: 0.72rem;
        width: 0.39rem;
        height: 0.27rem;
        color: #fff;
        font-size: 0.14rem;
        position: absolute;
        z-index: 1;
        bottom: 0.06rem;
        right: 0.16rem;
    }


    .container .list .list_item .list_slide .unSlide {
        border-top: 1px solid #eff3f6;
        padding: 0.12rem 0;
        margin: 0 0.12rem;
        font-size: 0.16rem;
        color: #999;
    }

    .container .list .list_item .list_slide .unSlide .slideIcon {
        height: 0.07rem;
        width: 0.14rem;
        background: url("./images/slideBottom.png") no-repeat center center;
        background-size: 0.14rem 0.07rem;
    }

    .slideIconTop {
        height: 0.07rem;
        width: 0.14rem;
        background: url("./images/slideBottom.png") no-repeat center center;
        background-size: 0.14rem 0.07rem;
        -webkit-transform: rotate(180deg) !important;
        -moz-transform: rotate(180deg) !important;
        -ms-transform: rotate(180deg) !important;
        -o-transform: rotate(180deg) !important;
    }

    /*风采展开*/
    .container .list .list_item .list_slide .slided {
        padding-left: 0.12rem;
        padding-bottom: 0.15rem;
        overflow: auto;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
    }

    .container .list .list_item .list_slide .slided .slided_item {
        margin-right: 0.01rem;
        height: 1.4rem;
        width: 1.4rem;
        overflow: hidden;
        position: relative;
    }

    .container .list .list_item .list_slide .slided .slided_item img {
        display: block;
        height: 100%;
        width: 100%;
        object-fit: cover;
        -o-object-fit: cover;
        object-position: top;
        -o-object-position: top;
    }

    .mu-circular-progress {
        margin: 0.1rem 0;
    }

</style>
