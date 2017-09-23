<template>
    <div class="box-wrap">

        <mu-auto-complete hintText="请输入TA的姓名" class="txt" labelFloat label="TA的姓名" fullWidth v-model="userInfo.name"/>
        <mu-auto-complete hintText="请输入TA的手机号" class="txt"  labelFloat label="TA的手机号" fullWidth v-model="userInfo.tel"/>
        <mu-auto-complete hintText="请输入TA的年龄" class="txt" labelFloat label="TA的年龄" fullWidth v-model="userInfo.age"/>

        <mu-raised-button label="发送" fullWidth class="demo-raised-button" @click="submitEvent"/>
        <mu-toast v-if="msg.toast" :message="msg.text" @close="hideToast"/>

    </div>
</template>
<script>
    import api from '../../../api/api.js'
    import qs from 'qs'
    const API = new api();
    export default{
        data(){
            return{
                userInfo: {
                    name: '张三',
                    tel: '186588636987',
                    age: '26'
                },
                msg: {
                    toast: false,
                    text: ''
                }
            }
        },
        methods: {
            showToast () {
                this.msg.toast = true
                if (this.toastTimer) clearTimeout(this.toastTimer)
                this.toastTimer = setTimeout(() => { this.msg.toast = false }, 2000)
            },
            hideToast () {
                this.msg.toast = false
                if (this.toastTimer) clearTimeout(this.toastTimer)
            },
            submitEvent () {
                let self = this;
                let userInfo = this.userInfo || null;
                let reg = /^1(3|4|5|7|8)\d{9}$/;
                if(!userInfo) return;
                if(!userInfo.name) {
                    self.msg.text = '用户名不能为空';
                    self.showToast();
                }else if(!userInfo.tel) {
                    self.msg.text = '手机号码不能为空';
                    self.showToast();
                }else if(!reg.test(userInfo.tel)){
                    self.msg.text = '手机号码格式有误'
                    self.showToast();

                }else if(!userInfo.age) {
                    self.msg.text = '年龄不能为空';
                    self.showToast();
                }
                console.log('this值', this);
            }
        }
    }
</script>

<style scoped>
    body{
        background-color:#f5f5f5;
    }
    .box-wrap{
        position:relative;
        width: 100%;
        height: 100%;
        padding: 0.14rem 0.12rem;
    }
    .box-wrap .txt{
        font-size: 15px;
        color: #42454c;
    }
    .demo-raised-button{
        background: #67a5ff;
        border-radius: 1rem;
        color:#fff;
        width:3rem;
        hegiht:0.38rem;
        position:absolute;
        left: 50%;
        margin-left: -1.5rem;
        bottom: 0.26rem;
    }
</style>
