<template>
    <div class="container" ref="container">
        <div class="userInfo" flex="main:justify cross:center">
            <div class="teacherInfo" flex="cross:center" flex-box="0">
                <img :src="teacherHeadUrl+'?imageView2/0/w/80/format/jpeg'" v-if="teacherHeadUrl!==''" flex-box="0"/>
                <div class="photoWrap" v-if="teacherHeadUrl===''" flex-box="0">
                    <avatar :userId="teacherId" :userName="teacherName"></avatar>
                </div>
            </div>
            <div class="color6 teacherName" flex-box="1" v-text="teacherName"></div>
            <div class="selectPanel" flex="cross:center" @click="showInfo()" flex-box="0">
                <div class="color9 font14" v-text="mainInfo.createTime"></div>
                <img src="./images/select.png" ref="selectImg" :class="{'imgBottom':!selectInfo}"/>
            </div>
        </div>
        <div class="homeworkInfo" v-if="selectInfo">
            <div class="homeworkContent color3" v-html="mainInfo.content"></div>
            <ul class="workPices">
                <li v-for="(picItem,index) in pices" :class="{largeLi:index===0&&pices.length%2!==0}"
                    @click="clientSwiper(pices,index)">
                    <div class="workPicesWrap">
                        <img :src="imagedomain+picItem.imgUrl+'?imageView2/0/w/708/format/jpeg'" class="workPicesItem"
                             v-if="picItem.type==1&&index===0&&pices.length%2!==0"/>
                        <img :src="imagedomain+picItem.imgUrl+'?vframe/jpeg/offset/1/w/708'" class="workPicesItem"
                             v-if="picItem.type==3&&index===0&&pices.length%2!==0"/>
                        <img :src="imagedomain+picItem.imgUrl+'?imageView2/0/w/346/format/jpeg'" class="workPicesItem"
                             v-if="picItem.type==1&&!(index===0&&pices.length%2!==0)"/>
                        <img :src="imagedomain+picItem.imgUrl+'?vframe/jpeg/offset/1/w/346'" class="workPicesItem"
                             v-if="picItem.type==3&&!(index===0&&pices.length%2!==0)"/>
                        <div v-if="picItem.type==2" style="width:100%;height:100%;border:1px solid #e7f1ff;">
                            <img src="./images/audioBg.png" class="audioBg">
                            <div class="audioTime font16">
                                <span v-text="parseInt(picItem.time/60)<10?'0'+parseInt(picItem.time/60):parseInt(picItem.time/60)"></span>
                                <span>:</span>
                                <span v-text="picItem.time%60<10?'0'+picItem.time%60:picItem.time%60"></span>
                            </div>
                            <img src="./images/audioPlay.png" class="audioPlay"/>
                        </div>
                    </div>
                    <div class="play" v-if="picItem.type==3"></div>
                </li>
            </ul>
            <div class="expirTime" flex="main:center cross:center" v-if="expirTime>0">
                <img class="clock" src="./images/clock.png"/>
                <div class="color9 font14">
                    <span v-text="newExpirTime"></span>
                    <span class="expirTimeBlue" v-text="newExpirSec"></span>
                    秒
                </div>
            </div>
            <div class="homeworkToast color3 font14" flex="main:center cross:center" v-if="studentList.length!==0"><span
                    v-text="studentList.length"></span>人未提交
            </div>
            <div class="color9" flex="main:center cross:center" v-if="studentList.length===0">全部已提交</div>
            <ul class="studentList">
                <li v-for="(student,index) in studentList"
                    :style="{marginRight:(index-5)%6===0?0:0.06+'rem',marginLeft:0.06+'rem'}"
                    flex="cross:center dir:top">
                    <div class="studentDefaultWrap" v-if="student.photoUrl==''">
                        <avatar :userId="student.studentId" :userName="student.studentName"></avatar>
                    </div>
                    <img :src="student.photoUrl+'?imageView2/0/w/80/format/jpeg'" v-if="student.photoUrl!=''"/>
                    <div class="font12 color6 studentName" flex="main:center cross:center"
                         v-text="student.studentName"></div>
                </li>
            </ul>
        </div>
        <div class="gray"></div>
        <div class="studentReply">
            <ul class="ReplyList">
                <li class="replyItem" v-for="(reply,replyIndex) in replyList">
                    <div class="replyTitle" flex="main:justify cross:center">
                        <div>
                            <div class="unReply" v-if="!reply.tchComment || reply.tchComment=='[]'"></div>
                            <div class="color3" v-text="reply.studentName"></div>
                        </div>
                        <div flex="cross:center" class="comment" @click="setComment(replyIndex,reply.tid)">
                            <img src="./images/comment.png"/>
                            <span>点评</span>
                        </div>
                    </div>
                    <ul class="replyPicesList">
                        <li class="replyPicesItem" v-for="(replyPic,index) in reply.detailList"
                            :class="{replyLargeLi:reply.detailList.length===1}"
                            @click="clientSwiper(reply.detailList,index)">
                            <div class="picesWrap">
                                <img :src="imagedomain+replyPic.imgUrl+'?imageView2/0/w/708/format/jpeg'"
                                     v-if="replyPic.type==1"/>
                                <img :src="imagedomain+replyPic.imgUrl+'?vframe/jpeg/offset/1/w/708'"
                                     v-if="replyPic.type==3"/>
                                <div class="audioWrapperSmall" v-if="replyPic.type==2"
                                     :class="{'audioWrapperBig':reply.detailList.length===1}">
                                    <div class="audioTimeSmall" :class="{'audioTimeBig':reply.detailList.length===1}">
                                        <span v-text="parseInt(replyPic.time/60)<10?'0'+parseInt(replyPic.time/60):parseInt(replyPic.time/60)"></span>
                                        <span>:</span>
                                        <span v-text="replyPic.time%60<10?'0'+replyPic.time%60:replyPic.time%60"></span>
                                    </div>
                                    <div class="audioPlaySmall"
                                         :class="{'audioPlayBig':reply.detailList.length===1}"></div>
                                </div>
                                <div class="play" v-if="replyPic.type==3"></div>
                            </div>
                        </li>
                    </ul>
                    <comment :commentObj="reply" :index="replyIndex" :type="'APP_HOMEWORK'" @toParentComponents="getInfo" ref="commentMethod"></comment>
                    <div class="gray"></div>
                </li>
            </ul>
        </div>
        <mu-toast v-if="toast" :message="msg" @close="hideToast"/>
    </div>
</template>
<script type="text/babel">
    import {imagedomain} from '../../../api/api.js'
    import avatar from '../../../components/defaultAvatar.vue'
    import comment from '../../../components/comment/commentList.vue'
    import api from '../../../api/api.js'
    const API = new api();
    export default{
        data(){
            return {
                pices: [],
                studentList: [],
                selectInfo: true,
                imagedomain: imagedomain,
                replyList: [],
                mainInfo: [],
                teacherName: '',
                teacherHeadUrl: '',
                toast: false,
                msg: '',
                expirTime: '',
                newExpirTime: '',
                newExpirSec: '',
                intervalId: '',
                teacherId: 0,
                nowTime: new Date()
            }
        },
        components: {
            avatar,
            comment
        },
        mounted(){
            this.$nextTick(function () {
                this.getDetail();
            })
        },
        methods: {
            getDetail(){
                /*
                 * @description: 请求后台数据
                 *
                 * @update: cxy (2017-03-07)
                 */
                const param = {
                    workId: this.$route.query.workId,
                    classId: this.$route.query.classId
                }
                const that = this;
                let response = API.getTchData(param);
                response.then((res)=> {
                    that.dataCallBack(res)
                }).catch((err)=> {
                    console.log(err)
                })
            },
            dataRefresh(){
                this.pices = [];
                this.studentList = [];
                this.selectInfo = true;
                this.replyList = [];
                this.mainInfo = [];
                this.teacherHeadUrl = '';
                this.toast = false;
                this.msg = '';
                this.expirTime = '';
                this.newExpirTime = '';
                this.newExpirSec = '';
                this.intervalId = '';
                this.teacherId = 0;
                this.nowTime = new Date()
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
            replySlide(index){
                this.replyList[index].isSlide = !this.replyList[index].isSlide;
            },
            /*
             * @description: 客户端浏览文件
             *
             * @update: cxy (2017-03-09)
             */
            clientSwiper(pices, index){
                let arr = Array.prototype.toString.call(pices) === '[object String]' ? JSON.parse(JSON.stringify(JSON.parse(pices))) : JSON.parse(JSON.stringify(pices))
                arr.forEach(function (e) {
                    e.imgUrl = imagedomain + e.imgUrl
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
            /*
             * @description: 显示/隐藏详细信息
             *
             * @update: cxy (2017-03-07)
             */
            showInfo(){
                this.selectInfo = !this.selectInfo;
            },
            /*
             * @description: 后台返回数据处理
             *
             * @update: cxy (2017-03-07)
             */
            dataCallBack(res){
                if (res.code === 200) {
                    clearInterval(this.intervalId);
                    this.dataRefresh();
                    let result = res.rs;
                    res.rs.homework.createTime = util.changeDate(res.rs.homework.createTime);
                    this.mainInfo = result.homework;
                    this.teacherName = res.teacherName;
                    if (result.homework.pices) {
                        result.homework.pices = JSON.parse(result.homework.pices);
                        this.pices = result.homework.pices;
                    }
                    if (res.replyDetail) {
                        this.studentList = res.replyDetail.unOperStudents;
                    }
                    this.teacherId = res.teacherId;
                    this.teacherHeadUrl = res.teacherHeadUrl;
                    if (res.rs.homework.expirTime > 0) {
                        this.intervalFun(res.rs.homework.expirTime);
                    }
                    if (res.rs.replyList && res.rs.replyList.length > 0) {
                        res.rs.replyList.forEach((e)=> {
                            e.isSlide = false;
                        });
                        this.replyList = res.rs.replyList;
                        this.showInfo();
                    }
                } else {
                    this.msg = res.msg;
                    this.showToast();
                }
                this.$nextTick(function () {
                    this.propsTitle();
                })
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
            timeRefresh(){
                if (new Date() - this.nowTime > 7000) {
                    this.getDetail();
                } else {
                    this.nowTime = new Date();
                }
            },
            /*
             * @description: 倒计时
             *
             * @update: lwq (2017-03-07)
             */
            intervalFun(expirTime){
                this.expirTime = expirTime;
                if (this.expirTime > 0) {
                    this.intervalFormat(this.expirTime)
                } else if (this.expirTime <= 0) {
                    this.intervalFormat(this.expirTime)
                }
                this.intervalId = setInterval(()=> {
                    this.timeRefresh();
                    this.expirTime = this.expirTime - 1;
                    if (this.expirTime > 0) {
                        this.intervalFormat(this.expirTime);
                    } else {
                        this.intervalFormat(this.expirTime);
                    }
                }, 1000)
            },
            /*
             * @description: 倒计时格式化
             *
             * @update: lwq (2017-03-07)
             */
            intervalFormat(expirTime){
                this.expirTime = expirTime;
                if (this.expirTime >= 86400) {
                    this.newExpirTime = new Date(this.expirTime * 1000).Time('d天hh时mm分');
                } else if (this.expirTime >= 3600) {
                    this.newExpirTime = new Date(this.expirTime * 1000).Time('hh时mm分');
                } else if (this.expirTime >= 60) {
                    this.newExpirTime = new Date(this.expirTime * 1000).Time('00时mm分');
                } else {
                    this.newExpirTime = new Date(this.expirTime * 1000).Time('00时00分');
                }
                if (this.expirTime >= 0) {
                    this.newExpirSec = new Date(this.expirTime * 1000).Time('ss');
                } else if (this.expirTime < 0) {
                    this.newExpirSec = new Date(this.expirTime * 1000).Time('00');
                }
            },
            /*
             * @description: 客户端点评
             *
             * @update: cxy (2017-03-09)
             */
            setComment(index, replyId){
                //TODO:客户端评论信息
                util.JsBridge('setComment', {
                    limit: 100,
                    placeHolder: '请输入100字以内评论',
                    noJSONParse: true
                }, (result)=> {
                    let data = {};
                    if (result.indexOf('type') == -1) {
                        data.type = 1;
                        data.content = util.utf16toEntities(result)
                    } else {
                        result = JSON.parse(result);
                        data.type=result.type;
                        if(data.type==2){
                            data.time=result.time;
                        }
                        data.content = util.utf16toEntities(result.content)
                    }
                    const param = {
                        classId:this.$route.query.classId,
                        type:data.type,
                        appId: this.$route.query.workId,
                        secId:replyId,
                        content:data.content,
                        appCode:'APP_HOMEWORK'
                    }
                    if(result.type==2){
                        param.time=result.time;
                    }
                    const that = this;
                    let response = API.setComment(param);
                    response.then((res)=> {
                        let {code,rs}=res;
                        if (res.code === 200) {
                            this.$refs.commentMethod[index].sonSetComment(rs);
                            this.$nextTick(function(){
                                this.refreshScroll();
                            })
                        } else {
                            that.msg = res.msg;
                            that.showToast();
                        }
                    })
                })
            },
            /*
             * @description: 获取子组件传递信息
             *
             * @update: cxy (2017-04-17)
             */
            getInfo(res){
                if(res=='refresh'){
                    this.refreshScroll()
                }

            }
        }
    }
</script>
<style scoped lang="scss">
    .teacherName {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .container {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
    }

    .studentReply {
        background: #fff;
    }

    .homeworkInfo {
        background: #fff;
    }

    .userInfo {
        background: #ffffff;
        width: 100%;
        height: 0.7rem;
    }

    .teacherInfo img {
        width: 0.4rem;
        height: 0.4rem;
        border-radius: 100%;
        margin: 0 0.12rem;
    }

    .selectPanel img {
        width: 0.11rem;
        height: 0.06rem;
        margin: 0 0.12rem;
    }

    .selectPanel .imgBottom {
        -webkit-transform: rotate(180deg) !important;
        -moz-transform: rotate(180deg) !important;
        -ms-transform: rotate(180deg) !important;
        -o-transform: rotate(180deg) !important;
    }

    .homeworkContent {
        margin: 0 0.12rem
    }

    .workPices {
        overflow: hidden;
        padding-bottom: 0.15rem;
        padding-top: 0.05rem;
        margin-left: 0.12rem;

    li {
        width: 1.75rem;
        margin-right: 1px;
        margin-bottom: 1px;
        height: 1.75rem;
        float: left;
        position: relative;
    }

    }
    .workPices .largeLi {
        width: 3.51rem;
        height: 1.75rem;

    .audioBg {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
    }

    .audioPlay {
        position: absolute;
        width: 0.55rem;
        height: 0.55rem;
        left: 0;
        right: 0;
        margin: auto;
        top: 0.82rem;
    }

    .audioTime {
        position: absolute;
        width: 100%;
        top: 0.35rem;
        left: 0;
        color: #67a5ff;
        font-size: 0.2rem !important;
        text-align: center;
    }

    }
    .largeLi .workPicesWrap {
        width: 3.51rem;
        height: 1.75rem;
    }

    .play {
        background: url("./images/play.png") 0 0 no-repeat;
        background-size: contain;
        width: 0.34rem;
        height: 0.34rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -0.17rem;
        margin-left: -0.17rem;
    }

    .expirTime {
        margin-bottom: 0.26rem;
    }

    .expirTimeBlue {
        color: #67a5ff;
        font-size: 0.16rem;
    }

    .clock {
        width: 0.17rem;
        height: 0.19rem;
        margin-right: 0.09rem;
    }

    .homeworkToast {
        padding-bottom: 0.08rem;
        margin: 0 0.12rem;
        border-bottom: 1px solid #eff3f6;
    }

    .studentList {
        overflow: hidden;
        margin-top: 0.12rem;

    li {
        float: left;
        margin-bottom: 0.06rem;
        text-align: center;

    img {
        width: 0.45rem;
        height: 0.45rem;
        border-radius: 100%;
    }

    }
    }
    .ReplyList {
        overFlow: hidden;
    }

    .replyItem {
        width: 100%;
    }

    .replyTitle {
        height: 0.43rem;
        margin: 0 0.12rem;
        position: relative;
    }

    .unReply {
        position: absolute;
        left: -0.2rem;
        top: 0;
        border-top: 0.311rem solid #ffa9a9;
        border-right: 0.311rem solid transparent;
    }

    .comment {
        height: 100%;

    img {
        width: 0.19rem;
        height: 0.19rem;
        margin-right: 0.06rem;
    }

    span {
        font-size: 0.14rem;
        color: #67a5ff;
    }

    }
    .replyPicesList {
        overflow: hidden;
        margin-left: 0.12rem;
    }

    .replyPicesItem {
        float: left;
        width: 1.16rem;
        height: 1.16rem;
        margin-right: 1px;
        margin-bottom: 1px;
    }

    .picesWrap {
        width: 1.16rem;
        height: 1.16rem;
        overflow: hidden;
        position: relative;
        align-items: center;
        display: flex;

    img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
        -o-object-fit: cover;
        object-position: top;
        -o-object-position: top;
    }

    }
    .commentInfo {
        padding: 0.08rem 0;
        background: #fff;
    }

    .commentItem {
        margin: 0.02rem 0.12rem;
        position: relative;
    }

    .commentItem:active {
        background: #f7f8fa;
    }

    .replyLargeLi {
        background: #f5f5f5;
        width: 3.51rem !important;
        height: 1.75rem !important;

    .picesWrap {
        width: 3.51rem;
        height: 1.75rem;
        overflow: hidden;
        position: relative;
        align-items: center;
        display: flex;

    img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
        -o-object-fit: cover;
        object-position: top;
        -o-object-position: top;
    }

    }

    }
    .workPicesWrap {
        width: 1.75rem;
        height: 1.75rem;
        overflow: hidden;
        position: relative;
        align-items: center;
        display: flex;
    }

    .workPicesItem {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
        -o-object-fit: cover;
        object-position: top;
        -o-object-position: top;
    }

    .studentName {
        display: block;
        width: 0.5rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
        margin-top: 0.08rem;
    }

    .commentBlue {
        color: #67a5ff;
        margin: 0 0.04rem;
    }

    .blackWrap {
        position: absolute;
        bottom: 0.15rem;
        left: 20%;
    }

    .blackWrap img {
        width: 1rem;
        height: 0.34rem;
        position: relative;
    }

    .blackWrapInner {
        position: absolute;
        top: 0.04rem;
        left: 0;
        right: 0;
        width: 100%;
        color: #fff;
    }

    .blackWrapInner .whiteLine {
        background: #bdbdbd;
        width: 1px;
        height: 0.11rem;
        margin: 0 0.11rem;
    }

    .audioBg {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
    }

    .audioPlay {
        position: absolute;
        width: 0.55rem;
        height: 0.55rem;
        left: 0;
        right: 0;
        margin: auto;
        top: 0.82rem;
    }

    .audioTime {
        position: absolute;
        width: 100%;
        top: 0.35rem;
        left: 0;
        color: #67a5ff;
        text-align: center;
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
        padding-top: 0.22rem;
    }

    .audioWrapperSmall .audioPlaySmall {
        height: 0.31rem;
        width: 0.31rem;
        background: url("./images/audioPlay.png") no-repeat center center;
        background-size: contain;
        margin: 0 auto;
        margin-top: 0.16rem;
    }

    .audioWrapperBig {
        height: 100% !important;
        width: 100% !important;
        position: relative !important;
        background: url("./images/audioBgLarge.png") no-repeat center bottom !important;
        background-size: 100% 100% !important;
        box-sizing: border-box !important;
        border: 1px solid #e7f1ff !important;
    }

    .audioWrapperBig .audioPlayBig {
        height: 0.55rem !important;
        width: 0.55rem !important;
        background: url("./images/audioPlay.png") no-repeat center center !important;
        background-size: contain !important;
        margin: 0 auto !important;
        margin-top: 0.2rem !important;
    }

    .audioWrapperBig .audioTimeBig {
        color: #67a5ff !important;
        font-size: 0.18rem !important;
        text-align: center !important;
        padding-top: 0.35rem !important;
    }

    .reply_slide {
        padding: 0.02rem 0.12rem;
    }

    .reply_slide .span {
        font-size: 0.14rem;
        color: #67a5ff;
        margin-right: 0.06rem;
    }

    .reply_slide .slideIcon {
        height: 0.06rem;
        width: 0.1rem;
        background: url("./images/slideBlue.png") no-repeat center center;
        background-size: 100% 100%;
    }

    .slideIconTop {
        height: 0.06rem;
        width: 0.1rem;
        background: url("./images/slideBlue.png") no-repeat center center;
        background-size: 100% 100%;
        -webkit-transform: rotate(180deg) !important;
        -moz-transform: rotate(180deg) !important;
        -ms-transform: rotate(180deg) !important;
        -o-transform: rotate(180deg) !important;
    }

    .photoWrap {
        width: 0.4rem;
        height: 0.4rem;
        border-radius: 100%;
        margin: 0 0.12rem;
    }

    .studentDefaultWrap {
        width: 0.45rem;
        height: 0.45rem;
        border-radius: 100%;
    }
</style>
