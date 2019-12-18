// 所有歌频道有关的的网络请求
import http from '../utils/https'

// 获取用户频道列表
function apiChannels() {
    return http({
        url: '/user/channels',
        method: 'get',
    })
}

// 获取所有频道列表
function apiAllChannels() {
    return http({
        url: '/channels',
        method: 'get',
    })
}

// 将用户频道数据保存到服务器
function apiSaveChannels(channels) {
    return http({
        url: '/user/channels',
        method: 'PUT',
        data: { channels: channels }
    })
}

// 按需导出
export { apiChannels, apiAllChannels,apiSaveChannels }