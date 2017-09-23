<template>
    <div class="container" ref="container" v-cloak>
        <ul class="list" v-refresh="refresh" v-load="loadMore" ref="loadY">
            <div class="refresh">
                <mu-circular-progress :size="30" />
            </div>
            <li class="list_item" v-for="(item,index) in homeworkList">
                <div class="notComment" v-if="item.notCommentNum&&item.notCommentNum>0" v-text="item.notCommentNum" flex="cross:center main:center"></div>
                <div class="list_main">
                    <div class="title" flex="cross:center" @click="toDetail(item.tid)">
                        <div class="img_wrapper" flex-box="0">
                            <avatar v-if="!item.userDetaillDto.userPhoto" :userId="item.userId" :userName="item.userDetaillDto.userName"></avatar>
                            <img v-if="item.userDetaillDto.userPhoto" :src="item.userDetaillDto.userPhoto+'?imageView2/0/w/80/format/jpeg'">
                        </div>
                        <span class="name" flex-box="1" v-text="item.userDetaillDto.userName"></span>
                        <span class="time" flex-box="0" v-text="item.createTime"></span>
                    </div>
                    <div class="list_content" v-html="item.content" @click="toDetail(item.tid)"></div>
                    <div class="assign_homework" v-if="item.pices&&item.pices.length>0" @click="clientSwiper(item.pices,0)">
                        <img :src="ios?imagedomain+item.pices[0].imgUrl+'?imageView2/0/w/301/q/1/format/jpeg':loadUrl"  :data-echo="imagedomain+item.pices[0].imgUrl+'?imageView2/0/w/702/format/jpeg'" v-if="item.pices[0].type==1"/>
                        <img :src="ios?imagedomain+item.pices[0].imgUrl+'?vframe/jpeg/offset/1/w/301':loadUrl" :data-echo="imagedomain+item.pices[0].imgUrl+'?vframe/jpeg/offset/1/w/702'" v-if="item.pices[0].type==3"/>
                        <span class="num" flex="main:center cross:center" v-if="item.pices.length>1" v-text="item.pices.length"></span>
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
                    <div class="handle_area" flex="cross:center" @click="toDetail(item.tid)">
                        <div class="clock" flex-box="0" v-if="item.notReplyNum&&item.notReplyNum>0&&(expirTimeArr[index]!='infinity')"></div>
                        <div class="timeout" flex-box="1">
                            <span v-if="item.notReplyNum&&item.notReplyNum>0&&(expirTimeArr[index]!='infinity')" v-text="newExpirTimeArr[index]"></span>
                            <span v-if="item.notReplyNum&&item.notReplyNum>0&&(expirTimeArr[index]!='infinity')" class="second" v-text="newExpirSecArr[index]"></span>
                            <span v-if="item.notReplyNum&&item.notReplyNum>0&&(expirTimeArr[index]!='infinity')">秒</span>
                        </div>
                        <div class="uncommitted">
                            <span v-if="!(item.notReplyNum&&item.notReplyNum>0)">全部已提交</span>
                            <span v-if="item.notReplyNum&&item.notReplyNum>0">未提交</span>
                            <span v-if="item.notReplyNum&&item.notReplyNum>0" class="uncommitNum" v-text="item.notReplyNum"></span>
                            <span v-if="item.notReplyNum&&item.notReplyNum>0">人</span>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <mu-toast v-if="toast" :message="msg" @close="hideToast"/>
        <div class="nothing" v-if="homeworkList.length==0"></div>
    </div>
</template>
<script type="text/babel" async>
    import {imagedomain} from '../../../api/api.js'
    import avatar from '../../../components/defaultAvatar.vue'
    import api from '../../../api/api.js'
    import BScroll from 'better-scroll'
    const API =new api();
    export default{
        data () {
            return {
                classes:[],
                homeworkList:0,
                page:1,
                classId:this.$route.query.classId,
                pageTotal:0,
                imagedomain:imagedomain,
                isScroll:true,
                expirTimeArr:[],
                newExpirTimeArr:[],
                newExpirSecArr:[],
                msg:'',
                toast:false,
                intervalId:'',
                nowTime:new Date(),
                scroll:'',
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
                clearInterval(this.$store.state.app.intervalId)
                this.$store.state.app.list.forEach(() =>{
                    this.expirTimeArr=this.$store.state.app.expirTimeArr;
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
        components:{
            avatar
        },
        methods: {
            dataRefresh(){
                    this.classes=[];
                    this.homeworkList=0;
                    this.page=1;
                    this.pageTotal=0;
                    this.expirTimeArr=[];
                    this.newExpirTimeArr=[];
                    this.newExpirSecArr=[];
                    this.msg='';
                    this.toast=false;
                    this.intervalId='';
                    this.nowTime=new Date()
            },
            /*
             * @description: 客户端头部初始化
             *
             * @update: cxy (2017-03-07)
             */
            propsTitle(){
                //TODO:客户端读取标题信息
                util.JsBridge('propsTitle',{
                    title:util.toUniCode('温故知新'),
                    color: '#67a5ff'
                },(res)=>{})
            },
            toDetail(workId){
                this.$store.dispatch('getList',{intervalId:this.intervalId,expirTimeArr:this.expirTimeArr,list:this.homeworkList,page:this.page,pageTotal:this.pageTotal,saveY:parseFloat(getComputedStyle(this.$refs.loadY, null).getPropertyValue("-webkit-transform").substring(7).split(',')[5])});
                this.$router.push({path:'/app/homework/callback',query:{workId:workId,classId:this.classId}})
            },
            /*
             * @description: 客户端浏览文件
             *
             * @update: cxy (2017-03-09)
             */
            clientSwiper(pices,index){
                let arr = Array.prototype.toString.call(pices) === '[object String]' ? JSON.parse(JSON.stringify(JSON.parse(pices))) : JSON.parse(JSON.stringify(pices))
                arr.forEach(function(e){
                    e.imgUrl=imagedomain+e.imgUrl;
                    if(e.type==3){
                        e.coverUrl=imagedomain+ e.imgUrl+'?vframe/jpeg/offset/1';
                    }
                });
                //TODO:客户端浏览文件
                util.JsBridge('picesSwiper',{
                    picesList: arr,
                    picesIndex:index
                },(res)=>{})
            },

            timeRefresh(){
                if(new Date() - this.nowTime>7000){
                    this.refresh();
                }else{
                    this.nowTime=new Date();
                }
            },
            /*
             * @description: 倒计时
             *
             * @update: lwq (2017-03-07)
             */

            intervalFun(){
                this.expirTimeArr.forEach((el,index)=>{
                    if(el>0){
                        this.intervalFun(el,index);
                    }else if(el<=0){
                        this.intervalFormat(el,index);
                    }
                });
                this.intervalId=setInterval( ()=> {
                    this.timeRefresh();
                    this.expirTimeArr.forEach((el,index)=>{
                        if(el>0){
                            el=el-1;
                            this.expirTimeArr.splice(index,1,el);
                            this.intervalFormat(el,index);
                        }else if(el<=0){
                            this.intervalFormat(el,index);
                        }
                    });
                },1000)
            },
            /*
             * @description: 倒计时格式化
             *
             * @update: lwq (2017-03-07)
             */

            intervalFormat(expirTime,index){
                if(expirTime>=86400){
                    this.newExpirTimeArr.splice(index,1,new Date(expirTime*1000).Time('d天hh时mm分'));
                }else if(expirTime>=3600){
                    this.newExpirTimeArr.splice(index,1,new Date(expirTime*1000).Time('hh时mm分'));
                }else if(expirTime>=60){
                    this.newExpirTimeArr.splice(index,1,new Date(expirTime*1000).Time('00时mm分'));
                }else{
                    this.newExpirTimeArr.splice(index,1,new Date(expirTime*1000).Time('00时00分'));
                }
                if(expirTime>=0){
                    this.newExpirSecArr.splice(index,1,new Date(expirTime*1000).Time('ss'));
                }else if(expirTime<0){
                    this.newExpirSecArr.splice(index,1,new Date(expirTime*1000).Time('00'));
                }
            },
            /*
             * @description: 下拉刷新
             *
             * @update: lwq (2017-03-03)
             */

            refresh () {
                this.page=1;
                let param={
                    page:1,
                    classId:this.classId
                };
                API.getTchHomeworkList(param).then(res=>{
                    let {code,rs}=res;
                    if(code==200){
                        clearInterval(this.intervalId);
                        this.dataRefresh();
                        if(rs.pageList){
                            rs.pageList.forEach((el) =>{
                                if(el.pices){
                                    el.pices=JSON.parse(el.pices)
                                }else{
                                    el.pices=[];
                                }
                                if(el.createTime){
                                    el.createTime=util.changeDate(el.createTime)
                                }
                                if(el.expirTime>=0){
                                    this.expirTimeArr.push(el.expirTime)
                                }else{
                                    this.expirTimeArr.push('infinity')
                                }
                                this.newExpirTimeArr.push('');
                                this.newExpirSecArr.push('');
                            });
                        }else{
                            rs.pageList=[];
                        }
                        this.intervalFun();
                        this.pageTotal=rs.pageTotal;
                        this.homeworkList=rs.pageList;
                    }else{
                        this.msg = res.msg;
                        this.showToast();
                    }
                    this.$nextTick(function(){
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
                if(this.page>this.pageTotal){
                    return;
                }
                let param={
                    page:this.page,
                    classId:this.classId
                };
                API.getTchHomeworkList(param).then(res=>{
                    let {code,rs}=res;
                    if(code==200){
                        clearInterval(this.intervalId);
                        if(rs.pageTotal){
                            this.pageTotal=rs.pageTotal;
                        }
                        if(rs.pageList){
                            rs.pageList.forEach( (el,index)=> {
                                if(el.pices){
                                    el.pices=JSON.parse(el.pices)
                                }else{
                                    el.pices=[];
                                }
                                if(el.createTime){
                                    el.createTime=util.changeDate(el.createTime)
                                }
                                if(el.expirTime>=0){
                                    this.expirTimeArr.push(el.expirTime)
                                }else{
                                    this.expirTimeArr.push('infinity')
                                }
                                this.newExpirTimeArr.push('');
                                this.newExpirSecArr.push('');
                                this.homeworkList.push(el)
                            });
                        }
                        this.intervalFun();
                        this.refreshScroll();
                    }else{
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
    .nothing{
        background: url("./images/nothing.png") no-repeat center center;
        height: 2rem;
        width: 2rem;
        background-size: contain;
        position: absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        margin: auto;
        z-index: 1;
    }
    .play{
        height: 0.34rem;
        width: 0.34rem;
        position: absolute;
        top: 0;
        bottom:0;
        right:0;
        left: 0;
        margin: auto;
        background: url('./images/play.png') no-repeat center center;
        background-size:contain;
        z-index: 1;
    }
    .nopicPadding{
        padding-bottom: 0.12rem !important;
    }
    .container {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        height:100%;
        overflow: hidden;
        /*background: #EFF3F6;*/
    }
    .container .list{
        padding: 0!important;
    }
    .container  .list .list_item{
        padding-top:0.12rem;
        border-bottom:0.12rem solid #EFF3F6;
        position: relative;
    }
    .container  .list .list_item:nth-last-child(1){
        margin-bottom: 0 !important;
    }
    .container  .list .list_item .notComment{
        position: absolute;
        width: 0.44rem;
        height: 0.25rem;
        background: url("./images/notComment.png") no-repeat center center;
        background-size: 0.44rem 0.25rem;
        z-index: 1;
        right: 0.12rem;
        font-size: 0.16rem;
        color:#fff;
        top:0;
    }
    .container  .list .list_item .list_main{

    }
    .container  .list .list_item .list_main .title{
        height: 0.4rem;
        padding:0 0.12rem;
    }
    /*老师头像*/
    .container  .list .list_item .list_main .title .img_wrapper{
        height: 0.4rem;
        width: 0.4rem;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 0.1rem;
    }
    .container  .list .list_item .list_main .title .img_wrapper img{
        display: block;
        height: 100%;
        width: 100%;
        object-fit: cover;
        -o-object-fit: cover;
        object-position: top;
        -o-object-position: top;
    }
    /*教师名称*/
    .container  .list .list_item .list_main .title .name{
        color:#626979;
        font-size: 0.16rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    /*时间*/
    .container  .list .list_item .list_main .title .time{
        color:#999;
        font-size: 0.14rem;
    }
    /*作业内容*/
    .container  .list .list_item .list_main .list_content{
        padding: 0.1rem 0.12rem 0 0.12rem;
        font-size: 0.15rem;
        color: #626979;
        line-height: 0.22rem;
        text-align: justify;
    }
    /*布置作业附件*/
    .container  .list .list_item .list_main .assign_homework{
        height: 1.73rem;
        overflow: hidden;
        position: relative;
        padding:0 0.12rem;
        margin-top:0.08rem;
    }
    .container  .list .list_item .list_main .assign_homework img{
        display: block;
        height: 100%;
        width: 100%;
        object-fit: cover;
        -o-object-fit: cover;
        object-position: top;
        -o-object-position: top;
    }
    .container  .list .list_item .list_main .assign_homework .num{
        background:rgba(0,0,0,0.40);
        border-radius:0.72rem;
        width:0.39rem;
        height:0.27rem;
        color:#fff;
        font-size: 0.14rem;
        position: absolute;
        z-index: 1;
        bottom:0.06rem;
        right:0.2rem;
    }
    /*操作区域*/
    .container  .list .list_item .list_main .handle_area{
        padding:0 0.12rem;
        height: 0.46rem;
    }
    .container  .list .list_item .list_main .handle_area .clock{
        height: 0.19rem;
        width: 0.17rem;
        background: url("./images/clock.png") no-repeat center center;
        background-size:0.17rem 0.19rem;
        margin-right: 0.08rem;
    }
    .container  .list .list_item .list_main .handle_area .timeout{
        font-size: 0;
    }
    .container  .list .list_item .list_main .handle_area .timeout span{
        font-size: 0.14rem;
        color:#999;
    }
    .container  .list .list_item .list_main .handle_area .timeout .second{
        font-size: 0.16rem;
        color:#67a5ff;
        padding:0 0.05rem;
    }
    .container  .list .list_item .list_main .handle_area .uncommitted{
        font-size: 0.14rem;
        color:#999;
    }
    
    /*语音*/
    .audioWrapper{
        height: 100%;
        width: 100%;
        position: relative;
        background: url("./images/audioBgLarge.png") no-repeat center bottom;
        background-size: 100% 100%;
        box-sizing: border-box;
        border: 1px solid #e7f1ff;
    }
    .audioWrapper .audioPlay{
        height: 0.55rem;
        width: 0.55rem;
        background: url("./images/audioPlay.png") no-repeat center center;
        background-size: contain;
        margin: 0 auto;
        margin-top: 0.2rem;
    }
    .audioWrapper .audioTime{
        color:#67a5ff;
        font-size: 0.18rem;
        text-align: center;
        padding-top: 0.35rem;
    }
    .mu-circular-progress{
        margin:0.1rem 0;
    }
</style>
