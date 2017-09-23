<template>
    <div class="container" v-cloak ref="container">
        <div class="content">
            <div class="blue">
                <div class="white"></div>
            </div>
            <classList :parentInfo="parentInfo" @toParentComponent="getSonInfo"></classList>
            <div class="workInner">
                <textarea placeholder="请输入作业内容（不超过1000个字符）" maxlength="1000" v-model="content"
                          @input="checkContent($event)"></textarea>
            </div>
            <div flex class="timeLimit">
                <div class="timeLimitTitle" flex="main:center cross:center">时限</div>
                <div flex="main:center cross:center">
                    <div class="blueRadio" :class="{blueRadioFocus:timeIndex===index}" flex="main:center cross:center"
                         v-for="(time,index) in timeLimit" v-text="time.value"
                         @click="changeTime(index,time.expirTime)"></div>
                </div>
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
            <mu-snackbar v-if="snackbar" :message="message" action="关闭" @actionClick="hideSnackbar"
                         @close="hideSnackbar"/>
            <mu-toast v-if="toast" :message="msg" @close="hideToast"/>
        </div>
    </div>
</template>

<script type="text/babel">
    import api from '../../../api/api.js'
    import {domain} from '../../../api/api.js'
    import classList from '../../../components/classList/defaultClassList.vue'
    const API = new api();
    export default{
        data(){
            return {
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
            classList
        },
        methods: {
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
        background: #EFF3F6;
        position: absolute;
        top:0;
        left:0;
        bottom:0;
        right:0;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
    }

    .container .blue {
        height: 2.11rem;
        background: #67a5ff;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: -1;
    }

    .container .blue .white {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 0;
        border-top: 0.5rem solid #67a5ff;
        border-bottom: 0.5rem solid #EFF3F6;
        border-left: 1.88rem solid #67a5ff;
        border-right: 1.88rem solid #EFF3F6;
    }

    .content {
        width: 100%;
        box-sizing: border-box;
        position: relative;
        z-index: 2;
    }
    .checkBox {
        border: 1px solid #ffffff;
        width: 0.19rem;
        height: 0.19rem;
        border-radius: 100%;
        margin-right: 0.08rem;
    }

    .checkBoxImg {
        width: 0.11rem;
        height: 0.08rem;
    }

    .workInner {
        background: #ffffff;
        border: 1px solid #ffffff;
        box-shadow: 0px 1px 5px 0px #bad6ff;
        border-radius: 0.05rem;
        width: 3.51rem;
        height: 1.3rem;
        margin-left: 0.12rem;
        margin-top: 0.22rem;
        position: relative;
    }

    .workInner textarea {
        width: 100%;
        height: 100%;
        padding-top: 0.12rem;
        padding-left: 0.12rem;
        border: none;
        resize: none;
        color: #666666;
    }

    .timeLimit {
        margin-top: 0.18rem;
        margin-left: 0.15rem;
    }

    .timeLimitTitle {
        font-size: 0.14rem;
        color: #999999;
        margin: 0 0.12rem;
    }

    .blueRadio {
        border: 1px solid #67a5ff;
        border-radius: 1rem;
        width: 0.59rem;
        height: 0.24rem;
        font-size: 0.14rem;
        color: #67a5ff;
        margin-right: 0.12rem;
    }

    .blueRadioFocus {
        background: #67a5ff;
        border-radius: 1rem;
        width: 0.59rem;
        height: 0.24rem;
        color: #ffffff;
    }

    .enclosure {
        background: #ffffff;
        border: 1px solid #ffffff;
        box-shadow: 0px 0px 5px 0px #d8e4f5;
        border-radius: 0.05rem;
        width: 3.51rem;
        margin-left: 0.12rem;
        margin-top: 0.18rem;
        position: relative;
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
        margin-top: 0.12rem;
        margin-left: 0.13rem;
        min-height: 1.76rem;

    li {
        float: left;
        width: 1.08rem;
        height: 1.08rem;
        position: relative;
        margin-right: 0.01rem;
        margin-bottom: 0.01rem;
    }

    }
    .picesWrap {
        width: 1.08rem;
        height: 1.08rem;
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
