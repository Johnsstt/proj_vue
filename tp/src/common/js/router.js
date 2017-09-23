//添加个人简历
const login = r => require.ensure([], () => r(require('../../module/user/login/login.vue')), 'module')
const base = r => require.ensure([], () => r(require('../../module/personal/base.vue')), 'personal')
const job = r => require.ensure([], () => r(require('../../module/personal/job.vue')), 'personal')
const edu = r => require.ensure([], () => r(require('../../module/personal/edu.vue')), 'personal')
const work = r => require.ensure([], () => r(require('../../module/personal/work.vue')), 'personal')
const proj = r => require.ensure([], () => r(require('../../module/personal/proj.vue')), 'personal')
const extra = r => require.ensure([], () => r(require('../../module/personal/extra.vue')), 'personal')
const tech = r => require.ensure([], () => r(require('../../module/personal/tech.vue')), 'personal')
const allJobs = r => require.ensure([], () => r(require('../../module/personal/allJobs.vue')), 'personal')
const city = r => require.ensure([], () => r(require('../../components/city.vue')), 'components')
const editList = r => require.ensure([], () => r(require('../../module/personal/editList.vue')), 'components')
const preview = r => require.ensure([], () => r(require('../../module/personal/preview.vue')), 'components')

const baseEdit = r => require.ensure([], () => r(require('../../module/personal/baseEdit.vue')), 'components')
const jobEdit = r => require.ensure([], () => r(require('../../module/personal/jobEdit.vue')), 'components')
const workEdit = r => require.ensure([], () => r(require('../../module/personal/workEdit.vue')), 'components')
const projEdit = r => require.ensure([], () => r(require('../../module/personal/projEdit.vue')), 'components')
const eduEdit = r => require.ensure([], () => r(require('../../module/personal/eduEdit.vue')), 'components')



const test = r => require.ensure([], () => r(require('../../module/personal/test.vue')), 'personal')

export default [
    { path: '/', component: base },
    { path: '/login', component: login },
    { path: 'test', component: test },
    { path: '/allJobs', component: allJobs },
    { path: '/city', component: city},
    { path: '/editList', component: editList},
    { path: '/preview', component: preview },
    //淘聘
    { path: '/base', component: base },
    { path: '/job', component: job },
    { path: '/edu', component: edu },
    { path: '/work', component: work },
    { path: '/proj', component: proj },
    { path: '/extra', component: extra },
    { path: '/tech', component: tech},

    { path: '/baseedit', component: baseEdit},
    { path: '/jobedit', component: jobEdit},
    { path: '/workedit', component: workEdit},
    { path: '/projedit', component: projEdit},
    { path: '/eduedit', component: eduEdit},

    { path: '*', redirect: '/' }
]
