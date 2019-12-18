<template>
  <div class="detail">
    <!-- header导航栏 -->
    <van-nav-bar class="loginBar" fixed @click-left="onClickLeft">
      <div class="title" left-arrow slot="title">文章详情</div>
      <van-icon name="arrow-left" slot="left" />
    </van-nav-bar>
    <!-- 文章标题 -->
    <div class="art-title">
      <h2>{{listObj.title}}</h2>
    </div>
    <!-- 作者区 -->
    <div class="box">
      <div class="left">
        <img :src="listObj.aut_photo" alt />
        <div>
          <p>{{listObj.aut_name}}</p>
          <p>{{listObj.pubdate | Time}}</p>
        </div>
      </div>
      <div class="right">
        <van-button
          type="info"
          @click="followings"
          icon="plus"
          round
          class="btn"
          v-if="listObj.is_followed==false"
        >关注</van-button>
        <van-button type="info" @click="unFollowings" round class="btn" v-else>已关注</van-button>
      </div>
    </div>
    <!-- 内容区 -->
    <van-cell>
      <template slot="title">
        <div v-html="listObj.content"></div>
      </template>
    </van-cell>
    <!-- 点赞区 -->
    <div class="zan">
      <van-button
        @click="like"
        :type="listObj.attitude==1? 'danger' : 'default'"
        class="mybtn"
        icon="good-job-o"
        round
      >点赞</van-button>
      <van-button
        @click="disLike"
        :type="listObj.attitude==0? 'danger':'default'"
        class="mybtn"
        icon="delete"
        round
      >不喜欢</van-button>
    </div>
    <!-- 评论区 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <comment @openReply="openReply" :item="item" :isComment="true" v-for="(item,index) in commentList" :key="index"></comment>
    </van-list>

    <!-- 发表评论区 -->
    <mywrite :artId="artId" @comment="mywirte" :isComment="true" ></mywrite>
    <!-- 弹出层面板 -->
    <reply :value="isReply" @input="isReply=$event"></reply>
  </div>
</template>

<script>
// 导入评论组件
import comment from "../components/comment";
// 导入发表评论组件
import mywrite from "../components/wirte";
// 导入获取文章详情的api
import { apiGetActive, apiLikings, apiDislike } from "../api/activeList.js";
// 导入关注用户的api
import { apiFollowings, apiUserFollowings } from "../api/api.js";
// 导入评论的api
import { apiGetComment } from "../api/comment.js";
// 导入评论弹出层面板
import reply from '../components/reply'
export default {
  data() {
    return {
      artId: null, //文章id
      listObj: {}, //文章详情数据源
      loading: false, //加载状态
      finished: false, //是否加载完毕
      offset: null, //偏移量
      endId: null,
      commentList: [], //评论数据源
      isReply:false,//评论弹出层
      //   attitude:-1,//状态,-1无状态,0不喜欢,1喜欢
    };
  },
  methods: {
    //   数据源初始化时执行
    async onLoad() {
      // 发送axios,请求数据
      let res = await apiGetComment({
        artId: this.artId,
        offset: this.offset,
        limit: 10
      });
      //保存数据
      this.offset = res.data.data.last_id;
      this.endId = res.data.data.end_id;
      this.commentList.push(...res.data.data.results);
      // window.console.log(this.commentList);
      // 当offset等于endId是说明数据加载完毕
      if (this.offset === this.endId) {
        this.finished = true;
      }
      // 当前页数据加载完毕,重置加载状态,请求下一页数据
      this.loading =false;
    },
    // 回退上一个路由
    onClickLeft() {
      this.$router.back();
    },
    // 获取文章详情
    async xiangqing() {
      let res = await apiGetActive(this.artId);
      //  保存数据
      this.listObj = res.data.data;
      window.console.log(res);
    },
    // 关注用户
    async followings() {
      let res = await apiFollowings(this.listObj.aut_id);
      //   手动设置为true,关注
      this.listObj.is_followed = true;
    },
    // 取消关注
    async unFollowings() {
      try {
        let res = await apiUserFollowings(this.listObj.aut_id);
      } catch (error) {
        window.console.log(error);
      }
      this.listObj.is_followed = false;
    },
    // 对文章点赞
    async like() {
      let res = await apiLikings(this.artId);
      //    状态改成喜欢
      this.listObj.attitude = 1;
      //   window.console.log(res);
    },
    // 不喜欢文章
    async disLike() {
      let res = await apiDislike(this.artId);
      //    状态改为不喜欢
      this.listObj.attitude = 0;
      window.console.log(res);
    },
    // 接受发表评论的参数
    mywirte(value) {
      this.commentList.unshift(value);
      window.console.log(value);
    },
    openReply(bool){
        this.isReply = bool;
        // window.console.log(this.isReply);
    }
  },
  //生命周期钩子
  created() {
    //data数据创建了,但是el挂载点还没有创建(准备创建el)
    //   获取文章id
    let id = this.$route.params.artId;
    this.artId = id;
    // 获取文章详情
    this.xiangqing();
  },
  //   注册组件
  components: {
    comment,
    mywrite,
    reply
  }
};
</script>

<style lang="less" scoped>
.detail {
  margin-bottom: 50px;
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
  .art-title {
    margin: 70px 10px 10px 20px;
    font-size: 14px;
    font-weight: 400;
  }
  .box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      //   align-items: center;
      display: flex;
      margin-left: 10px;
      img {
        width: 70px;
        height: 70px;
        border-radius: 50%;
      }
      p {
        margin: 0;
        margin-top: 5px;
      }
    }
    .right {
      margin-right: 10px;
      .btn {
        width: 100px;
      }
    }
  }
  .conten {
    margin: 20px 10px;
  }
  .zan {
    text-align: center;
    .mybtn {
      margin: 20px;
      width: 100px;
    }
  }
}
</style>