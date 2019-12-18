<template>
  <div class="mypop">
    <!-- 弹出层 -->
    <van-popup
      :value="value"
      @input="popData"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '84%' }"
    >
      <!-- 我的频道 -->
      <van-cell class="myChannels" title="我的频道">
        <template slot="default">
          <van-button
            plain
            round
            size="mini"
            type="danger"
            v-if="iconShow===false"
            @click="iconShow=true"
          >编辑</van-button>
          <van-button
            plain
            round
            size="mini"
            type="danger"
            v-if="iconShow===true"
            @click="iconShow=false"
          >完成</van-button>
        </template>
      </van-cell>
      <!-- 宫格 -->
      <van-grid :gutter="10">
        <van-grid-item class="text" v-for="(item,index) in channelsList" :key="index">
          <template slot="text">
            <div :class="{active:active==index}" @click="resetActive(index)">
              {{item.name}}
              <van-icon class="icon" @click.stop="deleChannels(index)" name="close" v-show="iconShow &&index!=0" />
            </div>
          </template>
        </van-grid-item>
      </van-grid>
      <!-- 频道推荐 -->
      <van-cell class="myChannels" title="我的频道"></van-cell>
      <!-- 宫格 -->
      <van-grid :gutter="6">
        <van-grid-item
          v-for="(item,index) in filterChannels"
          :key="index"
          :text="item.name"
          @click="addChannels(item)"
        />
      </van-grid>
    </van-popup>
  </div>
</template>

<script>
// 导入获取所有频道的api
import { apiAllChannels, apiSaveChannels } from "../api/channels.js";
// 导入用户保存频道api
// 导入local方法
import { setLocal } from "../utils/myloca.js";
export default {
  // 接收父组件传递过来的数据
  //    弹出层显示隐藏   频道数据    父组件频道下标
  props: ["value", "channelsList","active"],
  data() {
    return {
      AllChannels: [], //所有频道数据
      iconShow: false //图标显示隐藏
    };
  },
  methods: {
    //   向父组件传递的数据
    popData() {
      this.$emit("input", false);
    },
    resetActive(index){
        this.$emit("reset",index);
    },
    // 添加频道数据
    async addChannels(item) {
      // 给频道数据对象添加属性
      this.$set(item, "loading", false);
      this.$set(item, "finished", false);
      this.$set(item, "isLoading", false);
      this.$set(item, "timestamp", null);
      this.$set(item, "activeList", []);
      // 追加频道数据
      this.channelsList.push(item);

      // 保存数据,先判断用户是否登录
      let token = this.$store.state.user.token;
      if (token) {
        //说明用户已经登录
        // 将数据保存到服务器
        // 从数据中去掉第一个元素
        let channels = this.channelsList.slice(1).map((item, index) => {
          return {
            id: item.id,
            seq: index + 2
          };
        });
        let res = await apiSaveChannels(channels);
      } else {
        //   说明用户没有登录,将数据保存到loclStorage中
        setLocal("myChannels",this.channelsList);
      }
    },
// 删除频道数据
   async deleChannels(index){
        this.channelsList.splice(index,1);
        // 进频道信息进行保存,判断是否登录
        let token = this.$store.state.user.token;
        if(token){//以登录
            // 发送axios的服务器
          let channels =  this.channelsList.slice(1).map((item,index)=>{
                return {
                    id:item.id,
                    seq: index +2
                }
            })
            // 将数据保存到服务器
          let res = await  apiSaveChannels(channels)
        }else {//未登录
            setLocal('myChannels',this.channelsList);
        }
    }
  },
  //   生命周期钩子发送axios获取频道推荐的数据
  async created() {
    //data数据创建了,但是el挂载点还没有创建(准备创建el)
    let res = await apiAllChannels();

    this.AllChannels = res.data.data.channels;
    // window.console.log(this.AllChannels);
  },
  //   计算属性,筛选出搜有的频道中不在,首页频道中的数据
  computed: {
    //函数一定需要返回值
    filterChannels() {
      // 获取首页频道中的id
      let idArr = this.channelsList.map(item => {
        return item.id;
      });
      // 通过筛选将不在首页评道中频道返回
      let arr = this.AllChannels.filter(item => {
        return idArr.includes(item.id) === false;
      });
      return arr;
    }
  }
};
</script>

<style lang="less">
.mypop {
  .myChannels {
    margin-top: 35px;
  }
  .text {
    position: relative;
    .icon {
      position: absolute;
      top: -1px;
      right: -40;
    }
  }
  .active {
      color: red;
  }
}
</style>