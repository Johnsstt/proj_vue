<template>
	<div class="list">
		<p v-html="title"></p>
		<ul>
			<li><a href="#/base">基本信息</a></li>
			<li><a href="#/job">求职意向</a></li>
			<li><a href="#/edu">教育经历</a></li>
			<li><a href="#/work">工作经验</a></li>
			<li><a href="#/proj">项目经验</a></li>
			<li><a href="#/extra">完善信息</a></li>
			<li><a href="#/tech">擅长技能</a></li>
			
			<li><a href="#/allJobs">职位选择</a></li>
			<li><a href="#/city">城市选择</a></li>
			<li><a href="#/editList">简历编辑列表</a></li>
			<li><a href="#/preview">简历预览</a></li>

		</ul>
	</div>
</template>

<style>
	body {background: #fff;}
	.list p{ 
		margin-top: 14px;
		margin-left: 12px; 
		font-size: 18px;
		color: #f60;
	}
	.list ul {margin:0;padding:0;}
	.list ul li{
		list-style: none; margin:0;padding:12px;
		border-bottom: 1px solid #EBEBEB!important;border-bottom: #ccc;
	}
	.list ul li a{text-decoration: none;font-size: 16px; color:#333;}
</style>

<script>
	import api from 'api/api';
	var API =  new api()
	export default {
		data() {
			return {
				title: '淘工作'
			}
		},
		methods: {
			getDetail: function() {
				var params ={
					id: 52730
				}
				API.getUserInfo(params).then(function(res) {
					console.log('获取到详情的数据是：', res);
				});
			},
			saveHopeJob: function() {
				var params = {					
					hopeJobFirst:'运营',
					hopeJobFirstId:108002,
					hopeJobSecondId:108002003,
					hopeJobSecond:'店铺运营',
					workQuality:1,
					hopeSalaryMin:20000,
					hopeSalaryMax:999999,
					hopeProvince:'浙江',
					hopeCity:'杭州',
					workStatus:4,
					id:52730,
				};
				API.saveHopeJob(params).then(function(res){
					console.log('得到的值是：', res);
				})
			}
		}
	}
</script>