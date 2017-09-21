import Vue from 'vue'
import store from '../store'
import Router from 'vue-router'


Vue.use(Router)

const router = new Router({
  routes: [
    // {
    //   path: '/',
    //   redirect: '/home'
    // },
    {
      path: '/home',
      name: 'home',
      component: resolve => require(['@/components/home'],resolve)
    },
    {
      path: '/bookIntroduce',
      name: 'bookIntroduce',
      component: resolve => require(['@/components/bookIntroduce'],resolve)
    },
    {
      path: '/bookRecording',
      name: 'bookRecording',
      component: resolve => require(['@/components/bookRecording'],resolve)
    },
    {
      path: '/bookPreview',
      name: 'bookPreview',
      component: resolve => require(['@/components/bookPreview'],resolve)
    },
    {
      path: '/bookShare',
      name: 'bookShare',
      component: resolve => require(['@/components/bookShare'],resolve)
    },
    {
      path: '/bookAward',
      name: 'bookAward',
      component: resolve => require(['@/components/bookAward'],resolve)
    },
    {
      path: '/*',
      redirect: '/home'
    }
  ]
});
router.beforeEach((to, from, next) => {
  store.commit('loading',true);
  next();
})
export default router;
