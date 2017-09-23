<template>
    <div>
        <div class="classSelect" flex="main:center cross:center" @click="showClass">
            <div flex="cross:center">
                <img src="./images/classLogo.png" class="classLogo"/>
                <div class="classNameShow" v-text="classNameShow"></div>
            </div>
            <img src="./images/blueTriangle.png" class="blueTriangle" ref="blueTriangle"/>
        </div>
        <div class="blackWrap" v-if="wrapShow" @click="hideWrap">
            <div class="classList">
                <ul>
                    <li flex="cross:center main:justify" v-for="(classItem,index) in classes" :class="{focus:classIndex==index}" @click="changeClass(classItem.tid,index,classItem.tname)">
                        <div flex="cross:center">
                            <img :src="classItem.teamPicUrl+'?imageView2/0/w/80/format/jpeg'" v-if="classItem.teamPicUrl!=''"/>
                            <div  class="photoWrap" v-if="classItem.teamPicUrl==''" flex-box="0">
                                <avatar :userId="classItem.tid" :userName="classItem.tname"  class="normal"></avatar>
                            </div>
                            <div class="className" v-text="classItem.tname"></div>
                        </div>
                        <div class="changeClass" flex="main:right cross:center">
                            <div class="wrapCircle" flex="main:center cross:center">
                                <div class="innerCircle"></div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import api from '../../api/api.js'
    import {imagedomain} from '../../api/api.js'
    import classList from '../../components/classList/radioClassList.vue'
    import avatar from '../../components/defaultAvatar.vue'
    const API = new api();
    export default{
        data(){
            return {
                classId: this.$route.query.classId ? this.$route.query.classId : '',
                wrapShow:false,
                classNameShow:'',
                classIndex:0,
            }
        },
        mounted(){
            this.getUserClasses();
        },
        components:{
            avatar
        },
        props: ['parentInfo'],
        methods: {
            /*
             * @description: 客户端头部初始化
             *
             * @update: cxy (2017-04-13)
             */
            propsTitle(){
                //TODO:客户端读取标题信息
                util.JsBridge('propsTitle', {
                    title: util.toUniCode(this.parentInfo.title),
                    color: '#67a5ff'
                }, (res)=> {
                })
            },
            /*
             * @description: 获取页面数据
             *
             * @update: cxy (2017-04-17)
             */
            getUserClasses(){
                const that = this;
                const params = {
                    appCode: that.parentInfo.appCode
                }
                let response = API.getClassList(params);
                response.then((res)=> {
                    if (res.code === 200) {
                        res.rs.map((e, index, arr)=> {
                            if (res.rs.length == 1) {
                                that.classIndex = 0;
                                that.classId = e.tid;
                                that.classNameShow = arr[0].tname;
                            }
                            if (that.classId!='' && that.classId == e.tid) {
                                that.classIndex = index;
                                that.classNameShow = e.tname;
                            }
                        })
                        if(that.classId==''){
                            that.$emit('toParentComponent',res.rs[0].classId);
                            that.classNameShow = res.rs[0].tname;
                        }else{
                            that.$emit('toParentComponent',that.classId)
                        }
                        that.classes = res.rs;
                    } else {
                        that.msg = res.msg;
                        that.showToast();
                    }
                    that.$nextTick(function () {
                        that.propsTitle();
                    })
                })
            },
            /*
             * @description: 显示班级列表
             *
             * @update: cxy (2017-04-17)
             */
            showClass(){
                this.wrapShow = !this.wrapShow;
                if (this.wrapShow) {
                    this.$emit('toParentComponent',0)
                    this.$refs.blueTriangle.style.transform='rotate(0)'
                } else {
                    this.$emit('toParentComponent',1)
                    this.$refs.blueTriangle.style.transform='rotate(180deg)'
                }

            },
            /*
             * @description: 隐藏班级列表
             *
             * @update: cxy (2017-04-17)
             */
            hideWrap(){
                this.wrapShow = false;
                this.$emit('toParentComponent',1)
                this.$refs.blueTriangle.style.transform='rotate(180deg)'
            },
            /*
             * @description: 选择班级
             *
             * @update: cxy (2017-04-17)
             */
            changeClass(classId, index,className){
                this.classIndex = index;
                this.classId = classId;
                this.classNameShow=className;
                this.$emit('toParentComponent',this.classId)
            },
        }
    }
</script>
<style scoped>
    .blackWrap{
        width:100%;
        height:calc(100% - 0.47rem);
        background:rgba(0,0,0,.4);
        filter:alpha(opacity=40);
        position: absolute;
        top:0.47rem;
        left:0;
        width:100%;
        z-index:1000;
    }
    .blueTriangle{
        margin-right:0.21rem;
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg);
        position: absolute;
        right:0;
        top:0.14rem;
    }
    .classList li{
        background:#ffffff;
        width:100%;
        height:0.72rem;
        padding:0 0.12rem;
    }
    .classList img{
        border:0.02rem solid #eaeef2;
        border-radius:0.06rem;
        width:0.48rem;
        height:0.48rem;
    }
    .focus{
        width:100%;
        height:0.72rem;
        padding:0 0.12rem;
        background:#f1f7ff !important;
    }
    .focus img{
        border:0.01rem solid rgba(103,165,255,0.82);
        border-radius:0.06rem;
        width:0.48rem;
        height:0.48rem;
    }
    .focus .className{
        font-size:0.17rem;
        margin-left:0.1rem;
        color:#67a5ff;
    }
    .focus .wrapCircle{
        width:0.15rem;
        height:0.15rem;
        border-radius:100%;
        background:rgba(103,165,255,.3);
    }
    .focus .innerCircle{
        background:rgba(103,165,255,.7);
        width:0.07rem;
        height:0.07rem;
        border-radius:100%;
    }
    .classLogo{
        width:0.16rem;
        height:0.18rem;
        margin-right:0.06rem;
    }
    .classNameShow{
        font-size:0.16rem;
        color:#5a99f5;
    }
    .className{
        font-size:0.17rem;
        margin-left:0.1rem;
        color:#b7bcbe;
    }
    .changeClass{
        width:0.48rem;
        height:0.48rem;
    }
    .wrapCircle{
        background: rgba(182,189,199,.3);
        width:0.15rem;
        height:0.15rem;
        border-radius:100%;
    }
    .innerCircle{
        background: rgba(182,189,199,.7);
        width:0.07rem;
        height:0.07rem;
        border-radius:100%;
    }
    .classSelect {
        background: #f4f9ff;
        border-radius: 1rem;
        width: 3.51rem;
        height: 0.31rem;
        margin: 0.08rem auto;
        position: relative;
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
