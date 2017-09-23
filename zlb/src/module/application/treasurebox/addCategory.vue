<template>
    <div class="add-category-wrap">
        <div class="category-name">
            <input type="text" maxlength="6" placeholder="请输入分类名" />
        </div>
        <p class="add-att">6个字以内</p>
    </div>
</template>
<style>
    body{
        background-color:#F6F7F8;
    }
    .add-category-wrap{
        padding:0 .12rem;
    }    
    .category-name {
        margin: .15rem 0 .1rem;
    }
    .category-name input{
        background:#ffffff;
        border:1px solid #dcdcdc;
        border-radius:0.05rem;
        color:#33373f;
        width:3.50rem;
        height:.43rem;
        padding-left: 8px;
    }
    .add-att{
        font-size:14px;
        color:#ccc;
        text-align:left;
    }
</style>
<script>

    export default{
        data(){
            return{
                category: {
                    name: '分类名字'
                }
            }
        },
        methods(){

        }
    }
</script>
