<template>
    <div class="container">
        <img src="./images/update.png"/>
    </div>
</template>

<script type="text/babel">
   export default{
       data(){
           return {

           }
       },
       mounted(){
           setTimeout(()=>{
               this.propsTitle()
           },200)
       },
       methods:{
           /*
            * @description: 客户端头部初始化
            *
            * @update: cxy (2017-03-07)
            */
           propsTitle(){
               //TODO:客户端读取标题信息
               util.JsBridge('propsTitle', {
                   title:util.toUniCode('系统提示'),
                   color: '#67a5ff'
               }, (res)=> {
               })
           },
       }
   }
</script>
<style scoped>
    .container {
        width: 100%;
        height:6.67rem;
        overflow-y: hidden;
        position: relative;
    }

    .container img {
        width: 100%;
        height:100%;
    }
</style>