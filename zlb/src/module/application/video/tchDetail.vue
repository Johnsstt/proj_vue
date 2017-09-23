<template>
    <div class="container" ref="container" v-cloak>
        <div>
            <div class="detailInfo" v-html="video.content"></div>
            <div class="detailTab" flex >
                <div flex-box="1" flex="main:justify cross:center" class="studentSelect" @click="studentSelectList()">
                    <div flex="cross:center" >
                        <div class="blueTab"></div>
                        <div>认领</div>
                    </div>
                    <img src="./images/triangle_right.png" ref="triangle"/>
                </div>
            </div>
            <div class="studentList" v-if="showSelect && totalClaimStudents.length>0">
                <ul>
                    <li v-for="(student,studentIndex) in totalClaimStudents" @click="openDialog(tid,student.studentId,studentIndex)">
                        <avatar v-if="!student.photoUrl" :userId="student.studentId" :userName="student.studentName"></avatar>
                        <img v-if="student.photoUrl" :src="student.photoUrl+'?imageView2/0/w/80/format/jpeg'" />
                    </li>
                </ul>
            </div>
            <ul class="picList" v-if="!smallView">
                <li v-for="(pic,index) in pices">
                    <div class="showPices " @click="clientSwiper(pices,index)">
                        <img :src="ios?imagedomain+pic.imgUrl+'?imageView2/0/w/375/q/1/format/jpeg':loadUrl"  :data-echo="imagedomain+pic.imgUrl+'?imageView2/0/w/750/format/jpeg'" v-if="pic.type==1"/>
                        <img :src="ios?imagedomain+pic.imgUrl+'?vframe/jpeg/offset/1/w/375/q/1/':loadUrl"  :data-echo="imagedomain+pic.imgUrl+'?vframe/jpeg/offset/1/w/750/'" v-if="pic.type==3"/>
                        <div class="plusPlay" v-if="pic.type==3"></div>
                    </div>
                    <div class="userPanel" flex="main:justify">
                        <div flex="main:center cross:center">
                            <div class="panelButton" flex="main:center cross:center">
                                <img src="./images/xin.png"  @click="changeZan(index,pic.tid)" v-if="pic.praiseState==0"/>
                                <img src="./images/praiseBlue.png"  @click="changeZan(index,pic.tid)" v-if="pic.praiseState==1"/>
                            </div>
                            <div class="panelButton" flex="main:center cross:center" @click="share(index,pic)">
                                <img src="./images/fenxiang.png"/>
                            </div>
                            <div class="panelButton" flex="main:center cross:center" @click="setComment(index,pic.tid,pic.vedioId)">
                                <img src="./images/notice.png"/>
                            </div>
                        </div>
                    </div>
                    <div class="messageInfo">
                        <div class="messageTitle" flex>
                            <div class="messageCount" ><div v-text="pic.claimCount"></div></div>个认领;
                            <div class="messageCount" ><div v-text="pic.praiseCount"></div></div>个点赞
                        </div>
                        <comment :commentObj="pic" :index="index" :type="'APP_VEDIO'" @toParentComponents="getInfo" ref="commentMethod"></comment>
                    </div>
                </li>
            </ul>
            <ul class="smallList" v-if="smallView">
                <li class="smallList_item" v-for="(pic,index) in pices" :style="index%2!=0?borderLeft:''">
                    <div class="smallList_main">
                        <div class="assign_homework preview" @click="clientSwiper(pices,index)">
                            <img :src="ios?imagedomain+pic.imgUrl+'?imageView2/0/w/375/q/1/format/jpeg':loadUrl"  :data-echo="imagedomain+pic.imgUrl+'?imageView2/0/w/750/format/jpeg'" v-if="pic.type==1"/>
                            <img :src="ios?imagedomain+pic.imgUrl+'?vframe/jpeg/offset/1/w/375/q/1/':loadUrl"  :data-echo="imagedomain+pic.imgUrl+'?vframe/jpeg/offset/1/w/750/'" v-if="pic.type==3"/>
                            <div class="plusPlay" v-if="pic.type==3"></div>
                        </div>
                        <div class="handle_area" flex="cross:center main:justify">
                            <div class="handle_left" flex-box="0" flex="cross:center">
                                <img src="./images/smallComment.png"/>
                                <span flex-box="0" class="doFavorite" v-text="pic.commentList.length"></span>条评论
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <mu-dialog :open="dialog" dialogClass="dialogClass_tchDetail" bodyClass="bodyClass_tchDetail" @close="closeDialog">
            <div flex="main:justify" class="studentInfoTitle">
                <div flex="main:center cross:center" >
                    <img :src="studentPhoto+'?imageView2/0/w/80/format/jpeg'" class="studentphoto" v-if="studentPhoto!==''"/>
                    <div class="headerWrap" v-if="studentPhoto===''">
                        <div class="avatar" :style="{backgroundColor:photoColor}" flex="cross:center main:center">
                            <div class="name" v-text="photoName"></div>
                        </div>
                    </div>
                    <div>
                        <div class="studentName" v-text="studentName"></div>
                        <div class="studentLog">TA的认领</div>
                    </div>
                </div>
                <div class="studentRemove" flex="main:right cross:right" @click="closeDialog">
                    <img src="./images/removeItem.png"/>
                </div>
            </div>
            <div class="scrollInfo">
                <ul>
                    <li v-for="(pic,index) in picesList"  @click="clientSwiper(picesList,index)">
                        <img :src="imagedomain+pic.imgUrl+'?imageView2/0/w/200/h/200/format/jpeg'" v-if="pic.type==1"/>
                        <img :src="imagedomain+pic.imgUrl+'?vframe/jpeg/offset/1/w/200/h/200'" v-if="pic.type==3"/>
                        <div class="play" flex="main:justify cross:center" v-if="pic.type==3">
                            <img src="./images/videoPanel.png">
                            <div v-if="pic.seconds">
                                <span v-text="parseInt(pic.seconds/60)<10?'0'+parseInt(pic.seconds/60):parseInt(pic.seconds/60)"></span>
                                <span>:</span>
                                <span v-text="pic.seconds%60<10?'0'+(pic.seconds%60):pic.seconds%60"></span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </mu-dialog>
        <mu-toast v-if="toast" :message="msg" @close="hideToast"/>
    </div>
</template>
<script type="text/babel">
    import {imagedomain} from '../../../api/api.js'
    import avatar from '../../../components/defaultAvatar.vue'
    import comment from '../../../components/comment/commentList.vue'
    import api from '../../../api/api.js'
    import BScroll from 'better-scroll'
    const API =new api();
    export default{
        data(){
            return {
                shareClassName: '',
                studentList: [],
                pices: 0,
                picesList: [],//弹出框图片集合,
                dialog: false,
                classId: this.$route.query.classId,
                tid: this.$route.query.tid,
                imagedomain: imagedomain,
                video: '',
                totalClaimStudents: 0,
                totalPraiseCount: 0,
                msg: '',
                triangle: '',
                toast: false,
                messageMore: false,
                studentName: '',
                studentId: 0,
                studentPhoto: '',
                showSelect: true,
                shareUrl: '',
                colorList: ['#F5B6A5', '#F2DB8E', '#FAB9CF', '#A2E4F2', '#B4D3FF', '#ECC6F6', '#F3CEA4', '#C1E896', '#9BEFD8', '#D2CBFE'],
                scroll:'',
                ios:util.browser.versions.ios,
                loadUrl:require('../../../assets/imgLoad.png'),
                smallView:false,
                borderLeft: {borderLeft: '0.03rem solid #EFF3F6'}
            };
        },
        mounted(){
            util.jsBridgeCallBack('jsRightAction',this.changeView);
            this.scroll = new BScroll(this.$refs.container, {
                probeType: 3,
                bounce:true,
                preventDefault:false
            })
            echo.init({
                offset: 0,
                throttle: 0,
                unload: false,
            });
            this.scroll.on('scroll', (pos) => {
               echo.render();
            })
            this.$nextTick(function () {
                this.detail();
            });
        },
        computed:{
            photoColor(){
                return this.colorList[this.studentId % this.colorList.length]
            },
            photoName(){
                return this.studentName.substr(0,1);
            }
        },
        components:{
            avatar,
            comment
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
                    title:util.toUniCode('学员风采'),
                    color: '#67a5ff',
                    titleRight:'视图切换'
                }, (res) => {
                })
            },
            /*
             * @description: 打开弹出框展示图片
             *
             * @update: cxy (2017-03-16)
             */
            openDialog(videoId, studentId, studentIndex){
                this.studentPhoto = this.totalClaimStudents[studentIndex].photoUrl
                this.studentName = this.totalClaimStudents[studentIndex].studentName
                this.studentId = studentId
                let param = {
                    vedioId: videoId,
                    studentId: studentId,
                }
                API.getVideoStudentPic(param).then(res => {
                    let {code, rs} = res;
                    if (code == 200) {
                        this.picesList = rs;
                    } else {
                        this.msg = res.msg;
                        this.showToast();
                    }
                });
                this.dialog = true
            },
            /*
             * @description: 关闭弹出框展示图片
             *
             * @update: cxy (2017-03-16)
             */
            closeDialog(){
                this.dialog = false
            },
            /*
             * @description: 点赞
             *
             * @update: cxy (2017-03-16)
             */
            changeZan(focusIndex, picId){
                let param = {
                    state: this.pices[focusIndex].praiseState,
                    picId: picId,
                    classId: this.classId
                }
                API.setVideopraise(param).then(res => {
                    let {code, rs} = res;
                    if (code == 200) {
                        if (this.pices[focusIndex].praiseState == 1) {
                            this.pices[focusIndex].praiseState = 0;
                            this.pices[focusIndex].praiseCount--;
                        } else {
                            this.pices[focusIndex].praiseCount++;
                            this.pices[focusIndex].praiseState = 1;
                        }
                    } else {
                        this.msg = res.msg;
                        this.showToast();
                    }
                });
            },
            /*
             * @description: 跳转客户端分享
             *
             * @update: cxy (2017-03-16)
             */
            share(index,object){
                //TODO:分享页面跳转
                let obj={};
                obj.tid=object.tid+'_'+this.classId;
                obj.type=object.type;
                obj.title='宝贝精彩瞬间，想与你分享';
                obj.content='指学针'
                if(object.type!=3){
                    obj.shareUrl=this.shareUrl;
                    obj.imgUrl=imagedomain+this.pices[index].imgUrl;
                }else{
                    obj.shareUrl=this.shareUrl+'&imgUrl='+this.pices[index].imgUrl+'&isVideo=1&tid='+obj.tid;
                }
                util.JsBridge('share',obj,(result)=>{})
            },
            /*
             * @description: 展开认领列表
             *
             * @update: cxy (2017-03-16)
             */
            studentSelectList(){
                if(!this.showSelect){
                    this.$refs.triangle.style.transform='rotate(180deg)'
                }else{
                    this.$refs.triangle.style.transform='rotate(0)'
                }
                this.showSelect=!this.showSelect
                this.refreshScroll();
            },
            /*
             * @description: 加载详情数据
             *
             * @update: cxy (2017-03-06)
             */

            detail () {
                let param = {
                    page: 1,
                    classId: this.classId,
                    tid: this.tid
                };
                API.getVideoDetail(param).then(res => {
                    let {code, rs} = res;
                    if (code == 200) {
                        if(rs.className){
                            this.shareClassName=rs.className;
                        };
                        if (rs.pager.pageList) {
                            rs.pager.pageList.forEach((el) => {
                                el.isSlide = false;
                            })
                            this.pices = rs.pager.pageList
                        } else {
                            rs.pager.pageList = [];
                        }
                        if (rs.vedio) {
                            this.video = rs.vedio;
                        }
                        if (rs.totalClaimStudents) {
                            this.totalClaimStudents = rs.totalClaimStudents
                        }else{
                            this.totalClaimStudents=[];
                        }
                        if (rs.totalPraiseCount) {
                            this.totalPraiseCount = rs.totalPraiseCount
                        }else{
                            this.totalPraiseCount=0;
                        }
                        this.shareUrl=rs.shareUrl;
                    } else {
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
             * @description: 客户端浏览文件
             *
             * @update: cxy (2017-03-09)
             */
            clientSwiper(pices, index){
                let arr = Array.prototype.toString.call(pices) === '[object String]' ? JSON.parse(JSON.stringify(JSON.parse(pices))) : JSON.parse(JSON.stringify(pices))
                arr.forEach(function (e) {
                    e.imgUrl = imagedomain + e.imgUrl;
                    if(e.type==3){
                        e.coverUrl=imagedomain+ e.imgUrl+'?vframe/jpeg/offset/1';
                    }
                })
                //TODO:客户端浏览文件
                util.JsBridge('picesSwiper', {
                    picesList: arr,
                    picesIndex: index
                }, (res) => {
                })

            },
            setComment(index,secId,appId){
                util.JsBridge('setComment',{
                    limit:100,
                    placeHolder:'请输入100字以内评论',
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
                        data.content = util.utf16toEntities(result.content);
                    }
                    const param = {
                        classId:this.classId,
                        type:data.type,
                        appId: appId,
                        secId:secId,
                        content:data.content,
                        appCode:'APP_VEDIO'
                    }
                    if(result.type==2){
                        param.time=result.time;
                    }
                    API.setComment(param).then((res)=>{
                        let {code,rs}=res;
                        if(code==200){
                            try{
                                this.$refs.commentMethod[index].sonSetComment(rs);
                                this.$nextTick(function(){
                                    this.refreshScroll();
                                })
                            }catch(e){
                                alert(JSON.stringify(e.message))
                            }
                        }else{
                            this.msg = res.msg;
                            this.showToast();
                        }
                    })
                })
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
            /*
             * @description: 获取子组件传递信息
             *
             * @update: cxy (2017-04-17)
             */
            getInfo(res){
                if(res=='refresh'){
                    this.refreshScroll()
                }
            },
            changeView(){
                if(!this.smallView){
                    this.smallView=true;
                    this.refreshScroll()
                    this.scroll.scrollTo(0, 0)
                    this.$nextTick(function(){
                        echo.render();
                    })
                }else{
                    this.smallView=false;
                    this.refreshScroll();
                    this.scroll.scrollTo(0, 0)
                    this.$nextTick(function(){
                        echo.render();
                    })
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .picList li{
        border-bottom:0.12rem solid #EFF3F6;
    }
    .container{
        position: absolute;
        top: 0;
        bottom: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
    }
    .detailInfo{
        background:#67a5ff;
        width:100%;
        font-size:0.15rem;
        color:#ffffff;
        line-height:0.22rem;
        padding:0.12rem 0.16rem 0.12rem 0.16rem;
    }
    .detailTab{
        background:#ffffff;
        width:100%;
        height:0.4rem;
        font-size:0.15rem;
        color:#a1a6b1;
    }
    .detailTab img{
        -webkit-transform: rotate(180deg);
        -moz-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        -o-transform: rotate(180deg);
        transform: rotate(180deg);
    }
    .studentList{
        opacity:0.7;
        background:#ffffff;
        width:100%;
        padding:0.12rem 0 0 0.12rem;
    }
    .studentList ul{
        overflow: hidden;
    }
    .studentList li{
        background:#d8d8d8;
        border:1px solid #ebebeb;
        width:0.4rem;
        height:0.4rem;
        border-radius:100%;
        float: left;
        margin-right:0.11rem;
        margin-bottom:0.11rem;
    }
    .studentList img{
        width:100%;
        height:100%;
        border-radius: 100%;
    }
    .showPices{
        width:3.75rem;
        height:3.75rem;
        position: relative;
    }
    .showPices img{
        width:100%;
        height:100%;
        object-fit: cover;
        -o-object-fit: cover;
    }
    .play {
        position: absolute;
        width: 100%;
        padding: 0 0.06rem;
        bottom: 0;
        left: 0;

    img {
        width: 0.18rem !important;
        height: 0.11rem !important;
    }

    span {
        font-size: 0.13rem;
        color: #ffffff;
    }

    }
    .plusPlay{
        background: url("./images/detailPlay.png") no-repeat center center;
        background-size:contain;
        width:0.6rem;
        height:0.6rem;
        position: absolute;
        top:0;
        right:0;
        left:0;
        bottom:0;
        margin:auto;
    }
    .userPanel{
        background:#ffffff;
        width:100%;
        height:0.5rem;
    }
    .panelButton{
        width:0.4rem;
        height:0.4rem;
        margin-left:0.02rem;
    }
    .panelButton img{
        height:0.18rem;
    }
    .messageInfo{
        background:#ffffff;
        width:100%;
    }
    .messageTitle{
        font-size:0.14rem;
        color:#42454c;
        padding-bottom:0.08rem;
    }
    .messageCount{
        margin-left:0.12rem;
    }
    .userFrom{
        margin-right:0.05rem;
        color:#67a5ff;
    }
    .studentphoto{
        border:1px solid #ebebeb;
        width:0.39rem;
        height:0.4rem;
        margin-left:0.13rem;
        margin-right:0.11rem;
        border-radius:100%;
    }
    .studentInfoTitle{
        height:0.6rem;
    }
    .studentName{
        font-size:0.17rem;
        color:#42454c;
    }
    .studentLog{
        font-size:0.13rem;
        color:#a1a6b1;
    }
    .studentRemove{
        width:0.65rem;
        height:0.65rem;
    }
    .studentRemove img{
        width:0.13rem;
        height:0.13rem;
        margin-right:0.1rem;
        margin-top:0.1rem;
    }
    .scrollInfo{
        max-height:3.36rem;
        overflow-x:hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
    }
    .scrollInfo ul{
        overflow: hidden;
        margin-left:0.12rem;
    }
    .scrollInfo li{
        width:0.99rem;
        height:0.99rem;
        float: left;
        margin-right:0.12rem;
        margin-bottom:0.13rem;
        position: relative;
    }
    .scrollInfo img{
        display: block;
        height: 100%;
        width: 100%;
        object-fit: cover;
        -o-object-fit: cover;
        object-position: top;
        -o-object-position: top;
    }
    .shareTitle {
        margin-top: 0.2rem;
        margin-bottom:0.38rem;
        font-size: 0.14rem;
        color: #a1a6b1;
    }

    .shareFont {
        font-size: 0.14rem;
        color: #6c7381;
        margin-top: 0.1rem;
    }

    .shareLine {
        border: 1px solid #eef2f5;
        width: 3.46rem;
        margin-left: 0.15rem;
        margin-top: 0.45rem;
    }
    .rotate{
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg);
    }
    .shareCancel {
        font-size: 0.14rem;
        margin-top: 0.1rem;
        color: #a1a6b1;
    }
    .mu-toast {
        top: 50%;
        width: 50%;
        margin-left: 1rem;
        text-align: center;
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
    .studentSelect{
        margin-left:0.12rem;
        margin-right:0.2rem;
        color:#67a5ff;
    }
    .studentSelect img{
        width:0.09rem;
        height:0.06rem;
    }
    .blueTab{
        background:#67a5ff;
        width:2px;
        height:0.08rem;
        margin-right:0.08rem;
    }
    .headerWrap{
        width:0.4rem;
        height:0.4rem;
        border-radius: 100%;
        margin:0 0.12rem;
    }
    .avatar{
        width:100%;
        height:100%;
        border-radius: 100%;
        font-size: 0.16rem;
        color: #fff;
    }
    .container .smallList {
        padding: 0!important;
        border-top: 0.12rem solid #EFF3F6;
        overflow: hidden;
    }

    .container .smallList .smallList_item {
        width:1.86rem;
        height:2.21rem;
        float: left;
        box-sizing: initial;
        border-bottom:0.03rem solid #EFF3F6;
    }

    /*布置作业附件*/

    .container .smallList .smallList_item .smallList_main .assign_homework {
        height: 1.86rem;
        width:1.86rem;
        overflow: hidden;
        position: relative;
    }

    .container .smallList .smallList_item .smallList_main .assign_homework img {
        display: block;
        height: 100%;
        width: 100%;
        object-fit: cover;
        -o-object-fit: cover;
    }

    .container .smallList .smallList_item .smallList_main .assign_homework .num {
        background: rgba(0, 0, 0, 0.40);
        border: 1px solid #979797;
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
    /*操作区域*/

    .container .smallList .smallList_item .smallList_main .handle_area {
        height: 0.35rem;
    }

    .container .smallList .smallList_item .smallList_main .handle_area .handle_left {
        height: 100%;
        font-size:0.14rem;
        color:#6c7381;
    }
    .container .smallList .smallList_item .smallList_main .handle_area .handle_left img{
        width:0.12rem;
        height:0.11rem;
        margin-left:0.11rem;
        margin-right:0.08rem;
    }

    .container .smallList .smallList_item .smallList_main .handle_area .handle_right {
        height: 0.35rem;
    }

    .container .smallList .smallList_item .smallList_main .handle_area .doClaim {
        background:#67a5ff;
        width:0.6rem;
        height:0.35rem;
        font-size:0.14rem;
        color:#ffffff;
    }
    .container .smallList .smallList_item .smallList_main .handle_area .didClaim {
        background:#a1a6b1;
        width:0.6rem;
        height:0.35rem;
        font-size:0.14rem;
        color:#ffffff;
    }


    .container .smallList .smallList_item .smallList_main .handle_num {
        font-size: 0.14rem;
        color: #42454c;
        padding: 0 0.12rem;
        padding-bottom: 0.1rem;
    }
    .container .smallList .smallList_item .smallList_main .handle_num p{
        margin-right:0.08rem;
    }
</style>
<style>
    .dialogClass_tchDetail{
        background:#ffffff;
        border-radius:0.06rem;
        width:3.46rem;
    }
    .mu-dialog{
        border-radius:0.06rem;
    }
    .bodyClass_tchDetail{
        height:100%;
        padding:0;
    }
    .popupClass_videoDetail {
        width: 100%;
        height: 2.26rem;
    }
</style>