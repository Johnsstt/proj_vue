import Vue from 'vue'
import axios from 'axios'
import config from './config'
export const imagedomain = "https://images.bestjlb.com/";


//export const domain='http://101.69.254.162:8001/jlb-web-front-app/'
//const webapiHost = 'http://101.69.254.162:8101/';
//const host = 'http://101.69.254.162:8100/';

//export const domain = 'http://10.10.10.22:8001/jlb-web-front-app/'; api后端接口
//const webapiHost='http://10.10.10.23:8101/';
//const host='http://10.10.10.23:8100/';

export const domain = 'https://test-html.bestjlb.com/';//api接口
const webapiHost = 'https://test-web-api.bestjlb.com/';//验证
const host = 'https://test-authen.bestjlb.com/';//登录


class API {
    //获取用户信息
    getUserInfo(param){
        return axios(domain+'jlbapp/user/getSelfInfo.shtml',{
            params:param
        })
    }
    //获取微信验证
    getWeChat(param) {
        return axios(domain + 'connect/getWeixinTicket.shtml', {
            params: param
        });
    }
    //版本更新
    update(param){
        return axios(webapiHost + 'package/up2date', {
            params: param
        });
    }

    //获取登录验证token
    getToken(param) {
        return axios.post(host + 'login', param);
    }

    //获取班级列表
    getClassList(param) {
        return axios(domain + 'class/findUserOwnClasses.shtml', {
            params: param
        });
    }

    //保存作业
    saveHomework(param) {
        config.params = param;
        return axios.post(domain + 'jlbapp/homework/tch_mng/saveV110.shtml', {}, config)
    }

    //老师详情页数据
    getTchData(param) {
        return axios.get(domain + 'jlbapp/homework/tch_mng/manage.shtml', {
            params: param
        });
    }

    //评论
    setComment(param) {
        config.params = param;
        return axios.post(domain + 'jlbapp/parts/comment/save.shtml', {},config);
    }

    //删除评论
    delComment(param) {
        return axios.get(domain + 'jlbapp/parts/comment/delete.shtml', {
            params: param
        });
    }

    //获取作业列表页数据
    getHomeworkList(param) {
        return axios.get(domain + 'jlbapp/homework/list.shtml', {
            params: param
        });
    }

    //获取老师作业列表页数据
    getTchHomeworkList(param) {
        return axios.get(domain + 'jlbapp/homework/findPagerForTch.shtml', {
            params: param
        });
    }

    //提交作业详情页获取作业
    getHomeworkSubmit(param) {
        return axios.get(domain + 'jlbapp/homework/detail.shtml', {
            params: param
        });
    }

    //提交作业详情页保存作业
    saveHomeworkSubmit(param) {
        return axios.get(domain + 'jlbapp/homework/replyV110.shtml', {
            params: param
        });
    }

    //撤回作业
    cancelHomeworkSubmit(param) {
        return axios.get(domain + 'jlbapp/homework/revokeReplyV110.shtml', {
            params: param
        });
    }

    //保存风采
    saveVideo(param) {
        config.params = param;
        return axios.post(domain + 'jlbapp/vedio/tch_mng/saveV110.shtml', {}, config)
    }

    //学员风采家长列表
    getVideoList(param) {
        return axios.get(domain + 'jlbapp/vedio/findVedioPagerV110.shtml', {
            params: param
        });
    }

    //获取学员风采详情
    getVideoDetail(param) {
        return axios.get(domain + 'jlbapp/vedio/detailV110.shtml', {
            params: param
        });
    }

    //评论点赞
    setVideopraise(param) {
        return axios.get(domain + 'jlbapp/vedio/praiseOrCancle.shtml', {
            params: param
        });
    }

    //风采学生照片详情
    getVideoStudentPic(param) {
        return axios.get(domain + 'jlbapp/vedio/viewStudentPicV110.shtml', {
            params: param
        });
    }

    //学员风采认领
    setVideoclaim(param) {
        return axios.get(domain + 'jlbapp/vedio/claimPic.shtml', {
            params: param
        });
    }

    //学员风采删除回复
    delVideoReply(param) {
        return axios.get(domain + 'jlbapp/vedio/pic_comment/delete.shtml', {
            params: param
        });
    }

    //学员风采回复评论
    sendVideoReply(param) {
        return axios.get(domain + 'jlbapp/vedio/pic_comment/save.shtml', {
            params: param
        });
    }

    //学员风采分享后数据
    getShareData(param) {
        return axios.get(domain + 'jlbapp/vedio/shareView.shtml', {
            params: param
        });
    }
    //学员风采认领数据
    getClaimData(param) {
        return axios.get(domain + 'jlbapp/vedio/studentDetail.shtml', {
            params: param
        });
    }
    //今日作品添加页面数据
    getOpusData(param) {
        return axios.get(domain + 'jlb/opus/tch_mng/edit.shtml',{
            params:param
        });
    }
    //今日作品个人页面数据
    getPersonData(param){
        return axios.get(domain + 'jlb/opus/tch_mng/detial.shtml',{
            params:param
        });
    }
    //今日作品个人提交
    getPersonSubmit(param){
        return axios.get(domain + 'jlb/opus/tch_mng/submit.shtml',{
            params:param
        });
    }
    //今日作品上传
    getOpusSubmit(param){
        return axios.get(domain + 'jlb/opus/tch_mng/send.shtml',{
            params:param
        });
    }
    //今日作品学生列表
    getOpusStudentList(param){
        return axios.get(domain + 'jlb/opus/tch_mng/view.shtml',{
            params:param
        });
    }
    //今日作品列表
    getOpusList(param){
        return axios.get(domain + 'jlb/opus/opusStudent.shtml',{
            params:param
        });
    }
    //今日作品详情
    getOpusDetail(param){
        return axios.get(domain + 'jlb/opus/detialByTch.shtml',{
            params:param
        });
    }
    //获取直播列表数据
    getLiveList(param) {
        return axios.get(domain + 'jlbapp/liveVideo/list.shtml', {
            params: param
        });
    }

    //认领acceptShare
    acceptShare(param) {
        return axios.get(domain + 'jlbapp/user/acceptShare.shtml', {
            params: param
        });
    }

    //认领acceptShare
    downloadApp(param) {
        return axios.get(webapiHost + 'package/up2date', {
            params: param
        });
    }

    //请求应用班级列表
    getAppClassList(param) {
        return axios.get(domain + 'class/findUserAppAndClasses.shtml', {
            params: param
        });
    }

    //获取验证码
    getIdentifyCode(param) {
        return axios.get(host + '/captcha/get', {
            params: param
        });
    }

    //检查验证码
    checkIdentifyCode(param) {
        return axios.get(host + '/captcha/check', {
            params: param
        });
    }

    //验证码登录
    codeLogin(param) {
        config.params = param;
        return axios.post(host + '/login', {}, config);
    }

    //验证码检查
    checkMobile(param) {
        return axios.get(host + '/mobile/check', {
            params: param
        });
    }

    //验证关系
    checkRelation(param) {
        config.params = param;
        return axios.post(webapiHost + '/team/join', {}, config);
    }

    //教师查看学生档案学生信息
    getUser(param) {
        return axios.get(domain + 'jlbapp/user/tch_mng/getUserInfo.shtml', {
            params: param
        });
    }

    //教师查看学生档案温故知新
    getUserHomework(param) {
        return axios.get(domain + 'jlbapp/homework/findStudentReplyPager.shtml', {
            params: param
        });
    }

    //获取班级应用权限
    getClassApp(param) {
        return axios.get(domain + 'jlbapp/core/getArchivesClassApp.shtml', {
            params: param
        });
    }

    //教师查看学生档案学员风采
    getUserVideo(param) {
        return axios.get(domain + 'jlbapp/vedio/findStudentVideoPager.shtml', {
            params: param
        });
    }
    //查询班级和学生
    getGroupStudent(param) {
        return axios.get(domain + 'class/findGroupStudent.shtml', {
            params: param
        });
    }
    //消息推送添加
}


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    if (Uri.query().get('access_token')) {
        cookie.set('access_token', Uri.query().get('access_token'));
        cookie.set('token_type', 'bearer');
        config.headers['access_token'] = cookie.get('access_token');
        config.headers['Authorization'] = cookie.get('token_type') + cookie.get('access_token');
    }
    if (cookie.get('access_token')) {
        config.headers['access_token'] = cookie.get('access_token');
        config.headers['Authorization'] = cookie.get('token_type') + cookie.get('access_token');
    }
    return config;
}, function (error) {
    console.log('验证失败');
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    response = response.data;
    if (Array.prototype.toString.call(response) === '[object String]') {
        response = JSON.parse(response);
    }
    return response;
}, function (error) {
    console.log('请求失败')
    return Promise.reject(error);
});


export default API;

