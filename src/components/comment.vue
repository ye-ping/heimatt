<template>
  <div class="comment">
    <div class="img">
      <img :src="item.aut_photo" alt />
    </div>
    <div class="left">
      <p>{{item.aut_name}}</p>
      <p>{{item.content}}</p>
      <div>
        <span>{{item.pubdate | Time}}</span>
        <van-button v-if="isComment" @click="openReply" class="mybtn" round>{{item.reply_count}} 回复</van-button>
      </div>
    </div>
    <div class="right" @click="like">
      <van-icon name="good-job-o" />
      <span>{{item.like_count}}</span>
    </div>
  </div>
</template>

<script>
//导入对评论点赞的api
import { apiCommentLike } from "../api/comment.js";
// 导入bus
import bus from '../utils/bus.js'
export default {
    // isComment决定回复按钮是否隐藏,true为显示,false为隐藏
  props: ["item","isComment"],
  data() {
    return {};
  },
  methods: {
    //   点赞
    async like() {
      let res = await apiCommentLike(this.item.com_id);
        // window.location.reload();
    },
    openReply(){
        // 打开弹出层
        this.$emit('openReply',true)
        // 用bus传参
        bus.$emit("passvalue",this.item);
    }
  },
 
};
</script>

<style lang="less">
.comment {
  display: flex;
  .img {
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-left: 15px;
    }
  }
  .left {
    flex: 1;
    margin-left: 10px;
    p {
      margin: 5px 0 5px 0;
      font-size: 14px;
    }
    .mybtn {
      margin-left: 10px;
      background-color: #ccc;
    }
    span {
      font-size: 12px;
    }
  }
  .right {
    font-size: 25px;
    display: flex;
    align-items: center;
    span {
      font-size: 16px;
      margin-right: 15px;
    }
  }
}
</style>