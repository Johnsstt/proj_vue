<template>
    <div class="homeWorkWrapper">
        <div class="refresh">
            <mu-circular-progress :size="30" />
        </div>
        <ul class="homeWorkList">
            <li class="homeWorkItem" v-for="(item,index) in homework">
                <div class="homeTriangle" v-if="!(item.tchComment&&item.tchComment.length>0)"></div>
                <div class="top" flex="main:justify cross:center">
                    <div class="time" flex-box="0" v-text="item.createTime"></div>
                    <div class="review"  flex="cross:bottom" flex-box="0" @click.stop="setComment(index,item.tid)">
                        <span class="comment_bg"></span>
                        <span class="comment_font">点评</span>
                    </div>
                </div>
                <div class="picListWrapper">
                    <ul class="picList" flex>
                        <li class="picItem" flex-box="0" v-for="(pic,picIndex) in item.detailList" @click="clientSwiper(item.detailList,picIndex)">
                            <img :src="imagedomain+pic.imgUrl+'?imageView2/0/w/280/format/jpeg'"  v-if="pic.type==1">
                            <img :src="imagedomain+pic.imgUrl+'?vframe/jpeg/offset/1/w/280'"  v-if="pic.type==3">
                            <div class="play" v-if="pic.type==3"></div>
                            <div class="audioWrapperSmall" v-if="pic.type==2" >
                                <div class="audioTimeSmall">
                                    <span v-text="parseInt(pic.time/60)<10?'0'+parseInt(pic.time/60):parseInt(pic.time/60)"></span>
                                    <span>:</span>
                                    <span v-text="pic.time%60<10?'0'+pic.time%60:pic.time%60"></span>
                                </div>
                                <div class="audioPlaySmall"></div>
                            </div>
                            <div class="picMore" @click.stop="toDetail(item.workId)" flex="main:center cross:center" v-if="item.detailList&&item.detailList.length<=2&&picIndex==item.detailList.length-1">查看详情</div>
                        </li>
                    </ul>
                    <div class="picMore" @click.stop="toDetail(item.workId)" flex="main:center cross:center" v-if="item.detailList&&item.detailList.length>2">查看详情</div>
                </div>
                <comment :commentObj="item" :index="index" @toParentComponents="toParentComponents" :type="'APP_HOMEWORK'" ref="commentMethod"></comment>
            </li>
        </ul>
        <div class="nothing" v-if="homework.length==0"></div>
    </div>
</template>
<script type="text/babel">
    import {imagedomain} from '../../api/api.js'
    import api from '../../api/api.js'
    import comment from '../../components/comment/commentList.vue'
    const API = new api();
    export default{
        name:'child',
        data(){
            return {
                blackShow: false,
                blackIndex:-1,
                blackReplyIndex:-1,
                teacherName:'',
                teacherId:'',
                teacherHeadUrl:'',
                homework:0,
                toast:false,
                pageTotal:1,
                msg:'',
                page:1,
                classId:this.$route.query.classId,
                studentId:this.$route.query.studentId,
                imagedomain:imagedomain,
                nowIndex:-1,
                nowReplyIndex:-1
            }
        },
        components: {
            comment
        },
        mounted(){
            this.$nextTick(function(){
                this.refresh();
            })
        },
        methods: {
            toParentComponents(){
                this.$emit('toGrandParentComponents')
            },
            changeNowIndex(replyIndex,index){
                this.nowReplyIndex=replyIndex;
                this.nowIndex=index;
            },
            toDetail(workId){
                this.$router.push({path:'/studentRecord/studentHomework',query:{classId:this.classId,studentId:this.studentId,tid:workId}})
            },
            refresh () {
                this.page=1;
                let param={
                    page:1,
                    classId:this.classId,
                    studentId:this.studentId
                };
                API.getUserHomework(param).then(res=>{
                    let {code,rs,teacherName,teacherId}=res;
                    if(code==200){
                        this.teacherName=teacherName;
                        this.teacherId=teacherId;
                        if(rs.pageList){
                            rs.pageList.forEach((el)=>{
                                el.isSlide=false;
                                el.createTime=util.changeDate(el.createTime);
                                if(el.tchComment){
                                    el.tchComment=JSON.parse(el.tchComment);
                                }else{
                                    el.tchComment=[];
                                }
                            });
                            this.homework=rs.pageList;
                        }
                        if(rs.pageTotal){
                            this.pageTotal=rs.pageTotal;
                            this.$emit('scroll');
                        }
                    }else{
                        this.msg = res.msg;
                        this.showToast();
                    }
                });
            },
            loadMore () {
                this.page++;
                if(this.page>this.pageTotal){
                    return;
                }
                let param={
                    page:this.page,
                    classId:this.classId,
                    studentId:this.studentId
                };
                API.getUserHomework(param).then(res=>{
                    let {code,rs}=res;
                    if(code==200){
                        if(rs.pageList){
                            rs.pageList.forEach((el)=>{
                                el.isSlide=false;
                                el.createTime=util.changeDate(el.createTime);
                                if(el.tchComment){
                                    el.tchComment=JSON.parse(el.tchComment);
                                }else{
                                    el.tchComment=[];
                                }
                                this.homework.push(el);
                            });
                        }
                        if(rs.pageTotal){
                            this.pageTotal=rs.pageTotal;
                            this.$emit('scroll');
                        }
                        this.loading=false;
                    }else{
                        this.msg = res.msg;
                        this.showToast();
                    }
                });
            },
            /*
             * @description: 删除评论
             *
             * @update: lwq (2017-03-28)
             */

            delComment(index,replyIndex,replyId){
                this.handleClose();
                this.homework[index].tchComment.splice(replyIndex,1);
                let param={
                    replyId:replyId,
                    comment :JSON.stringify(this.homework[index].tchComment[replyIndex])
                };
                API.delComment(param).then((res)=>{
                    this.msg = res.msg;
                    this.showToast();
                })
            },
            /*
             * @description: 客户端浏览文件
             *
             * @update: cxy (2017-03-09)
             */
            clientSwiper(pices,index){
                let arr=JSON.parse(JSON.stringify(pices));
                arr.forEach(function(e){
                    e.imgUrl=imagedomain+e.imgUrl
                    if(e.type==3){
                        e.coverUrl=imagedomain+ e.imgUrl+'?vframe/jpeg/offset/1';
                    }
                })
                //TODO:客户端浏览文件
                util.JsBridge('picesSwiper',{
                    picesList:arr,
                    picesIndex:index
                },(res)=>{})
            },
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
             * @description: 黑透弹窗
             *
             * @update: cxy (2017-03-07)
             */
            handleClose: function () {
                this.blackShow = false;
            },
            /*
             * @description: 显示黑色弹窗
             *
             * @update: cxy (2017-03-07)
             */
            blackShowFun(param){
                this.blackReplyIndex=param.replyIndex;
                this.blackIndex=param.index;
                this.blackShow=true;
                console.log(this.blackReplyIndex,)
            },
            /*
             * @description: 评论展开收起
             *
             * @update: lwq (2017-03-27)
             */

            replySlide(index){
                this.homework[index].isSlide=!this.homework[index].isSlide;
                this.$emit('scroll');
            }
        }
    }
</script>
<style scoped>
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
    .nothing{
        background: url("./images/nothing.png") no-repeat center center;
        height: 2rem;
        width: 2rem;
        background-size: contain;
        margin: 1rem auto;
    }
    .homeWorkWrapper{
        position: relative;
    }
    .mu-infinite-scroll{
        height: auto !important;
        line-height: normal !important;
    }
    .homeWorkList{
        padding: 0;
        overflow: hidden;
        padding-top:0 !important;
    }
    .homeWorkItem{
        border-bottom: 0.12rem solid #EFF3F6;
        padding: 0 0.12rem;
        padding-bottom: 0.08rem;
        position: relative;
        background: #fff;
    }
    .homeWorkItem:nth-last-child(1){
        border-bottom: none;
    }
    .homeTriangle{
        width:0;
        height:0;
        border-top:0.11rem solid #ffa9a9;
        border-left:0.11rem solid #ffa9a9;
        border-right:0.11rem solid transparent;
        border-bottom:0.11rem solid transparent;
        position: absolute;
        left:0;
        top:0;
        z-index:1;
    }
    .top{
        height:0.4rem;
    }
    .time{
        color:#999;
        font-size: 0.16rem;
    }
    .review .comment_bg{
        background: url("./images/comment.png") no-repeat center center/contain;
        height:0.19rem;
        width: 0.19rem;
        margin-right:0.06rem;
    }
    .review .comment_font{
        font-size:0.14rem;
        color:#67a5ff;
        line-height: 0.1rem;
    }
    .picListWrapper{
        position: relative;
    }
    .picList{
        height: 1.4rem;
        overflow:auto;
        overflow-scrolling: touch;
        -webkit-overflow-scrolling: touch;
        position: relative;
    }
    .picItem{
        height:1.4rem;
        width: 1.4rem;
        overflow: hidden;
        margin-right: 1px;
        position: relative;
    }
    .picItem img{
        height: 100%;
        width: 100%;
        display: block;
        object-fit: cover;
        -o-object-fit: cover;
        object-position: top;
        -o-object-position: top;
    }
    .picMore{
        background:rgba(0,0,0,0.6);
        border-radius:1rem;
        width:0.9rem;
        height:0.28rem;
        font-size: 0.14rem;
        color:#fff;
        right:0.08rem;
        bottom:0.08rem;
        z-index: 1;
        position: absolute;
    }
    .audioWrapperSmall{
        height: 100%;
        width: 100%;
        position: relative;
        background: url("./images/audioBg.png") no-repeat center bottom;
        background-size: 100% 100%;
        border: 1px solid #e7f1ff;
        box-sizing: border-box;
    }
    .audioWrapperSmall .audioTimeSmall{
        color:#67a5ff;
        font-size: 0.16rem;
        text-align: center;
        padding-top: 0.25rem;
    }
    .audioWrapperSmall .audioPlaySmall{
        height: 0.45rem;
        width: 0.45rem;
        background: url("./images/audioPlay.png") no-repeat center center;
        background-size: contain;
        margin: 0 auto;
        margin-top: 0.2rem;
    }
    .slide_area .padding{
        padding-top:0.08rem;
    }
    .slide_area .reply_item {
        position: relative;
        padding:0.02rem;
    }
    .slide_area .reply_item:active{
        background:#f7f8fa;
    }
    .slide_area .reply_wrapper {
        height: 100%;
        font-size: 0;
        text-align: justify;
        position: relative;
    }

    .slide_area .reply_wrapper span {
        margin-right: 0.05rem;
        color: #67a5ff;
        font-size: 0.14rem;
    }

    .slide_area .reply_wrapper .reply_content {
        margin-right: 0;
        color: #6C7381;
    }

    .slide_area .reply_wrapper .reply_span {
        color: #333;
        font-size: 0.14rem;
    }

    .slide_area .reply_slide {
        padding:0.02rem;
    }

    .slide_area .reply_slide .span {
        font-size: 0.14rem;
        color: #67a5ff;
        margin-right: 0.06rem;
    }

    .slide_area .reply_slide .slideIcon {
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
    .delWrapper {
        height: 0.44rem;
        width: 1rem;
        position: absolute;
        top: -0.34rem;
        right: 0;
        z-index: 1;
    }

    .delWrapper .delInner {
        height: 0.28rem;
        width: 100%;
        background: #2b292a;
        border-radius: 0.02rem;
    }

    .delWrapper .delInner .copyBtn {
        height: 100%;
        color: #fff;
        font-size: 0.14rem;
    }

    .delWrapper .delInner .white_line {
        background: rgba(255, 255, 255, 0.30);
        width: 0.01rem;
        height: 0.11rem;
    }

    .delWrapper .triangle {
        margin: 0 auto;
        width: 0;
        height: 0;
        border-top: 0.06rem solid #2b292a;
        border-left: 0.06rem solid transparent;
        border-right: 0.06rem solid transparent;
    }
</style>
