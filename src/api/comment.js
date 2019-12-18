// 导入axios实例http
import http from '../utils/https'

// 获取评论
function apiGetComment({artId,offset,limit}){
    return http({
        url:'/comments',
        method:'get',
        params:{
            type:'a',
            source:artId,
            offset:offset,
            limit:limit
        }
    })
}
// 对评论点赞
function apiCommentLike(commId){
    return http({
        url:'/comment/likings',
        method:'post',
        data:{
            target:commId
        }
    })
}
// 发表评论
function apiAddComment({artId,content}){
    return http({
        url:'/comments',
        method:'post',
        data:{
            target:artId,
            content:content,
        }
    })
}
// 获取评论的回复
function apiGetReply({commId,offset,limit}){
    return http({
        url:'/comments',
        method:'get',
        params:{
            type:"c",
            source:commId,
            offset:offset,
            limit:limit
        }
    })
}
// 添加评论的回复
function apiCommentH({commId,content,artId}){
    return http({
        url:'/comments',
        method:'post',
        data:{
            target:commId,
            content:content,
            art_id:artId,
        }
    })
}
// 按需导出
export {apiGetComment,apiCommentLike,apiAddComment,apiCommentH,apiGetReply}