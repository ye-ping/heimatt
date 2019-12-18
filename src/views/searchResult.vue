<template>
  <div class="searchResult">
    <!-- header导航栏 -->
    <van-nav-bar class="loginBar" fixed @click-left="onClickLeft">
      <div class="title" left-arrow slot="title">搜索结果</div>
      <van-icon name="arrow-left" slot="left" />
    </van-nav-bar>
    <!-- 文章列表list -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="(item,index) in list" :key="index" @click="toDetail(item.art_id)">
        <template slot="title">
          {{item.title}}
          <!-- 图片 -->
          <van-grid :border="false" :column-num="3" v-if="item.cover.type>0">
            <van-grid-item v-for="(imgItem,imgIndex) in item.cover.images" :key="imgIndex">
              <van-image :src="imgItem" />
            </van-grid-item>
          </van-grid>
          <div class="left">
            <span>{{item.aut_name}}</span>
            <span>评论: {{item.comm_count}}</span>
            <span>{{item.pubdate | Time}}</span>
          </div>
          <!-- 评论点赞 -->
          <van-grid :column-num="3">
            <van-grid-item>
              <template slot="text">
                <div class="icon" @click="comment">
                  <van-icon name="chat-o" />评论
                </div>
              </template>
            </van-grid-item>
            <van-grid-item>
              <template slot="text">
                <div class="icon">
                  <van-icon name="good-job-o" />点赞
                </div>
              </template>
            </van-grid-item>
            <van-grid-item>
              <template slot="text">
                <div class="icon">
                  <van-icon name="star-o" />收藏
                </div>
              </template>
            </van-grid-item>
          </van-grid>
        </template>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
// 导入搜索结果的api
import { apiSearchResult } from "../api/activeList.js";
import { createConnection } from "net";
export default {
  data() {
    return {
      loading: false, //加载状态
      finished: false, //停止加载
      list: [], //数据源
      page: 0, //页数
      per_page: 10 //页容量
    };
  },
  // 事件
  methods: {
    // 点击右侧按钮返回
    onClickLeft() {
      // 返回上一个路由
      this.$router.back();
    },
    // list初始化时执行
    async onLoad() {
      // 获取参数q
      this.page = this.page + 1;
      let q = this.$route.params.value;
      // 发送网络请求
      let res = await apiSearchResult({
        q: q,
        page: this.page,
        per_page: this.per_page
      });
      // 保存数据
      this.list.push(...res.data.data.results);
      // 判断数据是否加载完毕
      let total = res.data.data.total_count;
      if (this.list.length === total) {
        this.finished = true; //加载完毕
      }
      this.loading = false;
    },
    // 评论
    comment() {
      window.console.log("评论了");
      if (!this.$login()) {
        return;
      }
      window.console.log("评论了");
    },
    // 跳转到文章详情页面
    toDetail(artid){
      // window.console.log(artid);
      this.$router.push(`/detail/${artid}`);
    }
    // 上拉刷新
    // onRefresh(){
    //   //清空数据源
    //   this.loading = false;
    //   this.finished =false;
    //   this.page = false;
    //   this.list = [],
    //   this.isLiading = false;
    //   // 重新请求
    //   this.onLoad();
    // }
  },
  // 生命周期钩子
  created() {
    //data数据创建了,但是el挂载点还没有创建(准备创建el)
  }
};
</script>

<style lang="less">
.searchResult {
  .loginBar {
    background-color: rgb(50, 150, 250);
    .title {
      color: #fff;
    }
  }
  .van-nav-bar .van-icon {
    color: #fff;
    font-size: 20px;
  }
  .van-icon {
    font-size: 20px;
    margin-right: 5px;
  }
  .icon {
    display: flex;
    align-items: center;
  }
  .left {
    span {
      margin-right: 15px;
    }
  }
  .van-list {
    margin-top: 46px;
  }
}
</style>