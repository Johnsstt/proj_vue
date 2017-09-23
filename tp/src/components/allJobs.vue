<template>
    <div class="taopin-job-page">        
        <div class="taopin-all-jobs">
    		<ul class="first-list">
                <li class="first-item" :class="index == crtFirstIndex ? 'act' : ''" v-for="(item, index) in jobList" @click="sltFirstJob(item, index)" v-html="item.dictName"></li>
    		</ul>

            <ul class="second-list" v-for="(item, index) in newList" v-show="index == crtFirstIndex">
                <li class="second-item" :class="idx === crtSecondIndex ? 'act': ''" @click="sltSecondJob(subItem, idx)" v-for="(subItem, idx) in item" v-html="subItem.dictName"></li>
            </ul>

        </div>
    </div>
</template>

<script>
    import api from 'api/api'
    var Api = new api();
    export default {
        data() {
            return {
                jobList: [],
                newList: [],
                crtFirstIndex: '',
                crtSecondIndex: ''                           
            }
        },
        components: {
        },
        mounted : function() {
            this.getHopeJob();
        },
        methods: {
            sltFirstJob: function(item, id) {
                var self = this;
                self.crtFirstIndex = id;
                self.crtSecondIndex = '';
            },

        	sltSecondJob: function(item, id) {
                var self = this;
                self.setHopeJob(item);
                // window.location.href = '#/job'
                // setTimeout(function(){
                    history.back();
                // }, 0);
        	},            
            setHopeJob: function(item) {
                var self = this;
                self.removeHopeJob(); 
                console.log('item--->', item);
                localStorage.setItem('hopeJobFirst', item.parentName);
                localStorage.setItem('hopeJobFirstId', item.parentId);
                localStorage.setItem('hopeJobSecond', item.dictName);
                localStorage.setItem('hopeJobSecondId', item.dictId);
            },
            removeHopeJob: function() {
                localStorage.removeItem('hopeJobFirst');
                localStorage.removeItem('hopeJobFirstId');
                localStorage.removeItem('hopeJobSecond');
                localStorage.removeItem('hopeJobSecondId');
            },
            getHopeJob: function() {
                var self = this;
                var param = {
                    parentId:108,
                    isSub:1
                };
                Api.getDict(param).then(function(res){
                    var data = res.data;
                    if(data.success == true) {
                        self.jobList = data.data;  
                        self.formatHopeData();                   
                    }
                });
            },
            formatHopeData: function() {
                var self = this;                
                var newList = [];
                var hopeList = self.jobList;
                hopeList.forEach(function(item){
                    var subList = item.subList;
                    subList.forEach(function(sub){
                        sub['parentName'] = item.dictName;
                        sub['parentId'] = item.dictId;
                    });
                    newList.push(subList);
                });                
                self.newList = newList;
            }
        }
    }
</script>

<style>
    .taopin-all-jobs {
        background: #fff;
        overflow: hidden;
        position: relative;
        width: 3.75rem;    
        height: 6.67rem;    
    }
    .taopin-all-jobs .first-list {
        background: #F9F9F9;        
        float: left;
        width: 1.3rem;
        margin-bottom:-9999px;
        padding-bottom:9999px;
    }
    .first-list .first-item {        
        height: .46rem;
        line-height: .46rem;
        text-align: center;
    }
    .first-list .first-item.act {
        background: #fff;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #FF4D4D;
        letter-spacing: 0;
    }
    .taopin-all-jobs .second-list {
        width: 2.45rem;
        float: left;       
        /*display: none; */
    }
    .second-list .second-item {
        border-bottom: 1px solid #F9F9F9;
        height: .46rem;
        line-height: .46rem;
        padding-left: .35rem;

        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666666;
        letter-spacing: 0;
    }
    .second-list .second-item.act {        
        color: #FF4D4D;
    }
</style>
