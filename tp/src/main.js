// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import routes from './router/index.js'
import App from './App'
import './common/js/fontsize.js'
import './common/style/main.css'




require('es6-promise').polyfill();
Vue.use(VueRouter)

// var routes = [
// 	{ path: '/', component: Base },
// 	{ path: '/job', component: job }
// ]

const router = new VueRouter({
  routes
})

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
