<template>
  <div class="more">
    <van-dialog :value="value" @input="more" @closed="isreporst=true" :showConfirmButton="false"  :closeOnClickOverlay="true">
      <van-cell-group v-if="isreporst===true">
        <van-cell icon="bookmark-o" @click="dislike" title="不感兴趣" />
        <van-cell icon="warning-o" is-link @click="isreporst=false" title="反馈垃圾内容" />
        <van-cell icon="delete" @click="blackAut" title="拉黑作者" />
      </van-cell-group>
      <!-- 举报面板 -->
      <van-cell-group v-if="isreporst===false">
        <van-cell
          v-for="(item,index) in reporst"
          :key="index"
          @click="reporstArt(item)"
          :title="item.name"
        />
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script>
// 导入对文章不喜欢的api
import { apiDislike, apiReports } from "../api/activeList.js";
// 导入拉黑作者的方法
import { apiBlackArt } from "../api/api.js";
export default {
  // 父组件传过来的参数  文章id
  props: ["value", "artid", "autId"],
  data() {
    return {
      reporst: [
        { id: 0, name: "其他问题" },
        { id: 1, name: "标题夸张" },
        { id: 2, name: "低俗色情" },
        { id: 3, name: "错别字多" },
        { id: 4, name: "旧闻重复" },
        { id: 5, name: "广告软文" },
        { id: 6, name: "内容不实" },
        { id: 7, name: "涉嫌违法犯罪" },
        { id: 8, name: "侵权" }
      ],
      isreporst: true
    };
  },
  methods: {
    // 点击空白区域的是否,将参数传给父组件,关闭more弹出层
    more() {
      this.$emit("input", false);
    },
    // 不喜欢
    async dislike() {
      // 点击不喜欢的时候将文章id传回去,删除文章
      this.$emit("artid", this.artid);
      try {
        // 发送axios,标记为不喜欢
        let res = await apiDislike(this.artid);
        window.console.log(res);
      } catch (error) {
        window.console.log(error.message);
      }
      //关闭面板
      this.$emit("input", false);
    },
    // 举报文章
    async reporstArt(item) {
      try {
        // 发送axios
        let res = await apiReports({
          type: item.id,
          artId: this.artid
        });
        window.console.log(res);
      } catch (error) {
        window.console.log(error.message);
      }

      // 关闭弹出框
      this.isreporst = true;
      this.$emit("input", false);
      this.$toast("您的举报信息我们已将收到,会在三个工作日内处理");
    },
    // 拉黑作者
    async blackAut() {
      try {
        let res = await apiBlackArt(this.autId);
        window.console.log(res);
      } catch (error) {
        window.console.log(error.message);
      }
      // 关闭面板
      this.$emit("input", false);
    }
  }
};
</script>

<style>
</style>