<template>
    <div>
        <router-link :to="{ path: '/app/homework/add'}"  class="panel">温故知新添加页</router-link>
        <router-link :to="{ path: '/app/homework/list'}" class="panel">温故知新学生列表页</router-link>
        <router-link :to="{ path: '/app/homework/tchList'}"  class="panel">温故知新老师列表页</router-link>
        <router-link :to="{ path: '/app/video/add'}"  class="panel">学员风采添加页</router-link>
        <router-link :to="{ path: '/app/video/list'}" class="panel">学员风采列表页</router-link>
        <router-link :to="{ path: '/app/video/claim'}" class="panel">学员风采认领页</router-link>
        <router-link :to="{ path: '/app/opus/addList'}"  class="panel">今日作品添加列表</router-link>
        <router-link :to="{ path: '/app/opus/list'}"  class="panel">今日作品列表</router-link>
        <router-link :to="{ path: '/app/live/list'}"  class="panel">直播列表</router-link>
        <router-link :to="{ path: '/studentRecord/record'}"  class="panel">查看学生档案</router-link>
        <router-link :to="{ path: '/app/notice/add'}"  class="panel">消息推送添加页</router-link>
        <router-link :to="{ path: '/app/notice/list'}"  class="panel">消息推送学生列表页</router-link>
        <router-link :to="{ path: '/app/notice/tchList'}"  class="panel">消息推送教师列表页</router-link>
        <router-link :to="{ path: '/app/notice/detail'}"  class="panel">消息推送学生详情页</router-link>
        <router-link :to="{ path: '/app/notice/tchDetail'}"  class="panel">消息推送教师详情页</router-link>
        <router-link :to="{ path: '/app/treasurebox/list'}"  class="panel">我的宝箱</router-link>
        <router-link :to="{ path: '/app/referral/add'}"  class="panel">我的介绍添加老师</router-link>
        <router-link :to="{ path: '/app/referral/list'}"  class="panel">我的介绍list列表</router-link>
    </div>
</template>
<style scoped>
    .panel{
        display: block;
        width:100%;
        height:0.5rem;
        margin-top:0.2rem;
    }
</style>
<script>

</script>
