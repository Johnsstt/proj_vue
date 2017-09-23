<template>
    <div class="tp-job-page">        
        <div class="taopin-form-area">
            <div class="taopin-form-item">             
                <span class="label">期望职位</span>
                <div class="con">
                    <input type="text" v-model="hopeJobSecond" class="ipt" placeholder="请选择" @click="sltHopePost"/>                 
                </div>
                <span class="arrow"></span>
            </div>
            

            <div class="taopin-form-item">  
                <group>
                    <popup-picker title="期望薪资"  :data="salaryList" v-model="vxSalary" :columns="1" show-name placeholder="请选择" @on-shadow-change='onSalaryChange'></popup-picker>
                </group>                 
            </div>

            <div class="taopin-form-item">             
                <span class="label">
                    工作性质                      
                </span>
                <div class="radio-con">
                    <div class="radio-tag">
                        <span v-for="(item, index) in qualityList" :class="[workQuality == item.value ? 'act' : '']" v-text="item.label" @click="sltTag(item)" ></span>                        
                    </div>
                </div>
             </div>
             <div class="taopin-form-item">             
                <span class="label">期望城市</span>
                <div class="con">
                    <input type="text" v-model="hopeCity" class="ipt" placeholder="请选择" @click="sltHopeCity"/>                 
                </div>
                <span class="arrow"></span>
            </div>            
            <div class="taopin-form-item">
                <group>    
                    <popup-picker title="求职状态"  :data="workStatusList" v-model="vxStatus" :columns="1" show-name placeholder="请选择" @on-shadow-change='onStatusChange'></popup-picker>                              
                </group>
            </div>
        </div>        
                
        <div class="btn-step btn-step2"> 
            <a v-if="!isEdit" href="javascript:" class="act" @click="saveUserInfo">
                下一步(<span>2</span>/<span>4</span>)
            </a>           
            <a v-if="isEdit" href="javascript:" class="act" @click="saveUserInfo">
                保存
            </a>
        </div>

    </div>
</template>

<script>
    import Vue from 'vue'
    import './style/layout.css'
    import api from 'api/api'
    import { Group, PopupPicker, ToastPlugin } from 'vux'
    var API = new api();
    Vue.use(ToastPlugin);

    export default {
        data() {
            return {
                currentStep: 2,
                totalStep: 4,
                vxSalary: [],
                vxStatus: ['1'],
                hopeJobFirst:'',
                hopeJobFirstId:'',
                hopeJobSecondId:'',
                hopeJobSecond:'',
                workQuality:'1',
                hopeSalaryMin:'',
                hopeSalaryMax:'',
                hopeProvince:'',
                hopeCity:'',
                workStatus:'',
                id: '',    
                showSalary: false,
                showStatus: false,
                isGLFlag: true,
                salaryList: [
                    {name: '3K以下', value: '0-3000'},
                    {name: '3k-5k', value: '3000-5000'},
                    {name: '5k-7k', value: '5000-7000'},
                    {name: '7k-10k', value: '7000-10000'},
                    {name: '10k-15k', value: '10000-15000'},
                    {name: '15k-20k', value: '15000-20000'},
                    {name: '20k以上', value: '20000-999999'},
                ],
                qualityList: [
                    {label: '全职', value: 1},
                    {label: '兼职', value: 2},
                    {label: '实习', value: 3}
                ],
                workStatusList: [
                    {name: '我目前已离职,可快速到岗', value: '1'},
                    {name: '我目前在职,考虑换个新环境', value: '2'},
                    {name: '我暂时不想找工作', value: '3'},
                    {name: '我是应届毕业生', value: '4'}
                ],
                list3: [{
                    name: '中国',
                    value: 'china'
                  }, {
                    name: '美国',
                    value: 'USA'
                  }, {
                    name: '广东',
                    value: 'china001'
                  }, {
                    name: '广西',
                    value: 'china002'
                }],         
                value4: ['china001'],
                title4: '测试案例',                 
                isEdit: false                        
            }
        },
        components: {
            PopupPicker,
            Group
        },
        activated: function() {            
            this.setHopeJobPost();
            this.setHopeJobCity();
        },
        mounted: function() {   
            var uid = this.$route.query.resumeId;
            
            this.removeJobPost();
            this.removeHopeJobCity();
            if(uid) {
                this.initEditList();
                this.isEdit = true;
            }else{
                // this.workQuality = 1; 
                // this.vxStatus = ['4'];
            }         
        },
        methods: {       
            onChange (val) {
              console.log('val change', val)
            },                
            sltTag: function(item) {
                this.workQuality = item.value;
            },            
            onSalaryChange: function(value, key) { 
                var arr = value[0].split('-');
                this.hopeSalaryMin = arr[0];
                this.hopeSalaryMax = arr[1];    
                this.showSalary = true;            
            },
            onStatusChange: function(value, key) {
                this.workStatus = value[0];
                this.showStatus = true;                
            },
            sltHopePost: function () {
                location.href = '#/allJobs?channel=jobedit'
            },
            sltHopeCity: function() {
                location.href = '#/city?channel=job'
            },            
            saveUserInfo: function() {
                var that = this;
                var resumeId, param;
                var channel = this.$route.query.channel;
                var uid = that.$route.query.resumeId || '';
                var lid = localStorage.getItem('resumeId') || '';
                var rid = uid || lid;
                param = {
                    hopeJobFirst: this.hopeJobFirst,
                    hopeJobFirstId: this.hopeJobFirstId,
                    hopeJobSecond: this.hopeJobSecond,
                    hopeJobSecondId: this.hopeJobSecondId,
                    hopeSalaryMin: this.hopeSalaryMin,
                    hopeSalaryMax: this.hopeSalaryMax,
                    hopeProvince: this.hopeProvince,
                    hopeCity: this.hopeCity,
                    workQuality: this.workQuality,
                    workStatus: this.workStatus,
                    id: rid
                };

                // console.log('value4值是：', that);

                // 验证通过
                if(this.filterForm(param)) {
                    API.saveHopeJob(param).then(function(res){
                        var data = res.data;
                        if(data.success == true) {
                            if(data && data.data) {
                                if(uid) {
                                    location.href="#/editlist?resumeId=" + uid;
                                }else{
                                    localStorage.setItem('resumeId', data.data);
                                    location.href="#/edu"
                                }
                            }                            
                        }else{
                            that.toast({text: data.desc});
                        }                  
                    })
                }                
            },

            filterForm: function() {
                var _this = this;
                var hopeJobFirst, hopeJobFirstId, hopeJobSecond, hopeJobSecondId, hopeSalaryMin, hopeSalaryMax,hopeProvince,hopeCity,workQuality,workStatus;
                hopeJobFirst = _this.hopeJobFirst,
                hopeJobFirstId = _this.hopeJobFirstId,
                hopeJobSecond = _this.hopeJobSecond,
                hopeJobSecondId = _this.hopeJobFirstId,
                hopeSalaryMin = _this.hopeSalaryMin,
                hopeSalaryMax = _this.hopeSalaryMax,
                hopeProvince = _this.hopeProvince,
                hopeCity = _this.hopeCity,
                workQuality = _this.workQuality,
                workStatus = _this.workStatus

                if (!hopeJobFirst && !hopeJobFirstId && !hopeJobSecond && !hopeJobSecondId) {
                    _this.toast({text: '请填写期望的职位'})
                    return false;
                }
                if(!hopeSalaryMin && !hopeSalaryMax) {
                    _this.toast({text: '请填写期望的薪资'})
                    return false;
                }
                if(!workQuality) {
                    _this.toast({text: '请选择工作性质'})
                    return false;
                }
                if(!hopeProvince && !hopeCity) {
                    _this.toast({text: '请选择期望的城市'})
                    return false;
                }
                if(!workStatus) {
                    _this.toast({text: '请选择求职状态'})
                    return false;
                }
                return true;
            },
            initEditList: function() {
                var that = this;
                var param = {
                    id: that.$route.query.resumeId || localStorage.getItem('resumeId')
                };                
                param.id ?
                API.getResumeDetail(param).then(function(res) {
                    var data = res.data;
                    if(data.success == true) {
                        var resData = data.data;
                        var hopeSalaryMin, hopeSalaryMax;
                        var hopeSalary, statusName;

                        that.hopeJobFirst = resData.hopeJobFirst;
                        that.hopeJobFirstId = resData.hopeJobFirstId;
                        that.hopeJobSecond = resData.hopeJobSecond;
                        that.hopeJobSecondId = resData.hopeJobSecondId;
                        that.hopeSalaryMin = resData.hopeSalaryMin;
                        that.hopeSalaryMax = resData.hopeSalaryMax;

                        

                        that.vxSalary = [];
                        that.vxSalary = [that.hopeSalaryMin +'-'+ that.hopeSalaryMax];
                                           

                        that.hopeProvince = resData.hopeProvince;
                        that.hopeCity = resData.hopeCity;
                        that.workQuality = resData.workQuality;
                        that.workStatus = resData.workStatus;
                        that.vxStatus = [];
                        that.vxStatus = [''+that.workStatus+''];
                    }
                }) : ''
            },
            salaryValToTxt: function(min, max) {
                var val, arr;
                var salaryList = this.salaryList;
                salaryList.forEach(function(item, index){
                    arr = (item.value).split('-');                    
                    if(min === parseInt(arr[0]) && max === parseInt(arr[1])) {
                        val = item.name;
                    }
                });
                return val;
            },
            workStatusIdToTxt: function(id) {
                var val;
                var workStatusList = this.workStatusList;
                workStatusList.forEach(function(item, index){
                    if(item.value == id) {
                        val = item.name;
                    }
                });
                return val;
            },
            setHopeJobPost: function() {
                this.hopeJobFirst = localStorage.getItem('hopeJobFirst') || '';
                this.hopeJobFirstId = localStorage.getItem('hopeJobFirstId') || '';
                this.hopeJobSecond = localStorage.getItem('hopeJobSecond') || '';
                this.hopeJobSecondId = localStorage.getItem('hopeJobSecondId') || '';
            },
            removeJobPost: function() {
                localStorage.removeItem('hopeJobFirst');
                localStorage.removeItem('hopeJobFirstId');
                localStorage.removeItem('hopeJobSecond');
                localStorage.removeItem('hopeJobSecondId');                
            },
            setHopeJobCity: function() {
                this.hopeProvince = localStorage.getItem('province') || ''
                this.hopeCity = localStorage.getItem('city') || ''
            },
            removeHopeJobCity: function() {
                localStorage.removeItem('province');
                localStorage.removeItem('city');
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
    body {background: #EEEDF2;}
    a{text-decoration: none;}
</style>
<style scoped>    
    
    /*期望职位*/
    .item-case{
        font-size: 17px;
        line-height: .44rem;
        height: .44rem;
        position: relative;
        z-index: 1;
        padding: 0 .14rem;
        display: flex;
    }
    .item-case .case-name {
        display: inline-block;
        font-size: 17px;
        width: 5.5em;
        text-align: justify;
    }
    .item-case .case-content{
        position: relative;
        display: inline-block;        
        text-align: right;
        color: #333;
    }
    .active .edit-place {
        display: inline-block;
        width: 100%;
    }
    .edit-place .edit-input {
        position: relative;
        top: 0px;
        width: 2.5rem;
        font-size: 17px;        
        text-indent: 0.1rem;
        box-sizing: border-box;
        border: 1px solid #ededed;
        border-radius: .05rem;
        border: 1px solid transparent;
        text-align: right;
    }

    /*遮罩层*/
    
    .expectjob {
        position: fixed;
        top: 1.4rem;
        z-index: 99;
        width: 100%;
        height: 100%;
        background: #fff;
        overflow-y: auto;
        padding-bottom: 1.4rem;
    }
    .expectjob .expectjob-wrap { padding-bottom: 1.8rem; }
    .expectjob-wrap .jobsel-head {
        border-bottom: 1px solid #ccc;
        overflow: hidden;
        height: .4rem;
        line-height: .4rem;
        position: fixed;
        top: 1.4rem;
        width: 100%;
        background: #fff;
    }
    .expectjob-wrap .jobsel-head .tit{ float:left; color: #999; font-size: .12rem;padding-left: .14rem;}
    .expectjob-wrap .jobsel-head .close{ float:right;float:right;padding-right: .14rem;}
    .expectjob-wrap dl {margin-top: 14px; overflow: hidden;};
    .expectjob-wrap dl dt {height: .3rem;line-height: .3rem;font-size: .12rem;color: #999;margin-left: .14rem;}
    .expectjob-wrap dl dd {width: 28%; float: left; margin-left: .14rem;}
    .expectjob-wrap dl dd span {
        border: 1px solid #E4E4E4;
        border-radius: 3px;
        display: inline-block;
        width: 100%;
        padding: .06rem .01rem;
        background: #f5f5f5;
        margin-top: .08rem;
        text-align: center;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        letter-spacing: 0;
    }
    .msk {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0, .4);
        z-index: 40;
    }


    

</style>
