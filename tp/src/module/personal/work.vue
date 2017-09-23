<template>
    <div class="tp-work-page">
        
        <div class="taopin-form-card" >

            <div class="taopin-form-area" v-for="(item, index) in workList">            
                <p class="taopin-form-title">
                    <span class="txt">您的上一次工作经历</span> 
                    <span class="del" @click="delWorkItem(index, item)"></span>
                </p>
                <div class="taopin-form-item">             
                    <span class="label">公司名称</span>
                    <div class="con">
                        <input type="text" v-model="item.companyName" class="ipt" placeholder="请输入" />
                    </div>
                </div>
                <div class="taopin-form-item">             
                    <span class="label">担任职位</span>
                    <div class="con">
                        <input type="text" v-model="item.hodPost" class="ipt" placeholder="请输入" />
                    </div>
                </div>                

                <div class="taopin-form-item">
                    <group>
                        <datetime v-model="item.startDate" :start-date="startDate" :end-date="endDate"  :title="'起始时间'"  placeholder="请选择" format="YYYY-MM-DD" ></datetime>
                    </group>                        
                </div>
                <div class="taopin-form-item">
                    <group>
                        <datetime v-model="item.endDate" :start-date="startDate" :end-date="endDate" :title="'结束时间'" placeholder="请选择" format="YYYY-MM-DD"></datetime>
                    </group>                        
                </div>
                <div class="taopin-form-txtarea">             
                    <span class="label">工作描述</span>
                    <div class="con">
                        <textarea placeholder="请填写这份工作经历" class="txtarea" v-model="item.workDescribe"></textarea>                   
                    </div>
                    <span class="arrow"></span>
                </div>                
            </div>

            <a class="taopin-add-btn" href="javascript:" @click="addWorkCard"><span></span></a>
        </div>

        <div class="btn-step btn-step4" v-if="!isEdit">
            <a href="javascript:" class="perfect-btn" @click="saveWorksInfo">完善信息</a>
            <a href="javascript:" class="finish-btn" @click="findJob">完成去找工作</a>
        </div>

        <div class="btn-step" v-if="isEdit">
            <a href="javascript:" class="act" @click="saveWorksInfo">保存</a>
        </div>


    </div>
</template>

<script>
    import Vue from 'vue'    
    import './style/layout.css'
    import api from 'api/api'
    import { PopupPicker, Group, Datetime, ToastPlugin, ConfirmPlugin } from 'vux'
    var API = new api();
    var baseUrl = 'http://daily.imaijia.com';
    Vue.use(ToastPlugin)
    Vue.use(ConfirmPlugin)
    
    export default {
        data() {
            return {
                currentStep: 3,
                totalStep: 4,
                work: {
                    id:'',
                    companyName:'',
                    hodPost:'',                    
                    startDate:'',
                    endDate:'',
                    workDescribe:'',
                    resumeId:''
                },
                workList: [],
                vStartTime: '',
                vEndTime: '',
                startDate: '1900-11-11',
                endDate: '2020-11-11',     
                isEdit: false                       
            }
        },
        mounted: function() {
            var uid = this.$route.query.resumeId;
            if(uid) {
                this.initEditItem();
                this.isEdit = true;
            }            
            this.addWorkCard();
        },
        components: {           
            PopupPicker,
            Datetime,
            Group 
        },
        methods: {
            //初始化编辑项信息
            initEditItem: function() {
                var that = this;
                var param = {
                    id: that.$route.query.resumeId || ''
                };
                param.id ?
                API.getResumeDetail(param).then(function(res) {
                    var data = res.data;
                    if(data.success == true) {
                        var resData = data.data;
                        that.workList = resData.works;
                        that.workList.forEach(function(item, index){
                            item['vStartTime'] = item.startDate;
                            item['vEndTime'] = item.endDate;
                        });

                    }
                }) : ''
            },
            // 添加工作经历卡片
            addWorkCard: function() {
                var that = this;
                var len = that.workList.length;
                var uid = that.$route.query.resumeId || '';
                var lid = localStorage.getItem('resumeId') || '';
                var rid = uid || lid;  
                if(len < 10) {
                    that.workList.push({
                        id: '',
                        resumeId: rid,                    
                        companyName: '',
                        hodPost: '',
                        workDescribe: '',
                        startDate: '' ,
                        endDate: '',
                    });
                }else{
                    that.toast({text: '工作经历最多只能添加10项'});
                }                                
            },
            //删除单一工作经历
            delWorkItem: function(index, item) {
                var that = this;
                that.confirm({
                    title: '温馨提示',
                    content: '确认删除该项么？',
                    callback: function(){
                        var param = {
                            id: item.id,
                            resumeType: 2
                        };
                        if(param.id) {
                        API.delResumeDetail(param).then(function(res) {
                            var data = res.data;
                            if(data.success == true) {
                                that.workList.splice(index, 1);
                            }else{
                                that.toast({text: res.data.desc});
                            } 
                        });
                        }else{
                            that.workList.splice(index, 1);
                        }
                    }
                });                
            },
            
            //清除上一次添加的内容
            clearWorkItem: function() {
                var that = this;                
                that.work = {};
                that.vStartTime = '';
                that.vEndTime = '';
            },      
            //完善信息             
            saveWorksInfo: function() {
                var that = this;
                var isFlag;
                var len = that.workList.length - 1;
                var uid = this.$route.query.resumeId;
                var esList = JSON.parse(JSON.stringify(that.workList));
                
                if(that.workList.length == 0) {
                    that.toast({text: '请至少填写一项工作经历'});
                    return false;
                }
                
                esList.forEach(function(item, index) {
                    isFlag = that.verifyForm(item);
                    if(isFlag) {
                        console.log('校验成功。', item);

                        item.startDate = new Date(item.startDate);
                        item.endDate = new Date(item.endDate);

                        API.saveWork(item).then(function(res){
                            var data = res.data;
                            if(data.success == true) {
                                if(index == len) {
                                    if(uid) {
                                        location.href="#/editlist?resumeId=" + uid;
                                    }else{
                                        location.href="#/extra"
                                    }
                                }
                            } else {
                                that.toast({text: res.data.desc});
                            }
                        })
                    }
                    
                });                
            },
            //完成去找工作
            findJob: function() {
                var that = this;
                var flag;
                var len = that.workList.length - 1;
                var esList = JSON.parse(JSON.stringify(that.workList));
                if(that.workList.length == 0) {
                    that.toast({text: '请至少填写一项工作经历'});
                    return false;
                }
                esList.forEach(function(item, index) {  
                    flag = that.verifyForm(item);
                    if(flag) {
                        item.startDate = new Date(item.startDate);
                        item.endDate = new Date(item.endDate);
                        API.saveWork(item).then(function(res){
                            var data = res.data;
                            if(data.success == true) {
                                location.href = '/mobile/job.htm';
                            } else {
                                that.toast({text: res.data.desc});
                            }
                        })
                    }                    
                }); 
            },            
            verifyForm: function(item) {
                var that = this;
                var reg_chinese = /^[\u4e00-\u9fa5]*$/;
                var reg_name = /^[\u4e00-\u9fa5a-zA-Z]+$/;
                var companyName = item.companyName;
                var hodPost = item.hodPost;
                var workDescribe = item.workDescribe;
                var startTime = item.startDate;
                var endTime = item.endDate;
                
                if(!companyName){
                    that.toast({text: '请填写相应公司名称'});
                    return;
                }else if(!reg_chinese.test(companyName)){
                    that.toast({text: '公司名称只能是中文'});
                    return;
                }else if(companyName.length > 20){
                    that.toast({text: '公司名字不能超过20个字符'});
                    return;
                }
                if(!hodPost){
                    that.toast({text: '请填写相应的职位'});
                    return;
                }else if(!reg_name.test(hodPost)){
                    that.toast({text: '职位名只能是中文或英文'});
                    return;
                }else if(hodPost.length > 10) {
                    that.toast({text: '职位名字不能超过10个字符'});
                    return;
                }                
                if(!startTime){
                    that.toast({text: '请选择您工作开始的时间'});
                    return;
                }else if(!endTime){
                    that.toast({text: '请选择您工作结束的时间'});
                    return;
                }else if(startTime > endTime) {
                    that.toast({text: '开始日期不能大于结束日期'});
                    return;
                }
                if(!workDescribe){
                    that.toast({text: '请填写相应的工作描述'});
                    return;
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
            },
            confirm: function(o) {
                this.$vux.confirm.show({
                    title: o.title || '',
                    content: o.content || '确认要删除该项么？',                    
                    onConfirm: function() {
                      o.callback();
                    }
                  })
            }            
        }
    }
</script>


<style scoped>    
    .tp-work-page {
        margin-top: 0.12rem;
    }
    .taopin-form-card {
        margin-bottom: 0.8rem;
    }
    .taopin-form-area { 
        margin-top: 0.12rem;
        /*border-bottom: 1px solid #eee;*/
    }
    .taopin-form-area:first-child {
        margin-top: 0;
    }
    
</style>
