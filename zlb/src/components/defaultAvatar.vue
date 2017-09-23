<template>
    <div class="avatar" :style="{backgroundColor:bgColor}" flex="cross:center main:center">
        <div class="name" v-text="name"></div>
    </div>
</template>
<script type="text/babel">
    export default{
        data(){
            return {
                colorList: ['#F5B6A5', '#F2DB8E', '#FAB9CF', '#A2E4F2', '#B4D3FF', '#ECC6F6', '#F3CEA4', '#C1E896', '#9BEFD8', '#D2CBFE'],
                bgColor:'',
                name:''
            }
        },
        props:['userId','userName'],
        mounted(){
            this.$nextTick(function(){
                this.getDefaultAvatar();
                this.getDefaultName();
            })
        },
        methods: {
            /*
             * @description: 获取默认头像颜色
             *
             * @update: cxy (2017-03-29)
             */
            getDefaultAvatar(){
                let color = this.colorList[this.userId % this.colorList.length];
                this.bgColor=color;
            },
            /*
             * @description: 获取默认头像名字
             *
             * @update: cxy (2017-03-29)
             */
            getDefaultName(){
                if(this.userName){
                    let name=this.userName.substr(0,1);
                    this.name=name;
                }
            }
        }
    }
</script>
<style scoped>
    .avatar {
        width:100%;
        height:100%;
        border-radius:100%;
    }
    .name{
        font-size:0.16rem;
        color:#ffffff;
    }
</style>
