<template>
    <div class="sonContainer" ref="sonContainer" v-cloak>
        <div class="workInner">
            <textarea placeholder="请输入对TA的评语" maxlength="100" v-model="content"
                      @input="checkContent($event)"></textarea>
            <div class="textLength" v-text="content.length+'/100'"></div>
        </div>
        <div class="enclosure">
            <div class="enclosureNull" v-if="pices.length===0">
                <div class="enclosureImg" flex="main:center cross:center">
                    <img src="./images/fujian.png"/>
                </div>
                <div class="enclosureToast" flex="main:center">最多可上传九个照片／视频</div>
            </div>
            <ul class="picesList" v-if="pices.length>0">
                <li v-for="(pic,index) in pices" @click="getSwiper(index,pices)">
                    <div class="picesWrap">
                        <img :src="imagedomain+pic.imgUrl+'?imageView2/0/w/224/format/jpeg'" v-if="pic.old && pic.type==1" class="picesItem"/>
                        <img :src="imagedomain+pic.imgUrl+'?vframe/jpeg/offset/1/w/224'" v-if="pic.old && pic.type==3" class="picesItem"/>
                        <img :src="pic.datathumbnail" v-if="!pic.old && pic.datatype!=2" class="picesItem"/>
                        <div class="play" flex="main:justify cross:center" v-if="pic.old && pic.type==3">
                            <img src="./images/videoPanel.png">
                            <div>
                                <span v-text="parseInt(pic.time/60)<10?'0'+parseInt(pic.time/60):parseInt(pic.time/60)"></span>
                                <span>:</span>
                                <span v-text="pic.time%60<10?'0'+(pic.time%60):pic.time%60"></span>
                            </div>
                        </div>
                        <div class="play" flex="main:justify cross:center" v-if="!pic.old && pic.datatype==3">
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
            <div class="addTypeList" flex="main:center" v-if="pices.length<9">
                <img src="./images/add_album.png" @click="changeFile('album')">
                <img src="./images/add_camera.png" @click="changeFile('camera')">
                <img src="./images/add_video.png" @click="changeFile('video')">
            </div>
            <div class="addTypeList" flex="main:center" v-if="pices.length>=9">
                <img src="./images/albumGray.png">
                <img src="./images/cameraGray.png">
                <img src="./images/videoGray.png">
            </div>
            <div class="finishLine"></div>
        </div>
        <div flex="main:center">
            <mu-flat-button label="提交" class="demo-flat-button" :class="{buttonFocus:buttonColor}" @click="save()"/>
        </div>
        <mu-snackbar v-if="snackbar" :message="message" action="关闭" @actionClick="hideSnackbar"
                     @close="hideSnackbar"/>
        <mu-toast v-if="toast" :message="msg" @close="hideToast"/>
    </div>
</template>

<script type="text/babel">
    import api from '../../../api/api.js'
    import {imagedomain} from '../../../api/api.js'
    const API = new api();
    export default{
        data(){
            return {
                content: '',
                pices: [],
                snackbar: false,
                msg: '',
                message: '',
                toast: false,
                check: false,
                picesCheck:false,
                buttonColor: false,
                imagedomain:imagedomain,
                showPaste: false,
                studentId:this.$route.query.studentId,
                studentName:this.$route.query.studentName,
                tid:this.$route.query.tid,
                canUploadClick:true,
            }
        },
        mounted(){
            this.$nextTick(function(){
                this.getPersonData();
            })
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
                    title: util.toUniCode(this.studentName),
                    color: '#67a5ff'
                }, (res)=> {
                })
            },
            /*
             * @description: 获取上传数据
             *
             * @update: cxy (2017-04-17)
             */
            getPersonData(){
                let param = {
                    opusId:this.tid,
                    studentId: this.studentId
                };
                API.getPersonData(param).then((res)=> {
                    const {rs,code}=res;
                    this.$nextTick(function(){
                        this.propsTitle();
                    })
                    if (code == 200) {
                        if(rs){
                            rs.stuOpus.pices=JSON.parse(rs.stuOpus.pices);
                            this.pices=rs.stuOpus.pices;
                            this.pices.map((e)=>{
                                e.old=true
                            })
                            this.content=rs.stuOpus.comment;
                        }
                    } else {
                        this.msg = res.msg;
                        this.showToast();
                    }
                }).catch((err)=>{
                    console.log(err)
                    this.msg = '网络异常,请稍后重试';
                    this.showToast();
                })
            },
            /*
             * @description: 滚到底部
             *
             * @update: lwq (2017-03-27)
             */
            toBottomFun(){
                this.$nextTick(function () {
                    this.$refs.sonContainer.scrollTop = this.$refs.sonContainer.scrollHeight;
                });
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
                        showType: type
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
                if (this.pices.length>0) {
                    this.picesCheck = true
                } else {
                    this.picesCheck = false
                }
                this.buttonColorCheck();
            },
            /*
             * @description: 浏览文件中转
             *
             * @update: cxy (2017-04-17)
             */
            getSwiper(index,pices){
                const oldArr=[]
                if(pices[index].old){
                    pices.forEach((e)=>{
                        if(e.old){
                            oldArr.push(e)
                        }
                    })
                    this.clientSwiper(oldArr,index)
                }else{
                    this.seePicesItem(index);
                }
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
             * @description: h5浏览文件
             *
             * @update: cxy (2017-03-09)
             */
            clientSwiper(pices, index){
                let arr = Array.prototype.toString.call(pices) === '[object String]' ? JSON.parse(JSON.stringify(JSON.parse(pices))) : JSON.parse(JSON.stringify(pices))
                arr.forEach(function (e) {
                    e.imgUrl = imagedomain + e.imgUrl;
                    if (e.type == 3) {
                        e.coverUrl = imagedomain + e.imgUrl + '?vframe/jpeg/offset/1';
                    }
                });
                //TODO:客户端浏览文件
                util.JsBridge('picesSwiper', {
                    picesList: arr,
                    picesIndex: index
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
             * @description: 检测评语内容输入
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
             * @description: 保存作品
             *
             * @update: cxy (2017-03-06)
             */
            save(){
                if (this.pices.length <= 9) {
                    const that = this;
                    util.JsBridge('submitFinish', {}, (result)=> {
                        if (result.statuscode == 400) {
                            that.msg = '上传失败，请重新上传';
                            that.showToast();
                        } else {
                            let resultArr=[]
                            result.forEach((e)=>{
                                let obj={}
                                if(e.type==1){
                                    obj.type= e.type
                                    obj.imgUrl= e.imgUrl
                                }
                                resultArr.push(obj)
                            })
                            let arr=[];
                            this.pices.forEach((e)=>{
                                if(e.old){
                                    arr.push(e)
                                }
                            })
                            arr=arr.concat(resultArr);
                            if(arr.length>0){
                                that.msg = '上传中,请稍后';
                                that.showToast();
                                const content = util.utf16toEntities(that.content).replace(/\n|\r\n/g, "<br>").replace(/[ ]/g, "&nbsp;");
                                let param = {
                                    studentId:that.studentId,
                                    opusId:that.tid,
                                    comment:content,
                                    pices:JSON.stringify(arr)
                                };
                                API.getPersonSubmit(param).then((res)=> {
                                    const {code}=res;
                                    if (code == 200) {
                                        this.$router.push({path: '/app/opus/addList', query: {classId:that.classId}})
                                    } else {
                                        that.msg = res.msg;
                                        that.showToast();
                                    }
                                }).catch((e)=> {
                                    that.msg = '网络异常,请稍后重试';
                                    that.showToast();
                                })
                            }else{
                                this.msg = '请上传附件';
                                this.showToast();
                            }
                        }
                    })
                } else {
                    this.msg = '上传附件不能超过九张';
                    this.showToast();
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
             * @description: 初始化信息
             *
             * @update: cxy (2017-03-07)
             */
            init(){
                this.pices = [];
                this.content = ''
            },
            /*
             * @description: 检测信息
             *
             * @update: cxy (2017-03-07)
             */
            checkFun(){
                if (this.pices.length<=0) {
                    this.msg = '请上传附件';
                    this.showToast();
                    this.check = false
                    return
                }
                this.check = true
            },
            /*
             * @description: 按钮颜色检测
             *
             * @update: cxy (2017-03-08)
             */
            buttonColorCheck(){
                if (this.picesCheck) {
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
    .sonContainer {
        width: 100%;
        height: 100%;
        position: relative;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
    .classList ul {
        display: inline-flex;
    }

    .classList ul li {
        background: #99c3ff;
        border-radius: 0.05rem;
        height: 0.4rem;
        margin-right: 0.06rem;
    }

    .workInner {
        background: #ffffff;
        width: 100%;
        height: 1.35rem;
        position: relative;
        border-bottom:0.15rem solid #EFF3F6;
        position: relative;
    }

    .workInner textarea {
        width: 100%;
        height: 100%;
        padding-top: 0.12rem;
        padding-left: 0.12rem;
        border: none;
        resize: none;
        font-size:0.15rem;
        color:#353840;
    }
    .textLength{
        font-size:0.13rem;
        color:#a1a6b1;
        position: absolute;
        right:0.12rem;
        bottom:0.12rem;
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
        width: 100%;
        position: relative;
    }

    .enclosureNull {
        margin-top: 1.2rem;
        margin-bottom: 0.35rem;
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
        width: 1.12rem;
        height: 1.12rem;
        position: relative;
        margin-right: 0.08rem;
        margin-bottom: 0.08rem;
    }

    }
    .picesWrap {
        width: 1.12rem;
        height: 1.12rem;
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

    .addTypeList {
        margin-top: 0.81rem;
        margin-bottom: 0.11rem;
    img {
        width: 0.4rem;
        height: 0.4rem;
        margin: 0 0.15rem;
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
    .finishLine{
        background:#f3f3f3;
        margin-left:0.28rem;
        width:3.08rem;
        height:0.01rem;
    }
    }

</style>
<style>
    .mu-flat-button-label {
        font-size: 0.16rem;
    }
</style>
