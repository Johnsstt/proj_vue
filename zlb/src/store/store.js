import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
const state = {
    audioId:'',
    app:{
        list: [],
        page:0,
        pageTotal:0,
        saveY:0,
        expirTimeArr:[],
        intervalId:''
    },
    user:{
        userId:-1
    }
};
const mutations = {
    //设置应用列表缓存
    setList (state, obj) {
        state.app.list = obj.list;
        state.app.page = obj.page;
        state.app.pageTotal = obj.pageTotal;
        state.app.saveY = obj.saveY;
        if(obj.expirTimeArr){
            state.app.expirTimeArr=obj.expirTimeArr;
            state.app.intervalId=obj.intervalId;
        }
        if(obj.revokeTimeArr){
            state.app.revokeTimeArr=obj.revokeTimeArr;
        }
    },
    //设置语音Id
    setAudioId(state,audioId){
        state.audioId=audioId;
    },
    //设置用户信息
    setUserInfo(state,obj){
        if(obj.userId){
            state.user.userId=obj.userId;
        }
    }
};
const actions = {
    //获取应用列表数据
    getList (context, obj){
        context.commit('setList', obj);
    },
    getAudioId(context,audioId){
        context.commit('setAudioId', audioId);
    },
    //获取用户信息
    getUserInfo(context,obj){
        context.commit('setUserInfo',obj);
    }
};
export default new Vuex.Store({
    state,
    mutations,
    actions
})
