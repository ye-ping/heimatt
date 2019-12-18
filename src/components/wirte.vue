<template>
  <div class="wirte">
    <van-search class="comment" v-model="value" show-action shape="round" @search="onComment">
      <div class="fabiao" slot="action" @click="onComment">发表</div>
    </van-search>
  </div>
</template>

<script>
// 导入发表评论的api    评论回复
import { apiAddComment, apiCommentH } from "../api/comment.js";
export default {
  // isComment判断在评论中使用还是回复中使用,如果isComment==true就是评论中使用,如果是false,就是回复中使用,实现组件的发勇,
  props: ["artId", "isComment","commId"],
  data() {
    return {
      value: "" //输入框内容
    };
  },
  methods: {
    //   发表评论
    async onComment() {
      //  判断是在哪里使用,
      if (this.isComment === true) {
        //  非空判断
        if (this.value.trim().length == 0) {
          return this.$toast("你还没有输入内容哦");
        }

        let res = await apiAddComment({
          artId: this.artId,
          content: this.value
        });
        let comment = res.data.data.new_obj;
        //   向父组件传递参数
        this.$emit("comment", comment);
        // 清空输入框
        this.value = "";
        // window.console.log(comment);
      } else {//写评论的回复
        //  非空判断
        if (this.value.trim().length == 0) {
          return this.$toast("你还没有输入内容哦");
        }
        // 添加评论的回复
        let res = await apiCommentH({
            commId:this.commId,
            content:this.value,
            artId:this.$route.params.artId
          });
          // 将服务器返回的数据传到reply面板
          this.$emit("addComment",res.data.data.new_obj);
        window.console.log(res);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.wirte {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  .fabiao {
    width: 150xp;
  }
  .comment {
    width: 100%;
  }
}
</style>