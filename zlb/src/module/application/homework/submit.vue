<template>
        <div class="container"  v-cloak>
            <div class="list">
                <div class="list_item">
                    <div class="list_main">
                        <div class="title" flex="cross:center">
                            <div class="img_wrapper" flex-box="0">
                                <img v-if="teacher.userPhoto" :src="teacher.userPhoto+'?imageView2/0/w/80/format/jpeg'">
                                <avatar v-if="teacher.userPhoto==''" :userId="teacher.userId"
                                        :userName="teacher.nickName"></avatar>
                            </div>
                            <span class="name" flex-box="1" v-text="teacher.nickName"></span>
                            <span class="time" flex-box="0" v-text="homework.createTime"></span>
                        </div>
                        <div class="list_content" v-html="homework.content"></div>
                        <div class="assign_homework" v-if="homework.pices&&homework.pices.length>0">
                            <div class="assign_item" v-if="homework.pices.length%2!=0&&i<1"
                                 v-for="(pic,i) in homework.pices"
                                 :class="{'single_item':homework.pices.length%2!=0 && i==0}"
                                 @click="clientSwiper(homework.pices,i)">
                                <img :src="imagedomain+pic.imgUrl+'?imageView2/0/w/702/format/jpeg'" v-if="pic.type==1">
                                <img :src="imagedomain+pic.imgUrl+'?vframe/jpeg/offset/1/w/702'"
                                     v-if="pic.type==3">
                                <div class="play" v-if="pic.type==3"></div>
                                <div class="audioWrapper" v-if="pic.type==2">
                                    <div class="audioTime">
                                        <span v-text="parseInt(pic.time/60)<10?'0'+parseInt(pic.time/60):parseInt(pic.time/60)"></span>
                                        <span>:</span>
                                        <span v-text="pic.time%60<10?'0'+pic.time%60:pic.time%60"></span>
                                    </div>
                                    <div class="audioPlay"></div>
                                </div>
                            </div>
                            <div class="assign_item" v-if="homework.pices.length%2==0&&i<2"
                                 v-for="(pic,i) in homework.pices"
                                 :class="{'single_item':homework.pices.length%2!=0 && i==0}"
                                 @click="clientSwiper(homework.pices,i)">
                                <img :src="imagedomain+pic.imgUrl+'?imageView2/0/w/346/format/jpeg'" v-if="pic.type==1">
                                <img :src="imagedomain+pic.imgUrl+'?vframe/jpeg/offset/1/w/346'"
                                     v-if="pic.type==3">
                                <div class="play" v-if="pic.type==3"></div>
                                <div class="audioWrapper" v-if="pic.type==2">
                                    <div class="audioTime">
                                        <span v-text="parseInt(pic.time/60)<10?'0'+parseInt(pic.time/60):parseInt(pic.time/60)"></span>
                                        <span>:</span>
                                        <span v-text="pic.time%60<10?'0'+pic.time%60:pic.time%60"></span>
                                    </div>
                                    <div class="audioPlay"></div>
                                </div>
                            </div>
                            <transition name="fade">
                                <ul v-if="isSlide">
                                    <li class="assign_item" v-if="homework.pices.length%2!=0&&i>=1"
                                        v-for="(pic,i) in homework.pices"
                                        :class="{'single_item':homework.pices.length%2!=0 && i==0}"
                                        @click="clientSwiper(homework.pices,i)">
                                        <img :src="imagedomain+pic.imgUrl+'?imageView2/0/w/346/format/jpeg'"
                                             v-if="pic.type==1">
                                        <img :src="imagedomain+pic.imgUrl+'?vframe/jpeg/offset/1/w/346'"
                                             v-if="pic.type==3">
                                        <div class="play" v-if="pic.type==3"></div>
                                        <div class="audioWrapper" v-if="pic.type==2">
                                            <div class="audioTime">
                                                <span v-text="parseInt(pic.time/60)<10?'0'+parseInt(pic.time/60):parseInt(pic.time/60)"></span>
                                                <span>:</span>
                                                <span v-text="pic.time%60<10?'0'+pic.time%60:pic.time%60"></span>
                                            </div>
                                            <div class="audioPlay"></div>
                                        </div>
                                    </li>
                                    <li class="assign_item" v-if="homework.pices.length%2==0&&i>=2"
                                        v-for="(pic,i) in homework.pices"
                                        :class="{'single_item':homework.pices.length%2!=0 && i==0}"
                                        @click="clientSwiper(homework.pices,i)">
                                        <img :src="imagedomain+pic.imgUrl+'?imageView2/0/w/346/format/jpeg'"
                                             v-if="pic.type==1">
                                        <img :src="imagedomain+pic.imgUrl+'?vframe/jpeg/offset/1/w/346'"
                                             v-if="pic.type==3">
                                        <div class="play" v-if="pic.type==3"></div>
                                        <div class="audioWrapper" v-if="pic.type==2">
                                            <div class="audioTime">
                                                <span v-text="parseInt(pic.time/60)<10?'0'+parseInt(pic.time/60):parseInt(pic.time/60)"></span>
                                                <span>:</span>
                                                <span v-text="pic.time%60<10?'0'+pic.time%60:pic.time%60"></span>
                                            </div>
                                            <div class="audioPlay"></div>
                                        </div>
                                    </li>
                                </ul>
                            </transition>
                        </div>
                        <div class="handle_area" flex="cross:center" @click="slideFuc()">
                            <div class="timeNull" v-if="homework.pices&&homework.pices.length>2"></div>
                            <div flex="cross:center main:center" flex-box="1">
                                <div class="clock" flex-box="0" v-if="expirTime>0"></div>
                                <div class="timeout" flex-box="0">
                                    <span v-if="expirTime>0" v-text="newExpirTime"></span>
                                    <span v-if="expirTime>0" class="second" v-text="newExpirSec"></span>
                                    <span v-if="expirTime>0">秒</span>
                                </div>
                            </div>
                            <div class="textState" v-if="isSlide&&homework.pices&&homework.pices.length>2" flex-box="0">
                                收起
                            </div>
                            <div class="textState" v-if="!isSlide&&homework.pices&&homework.pices.length>2"
                                 flex-box="0">展开
                            </div>
                            <div class="slideIcon" flex-box="0" v-if="homework.pices&&homework.pices.length>2"
                                 :class="{'slideIconTop':isSlide}"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="submit_area">
                <div class="submitTitle" v-if="!btnShow">我的提交</div>
                <div class="null" v-if="selfPics.length==0&&getPics.length==0&&expirTime!=0">最多可上传9个附件哦</div>
                <ul class="submit_list">
                    <li class="submit_item" v-for="(picItem,k) in selfPics" @click="getSwiper(k)">
                        <div class="img_wrapper">
                            <img :src="picItem.datathumbnail" v-if="picItem.datatype!=2"/>
                            <div class="play" v-if="picItem.datatype==3"></div>
                            <div class="audioWrapperSmall" v-if="picItem.datatype==2">
                                <div class="audioTimeSmall">
                                    <span v-text="parseInt(picItem.datatime/60)<10?'0'+parseInt(picItem.datatime/60):parseInt(picItem.datatime/60)"></span>
                                    <span>:</span>
                                    <span v-text="picItem.datatime%60<10?'0'+picItem.datatime%60:picItem.datatime%60"></span>
                                </div>
                                <div class="audioPlaySmall"></div>
                            </div>
                        </div>
                        <div class="remove_btn" @click.stop="removePic(k)" v-if="isCancel"></div>
                    </li>
                    <li class="submit_item" v-for="(picItem,m) in getPics" @click="clientSwiper(getPics,m)">
                        <div class="img_wrapper">
                            <img :src="imagedomain+picItem.imgUrl+'?imageView2/0/w/232/format/jpeg'"
                                 v-if="picItem.type==1"/>
                            <img :src="imagedomain+picItem.imgUrl+'?vframe/jpeg/offset/1/w/232'"
                                 v-if="picItem.type==3"/>
                            <div class="play" v-if="picItem.type==3"></div>
                            <div class="audioWrapperSmall" v-if="picItem.type==2">
                                <div class="audioTimeSmall">
                                    <span v-text="parseInt(picItem.time/60)<10?'0'+parseInt(picItem.time/60):parseInt(picItem.time/60)"></span>
                                    <span>:</span>
                                    <span v-text="picItem.time%60<10?'0'+picItem.time%60:picItem.time%60"></span>
                                </div>
                                <div class="audioPlaySmall"></div>
                            </div>
                        </div>
                    </li>
                </ul>
                <comment :commentList="commentList" :type="'APP_HOMEWORK'"  @toParentComponents="getInfo"  v-if="(!btnShow)&&commentList.length>0"></comment>
                <div class="add_list" flex="main:justify cross:center" v-if="(!(expirTime<=0))&& btnShow && isCancel">
                    <label flex-box="0" class="album" :class="{'albumGray':selfPics.length>=9}"
                           @click="changeFile('album')"></label>
                    <label flex-box="0" class="camera" :class="{'cameraGray':selfPics.length>=9}"
                           @click="changeFile('camera')"></label>
                    <label flex-box="0" class="video" :class="{'videoGray':selfPics.length>=9}"
                           @click="changeFile('video')"></label>
                    <label flex-box="0" class="audio" :class="{'audioGray':selfPics.length>=9}"
                           @click="changeFile('audio')"></label>
                </div>
                <mu-raised-button label="提交" class="demo-raised-button my-btn my-disable"
                                  v-if="(!(expirTime<=0))&&selfPics.length==0&&btnShow" @click="submitAlert"/>
                <mu-raised-button label="提交中..." v-if="submitting" class="demo-raised-button my-btn my-disable"
                                  disabled/>
                <mu-raised-button label="已过期" class="demo-raised-button my-btn my-disable" disabled
                                  v-if="(expirTime<=0)&&btnShow"/>
                <mu-raised-button label="提交" class="demo-raised-button my-btn my-submit"
                                  v-if="selfPics.length>0&&btnShow&&(!submitting)" @click="saveSubmit"/>
                <mu-raised-button :label="'撤回 '+revokeTime+'s'" class="demo-raised-button my-btn my-recall"
                                  v-if="revokeTime>0&&(!submitting)" @click="openDialog"/>
            </div>
            <mu-toast v-if="toast" :message="msg" @close="hideToast"/>
            <mu-snackbar v-if="snackbar" :message="message" action="关闭" @actionClick="hideSnackbar"
                         @close="hideSnackbar"/>
            <div class="allWrapper" v-if="dialog">
                <div class="innerWrapper">
                    <p class="innerTitle">确定撤回作业？</p>
                    <div class="innerBtnWrapper" flex="main:center">
                        <mu-raised-button label="取消" class="demo-raised-button innerCancelBtn" @click="closeDialog"
                                          flex-box="0"/>
                        <mu-raised-button label="撤回" class="demo-raised-button innerConfirmBtn" @click="cancelSubmit"
                                          flex-box="0"/>
                    </div>
                </div>
            </div>
        </div>

</template>
<script type="text/babel">
    import {imagedomain} from '../../../api/api.js'
    import avatar from '../../../components/defaultAvatar.vue'
    import comment from '../../../components/comment/commentDetail.vue'
    import api from '../../../api/api.js'
    const API = new api();
    export default{
        data () {
            return {
                isSlide: false,
                homework: '',
                page: 1,
                classId: this.$route.query.classId,
                tid: this.$route.query.tid,
                imagedomain: imagedomain,
                expirTime: '',
                newExpirTime: '',
                newExpirSec: '',
                submitting: false,
                msg: '',
                toast: false,
                btnShow: false,
                submitPics: [],
                selfPics: [],
                getPics: [],
                commentList: [],
                snackbar: false,
                teacher: '',
                dialog: false,
                revokeTime: 0,
                intervalId: '',
                isCancel: true,
                swiperList: [],
                message: '',
                nowTime: new Date(),
                nowReplyIndex: -1,
                userDetail:''
            }
        },
        mounted () {
            this.$nextTick(function () {
                this.getDetail();
            })
        },
        components: {
            avatar,
            comment
        },
        methods: {
            changeNowIndex(replyIndex, index){
                this.nowReplyIndex = replyIndex;
                this.nowIndex = index;
            },
            timeRefresh(){
                if ((new Date() - this.nowTime > 7000)) {
                    if (this.revokeTime > 0) {
                        this.revokeTime = this.revokeTime - parseInt((new Date() - this.nowTime) / 1000);
                    }
                    if (this.expirTime > 0) {
                        this.expirTime = this.expirTime - parseInt((new Date() - this.nowTime) / 1000);
                        this.intervalFormat(this.expirTime);
                    }
                    this.nowTime = new Date();
                } else {
                    this.nowTime = new Date();
                }
            },
            closeDialog(){
                this.dialog = false;
            },
            openDialog(){
                this.dialog = true;
            },
            cancelSubmit(){
                let param = {
                    classId: this.classId,
                    workId: this.tid
                };
                API.cancelHomeworkSubmit(param).then((res)=> {
                    let {code}=res;
                    if (code == 200) {
                        this.revokeTime = '';
                        this.getPics = [];
                        this.selfPics = [];
                        this.submitPics = [];
                        this.isCancel = true;
                        this.btnShow = true;
                    }
                    this.msg = res.msg;
                    this.showToast();
                });
                this.dialog = false;
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
            /*
             * @description: 客户端浏览文件
             *
             * @update: cxy (2017-03-09)
             */
            clientSwiper(pices, index){
                if (this.submitting) {
                    return
                } else {
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
                }
            },
            slideFuc(){
                this.isSlide = !this.isSlide;
            },
            toBottomFun(){
                this.$nextTick(function () {
                    document.body.scrollTop = document.body.scrollHeight;
                });
            },
            getDetail () {
                let param = {
                    tid: this.tid,
                    classId: this.classId
                };
                API.getHomeworkSubmit(param).then(res=> {
                    let {code,rs}=res;
                    if (code == 200) {
                        clearInterval(this.intervalId);
                        if (!rs.reply || rs.reply.length == 0) {
                            this.btnShow = true;
                        }
                        if (rs.main.pices) {
                            rs.main.pices = JSON.parse(rs.main.pices)
                        }
                        if (rs.main.createTime) {
                            rs.main.createTime = util.changeDate(rs.main.createTime)
                        }
                        if (rs.reply) {
                            this.getPics = rs.reply;
                        }
                        if (rs.revokeTime >= 0) {
                            this.revokeTime = rs.revokeTime;
                        }
                        if (rs.teacher) {
                            this.teacher = rs.teacher;
                        }
                        if (rs.main.expirTime >= 0) {
                            this.expirTime = rs.main.expirTime;
                        } else {
                            this.expirTime = 'infinity'
                        }
                        if (rs.commentList && rs.commentList.length > 0) {
                            this.commentList = rs.commentList;
                        }
                        this.intervalFun();
                        this.homework = rs.main;
                        this.$nextTick(function () {
                            this.toBottomFun();
                        })
                    } else {
                        this.msg = res.msg;
                        this.showToast();
                    }
                    this.$nextTick(function () {
                        document.body.scrollTop=0;
                        this.propsTitle();
                    })
                });
            },
            /*
             * @description: 无附件提交提示
             *
             * @update: lwq (2017-03-13)
             */
            submitAlert(){
                this.msg = '请添加作业附件';
                this.showToast();
            },
            /*
             * @description: 倒计时
             *
             * @update: lwq (2017-03-07)
             */
            intervalFun(){
                if (this.expirTime > 0) {
                    this.intervalFormat(this.expirTime)
                }
                this.intervalId = setInterval(()=> {
                    this.timeRefresh();
                    if (this.revokeTime > 0) {
                        this.revokeTime = this.revokeTime - 1;
                    }
                    if (this.expirTime > 0) {
                        this.expirTime = this.expirTime - 1;
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
                    this.newExpirTime = new Date(this.expirTime * 1000).Time('dd天hh时mm分');
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
             * @description: 显示提示框
             *
             * @update: cxy (2017-03-06)
             */
            showSnackbar(){
                this.snackbar = true;
                if (this.snackTimer) clearTimeout(this.snackTimer)
                this.snackTimer = setTimeout(() => {
                    this.snackbar = false
                }, 2000)
            },
            /*
             * @description: 隐藏提示框
             *
             * @update: cxy (2017-03-06)
             */
            hideSnackbar () {
                this.snackbar = false;
                if (this.snackTimer) clearTimeout(this.snackTimer)
            },
            /*
             * @description: 显示保存结果信息
             *
             * @update: cxy (2017-03-07)
             */
            showToast () {
                this.toast = true;
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
             * @description: h5上传
             *
             * @update: cxy (2017-03-08)
             */
            uploadFile(e){
                if (9 - this.selfPics.length > 0) {
                    util.changeFile([...e.target.files], (res)=> {
                        if (9 - this.selfPics.length > 0) {
                            let {baseUrl,fileUrl,coverUrl}=res;
                            let rs = {};
                            rs.datathumbnail = baseUrl;
                            rs.imgUrl = fileUrl;
                            if (coverUrl) {
                                rs.coverUrl = coverUrl;
                            }
                            rs.datatype = 1;
                            this.selfPics.push(rs);
                        } else {
                            this.showSnackbar();
                        }
                        this.$refs.inputFile.value = '';
                    })
                }
            },
            getsubmitPics(){
                this.selfPics.forEach((el)=> {
                    let newEl = {};
                    newEl.type = el.datatype;
                    newEl.imgUrl = el.imgUrl;
                    if (el.time) {
                        newEl.time = el.time;
                    }
                    this.submitPics.push(newEl)
                });
            },
            saveSubmit() {
                if (this.selfPics.length <= 9) {
                    const that = this;
                    that.msg = '提交中,请稍后';
                    that.showToast();
                    that.submitting = true;
                    that.isCancel = false;
                    util.JsBridge('submitFinish', {}, (result)=> {
                        if (result.statuscode == 400) {
                            that.msg = '上传失败，请重新上传';
                            that.showToast();
                            that.submitting = false;
                            that.isCancel = true;
                        } else {
                            that.swiperList = result;
                            let param = {
                                classId: that.classId,
                                homeworkId: that.tid,
                                data: Array.prototype.toString.call(result) === '[object String]' ? result : JSON.stringify(result)
                            };
                            API.saveHomeworkSubmit(param).then((res)=> {
                                const {code}=res;
                                if (code == 200) {
                                    that.revokeTime = 120;
                                    that.btnShow = false;
                                    that.msg = '提交成功';
                                    that.submitting = false;
                                    that.showToast();
                                } else {
                                    this.isCancel = true;
                                    that.submitting = false;
                                    that.msg = res.msg;
                                    that.showToast();
                                }
                            }).catch(()=> {
                                that.isCancel = true;
                                that.submitting = false;
                                that.msg = '网络异常,请稍后重试';
                                that.showToast();
                            })
                        }
                    })
                } else {
                    this.msg = '上传附件不能超过九张';
                    this.showToast();
                }

            },
            /*
             * @description: 客户端上传文件
             *
             * @update: cxy (2017-03-07)
             */
            changeFile(type){
                //TODO:客户端上传文件
                if (9 - this.selfPics.length > 0) {
                    util.JsBridge('getPicesList', {
                        picItemCount: 9 - this.selfPics.length,
                        showType: type,
                        appType: 'APP_HOMEWORK',
                        noUploadList: 1
                    }, (res)=> {
                        this.changeFileCallBack(res);
                    })
                } else {
                    this.message = '您最多只能上传9个附件';
                    this.snackbar = true;
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
                this.selfPics = this.selfPics.concat(res);
                this.toBottomFun();
            },
            /*
             * @description: 调用客户端删除文件
             *
             * @update: cxy (2017-03-06)
             */
            removePic(index){
                this.selfPics.splice(index, 1);
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
                if (this.submitting) {
                    return
                } else {
                    //TODO:客户端浏览文件
                    util.JsBridge('seePicesItem', {
                        picItemIndex: index
                    }, (res)=> {
                    })
                }
            },
            /*
             * @description: 中文说明
             *
             * @update: cxy (2017-03-16)
             */
            getSwiper(index){
                if (this.isCancel) {
                    this.seePicesItem(index)
                } else {
                    this.clientSwiper(this.swiperList, index)
                }
            },
            /*
             * @description: 获取子组件传递信息
             *
             * @update: cxy (2017-04-17)
             */
            getInfo(res){
                if(res=='refresh'){
                    this.toBottomFun();
                }
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
    .container {
        width: 100%;
        height:100%;
        position: relative;
        overflow-y: auto;
        overflow-x:hidden;
        overflow-scrolling: touch;
        -webkit-overflow-scrolling: touch;
    }

    .container .list {
        padding: 0 !important;
        box-sizing: border-box;
    }

    .container .list .list_item {
        border-bottom: 0.12rem solid #EFF3F6;
        padding-top: 0.15rem;
    }

    .container .list .list_item .list_main {

    }

    .container .list .list_item .list_main .title {
        height: 0.4rem;
        padding: 0 0.12rem;
    }

    /*老师头像*/
    .container .list .list_item .list_main .title .img_wrapper {
        height: 0.4rem;
        width: 0.4rem;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 0.1rem;
    }

    .container .list .list_item .list_main .title .img_wrapper img {
        display: block;
        height: 100%;
        width: 100%;
        object-fit: cover;
        -o-object-fit: cover;
        object-position: top;
        -o-object-position: top;
    }

    /*教师名称*/
    .container .list .list_item .list_main .title .name {
        color: #666;
        font-size: 0.16rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    /*时间*/
    .container .list .list_item .list_main .title .time {
        color: #999;
        font-size: 0.14rem;
    }

    /*作业内容*/
    .container .list .list_item .list_main .list_content {
        font-size: 0.16rem;
        color: #333;
        padding: 0 0.12rem;
        padding-top: 0.15rem;
        line-height: 0.24rem;
        text-align: justify;
    }

    /*布置作业附件*/
    .container .list .list_item .list_main .assign_homework {
        padding: 0 0.12rem;
        padding-top: 0.1rem;
        overflow: hidden;
    }

    .container .list .list_item .list_main .assign_homework .assign_item {
        width: 1.73rem;
        height: 1.73rem;
        overflow: hidden;
        box-sizing: border-box;
        border-left: 0.01rem solid #fff;
        border-bottom: 0.01rem solid #fff;
        position: relative;
        float: left;
    }

    .container .list .list_item .list_main .assign_homework .single_item {
        width: 100% !important;
        border-left: none !important;
    }

    .container .list .list_item .list_main .assign_homework img {
        display: block;
        height: 100%;
        width: 100%;
        object-fit: cover;
        -o-object-fit: cover;
        object-position: top;
        -o-object-position: top;
    }

    /*操作区域*/
    .container .list .list_item .list_main .handle_area {
        padding: 0.12rem;
    }

    .container .list .list_item .list_main .handle_area .timeNull {
        width: 0.52rem;
    }

    .container .list .list_item .list_main .handle_area .clock {
        height: 0.19rem;
        width: 0.17rem;
        background: url("./images/clock.png") no-repeat center center;
        background-size: 0.17rem 0.19rem;
        margin-right: 0.09rem;
    }

    .container .list .list_item .list_main .handle_area .timeout {
        font-size: 0;
    }

    .container .list .list_item .list_main .handle_area .timeout span {
        font-size: 0.14rem;
        color: #999;
    }

    .container .list .list_item .list_main .handle_area .timeout .second {
        font-size: 0.16rem;
        color: #67a5ff;
        padding: 0 0.05rem;
    }

    .container .list .list_item .list_main .handle_area .slideIcon {
        height: 0.07rem;
        width: 0.14rem;
        background: url("./images/slideBottom.png") no-repeat center center;
        background-size: 0.14rem 0.07rem;
    }

    .container .list .list_item .list_main .handle_area .textState {
        font-size: 0.14rem;
        color: #999;
        margin-right: 0.05rem;
    }

    .slideIconTop {
        height: 0.07rem;
        width: 0.14rem;
        background: url("./images/slideBottom.png") no-repeat center center;
        background-size: 0.14rem 0.07rem;
        -webkit-transform: rotate(180deg) !important;
        -moz-transform: rotate(180deg) !important;
        -ms-transform: rotate(180deg) !important;
        -o-transform: rotate(180deg) !important;
    }

    .container .submit_area {
        width: 100%;
        background: #fff;
        padding: 0.12rem;
        text-align: center;
    }

    .container .submit_area .submitTitle {
        width: 100%;
        background: #fff;
        color: #333;
        font-size: 0.16rem;
        text-align: left;
        padding-bottom: 0.06rem;
    }

    .container .submit_area .submit_list {
        overflow: hidden;
    }

    .container .submit_area .submit_list .submit_item {
        float: left;
        border-left: 0.01rem solid #fff;
        border-bottom: 0.01rem solid #fff;
        box-sizing: border-box;
        height: 1.16rem;
        width: 1.16rem;
        position: relative;
    }

    .container .submit_area .submit_list .submit_item .img_wrapper {
        height: 100%;
        width: 100%;
        overflow: hidden;
        position: relative;
    }

    .container .submit_area .submit_list .submit_item .img_wrapper img {
        height: 100%;
        width: 100%;
        object-fit: cover;
        -o-object-fit: cover;
        object-position: top;
        -o-object-position: top;
        display: block;
    }

    .container .submit_area .submit_list .submit_item .img_wrapper img {
        height: 100%;
        width: 100%;
        object-fit: cover;
        -o-object-fit: cover;
        object-position: top;
        -o-object-position: top;
        display: block;
    }

    .container .submit_area .submit_list .submit_item .remove_btn {
        height: 0.24rem;
        width: 0.24rem;
        background: url("./images/removePicItem.png") no-repeat center center;
        background-size: contain;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1;
    }

    .container .submit_area .null {
        font-size: 0.14rem;
        color: #ccc;
        text-align: center;
        padding-top: 0.5rem;
        padding-bottom: 0.3rem;
    }

    .container .submit_area .reply_list {
        padding: 0.08rem 0;
    }

    .container .submit_area .reply_list .reply_item {
        padding: 0.02rem 0;
        position: relative;
    }

    .container .submit_area .reply_list .reply_item:active {
        background: #f7f8fa;
    }

    .container .submit_area .reply_list .reply_item .reply_wrapper {
        width: 100%;
        height: 100%;
        font-size: 0;
        text-align: justify;
    }

    .container .submit_area .reply_list .reply_item .reply_wrapper span {
        margin-right: 0.05rem;
        color: #999;
        font-size: 0.14rem;
    }

    .container .submit_area .reply_list .reply_item .reply_wrapper .reply_content {
        margin-right: 0;
        color: #6C7381;
    }

    .container .submit_area .reply_list .reply_item .reply_wrapper .span {
        color: #67a5ff;
        font-size: 0.14rem;
    }

    .container .submit_area .add_list {
        width: 3.08rem;
        padding: 0.14rem 0.3rem 0.1rem 0.3rem;
        box-sizing: border-box;
        border-bottom: 1px solid #f2f2f2;
        margin: 0 auto;
    }

    .container .submit_area .add_list label {
        height: 0.4rem;
        width: 0.4rem;
    }

    .container .submit_area .add_list .album {
        background: url("images/add_album.png") no-repeat center center;
        background-size: contain !important;
    }

    .container .submit_area .add_list .albumGray {
        background: url("./images/albumGray.png") no-repeat center center !important;
        background-size: contain !important;
    }

    .container .submit_area .add_list .audio {
        background: url("images/add_audio.png") no-repeat center center;
        background-size: contain !important;
    }

    .container .submit_area .add_list .audioGray {
        background: url("./images/audioGray.png") no-repeat center center !important;
        background-size: contain !important;
    }

    .container .submit_area .add_list .camera {
        background: url("images/add_camera.png") no-repeat center center;
        background-size: contain !important;
    }

    .container .submit_area .add_list .cameraGray {
        background: url("./images/cameraGray.png") no-repeat center center !important;
        background-size: contain !important;
    }

    .container .submit_area .add_list .video {
        background: url("images/add_video.png") no-repeat center center;
        background-size: contain !important;
    }

    .container .submit_area .add_list .videoGray {
        background: url("./images/videoGray.png") no-repeat center center !important;
        background-size: contain !important;
    }

    .my-btn {
        height: 0.44rem !important;
        width: 1.97rem !important;
        border-radius: 1rem !important;
        margin-top: 0.17rem;
        color: #fff;
        font-size: 0.16rem;
    }

    .my-disable {
        background: #e0e0e0 !important;
    }

    .my-submit {
        background: #67a5ff !important;
    }

    .my-recall {
        background: #ffbf5f !important;
    }

    /*语音*/
    .audioWrapper {
        height: 100%;
        width: 100%;
        position: relative;
        background: url("./images/audioBgLarge.png") no-repeat center bottom;
        background-size: 100% 100%;
        box-sizing: border-box;
        border: 1px solid #e7f1ff;
    }

    .audioWrapper .audioPlay {
        height: 0.55rem;
        width: 0.55rem;
        background: url("./images/audioPlay.png") no-repeat center center;
        background-size: contain;
        margin: 0 auto;
        margin-top: 0.2rem;
    }

    .audioWrapper .audioTime {
        color: #67a5ff;
        font-size: 0.18rem;
        text-align: center;
        padding-top: 0.35rem;
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

    .allWrapper {
        background: rgba(0, 0, 0, 0.8);
        height: 100%;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 111;
    }

    .innerWrapper {
        height: 1.7rem;
        width: 2.85rem;
        background: #fff;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border-radius: 0.04rem;
    }

    .innerTitle {
        font-size: 0.18rem;
        text-align: center;
        color: #333;
        padding-top: 0.38rem;
    }

    .innerBtnWrapper {
        padding: 0 0.42rem;
        padding-top: 0.4rem;
    }

    .innerCancelBtn {
        background: #e8e8e8;
        border-radius: 1rem;
        width: 0.86rem;
        height: 0.44rem;
        color: #666;
        margin-right: 0.1rem;
    }

    .innerConfirmBtn {
        background: #ffbf5f;
        border-radius: 1rem;
        width: 0.86rem;
        height: 0.44rem;
        color: #fff;
        margin-left: 0.1rem;
    }
</style>
