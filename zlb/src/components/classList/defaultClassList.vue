<template>
    <div class="classList">
        <ul flex>
            <li flex-box="0" flex="cross:center main:justify" v-for="(classItem,index) in classes"
                @click="changeClass(index,classItem.tid)" :class="{classFocus:classItem.focus}">
                <div class="className" v-text="classItem.tname"></div>
                <div class="checkBox" flex="main:center cross:center">
                    <img src="./images/checkBoxFocus.png" class="checkBoxImg" v-if="classItem.focus"/>
                </div>
            </li>
        </ul>
    </div>
</template>

<script type="text/babel">
    import api from '../../api/api.js'
    const API = new api();
    export default{
        data(){
            return {
                classList: '',
                classes: [],
                classId: this.$route.query.classId ? this.$route.query.classId : '',
                classCheck: false
            }
        },
        props: ['parentInfo'],
        mounted(){
            this.$nextTick(function () {
                this.getClassList();
            })
        },
        methods: {
            /*
             * @description: 客户端头部初始化
             *
             * @update: cxy (2017-03-07)
             */
            propsTitle(){
                //TODO:客户端读取标题信息
                util.JsBridge('propsTitle', {
                    title: util.toUniCode(this.parentInfo.title),
                    color: '#67a5ff'
                }, (res)=> {
                })
            },
            /*
             * @description: 获取班级信息
             *
             * @update: cxy (2017-04-17)
             */
            getClassList(){
                const that = this;
                const params = {
                    appCode: that.parentInfo.appCode
                }
                let response = API.getClassList(params);
                response.then((res)=> {
                    if (res.code === 200) {
                        res.rs.forEach((e)=> {
                            e.focus = false
                            if (res.rs.length === 1) {
                                e.focus = true
                                that.classList = e.tid + ''
                                if (that.classList !== '') {
                                    that.classCheck = true
                                } else {
                                    that.classCheck = false
                                }
                                that.toParentComponent()
                            }
                            if (that.classId == e.tid) {
                                e.focus = true
                                that.classList = e.tid + ''
                                if (that.classList !== '') {
                                    that.classCheck = true
                                } else {
                                    that.classCheck = false
                                }
                                that.toParentComponent()
                            }
                        })
                        that.classes = res.rs
                    } else {
                        that.msg = res.msg
                        that.showToast()
                    }
                    that.$nextTick(function () {
                        that.propsTitle()
                    })
                })
            },
            /*
             * @description: 选择班级(可多选)
             *
             * @update: cxy (2017-03-06)
             */
            changeClass(index, tid){
                if (this.classList.indexOf(tid) === -1) {
                    if (this.classList !== '') {
                        this.classList = this.classList + ',' + tid;
                    } else {
                        this.classList = '' + tid;
                    }
                } else {
                    if (this.classList.indexOf(',') !== -1) {
                        this.classList = this.classList.replace(',' + tid, '');
                        if (tid == this.classList.split(',')[0]) {
                            this.classList = this.classList.replace(tid + ',', '');
                        }
                    } else {
                        this.classList = '';
                    }
                }
                this.classes[index].focus = !this.classes[index].focus;
                if (this.classList !== '') {
                    this.classCheck = true;
                } else {
                    this.classCheck = false
                }
                this.toParentComponent()
            },
            /*
             * @description: 向父组件传递信息
             *
             * @update: cxy (2017-04-17)
             */
            toParentComponent(){
                this.$emit('toParentComponent', {classCheck: this.classCheck, classList: this.classList});
            }
        }
    }
</script>
<style scoped>
    .classList {
        padding-top: 0.11rem;
        padding-left: 0.12rem;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
        white-space: nowrap;
    }

    .classList ul {
        display: inline-flex;
    }

    .classList ul li {
        background: #99c3ff;
        border-radius: 0.05rem;
        height: 0.4rem;
        margin:0.01rem 0.06rem 0.01rem 0.01rem;
    }
    .classList ul {
        display: inline-flex;
    }

    .classList ul li {
        background: #99c3ff;
        border-radius: 0.05rem;
        height: 0.4rem;
        margin: 0.01rem 0.06rem 0.01rem 0.01rem;
    }

    .className {
        color: #ffffff;
        margin-left: 0.1rem;
        min-width: 1.2rem;
        margin-right: 0.1rem;
    }

    .checkBox {
        border: 1px solid #ffffff;
        width: 0.19rem;
        height: 0.19rem;
        border-radius: 100%;
        margin-right: 0.08rem;
    }

    .checkBoxImg {
        width: 0.11rem;
        height: 0.08rem;
    }
    .classFocus {
        background: #79b0ff !important;
        border: 0.01rem solid #e7f1ff !important;
        box-shadow: 0 0.03rem 0.03rem 0 #5e95e4 !important;
        border-radius: 0.05rem !important;
        height: 0.4rem !important;
    }
</style>
