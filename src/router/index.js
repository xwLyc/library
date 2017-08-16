import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: resolve => require(['@/components/home'],resolve)
    },
    {
      path: '/bookIntroduce',
      name: 'bookIntroduce',
      component: resolve => require(['@/components/bookIntroduce'],resolve)
    }
  ]
})
