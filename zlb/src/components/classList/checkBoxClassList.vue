<template>
    <div>
        <div class="classSelect" flex="main:center cross:center" @click="showClass">
            <div flex="cross:center">
                <div class="classNameShow" v-text="classNameShow"></div>
            </div>
            <img src="./images/blueTriangle.png" class="blueTriangle" ref="blueTriangle"/>
        </div>
        <div class="blackWrap" v-if="wrapShow">
            <div class="classList">
                <ul>
                    <li flex="cross:center main:justify" v-for="(classItem,index) in classes" :class="{focus:classItem.focus}" @click="chooseClass(classItem.tid,index,classItem.tname)">
                        <div flex="cross:center">
                            <div class="checkBox" :class="{checkBox_focus:classItem.focus}"></div>
                            <img :src="classItem.teamPicUrl+'?imageView2/0/w/80/format/jpeg'" v-if="classItem.teamPicUrl!=''"/>
                            <div  class="photoWrap" v-if="classItem.teamPicUrl==''" flex-box="0">
                                <avatar :userId="classItem.tid" :userName="classItem.tname"  class="normal"></avatar>
                            </div>
                            <div class="className" v-text="classItem.tname"></div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="finishWrap" @click="hideWrap">完成</div>
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
                classNameShow:'选择接收班级',
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
                            e.focus=false;
                            if (res.rs.length == 1) {
                                that.classId = e.tid;
                                that.classNameShow = arr[0].tname;
                            }
                            if (that.classId!='' && that.classId == e.tid) {
                                that.classNameShow = e.tname;
                            }
                        })
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
             * @description: 切换班级
             *
             * @update: cxy (2017-04-17)
             */
            chooseClass(tid,index,tname){
                if(this.classNameShow=='选择接收班级'){
                    this.classNameShow=this.classNameShow.replace('选择接收班级','')
                }
                if(this.classes[index].focus){
                    this.classNameShow=this.classNameShow.replace(tname+';','')
                    this.classes[index].focus=false;
                    if(this.classNameShow==''){
                        this.classNameShow='选择接收班级'
                    }
                }else{
                    this.classNameShow=this.classNameShow+tname+';'
                    this.classes[index].focus=true;
                }
            }
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
    .checkBox{
        background: url("./images/check.png") no-repeat ;
        background-size: contain;
        width:0.17rem;
        height:0.17rem;
        margin-right:0.11rem;
    }
    .checkBox_focus{
        background: url("./images/checked.png") no-repeat !important;
        background-size: contain !important;
        width:0.17rem !important;
        height:0.17rem !important;
        margin-right:0.11rem !important;
    }
    .classNameShow{
        width:2.8rem;
        height:0.24rem;
        overflow: hidden;
        font-size:0.16rem;
        color:#5a99f5;
        text-align: center;
    }
    .className{
        font-size:0.17rem;
        margin-left:0.1rem;
        color:#b7bcbe;
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
        border-radius: 0 !important;
    }
    .finishWrap{
        background: #fff;
        height:0.5rem;
        line-height: 0.5rem;
        text-align: center;
        font-size: 0.17rem;
        color: #b7bcbe;
    }
</style>
