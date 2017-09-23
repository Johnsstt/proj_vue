<template>
    <div class="container" ref="container" v-cloak>
        <div class="tab-wrap" v-cloak>
            <ul class="tab-list" v-refresh="refresh" v-load="loadMore" ref="loadY">
                <div class="refresh">
                    <mu-circular-progress :size="30" />
                </div>
                <li class="tab-item" v-for="(item,index) in tablist">
                    <span>{{item.title}}</span>
                </li>
                <a class="upload-add-btn" href="javascript:"></a>
            </ul>
        </div>
        <div class="upload-wrap">
            <a href="javascript:" class="upload-sumit-btn">上传</a>
            <span class="capacity-wrap">容量：{{capacity.currentSize}}/{{capacity.totalSize}}</span>
        </div>
        <div class="pro-wrap">
            <ul class="pro-list">
                <li class="pro-item">
                    <span class="time">{{proList.time}}</span>
                    <p class="desc">{{proList.desc}}</p>
                    <div class="img">
                        {{proList.img}}
                    </div>
                    <div class="extra-area">
                        <div class="tag-item">
                            <span>{{proList.tag}}</span>
                        </div>
                        <div class="opreate">
                            <a href="javascript:" class="share">转发</a>
                            <a href="javascript:" class="del">删除</a>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>

</template>
<style>
    .tab-wrap{}
    .tab-wrap .tab-list{}
    .tab-list .tab-item{}
    .tab-list .upload-add-btn{}

    .upload-wrap{}
    .upload-wrap .upload-sumit-btn{}
    .upload-wrap .capacity-wrap{}

    .pro-wrap{}
    .pro-wrap .pro-list{}
    .pro-wrap .pro-list .pro-item{}
    .pro-item .time{}
    .pro-item .desc{}
    .pro-item .img{}
    .pro-item .extra-area{}
    .extra-area .tag-item{}
    .extra-area .opreate{}
    .opreate .share{}
    .opreate .del{}

    .mu-circular-progress{
        margin:0.1rem 0;
    }








</style>
<script>
    export default{
        data(){
            return{
                tablist:[{
                    title:'全部'
                },{
                    title:'教学视频'
                },{
                    title: '备课本'
                }],
                capacity: {
                    currentSize: 3,
                    totalSize: 10
                },
                proList: [
                    {
                        time: '上午 11:56',
                        desc: '学员风采的课堂视频，主体为表演',
                        img: '',
                        tag: '教学视频',
                    }
                ]
            }
        }
    }
</script>
