<template>
    <transition name="changeView">
    <div class="container">
        <div class="wrapper" ref="wrapper">
            <ul class="classList" :class="{'noScroll':!isScroll}">
                <li class="classItem" v-for="(classItem,classIndex) in classList">
                    <div class="topPart" flex="main:justify cross:center" @click="showStudent(classIndex)">
                        <div class="topLeftPart" flex-box="0" flex="cross:center">
                            <span class="label" :class="{'checked':classItem.isChecked}" flex-box="0" @click.stop="checkClass(classIndex)"></span>
                            <div class="imgWrapper" flex-box="0">
                                <!--<img src="">-->
                                <img src="./images/defaultClass.png">
                            </div>
                            <div class="className" v-text="classItem.tname" v-if="classItem.tname&&classItem.tname.length<=13"></div>
                            <marquee class="className" direction="left" flex-box="0" flex="cross:center"
                                     behavior="scroll" scrollamount="3" scrolldelay="0" loop="-1"
                                     v-text="classItem.tname"
                                     v-if="classItem.tname&&classItem.tname.length>13"></marquee>
                        </div>
                        <div class="topRightPart" :class="{'topRightPartSlide':classItem.isSlide}" flex-box="0"
                             v-if="classItem.list&&classItem.list.length>0"></div>
                    </div>
                    <transition name="fade">
                        <div class="bottomPart" v-if="classItem.isSlide&&classItem.list&&classItem.list.length>0">
                            <ul class="studentList">
                                <li class="studentItem" v-for="(studentItem,studentIndex) in classItem.list"
                                    @click="checkStudent(classIndex,studentIndex)">
                                    <div class="imgWrapper">
                                        <img :src="studentItem.photoUrl" v-if="studentItem.photoUrl">
                                        <avatar v-if="!studentItem.photoUrl" :userId="studentItem.studentId"
                                                :userName="studentItem.studentName"></avatar>
                                        <div class="cover" flex="main:center cross:center" v-if="studentItem.isChecked">
                                            <span class="checked"></span>
                                        </div>
                                    </div>
                                    <marquee class="studentName" direction="left" flex-box="0" flex="cross:center"
                                             behavior="scroll" scrollamount="3" scrolldelay="0" loop="-1"
                                             v-text="studentItem.studentName"
                                             v-if="studentItem.studentName&&studentItem.studentName.length>5"></marquee>
                                    <p class="studentName" flex="main:center cross:center"
                                       v-if="studentItem.studentName&&studentItem.studentName.length<=5"
                                       v-text="studentItem.studentName"></p>
                                </li>
                            </ul>
                        </div>
                    </transition>
                </li>
            </ul>
        </div>
        <transition name="btn">
            <mu-raised-button label="确定" class="demo-raised-button myBtn" v-if="btnShow" @click="addClassData"/>
        </transition>
    </div>
    </transition>
</template>
<script type="text/babel">
    import api from '../../api/api.js'
    import avatar from '../../components/defaultAvatar.vue'
    const API = new api();
    export default{
        data(){
            return {
                classList: [],
                btnShow:true,
                isScroll:false
            }
        },
        mounted(){
            this.getGroupStudent();
        },
        components: {
            avatar
        },
        computed: {},
        methods: {
            addClassData(){
                this.$emit('addClassData')
            },
            /*
             * @description: 选择班级
             *
             * @update: lwq (2017-05-19)
             */

            checkClass(classIndex){
                if (this.classList[classIndex].list) {
                    let isAllChecked = true;
                    this.classList[classIndex].list.forEach((el) => {
                        if (!el.isChecked) {
                            isAllChecked=false;
                            return;
                        }
                    });
                    if(isAllChecked){
                        this.classList[classIndex].isChecked=false;
                        this.classList[classIndex].list.forEach((el) => {
                            el.isChecked=false;
                        });
                    }else{
                        this.classList[classIndex].isChecked=true;
                        this.classList[classIndex].list.forEach((el) => {
                            el.isChecked=true;
                        });
                    }
                }
            },
            /*
             * @description: 选择个人
             *
             * @update: lwq (2017-05-19)
             */
            checkStudent(classIndex, studentIndex){
                this.classList[classIndex].list[studentIndex].isChecked=!this.classList[classIndex].list[studentIndex].isChecked;
                let isAllChecked = true;
                this.classList[classIndex].list.forEach((el) => {
                    if (!el.isChecked) {
                        isAllChecked=false;
                        return;
                    }
                });
                if(isAllChecked){
                    this.classList[classIndex].isChecked=true;
                }else{
                    this.classList[classIndex].isChecked=false;
                }
            },
            showStudent(index){
                this.classList[index].isSlide = !this.classList[index].isSlide
            },
            getGroupStudent(){
                let param = {
                    appCode: 'APP_NOTICE'
                };
                API.getGroupStudent().then((res) => {
                    let {code, rs} = res;
                    if (code == 200) {
                        rs.forEach((el) => {
                            el.isSlide = false;
                            el.isChecked = false;
                            if (el.list) {
                                el.list.forEach((oEl) => {
                                    oEl.isChecked = false;
                                })
                            }
                        });
                        this.classList = rs;
                        this.$nextTick(function () {
                            this.regScrollEvent();
                        });
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
                let deviceWidth = document.documentElement.clientWidth;
                this.$refs.wrapper.onscroll = (()=> {
                    scrollBeforeTop = this.$refs.wrapper.scrollTop;
                    if(scrollBeforeTop>deviceWidth *0.74/ 3.75){
                        this.isScroll=true;
                    }else{
                        this.isScroll=false;
                    }
                    if (scrollTop <= scrollBeforeTop) {
                        this.btnShow=false;
                    }else {
                        this.btnShow=true;
                    }
                    setTimeout(()=> {
                        scrollTop = scrollBeforeTop;
                    }, 0);
                })
            },
        }
    }
</script>
<style scoped>
    .myBtn{
        width: 2rem;
        height: 0.44rem;
        color:#fff;
        position: absolute;
        bottom: 0.15rem;
        left:0;
        right:0;
        margin: auto;
        border-radius: 1rem;
        background:#67a5ff;
        z-index: 111;
    }
    .fade-enter {
        opacity: 0
    }

    .fade-enter-active {
        transition: opacity .5s
    }
    .btn-leave {
        opacity: 1
    }
    .btn-leave-active{
        transition: opacity .5s
    }
    .btn-enter {
        opacity: 0
    }

    .btn-enter-active {
        transition: opacity .5s
    }
    /**/
    .changeView-enter-active, .changeView-leave-active {
        transition: all .3s;
        -webkit-transform: translate3d(0, 0, 0);
        -moz-transform: translate3d(0, 0, 0);
        -ms-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        -ms-backface-visibility: hidden;
        backface-visibility: hidden;
        -webkit-perspective:1000;
        -moz-perspective: 1000;
        -ms-perspective: 1000;
        perspective: 1000;
    }
    .changeView-enter, .changeView-leave-to {
        -webkit-transform: scale(1.5);
        -moz-transform: scale(1.5);
        -ms-transform: scale(1.5);
        -o-transform: scale(1.5);
        transform: scale(1.5);
        opacity: 0;
    }
    .container {
        position: absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        z-index: 111;
        background: #fff;
    }

    .wrapper {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        z-index: 111;
        -webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
    }

    .classList {

    }
    .noScroll{
        padding-bottom: 0.74rem;
    }
    .classItem {
        width: 100%;
    }

    .topPart {
        width: 100%;
        height: 0.72rem;
        padding: 0 0.12rem;
    }

    .topLeftPart .label {
        width: 0.2rem;
        height: 0.2rem;
        background: url('./images/check.png') no-repeat center center/contain;
    }
    .topLeftPart .checked {
        background: url('./images/checked.png') no-repeat center center/contain !important;
    }

    .topLeftPart .imgWrapper {
        border: 0.02rem solid #67a5ff;
        border-radius: 0.06rem;
        width: 0.52rem;
        height: 0.52rem;
        margin: 0 0.12rem;
        overflow: hidden;
    }

    .topLeftPart .imgWrapper img {
        display: block;
        height: 100%;
        width: 100%;
        -o-object-fit: cover;
        object-fit: cover;
    }

    .topLeftPart .className {
        font-size: 0.17rem;
        color: #b7bcbe;
    }

    .topRightPart {
        width: 0.16rem;
        height: 0.08rem;
        background: url('./images/slide.png') no-repeat center center/contain;
    }

    .topRightPartSlide {
        -ms-transform: rotate(180deg);
        -moz-transform: rotate(180deg);
        -webkit-transform: rotate(180deg);
        -o-transform: rotate(180deg);
        transform: rotate(180deg);
    }

    .bottomPart {
        padding-left: 0.22rem;
        padding-bottom: 0.12rem;
    }

    .bottomPart .studentList {
        overflow: hidden;
    }

    .bottomPart .studentList .studentItem {
        width: 0.84rem;
        float: left;
        margin-top: 0.12rem;
    }

    .bottomPart .studentList .studentItem .imgWrapper {
        height: 0.4rem;
        width: 0.4rem;
        overflow: hidden;
        border-radius: 50%;
        margin: 0 auto;
        position: relative;
    }

    .bottomPart .studentList .studentItem .imgWrapper img {
        width: 100%;
        height: 100%;
        -o-object-fit: cover;
        object-fit: cover;
    }

    .bottomPart .studentList .studentItem .imgWrapper .cover {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        position: absolute;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 50%;
    }

    .bottomPart .studentList .studentItem .imgWrapper .cover .checked {
        height:0.15rem;
        width: 0.15rem;
        background: url("./images/checkStudent.png") no-repeat center center/contain;
    }

    .bottomPart .studentList .studentItem .studentName {
        font-size: 0.14rem;
        color: #6c7381;
        margin: 0 0.05rem;
    }
</style>
