import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login.vue'
import test from '../views/test.vue'
import index from '../views/嵌套路由/index.vue'
import my from '../views/嵌套路由/my.vue'
import layout from '../views/layout.vue'
import search from '../views/嵌套路由/search.vue'
import searchResult from '../views/searchResult.vue'
import detail from '../views/detail.vue'
import message from '../views/mymsg.vue'
import robot from '../views/robot.vue'

Vue.use(VueRouter)

const routes = [
   // 登录页
  { path: '/', component: login },
  { path: '/login', component: login },
  // 验证登录
  { path: '/checklogin', component: login },
  // index主页,嵌套路由
  {
    path: '/layout', component: layout,
    children: [
      // 首页
      { path: '/index', component: index },
      { path: '/my', component: my },
      { path: '/search', component: search },
    ]
  },
  // 搜索结果也
  {path:'/searchResult/:value',component:searchResult},
  // 文章详情页
  {path:'/detail/:artId',component:detail},
  // 个人信息
  {path:'/message',component:message},
  // testUI页面
  { path: '/test', component: test },
  { path: '/robot', component: robot },
]

const router = new VueRouter({
  routes
})

export default router
