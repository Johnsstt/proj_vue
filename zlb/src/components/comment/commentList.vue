<template>
    <div class="slide_area">
        <ul class="reply_list">
            <li class="reply_item" v-for="(replyItem,replyIndex) in commentObj.commentList" v-if="replyIndex<2"
                v-clickoutside="handleClose"
                v-long-tap="{fun:blackShowFun,param:{index:index,replyIndex:replyIndex,userId:replyItem.sendUserId}}" flex="cross:center">
                <div class="reply_wrapper"
                     @click.stop="replyComment(commentObj.commentList[replyIndex].secId,commentObj.commentList[replyIndex].appId,replyItem.sendUserId,'回复 '+replyItem.sendUserName+':')">
                    <span v-text="replyItem.sendUserName" flex-box="0"></span>
                    <span v-if="replyItem.replyUserId" class="reply_span">回复</span>
                    <span v-if="replyItem.replyUserId" v-text="replyItem.replyUserName"></span>
                    <span class="span">:</span>
                    <span class="reply_content" v-html="replyItem.content" v-if="replyItem.type!=2" flex-box="1"></span>
                    <audioPlayer :url="replyItem.content" :time="replyItem.time"  :audioId="replyItem.tid" v-if="replyItem.type==2"></audioPlayer>
                    <div class="delWrapper" v-if="blackShow && blackIndex==index && blackReplyIndex==replyIndex">
                        <div class="delInner" flex="cross:center">
                            <div flex-box="1" flex="main:center cross:center" class="copyBtn" @click="handleClose">取消
                            </div>
                            <div flex-box="0" class="white_line"></div>
                            <div flex-box="1" flex="main:center cross:center" class="copyBtn" @click="delComment(replyIndex,replyItem.tid,replyItem.sendUserId)">删除
                            </div>
                        </div>
                        <div class="triangle"></div>
                    </div>
                </div>
            </li>
            <transition name="fade">
                <ul class="reply_list" v-if="commentObj.isSlide">
                    <li class="reply_item" v-for="(replyItem,replyIndex) in commentObj.commentList"
                        v-if="replyIndex>=2" v-clickoutside="handleClose"
                        v-long-tap="{fun:blackShowFun,param:{index:index,replyIndex:replyIndex,userId:replyItem.sendUserId}}" flex="cross:center">
                        <div class="reply_wrapper"
                             @click.stop="replyComment(commentObj.commentList[replyIndex].secId,commentObj.commentList[replyIndex].appId,replyItem.sendUserId,'回复 '+replyItem.sendUserName+':')">
                            <span v-text="replyItem.sendUserName" flex-box="0"></span>
                            <span v-if="replyItem.replyUserId" class="reply_span">回复</span>
                            <span v-if="replyItem.replyUserId" v-text="replyItem.replyUserName"></span>
                            <span class="span">:</span>
                            <span class="reply_content" v-html="replyItem.content" v-if="replyItem.type!=2"
                                  flex-box="1"></span>
                            <audioPlayer :url="replyItem.content" :time="replyItem.time"  :audioId="replyItem.tid" v-if="replyItem.type==2"></audioPlayer>
                            <div class="delWrapper"
                                 v-if="blackShow && blackIndex==index && blackReplyIndex==replyIndex">
                                <div class="delInner" flex="cross:center">
                                    <div flex-box="1" flex="main:center cross:center" class="copyBtn"
                                         @click="handleClose">取消
                                    </div>
                                    <div flex-box="0" class="white_line"></div>
                                    <div flex-box="1" flex="main:center cross:center" class="copyBtn"
                                         @click="delComment(replyIndex,replyItem.tid,replyItem.sendUserId)">删除
                                    </div>
                                </div>
                                <div class="triangle"></div>
                            </div>
                        </div>
                    </li>
                </ul>
            </transition>
        </ul>
        <div class="reply_slide" flex="cross:center" @click="replySlide()"
             v-if="commentObj.commentList&&commentObj.commentList.length>2">
            <span class="span" v-if="!commentObj.isSlide">展开</span>
            <span class="span" v-if="commentObj.isSlide">收起</span>
            <span class="slideIcon" :class="{'slideIconTop':commentObj.isSlide}"></span>
        </div>
    </div>
</template>

<script type="text/babel">
    import audioPlayer from '../../components/audioComment.vue'
    import api from '../../api/api.js'
    const API =new api();
    export default{
        data(){
            return {
                blackShow: false,
                userId:this.$store.state.user.userId
            }
        },
        methods: {
            /*
             * @description: 关闭黑色删除弹框
             *
             * @update: cxy (2017-03-07)
             */
            handleClose: function () {
                this.blackShow = false;
            },
            /*
             * @description: 显示黑色删除弹框
             *
             * @update: cxy (2017-03-07)
             */
            blackShowFun(param){
                if(param.userId==this.userId){
                    this.blackReplyIndex = param.replyIndex;
                    this.blackIndex = param.index;
                    this.blackShow = true;
                }
            },
            /*
             * @description: 展开收起评论
             *
             * @update: cxy (2017-03-07)
             */
            replySlide(){
                this.commentObj.isSlide = !this.commentObj.isSlide;
                this.$emit('toParentComponents', 'refresh')
            },
            sonSetComment(res){
                this.commentObj.commentList.push(res);
                this.$nextTick(function(){
                    this.$emit('toParentComponents', 'refresh')
                })
            },
            delComment(replyIndex,tid,userId){
                if(userId==this.userId){
                    this.handleClose();
                    let param = {
                        tid: tid
                    };
                    API.delComment(param).then((res)=> {
                        if (res.code == 200) {
                            this.commentObj.commentList.splice(replyIndex, 1);
                            this.$nextTick(function(){
                                this.$emit('toParentComponents', 'refresh')
                            })
                        }
                    })
                }

            },
            replyComment(secId,appId,userId,placeHolder){
                if(userId!=this.userId && userId!=-1){
                    util.JsBridge('setComment',{
                        placeHolder:placeHolder,
                        limit:100,
                        noJSONParse:true
                    },(result)=>{
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
                            classId: this.$route.query.classId,
                            type:data.type,
                            appId: appId,
                            secId:secId,
                            content:data.content,
                            appCode:this.type,
                            replyUserId:userId
                        }
                        API.setComment(param).then((res)=>{
                            let {code,rs}=res;
                            if(code==200){
                                this.commentObj.commentList.push(rs);
                                this.$nextTick(function(){
                                    this.$emit('toParentComponents', 'refresh')
                                })
                            }else{
                                alert(JSON.stringify(res))
                            }
                        })
                    })
                }
            },
        },
        components: {
            audioPlayer
        },
        props: ['commentObj', 'index','type']
    }
</script>
<style scoped>
    .slide_area {
        padding: 0 0.12rem;
    }

    .slide_area .reply_item {
        position: relative;
        padding: 0.02rem 0;
        margin-bottom: 0.02rem;
        border: none;
    }

    .slide_area .reply_item:active {
        background: #f7f8fa;
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
        color: #6C7381;
        font-size: 0.14rem;
    }

    .slide_area .reply_slide {
        padding: 0.08rem 0;
    }

    .slide_area .reply_slide .span {
        font-size: 0.14rem;
        color: #a1a6b1;
        margin-right: 0.06rem;
    }

    .slide_area .reply_slide .slideIcon {
        height: 0.06rem;
        width: 0.08rem;
        background: url("../images/slideSmall.png") no-repeat center center;
        background-size: 100% 100%;
    }

    .slideIconTop {
        height: 0.06rem;
        width: 0.08rem;
        background: url("../images/slideSmall.png") no-repeat center center;
        background-size: 100% 100%;
        -webkit-transform: rotate(180deg) !important;
        -moz-transform: rotate(180deg) !important;
        -ms-transform: rotate(180deg) !important;
        -o-transform: rotate(180deg) !important;
    }

    .delWrapper {
        height: 0.44rem;
        width: 0.97rem;
        position: absolute;
        top: -0.44rem;
        right: 0;
        z-index: 1;
    }

    .delWrapper .delInner {
        height: 0.34rem;
        width: 100%;
        background: #2b292a;
        border-radius: 0.06rem;
    }

    .delWrapper .delInner .copyBtn {
        height: 100%;
        color: #fff;
        font-size: 0.15rem;
    }

    .delWrapper .delInner .white_line {
        background: rgba(255, 255, 255, 0.30);
        width: 0.01rem;
        height: 0.24rem;
    }

    .delWrapper .triangle {
        margin: 0 auto;
        width: 0;
        height: 0;
        border-top: 0.1rem solid #2b292a;
        border-left: 0.08rem solid transparent;
        border-right: 0.08rem solid transparent;
    }
</style>
