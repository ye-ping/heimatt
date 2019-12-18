//导入axios
import axios from 'axios'
// 导入store全局创库
import store from '../store/index.js'

import jsonbigint from 'json-bigint'

// 创建一个新的axios对象
// axios.create:  格局axios创建一个新的实例来
// 意义在于请求两个服务器接口时不会相互影响,带来连锁反应
//   黑马头条服务器:  xxxxxxxxxx
//    黑马面面服务器:   xxxxxxxxxxx
// 这个实例单独用来请求黑马头条的服务器
let instance = axios.create({
  // 黑马头条服务器基地址
  baseURL: "http://ttapi.research.itcast.cn/app/v1_0",
  transformResponse: [function (data) {
    try {
      // window.console.log(jsonbigint.parse(data));
      return jsonbigint.parse(data)
    } catch {
      return JSON.parse(data)
    }
  }]
})

// 创建一个新的axios实例,用来专门刷新token
let tokenInstance = axios.create({
  baseURL: "http://ttapi.research.itcast.cn/app/v1_0"
})

// axios拦截器
// 请求拦截器
instance.interceptors.request.use(function (config) {
  // 设置请token
  let token = store.state.user.token;
  // window.console.log(token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});


// 响应拦截器
instance.interceptors.response.use(function (response) {

  return response;
}, async function (error) {
  // error对象中包含config:  当前报错的请求配置(包含了路径,方式,参数等,可以直接发axios)   ,response:响应信息
  // 获取相应信息中的错误状态码
  let status = error.response.status;
  if (status === 401) {
    // 得到store中的refresh_token发送axios请求更新token
    let user = store.state.user;
    window.console.log(user);
    // 判断refresh_token是否存在
    if (user && user.refresh_token) {
      // 发送axios获取新的token
      let res = await tokenInstance({
        url: '/authorizations',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // 将获取的新的token,保存到store中
      user.token = res.data.data.token;
      store.commit("setuser",user);
      // 接下来要重新发送请求到服务器,请求为完成的数据
      return instance(error.config)
    }
  }
  return Promise.reject(error);
});

//   导出黑马头条axios 的实例
export default instance
