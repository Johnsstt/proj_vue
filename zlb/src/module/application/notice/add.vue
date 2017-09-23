<template>
    <div class="container" v-cloak ref="container">
        <div class="wrapper">
            <div class="addClass" flex="cross:center">
                <span class="classAndStu" flex-box="0">接收人：</span>
                <span class="classAndStuContent" flex-box="1">按时发达时打发撒旦法撒旦法撒打发士大夫撒旦法撒旦阿斯蒂芬</span>
                <span class="classAndStuBtn" flex-box="0" @click="showClassListFuc"></span>
            </div>
            <div class="content">
                <textarea maxlength="300" placeholder="消息内容300字以内哦" v-model="textarea" ref="textarea"></textarea>
            </div>
            <div class="enclosure">
                <div class="enclosureNull" v-if="pices.length===0">
                    <div class="enclosureImg" flex="main:center cross:center">
                        <img src="./images/fujian.png"/>
                    </div>
                    <div class="enclosureToast" flex="main:center">最多可上传九个附件哦</div>
                </div>
                <ul class="picesList" v-if="pices.length>0">
                    <li v-for="(pic,index) in pices" @click="seePicesItem(index)">
                        <div class="picesWrap" :style="{border:pic.datatype==2?'1px solid #e7f1ff':'none'}">
                            <img :src="pic.datathumbnail" v-if="pic.datatype!=2" class="picesItem"/>
                            <div v-if="pic.datatype==2">
                                <img src="./images/audioBg.png" class="audioBg">
                                <div class="audioTime font14">
                                    <span v-text="parseInt(pic.datatime/60)<10?'0'+parseInt(pic.datatime/60):parseInt(pic.datatime/60)"></span>
                                    <span>:</span>
                                    <span v-text="pic.datatime%60<10?'0'+(pic.datatime%60):pic.datatime%60"></span>
                                </div>
                                <img src="./images/audioPlay.png" class="audioPlay"/>
                            </div>
                            <div v-if="pic.datatype==3" class="play"></div>
                        </div>
                        <img src="./images/removePicItem.png" class="removePicItem" @click.stop="removePic(index)">
                    </li>
                </ul>
                <div class="addTypeList" flex v-if="pices.length<9">
                    <img src="./images/add_album.png" @click="changeFile('album')">
                    <img src="./images/add_camera.png" @click="changeFile('camera')">
                    <img src="./images/add_video.png" @click="changeFile('video')">
                    <img src="./images/add_audio.png" @click="changeFile('audio')">
                </div>
                <div class="addTypeList" flex v-if="pices.length>=9">
                    <img src="./images/albumGray.png">
                    <img src="./images/cameraGray.png">
                    <img src="./images/videoGray.png">
                    <img src="./images/audioGray.png">
                </div>
            </div>
            <div flex="main:center">
                <mu-flat-button label="发送" class="demo-flat-button" :class="{buttonFocus:buttonColor}" @click="save()"/>
            </div>
            </div>
        <mu-snackbar v-if="snackbar" :message="message" action="关闭" @actionClick="hideSnackbar"
                     @close="hideSnackbar"/>
        <mu-toast v-if="toast" :message="msg" @close="hideToast"/>
        <multi-class-list v-if="showClassList" @addClassData="delClassListFuc"></multi-class-list>
    </div>
</template>
<script type="text/babel">
    import multiClassList from '../../../components/classList/multiClassList.vue'
    import api from '../../../api/api.js'
    import {domain} from '../../../api/api.js'
    const API = new api();
    export default{
        data(){
            return {
                textarea:'',
                showClassList:false,
                list: [],
                classes: [],
                content: '',
                timeLimit: [
                    {
                        value: '1天',
                        expirTime: 1
                    },
                    {
                        value: '3天',
                        expirTime: 3
                    },
                    {
                        value: '5天',
                        expirTime: 5
                    },
                    {
                        value: '不限',
                        expirTime: -1
                    }
                ],
                expirTime: -1,
                timeIndex: 3,
                pices: [],
                snackbar: false,
                classList: '',
                msg: '',
                message: '',
                toast: false,
                check: false,
                classCheck: false,
                contentCheck: false,
                buttonColor: false,
                showPaste: false,
                domain: domain,
                canUploadClick: true,
                parentInfo:{appCode:'APP_HOMEWORK',title:'温故知新'}
            }
        },
        components:{
            multiClassList
        },
        methods: {
            delClassListFuc(){
                this.showClassList=false;
            },
            showClassListFuc(){
                this.showClassList=true;
            },
            /*
             * @description: 选择时限(单选)
             *
             * @update: cxy (2017-03-06)
             */
            changeTime(index, expirTime){
                this.timeIndex = index;
                this.expirTime = expirTime;
            },
            /*
             * @description: 调用客户端上传文件
             *
             * @update: cxy (2017-03-06)
             */
            changeFile(type){
                //TODO:客户端上传文件
                if (9 - this.pices.length > 0) {
                    util.JsBridge('getPicesList', {
                        picItemCount: 9 - this.pices.length,
                        showType: type,
                        appType: 'APP_HOMEWORK'
                    }, (res)=> {
                        if (res.uploadCount == 3) {
                            this.message = '当前上传总数已达上限,请稍后重试';
                            this.snackbar = true
                            if (this.snackTimer) clearTimeout(this.snackTimer)
                            this.snackTimer = setTimeout(() => {
                                this.snackbar = false
                            }, 2000);
                        } else {
                            this.changeFileCallBack(res);
                        }
                    })
                } else {
                    this.message = '您最多只能上传9个附件';
                    this.snackbar = true
                    if (this.snackTimer) clearTimeout(this.snackTimer)
                    this.snackTimer = setTimeout(() => {
                        this.snackbar = false
                    }, 2000)
                }
            },
            /*
             * @description: 客户端上传文件后回调
             *
             * @update: cxy (2017-03-07)
             */
            changeFileCallBack(res){
                for (let i = 0; i < res.length; i++) {
                    res[i].datathumbnail = 'data:image/png;base64,' + res[i].datathumbnail;
                }
                this.pices = this.pices.concat(res);
                if (this.pices.length > 0) {
                    this.picesCheck = true
                } else {
                    this.picesCheck = false
                }
                this.toBottomFun();
                this.buttonColorCheck();
            },
            /*
             * @description: 滚到底部
             *
             * @update: lwq (2017-03-27)
             */
            toBottomFun(){
                this.$nextTick(function () {
                    this.$refs.container.scrollTop = this.$refs.container.scrollHeight;
                });
            },
            /*
             * @description: 调用客户端删除文件
             *
             * @update: cxy (2017-03-06)
             */
            removePic(index){
                this.pices.splice(index, 1)
                //TODO:客户端删除文件
                util.JsBridge('removePicesItem', {
                    picItemIndex: index
                }, (res)=> {
                })
            },
            /*
             * @description: 调用客户端文件浏览
             *
             * @update: cxy (2017-03-06)
             */
            seePicesItem(index){
                //TODO:客户端浏览文件
                util.JsBridge('seePicesItem', {
                    picItemIndex: index
                }, (res)=> {
                })
            },
            /*
             * @description: 隐藏提示框
             *
             * @update: cxy (2017-03-06)
             */
            hideSnackbar () {
                this.snackbar = false
                if (this.snackTimer) clearTimeout(this.snackTimer)
            },
            /*
             * @description: 检测作业内容输入
             *
             * @update: cxy (2017-03-08)
             */
            checkContent(e){
                if (e.target.value !== '') {
                    this.contentCheck = true
                } else {
                    this.contentCheck = false
                }
                this.buttonColorCheck();
            },
            /*
             * @description: 保存作业
             *
             * @update: cxy (2017-03-06)
             */
            save(){
                this.checkFun();
                if (this.check) {
                    if (this.canUploadClick) {
                        this.canUploadClick = false;
                        const content = util.utf16toEntities(this.content).replace(/\n|\r\n/g, "<br>").replace(/[ ]/g, "&nbsp;");
                        const params = {
                            content: content,
                            classes: this.classList,
                            expirTime: this.expirTime,
                            picNum: this.pices.length
                        }
                        let response = API.saveHomework(params);
                        let that = this;
                        response.then((res)=> {
                            that.msg = res.msg;
                            that.showToast();
                            if (res.code === 200) {
                                if (this.pices.length > 0) {
                                    //TODO:客户端保存文件
                                    util.JsBridge('sendFinish', {
                                        taskTid: res.rs.taskTid,
                                        appType: 'APP_HOMEWORK',
                                        taskName: '温故知新',
                                        taskImageURL: that.domain + 'v110/src/assets/icon/homework.png'
                                    }, ()=> {
                                        that.msg = '成功';
                                        that.showToast();
                                    })
                                } else {
                                    util.JsBridge('closeWebView', {}, ()=> {
                                        that.msg = '成功';
                                        that.showToast();
                                    })
                                }
                            } else {
                                that.msg = res.msg;
                                that.canUploadClick = true;
                                that.showToast();
                            }
                        }).catch(()=> {
                            that.msg = '网络异常,请稍后重试';
                            that.canUploadClick = true;
                            that.showToast();
                        })
                    } else {
                        this.msg = '上传中，请稍后';
                        this.showToast();
                    }
                }
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
             * @description: 检测信息
             *
             * @update: cxy (2017-03-07)
             */
            checkFun(){
                if (this.classList === '') {
                    this.msg = '请勾选班级';
                    this.showToast();
                    this.check = false
                    return
                }
                if (this.content === '') {
                    this.msg = '请填写作业内容';
                    this.showToast();
                    this.check = false
                    return
                }
                this.check = true
            },
            /*
             * @description: 获取子组件信息
             *
             * @update: cxy (2017-04-17)
             */
            getSonInfo(info){
                this.classCheck=info.classCheck;
                this.buttonColorCheck();
                this.classList=info.classList;
            },
            /*
             * @description: 按钮颜色检测
             *
             * @update: cxy (2017-03-08)
             */
            buttonColorCheck(){
                if (this.classCheck && this.contentCheck) {
                    this.buttonColor = true
                } else {
                    this.buttonColor = false
                }
            },
            /*
             * @description: 黑透弹窗
             *
             * @update: cxy (2017-03-07)
             */
            handleClose() {
                this.showPaste = false;
            }
        }
    }
</script>

<style scoped lang="scss">
    .container {
        width: 100%;
        height: 100%;
        position:relative;
    }
    .wrapper{
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
    }
    .content{
        height: 2.1rem;
        width: 100%;
        padding-top: 0.6rem;
        padding-left: 0.12rem;
        padding-right: 0.12rem;
        background: url("./images/contentBg.png") no-repeat center center/100% 100%;
    }
    .content textarea{
        height:1.5rem;
        box-sizing: border-box;
        width: 100%;
        background: transparent;
        font-size:0.16rem;
        color:#333;
        line-height:0.24rem;
    }
    .addClass{
        padding-top: 0.15rem;
        font-size:0.16rem;
        color:#fff;
        background:#67a5ff;
    }
    .classAndStu{
        padding-left: 0.12rem;
    }
    .addClass .classAndStuContent{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .classAndStuBtn{
        height: 0.5rem;
        width: 0.5rem;
        background: url("images/addClassBtn.png") no-repeat center center/0.26rem 0.26rem;
    }
    .enclosure {
        border-top:0.12rem solid #f8fafd;
        background: #ffffff;
        width:100%;
        position: relative;
        padding-left:0.12rem;
        padding-top: 0.08rem;
    }

    .enclosureNull {
        margin-top: 0.53rem;
        margin-bottom: 0.27rem;
    }

    .homeworkAdd {
        position: absolute;
        bottom: -0.28rem;
        left: 50%;
        width: 0.54rem;
        height: 0.54rem;
        margin-left: -0.28rem;
    }

    .homeworkAdd img {
        width: 0.54rem;
        height: 0.54rem;
        display: block;
    }

    .enclosureImg img {
        height: 0.73rem;
    }

    .enclosureToast {
        font-size: 0.14rem;
        color: #cccccc;
        margin-top: 0.13rem;
    }

    .picesList {
        overflow: hidden;
        min-height: 1.76rem;
        li {
            float: left;
            width: 1.12rem;
            height: 1.12rem;
            position: relative;
            margin-right: 0.08rem;
            margin-bottom: 0.08rem;
        }

    }
    .picesWrap {
        width: 100%;
        height:100%;
        overflow: hidden;
        position: relative;
        align-items: center;
        display: flex;
    }

    .picesItem {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
    }

    .removePicItem {
        width: 0.24rem;
        height: 0.24rem;
        position: absolute;
        top: 0.02rem;
        right: 0.02rem;
    }

    .demo-flat-button {
        background: #e0e0e0;
        border-radius: 1rem;
        width: 2rem;
        height: 0.44rem;
        margin: 0.15rem 0;
        color: #ffffff;
    }

    .buttonFocus {
        background: #67a5ff;
        border-radius: 1rem;
        width: 2rem;
        height: 0.44rem;
        margin: 0.15rem 0;
    }

    .play {
        background: url("./images/play.png") 0 0 no-repeat;
        background-size: contain;
        width: 0.3rem;
        height: 0.3rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -0.15rem;
        margin-left: -0.15rem;
    }

    .addTypeList {
        margin-left: 0.59rem;
        padding-top: 0.21rem;
        margin-bottom: 0.15rem;

        img {
            width: 0.4rem;
            height: 0.4rem;
            margin-right: 0.26rem;
        }

    }
    .audioBg {
        position: absolute;
        width: 100%;
        height: 100%;
        bottom: 0;
        left: 0;
    }

    .audioPlay {
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        top: 0.62rem;
        width: 0.31rem;
        height: 0.31rem;
    }

    .audioTime {
        position: absolute;
        width: 100%;
        top: 0.22rem;
        left: 0;
        color: #67a5ff;
        text-align: center;
    }

    .blackWrap {
        position: absolute;
        top: 0.05rem;
        left: 5%;
    }

    .blackWrap img {
        width: 0.5rem;
        height: 0.34rem;
        position: relative;
    }
</style>
<style>
    .mu-flat-button-label {
        font-size: 0.16rem;
    }
</style>
