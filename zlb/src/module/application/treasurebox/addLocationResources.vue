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
            <input type="text" maxlength="8"  placeholder="请输入名字(最多8个字)" v-model="categoryText" />
        </div>

        <div class="imgs-show">
            <div class="imgs-item" v-for="(item, idx) in showList">
                <span class="icon-close" @click="closePidItem($event, idx)"></span>
                {{item.alt}}
                <img src="" />
            </div>
        </div>
        
        <div class="addTypeList" flex v-if="pices.length<9">
            <img src="./images/add_album.png" @click="changeFile('album')">
            <img src="./images/add_camera.png" @click="changeFile('camera')">
            <img src="./images/add_video.png" @click="changeFile('video')">
            <!-- <img src="./images/add_audio.png" @click="changeFile('audio')"> -->
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
                showList: [
                    {
                        img: '',
                        alt: '测试一'
                    },
                    {
                        img: '',
                        alt: '测试二'
                    },
                    {
                        img: '',
                        alt: '测试三'
                    },
                    {
                        img: '',
                        alt: '测试四'
                    },
                    {
                        img: '',
                        alt: '测试五'
                    }
                ],
                categoryText: '',
                pices: [],
                isTageShow: false,
                categoryList: []
            }
        },
        methods: {
            /*
             * @description: 调用客户端上传文件
             *
             * @update: cxy (2017-03-06)
             */
            changeFile(type){
                //TODO:客户端上传文件
                if (9 - this.pices.length > 0) {
                    util.JsBridge('getPicesList', {
                        picItemCount: 9 - this.pices.length,
                        showType: type,
                        appType: 'APP_HOMEWORK'
                    }, (res)=> {
                        if (res.uploadCount == 3) {
                            this.message = '当前上传总数已达上限,请稍后重试';
                            this.snackbar = true
                            if (this.snackTimer) clearTimeout(this.snackTimer)
                            this.snackTimer = setTimeout(() => {
                                this.snackbar = false
                            }, 2000);
                        } else {
                            this.changeFileCallBack(res);
                        }
                    })
                } else {
                    this.message = '您最多只能上传9个附件';
                    this.snackbar = true
                    if (this.snackTimer) clearTimeout(this.snackTimer)
                    this.snackTimer = setTimeout(() => {
                        this.snackbar = false
                    }, 2000)
                }
            },
            /*
             * @description: 客户端上传文件后回调
             *
             * @update: cxy (2017-03-07)
             */
            changeFileCallBack(res){
                for (let i = 0; i < res.length; i++) {
                    res[i].datathumbnail = 'data:image/png;base64,' + res[i].datathumbnail;
                }
                this.pices = this.pices.concat(res);
                if (this.pices.length > 0) {
                    this.picesCheck = true
                } else {
                    this.picesCheck = false
                }
                this.toBottomFun();
                this.buttonColorCheck();
            },
            categoryOpreateFn() {
                this.isTageShow = ! this.isTageShow;
            },
            closePidItem(ele, index) {
                this.showList.splice(index, 1);
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
                console.log('提交的数据是', this.list, '分类名字', this.categoryText);                       
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
        position: relative;
        width: 100%;
        height: 100%;
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
    
    .imgs-show {        
        display: flex;
        flex-flow: row wrap;
    }
    .imgs-show .imgs-item{
        margin:0 .03rem .03rem 0;
        background: #fff;
        width: 1.14rem;
        height: 1.14rem;
        position: relative;
    }
    .imgs-item .icon-close{
        display:inline-block;        
        width: .25rem;
        height: .25rem;
        position: absolute;
        top: .03rem;
        right: .03rem;
        background:rgba(0,0,0,0.40) url('../../../assets/closeImg.png') center no-repeat;
        background-size: .1rem .1rem;
        border-radius:100%;
        text-align: center;
        color:#fff;
    }
    .imgs-item .pic{position: absolute;}

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

    .addTypeList {
        position:absolute;
        bottom: 0.16rem;
        margin-left: 0.59rem;
        padding-top: 0.21rem;
        margin-bottom: 0.15rem;
    }
    .addTypeList img {
        width: 0.4rem;
        height: 0.4rem;
        margin-right: 0.26rem;
    }
</style>
