<template>
    <div class="tp-proj-page">      

        <div class="taopin-form-card">
            <div class="taopin-form-area" v-for="(item, index) in projList">            
                <p class="taopin-form-title">
                    <span class="txt">您的最近一次项目经历</span> 
                    <span class="del" @click="delProjItemCard(index, item)"></span>
                </p>
                <div class="taopin-form-item">             
                    <span class="label">项目名称</span>
                    <div class="con">
                        <input type="text" v-model="item.projectName" class="ipt" placeholder="请输入" />
                    </div>
                </div>
                <div class="taopin-form-item">             
                    <span class="label">担任职位</span>
                    <div class="con">
                        <input type="text" v-model="item.projectDuty" class="ipt" placeholder="请输入" />
                    </div>
                </div>
                <div class="taopin-form-item">
                    <group>
                        <datetime v-model="item.startDate" :start-date="startDate" :end-date="endDate"  :title="'项目开始'"  placeholder="请选择" format="YYYY-MM-DD" ></datetime>
                    </group>                        
                </div>
                <div class="taopin-form-item">
                    <group>
                        <datetime v-model="item.endDate" :start-date="startDate" :end-date="endDate" :title="'项目结束'" placeholder="请选择" format="YYYY-MM-DD"></datetime>
                    </group>                        
                </div>                
                <div class="taopin-form-txtarea">             
                    <span class="label">项目描述</span>
                    <div class="con">
                        <textarea placeholder="请填写这份项目中的描述" class="txtarea" v-model="item.projectDescribe"></textarea>
                    </div>
                </div>                
            </div>

            <a class="taopin-add-btn" href="javascript:" @click="addProjItemCard"><span></span></a>

        </div>
        

        <div class="btn-step">
            <!-- <a href="javascript:" @click="saveProjInfo" v-show="!isChk">
                保存
            </a> -->
            <a href="javascript:" class="act" @click="saveProjInfo" v-show="isChk">
                保存
            </a>
        </div>
    </div>
</template>

<script>    
    import Vue from 'vue'
    import './style/layout.css'
    import api from 'api/api'
    import { Group, Datetime, ToastPlugin, ConfirmPlugin } from 'vux'
    var API = new api();
    Vue.use(ToastPlugin)
    Vue.use(ConfirmPlugin)

    export default {
        data() {
            return {
                currentStep: 3,
                totalStep: 4,
                proj: {
                    id:'',
                    projectName:'',
                    startDate:'',
                    endDate:'',
                    post: '',
                    projectDuty:'',
                    projectDescribe:'',
                    resumeId:'' 
                },
                projList: [],
                vStartTime: '',
                vEndTime: '',
                startDate: '1900-11-11',
                endDate: '2020-11-11',
                isChk: true             
            }
        },
        mounted: function() {   
            var uid = this.$route.query.resumeId;
            if(uid) {
                this.initEditList();
            }            
            this.addProjItemCard();
        },
        components: {
            Datetime,
            Group
        },
        methods: {
            initEditList: function() {
                var that = this;
                var param = {
                    id: that.$route.query.resumeId
                };
                param.id ?
                API.getResumeDetail(param).then(function(res) {
                    var data = res.data;
                    if(data.success == true) {
                        var resData = data.data;
                        that.projList = resData.projects;
                        that.projList.forEach(function(item, index){
                            item['vStartTime'] = item.startDate;
                            item['vEndTime'] = item.endDate;
                        });

                    }
                }) : ''
            },
            addProjItemCard: function() {
                var that = this;
                var uid = that.$route.query.resumeId || '';
                var lid = localStorage.getItem('resumeId') || '';
                var rid = uid || lid;                
                var len = that.projList.length;
                if(len < 10) {
                    that.projList.push({
                        id: '',
                        resumeId: rid,
                        projectName: '',
                        projectDuty: '',
                        projectDescribe: '',
                        startDate: '',
                        endDate: '',
                    }); 
                }else{
                    that.toast({text: '项目经验最多只能添加10项'});
                }                
            },       
            saveProjInfo: function() {
                var that = this;
                var flag;
                var len = that.projList.length - 1;
                var esList = JSON.parse(JSON.stringify(that.projList));
                if(that.projList.length == 0) {
                    that.toast({text: '请至少填写一项项目经历'});
                    return false;
                }
                esList.forEach(function(item, index) {
                    flag = that.verifyForm(item);
                    console.log('保存的消息', item);
                    if(flag) {
                        item.startDate = new Date(item.startDate);
                        item.endDate = new Date(item.endDate);
                        API.saveProject(item).then(function(res){
                            var data = res.data;
                            if(data.success == true) {
                                if(index == len) {
                                    history.back();
                                }
                            } else {
                                that.toast({text: res.data.desc});
                            }
                        })
                    }                    
                });
                               
            },     
            delProjItemCard: function(index, item) {
                var that = this;
                that.confirm({
                    title: '温馨提示',
                    content: '确认删除该项么？',
                    callback: function(){
                        var param = {
                            id: item.id,
                            resumeType: 3
                        };
                        if(param.id) {
                            API.delResumeDetail(param).then(function(res) {
                                var data = res.data;
                                if(data.success == true) {
                                    that.projList.splice(index, 1);
                                }else{
                                    that.toast({text: res.data.desc});
                                } 
                            });
                        }else {
                            that.projList.splice(index, 1);
                        }                        
                    }
                });               
            },
            clearProjItem: function() {
                var that = this;                
                that.proj = {};
                that.vStartTime = '';
                that.vEndTime = '';
            },                                   
            verifyForm: function(item) {
                var that = this;
                var reg_chinese = /^[\u4e00-\u9fa5]*$/;
                var reg_ce = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
                var projectName = item.projectName;
                var projectDuty = item.projectDuty;
                var projectDescribe = item.projectDescribe;
                var startTime = that.startDate;
                var endTime = that.endDate;
                if(!projectName){
                    that.toast({text: '请填写项目名称'});
                    return;
                }else if(!reg_chinese.test(projectName)){
                    that.toast({text: '项目名称只能是中文'});
                    return;
                }else if(projectName.length > 20){
                    that.toast({text: '项目名字不能超过20个字符'});
                    return;
                }
                if(!projectDuty){
                    that.toast({text: '请填写担任职位'});
                }else if(!reg_ce.test(projectDuty)){
                    that.toast({text: '职位名只能是中文或英文'});
                    return;
                }else if(projectDuty.length > 10) {
                    that.toast({text: '职位名字不能超过10个字符'});
                    return;
                }                
                if(!startTime){
                    that.toast({text: '请选择您的起始时间'});
                    return;
                }else if(!endTime){
                    that.toast({text: '请选择您的结束时间'});
                    return;
                }else if(startTime > endTime) {
                    that.toast({text: '开始日期不能大于结束日期'});
                    return;
                }
                if(!projectDescribe){
                    that.toast({text: '请填写项目描述'});
                    return;
                }else if(projectDescribe.length > 1000) {
                    that.toast({text: '项目描述不能超过1000个字符'});
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
    .tp-proj-page {
        overflow: hidden;
        margin-top: 0.12rem;
        margin-bottom: .7rem;
    }
    .taopin-form-area {
        margin-top: .12rem;
    }
    .taopin-form-area:first-child {
        margin-top: 0;
    }
 </style>
