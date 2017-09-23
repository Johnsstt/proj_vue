<template>
    <div>
        <div class="container" v-cloak>
            <div class="slideContainer">
                <div class="swiper-container mySwiper" ref="mySwiper">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="(slide,index) in slideList" flex="main:center cross:center" :key="index">
                            <img :src="imagedomain+slide.imgUrl+'?imageView2/0/w/750/format/jpeg'"
                                 class="slideImg" @click="getSwiper(index)">
                            <div class="play" @click="getSwiper(index)" v-if="slide.type==3"></div>
                        </div>
                    </div>
                    <div class="swiper-pagination"></div>
                </div>
                <div class="studentName" flex="main:center" v-text="stuOpus.studentName"></div>
                <div class="studentContext" flex="main:center" v-text="stuOpus.comment"></div>
            </div>
            <div class="handle_area" flex="cross:center main:justify">
                <img flex-box="0" src="./images/fenxiang.png" @click="share(index)" style="width:0.18rem ;height:0.18rem">
                <img flex-box="0" src="./images/notice.png" @click="setComment(index)" style="width:0.19rem ;height:0.18rem">
            </div>
            <div class="handle_num" flex="cross:center">
                <span flex-box="0" >0</span>
                <p>个点赞</p>
            </div>

            <mu-toast v-if="toast" :message="msg" @close="hideToast"/>
        </div>
        <div class="blackWrap" v-show="blackShow">
            <!--<div class="wrapClose" @click="closeWrap"></div>-->
            <div class="blackSlideContainer">
                <div class="swiper-container blackSwiper" ref="blackSwiper">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="(slide,index) in slideList" flex="main:center cross:center" :key="index">
                            <video preload="auto" controls
                                   :poster="imagedomain+slide.imgUrl+'?vframe/png/offset/1/w/750'"
                                   ref="videoPanel" v-if="slide.type==3">
                                <source :src="imagedomain+slide.imgUrl" type="video/mp4">
                                您的浏览器不支持video标签,请升级浏览器
                            </video>
                            <img :src="imagedomain+slide.imgUrl+'?imageView2/0/w/750/format/jpeg'"
                                 class="slideImg" v-if="slide.type==1" @click="closeSwiper">
                        </div>
                    </div>
                    <div class="swiper-pagination"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="text/babel">
    import '../../../vendor/js/swiper.min.js'
    import {imagedomain} from '../../../api/api.js'
    import api from '../../../api/api.js'
    const API = new api();
    export default{
        data(){
            return{
                tid:this.$route.query.tid,
                imagedomain: imagedomain,//图片域名
                msg: '',//状态提示框信息
                toast: false,//状态提示框
                slideList: [],
                mySwiper:'',
                blackSwiper:'',
                blackShow: false,
                stuOpus:''
            }
        },
        mounted(){
            this.$nextTick(function () {
                this.mySwiper = new Swiper('.mySwiper', {
                    effect: 'coverflow',
                    slidesPerView: 1.4,
                    centeredSlides: true,
                    pagination: '.swiper-pagination',
                    paginationType: 'fraction',
                    observer: true,//修改swiper自己或子元素时，自动初始化swiper
                    observeParents: true,//修改swiper的父元素时，自动初始化swiper
                    coverflow: {
                        rotate: 0,
                        stretch: -12,
                        depth: 0,
                        modifier: 1,
                        slideShadows: false
                    }
                })
                this.blackSwiper= new Swiper('.blackSwiper',{
                    pagination: '.swiper-pagination',
                    paginationType: 'fraction',
                    observer: true,//修改swiper自己或子元素时，自动初始化swiper
                    observeParents: true,//修改swiper的父元素时，自动初始化swiper
                })
                this.getData();
            })
        },
        methods:{
            /*
             * @description: 客户端头部初始化
             *
             * @update: cxy (2017-03-07)
             */
            propsTitle(){
                //TODO:客户端读取标题信息
                util.JsBridge('propsTitle', {
                    title:util.toUniCode('今日作品'),
                    color: '#67a5ff'
                }, (res)=> {
                })
            },
            /*
             * @description: 获取详情数据
             *
             * @update: cxy (2017-04-17)
             */
            getData(){
                let param = {
                    tid: this.tid
                };
                API.getOpusDetail(param).then(res=> {
                    let {code,rs}=res;
                    if (code == 200) {
                        console.log(rs)
                        this.slideList=rs.opusPices;
                        this.stuOpus=rs.stuOpus
                    } else {
                        this.msg = res.msg;
                        this.showToast();
                    }
                    this.$nextTick(function () {
                        this.propsTitle();
                    })
                })
            },
            showToast () {
                this.toast = true
                if (this.toastTimer) clearTimeout(this.toastTimer)
                this.toastTimer = setTimeout(function(){
                    this.toast = false;
                }, 2000)
            },
            hideToast() {
                this.toast = false
                if (this.toastTimer) clearTimeout(this.toastTimer)
            },
            /*
             * @description: 打开附件浏览器
             *
             * @update: cxy (2017-04-12)
             */
            getSwiper(index){
                this.blackShow = true;
                setTimeout(()=>{
                    this.blackSwiper.slideTo(index, 0, false);
                }, 0)
            },
            /*
             * @description: 关闭附件浏览器
             *
             * @update: cxy (2017-03-16)
             */
            closeWrap(){
                setTimeout(()=>{
                    this.mySwiper.slideTo(this.blackSwiper.activeIndex, 0, false);
                },0)
                this.blackShow = false;
            },
            closeSwiper(){
                this.closeWrap();
            }
        }
    }
</script>
<style scoped>
    .container {
        width: 100%;
        box-sizing: border-box;
    }


    .showPic img {
        width: 100%;
    }

    .showPic video {
        width: 100%;
        height: 2.11rem;
        background: #000;
    }

    .commentList li {
        padding: 0.02rem 0;
        font-size: 0.15rem;
        text-align: justify;
    }

    .commentList li:active {
        background: #f7f8fa;
    }

    .fade-enter-active {
        transition: opacity .5s
    }

    .fade-enter {
        opacity: 0
    }

    input {
        background:#ffffff;
        border-radius:0.06rem;
        margin-left:0.12rem;
        padding-left:0.12rem;
        font-size:0.15rem;
        color:#6c7381;
        border:none;
        width:2.41rem;
        height:0.37rem;
    }
    .slideContainer {
        background: #eff3f6;
        width: 100%;
        overflow: hidden;
    }

    .blackSlideContainer {
        width: 100%;
        height: 100%;
        overflow: hidden;
        align-items: center;
    }

    .mySwiper {
        padding-top: 0.32rem;
        height: 4.2rem;
    }

    .mySwiper .swiper-slide {
        background: #e5e5e5;
        border-radius: 0.06rem;
        height: 3rem !important;
        width: 2.68rem !important;
    }

    .mySwiper .swiper-slide img {
        width: 2.44rem;
        height: 2.8rem;
    }

    .mySwiper .swiper-slide video {
        width: 2.44rem;
        height: 2.8rem;
    }

    .mySwiper .swiper-slide-active {
        background: #ffffff;
        border-radius: 0.06rem;
        height: 3.58rem !important;
        width: 2.74rem !important;
        box-shadow: 0 0.05rem 0.15rem 0 rgba(0, 0, 0, .3);
    }

    .mySwiper .swiper-slide-active img {
        width: 2.5rem;
        height: 3.34rem;
    }

    .mySwiper .swiper-slide-active video {
        width: 2.5rem;
        height: 3.34rem;
    }

    .blackSwiper {
        height: 100%;
    }
    .blackSwiper video{
        width:100%;
    }
    .blackSwiper .slideImg{
        width:100%;
    }
    .swiper-pagination {
        color: #fff;
    }

    .mySwiper .swiper-pagination-fraction {
        bottom: 0.3rem;
    }

    .studentName {
        font-size: 0.17rem;
        color: #353840;
        margin-top: 0.32rem;
        margin-bottom: 0.06rem;
    }

    .studentContext {
        font-size: 0.14rem;
        color: #a1a6b1;
        margin-bottom: 0.32rem;
    }

    .blackWrap {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(50, 50, 50, 1);
        z-index: 999;
    }

    .wrapClose {
        background: url("./images/wrapClose.png") center center no-repeat;
        background-size: 0.24rem 0.24rem;
        width: 0.5rem;
        height: 0.5rem;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99999;
    }
    .play {
        background: url("./images/play.png") 0 0 no-repeat;
        background-size: contain;
        width: 0.56rem;
        height: 0.56rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -0.28rem;
        margin-left: -0.28rem;
    }
    .swiper-wrapper {
        align-items: center;
    }
    .handle_area{
        width:100%;
        height:0.5rem;
        padding:0 0.12rem;
    }
    .handle_num{
        margin-bottom:0.15rem;
        padding:0 0.12rem;
    }
</style>