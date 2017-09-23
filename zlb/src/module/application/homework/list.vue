<template>
    <div class="container" ref="container" v-cloak>
        <ul class="list" ref="loadY">
            <div class="refresh">
                <mu-circular-progress :size="30" />
            </div>
            <li class="list_item" v-for="(item,index) in homeworkList">
                <div class="list_main">
                    <div class="title" flex="cross:center" @click="toDetail(item.tid,classId)">
                        <div class="img_wrapper" flex-box="0">
                            <avatar v-if="!item.userDetaillDto.userPhoto" :userId="item.userId" :userName="item.userDetaillDto.userName"></avatar>
                            <img v-if="item.userDetaillDto.userPhoto" :src="item.userDetaillDto.userPhoto+'?imageView2/0/w/80/format/jpeg'">
                        </div>
                        <span class="name" flex-box="1" v-text="item.userDetaillDto.userName"></span>
                        <span class="time" flex-box="0" v-text="item.createTime"></span>
                    </div>
                    <div class="list_content"
                         :class="{'nopicPadding':showPadding(item.replyDetailList,revokeTimeArr[index],expirTimeArr[index],item.pices)}"
                         v-html="item.content" @click="toDetail(item.tid,classId)"></div>
                    <div class="assign_homework" v-if="item.pices&&item.pices.length>0"
                         @click="clientSwiper(item.pices,0)">
                        <img :src="ios?imagedomain+item.pices[0].imgUrl+'?imageView2/0/w/301/q/1/format/jpeg':loadUrl"  :data-echo="imagedomain+item.pices[0].imgUrl+'?imageView2/0/w/702/format/jpeg'" v-if="item.pices[0].type==1"/>
                        <img :src="ios?imagedomain+item.pices[0].imgUrl+'?vframe/jpeg/offset/1/w/301':loadUrl" :data-echo="imagedomain+item.pices[0].imgUrl+'?vframe/jpeg/offset/1/w/702'" v-if="item.pices[0].type==3"/>
                    <span class="num" flex="main:center cross:center" v-if="item.pices.length>1"
                          v-text="item.pices.length"></span>
                        <div class="play" v-if="item.pices[0].type==3"></div>
                        <div class="audioWrapper" v-if="item.pices[0].type==2">
                            <div class="audioTime">
                                <span v-text="parseInt(item.pices[0].time/60)<10?'0'+parseInt(item.pices[0].time/60):parseInt(item.pices[0].time/60)"></span>
                                <span>:</span>
                                <span v-text="item.pices[0].time%60<10?'0'+item.pices[0].time%60:item.pices[0].time%60"></span>
                            </div>
                            <div class="audioPlay"></div>
                        </div>
                    </div>
                    <div class="handle_area" flex="cross:center"
                         v-if="showHandle(item.replyDetailList,revokeTimeArr[index],expirTimeArr[index])">
                        <div class="clock" flex-box="0" v-if="expirTimeArr[index]>0"></div>
                        <div class="timeout" flex-box="1">
                            <span v-if="expirTimeArr[index]>0" v-text="newExpirTimeArr[index]"></span>
                            <span v-if="expirTimeArr[index]>0" class="second" v-text="newExpirSecArr[index]"></span>
                            <span v-if="expirTimeArr[index]>0">秒</span>
                        </div>
                        <mu-flat-button flex="cross:center" label="已过期"
                                        v-if="(!(item.replyDetailList&&item.replyDetailList.length>0))&&expirTimeArr[index]<=0"
                                        @click.stop="toDetail(item.tid,classId)"
                                        class="demo-flat-button my-disabled" disabled/>
                        <mu-flat-button flex="cross:center" label="提交"
                                        v-if="(!(item.replyDetailList&&item.replyDetailList.length>0))&&(!expirTimeArr[index]<=0)"
                                        @click.stop="toDetail(item.tid,classId)"
                                        class="demo-flat-button my-submit"/>
                        <mu-flat-button flex="cross:center" label="已提交"
                                        v-if="item.replyDetailList&&item.replyDetailList.length>0&&(!revokeTimeArr[index]>0)&&(expirTimeArr[index]>0)"
                                        @click.stop="toDetail(item.tid,classId)"
                                        class="demo-flat-button my-submited"/>
                        <mu-flat-button labelClass="labelClass_list" flex="cross:center"
                                        :label="'撤回 '+revokeTimeArr[index]+'s'"
                                        v-if="item.replyDetailList&&item.replyDetailList.length>0&&revokeTimeArr[index]>0"
                                        @click.stop="openDialog(item.tid,index)"
                                        class="demo-flat-button my-recall"/>
                    </div>
                </div>
                <div class="list_slide" v-if="item.replyDetailList&&item.replyDetailList.length>0">
                    <div class="unSlide" flex="main:justify cross:center" @click="slideFuc(index)">
                        <span class="color6">我的提交</span>
                        <span class="slideIcon" :class="{'slideIconTop':item.isSlide}"></span>
                    </div>
                    <transition name="fade">
                        <div v-if="item.isSlide">
                            <ul class="slided" flex>
                                <li class="slided_item" flex-box="0" v-for="(pic,m) in item.replyDetailList"
                                    @click="clientSwiper(item.replyDetailList,m)">
                                    <img :src="imagedomain+pic.imgUrl+'?imageView2/0/w/280/format/jpeg'"
                                         v-if="pic.type==1">
                                    <img :src="imagedomain+pic.imgUrl+'?vframe/jpeg/offset/1/w/280'"
                                         v-if="pic.type==3">
                                    <div class="play" v-if="pic.type==3"></div>
                                    <div class="audioWrapperSmall" v-if="pic.type==2">
                                        <div class="audioTimeSmall">
                                            <span v-text="parseInt(pic.time/60)<10?'0'+parseInt(pic.time/60):parseInt(pic.time/60)"></span>
                                            <span>:</span>
                                            <span v-text="pic.time%60<10?'0'+pic.time%60:pic.time%60"></span>
                                        </div>
                                        <div class="audioPlaySmall"></div>
                                    </div>
                                </li>
                            </ul>
                            <comment :commentObj="item" :index="index" :type="'APP_HOMEWORK'" @toParentComponents="refreshScroll" ref="commentMethod"></comment>
                        </div>
                    </transition>
                </div>
            </li>
        </ul>
        <mu-toast v-if="toast" :message="msg" @close="hideToast"/>
        <div class="allWrapper" v-if="dialog">
            <div class="innerWrapper">
                <p class="innerTitle">确定撤回作业？</p>
                <div class="innerBtnWrapper" flex="main:center">
                    <mu-raised-button label="取消" class="demo-raised-button innerCancelBtn" @click="closeDialog"
                                      flex-box="0"/>
                    <mu-raised-button label="撤回" class="demo-raised-button innerConfirmBtn" @click="cancelSubmit"
                                      flex-box="0"/>
                </div>
            </div>
        </div>
        <div class="nothing" v-if="homeworkList.length==0"></div>
    </div>
</template>
<script type="text/babel" async>
    import {imagedomain} from '../../../api/api.js'
    import avatar from '../../../components/defaultAvatar.vue'
    import api from '../../../api/api.js'
    import comment from '../../../components/comment/commentList.vue'
    import BScroll from 'better-scroll'
    const API = new api();
    export default{
        data () {
            return {
                homeworkList: 0,
                page: 1,
                classId: this.$route.query.classId,
                pageTotal: 0,
                imagedomain: imagedomain,
                expirTimeArr: [],
                newExpirTimeArr: [],
                newExpirSecArr: [],
                revokeTimeArr: [],
                msg: '',
                toast: false,
                intervalId: '',
                dialog: false,
                workId: '',
                index: '',
                nowTime: new Date(),
                scroll:'',
                ios:util.browser.versions.ios,
                loadUrl:require('../../../assets/imgLoad.png')
            }
        },
        components: {
            avatar,
            comment
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
                clearInterval(this.$store.state.app.intervalId)
                this.$store.state.app.list.forEach(() =>{
                    this.expirTimeArr=this.$store.state.app.expirTimeArr;
                    this.revokeTimeArr=this.$store.state.app.revokeTimeArr;
                    this.newExpirTimeArr.push('');
                    this.newExpirSecArr.push('');
                });
                this.intervalFun();
                this.homeworkList=this.$store.state.app.list;
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
        methods: {
            dataRefresh(){
                this.homeworkList = 0;
                this.page = 1;
                this.pageTotal = 0;
                this.expirTimeArr = [];
                this.newExpirTimeArr = [];
                this.newExpirSecArr = [];
                this.revokeTimeArr = [];
                this.msg = '';
                this.toast = false;
                this.intervalId = '';
                this.dialog = false;
                this.workId = '';
                this.index = '';
                this.nowTime = new Date()
            },
            timeRefresh(){
                if (new Date() - this.nowTime > 7000) {
                    this.refresh();
                } else {
                    this.nowTime = new Date();
                }
            },
            showHandle(list, revokeTime, expirTime){
                if (expirTime > 0 || revokeTime > 0 || !(list && list.length > 0)) {
                    return true;
                } else {
                    return false;
                }

            },
            showPadding(list, revokeTime, expirTime, pices){
                if (!(expirTime > 0 || revokeTime > 0 || !(list && list.length > 0)) && !(pices && pices.length > 0)) {
                    return true;
                } else {
                    return false;
                }

            },
            closeDialog(){
                this.dialog = false;
            },
            openDialog(workId, index){
                this.workId = workId;
                this.index = index;
                this.dialog = true;
            },
            /*
             * @description: 客户端头部初始化
             *
             * @update: cxy (2017-03-07)
             */
            propsTitle(){
                //TODO:客户端读取标题信息
                util.JsBridge('propsTitle', {
                    title: util.toUniCode('温故知新'),
                    color: '#67a5ff'
                }, (res)=> {
                })
            },
            toDetail(tid, classId){
                this.$store.dispatch('getList',{intervalId:this.intervalId,revokeTimeArr:this.revokeTimeArr,expirTimeArr:this.expirTimeArr,list:this.homeworkList,page:this.page,pageTotal:this.pageTotal,saveY:parseFloat(getComputedStyle(this.$refs.loadY, null).getPropertyValue("-webkit-transform").substring(7).split(',')[5])});
                this.$router.push({path: '/app/homework/submit', query: {tid: tid, classId: classId}})
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
                this.homeworkList[index].isSlide = !this.homeworkList[index].isSlide;
                this.refreshScroll();
            },
            /*
             * @description: 倒计时
             *
             * @update: lwq (2017-03-07)
             */

            intervalFun(){
                this.expirTimeArr.forEach((el, index)=> {
                    if (el > 0) {
                        this.intervalFormat(el, index);
                    }
                });
                this.intervalId = setInterval(()=> {
                    this.timeRefresh();
                    this.expirTimeArr.forEach((el, index)=> {
                        if (el > 0) {
                            el = el - 1;
                            this.expirTimeArr.splice(index, 1, el);
                            this.intervalFormat(el, index);
                        }
                    });
                    this.revokeTimeArr.forEach((el, index)=> {
                        if (el > 0) {
                            el = el - 1;
                            this.revokeTimeArr.splice(index, 1, el);
                        }
                    });
                }, 1000)
            },
            /*
             * @description: 倒计时格式化
             *
             * @update: lwq (2017-03-07)
             */

            intervalFormat(expirTime, index){
                if (expirTime >= 86400) {
                    this.newExpirTimeArr.splice(index, 1, new Date(expirTime * 1000).Time('d天hh时mm分'));
                } else if (expirTime >= 3600) {
                    this.newExpirTimeArr.splice(index, 1, new Date(expirTime * 1000).Time('hh时mm分'));
                } else if (expirTime >= 60) {
                    this.newExpirTimeArr.splice(index, 1, new Date(expirTime * 1000).Time('00时mm分'));
                } else {
                    this.newExpirTimeArr.splice(index, 1, new Date(expirTime * 1000).Time('00时00分'));
                }
                this.newExpirSecArr.splice(index, 1, new Date(expirTime * 1000).Time('ss'));
            },
            /*
             * @description: 下拉刷新
             *
             * @update: lwq (2017-03-06)
             */

            refresh () {
                this.page=1;
                let param = {
                    page: 1,
                    classId: this.classId
                };
                API.getHomeworkList(param).then(res=> {
                    let {code,rs}=res;
                    if (code == 200) {
                        clearInterval(this.intervalId);
                        this.dataRefresh();
                        if (rs.pageList) {
                            rs.pageList.forEach((el)=> {
                                el.isSlide = false;
                                if (el.pices) {
                                    el.pices = JSON.parse(el.pices)
                                } else {
                                    el.pices = [];
                                }
                                if (el.createTime) {
                                    el.createTime = util.changeDate(el.createTime)
                                }
                                if (el.expirTime >= 0) {
                                    this.expirTimeArr.push(el.expirTime)
                                } else {
                                    this.expirTimeArr.push('infinity')
                                }
                                if (el.revokeTime >= 0) {
                                    this.revokeTimeArr.push(el.revokeTime)
                                } else {
                                    this.revokeTimeArr.push('')
                                }
                                if (el.studentReply && el.studentReply.tchComment) {
                                    el.tchComment = JSON.parse(el.studentReply.tchComment);
                                } else {
                                    el.tchComment = [];
                                }
                                this.newExpirTimeArr.push('');
                                this.newExpirSecArr.push('');
                            });
                        } else {
                            rs.pageList = [];
                        }
                        this.pageTotal = rs.pageTotal;
                        this.homeworkList = rs.pageList;
                        this.intervalFun();
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
             * @update: lwq (2017-03-06)
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
                API.getHomeworkList(param).then(res=> {
                    let {code,rs}=res;
                    if (code == 200) {
                        clearInterval(this.intervalId);
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
                                if (el.expirTime >= 0) {
                                    this.expirTimeArr.push(el.expirTime)
                                } else {
                                    this.expirTimeArr.push('infinity')
                                }
                                if (el.revokeTime >= 0) {
                                    this.revokeTimeArr.push(el.revokeTime)
                                } else {
                                    this.revokeTimeArr.push('')
                                }
                                this.newExpirTimeArr.push('');
                                this.newExpirSecArr.push('');
                                this.homeworkList.push(el)
                            });
                        }
                        this.intervalFun();
                        this.refreshScroll();
                    } else {
                        this.msg = res.msg;
                        this.showToast();
                    }
                });
            },
            /*
             * @description: 撤销提交
             *
             * @update: lwq (2017-03-09)
             */

            cancelSubmit(){
                let param = {
                    classId: this.classId,
                    workId: this.workId
                };
                API.cancelHomeworkSubmit(param).then((res)=> {
                    let {code}=res;
                    if (code == 200) {
                        this.revokeTimeArr.splice(this.index, 1, '');
                        this.$set(this.homeworkList[this.index], 'replyDetailList', '');
                    }
                    this.msg = res.msg;
                    this.showToast();
                });
                this.dialog = false;
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
            },
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

    .nopicPadding {
        padding-bottom: 0.12rem !important;
    }

    .play {
        height: 0.34rem;
        width: 0.34rem;
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
        padding: 0 !important;
    }

    .container .list .list_item {
        padding-top: 0.12rem;
        border-bottom:0.12rem solid #EFF3F6;
    }

    .container .list .list_item:nth-last-child(1) {
        margin-bottom: 0 !important;
    }

    .container .list .list_item .list_main {

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
        width: 0.41rem;
        height: 0.29rem;
        color: #fff;
        font-size: 0.14rem;
        position: absolute;
        z-index: 1;
        bottom: 0.06rem;
        right: 0.2rem;
    }

    /*操作区域*/
    .container .list .list_item .list_main .handle_area {
        padding: 0 0.12rem;
        height: 0.46rem;
    }

    .container .list .list_item .list_main .handle_area .clock {
        height: 0.19rem;
        width: 0.17rem;
        background: url("./images/clock.png") no-repeat center center;
        background-size: 0.17rem 0.19rem;
        margin-right: 0.08rem;
    }

    .container .list .list_item .list_main .handle_area .timeout {
        font-size: 0;
    }

    .container .list .list_item .list_main .handle_area .timeout span {
        font-size: 0.14rem;
        color: #999;
    }

    .container .list .list_item .list_main .handle_area .timeout .second {
        font-size: 0.16rem;
        color: #67a5ff;
        padding: 0 0.05rem;
    }

    .container .list .list_item .list_main .handle_area .demo-flat-button {
        background: #fff;
        font-size: 0.14rem;
        margin-top: 0.03rem;
        border-radius: 1rem !important;
        width: 0.92rem !important;
        height: 0.28rem !important;
        line-height: 0.26rem;
    }

    .container .list .list_item .list_main .handle_area .my-submit {
        border: 1px solid #CFE8FF;
        color: #67a5ff;
        background: #fff;
    }

    .container .list .list_item .list_main .handle_area .my-submited {
        border: 1px solid #d2d2d2;
        color: #999;
        background: #fff;
    }

    .container .list .list_item .list_main .handle_area .my-disabled {
        color: #999;
        background: #f6f6f6;
    }

    .container .list .list_item .list_main .handle_area .my-recall {
        border: 1px solid #ffdda9;
        color: #ffbf5f;
        background: #fff;
    }

    /*下拉区域*/
    .container .list .list_item .list_slide {

    }

    .container .list .list_item .list_slide .unSlide {
        border-top: 1px solid #eff3f6;
        padding: 0.12rem 0;
        margin: 0 0.12rem;
        font-size: 0.16rem;
        color: #333;
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

    /*提交作业展开*/
    .container .list .list_item .list_slide .slided {
        padding-left: 0.12rem;
        padding-bottom: 0.12rem;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
        white-space: nowrap;
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

    .container .list .list_item .list_slide .reply_list {
        padding: 0 0.12rem;
        padding-bottom: 0.08rem;
    }

    .container .list .list_item .list_slide .reply_list .reply_item {
        padding: 0.02rem 0;
        position: relative;
    }

    .container .list .list_item .list_slide .reply_list .reply_item:active {
        background: #f7f8fa;
    }

    .container .list .list_item .list_slide .reply_list .reply_item .reply_wrapper {
        width: 100%;
        height: 100%;
        font-size: 0;
        text-align: justify;
    }

    .container .list .list_item .list_slide .reply_list .reply_item .reply_wrapper span {
        margin-right: 0.05rem;
        color: #999;
        font-size: 0.14rem;
    }

    .container .list .list_item .list_slide .reply_list .reply_item .reply_wrapper .reply_content {
        margin-right: 0;
        color: #6C7381;
    }

    .container .list .list_item .list_slide .reply_list .reply_item .reply_wrapper .span {
        color: #67a5ff;
        font-size: 0.14rem;
    }

    .mu-circular-progress {
        margin: 0.1rem 0;
    }

    /*语音*/
    .audioWrapper {
        height: 100%;
        width: 100%;
        position: relative;
        background: url("./images/audioBgLarge.png") no-repeat center bottom;
        background-size: 100% 100%;
        box-sizing: border-box;
        border: 1px solid #e7f1ff;
    }

    .audioWrapper .audioPlay {
        height: 0.55rem;
        width: 0.55rem;
        background: url("./images/audioPlay.png") no-repeat center center;
        background-size: contain;
        margin: 0 auto;
        margin-top: 0.2rem;
    }

    .audioWrapper .audioTime {
        color: #67a5ff;
        font-size: 0.18rem;
        text-align: center;
        padding-top: 0.35rem;
    }

    .audioWrapperSmall {
        height: 100%;
        width: 100%;
        position: relative;
        background: url("./images/audioBg.png") no-repeat center bottom;
        background-size: 100% 100%;
        border: 1px solid #e7f1ff;
        box-sizing: border-box;
    }

    .audioWrapperSmall .audioTimeSmall {
        color: #67a5ff;
        font-size: 0.16rem;
        text-align: center;
        padding-top: 0.25rem;
    }

    .audioWrapperSmall .audioPlaySmall {
        height: 0.45rem;
        width: 0.45rem;
        background: url("./images/audioPlay.png") no-repeat center center;
        background-size: contain;
        margin: 0 auto;
        margin-top: 0.2rem;
    }

    .allWrapper {
        background: rgba(0, 0, 0, 0.8);
        height: 100%;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 111;
    }

    .innerWrapper {
        height: 1.7rem;
        width: 2.85rem;
        background: #fff;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border-radius: 0.04rem;
    }

    .innerTitle {
        font-size: 0.18rem;
        text-align: center;
        color: #333;
        padding-top: 0.38rem;
    }

    .innerBtnWrapper {
        padding-top: 0.4rem;
    }

    .innerCancelBtn {
        background: #e8e8e8;
        border-radius: 1rem;
        width: 0.86rem;
        height: 0.44rem;
        color: #666;
        margin-right: 0.1rem;
    }

    .innerConfirmBtn {
        background: #ffbf5f;
        border-radius: 1rem;
        width: 0.86rem;
        height: 0.44rem;
        color: #fff;
        margin-left: 0.1rem;
    }
</style>

