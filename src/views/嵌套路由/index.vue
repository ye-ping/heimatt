<template>
  <div class="index">
    <!-- top -->
    <van-nav-bar class="loginBar" fixed>
      <!-- 插槽 -->
      <div class="title" slot="title">首页</div>
    </van-nav-bar>

    <!-- topBar频道 -->
    <van-tabs class="topBar" v-model="active">
      <van-tab v-for="(item,index) in channelsList" :key="index" :title="item.name">
        <!-- 下拉刷新 -->
        <van-pull-refresh v-model="item.isLoading" @refresh="onRefresh">
          <!-- 列表 -->
          <van-list
            class="list"
            v-model="item.loading"
            :finished="item.finished"
            finished-text="没有更多了"
            @load="onLoad"
            
          >
            <van-cell v-for="(subitem,subindex) in item.activeList" :key="subindex" @click="opened(subindex)" >
              <template slot="title">
                {{subitem.title}}
                <!-- 图片内容 -->
                <van-grid :border="false" :column-num="3">
                  <van-grid-item v-for="(ele,index) in subitem.cover.images" :key="index" >
                    <van-image lazy-load :src="ele" />
                  </van-grid-item>
                </van-grid>
                <!-- 评论内容 -->
                <div class="box">
                  <div class="left">
                    <span>{{subitem.aut_name}}</span>
                    <span>评论: {{subitem.comm_count}}</span>
                    <span>{{subitem.pubdate | Time}}</span>
                  </div>
                  <div class="right" @click="moreIcon(subitem)">
                    <van-icon name="cross" />
                  </div>
                </div>
              </template>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <!-- 图标 -->
      <van-icon @click="showPop" name="wap-nav" class="icon-nav" />
    </van-tabs>

    <!-- 弹出层 -->
    <mypop
      :value="show"
      @input="show=$event"
      :channelsList="channelsList"
      :active="active"
      @reset="active=$event"
    />
    <!-- more 更多 -->
    <more :value="moreShow" @input="moreShow=$event" :artid="artid" :autId="autId" @artid='deleart'></more>
  </div>
</template>

<script>
// 导入获取localStorage的方法
import { getLocal } from "../../utils/myloca.js";
// 导入获取频道的数据
import { apiChannels } from "../../api/channels.js";
// 导入获取频道列表的数据
import { apiActive } from "../../api/activeList.js";
// 导入弹出层
import mypop from "../../components/mypop.vue";
// 导入more弹出层
import more from '../../components/more.vue'
export default {
  data() {
    return {
      // loading: false, //加载中
      // finished: false, //加载完毕,设置为true不在执行onLoad
      // activeList: [], //数据源
      // isLoading: false, //下拉刷新
      // timestamp:null,//时间戳
      channelsList: [], //频道数组
      active: 0, //绑定频道的索引
      show: false, //弹出层是否显示
      moreShow:false,//more弹出层
      artid:null,//文章id
      autId:null,//作者id
    };
  },
  // 注册资组件
  components: {
    mypop,
    more
  },
  methods: {
    // list创建执行onLoad
    async onLoad() {
      // window.console.log(this.channelsList[this.active]);
      // 获取当前频道信息,添加的属性都保存到频道中了-----------------------------------------
      let currentChannels = this.channelsList[this.active];
      // 获取频道中的数据,和参数id
      let id = currentChannels.id;
      //  window.console.log(id);
      let res = await apiActive({
        channelId: id,
        timestamp: currentChannels.timestamp || Date.now()
      });
      // 保存数据
      currentChannels.activeList.push(...res.data.data.results);
      // this.activeList =[ ...this.activeList,...res.data.data.results];
      // 把onload设置为false
      currentChannels.loading = false;
      // 判断数据是否将加载完
      if (res.data.data.results === 0) {
        // 加载完毕将finished设置为true,就会停止加载
        currentChannels.finished = true;
      }
    },
    // 下拉刷新会执行的函数
    onRefresh() {
      // 获取当前频道信息,重置加载需要的变量
      let currentChannels = this.channelsList[this.active];
      currentChannels.loading = false;
      currentChannels.finished = false;
      currentChannels.activeList = [];
      currentChannels.timestamp = null;
      // 重新加载
      this.onLoad();
      currentChannels.isLoading = false;
    },
    // 给频道的数据源添加额外的属性
    setChannels() {
      this.channelsList.forEach(item => {
        this.$set(item, "loading", false);
        this.$set(item, "finished", false);
        this.$set(item, "isLoading", false);
        this.$set(item, "timestamp", null);
        this.$set(item, "activeList", []);
      });
    },
    showPop() {
      // 点击菜单按钮时,弹出层显示
      this.show = true;
    },
    // 点击叉叉显示more弹出层
    moreIcon(subitem){ 
      this.artid = subitem.art_id;//获取文章id,传入子组件
      this.autId = subitem.aut_id;//传入作者id
      // window.console.log(this.autId);
      this.moreShow=true;
    },
    // 删除文章
    deleart(value){
       // 获取当前频道信息
      let currentChannels = this.channelsList[this.active];
      let artlist = currentChannels.activeList;
      // 遍历文章列表
      artlist.forEach((item,index)=>{
        if(item.art_id===value){
          // 删除文章
          artlist.splice(index,1);
        }
      })
      // window.console.log(artlist);
    },
    // 跳转到详情页
    opened(index){
      // window.console.log(index);
      let currentChannels = this.channelsList[this.active];
      // window.console.log(currentChannels.activeList[index]);
      let artId = currentChannels.activeList[index].art_id;
      // window.console.log(artId);
      this.$router.push(`/detail/${artId}`)
    }
  },
  // 生命周期钩子,判断用户是否有登录
  async created() {
    //data数据创建了,但是el挂载点还没有创建(准备创建el)
    let user = this.$store.state.user;
    if (user && user.token) {
      //已经登录
      let res = await apiChannels();
      this.channelsList = res.data.data.channels;
    } else {
      //没有登录,判断用户是否更改了频道的数据
      let myChannels = getLocal("myChannels");
      if (myChannels) {
        //说明用户改过了,直接取出来赋值
        this.channelsList = myChannels;
      } else {
        //说明用户没有改过
        let res = await apiChannels();
        this.channelsList = res.data.data.channels;
        // window.console.log(this.channelsList);
      }
    }
    // 给频道数据添加额外属性
    this.setChannels();
  }
};
</script>

<style lang="less">
.index {
  margin-top: 90px;
  .loginBar {
    background-color: rgb(50, 150, 250);
    .title {
      color: #fff;
    }
  }
  .van-tabs__wrap {
    // margin-top: 46px;
    position: fixed;
    left: 0;
    top: 46px;
    z-index: 999;
    width: 91%;
  }
  .icon-nav {
    position: fixed;
    right: 0px;
    top: 46px;
    font-size: 26px;
    // width: 10%;
    height: 46px;
    text-align: center;
    line-height: 46px;
    padding: 0 5px;
  }
  .box{
    display: flex;
    justify-content: space-between;
    .left{
      span {
        margin-right: 10px;
        color: #ccc;
      }
    }
    .right {
      width: 20px;
      height: 15px;
      border: solid 1px #ccc;
      text-align: center;
      line-height: 15px;
      color: #ccc;
    }
  }
.icon-nav{
  background-color: #fff;
}
.van-tab {
   background-color: #fff;
}
}
</style>