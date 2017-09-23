<template>
    <div class="taopin-preview-page">
    	<!-- 个人基本信息 -->
        <div class="preview-card base-info">
            <div class="base-avatar">
            	<img src="https://gw.alicdn.com/tfs/TB1VQrBawMPMeJjy1XcXXXpppXa-300-300.png" v-if="baseInfo.sex == 1"/>
            	<img src="https://gw.alicdn.com/tfs/TB1vbbzawoQMeJjy0FnXXb8gFXa-300-300.png" v-if="baseInfo.sex == 2"/>
            	<img src="https://gw.alicdn.com/tfs/TB1GcDtaDZRMeJjSsplXXXeqXXa-300-300.png" v-if="baseInfo.sex !== 2 || baseInfo.sex !== 1"/>
            </div>
            <div class="base-desc">
            	<div class="personal">
            		<span class="name">{{baseInfo.fullName}}</span>
            		<em class="ic"></em>
            		<span class="age">{{baseInfo.birthday}}岁</span>
            		<span class="degree">{{baseInfo.degree}}</span>
            		<span class="adr">{{baseInfo.city}}</span>
            	</div>
            	<div class="mobile">电话：{{baseInfo.mobile}}</div>
            	<div class="txt"> {{selfAppraisal}} </div>
            </div>
        </div>
        <!-- 期望工作 -->
        <div class="preview-card hope-job">
        	<div class="top">期望工作</div>
        	<div class="con hope-con">
        		<span class="post"><em></em>{{hopeJob.post}}</span>
        		<span class="salary"><em></em>{{hopeJob.salary}}</span>
        		<span class="adr"><em></em>{{hopeJob.adr}}</span>
        		<span class="property"><em></em>{{hopeJob.quality}}</span>
        	</div>
        </div>        

        <!-- 工作经历 -->
        <div class="preview-card exper">
        	<div class="top">工作经历</div>
        	<div class="con exper-list">

        		<div class="exper-item" v-for="(item, index) in works">
        			<span class="icon"></span>
        			<span class="time-lime"></span>
        			<div class="extra">
	        			<div class="cmy">
	        				<span class="name">{{item.companyName}}</span>
	        				<span class="time">{{item.startDate}} - {{item.endDate}}</span>
	        			</div>
	        			<div class="middle">
	        				<span class="post">{{item.hodPost}}</span>
	        			</div>
	        			<div class="txt">
	        				{{item.workDescribe}}
	        			</div>
        			</div>
        		</div>        		
        	</div>
        </div>

        <!-- 项目经历 -->
        <div class="preview-card exper">
        	<div class="top">项目经历</div>
        	<div class="con exper-list">
        		<div class="exper-item" v-for="(item, index) in projects">
        			<span class="icon"></span>
        			<span class="time-lime"></span>
        			<div class="extra">
	        			<div class="cmy">
	        				<span class="name">{{item.projectName}}</span>
	        				<span class="time">{{item.startDate}} - {{item.endDate}}</span>
	        			</div>
	        			<div class="middle">
	        				<span class="post">{{item.projectDuty}}</span>
	        			</div>
	        			<div class="txt">
	        				{{item.projectDescribe}}
	        			</div>
        			</div>
        		</div>        		
        	</div>
        </div>

        <!-- 教育经历 -->
        <div class="preview-card exper">
        	<div class="top">教育经历</div>
        	<div class="con exper-list">
        		<div class="exper-item" v-for="(item, index) in edu">
        			<span class="icon"></span>
        			<span class="time-lime"></span>
        			<div class="extra">
	        			<div class="cmy">
	        				<span class="name">{{item.schoolName}}</span>
	        				<span class="time">{{item.startDate}} - {{item.endDate}}</span>
	        			</div>
	        			<div class="middle">
	        				<span class="post">{{item.profession}}</span>
	        			</div>
	        			<!-- <div class="txt">
	        				{{item.projectDescribe}}
	        			</div> -->
        			</div>
        		</div>        		
        	</div>
        </div>

        <!-- 职业技能 -->
		<div class="preview-card nomt">
			<div class="top">职业技能</div>
			<div class="con">
				<div class="tech-tag">
					<span v-for="(item, index) in techniques">
						{{item.technique}}
					</span>					
				</div>
			</div>
		</div>

		<div class="btn-step btn-step4" >
            <a href="javascript:" class="perfect-btn" @click="editResumeInfo">返回修改简历</a>
            <a href="javascript:" class="finish-btn" @click="findJob">去找工作</a>
        </div>



    </div>
</template>



<script>
    import './style/layout.css'
    import api from 'api/api'
    var API = new api();

    export default {
        data() {
            return {
                baseInfo: '',
                hopeJob: '',
                edu: [], //教育经历
                works: [], //工作经历
                projects: [], //项目经验
                techniques: [], //技能标签
                selfAppraisal: '' //自我介绍
            }
        },    
    	mounted: function() {
    		this.initPagePrew();
    	},   
        methods: {
        	editResumeInfo: function() {
        		var uid = this.$route.query.resumeId;
        		location.href="#/editlist?resumeId=" + uid;
        	},
        	findJob: function() {
                location.href="/mobile/job.htm"
            },
            initPagePrew: function() {
            	var that = this;
            	var param = {
            		id: localStorage.getItem('resumeId') || this.$route.query.resumeId
            	};

            	API.getResumeDetail(param).then(function(res){
            		var resData;
            		var birDt;
            		var data = res.data;
            		if(data.success == true) {
            			if(data && data.data) {
            				var workQuality;
            				resData = data.data;
            				birDt = resData.personalDO.birthday;
            				that.baseInfo = resData.personalDO;
            				that.baseInfo.birthday = Math.round(that.dateDiff(birDt)/364);
            				that.intro = resData.selfAppraisal;

            				workQuality = that.qualityIdToTxt(resData.workQuality)

            				that.hopeJob = {
            					post: resData.hopeJobSecond,
	                            salary: resData.hopeSalary,
	                            adr: resData.hopeCity,
	                            quality: workQuality 
            				}


            				that.edu = resData.educations;
	                        that.works = resData.works;
	                        that.selfAppraisal = resData.selfAppraisal;
	                        that.techniques = resData.techniques;
	                        that.projects = resData.projects;   



            			}           			
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
	.nomt { margin-bottom: 0!important; }
	.taopin-preview-page {
		margin-bottom: 0.8rem;
	}
	.preview-card { background: #fff; }
	.base-info{ 
		padding: .17rem .13rem;
		overflow: hidden; 
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
	.base-info .base-desc{ margin-left: .68rem; }
	.base-info .base-desc .personal {
		font-family: PingFangSC-Regular;
		font-size: 16px;
		color: #333333;
		letter-spacing: 0;
	}
	.base-desc .personal .ic{
		display: inline-block;
		font-family: normal;
		width: .16rem;
		height: .16rem;
	}
	.base-desc .personal .age, 
	.base-desc .personal .degree, 
	.base-desc .personal .adr {
		font-family: PingFangSC-Regular;
		font-size: 12px;
		color: #999999;
		letter-spacing: 0;
	}
	.base-desc .mobile {
		font-family: PingFangSC-Regular;
		font-size: 12px;
		color: #498CF2;
		letter-spacing: 2px;
		margin: .05rem 0;
	}
	.base-desc .txt {
		font-family: PingFangSC-Regular;
		font-size: 12px;
		color: #999999;
		letter-spacing: 0;
	}

	.preview-card {
		margin-bottom: .1rem;
	}
	.preview-card .top {
		border-bottom: 1px solid #EEEEEE;
		font-family: PingFangSC-Regular;
		font-size: 14px;
		color: #333333;
		letter-spacing: 0;
		padding: 0 .13rem;
		height: .4rem;
		line-height: .4rem;
	}
	.preview-card .con {
		padding: .2rem .13rem;
	}

	/*期望工作*/
	.hope-job .hope-con {}
	.hope-job .hope-con span {
		display: inline-block;
		margin-right: .12rem;
	}
	.hope-job .hope-con span em {
		display: inline-block;
		font-style: normal;
		position: relative;
    	top: .02rem;
    	margin-right: .05rem;
    	width: .14rem;
		height: .14rem;
	}
	.hope-job .hope-con .post em{		
		background: url(https://gw.alicdn.com/tfs/TB1FS4ISVXXXXaMXVXXXXXXXXXX-28-28.png) no-repeat;
		background-size: 100%;
	}
	.hope-job .hope-con .salary em{
		background: url(https://gw.alicdn.com/tfs/TB1PKpKSVXXXXakXVXXXXXXXXXX-28-28.png) no-repeat;
		background-size: 100%;
	}
	.hope-job .hope-con .adr em{
		background: url(https://gw.alicdn.com/tfs/TB1VQRASVXXXXaoaXXXXXXXXXXX-28-28.png) no-repeat;
		background-size: 100%;
	}
	.hope-job .hope-con .property em{
		background: url(https://gw.alicdn.com/tfs/TB1aphnSVXXXXbWapXXXXXXXXXX-28-28.png) no-repeat;
		background-size: 100%;
	}

	/*工作经历 & 工作经验*/
	.exper-item {
		position: relative;
		padding-bottom: .2rem;
	}
	.exper-item .icon {
	    position: absolute;
	    width: .13rem;
	    height: .13rem;
	    background: url(https://gw.alicdn.com/tfs/TB1dFAHSFXXXXbBaXXXXXXXXXXX-26-27.png) no-repeat;
	    background-size: 100%;
	    top: 0.04rem;
	    left: -0.06rem;
	    z-index: 99;
	}
	.exper-item .extra {
		position: relative;
		padding-left: 0.15rem;		
		/*border-left: 1px solid #ccc;		*/
	}
	.exper-item .cmy { 
		/*width: 95%;
		height: .3rem;
		position: absolute;
		top: -0.03rem;*/
		overflow: hidden; 
	}
	.exper-item .cmy .name {
		font-family: PingFangSC-Regular;
		font-size: 14px;
		font-weight: 700;
		color: #333333;
		letter-spacing: 0;
		float: left;
	}
	.exper-item .cmy .time {
		font-family: PingFangSC-Regular;
		font-size: 12px;
		color: #666;
		letter-spacing: 0;
		float: right;
	}
	.exper-item .middle {
		position: relative;
	}
	.exper-item .middle .post {
		font-family: PingFangSC-Regular;
		font-size: 14px;
		font-weight: 700;				
		color: #333333;
		letter-spacing: 0;
	}
	.exper-item .txt {
		font-family: PingFangSC-Regular;
		font-size: 14px;
		color: #999999;
		line-height: 20px;
		padding: 0.1rem 0;
	}
	.exper-item .time-lime {
	    background: #F5F5F5;		
	    position: absolute;
	    content: ''; 
	    height: 100%;
	    width: 2px;
	    left: -1px;
	    top: 5px;
	    /*background-color: #FF9900;*/
	}
	.tech-tag { margin-top: -0.08rem; }
	.tech-tag span {
		display: inline-block;
		border: 1px solid #E4E4E4;
		border-radius: 3px;
		padding: 0.08rem 0.1rem;
		margin-right: 0.08rem;
		margin-top: 0.08rem;
	}
</style>

