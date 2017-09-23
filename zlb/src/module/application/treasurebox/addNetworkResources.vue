<template>
    <div class="category-wrap">        
        <div class="tags-slt">
            <p @click="categoryOpreateFn" class="tags-btns">
                选择分类
                <span>
                    <b class="bottom"><i class="bottom-arrow1"></i><i class="bottom-arrow2"></i></b>
                </span>
            </p>
            
            <ul class="tags-list" v-if="isTageShow">
                <li :class="['tags-item', { 'active': item.sld === true }]" ref="tagItem" v-for="(item, index) in tagList" @click="tagClkedFn($event, item, index)" :data-tid="item.id" >{{item.name}}</li>
            </ul>
        </div>
        <div class="category-name">
            <input type="text" v-model="categoryText" maxlength="8" placeholder="请输入名字(最多8个字)" />
        </div>
        <div class="category-text">
            <textarea placeholder="请输入链接" v-model="categoryDesc"></textarea>
        </div>
    </div>
</template>

<script>

    export default{
        data(){
            return{
                tagList: [
                    {
                        id: 11,
                        name: '分类名字',
                        sld: false
                    },
                    {
                        id: 12,
                        name: '分类12',
                        sld: false
                    },
                    {
                        id: 13,
                        name: '分类14',
                        sld: false
                    },
                    {
                        id: 14,
                        name: '分类15',
                        sld: false
                    }
                ],
                isTageShow: false,
                categoryText: '',
                categoryDesc: ''
            }
        },
        methods: {
            categoryOpreateFn() {
                this.isTageShow = ! this.isTageShow;
            },
            tagClkedFn(event, curTar, index) {
               let tagList = this.tagList;
                let tempList = [];

                let attrNode = event.currentTarget.attributes;
                let classStr = attrNode[1].nodeValue;

                if(classStr.indexOf('active') > -1) {
                    tagList[index].sld = false;
                }else{
                    tagList[index].sld = true;
                }

                for(var i=0; i<tagList.length; i++) {
                    if(tagList[i].sld === true) {
                        tempList.push(tagList[i])
                    }
                }
                this.list = tempList;   
                console.log('提交的数据是', this.list, '分类名字', this.categoryText, '链接地址', this.categoryDesc);                            
            }
        }
    }
</script>

<style>
    body{
        background-color:#F6F7F8;
    }
    .category-wrap{
        padding:0 .12rem;
    }
    .tags-slt {margin: 0.1rem 0;}
    .tags-slt .tags-btns{
        background:#ffffff;
        border:1px solid #dcdcdc;
        border-radius:.05rem;
        width: 3.5rem;
        height:.43rem;
        line-height:.43rem;
        font-size:16px;
        color:#8b909b;
        padding-left: 0.08rem;
        position: relative;
    }
    
    .bottom{
        width:0.15rem;
        height:0.15rem;
        position:absolute;
        right:.15rem;
        top:.14rem;
        z-index: 2;/*兼容ie8-*/
    }

    .bottom-arrow1,.bottom-arrow2{
            width:0;
            height:0;
            display:block;
            position:absolute;
            left:0;
            top:0;
            z-index: 5;/*兼容ie8-*/
            border-bottom:10px transparent dashed;
            border-left:10px transparent dashed;
            border-right:10px transparent dashed;
            border-top:10px white solid;
            overflow:hidden;
    }
    .bottom-arrow1{
        top:1px;
        border-top:10px #ccc solid;
    }
    .bottom-arrow2{
        border-top:10px white solid;
    }

    .tags-slt .tags-btns em{
        display: inline-block;
        opacity:0.5;
        transform:rotate(-270deg);
        border:2px solid #999999;
        width:4px;
        height:10px;
    }
    .tags-slt .tags-list{
        background:#f5fbff;
        border:1px solid #deefff;
        border-radius:0.05rem;
        width:3.50rem;
        height:1.04rem;
        margin-top: 0.06rem;
    }
    .tags-list .tags-item{
        background:#ffffff;
        border:1px solid #deefff;
        border-radius:100px;
        height:0.28rem;
        line-height: 0.28rem;
        color:#333;
        font-size: 14px;
        display: inline-block;
        padding: 0 0.12rem;
        margin: 0.08rem 0.05rem;
    }
    .tags-list .tags-item.active{
        background: #67a5ff;
        color: #fff;
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
    .category-text textarea{
        background:#ffffff;
        border:1px solid #dcdcdc;
        border-radius:5px;
        width:3.5rem;
        height:.87rem;
        padding-left: 8px;
    }
    .add-att{
        font-size:14px;
        color:#ccc;
        text-align:left;
    }
</style>
