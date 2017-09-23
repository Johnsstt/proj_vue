<template>
    <div>
        <mu-text-field hintText="请输入账号" v-model="username"/>
        <mu-text-field hintText="请输入密码" type="password"  v-model="password"/>
        <mu-raised-button label="Submit" fullWidth @click="login"/>
        <mu-toast v-if="toast" :message="msg" @close="hideToast"/>
    </div>
</template>

<script type="text/babel">
    import API from '../../../api/api.js'
    import qs from 'qs'
    const api=new API();
    export default{
        data(){
            return{
                username:'13165988540',
//                username:'13654275782',
                password:'123456',
//                password:'123456',
                msg:'',
                toast:false
            }
        },
        methods:{
            login(){
                let param={
                    username:this.username,
                    password:this.password,
                    clientType: 'GENERAL'
                }
                const response=api.getToken(qs.stringify(param));
                const that=this;
                response.then((res)=>{
                    if(res.code===200){
                        cookie.set({
                            'access_token': res.result.access_token,
                            'token_type': res.result.token_type
                        }, {
                            expires: Math.ceil(res.result.expires_in / 86400)
                        });
                        that.$router.push({path:'/test'})
                    }else{
                        this.msg = '密码错误';
                        this.showToast();
                    }
                }).catch((err)=>{
                    this.msg = '用户名密码错误';
                    this.showToast();
                })
            },
            /*
             * @description: 显示保存结果信息
             *
             * @update: cxy (2017-03-07)
             */
            showToast () {
                this.toast = true
                if (this.toastTimer) clearTimeout(this.toastTimer)
                this.toastTimer = setTimeout(() => {
                    this.toast = false
                }, 2000)
            },
            /*
             * @description: 隐藏保存结果信息
             *
             * @update: cxy (2017-03-07)
             */
            hideToast () {
                this.toast = false
                if (this.toastTimer) clearTimeout(this.toastTimer)
            },
        }
    }
</script>
<style>
    .mu-text-field{
        width:100%;
    }
</style>
