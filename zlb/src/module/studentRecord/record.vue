<template>
    <div class="wrapper">
        <div class="floatArea" v-show="headerShow">
            <ul class="appList" flex  ref="scrollTop" v-el-scroll-hide="scrollLeftCallBack">
                <li class="appItem" :class="{'appItemFocus':appIndex==index}" @click="changeApp(appIndex,appItem.code)"
                    v-for="(appItem,appIndex) in appList" flex-box="0" v-if="appItem.code=='APP_HOMEWORK'">
                    <span v-text="appItem.name" flex="main:center cross:center"></span>
                    <div class="white_line" v-if="appIndex==index"></div>
                </li>
            </ul>
        </div>
        <div class="container"  ref="container">
            <div v-refresh="refresh" ref="ul" v-load="load">
                <div class="topArea" ref="topArea"  :style="{'background':'url('+studentMessage.photoUrl+') no-repeat center center/contain'}">
                    <div class="topInner">
                        <div class="studentArea" ref="studentArea">
                            <div class="img_wrapper"  @click="handleShow">
                                <img :src="studentMessage.photoUrl" v-if="studentMessage.photoUrl && studentMessage.photoUrl!=''">
                                <div  class="photoWrap" v-if="studentMessage.photoUrl==''" flex-box="0">
                                    <avatar :userId="studentMessage.studentId" :userName="studentMessage.studentName" ></avatar>
                                </div>
                            </div>
                            <div class="studentName">
                                <span  @click="handleShow" v-text="studentMessage.studentName"></span>
                                <div class="functionWrapper" v-if="showFucArea">
                                    <div class="functionTriangle"></div>
                                    <ul class="functionList">
                                        <li class="functionItem" flex="main:center cross:center"  @click.stop="open">发送消息</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <ul class="appList" flex ref="scrollBottom">
                            <li class="appItem" :class="{'appItemFocus':appIndex==index}" @click="changeApp(appIndex,appItem.code)"
                                v-for="(appItem,appIndex) in appList" flex-box="0" v-if="appItem.code=='APP_HOMEWORK'">
                                <span v-text="appItem.name" flex="main:center cross:center"></span>
                                <div class="white_line" v-if="appIndex==index"></div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="inner">
                    <keep-alive>
                        <component :is="currentView" @changeView="change" @scroll="refreshScroll" ref="child" @toGrandParentComponents="refreshScroll">
                            <!-- 非活动组件将被缓存！ -->
                        </component>
                    </keep-alive>
                </div>
            </div>
        </div>
        <mu-popup position="bottom" popupClass="demo-popup-bottom" :open="bottomPopup" @close="close()">
            <div class="parentArea">
                <ul class="parentList">
                    <li class="parentItem" v-for="(parent,parentIndex) in parentMessage" flex="main:center cross:center"
                    @click="toChatRoom(parent.userId,parent.role,parent.userName,parent.userPhoto)">
                        <div class="parentLeft" flex-box="0" flex="cross:center">
                            <span v-text="parent.relation"></span>
                            <span>-</span>
                            <span v-text="parent.userName"></span>
                        </div>
                        <div class="parentRight" flex-box="0" v-text="parent.mobile"></div>
                    </li>
                </ul>
                <div class="cancel" flex="main:center cross:center" @click="close()">取消</div>
            </div>
        </mu-popup>
    </div>
</template>

<script type="text/babel">
    import homework from "./homework.vue"
    import vedio from "../application/video/tchDetail.vue"
    import avatar from '../../components/defaultAvatar.vue'
    import api from '../../api/api.js'
    import BScroll from 'better-scroll'
    const API = new api();
    export default{
        data(){
            return {
                classId:this.$route.query.classId,
                studentId:this.$route.query.studentId,
                index:0,
                headerShow:false,
                scroller:null,
                trigger:null,
                appList: [],
                currentView:'',
                studentMessage:'',
                parentMessage:'',
                showFucArea:false,
                bottomPopup: false,
                isIOS:util.isIOS(),
                scroll:'',
                isScroll:true
            }
        },
        mounted(){
            this.scroll = new BScroll(this.$refs.container, {
                probeType: 3,
                bounce: false,
                preventDefault:false
            });
            echo.init({
                offset: 0,
                throttle: 0,
                unload: false,
            });
            this.scroll.on('scroll', () => {
                echo.render();
                if(this.isScroll){
                    let transfromY = parseFloat(getComputedStyle(this.$refs.ul, null).getPropertyValue("-webkit-transform").substring(7).split(',')[5]);
                    this.scrollHideCallBack(transfromY);
                }
            });
            util.jsBridgeCallBack('jsRightAction',this.editStudent);
            this.getUser();
            this.getClassApp();
        },
        components:{
            homework,
            vedio,
            avatar
        },
        directives: {
            elScrollHide:function (el,binding) {
                el.addEventListener('scroll',()=>{
                    binding.value();
                })
            }
        },
        methods: {
            refreshScroll(){
                this.$nextTick(function(){
                    this.scroll.refresh();
                })
            },
            propsTitle(studentName){
                //TODO:客户端读取标题信息
                util.JsBridge('propsTitle',{
                    title:util.toUniCode(studentName),
                    color:'#67a5ff',
                    titleRight:'编辑',
                    androidTitle:encodeURI(studentName)
                },(res)=>{})
            },
            getClassApp(){
                let param={
                    classId:this.classId
                };
                API.getClassApp(param).then((res)=>{
                    let {rs,code}=res;
                    if(code==200){
                        if(rs&&rs.length>0){
                            this.change(rs[0].code.split('APP_')[1].toLowerCase());
                            this.appList=rs;
                            this.refreshScroll()
                        }
                    }
                })
            },
            toChatRoom(userId,role,userName,headPortrait){
                this.close ();
                util.JsBridge('toChatRoom',{
                    classId:this.classId+'',
                    userId:userId+'',
                    role:role+'',
                    userName:userName+'',
                    headPortrait:headPortrait+''
                },(res)=>{})
            },
            editStudent(data){
                util.JsBridge('editStudent',{
                    classId:this.classId,
                    studentId:this.studentId,
                    studentName:this.studentMessage.studentName,
                    studentPhotoUrl:this.studentMessage.photoUrl
                },(res)=>{
                    this.getUser();
                })
            },
            open () {
                this.handleClose();
                this.bottomPopup = true;
            },
            close () {
                this.bottomPopup = false;
            },
            handleShow(){
                this.showFucArea=!this.showFucArea;
            },
            handleClose(){
                this.showFucArea=false;
            },
            getUser(){
                let param={
                    classId:this.classId,
                    studentId:this.studentId
                };
                API.getUser(param).then((res=>{
                    let {code,rs}=res;
                    if(code==200){
                        this.studentMessage=rs.studentDTO;
                        this.parentMessage=rs.parents;
                        this.refreshScroll();
                        setTimeout(()=> {
                            this.propsTitle(rs.studentDTO.studentName)
                        },300);
                    }
                }));
            },
            scrollHideCallBack(transfromY){
                try{
                        this.isScroll=false;
                        if (Math.abs(transfromY) >= this.$refs.studentArea.offsetHeight){
                            this.headerShow=true;
                            this.$refs.scrollTop.scrollLeft=this.$refs.scrollBottom.scrollLeft;
                        }else{
                            this.headerShow=false;
                        }
                        setTimeout(()=>{
                            this.isScroll=true;
                        },250)
                }catch (e){
                    console.log(e.message)
                }
            },
            scrollLeftCallBack(){
                this.$refs.scrollBottom.scrollLeft=this.$refs.scrollTop.scrollLeft;
            },
            changeApp(appIndex,appCode){
                this.index=appIndex;
                this.change(appCode.split('APP_')[1].toLowerCase())
            },
            change(view){
                this.currentView=view;
            },
            refresh(){
                if(this.$refs.child&&this.$refs.child.refresh){
                    this.$refs.child.refresh();
                }
            },
            load(){
                if(this.$refs.child&&this.$refs.child.loadMore){
                    this.$refs.child.loadMore();
                }
            }
        }
    }
</script>
<style scoped>
    .wrapper{
        height: 100%;
        width: 100%;
        position: relative;
    }
    .container{
        position:relative;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
    }
    .container_media{
        padding-top:20px;
    }
    .floatArea{
        position: fixed;
        top:0;
        left:0;
        width: 100%;
        background:rgb(103,165,255);
        z-index: 12;
    }
    .topArea{
        width: 100%;
        position: relative;
        background-size: cover !important;
    }
    .topArea .topInner{
        background:rgba(103,165,255,0.69);
        width:100%;
        height:100%;
    }
    header{
        height: 0.44rem;
    }
    header .leftPanel{
        height: 100%;
        width: 0.42rem;
        background: url("./images/backpanel.png") no-repeat center center/0.12rem 0.22rem;
    }
    header .title{
        font-size: 0.16rem;
        color:#fff;
        padding-left: 0.2rem;
        position: relative;
    }
    header .edit{
        font-size: 0.16rem;
        color:#fff;
        height: 100%;
        padding: 0 0.15rem;
    }
    .studentArea{
        padding: 0.2rem 0;
    }
    .studentArea .img_wrapper{
        overflow: hidden;
        border-radius:50%;
        height: 0.75rem;
        width: 0.75rem;
        border:0.03rem solid #dbe5f9;
        margin: 0 auto;
    }
    .studentArea .img_wrapper img{
        display: block;
        height: 100%;
        width: 100%;
        object-fit: cover;
        -o-object-fit: cover;
    }
    .studentArea .studentName{
        font-size: 0.15rem;
        color:#fff;
        margin-top:0.05rem;
        text-align: center;
        position: relative;
    }
    .functionWrapper{
        width: 1.3rem;
        height: 0.54rem;
        position: absolute;
        top:50%;
        left: 40%;
        z-index: 11;
    }
    .functionTriangle{
        height: 0;
        width: 0;
        margin-left: 0.4rem;
        border-left:0.05rem solid transparent;
        border-right:0.05rem solid transparent;
        border-bottom:0.05rem solid rgba(0,0,0,0.5);
    }
    .functionList{
        border-radius: 0.05rem;
        background: rgba(0,0,0,0.5);
    }
    .functionItem{
        height: 0.46rem;
        font-size: 0.18rem;
        color:#fff;
    }
    .appList{
        overflow: auto;
        -webkit-overflow-scrolling:touch;
        overflow-scrolling:touch;
        padding: 0 0.12rem;
    }
    .appList .appItem{
        opacity:0.8;
        font-size:0.14rem;
        color:#fff;
        margin-right: 0.32rem;
        padding:0.13rem 0;
        position: relative;
    }
    .appList .appItem:nth-last-child(1){
        margin-right:0;
    }
    .appList .appItem .white_line{
        height: 0.02rem;
        position: absolute;
        width: 100%;
        left:0;
        bottom:1px;
        background: #fff;
        border-radius: 0.48rem;
    }
    .appList .appItemFocus{
        opacity:1;
    }
    .parentArea{
        background: #eee;
        width: 100%;
        overflow: hidden;
    }
    .parentArea .parentList{
        width: 100%;
        overflow: auto;
        -webkit-overflow-scrolling:touch;
        overflow-scrolling:touch;
        max-height: 2.4rem;
        background: #fff;
    }
    .parentArea .parentList .parentItem{
        height: 0.48rem;
        border-bottom:1px solid #e0e0e0;
    }
    .parentArea .parentList .parentItem:nth-last-child(1){
        border:none;
    }
    .parentArea .parentList .parentItem .parentLeft{
        margin-right: 0.17rem;
    }
    .parentArea .parentList .parentItem .parentRight{
        margin-left: 0.17rem;
    }
    .parentArea .cancel{
        width:3.59rem;
        background: #fff;
        font-size: 0.16rem;
        color:#67a5ff;
        margin: 0.08rem;
        height:0.44rem;
    }
    .photoWrap{
        width:100%;
        height:100%;
        border-radius: 100%;
    }
</style>
