import Vue from 'vue'
import Vuex from 'vuex'
import { getLocal, setLocal } from '../utils/myloca'
// 导入localStro的方法
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 保存用户信息
    user: getLocal("userInfo") || {},
    photo:null
  },
  mutations: {
    setuser: function (state, payload) {
      // 给user赋值
      state.user = payload;
      // 保存到localStor中
      setLocal("userInfo", payload);
    },
    photo: function(state,photo){
      state.photo = photo;
    }
  },
})
