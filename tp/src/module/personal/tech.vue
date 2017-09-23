<template>
    <div class="tp-tech-page">            
        <div class="tp-tech-wrap">
        <div class="tp-tech-row" v-for="(item, index) in techList">
                <p class="tp-tech-tit">{{item.dictName}}</p>
                <div class="tp-tech-list">

                    <span ref="techTags" :class="subItem.act ? 'act': ''" v-for="(subItem, idx) in item.subList" @click="sltTechItem(subItem)">
                        {{subItem.dictName}}
                    </span>                   
                </div>
            </div>           
            

        </div>  
        <div class="btn-step">
            <a href="javascript:" class="act" @click="saveUserInfo">
                保存
            </a>
        </div>  
    </div>
</template>



<script>
    import Vue from 'vue'
    import { Datetime, Group, Toast, ToastPlugin, PopupPicker } from 'vux'
    import api from 'api/api'
    var API = new api();
    Vue.use(ToastPlugin)

    export default {
        data() {
            return {               
                crtId: '',
                techList: [],
                sltList: [],
                skill: [],
                resSkill: '',
                tagList: [],
                flag: false,
                idx: ''      
            }
        },
        beforeMount () {
            // console.log('加载之前');
        },   
        mounted () {
            var uid = this.$route.query.resumeId;
            this.getSkill();
            
        },    
        methods: {                 
            sltTechItem: function(elem) { 
                var that = this;
                var skill = that.skill;
                var techList = this.techList;
                var len = that.tagList.length;   
                // console.log('techList', techList);             
                    techList.forEach(function(item, index){
                        var subList = item.subList;
                        subList.forEach(function(subItem, id){                             
                            if(subItem.dictName == elem.dictName && !subItem.act) {
                                if(len <= 4) {
                                    subItem.act = true;
                                    that.tagList.push(subItem.dictName)
                                }else{
                                    that.toast({text: '最多只能选择5个'})
                                }
                            }else if(subItem.dictName == elem.dictName && subItem.act == true) {
                                subItem.act = false;
                                that.removeTechItem(elem.dictName);                                
                            }
                        })
                    });
                             
            },   

            removeTechItem: function(name) {
                var idx;
                var that = this;                
                that.tagList.forEach(function(val, index){
                    if(val == name) {
                        idx = index;
                    }
                })
                that.tagList.splice(idx, 1);
            }, 
            expectJobShowFn: function() {
                var self = this;
                self.edu.isexpect = true;
            },
            closeBtn: function() {
                var self = this;
                self.edu.isexpect = false;
            },
            initEditList: function() {
                var that = this;
                var uid = that.$route.query.resumeId || '';
                var lid = localStorage.getItem('resumeId') || '';
                var rid = uid || lid;
                var param = {
                    id: rid
                };               
                API.getResumeDetail(param).then(function(res) {
                    var data = res.data;
                    var sltList=[];
                    var techList=[];
                    if(data.success == true) {
                        sltList = data.data.techniques;
                        techList = that.techList;
                        sltList.forEach(function(item, index) {
                            techList.forEach(function(techItem, id) {
                                var subList = techItem.subList;
                                subList.forEach(function(techSubItem, idx){
                                    if(techSubItem.dictName == item.technique) {
                                        that.$set(techSubItem, 'act', '');
                                    }
                                });                                
                            });                            
                        });
                        that.techList = techList;
                    }
                })
            },
            getSkill: function() { 
                var that = this;
                var uid = that.$route.query.resumeId;
                var param = {
                    parentId: 122,
                    isSub: 1
                };
                API.getDict(param).then(function(res) {
                    var data = res.data;
                    if(data.success == true) {
                        that.techList = data.data;                        
                        var resArr = data.data;
                        resArr.forEach(function(item, index){
                            var subList = item.subList;
                            subList.forEach(function(subItem, id){
                                that.$set(subItem, 'act', '');                        
                            });
                        });
                        that.techList = resArr;
                        if(uid) {
                            that.initEditList();
                        }                        
                    }else{
                        that.toast({text: data.desc});
                    }
                });
            },
            getDefaultList: function() {
                var that = this;
                var techList = that.techList;
                var tempList = [];
                techList.forEach(function(item, id) {
                    var subList = item.subList;
                    subList.forEach(function(subItem, idx){
                        if(subItem.act == true) {
                            // tempList.push(subItem.dictName);
                            tempList.push(subItem.dictName);
                        }
                    });                                
                });
                return tempList;
            },         
            saveUserInfo: function() {
                var that = this;
                var param;
                var uid = that.$route.query.resumeId || '';
                var lid = localStorage.getItem('resumeId') || '';
                var rid = uid || lid;
                var tList;
                // that.getDefaultList();
                
                if(uid) {
                    var arr = that.getDefaultList();
                    that.tagList = [];
                    that.tagList = arr;
                }
                
                tList = that.tagList.join(',')
                

                param = {
                    resumeId: rid,
                    skills: tList 
                };
                
                API.saveSkills(param).then(function(res) {
                    var data = res.data;
                    var channel = that.$route.query.channel;
                    if(data.success == true) {
                        if(channel == 'editlist') {
                            history.back();
                            // location.href = '#/editlist';
                        }else {
                            location.href = '#/extra';
                        }
                        
                    }else{
                        that.toast({text: data.desc});
                    }
                });
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
    body{background: #fff;}
</style>
<style scoped >
    .tp-tech-page {
        background: #fff;
    }  
    .tp-tech-wrap { 
        padding: .14rem; 
        margin-bottom: .8rem; 
    }   
    .tp-tech-row .tp-tech-tit{
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #999999;
        letter-spacing: 1px;
        margin-top: .18rem;
        margin-bottom: .04rem;
    }    
    .tp-tech-list span {
        display: inline-block;
        border: 1px solid #E4E4E4;
        color: #333;
        border-radius: 3px;
        padding: .085rem .15rem;
        margin-top: .06rem;
        margin-right: .06rem;
    }
    .tp-tech-list span.act {
        color: #4B90EF;
        border: 1px solid #4B90EF;
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
        bottom: .4rem;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #fff;
        letter-spacing: 2px;
        text-decoration: none;
    }
    .btn-step a.act {
        background: #FF4D4D url('./images/btn_line_bg.png') repeat-y;
        border-radius: .05rem;
        margin-top: .14rem;
        letter-spacing: 2px;
    }

</style>