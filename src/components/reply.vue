<template>
  <!-- 弹出层面板reply -->
  <div class="commentpop">
    <van-popup
      :value="value"
      @input="$emit('input',false)"
      position="bottom"
      :style="{ height: '60%' }"
      @closed="closed"
      @opened="opened"
    >
      <comment :item="busObj" :isComment="false"></comment>
      <van-cell>
        <template slot="title">
          <span class="custom-title">当前评论的回复:</span>
        </template>
      </van-cell>
      <!-- 回复的评论 -->
      <van-list  ref="list" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <comment :item="item" v-for="(item,index) in commentReply" :key="index"></comment>
      </van-list>
      <!-- 输入框 -->
      <mywirte :isComment="false" :commId="busObj.com_id" @addComment="addComment"></mywirte>
    </van-popup>
  </div>
</template>

<script>
// 导入评论组件
import comment from "../components/comment";
// 导入输入框的组件
import mywirte from "../components/wirte";
// 导入bus
import bus from "../utils/bus.js";
// 导入添加评论的回复api
import { apiCommentH, apiGetReply } from "../api/comment.js";
export default {
  props: ["value"],
  data() {
    return {
      busObj: {}, //常过来的评论的数据源
      loading: false, //list加载状态
      finished: false, //是否加载完毕
      offset: null,
      end: null,
      commentReply: [] //评论的回复
    };
  },
  methods: {
    // list初始化化时执行
    async onLoad() {
      //请求数据
      let res = await apiGetReply({
        commId: this.busObj.com_id.toString(),
        offset: this.offset,
        limit: 10
      });
      // 保存数据,    要是用追加
      this.commentReply.push(...res.data.data.results);
      this.offset = res.data.data.last_id;
      this.end = res.data.data.end_id;
      // 判断是否加载完毕
      if (this.offset == this.end) {
        this.finished = true;
        return;
      }
      this.loading = false;
      // window.console.log(res);
    },
    addComment(value) {
      this.commentReply.unshift(value);
      // 将当前评论的回复数字加1
      this.busObj.reply_count = this.busObj.reply_count + 1;
      window.console.log(value);
    },
    closed() {
      this.busObj = {}; //常过来的评论的数据源
      this.loading = false; //list加载状态
      this.finished = false; //是否加载完毕
      this.offset = null;
      this.end = null;
      this.commentReply = []; //评论的回复
    },
    opened(){
      this.$refs.list.check();
    }
  },
  created() {
    //data数据创建了,但是el挂载点还没有创建(准备创建el)
    //接受bus传过来的参数
    bus.$on("passvalue", value => {
      this.busObj = value;
      // window.console.log(this.busObj);
    });
  },
  components: {
    comment,
    mywirte
  }
};
</script>

<style>
</style>