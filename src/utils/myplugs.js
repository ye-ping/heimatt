// 导入store创库
import store from '../store'
// 导入router
import router from '../router/index'
// 创建一个插件对象
const myplugs = {};
// 给对象添加一个方法: install  官网说的
myplugs.install= function(Vue){
    // 给vue添加一个实例方法:用来进行登录验证
    Vue.prototype.$login= function(){
        // 得到登录信息
        let user = store.state.user;
        // 判断token 
        if(!user.token){
            router.push("/checklogin");
            return false;
        }
        return true;
    }
}

// 暴露插件对象
export default myplugs;