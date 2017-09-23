import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
// import config from './config'
// import Uri from '../common/js/getUrlParam'


export const domain = '';
axios.defaults.withCredentials=true




class API {
    /***********************公共**********************************/

    // 获取登录信息
    getUserInfo(param) {
        return axios.get(domain + '/getUserInfo.htm', {
            params: param
        })
    }

    // 获取基信息    
     baseInfo(param) {
        return axios.get(domain + '/app/wap/personal/resume/baseInfo', {
            params: param
        })
    }

    getCrtCity(param) {
        return axios.get(domain + '/app/public/location', {
            params: param
        })
    }    

    // 获取热门城市
    getHotCity(param) {
        return axios.get(domain + '/app/public/getHotCity', {
            params: param
        })
    }
    

    //得到用户信息
    
    getBaseInfo(param) {
        return axios.get(domain + '/app/wap/personal/resume/baseInfo', {
            param: param
        })
    }


    
    /**
     * name: 数据字典get方式
     * 城市数据 (parentId: 107、isSub: 1)
     * 期望职位 (parentId: 108、isSub: 1)
     * 技能接口 (parentId: 122、isSub: 1)    
     *     
     * 
     */
    getDict(param) {
        return axios.get(domain + '/app/public/dict', {
            params: param
        })
    }


    /**
     * 数据字典post方式
     */
    
     getDataDict(param) {
        return axios(domain + '/app/public/dict', {
            method: 'post',
            data: param,
            transformRequest: [function (data) {                
                let ret = ''
                for (let it in data) {
                  ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        });
    }


    /**
     *  name: 获取简历详情   
     */
    getResumeDetail(param) {
        return axios.get(domain + '/app/wap/personal/resume/detail', {
            params: param
        })
    }

    /**
     * name: 保存用户基本信息
     * fullName:太阳突然吧
     * degree:本科
     * workYears:6
     * sex:2
     * province:广东
     * city:广州
     * mobile:18268030638
     * email:john_tech@163.com
     * profession:1
     * birthday:Wed Nov 01 1989 08:00:00 GMT+0800 (中国标准时间)
     * code:
     * id:4957527    
     */    
    saveBaseInfo(param) {
        return axios(domain + '/app/wap/personal/saveBaseInfo', {
            method: 'post',
            data: param,
            transformRequest: [function (data) {                
                let ret = ''
                for (let it in data) {
                  ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        });
        
    }

    /**
     *  name: 保存用户求职意向
     *  hopeJobFirst:运营
     *  hopeJobFirstId:108002
     *  hopeJobSecondId:108002003
     *  hopeJobSecond:店铺运营
     *  workQuality:1
     *  hopeSalaryMin:20000
     *  hopeSalaryMax:999999
     *  hopeProvince:浙江
     *  hopeCity:杭州
     *  workStatus:4
     *  id:4957527
     *      
     */
    saveHopeJob(param) {
        // config.params = param;
        return axios(domain + '/app/wap/personal/saveHopeJob', {
            method: 'post',
            data: param,
            transformRequest: [function (data) {                
                let ret = ''
                for (let it in data) {
                  ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        });
    }

    /**
     *  name: 保存教育经历
     *  id:3305125
     *  schoolName:吉首大学
     *  startDate:Thu Dec 01 1994 08:00:00 GMT+0800 (中国标准时间)
     *  endDate:Wed Mar 01 1995 08:00:00 GMT+0800 (中国标准时间)
     *  profession:计算机技术与科学
     *  degree:本科
     *  resumeId:4957527
     *     
     */
    saveEducation(param) {        
        return axios(domain + '/app/wap/personal/saveEducation', {
            method: 'post',
            data: param,
            transformRequest: [function (data) {                
                let ret = ''
                for (let it in data) {
                  ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        });
    }

    /**
     * name: 保存工作经历
     * id:2798399
     *  companyName:公苑科技
     *  startDate:Tue Nov 01 1994 08:00:00 GMT+0800 (中国标准时间)
     *  endDate:Thu Dec 01 1994 08:00:00 GMT+0800 (中国标准时间)
     *  hodPost:开发工程师
     *  workDescribe:项目重构及优化
     *  resumeId:4957527     
     */     
    saveWork(param) {
        return axios(domain + '/app/wap/personal/saveWork', {
            method: 'post',
            data: param,
            transformRequest: [function (data) {                
                let ret = ''
                for (let it in data) {
                  ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

    /**
     * name: 保存项目经验
     * id:235247
     * projectName:cms内容系统开发
     * startDate:Tue Nov 01 1994 08:00:00 GMT+0800 (中国标准时间)
     * endDate:Sat Jul 01 2017 08:00:00 GMT+0800 (中国标准时间)
     * projectDuty:项目的重构及开发
     * projectDescribe:项目的重构及优化管理页面
     * resumeId:4957527     
     */
    saveProject(param) {
        return axios(domain + '/app/wap/personal/saveProject', {
            method: 'post',
            data: param,
            transformRequest: [function (data) {                
                let ret = ''
                for (let it in data) {
                  ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

    /**
     * name: 保存技能经验
     * id:1078515
     * technique:kl360
     * qualification:专家
     * resumeId:4957527     
     */
    saveSkills(param) {
        return axios(domain + '/app/wap/personal/saveSkills', {
            method: 'post',
            data: param,
            transformRequest: [function (data) {               
                let ret = ''
                for (let it in data) {
                  ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

    /**
     * name: 保存语言能力
     * id:327941
     * language:英语四级
     * resumeId:4957527
     */
    saveLanguage(param) {        
        return axios(domain + '/app/wap/personal/saveLanguage', {
            method: 'post',
            data: param,
            transformRequest: [function (data) {                
                let ret = ''
                for (let it in data) {
                  ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

    /**
     * name: 保存自我描述
     * selfAppraisal:这是添加出来的接口测试
     * id:4957527
     */
    saveSelfAppraisal(param) {
        return axios(domain + '/app/wap/personal/saveSelfAppraisal', {
            method: 'post',
            data: param,
            transformRequest: [function (data) {                
                let ret = ''
                for (let it in data) {
                  ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });        
    }    

    /**
    * name: 保存附加信息
    * id:
    * title:爬山专家作品
    * description:作品描述爬山作家的作品。
    * resumeId:4957527
    */
    saveAttach(param) {
        return axios(domain + '/app/wap/personal/saveAttach', {
            method: 'post',
            data: param,
            transformRequest: [function (data) {                
                let ret = ''
                for (let it in data) {
                  ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });        
    }


    // 发送验证码
    // 
    /**
     * name: 发送验证码
     * mobile: 18268030638
     * flag: 2
     */
    
    

    // getMobileCode(param) {
    //     return axios.get(domain + '/app/public/getMobileCode', {
    //         params: param
    //     })
    // }

    getMobileCode(param) {
        return axios(domain + '/app/public/getMobileCode', {
            method: 'post',
            data: param,
            transformRequest: [function (data) {                
                let ret = ''
                for (let it in data) {
                  ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],            
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'                
            }
        });
    }


   /**
    * id:3311883
    * resumeType:1 <教育经历> 2 <工作经验> 3 <项目经验>
    */
    
    delResumeDetail(param) {
        return axios(domain + '/app/wap/personal/delResumeDetail', {
            method: 'post',
            data: param,
            transformRequest: [function (data) {                
                let ret = ''
                for (let it in data) {
                  ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    } 
    



}


// 添加请求拦截器
axios.interceptors.request.use(function (config) {    
    return config;
}, function (error) {
    console.log('验证失败');
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (res) {
    // console.log('拦截到的值：', res);
    var data = res.data;
    var testurl = 'http://daily.imaijia.com';

    if(data.code == 'B20005') {
        location.href = testurl + '/mobile/login.htm?channel-url' + encodeURIComponent(location.href);
    }
    return res;   
}, function (error) {
    console.log('请求失败')
    return Promise.reject(error);
});


export default API;

