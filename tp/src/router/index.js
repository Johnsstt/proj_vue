import base from '../module/personal/base.vue'
import job from '../module/personal/job.vue'
import edu from '../module/personal/edu.vue'
import work from '../module/personal/work.vue'
import proj from '../module/personal/proj.vue'
import extra from '../module/personal/extra.vue'
import tech from '../module/personal/tech.vue'
import editList from '../module/personal/editList.vue'
import preview from '../module/personal/preview.vue'
import selfInfo from '../module/personal/self.vue'



import city from '../components/city.vue'
import allJobs from '../components/allJobs.vue'

import test from '../module/personal/test.vue'



export default [
    { path: '/', component: base },

    { path: '/test', component: test },
    { path: '/allJobs', component: allJobs },
    { path: '/city', component: city},
    { path: '/editList', component: editList},
    { path: '/preview', component: preview },
    { path: '/self', component: selfInfo },

    { path: '/base', component: base },
    { path: '/job', component: job },
    { path: '/edu', component: edu },
    { path: '/work', component: work },
    { path: '/proj', component: proj },
    { path: '/extra', component: extra },
    { path: '/tech', component: tech},


    { path: '*', redirect: '/' }
]
