<template>
  <div class="index">
    <div class="nav">
      <van-search background="" class="search" placeholder="搜索" shape="round" v-model="value" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: ""
    };
  }
};
</script>

<style lang='less'>
.index {
  .nav {
    height: 80px;
    background-color: rgb(50, 150, 250);
    overflow: hidden;
    .search {
      padding: 0;
      margin: 30px 30px 10px 30px;

      .van-search__content {
        // border-radius: 30px;
        height: 40px;
      }
    }
  }
}
</style>