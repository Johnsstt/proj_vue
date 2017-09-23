const login = r => require.ensure([], () => r(require('../../module/user/login/login.vue')), 'module')
const noSupport = r => require.ensure([], () => r(require('../../module/system/update.vue')), 'module')
const test = r => require.ensure([], () => r(require('../../module/user/login/test.vue')), 'module')
//温故知新
const homeworkAdd = r => require.ensure([], () => r(require('../../module/application/homework/add.vue')), 'homework')
const homeworkList = r => require.ensure([], () => r(require('../../module/application/homework/list.vue')), 'homework')
const homeworkTchList = r => require.ensure([], () => r(require('../../module/application/homework/tchlist.vue')), 'homework')
const homeworkCallBack = r => require.ensure([], () => r(require('../../module/application/homework/callback.vue')), 'homework')
const homeworkSubmit = r => require.ensure([], () => r(require('../../module/application/homework/submit.vue')), 'homework')
//多段作业
const multiworkAdd = r => require.ensure([], () => r(require('../../module/application/multiwork/add.vue')),'multiwork')
//学员风采
const videoAdd = r => require.ensure([], () => r(require('../../module/application/video/add.vue')), 'video')
const videoList = r => require.ensure([], () => r(require('../../module/application/video/list.vue')), 'video')
const videoDetail = r => require.ensure([], () => r(require('../../module/application/video/detail.vue')), 'video')
const videoTchDetail = r => require.ensure([], () => r(require('../../module/application/video/tchDetail.vue')), 'video')
const videoClaim = r => require.ensure([], () => r(require('../../module/application/video/claim.vue')), 'video')
//今日作品
const opusAdd = r => require.ensure([], () => r(require('../../module/application/opus/add.vue')), 'opus')
const opusAddList = r => require.ensure([], () => r(require('../../module/application/opus/addList.vue')), 'opus')
const opusList = r => require.ensure([], () => r(require('../../module/application/opus/list.vue')), 'opus')
const opusStuList = r => require.ensure([], () => r(require('../../module/application/opus/studentList.vue')), 'opus')
const opusDetail = r => require.ensure([], () => r(require('../../module/application/opus/detail.vue')), 'opus')
//课堂直播
const liveList = r => require.ensure([], () => r(require('../../module/application/live/liveList.vue')), 'live')
//教室查看学生档案
const studentRecord = r => require.ensure([], () => r(require('../../module/studentRecord/record.vue')), 'record')
const studentHomework = r => require.ensure([], () => r(require('../../module/studentRecord/homeworkDetail.vue')), 'record')
//学历证书
const addDegree = r => require.ensure([], () => r(require('../../module/application/cert/addDegree.vue')), 'cert')
const addTestimonials = r => require.ensure([], () => r(require('../../module/application/cert/addTestimonials.vue')), 'cert')
const degreeList = r => require.ensure([], () => r(require('../../module/application/cert/degreeList.vue')), 'cert')
const testimonialsList = r => require.ensure([], () => r(require('../../module/application/cert/testimonialsList.vue')), 'cert')
//消息推送
const noticeAdd = r => require.ensure([], () => r(require('../../module/application/notice/add.vue')), 'notice')
const noticeList = r => require.ensure([], () => r(require('../../module/application/notice/list.vue')), 'notice')
const noticeTchDetail = r => require.ensure([], () => r(require('../../module/application/notice/tchDetail.vue')), 'notice')
const noticeTchList = r => require.ensure([], () => r(require('../../module/application/notice/tchList.vue')), 'notice')
const noticeDetail = r => require.ensure([], () => r(require('../../module/application/notice/detail.vue')), 'notice')

//我的宝箱
const treasureBoxList = r => require.ensure([], () => r(require('../../module/application/treasurebox/list.vue')), 'treasurebox')
const addBoxCategory = r => require.ensure([], () => r(require('../../module/application/treasurebox/addCategory.vue')), 'treasurebox')
const shareBoxCategory = r => require.ensure([], () => r(require('../../module/application/treasurebox/share.vue')), 'treasurebox')
const addNetworkResources = r => require.ensure([], () => r(require('../../module/application/treasurebox/addNetworkResources.vue')), 'treasurebox')
const addLocationResources = r => require.ensure([], () => r(require('../../module/application/treasurebox/addLocationResources.vue')), 'treasurebox')


const addReferral = r => require.ensure([], () => r(require('../../module/application/referral/add.vue')), 'referral')
const listReferral = r => require.ensure([], () => r(require('../../module/application/referral/list.vue')), 'referral')


export default [
    {
        path: '/', component: login
    },
    {
        path: '/test', component: test
    },
    //温故知新
    {
        path: '/app/homework/add', component: homeworkAdd
    },
    {
        path: '/app/homework/callback', component: homeworkCallBack
    },
    {
        path: '/app/homework/tchList', component: homeworkTchList
    },
    {
        path: '/app/homework/list', component: homeworkList
    },
    {
        path: '/app/homework/submit', component: homeworkSubmit
    },
    //多段作业
    {
        path: '/app/multiwork/add', component: multiworkAdd
    },
    //学员风采
    {
        path: '/app/video/add', component: videoAdd
    },
    {
        path: '/app/video/list', component: videoList
    },
    {
        path: '/app/video/tchDetail', component: videoTchDetail
    },
    {
        path: '/app/video/detail', component: videoDetail
    },
    {
        path: '/app/video/claim', component: videoClaim
    },
    //今日作品
    {
        path: '/app/opus/add', component: opusAdd
    },
    {
        path: '/app/opus/addList', component: opusAddList
    },
    {
        path: '/app/opus/list', component: opusList
    },
    {
        path: '/app/opus/stuList', component: opusStuList
    },
    {
        path: '/app/opus/detail', component: opusDetail
    },
    //视频直播
    {
        path: '/app/live/list', component: liveList
    },
    //学生档案
    {
        path: '/studentRecord/record', component: studentRecord
    },
    {
        path: '/studentRecord/studentHomework', component: studentHomework
    },
    //系统更新
    {
        path: '/update', component: noSupport
    },
    //学历证书
    {
        path: '/app/cert/addDegree', component: addDegree
    },
    {
        path: '/app/cert/addTestimonials', component: addTestimonials
    },
    {
        path: '/app/cert/degreeList', component: degreeList
    },
    {
        path: '/app/cert/testimonialsList', component: testimonialsList
    },
    //消息推送
    {
        path: '/app/notice/add', component: noticeAdd
    },
    {
        path: '/app/notice/list', component: noticeList
    },
    {
        path: '/app/notice/tchList', component: noticeTchList
    },
    {
        path: '/app/notice/detail', component: noticeDetail
    },
    {
        path: '/app/notice/tchDetail', component: noticeTchDetail
    },
    //我的宝箱
    {
      path: '/app/treasurebox/list', component: treasureBoxList
    },
    {
        path: '/app/treasurebox/addCategory', component: addBoxCategory
    },
    {
        path: '/app/treasurebox/share', component: shareBoxCategory
    },
    {
        path: '/app/treasurebox/addNetworkResources', component: addNetworkResources
    },
    {
        path: '/app/treasurebox/addLocationResources', component: addLocationResources
    },
    //我的介绍
    {
        path: '/app/referral/add', component: addReferral
    },

    {
      path: '/app/referral/list', component: listReferral
    },


    {
        path: '*', redirect: '/'
    }
]