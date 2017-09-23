<template>
    <div class="taopin-edu-page">
        
        <div class="taopin-form-card">
            <div class="taopin-form-area" v-for="(item, index) in eduList">                
                <p class="taopin-form-title">
                    <span class="txt">您的教育经历</span> 
                    <span class="del" @click="delEduItem(index, item)"></span>
                </p>
                <div class="taopin-form-item">             
                    <span class="label">学校名称</span>
                    <div class="con">
                        <input type="text" v-model="item.schoolName" class="ipt" placeholder="请输入" />
                    </div>
                 </div>
                 <div class="taopin-form-item">             
                    <span class="label">专业</span>
                    <div class="con">
                        <input type="text" v-model="item.profession"  class="ipt" placeholder="请输入" />
                    </div>
                 </div>
                    
                <div class="taopin-form-item">                          
                    <group>                        
                        <popup-picker title="学历" :data="lists.degree" v-model="item.degree" :columns="1" show-name  placeholder="请选择" @on-shadow-change='onEduDegreeChange'>
                        </popup-picker>
                    </group>
                </div>

                <div class="taopin-form-item">                        
                    <group>
                        <datetime v-model="item.startDate" :start-date="startDate" :end-date="endDate"  :title="'起始时间'"  placeholder="请选择" format="YYYY-MM-DD" ></datetime>
                    </group>                        
                </div>
                <div class="taopin-form-item" style="border-bottom:none;">                       
                    <group>
                        <datetime v-model="item.endDate" :start-date="startDate" :end-date="endDate" :title="'结束时间'" placeholder="请选择" format="YYYY-MM-DD"></datetime>
                    </group>                        
                </div>                 
            </div>
            <a class="taopin-add-btn" href="javascript:" @click="addEduCard"><span></span></a>
        </div>        

        <div class="btn-step">
            <a v-if="!isEdit" href="javascript:" class="act" @click="saveEduInfo">
                下一步(<span>3</span>/<span>4</span>)
            </a>
            <a v-if="isEdit" href="javascript:" @click="saveEduInfo" class="act">
                保存
            </a>
        </div>
    </div>
</template>

<style>
    body {
        overflow-y: auto;
    }
</style>

<script>
    import Vue from 'vue'
    import { PopupPicker, Group, Datetime, ToastPlugin, ConfirmPlugin } from 'vux'
    import './style/layout.css'
    import api from 'api/api'
    var API = new api();
    Vue.use(ToastPlugin)
    Vue.use(ConfirmPlugin)


    export default {
        data() {
            return {
                currentStep: 3,
                totalStep: 4,
                showEdu: {},
                edu: {
                    id:'',
                    schoolName:'',
                    startDate:'',
                    endDate:'',
                    profession:'',
                    degree:'',
                    resumeId:''
                },
                lists: {
                    degree: [
                        {name:'初中', value: '初中'},
                        {name:'高中', value: '高中'},
                        {name:'大专', value: '大专'},
                        {name:'本科', value: '本科'},
                        {name:'硕士', value: '硕士'},
                        {name:'博士', value: '博士'}
                    ]
                },
                eduList: [],
                isChk: true,
                isAdd: false,
                isAddBtn: false,
                vStartTime: '',
                vEndTime: '',
                startDate: '1900-11-11',
                endDate: '2020-11-11',
                isEdit: false
            }
        },  
        components: {
            PopupPicker,
            Datetime,
            Group            
        },
        mounted: function() {
            var uid = this.$route.query.resumeId || '';
            if(uid) {
                this.initEditList();
                this.isEdit = true;              
            }
            this.addEduCard();            
        },
        methods: {  
            //展示添加后的标签列表
            addEduCard: function() {
                var that = this;
                var len = that.eduList.length;
                var uid = that.$route.query.resumeId || '';
                var lid = localStorage.getItem('resumeId') || '';
                var rid = uid || lid;
                if(len < 10) {
                    that.eduList.push({
                        id: '',
                        resumeId: rid,
                        schoolName: '',
                        profession: '',
                        degree: [],
                        startDate: '',
                        endDate: ''
                    });
                }else{
                    that.toast({text: '教育经历最多只能添加10项'});
                }
            },          
            delEduItem: function(index, item) {
                var that = this;
                that.confirm({
                    title: '温馨提示',
                    content: '确认删除该项么？',
                    callback: function(){
                        var param = {
                            id: item.id,
                            resumeType: 1
                        };
                        if(!param.id) {
                            that.eduList.splice(index, 1);
                            
                        }else{
                            API.delResumeDetail(param).then(function(res) {
                                var data = res.data;
                                if(data.success == true) {
                                    that.eduList.splice(index, 1);
                                }else{
                                    that.toast({text: res.data.desc});
                                } 
                            });
                        }
                    }
                })                
            },
            onEduDegreeChange: function(value, key) {  
                var that = this;                
                // this.edu.degree = value[0];
            },            
            expectJobShowFn: function() {
                var self = this;
                self.edu.isexpect = true;
            },              
            saveEduInfo: function() {
                var that = this;
                var flag;
                var len = that.eduList.length - 1;
                var esList = JSON.parse(JSON.stringify(that.eduList));
                var resumeId = that.$route.query.resumeId;

                if(that.eduList.length == 0) {
                    that.toast({text: '请至少填写一项教育经历'});
                    return false;
                }
                esList.forEach(function(item, index) {
                    flag = that.verifyForm(item);
                    if(flag) {
                        item.degree = item.degree[0];
                        item.startDate = new Date(item.startDate);
                        item.endDate = new Date(item.endDate);
                        API.saveEducation(item).then(function(res){
                            var data = res.data;
                            if(data.success == true) {
                                if(index == len) {
                                    if(resumeId) {
                                        location.href="#/editlist?resumeId=" + resumeId;
                                    }else{                                        
                                        location.href="#/work"
                                    }
                                }
                            } else {
                                that.toast({text: res.data.desc});
                            }
                        })
                    }
                    
                })   

            },
            //初始化编辑数据
            initEditList: function() {
                var that = this;
                var param = {
                    id: that.$route.query.resumeId || ''
                };
                
                param.id ?
                API.getResumeDetail(param).then(function(res) {
                    var data = res.data;
                    if(data.success == true) {
                        var resData = data.data;
                        that.eduList = resData.educations;
                        that.eduList.forEach(function(item, index){
                            item['degree'] = [item.degree];                            
                        });
                    }
                }) : ''
            },       
            //清空编辑数据
            clearEduItem: function() {
                var that = this;
                that.edu = [];
                that.vDegree = [];
                that.vStartTime = '';
                that.vEndTime = '';
            },
                        
            verifyForm: function(item) {
                var that = this;
                var reg_chinese = /^[\u4e00-\u9fa5]*$/;
                var reg_name = /^[\u4e00-\u9fa5a-zA-Z]+$/;
                var schoolName = item.schoolName;
                var profession = item.profession;
                var degree = item.degree;
                var startTime = item.startDate;
                var endTime = item.endDate;

                if(!schoolName){
                    that.toast({text: '请填写学校的名字'});
                    return;
                }else if(!reg_chinese.test(schoolName)) {
                    that.toast({text: '学校名字只能是中文'});
                    return;
                }else if(schoolName.length > 20) {
                    that.toast({text: '学校名字不能超过20个字符'});
                    return;
                }
                if(!profession){
                    that.toast({text: '请填写所学专业'});
                    return;
                }else if(!reg_name.test(profession)) {
                    that.toast({text: '所学专业只能是中文或英文'});
                    return;
                }else if(profession.length > 10) {
                    that.toast({text: '所学专业不能超过10个字符'});
                    return;
                }
                if(degree.length <= 0){
                    that.toast({text: '请选择您的学历'});
                    return;
                }
                if(!startTime){
                    that.toast({text: '请选择您的起始时间'});
                    return;
                }else if(!endTime){
                    that.toast({text: '请选择您的毕业时间'});
                    return;
                }else if(startTime > endTime) {
                    that.toast({text: '开始日期不能大于结束日期'});
                    return;
                }
                return true;

            },
            closeBtn: function() {
                this.edu.isexpect = false;
            },        
            hideAddItem: function() {
                this.isAdd = false;
                this.isAddBtn = false;
            },
            showAddItem: function() {
                this.isAdd = true;
                this.isAddBtn = true;
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

<style>
    body{ background: #EEEDF2;}
    a{text-decoration: none;}
    /*重置样式*/
    .weui-cells {margin-top: 0!important;}   
</style>

<style scoped>
    .taopin-form-area {
        margin-top: 0.12rem;
    }
    .taopin-form-area:first-child {
        margin-top: 0;
    }
    .tp-edu-page .row{
        width: 100%;
        color:#333;
    }
    .taopin-form-card { margin-bottom: .25rem; }
    .tp-edu-item{background: #fff; border-radius: 5px; margin: 14px; margin-bottom: 15px;}
    .tp-edu-tit{
        overflow: hidden; 
        padding:0 .14rem;
        height: .5rem;
        line-height: .5rem;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #999999;
        letter-spacing: -0px;
    }
    .tp-edu-tit .txt{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #999999;
        letter-spacing: -0px;
    }
    .tp-edu-tit .del{
        display: inline-block;
        float: right;
        width: .11rem;
        height: .12rem;
        background:url('./images/del_btn.png') no-repeat;
        background-size: 100%;
        margin-top: .18rem;
    }
    .weui-cells {margin-top: 0!important;}
    .tp-edu-add {width: 100%;}
    .tp-edu-add a {
        display: block; 
        width: 100%;
        height: .44rem;
        line-height: .44rem;
        text-align: center; 
        font-size: 24px; 
        color:#666;
    }    

    
    
    
    
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

    .btn-step {
        position: fixed;
        bottom: 0;
        background: #fff;
        margin-top: .6rem;
        width: 3.75rem;
        height: .67rem;        
    }
    .btn-step a{
        background: #CCC;       
        border-radius: .05rem;
        display: block;
        text-align: center;        
        height: .4rem;
        line-height: .4rem;
        width: 3.45rem;
        margin: 0 auto;
        margin-top: .14rem;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #fff;
        letter-spacing: 2px;
    }
    .btn-step a.act {
        background: #FF4D4D url('./images/btn_line_bg.png') repeat-y;
        border-radius: .05rem;
        margin-top: .14rem;
        letter-spacing: 2px;
    }


    

</style>
