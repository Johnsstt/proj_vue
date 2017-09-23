<template>
    <div class="container" ref="container">
        <classList :parentInfo="parentInfo" @toParentComponent="getSonInfo"></classList>
        <div>
            <div class="formWrap">
                <div class="elWrap">
                    <input type="text" placeholder="请输入任务内容"/>
                </div>
                <div class="elWrap">
                    <div>任务提交周期</div>
                    <div></div>
                </div>
                <div class="elWrap">
                    <div>任务开始时间</div>
                    <div></div>
                </div>
                <div class="elWrap">
                    <div>任务结束时间</div>
                    <div></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import classList from '../../../components/classList/checkBoxClassList.vue'
    export default{
        data(){
            return{
                parentInfo:{appCode:'APP_OPUS',title:'今日作品'},
                classId:''
            }
        },
        components:{
            classList
        },
        methods:{
            getSonInfo(info){
                if(info==0){
                    this.$refs.container.style.overflowY='hidden';

                }else if(info==1){
                    this.$refs.container.style.overflowY='auto';

                }else{
                    this.$nextTick(function(){
                        this.classId=info;
                    })
                }
            },
        }
    }
</script>
<style scoped>
    .container {
        width: 100%;
        height: 100%;
        position: relative;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
    }
    .formWrap{
        margin:0 0.12rem;
        font-size:0.15rem;
        color:#42454c;
    }
    .elWrap{
        width:100%;
        height:100%;
        margin-top:0.32rem;
        padding-bottom:0.12rem;
        border-bottom:0.01rem solid #f2f4fa;
        font-size:0.15rem;
        color:#a1a6b1;
    }
    input::-webkit-input-placeholder{
        font-size:0.15rem !important;
        color:#a1a6b1 !important;
    }
</style>
