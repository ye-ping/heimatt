<template>
  <div class="my">
    <div class="top">
      <!-- 头像 -->
      <div class="header" @click="$router.push(`/message`)">
        <img :src="msgObj.photo" alt />
        <!-- 昵称 -->
        <div class="name">{{msgObj.name}}</div>
        <div class="right">
          <span>今日阅读</span>
          <span>5分钟</span>
        </div>
      </div>
      <!-- 动态 -->
      <div class="box">
        <div class="dongtia">
          <span>{{msgObj.art_count}}</span>
          <span>动态</span>
        </div>
        <div class="guanzhu">
          <span>{{msgObj.follow_count}}</span>
          <span>关注</span>
        </div>
        <div class="fens">
          <span>{{msgObj.fans_count}}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>
    <!-- 宫格 -->
    <van-grid  :column-num="3">
  <van-grid-item  icon="star-o" text="收藏" />
  <van-grid-item  icon="clock-o" text="历史" />
  <van-grid-item  icon="records" text="粉丝" />
</van-grid>
<!-- 单元格 -->
<van-cell-group>
  <van-cell title="消息通知" is-link />
  <van-cell title="实名认证" is-link />
</van-cell-group>
<van-cell-group class="message">
  <van-cell title="用户反馈" is-link />
  <van-cell title="小智同学" @click="$router.push(`/robot`)" is-link />
  <van-cell title="系统设置" is-link />
</van-cell-group>
  </div>
</template>

<script>
// 导入用户获取自己信息api
import {apiSelfUser} from '../../api/api.js'
export default {
  data(){
    return {
      msgObj:{},//数据源
    }
  },
  methods: {
    
  },
 async created() {
  //data数据创建了,但是el挂载点还没有创建(准备创建el)
   let res = await apiSelfUser()
   this.msgObj = res.data.data
   this.$store.commit('photo',this.msgObj.photo);
   window.console.log(res);
  },
};
</script>

<style lang="less">
.my {
  background-color: #f5f5f5;
  .top {
    background-color: #409dfa;
    overflow: hidden;
    .header {
      margin: 40px 20px;
      display: flex;
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
      .name {
        color: #fff;
        margin-left: 10px;
        line-height: 60px;
      }
      .right {
        // height: 40px;
        background: rgba(0, 0, 0, 0.3);
        position: fixed;
        top: 50px;
        right: 0;
        padding: 6px 15px;
        border-radius: 30px 0 0 30px;
        span {
          display: block;
          color: #fff;
          font-size: 12px;
        }
      }
    }
    .box {
      display: flex;
      justify-content: space-between;
      margin: 0 40px;
      margin-bottom: 20px;
      span {
        display: block;
        text-align: center;
        color: #fff;
      }
    }
  }
  .van-grid-item__text{
    font-size: 16px;
  }
  .message {
    margin-top: 10px;
  }
}
</style>