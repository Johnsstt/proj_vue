<template>
    <div class="studentList">
        <ul>
            <li v-for="(student,index) in studentList"
                :style="{marginLeft:(index+2)%3==0?0.62+'rem':'',marginRight:(index+2)%3==0?0.62+'rem':''}" @click="checkInfo(student)">
                <img :src="student.photoUrl" class="studentPhoto" v-if="student.photoUrl!=''"/>
                <div class="studentDefaultWrap" v-if="student.photoUrl==''">
                    <avatar :userId="student.studentId" :userName="student.studentName"></avatar>
                </div>
                <div class="studentName" flex="main:center" v-text="student.studentName"></div>
                <div class="studentOpus" flex="main:center">作品：
                    <div class="studentOpusCount" v-text="student.infoMap.pices.length"></div>
                </div>
            </li>
        </ul>
        <mu-toast v-if="toast" :message="msg" @close="hideToast"/>
    </div>
</template>

<script type="text/babel">
    import api from '../../../api/api.js'
    import avatar from '../../../components/defaultAvatar.vue'
    const API = new api();
    export default{
        data(){
            return{
                studentList: [],
                msg: '',
                toast: false,
                opusId:this.$route.query.opusId
            }
        },
        components:{
            avatar
        },
        mounted(){
            this.$nextTick(function(){
                this.getData();
            })
        },
        methods:{
            /*
             * @description: 客户端头部初始化
             *
             * @update: cxy (2017-03-07)
             */
            propsTitle(){
                //TODO:客户端读取标题信息
                util.JsBridge('propsTitle', {
                    title:util.toUniCode('今日作品'),
                    color: '#67a5ff'
                }, (res)=> {
                })
            },

            /*
             * @description: 获取学生列表数据
             *
             * @update: cxy (2017-04-17)
             */
            getData(){
                let param = {
                    opusId: this.opusId
                };
                API.getOpusStudentList(param).then(res=> {
                    let {code,rs}=res;
                if (code == 200) {
                    rs.opus.list.map((e)=>{
                        e.infoMap.pices=JSON.parse(e.infoMap.pices)
                    })
                    this.studentList=rs.opus.list
                } else {
                    this.msg = res.msg;
                    this.showToast();
                }
                this.$nextTick(function(){
                    this.propsTitle();
                })
            });
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
             * @description: 查看学员详情
             *
             * @update: cxy (2017-04-17)
             */
            checkInfo(){

            }

        }
    }
</script>

<style scoped>
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
</style>