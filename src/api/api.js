// 导入axios实例

import http from '../utils/https.js'
// 用来封装所有与用户相关的网络请求

// 登录方法
function apiLogin(data) {
    return http({
        url: '/authorizations',
        method: 'post',
        data: data
    })
}
// 拉黑作者的方法
function apiBlackArt(autId) {
    return http({
        url: '/user/blacklists',
        method: 'post',
        data: {
            target: autId
        }
    })
}

// 关注用户
function apiFollowings(autId) {
    return http({
        url: "/user/followings",
        method: 'post',
        data: {
            target: autId
        }
    })
}
// 取消关注
function apiUserFollowings(autId) {
    return http({
        url: `/user/followings/${autId}`,
        method: 'DELETE',
    })
}

// 获取用户自己的信息
function apiSelfUser() {
    return http({
        url: '/user',
        method: 'get'
    })
}
// 获取用户个人信息详情
function apiUserProfile() {
    return http({
        url: '/user/profile',
        method: 'get'
    })
}
// 获取指定用户信息
function apiUserId() {
    return http({
        url: "/user",
        method: 'get',
    })
}
// 修改用户信息
function apiUserMod({ name, gender, birthday, intro }) {
    return http({
        url: '/user/profile',
        method: 'PATCH',
        data: {
            name: name,
            gender: gender,
            birthday: birthday,
            intro: intro
        }
    })
}
// 编辑用户头像
function apiUserPhoto(photo) {
    // axios底层也是用XMLHttpRequest,默认情况下,这个对象不允许传入图片对象
    // 解决,XMLHttpRequest 2.x中有一个新的对象可以,用来存图片
    // 创建一个formData对象;
    let fn = new FormData();
    fn.append("photo",photo);
    return http({
        url: '/user/photo',
        method: 'PATCH',
        data:fn
    })
}

// 按需导出
export { apiLogin, apiBlackArt, apiFollowings, apiUserFollowings, apiSelfUser, apiUserProfile, apiUserId, apiUserMod, apiUserPhoto }