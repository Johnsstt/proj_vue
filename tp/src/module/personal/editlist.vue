<template>
    <div class="taopin-editlist-page">
        <!-- 基本信息 -->
        <div class="editlist-card base-info">

            <p class="editlist-top">
                <span class="title fl">
                    <em class="bs"></em>
                    基本信息
                    
                </span>
                <span class="edit fr" @click="addInfoItem('base')">编辑</span>
            </p>
            <div class="editlist-con">
                <div class="base-avatar">
                    <img src="https://gw.alicdn.com/tfs/TB1VQrBawMPMeJjy1XcXXXpppXa-300-300.png" v-if="baseInfo.sex == 1"/>
                    <img src="https://gw.alicdn.com/tfs/TB1vbbzawoQMeJjy0FnXXb8gFXa-300-300.png" v-if="baseInfo.sex == 2"/>
                    <img src="https://gw.alicdn.com/tfs/TB1GcDtaDZRMeJjSsplXXXeqXXa-300-300.png" v-if="baseInfo.sex !== 2 || baseInfo.sex !== 1"/>
                </div>
                <div class="base-info-desc fl">
                    <p>
                        <span class="name" v-text="baseInfo.fullName"></span>
                        <em class="un_1" v-if="baseInfo.sex == 1"></em>
                        <em class="un_2" v-if="baseInfo.sex == 2"></em>
                    </p>
                    <p class="extra">
                        <span v-text="baseInfo.birthday"></span><em class="spt"></em> 
                        <span v-text="baseInfo.workYears"></span><em class="spt"></em>
                        <span v-text="baseInfo.degree"></span>
                    </p>
                    <p class="mobile">{{baseInfo.mobile}}</p>
                </div>                
            </div>
        </div>
        <!-- 求职意向 -->
        <div class="editlist-card hope-job">
            <p class="editlist-top">
                <span class="title fl"><em class="bs"></em>求职意向<em v-if="baseInfo.workStatus" class="base-info-status">{{baseInfo.workStatus}}</em></span>
                <span class="edit fr" @click="addInfoItem('job')">编辑</span>
            </p>
            <div class="editlist-con">
                <div class="hope-job-info">
                    <span v-text="hopeJob.post">资深运营</span><em class="bias">/</em>
                    <span v-text="hopeJob.salary">10k-20k</span><em class="bias">/</em>
                    <span v-text="hopeJob.adr">上海</span><em class="bias">/</em>
                    <span v-text="hopeJob.quality">全职</span>
                </div>
            </div>
        </div>
        <!-- 工作经历 -->
        <div class="editlist-card hope-job" v-if="works.length">
            <p class="editlist-top">
                <span class="title fl"><em class="bs"></em>工作经历</span>
                <span class="edit fr" @click="addInfoItem('work')">编辑</span>
            </p>
            <div class="editlist-con work-record">
                <div class="record-item" v-for="(item, index) in works">
                    <div class="record-cpy">
                        <span class="name fl">{{item.companyName}}</span>
                        <span class="date fr">{{item.startDate}} - {{item.endDate}}</span>
                    </div>
                    <div class="record-post">
                        <span class="name">{{item.hodPost}}</span>
                    </div>
                    <div class="record-con">
                        {{item.workDescribe}}
                    </div>
                </div>                
            </div>
        </div>
        <div class="editlist-card hope-job" v-if="!works.length">
            <p class="editlist-top">
                <span class="title fl"><em class="bs"></em>工作经历</span>
            </p>
            <div class="module-info-add">
                <a href="javascript:" @click="addInfoItem('work')">
                    添加工作经历
                </a>
            </div>
        </div>

        <!-- 项目经验 -->
        <div class="editlist-card hope-job" v-if="projects.length">
            <p class="editlist-top">
                <span class="title fl"><em class="bs"></em>项目经验</span>
                <span class="edit fr" @click="addInfoItem('proj')">编辑</span>
            </p>
            <div class="editlist-con work-record">
                <div class="record-item" v-for="(item, index) in projects">
                    <div class="record-cpy">
                        <span class="name fl">{{item.projectName}}</span>
                        <span class="date fr">{{item.startDate}} - {{item.endDate}}</span>
                    </div>
                    <div class="record-post">
                        <span class="name">{{item.projectDuty}}</span>
                    </div>
                    <div class="record-con">
                        {{item.projectDescribe}}
                    </div>
                </div>                
            </div>
        </div>
        <div class="editlist-card hope-job" v-if="!projects.length">
            <p class="editlist-top">
                <span class="title fl"><em class="bs"></em>项目经验</span>
            </p>
            <div class="module-info-add">
                <a href="javascript:" @click="addInfoItem('proj')">
                    添加项目经验
                </a>
            </div>
        </div>
        <!-- 教育经历 -->
        <div class="editlist-card hope-job" v-if="edu.length">
            <p class="editlist-top">
                <span class="title fl"><em class="bs"></em>教育经历</span>
                <span class="edit fr" @click="addInfoItem('edu')">编辑</span>
            </p>
            <div class="editlist-con work-record">
                <div class="record-item" v-for="(item, index) in edu">
                    <div class="record-cpy">
                        <span class="name fl">{{item.schoolName}}</span>
                        <span class="date fr">{{item.startDate}} - {{item.endDate}}</span>
                    </div>
                    <div class="record-post">
                        <span class="name">{{item.degree}}</span>
                    </div>
                    <div class="record-con">
                        {{item.profession}}
                    </div>
                </div>           
            </div>
        </div>
        <div class="editlist-card hope-job" v-if="!edu.length">
            <p class="editlist-top">
                <span class="title fl"><em class="bs"></em>教育经历</span>
            </p>
            <div class="module-info-add">
                <a href="javascript:" @click="addInfoItem('edu')">
                    添加教育经历
                </a>
            </div>
        </div>


        <!-- 职业技能 -->
        <div class="editlist-card hope-job" v-if="techniques.length">
            <p class="editlist-top">
                <span class="title fl"><em class="bs"></em>职业技能</span>
                <span class="edit fr" @click="addInfoItem('tech')">编辑</span>
            </p>
            <div class="editlist-con">
                <div class="tech-tag">
                    <span v-for="(item, index) in techniques">{{item.technique}}</span>
                </div>
            </div>
        </div>
        <div class="editlist-card hope-job" v-if="!techniques.length">
            <p class="editlist-top">
                <span class="title fl"><em class="bs"></em>职业技能</span>
            </p>
            <div class="module-info-add">
                <a href="javascript:" @click="addInfoItem('tech')">
                    添加职业技能
                </a>
            </div>
        </div>

        <!-- 自我介绍 -->
        <div class="editlist-card hope-job" v-if="selfAppraisal">
            <p class="editlist-top">
                <span class="title fl"><em class="bs"></em>自我介绍</span>
                <span class="edit fr" @click="addInfoItem('self')">编辑</span>
            </p>
            <div class="editlist-con">
                <div>{{ selfAppraisal }}</div>
            </div>
        </div>
        <div class="editlist-card hope-job" v-if="!selfAppraisal">
            <p class="editlist-top">
                <span class="title fl"><em class="bs"></em>自我介绍</span>
            </p>
            <div class="module-info-add">
                <a href="javascript:" @click="addInfoItem('self')">
                    添加自我介绍
                </a>
            </div>
        </div>

        <div class="btn-step btn-step4" >
            <a href="javascript:" class="perfect-btn" @click="previewInfo">简历预览</a>
            <a href="javascript:" class="finish-btn" @click="findJob">去找工作</a>
        </div>

    </div>
</template>



<script>
    import Vue from 'vue'
    import './style/layout.css'
    import { ToastPlugin } from 'vux'
    import api from 'api/api'
    var API = new api();
    Vue.use(ToastPlugin)

    export default {
        data() {
            return {
                baseInfo: '',
                hopeJob: '',
                edu: [], //教育经历
                works: [],  //工作经验
                projects: [], //项目经验
                techniques: [], //技能标签                
                selfAppraisal: '', //自我介绍
                qualityList: []
            }
        },   
        activated: function() {
            this.initPageData();
        },     
        methods: {
            previewInfo: function() {
                var uid = this.$route.query.resumeId;
                location.href="#/preview?resumeId=" + uid;
            },
            findJob: function() {
                location.href="/mobile/job.htm"
            },
            addInfoItem: function(str) {
                var uid = this.$route.query.resumeId || '';
                var lid = localStorage.getItem('resumeId');
                var rid = uid || lid;
                if(str == 'tech' || str == 'extra') {
                    location.href = '#/'+str+'?resumeId='+rid+'&channel=editlist'
                }else {
                    location.href='#/'+str+'?resumeId=' + rid;                    
                }
            },            
            initPageData: function() {
                var that = this;
                var param = {
                    id: that.$route.query.resumeId || localStorage.getItem('resumeId')
                };
                API.getResumeDetail(param).then(function(res) {
                    var data = res.data;
                    if(data.success == true) {
                        var birDt;
                        var resData = data.data;
                        var workQuality, workStatus, years, minSalary, maxSalary, salary;
                        workQuality = that.qualityIdToTxt(resData.workQuality);
                        workStatus = that.workStatusIdToTxt(resData.workStatus);

                        birDt = resData.personalDO.birthday;
                        that.baseInfo = resData.personalDO;
                        that.baseInfo.birthday = Math.round(that.dateDiff(birDt)/364) + '岁';
                        that.baseInfo['workStatus'] = workStatus;
                        that.baseInfo['sex'] = resData.personalDO.sex;

                        // 工作年限处理
                        years = resData.personalDO.workYears;
                        if(years <= 0) {
                            that.baseInfo['workYears'] = '应届毕业生';
                        }else if(years >= 11) {
                            that.baseInfo['workYears'] = '10年以上';
                        }else {
                            that.baseInfo['workYears'] = years + '年';                            
                        }

                        //薪水处理
                        minSalary = resData.hopeSalaryMin;
                        maxSalary = resData.hopeSalaryMax;
                        if(minSalary>=0 && maxSalary <=3000) {
                            salary = '3k以下';
                        }else if(minSalary >= 20000 && maxSalary <= 999999) {
                            salary = '20k以上';
                        }else {
                            salary = minSalary/1000 +'k'+ '-'+ maxSalary/1000 + 'k';
                        }


                        

                        that.hopeJob = {
                            post: resData.hopeJobSecond,
                            salary: salary,
                            adr: resData.hopeCity,
                            quality: workQuality
                        }
                        that.edu = resData.educations;
                        that.works = resData.works;
                        that.selfAppraisal = resData.selfAppraisal;
                        that.techniques = resData.techniques;
                        that.projects = resData.projects;                
                    }
                });
            },
            qualityIdToTxt: function(id) {
                var resTxt;
                if(id == 1 || id == '1') {
                    resTxt = '全职';                    
                }
                if(id == 2 || id == '2') {
                    resTxt = '兼职'
                }
                if(id == 3 || id == '3') {
                    resTxt = '实习'
                }
                return resTxt;
            },
            workStatusIdToTxt: function(id) {
                var resTxt;
                if(id == 1 || id == '1') {
                    resTxt = '我目前已离职,可快速到岗';
                }
                if(id == 2 || id == '2') {
                    resTxt = '我目前在职,考虑换个新环境'
                }
                if(id == 3 || id == '3') {
                    resTxt = '我暂时不想找工作'
                }
                if(id == 4 || id == '4') {
                    resTxt = '我是应届毕业生'
                }
                return resTxt;
            },
            dateDiff: function(sDate){ 
            　　var sdate = new Date(sDate.replace(/-/g, "-")); 
            　　var now = new Date(); 
            　　var days = now.getTime() - sdate.getTime(); 
            　　var day = parseInt(days / (1000 * 60 * 60 * 24)); 
            　　return day;
            }
        }
    }
</script>

<style>
    body{ background: #EEEDF2;}
    a{text-decoration: none;color:#333;}      
</style>
<style scoped>
    body{
        background: #eee;
    }
    .taopin-editlist-page{
        width: 3.75rem;
        margin: 0 auto;
        margin-bottom: 0.8rem;
    }
    .fl {float: left;}
    .fr {float: right;}
    /*编辑信息共用卡片*/
    .editlist-card {
        background: #fff;
    }
    .editlist-card .editlist-top{
        height: .4rem;
        line-height: .4rem;
        border-bottom: 1px solid #eee;
        padding: 0 .15rem;
        position: relative;
    }
    .editlist-top .title {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333;
        position: relative;
    }
    .editlist-top .title em {
        display: inline-block;
    }
    .editlist-top .title .bs{
        width: .02rem;
        height: .14rem;
        background: #FF4D4D;
        position: relative;
        top: .03rem;
        margin-right: .1rem;
    }
    

    .editlist-top .edit {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #4B90EF;
    }
    .editlist-card .editlist-con{
        padding: .13rem .15rem;
        overflow: hidden;
    }
    /*基本信息*/
    .base-info-desc{
        padding-left: .12rem
    }

    .base-info .base-avatar{ 
        float:left; 
        width: .54rem; 
        height: .54rem; 
        border: 1px solid #eee; 
        border-radius: 100px;
        overflow: hidden;
    } 
    .base-info .base-avatar img { width: 100%; }
    
    .base-info-desc em {
        display: inline-block;
    }
    .base-info-desc .un_1{
        width: .11rem;
        height: .11rem;
        background:url('images/un_1.png') no-repeat;
        background-size: 100%;    
        margin-left: .08rem;    
    }
    .base-info-desc .un_2{
        width: .11rem;
        height: .11rem;
        background:url('images/un_2.png') no-repeat;     
        background-size: 100%;   
    } 

    .base-info-desc .name {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #333333;
        letter-spacing: 0.11px;
    }
    .base-info-desc .extra {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #B0B0B0;
    }
    .base-info-desc .extra .spt {
        display: inline-block;
        font-style: normal;
        width: .02rem;
        height: .07rem;
        background: #ccc;
        margin:0 .04rem;
    }
    .base-info-desc .mobile {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #B0B0B0;
    }
    .base-info-status {
        position: absolute;
        background: #eee;
        border-radius: 100px;
        width: 1.3rem;
        height: .28rem;
        line-height: .28rem;
        text-align: center;
        color: #333;
        font-style: normal;
        font-size: 12px;
        text-align: center;
        margin-top: 0.06rem;
        margin-left: 0.06rem;
        padding: 0 0.12rem;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    /*求职意向*/
    .hope-job {
        margin-top: .15rem;
    }
    .hope-job-info {
        margin-left: .12rem;
    }
    .hope-job-info span{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333;
    }
    .hope-job-info em{
        display: inline-block;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #ccc;
        letter-spacing: 0;
        line-height: 20px;
        margin: .03rem .08rem;
    }
    /*工作经历 && 项目经验*/
    .work-record { margin-left: .16rem; padding-top: 0!important; padding-bottom: 0!important;}
    .work-record .record-cpy { overflow: hidden; }
    .record-item { border-bottom: 1px dashed #ccc; padding: .08rem  0 .08rem 0;}
    .record-item:last-child{
        border:none;
    }
    .record-cpy .name {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333;
    }
    .record-cpy .date {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #333;
    }
    .work-record .record-post {}
    .record-post .name {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333;
    }
    .work-record .record-con {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #999;
        letter-spacing: 0;
        line-height: 24px;
    }

    /*职业技能*/
    .tech-tag {
        padding-left: .14rem;
    }
    .tech-tag span { 
        display: inline-block; 
        border: 1px solid #ccc; 
        border-radius: .03rem;
        color: #666;
        padding: .06rem .1rem;
        margin-top: .06rem;
        margin-right: .06rem;
    }

    .module-info-add {
        width: 100%;
        text-align: center;
    }
    .module-info-add a {
        display: inline-block;
        height: 70px;
        line-height: 70px;
        background: url(https://gw.alicdn.com/tfs/TB12oBYawoQMeJjy0FoXXcShVXa-20-18.png) left center no-repeat;
        padding-left: 24px;
        font-size: 14px;
        color:#4B90EF;
    }

</style>

