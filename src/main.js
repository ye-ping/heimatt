import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入vantUI
import Vant from 'vant';
import 'vant/lib/index.css';
// 导入iconfont样式
import './style/iconfont.css'
// 导入图片懒加载
import { Lazyload } from 'vant';
// 导入时间全局过滤器
import  './filters/date'
// 导入自己的插件
import myplugs from './utils/myplugs'

// 使用自己的插件
Vue.use(myplugs);//调用myplugs.install方法

// options 为可选参数，无则不传
Vue.use(Lazyload);

Vue.use(Vant);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
