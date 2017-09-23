<template>
    <div class="taopin-city-page">

        <div class="city-gps">
        	<p class="title"><em></em><span>GPS定位的城市</span></p>
        	<span class="text" @click="sltGpsCity" v-html="crtCity">全国</span>
        </div>

        <div class="area-hot">
        	<span class="area-hot-title">热门地区</span>
        	<ul class="area-hot-list">
        		<li class="area-hot-item" :class="index === crtHotIndex ? 'act': ''" @click="sltHotCity(item, index)" v-for="(item, index) in hotList" v-html="item.dictName">
        			
        		</li>        		
        	</ul>
        </div>

        <div class="city-list">
        	<div class="city-item" v-for="(item, index) in cityList">
        		<p class="city-first" @click="sltFirstCity(item, index)">
        			<span class="city-label" v-html="item.dictName"></span>
        			<span class="city-arrow"></span>
        		</p>
        		<ul class="city-second" v-show="index === crtFirstIndex">
        			<li class="city-item" :class="idx === crtSecondIndex ? 'act': ''" @click="sltSecondCity(item, subItem, idx)" v-for="(subItem, idx) in item.subList" v-html="subItem.dictName"></li>        			
        		</ul>
        	</div>
        </div>
    </div>
</template>

<script>
    import api from 'api/api'
    var Api = new api();
    export default {
        data() {
            return {
                cityList: [],
                hotList: [],
                crtCity: '',
                crtHotIndex: '',
                crtFirstIndex: '',
                crtSecondIndex: '',
                isShowSecond: false,
                istoggle: false                        
            }
        },
        components: {
        },
        mounted : function() {
        	var self = this;
        	self.getHotCity();
            self.getCityList();
            self.getLoaction();
        },
        methods: {        	
        	getLoaction: function() {
        		var self = this;
        		var citysearch = new AMap.CitySearch();
        		// console.log('搜索城市：', citysearch);
		        //自动获取用户IP，返回当前城市
		        citysearch.getLocalCity(function(status, result) {
		            if (status === 'complete' && result.info === 'OK') {
		                if (result && result.city && result.bounds) {
		                    var cityinfo = result.city;
		                    var citybounds = result.bounds;		                    
		                    self.crtCity = cityinfo;	
		                    // console.log('当前城市：', self.cityList);
		                    // setTimeout(function(){
		                    // 	if(self.cityList) {
		                    // 	}else{
		                    // 		console.log('网络异常，稍后再试！');
		                    // 	}
		                    // }, 1000);
		                }
		            } else {
		                document.getElementById('tip').innerHTML = result.info;
		            }
		        });
			},
        	sltHotCity: function(item, id) {
        		var self = this;
        		// self.crtHotIndex = id;
        		self.setCityData({
        			dictName: item.extend,
        			dictId: item.parentId
        		},{
        			dictName: item.dictName,
        			dictId: item.dictId
        		});
        		self.goback();
        	},
        	sltGpsCity: function() {
        		var self = this;      
		        self.setGpsData(self.cityList, self.crtCity);
        		self.goback();
        	},
            sltFirstCity: function(item, id) {
                var self = this;
                self.crtFirstIndex = id;
            },
        	sltSecondCity: function(item, subItem, id) {
                var self = this;
                // self.crtSecondIndex = id;
                self.setCityData(item, subItem);
                self.goback();             
        	},  
        	goback: function() {
        		var that = this;
        		setTimeout(function(){
        // 			that.$router.go({
				    //     path: '/abc',
				    //     replace: true
				    // });
        			history.back();
        			// history.go(-1);
        		}, 0);
        	},      
        	setGpsData: function(list, str) {
        		var self = this;
        		list.forEach(function(item, index){
        			var subList = item.subList;
        			subList.forEach(function(subItem, idx) {
        				if(str.indexOf(subItem.dictName) > -1) {
        					var resval = self.findGpsProvince(subItem.parentId);
        					self.setCityData({
        						dictName: self.findGpsProvince(subItem.parentId),
        						dictId: subItem.parentId
        					}, {
        						dictName: subItem.dictName,
        						dictId: subItem.dictId
        					});
        				}
        			})        			
        		});
        	},
        	findGpsProvince: function(id) {
        		var self = this;
        		var provinceName;
        		var list = self.cityList;
        		list.some(function(item, index) {
        			if(item.dictId == id) {
        				provinceName = item.dictName;
        				return false;
        			}
        		})
        		return provinceName;	        	
        	},
        	setCityData: function(item, subItem) {
        		var self = this;
        		var province, provinceId, city, cityId;
        		city = subItem.dictName;
                cityId = subItem.dictId;
                province = item.dictName;
                provinceId = item.dictId;
                self.removeCityData();
        		localStorage.setItem('province', province);
                localStorage.setItem('provinceId', provinceId);
                localStorage.setItem('city', city);
                localStorage.setItem('cityId', cityId);
        	},
        	removeCityData: function() {
        		localStorage.removeItem('province');
                localStorage.removeItem('provinceId');
        		localStorage.removeItem('city');
                localStorage.removeItem('cityId');
        	},
        	getHotCity: function() {
        		var self = this;
        		var param = {};
        		Api.getHotCity(param).then(function(res){
        			var data = res.data;
                    if(data.success == true) {
                    	self.hotList = data.data;
                    	// console.log('热门城市数据：', self.hotList);
                    }
        		});
        	},
        	getCityList: function() {
                var self = this;
                var param = {
                    parentId:107,
                    isSub:1
                };
                Api.getDict(param).then(function(res){
                    var data = res.data;
                    if(data.success == true) {
                        self.cityList = data.data;  
                    }
                });
            }
        }
    }
</script>

<style>
	body {
		background: #f2f2f2;
	}
	.taopin-city-page { height: 100%; overflow-y: auto!important;}
	/*GPS定位的城市*/
	.taopin-city-page{
		width: 3.75rem;
		overflow: hidden;
	}
	.taopin-city-page .city-gps {
		background: #fff;
		padding:.15rem;
	}
	.city-gps span{display: block;}
	.city-gps .title {
		font-family: PingFangSC-Regular;
		font-size: 12px;
		color: #999999;
		letter-spacing: 0;
		position: relative;		
	}
	.city-gps .title em{
		font-style: normal;
		display: inline-block;
		width: .1rem;
		height: .13rem;
		background: url('images/GPS_iocn.png') no-repeat;
		background-size: 100%;
		position: absolute;
		top: .03rem;
	}
	.city-gps .title span{
		display: inline-block;
		margin-left: .12rem;
	}
	.city-gps .text {
		background: #F5F5F5;
		border-radius: 3px;
		width: .81rem;
		height: .4rem;
		line-height: .4rem;
		font-family: PingFangSC-Regular;
		font-size: 14px;
		color: #333333;
		letter-spacing: 0;
		text-align: center;
		margin-top: .07rem;
	}
	/*热门地区*/
	.area-hot {
		background: #fff;
		padding: .15rem;
		margin: .1rem 0;
	}
	.area-hot-title{
		display: block;
		font-family: PingFangSC-Regular;
		font-size: 12px;
		color: #999;
		letter-spacing: 0;
	}
	.area-hot-list {
		margin-left: -.07rem;
		overflow: hidden;
	}
	.area-hot-list .area-hot-item {
		background: #F5F5F5;
		border-radius: 3px;
		font-family: PingFangSC-Regular;
		font-size: 14px;
		color: #333;
		letter-spacing: 0;
		margin-left: .07rem;
		margin-top: .07rem;
		width: .81rem;
		height: .4rem;
		line-height: .4rem;
		text-align: center;
		display: inline-block;
		float: left;
	}
	.area-hot-list .area-hot-item.act {
		width: .79rem;
		height: .38rem;
		background: #FFFFFF;
		border: 1px solid #FF4D4D;
		border-radius: 3px;
		color: #FF4D4D;
	}
	/*城市列表*/
	.city-list {
		background: #fff;
		padding: 0 .15rem;
	}
	.city-list .city-item {
		width: 3.75rem;
		border-bottom: 1px solid #E0E0E0;
		
	}
	.city-item .city-first {
		font-family: PingFangSC-Regular;
		font-size: 14px;
		color: #333;
		height: 0.44rem;
		line-height: .44rem;
		/*border-top: 1px solid #E0E0E0;*/
		overflow: hidden;
		position: relative;
	}
	.city-first span {display: inline-block;}
	.city-first .city-label{
		font-family: PingFangSC-Regular;
		font-size: 14px;
		color: #333333;
		letter-spacing: 0;
		float: left;
	}
	.city-first .city-arrow{
		width: .05rem;
		height: .1rem;
		background: url('./images/arr_icon.png') center no-repeat;
		background-size: 100%;
	    position: absolute;
	    right: .3rem;
	    top: .16rem;
	}

	.city-second {
		overflow: hidden;
		/*margin-top: -.07rem;*/
		margin-left: -.07rem;
	}
	.city-second .city-item{
		display: inline-block;
		background: #F5F5F5;
		border-radius: 3px;
		font-family: PingFangSC-Regular;
		font-size: 14px;
		color: #333;
		margin-left: .07rem;
		margin-bottom: .07rem;
		width: .81rem;
		height: .4rem;
		line-height: .4rem;
		text-align: center;		
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	.city-second .city-item.act{
		width: .79rem;
		height: .38rem;
		background: #FFFFFF;
		border: 1px solid #FF4D4D;
		border-radius: 3px;
		color: #FF4D4D;
	}


</style>