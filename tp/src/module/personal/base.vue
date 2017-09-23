<template>
    <div class="tp-baseInfo-page">    	
    	<div class="taopin-top-banner">
    		<img src="https://gw.alicdn.com/tfs/TB17DNNXE6FK1Jjy1XaXXbafpXa-750-88.png"/>
    	</div>
    	
    	<div class="taopin-form-area">
	    	<div class="taopin-form-item">		       
	            <span class="label">姓名</span>
	            <div class="con">
	            	<input type="text" class="ipt" v-model="baseInfo.fullName" placeholder="请输入" />
	            </div>
	        </div>	

	        <div class="taopin-form-item">		       
	            <span class="label">
	                性别		                
	            </span>
	            <div class="radio-con">
	            	<div class="radio-tag">
		                <span v-for="(item, index) in sexList" :class="[baseInfo.sex == item.value ? 'act' : '']" v-text="item.label" @click="sltSexTag(item)" ></span>
	                </div>
	            </div>
	        </div>

	         <div class="taopin-form-item">	            
	            <group>
			    	<datetime v-model="vBirthday" :start-date="startDate" :end-date="endDate" @on-change="onBirthdaychange" :title="'出生年月'" placeholder="请选择"></datetime>
			    </group>	            
	         </div>

	         <div class="taopin-form-item">		       
	            <span class="label">现居城市</span>
	            <div class="con">
	            	<input v-model="baseInfo.city" type="text" class="ipt" @click="setCity" placeholder="请选择" />
	            </div>
	            <span class="arrow"></span>
	         </div>
	         <div class="taopin-form-item">	        
	         	<group>
	         		<popup-picker title="最高学历" :data="degreeList" v-model="vDegree" :columns="1" show-name placeholder="请选择" @on-shadow-change='onDegreeChange'></popup-picker>
	         	</group>
	         </div>	         	         

	        <!-- <popup-picker title="求职状态"  :data="workStatusList" v-model="vxStatus" :columns="1" show-name placeholder="请选择" @on-shadow-change='onStatusChange'></popup-picker> -->


	         <div class="taopin-form-item">	        
	         	<group>
	         		<popup-picker title="工作年限" :data="workList"  v-model="vWork" :columns="1" show-name placeholder="请选择"  @on-shadow-change='onWorkChange'></popup-picker>
	         		
	         	</group>
	         </div>
        </div>
		
        <div class="taopin-form-area mt14" v-if="!isBindMobile">
			<div class="taopin-form-item">		       
		        <span class="label">手机号码</span>
		        <div class="con">
		        	<input type="text" class="ipt" placeholder="请输入" v-model="baseInfo.mobile" />
		        </div>
		    </div>
		    <div class="taopin-form-item">		       
		        <span class="label">验证码</span>
		        <div class="code-con">
		        	<input type="text" class="ipt" v-model="baseInfo.code"/>
		        </div>

		        <span class="code-time">{{code.time}}s</span>
		        <span class="code-txt" v-if="code.isflg == true"  v-text="code.txt" @click="sendCode">获取验证码</span>
		        <span class="code-txt" v-if="!code.isflg"  v-text="code.txt">获取验证码</span>
		    </div>
	    </div>

	    <div class="taopin-form-area mt14" v-if="isBindMobile">
	    	<div class="taopin-form-item">		       
	            <span class="label">手机号码</span>
	            <div class="bind-con">
	            	<span><em v-text="mobile">18268030638</em>(已绑定)</span>
	            </div>
	        </div>
	    </div>

	    
	    
		<div class="btn-step">
			<a v-if="!isEdit" href="javascript:" class="act" @click="btnStep">
	    		下一步(<span>1</span>/<span>4</span>)
	    	</a>
	    	<a v-if="isEdit" href="javascript:" class="act" @click="btnStep" v-show="isChk">
	    		保存
	    	</a>
	    </div>  

    </div>
</template>


<script>
	import Vue from 'vue'
	import './style/layout.css'
	import api from 'api/api'
	import { Datetime, Group, Toast, ToastPlugin, PopupPicker } from 'vux'
	var Api = new api();
	var baseUrl = 'http://daily.imaijia.com';
	Vue.use(ToastPlugin)

	export default {
		data() {
			return {
				currentStep: 1,
				totalStep: 4,
				baseInfo: {
					fullName: '',
					degree: '',
					workYears: '',
					sex: '',
					province: '',
					city: '',
					mobile: '',
					birthday: '',
					code: '',
					id: '',
					profession: 1
				},
				vDegree: ['本科'],
				vWork: [],
				vBirthday: '1990-01',
				showWork: false,
				sexList: [
						{label: '男', value: 1}, 
						{label: '女', value: 2}
				],
				
				degreeList: [
					{name:'初中', value: '初中'},
					{name:'高中', value: '高中'},
					{name:'大专', value: '大专'},
					{name:'本科', value: '本科'},
					{name:'硕士', value: '硕士'},
					{name:'博士', value: '博士'}
				],
				workList: [
					{name:'应届毕业生', value:'0'},
					{name:'1年', value:'1'},
					{name:'2年', value:'2'},
					{name:'3年', value:'3'},
					{name:'4年', value:'4'},
					{name:'5年', value:'5'},
					{name:'6年', value:'6'},
					{name:'7年', value:'7'},
					{name:'8年', value:'8'},
					{name:'9年', value:'9'},
					{name:'10年', value:'10'},
					{name:'10年以上', value:'11'}
				],								
				code: {					
					txt: '获取验证码',
					time: 60,
					isflg: true
				},				
		        isChk: true,
		        startDate: '1900-11-11',
		        endDate: '2020-11-11',
		        isBindMobile: false,
		        isEdit: false,
		        mobile: ''		       
			}
		},
		components: {
		   Datetime,
		   Group,
		   Toast,
		   PopupPicker
		},		
		activated: function() {
			this.getCityName();
		},		
		mounted: function() {
			var uid = this.$route.query.resumeId || '';			
			this.getBaseInfo();		
			
			
			if(uid) {
				this.getResumeDetail();
				this.isEdit = true;
			}
		},
		methods: {
			
			sltSexTag: function(item) {
				this.baseInfo.sex = item.value;
			},			
			setCity: function() {
				// location.href = '#/city?channelUrl=' + encodeURIComponent(location.href);
				location.href = '#/city'
			},
			onBirthdaychange: function(value) {
				this.baseInfo.birthday = value;
			},				
			onDegreeChange: function(value, key) {
				this.baseInfo.degree = value[0];
			},	
			onWorkChange: function(value, key) {
				this.showWork = true;
				this.baseInfo.workYears = value[0];
			},			
			sendCode: function() {	
				var that = this;	
				var reg_tel = /^1(3|4|5|7|8)\d{9}$/;		
				var isflg = that.code.isflg;
				var param = {
					mobile: that.baseInfo.mobile,
					flag : 2
				};
				if(!param.mobile) {
					this.toast({text: '请填写手机号码'})
				}else if(!reg_tel.test(param.mobile)){
					this.toast({text: '请填写正确的手机号'})
				}else{
					that.countDown();
					if(isflg) {
						Api.getMobileCode(param).then(function(res){
							var data = res.data;
							if(data.code == 'B20110') {
								that.toast({text: data.desc});
								that.sendCode();
							}
							if(data.code == 'B20005') {

							}
						});
					}
				}
								
			},			
			countDown: function() {	
				var that = this;								
		        if (this.code.time == 0) {  
		            this.code.txt = '获取验证码'; 
		            this.code.time = 60;
		            this.code.isflg= true;		            
		        } else {		    	
	        		this.code.txt = '后重新获取';
		            this.code.time--;  
		            this.code.isflg = false;
		            setTimeout(function() {  
		                that.countDown()
		            }, 1000)		        	
		        }
			},
			btnStep: function() {
				var that = this;
				var uid = that.$route.query.resumeId || '';	
				var lid = localStorage.getItem('resumeId') || '';
				var channel = this.$route.query.channel;	
				if(that.filterForm() == true) {	
					that.baseInfo.id = uid || lid;
					that.baseInfo.birthday = new Date(that.baseInfo.birthday);
					that.baseInfo.workYears = parseInt(that.baseInfo.workYears);
					Api.saveBaseInfo(that.baseInfo).then(function(res) {
						var data = res.data;
						if(data.success == true) {
							if(data && data.data) {
								localStorage.setItem('resumeId', data.data);
							}
							if(uid) {
								location.href="#/editlist?resumeId=" + uid;
							}else{
								location.href="#/job"
							}

						} else {							
							that.toast({text: res.data.desc})
						}
					})
				}				
			},		
			getBaseInfo: function() {
				var that = this;
				var param = {};
				localStorage.removeItem('resumeId');
				Api.getBaseInfo(param).then(function(res){
					var data = res.data, isBindMobile ;
					if(data.success == true) {

						if(data && data.data) {
							var resData = data.data;	
							isBindMobile = resData.isBindMobile;
							if(isBindMobile == 1 || isBindMobile == '1') {
								that.isBindMobile = !that.isBindMobile;
							}
							that.isBindMobile = isBindMobile;						
							that.baseInfo.fullName = resData.fullName;
							that.baseInfo.sex = resData.sex;
							that.baseInfo.mobile = resData.mobile;						
							that.baseInfo.city = resData.city;
							that.baseInfo.workYears = resData.workYears;
							that.baseInfo.degree = resData.degree;

							that.vBirthday = resData.birthday;
							that.vDegree = [];
							that.vDegree = [resData.degree];
							that.vWork = [];						
							that.vWork = [''+resData.workYears+''];
							that.mobile = resData.mobile;
						}
					}else {
							if(data.code == 'B20005') {
								// location.href= baseUrl + '/mobile/login.htm?redirect_uri=' + encodeURIComponent(location.href) + ''
							}
					}
				});
			},	
			getResumeDetail: function() {
				var that = this;
				var uid = that.$route.query.resumeId || '';
				// var lid = localStorage.getItem('resumeId') || '';
				var param = {
					id: uid
				};
				Api.getResumeDetail(param).then(function(res){
					var data = res.data, personal, isBindMobile;
					if(data.success == true) {
						if(data && data.data) {
							var resData = data.data.personalDO;							
							isBindMobile = resData.isBindMobile;
							if(isBindMobile == 1 || isBindMobile == '1') {
								that.isBindMobile = !that.isBindMobile;
							}
							that.isBindMobile = isBindMobile;						
							that.baseInfo.fullName = resData.fullName;
							that.baseInfo.sex = resData.sex;
							that.baseInfo.mobile = resData.mobile;						
							that.baseInfo.city = resData.city;
							that.baseInfo.workYears = resData.workYears;
							that.baseInfo.degree = resData.degree;

							that.vBirthday = resData.birthday;
							that.vDegree = [];
							that.vDegree = [resData.degree];
							that.vWork = [];						
							that.vWork = [''+resData.workYears+''];
						}					
					}else{
						that.toast({text: data.desc});
					}										
				})
			},		
			workValToTxt: function(id) {
				var res;
				var that = this;
				that.workList[0].forEach(function(item, index){
					if(item.value == id) {
						res = item.name;
					}
				});
				return res;
			},	
			getCityName: function() {
				var that = this;
				var province, provinceId, city, cityId;
				province = localStorage.getItem('province');
				provinceId = localStorage.getItem('provinceId');
				city = localStorage.getItem('city');
				cityId = localStorage.getItem('cityId');
				that.baseInfo.province = province;
				that.baseInfo.city = city;
			},
			filterForm: function() {
				// var reg_name = /^[\u4e00-\u9fa5]*$/;
				var reg_name = /^[\u4e00-\u9fa5a-zA-Z]+$/;
				var reg_tel = /^1(3|4|5|7|8)\d{9}$/;
				var name = this.baseInfo.fullName;
				var sex = this.baseInfo.sex;
				var mobile = this.baseInfo.mobile;
				var birthday = this.vBirthday;
				var degree = this.vDegree;
				var workYears = this.vWork;

				if(!name) {
					this.toast({text: '请填写用户名'})
					return false;
				}else if(!reg_name.test(name)){
					this.toast({text: '用户名只能是中文或英文'})
					return false;
				}else if(name.length > 5) {
					this.toast({text: '用户名不能超过5个字符'})
					return false;
				}
				if(!sex) {
					this.toast({text: '请选择性别'})
					return false;
				}
				if(!birthday) {
					this.toast({text: '请选择出生日期'})
					return false;
				}
				if(!degree) {
					this.toast({text: '请选择学历'})
					return false;
				}
				if(!workYears) {
					this.toast({text: '请选择工作年限'})
					return false;
				}
				if(!mobile) {
					this.toast({text: '请填写手机号码'})
					return false;
				}else if(!reg_tel.test(mobile)){
					this.toast({text: '请填写正确的手机号'})
					return false;
				}
				return true;
			},
			toast: function(o) {
				this.$vux.toast.show({
					width: 80 + '%',
					type: o.type || 'text',
					text: o.text,
					time: o.time || 2000,
					position: 'middle'
				})
			}

			
		}
	}
</script>

<style>
	body{ background: #EEEDF2;}	
</style>
<style>
	.tp-baseInfo-page {height:100%;}
	.bind-con span { display: inline-block; padding-right: 12px; }
	.bind-con span em {
		font-style: normal;
	}
	.vux-datetime p {
		font-family: PingFangSC-Regular;
		font-size: 14px;
		color: #333333;
		letter-spacing: 0;
		min-width: .56rem;
	}
	.weui-cell { padding-left: 0!important; }
	.vux-no-group-title {
		margin: 0!important;
	}
	.weui-cell__ft {
		text-align: left!important;
		font-family: PingFangSC-Regular;
	    font-size: 14px;
	    color: #333333;
	    letter-spacing: 0;
	    padding-left: 0.16rem!important;
	}
	.weui-cells:before {
		border: none!important;
	}
	.weui-cells:after {
		border: none!important;
	}
</style>


