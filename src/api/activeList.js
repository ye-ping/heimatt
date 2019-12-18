// 所有跟文章列表的网络
//导入http
import http from '../utils/https'

// 获取文章列表数据
function apiActive({ channelId, timestamp }) {
    return http({
        url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
        method: 'get',
        params: {
            channel_id: channelId,
            timestamp: timestamp,
            with_top: 0
        }
    })
}
// 不喜欢文章
function apiDislike(artId) {
    return http({
        url: '/article/dislikes',
        method: 'post',
        data: {
            target: artId
        }
    })
}
// 举报文章
function apiReports({ artId, type }) {
    return http({
        url: '/article/reports',
        method: 'post',
        data: {
            target: artId,
            type: type
        }
    })
}
// 搜索文章联想的api
function apiThink(q) {
    return http({
        url: '/suggestion',
        method: 'get',
        params: {
            q: q
        }
    })
}
// 搜索文章结果
function apiSearchResult({ q, page, per_page }) {
    return http({
        url: '/search',
        method: 'get',
        params: {
            q: q,
            page: page,
            per_page: per_page
        }
    })
}
// 获取文章详情
function apiGetActive(artId) {
    return http({
        url: `/articles/${artId}`,
        method: 'get'
    })
}

// 对文章点赞
function apiLikings(artId) {
    return http({
        url: '/article/likings',
        method: 'post',
        data: {
            target: artId
        }
    })
}
//按需导出 
export { apiActive, apiDislike, apiReports, apiThink, apiSearchResult, apiGetActive, apiLikings }