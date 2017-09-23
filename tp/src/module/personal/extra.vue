<template>
    <div class="tp-extra-page">        
        <div class="tp-extra-item">
            
            <div class="tp-extra-row">
                <div class="tp-extra-self">
                    <div class="tp-extra-label">
                        <span class="txt">自我介绍</span>
                        <span class="att">限20个字</span>
                    </div>
                    <div class="tp-extra-con">
                        <textarea name="" class="textarea" v-model="selfAppraisal" placeholder="介绍一下自己的优势" @change="saveSelfIntro"></textarea>
                    </div>
                </div>
                <div class="tp-tags-row tp-extra-skill">
                    <label class="tp-extra-label tag-label">掌握技能</label>
                    <div class="tp-extra-con tag-list">
                        <span class="tag-add" @click="addTech">＋</span>
                        <span class="tag-item" v-for="(item, index) in tagList">{{item.technique}}</span>
                    </div>
                </div>
            </div>

            <div class="tp-extra-row proj-area">
                <div class="proj-tit">
                    <span class="proj-icon"><em></em>项目经验</span>
                </div>
                <ul class="proj-list">
                    <li class="proj-item" v-for="(item, index) in projList">
                        <span class="name">{{item.projectName}}</span>
                        <span class="post">{{item.projectDuty}}</span>
                        <span class="icon"></span>
                    </li>                    
                </ul>
                <a class="taopin-add-btn" href="javascript:" @click="addProj"><span></span></a>  
            </div>            
        </div>
        <!-- 保存额外信息 -->
        <div class="btn-step" @click="saveUserInfo">
            <a href="javascript:" class="act">
               <span v-if="isComplete">完成</span>
               <span v-if="!isComplete">完成去找工作</span> 
            </a>            
        </div>
        
    </div>
</template>

<script>
    import Vue from 'vue'
    import api from 'api/api'
    import { XTextarea, Group, XInput, ToastPlugin } from 'vux'
    import './style/layout.css'
    var API = new api();
    Vue.use(ToastPlugin)


    export default {
        data() {
            return {               
                extra: {
                    id: ''           
                },
                isComplete: false,
                selfAppraisal: '',
                projList: [],
                tagList: []               
            }
        },
        components: {
            XTextarea,
            Group,
            XInput            
        },
        activated: function() { 
            // this.initEditList();
            this.getProjList();
        },
        mounted: function() {
            var channel = this.$route.query.channel;
            var uid = this.$route.query.resumeId || '';
            var lid = localStorage.getItem('resumeId') || '';
            var rid = uid || lid;
            // var resumeId = this.$route.query.resumeId || localStorage.getItem('resumeId');
            if(channel) {
                this.isComplete = true;
            }
            if(uid) {
                this.initEditList();
            }
            
        },
        methods: {
            addTech: function() {
                location.href="#/tech";
            },           
            expectJobShowFn: function() {
                var self = this;
                self.edu.isexpect = true;
            },
            addProj: function() {                            
                location.href = '#/proj';
                         
            },
            initEditList: function() {
                var that = this;
                var param = {
                    id: that.$route.query.resumeId || ''
                };                
                
                API.getResumeDetail(param).then(function(res) {
                    var data = res.data;
                    if(data.success == true) {
                        that.projList = data.data.projects;
                        that.tagList = data.data.techniques;
                        that.selfAppraisal = data.data.selfAppraisal;
                        console.log('保存值：', data);
                    }                    
                })
            },
            saveSelfIntro: function() {
                var that = this;
                var uid = that.$route.query.resumeId || '';
                var lid = localStorage.getItem('resumeId') || '';
                var rid = uid || lid;
                var param = {
                    id: rid,
                    selfAppraisal: that.selfAppraisal 
                };
                API.saveSelfAppraisal(param).then(function(res){
                    var data = res.data;
                    
                    if(data.success == true) {                        
                        console.log('个人信息保存成功');
                    }
                })
            },
            saveUserInfo: function() {
                var that = this;
                var channel = that.$route.query.channel;
                var resumeId = this.$route.query.resumeId;
                var isFlag = that.verifyForm();
                if(isFlag) {
                    if(resumeId) {
                        location.href="#/editlist?resumeId=" + resumeId;
                    }else{
                        location.href = 'http://daily.imaijia.com' + '/mobile/job.htm';
                    }
                    
                }
            },
            closeBtn: function() {
                var self = this;
                self.edu.isexpect = false;
            },
            getProjList: function() {
                var that = this;
                var param = {
                    id: localStorage.getItem('resumeId')
                };
                API.getResumeDetail(param).then(function(res) {
                    var data = res.data;
                    if(data.success == true) {
                        that.projList = data.data.projects;
                        that.tagList = data.data.techniques;
                    }
                });
            },
            verifyForm: function() {
                var that = this;
                var selfInfo = that.selfAppraisal;
                var tagList = that.tagList;
                var projList = that.projList;



                if(!selfInfo) {
                     that.toast({ text: '请填写自我介绍' });
                     return;
                }else if(selfInfo.length > 20) {
                    that.toast({text: '自我介绍不能超过20个字符'});
                    return;
                }

                if(tagList.length <= 0) {
                    that.toast({text: '请添加个人技能'});
                    return;
                }

                if(projList.length <= 0) {
                    that.toast({text: '请添加项目经验'});
                    return;
                }
                return true;
            },            
            toast: function(o) {
                this.$vux.toast.show({
                    width: 60 + '%',
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
    a{text-decoration: none;}
</style>
<style scoped >    
    .tp-extra-page {}
    .tp-extra-page .tp-extra-item {
        padding: .14rem;
    }
    .taopin-add-btn {
        border-top:none!important;
    }
    .tp-extra-row{
        background: #fff;
        border-radius: 5px;
    }
    .tp-extra-self {
        display: flex;  
        padding: 10px;

    }
    .tp-extra-label {
        display: block;
        width: 105px;
        word-wrap: break-word;
        word-break: break-all;
    }
    .tp-extra-label span {
        display: block;
    }
    .tp-extra-label .txt {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333333;
        letter-spacing: 0;
    }
    .tp-extra-label .att {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #999999;
        letter-spacing: 0;
    }
    .tp-extra-con {
        width: 100%;
        border: 0;
        outline: 0;
        -webkit-appearance: none;
        background-color: transparent;
        font-size: inherit;
        color: inherit;        
    }
    .tp-extra-con .textarea {
        width: 2.4rem;
        height: .63rem;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #999999;
        letter-spacing: 0;
    }
    
    .tp-extra-skill {
        display: flex;
        position: relative;
        border-top: 1px solid #EEEDF2;
        margin-left: .1rem;
        padding-top: .12rem;
        padding-bottom: .12rem;
    }
    .tp-extra-skill .tag-label {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333333;
        letter-spacing: 0;
        position: relative;
        margin-top: 5px;
    }
    .tp-extra-skill .tag-list {
        
    }
    .tp-extra-skill .tag-list span {
        display: inline-block;
    }
    .tp-extra-skill .tag-list .tag-add {
        width: .56rem;
        height: .32rem;
        line-height: .32rem;
        border: 1px dashed #ccc;
        border-radius: 3px;
        text-align: center;
        font-size: 14px;
    }
    .tp-extra-skill .tag-list .tag-item {
        height: .32rem;
        line-height: .32rem;
        padding: 0 14px;
        border: 1px solid #EEEDF2;
        border-radius: 3px;
        text-align: center;
        font-size: 14px;
        color: #666;
        margin-bottom: .08rem;
        margin-right: .08rem;
    }
    .proj-area {
        margin-top: 14px;
        margin-bottom: .65rem;
    }
    .proj-area .proj-tit {
        border-bottom: 1px solid #EEEDF2;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #999999;
        letter-spacing: 0;
        height: .39rem;
        line-height: .39rem;
        padding-left: 10px;
    }
    .proj-area .proj-tit .proj-icon {
        display: inline-block;
        font-size: 12px;
    }
    .proj-tit .proj-icon em{
        display: inline-block;
        width: .12rem;
        height: .14rem;
        background: url('./images/proj_icon.png') center no-repeat;
        background-size: 100%;
        margin-top: 12px;
        margin-right: 6px;
        float: left;
    }
    .proj-area .proj-list {}
    .proj-list .proj-item {
        border-bottom: 1px solid #EEEDF2;
        overflow: hidden;
        height: .44rem;
        line-height: .44rem;
        padding: 0 10px;
    }
    .proj-list .proj-item span{display: inline-block;}
    .proj-list .proj-item .name{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333333;
        letter-spacing: 0;
        width: 2.6rem;
        height: .44rem;
        line-height: .44rem;
        float: left;
    }
    .proj-list .proj-item .post{
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
        width: .5rem;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        float: left;
        margin-right: .08rem;
    }
    .proj-list .proj-item .icon{
        display: inline-block;
        width: .05rem;
        height: .1rem;
        background: url('./images/arr_icon.png') center no-repeat;
        background-size: 100%;
    }

    .proj-add a {
        display: block;
        height: .44rem;
        line-height: .44rem;
        text-align: center;
        font-size: .24rem;
        color:#666;
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