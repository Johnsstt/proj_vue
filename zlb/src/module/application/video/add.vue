<template>
    <div class="container" v-cloak ref="container">
        <div class="content">
            <div class="blue">
                <classList :parentInfo="parentInfo" @toParentComponent="getSonInfo"></classList>
                <div class="inputInfo">
                    <div class="inputTitle">风采介绍</div>
                    <mu-text-field class="videoAdd" hintText="请输入风采介绍（不超过1000个字符）" v-model="content"
                                   @input="checkContent(content)" multiLine :rows="1" :rowsMax="6"
                                   inputClass="inputClass" hintTextClass="hintTextClass"/>
                </div>
            </div>
            <div class="picesWrap">
                <div flex="main:justify">
                    <div class="picesTitle">风采展示</div>
                    <div class="upload" @click="changeFile('album')">添加</div>
                </div>
                <div class="picesList" v-if="pices.length>0">
                    <ul v-if="pices.length<=9" class="noSwiper">
                        <li v-for="(pic,index) in pices" @click="seePicesItem(index)"
                            :class="{middleLi:pices.length<=4}">
                            <div class="picesWrapper">
                                <img :src="pic.datathumbnail" class="picesItem"/>
                                <div class="play" flex="main:justify cross:center" v-if="pic.datatype==3">
                                    <img src="./images/videoPanel.png">
                                    <div>
                                        <span v-text="parseInt(pic.datatime/60)<10?'0'+parseInt(pic.datatime/60):parseInt(pic.datatime/60)"></span>
                                        <span>:</span>
                                        <span v-text="pic.datatime%60<10?'0'+(pic.datatime%60):pic.datatime%60"></span>
                                    </div>
                                </div>
                            </div>
                            <img src="./images/removePicItem.png" class="removePicItem" @click.stop="removePic(index)">
                        </li>
                    </ul>
                    <ul v-if="pices.length>9" class="noSwiperScroll">
                        <li v-for="(pic,index) in pices" @click="seePicesItem(index)"
                            :class="{middleLi:pices.length<=4}">
                            <div class="picesWrapper">
                                <img :src="pic.datathumbnail" class="picesItem"/>
                                <div class="play" flex="main:justify cross:center" v-if="pic.datatype==3">
                                    <img src="./images/videoPanel.png">
                                    <div>
                                        <span v-text="parseInt(pic.datatime/60)<10?'0'+parseInt(pic.datatime/60):parseInt(pic.datatime/60)"></span>
                                        <span>:</span>
                                        <span v-text="pic.datatime%60<10?'0'+(pic.datatime%60):pic.datatime%60"></span>
                                    </div>
                                </div>
                            </div>
                            <img src="./images/removePicItem.png" class="removePicItem" @click.stop="removePic(index)">
                        </li>
                    </ul>
                </div>
                <div class="picesNull" flex="dir:top cross:center" v-if="pices.length==0">
                    <img src="./images/picesNull.png" @click="changeFile('album')"/>
                    <span>暂时没有图片／视频  立即上传</span>
                </div>
            </div>
            <div flex="main:center" class="videoAdd">
                <mu-flat-button label="完成" labelClass="labelClass" :class="{buttonFocus:buttonColor}"
                                class="demo-flat-button" @click="save()"/>
            </div>
        </div>
        <mu-snackbar v-if="snackbar" :message="message" action="关闭" @actionClick="hideSnackbar"
                     @close="hideSnackbar"/>
        <mu-toast v-if="toast" :message="msg" @close="hideToast"/>
    </div>
</template>

<script type="text/babel">
    import {domain} from '../../../api/api.js'
    import classList from '../../../components/classList/defaultClassList.vue'
    import api from '../../../api/api.js'
    const API = new api();
    export default{
        data(){
            return {
                classList: '',
                pices: [],
                content: '',
                msg: '',
                toast: false,
                snackbar: false,
                check: false,
                classCheck: false,
                picesCheck: false,
                buttonColor: false,
                domain: domain,
                canUploadClick: true,
                parentInfo:{appCode:'APP_VEDIO',title:'学员风采'}
            }
        },
        components:{
            classList
        },
        methods: {
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
             * @description: 检测信息
             *
             * @update: cxy (2017-03-07)
             */
            checkFun(){
                if (this.classList === '') {
                    this.msg = '请勾选班级';
                    this.showToast();
                    return
                }
                this.check = true
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
             * @description: 隐藏提示框
             *
             * @update: cxy (2017-03-06)
             */
            hideSnackbar () {
                this.snackbar = false
                if (this.snackTimer) clearTimeout(this.snackTimer)
            },
            /*
             * @description: 按钮颜色检测
             *
             * @update: cxy (2017-03-08)
             */
            buttonColorCheck(){
                if (this.classCheck && this.picesCheck) {
                    this.buttonColor = true
                } else {
                    this.buttonColor = false
                }
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
                if (this.pices.length > 0) {
                    this.picesCheck = true
                } else {
                    this.picesCheck = false
                }
                this.buttonColorCheck();
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
                if (this.pices.length <= 0) {
                    this.msg = '请上传附件';
                    this.showToast();
                    this.check = false
                    return
                }
                this.check = true
            },
            /*
             * @description: 调用客户端上传文件
             *
             * @update: cxy (2017-03-06)
             */
            changeFile(type){
                //TODO:客户端上传文件
                if (100 - this.pices.length > 0) {
                    util.JsBridge('getPicesList', {
                        picItemCount: 100 - this.pices.length,
                        showType: type,
                        appType: 'APP_VIDEO'
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
                    this.message = '您最多只能上传100个附件';
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
             * @description: 发送风采
             *
             * @update: cxy (2017-03-13)
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
                            picNum: this.pices.length
                        }
                        let response = API.saveVideo(params);
                        let that = this;
                        response.then((res)=> {
                            that.msg = res.msg;
                            that.showToast();
                            if (res.code === 200) {
                                if (this.pices.length > 0) {
                                    //TODO:客户端保存文件
                                    util.JsBridge('sendFinish', {
                                        taskTid: res.rs.taskTid,
                                        appType: 'APP_VIDEO',
                                        taskName: '学员风采',
                                        taskImageURL: this.domain + 'v110/src/assets/icon/video.png'
                                    }, ()=> {
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
        }
    }
</script>
<style scoped lang="scss">
    .container {
        width: 100%;
        height: 100%;
        position: relative;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    .container .blue {
        min-height: 1.85rem;
        background: #67a5ff;
        width: 100%;
        z-index: -1;
    }
    .content {
        width: 100%;
        box-sizing: border-box;
        position: relative;
        z-index: 2;
    }
    .inputInfo {
        width: 100%;
        padding: 0 0.15rem;
    }

    .inputTitle {
        font-size: 0.17rem;
        color: #ffffff;
        margin-top: 0.29rem;
        margin-bottom: 0.12rem;
    }

    .picesWrap {
        margin-left: 0.15rem;
        padding-top: 0.29rem;
    }

    .picesTitle {
        font-size: 0.17rem;
        color: #595d68;
    }

    .upload {
        font-size: 0.15rem;
        color: #67a5ff;
        margin-right: 0.15rem;
    }

    .picesNull {
        margin-top: 0.55rem;
        margin-bottom: 0.8rem;

    img {
        width: 1.54rem;
        height: 1.15rem;
        margin-bottom: 0.2rem;
    }

    span {
        font-size: 0.15rem;
        color: #d3d5d7;
    }

    }
    .picesList {
        margin: 0.13rem 0;
    }

    .noSwiper {
        overflow: hidden;

    li {
        background: #d8d8d8;
        border-radius: 0.06rem;
        width: 1.11rem;
        height: 1.11rem;
        float: left;
        margin-right: 0.06rem;
        position: relative;
        margin-bottom: 0.06rem;
    }

    }
    .noSwiperScroll {
        overflow-scrolling: touch;
        overflow-y: scroll;
        height: 3rem;

    li {
        background: #d8d8d8;
        border-radius: 0.06rem;
        width: 1.11rem;
        height: 1.11rem;
        float: left;
        margin-right: 0.06rem;
        position: relative;
        margin-bottom: 0.06rem;
    }

    }
    .removePicItem {
        width: 0.24rem;
        height: 0.24rem;
        position: absolute;
        top: 0.02rem;
        right: 0.02rem;
    }

    .demo-flat-button {
        background: #ccd2da;
        border-radius: 0.6rem;
        width: 3rem;
        height: 0.44rem;
        margin: 0.15rem 0;
    }

    .buttonFocus {
        background: #67a5ff;
        border-radius: 0.6rem;
        width: 3rem;
        height: 0.44rem;
        margin: 0.15rem 0;
    }

    .play {
        position: absolute;
        width: 100%;
        padding: 0 0.06rem;
        bottom: 0;
        left: 0;

    img {
        width: 0.18rem;
        height: 0.11rem;
    }

    span {
        font-size: 0.13rem;
        color: #ffffff;
    }

    }

    .picesItem {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
    }

    .picesWrapper {
        width: 1.11rem;
        height: 1.11rem;
        overflow: hidden;
        position: relative;
        align-items: center;
        display: flex;
    }

    .middleLi {
        border-radius: 0.06rem !important;
        width: 1.69rem !important;
        height: 1.69rem !important;

    .picesWrapper {
        width: 1.69rem;
        height: 1.69rem;
        overflow: hidden;
        position: relative;
        align-items: center;
        display: flex;
    }

    }
    .classFocus {
        background: #79b0ff !important;
        border: 0.01rem solid #e7f1ff !important;
        box-shadow: 0 0.03rem 0.03rem 0 #5e95e4 !important;
        border-radius: 0.05rem !important;
        height: 0.4rem !important;
    }
</style>
<style>
    .videoAdd .underlineClass {
        background-color: rgba(255, 255, 255, 0.30);
        height: 0.01rem;
    }

    .videoAdd .underlineFocusClass {
        background-color: #67a5ff;
        margin-top: 0;
    }

    .videoAdd .hintTextClass {
        font-size: 0.15rem;
        color: rgba(255, 255, 255, 0.30);
    }

    .videoAdd .inputClass {
        color: #ffffff;
        resize: none;
        padding-bottom: 0.13rem;
    }

    .videoAdd .labelClass {
        font-size: 0.17rem;
        color: #ffffff;
    }
    .mu-text-field{
        width:3.45rem;
    }
    .mu-text-field-line {
        display: none;
    }

    .mu-text-field-focus-line {
        display: none;
    }
</style>
