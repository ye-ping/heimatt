<template>
  <div class="search">
    <!-- 搜索框 -->
    <form action="/">
      <van-search
        v-model="key"
        background="#3296fa"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch"
        @cancel="onCancel"
        @input="input"
      />
    </form>
    <!-- 搜索联想 -->
    <van-cell-group v-if="thinkList.length>0 ">
      <van-cell
        icon="search"
        @click="onSearch(item.item)"
        v-for="(item,index) in thinkList"
        :key="index"
      >
        <template slot="title">
          <div v-html="item.colorItem"></div>
        </template>
      </van-cell>
    </van-cell-group>
    <!-- 历史记录 -->
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <template slot="right-icon">
          <van-icon name="delete" @click="empty" />
        </template>
      </van-cell>
      <van-cell
        icon="search"
        @click="onSearch(item)"
        v-for="(item,index) in searchList"
        :key="index"
        :title="item"
      >
        <template slot="right-icon">
          <van-icon name="cross" @click.stop="deleteItem(index)" />
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
// 导入搜索联想的api
import { apiThink } from "../../api/activeList.js";
// 导入没有local
import { getLocal, setLocal, removeLocal } from "../../utils/myloca.js";
export default {
  data() {
    return {
      key: "", //搜索关键字
      thinkList: [], //联想列表
      timer: null, //计时器,清除js抖动
      searchList: getLocal("history") || [] //历史记录列表
    };
  },
  methods: {
    //   input事件,联想结果
    //   解决js的抖动
    input() {
      clearTimeout(this.timer); //每次执行清除定时器
      this.timer = setTimeout(async () => {
        // 非空判断
        if (this.key.trim().length == 0) {
          // 把thinkList清空
          this.thinkList = [];
          return;
        }
        // 发送axios请求联想列表
        let res = await apiThink(this.key.trim());
        this.thinkList = res.data.data.options;
        //   改造返回关键字
        this.thinkList = this.thinkList.map((item, index) => {
          return {
            colorItem: item.split(this.key).join(`<span style="color:red">${this.key}</span>`),
            item: item
          };
        });
      }, 300);
    },
    // 点击回车键的时候触发
    onSearch(value) {
      // 保存搜索历史
      this.searchList.unshift(value);
      // 去重,去掉重复的选项
      this.searchList = [...new Set(this.searchList)];
      // 添加到localStorage中
      setLocal("history", this.searchList);
      // 跳转搜索结果页面
      this.$router.push(`/searchResult/${value}`);
    },
    //   点击取消按钮是触发
    onCancel() {
      this.key = "";
      this.thinkList = [];
    },
    // 删除历史记录
    deleteItem(index) {
      this.searchList.splice(index, 1);
      // 再次保存到localStorage中
      setLocal("history", this.searchList);
      // 注意事件冒泡
    },
    // 清空历史搜索
    empty() {
      // 提示用户确定要清空吗
      this.$dialog
        .confirm({
          title: "警告",
          message: "您确定要清空所有历史记录吗"
        })
        .then(() => {
          this.searchList = [];
          removeLocal("history");
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="less">
.search {
  .van-search__action {
    color: #fff;
    background-color: #3296fa;
  }
}
</style>