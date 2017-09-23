/*
 * @description: 主入口模块加载引用
 *
 * @update: cxy (2017-03-01)
 */
import Vue from 'vue'
import App from './App.vue'
import store from './store/store.js'
import './common/js/getUrlParam.js'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-light.css'
import './common/js/fontsize.js'
import './vendor/style/flex.css'
import './common/style/main.css'
import './common/js/common.js'
import './vendor/js/cookie.js'
import './directive/directive.js'
import MuseUI from 'muse-ui'
import VueRouter from 'vue-router'
import routes from './common/js/router.js'
import './vendor/style/swiper.min.css'
import './vendor/js/faskclick.js'
require('es6-promise').polyfill();
Vue.use(VueRouter);
Vue.use(MuseUI);
/*
 * @description: fastClick注入解决ios上300ms延迟问题
 *
 * @update: cxy (2017-03-01)
 */
 if ('addEventListener' in document) {
     document.addEventListener('DOMContentLoaded', function() {
         FastClick.attach(document.body);
     }, false);
 }

/*
 * @description: 前端路由引用配置
 *
 * @update: cxy (2017-03-01)
 */
const router = new VueRouter({
    //相当于 routes: routes
    routes
});
/*
 * @description: vue主入口绑定注入
 *
 * @update: cxy (2017-03-01 11:00)
 */
new Vue({
    el: '#app',
    components: { App },
    router,
    store,
    render:h=>h(App)
})
