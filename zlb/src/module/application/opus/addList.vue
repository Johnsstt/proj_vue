<template>
    <div class="container" ref="container">
        <classList :parentInfo="parentInfo" @toParentComponent="getSonInfo"></classList>
        <div class="title">
            <div class="titleText">标题</div>
            <input type="text"  :value="inputInit"/>
            <div class="blueBorder"></div>
        </div>
        <div class="studentList">
            <ul>
                <li v-for="(student,index) in studentList"
                    :style="{marginLeft:(index+2)%3==0?0.62+'rem':'',marginRight:(index+2)%3==0?0.62+'rem':''}" @click="uploadFile(student)">
                    <img :src="student.photoUrl+'?imageView2/0/w/80/format/jpeg'" class="studentPhoto" v-if="student.photoUrl!=''"/>
                    <div class="studentDefaultWrap" v-if="student.photoUrl==''">
                        <avatar :userId="student.studentId" :userName="student.studentName"></avatar>
                    </div>
                    <div class="upload" v-if="student.infoMap.picCount>0"></div>
                    <div class="unUpload" v-if="student.infoMap.picCount<=0"></div>
                    <div class="studentName" flex="main:center" v-text="student.studentName"></div>
                    <div class="studentOpus" flex="main:center">作品：
                        <div class="studentOpusCount" v-text="student.infoMap.picCount"></div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="sendOpus" flex="main:center cross:center" ref="sendOpus" @click="send()">发送</div>
        <mu-toast v-if="toast" :message="msg" @close="hideToast"/>
    </div>
</template>

<script type="text/babel">
    import api from '../../../api/api.js'
    import {imagedomain} from '../../../api/api.js'
    import avatar from '../../../components/defaultAvatar.vue'
    import classList from '../../../components/classList/radioClassList.vue'
    const API = new api();
    export default{
        data(){
            return {
                studentList: [],
                classes: [],
                wrapShow:false,
                classNameShow:'',
                inputInit:new Date().getMonth()+1+'月'+new Date().getDate()+'日 作品',
                tid:'',
                msg: '',
                message: '',
                toast: false,
                parentInfo:{appCode:'APP_OPUS',title:'今日作品'},
                classId:''
            }
        },
        mounted(){
            this.$nextTick(function(){
                this.regScrollEvent();
            })
        },
        components:{
            classList,
            avatar
        },
        methods: {
            /*
             * @description: 获取列表数据
             *
             * @update: cxy (2017-04-17)
             */
            getOpusData(){
                let params={
                    classId:this.classId,
                }
                let response = API.getOpusData(params);
                response.then((res)=> {
                    if (res.code === 200) {
                        this.studentList=[];
                        this.$nextTick(function(){
                            this.studentList=res.rs.opus.list
                            this.tid=res.rs.opus.tid
                        })
                    } else {
                        this.msg = res.msg;
                        this.showToast();
                    }
                })
            },
            /*
             * @description: 注册滚动事件
             *
             * @update: cxy (2017-04-13)
             */
            regScrollEvent(){
                let scrollBeforeTop = 0, scrollTop = 0;
                this.$refs.container.onscroll = (()=> {
                    scrollBeforeTop = this.$refs.container.scrollTop;
                    if (scrollTop <= scrollBeforeTop) {
                        this.$refs.sendOpus.classList.remove('fadeIn');
                        this.$refs.sendOpus.classList.add('fadeOut');
                    }else {
                        this.$refs.sendOpus.classList.remove('fadeOut');
                        this.$refs.sendOpus.classList.add('fadeIn');
                    }
                    setTimeout(()=> {
                        scrollTop = scrollBeforeTop;
                    }, 0);
                })
            },
            getSonInfo(info){
                if(info==0){
                    this.$refs.container.style.overflowY='hidden';

                }else if(info==1){
                    this.$refs.container.style.overflowY='auto';

                }else{
                    this.$nextTick(function(){
                        this.classId=info;
                        this.getOpusData();
                    })
                }
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
             * @description: 跳转上传页面
             *
             * @update: cxy (2017-04-17)
             */
            uploadFile(obj){
                this.$router.push({path: '/app/opus/add', query: {tid: this.tid,studentName:obj.studentName,studentId:obj.studentId}})
            },
            /*
             * @description: 上传今日作品
             *
             * @update: cxy (2017-04-17)
             */
            send(){
                const that = this;
                let params={
                    classId:that.classId,
                    opusId:that.tid
                }
                let response = API.getOpusSubmit(params);
                response.then((res)=> {
                    if (res.code === 200) {
                        that.msg = '成功';
                        that.showToast();
                    } else {
                        that.msg = res.msg;
                        that.showToast();
                    }
                }).catch((err)=> {
                    that.msg = '网络异常,请稍后重试';
                    that.showToast();
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .container {
        width: 100%;
        height: 100%;
        position: relative;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
    }
    .upload{
        background: url("./images/upload.png");
        width:0.18rem;
        height:0.18rem;
        background-size: 0.18rem;
        position: absolute;
        right:0;
        top:0.48rem;
    }
    .unUpload{
        background: url("./images/unupload.png");
        width:0.18rem;
        height:0.18rem;
        background-size: 0.18rem;
        position: absolute;
        right:0;
        top:0.48rem;
    }

    .title {
        margin-top: 0.12rem;
        margin-left: 0.12rem;
        margin-right: 0.12rem;
    }

    .title input {
        width: 100%;
        font-size: 0.15rem;
        margin-bottom: 0.09rem;
        color: #353840;
        border: none;
        outline: none;
    }

    .titleText {
        font-size: 0.13rem;
        color: #797f8d;
        margin-bottom: 0.06rem;
    }

    .blueBorder {
        background: #eff3f6;
        width: 3.5rem;
        height: 0.01rem;
    }

    .studentList {
        margin-bottom:1rem;
    }

    .studentList ul {
        margin: 0 0.28rem;
        overflow: hidden;
    }

    .studentList li {
        margin-top: 0.23rem;
        float: left;
        position: relative;
    }

    .studentPhoto {
        border: 0.01rem solid #ebebeb;
        width: 0.64rem;
        height: 0.64rem;
        border-radius: 100%;
        display: block;
    }

    .studentName {
        width:0.64rem;
        font-size: 0.15rem;
        text-align: center;
        color: #626979;
        display:block;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
    }

    .studentOpus {
        font-size: 0.13rem;
        color: #aaafb9;
    }

    .studentOpusCount {
        font-size: 0.13rem;
        color: #5a99f5;
    }

    .sendOpus {
        position: fixed;
        bottom: 0.12rem;
        left: 0;
        right: 0;
        margin: 0 auto;
        background: #cdd2db;
        border-radius: 1rem;
        width: 1.98rem;
        height: 0.44rem;
        font-size: 0.16rem;
        color: #ffffff;
    }
    .fadeIn{
        -webkit-animation: fadeIn 0.5s;
        -webkit-animation-fill-mode:forwards
    }
    .fadeOut{
        -webkit-animation: fadeout 0.5s;
        -webkit-animation-fill-mode:forwards
    }
    @-webkit-keyframes fadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
    @-webkit-keyframes fadeout {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
    .studentDefaultWrap{
        background: #d8d8d8;
        border: 0.01rem solid #ebebeb;
        width: 0.64rem;
        height: 0.64rem;
        border-radius: 100%;
    }
    .photoWrap{
        border: 0.02rem solid #eaeef2;
        border-radius: 0.06rem;
        width: 0.48rem;
        height: 0.48rem;
    }
    .normal{
        border-radius: 0;
    }

</style>
