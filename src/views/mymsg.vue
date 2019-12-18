<template>
  <div class="message">
    <!-- header导航栏 -->
    <van-nav-bar
      class="loginBar"
      @click-right="onClickRight"
      @click-left="onClickLeft"
      right-text="保存"
    >
      <div class="title" left-arrow slot="title">个人信息</div>
      <van-icon name="arrow-left" slot="left" />
    </van-nav-bar>
    <van-cell title="头像" @click="imgShow=true" is-link>
      <template slot="default">
        <img class="img" :src="message.photo" alt />
      </template>
    </van-cell>
    <van-cell title="昵称" is-link @click="nameClick">
      <template slot="default">{{message.name}}</template>
    </van-cell>
    <van-cell title="介绍" is-link @click="jieshaoClick">
      <template slot="default">{{message.intro}}</template>
    </van-cell>
    <van-cell title="性别" is-link>
      <template slot="default">{{message.gender===1? "女":"男"}}</template>
    </van-cell>
    <van-cell title="生日" is-link>
      <template slot="default">{{message.birthday}}</template>
    </van-cell>
    <!-- 弹出层 -->
    <van-popup v-model="nameShow" position="bottom" :style="{ height: '8%' }">
      <van-search v-model="message.name" show-action shape="round" @search="onSearch">
        <div slot="action" @click="onSearch">修改</div>
      </van-search>
    </van-popup>
    <van-popup v-model="introShow" position="bottom" :style="{ height: '8%' }">
      <van-search v-model="message.intro" show-action shape="round" @search="introShow=false">
        <div slot="action" @click="introShow=false">修改</div>
      </van-search>
    </van-popup>
    <!-- 添加一个头像选择面板 -->
    <van-popup v-model="imgShow">
      <van-nav-bar>
        <template slot="title">
          <div @click="showimgselect">从相册中选择</div>
        </template>
      </van-nav-bar>
      <input type="file" @change="changeing" style="display:none" ref="myfile" />
      <van-nav-bar title="拍照" />
      <van-nav-bar title="取消" />
    </van-popup>
  </div>
</template>

<script>
// 图片预览
import Vue from "vue";
import { ImagePreview } from "vant";

Vue.use(ImagePreview);

// 导入获取用户个人信息详情
import { apiUserProfile } from "../api/api.js";
// 获取用户简介
import { apiUserId } from "../api/api.js";
// 导入修改用户信息的api
import { apiUserMod, apiUserPhoto } from "../api/api.js";
import { async } from "q";
export default {
  data() {
    return {
      message: {}, //数据源
      // intro: "",
      nameShow: false, //弹出层
      introShow: false,
      imgShow: false
    };
  },
  methods: {
    // 保存按钮
    async onClickRight() {
      let res = await apiUserMod({
        name: this.message.name,
        gender: this.message.gender,
        birthday: this.message.birthday,
        intro: this.message.intro
      });
      window.console.log(res);
    },
    // 返回上一个路由
    onClickLeft() {
      this.$router.back();
    },
    onSearch() {
      this.show = false;
    },
    // 修改昵称
    nameClick() {
      this.nameShow = true;
      this.$set(this.message, "flage", "name");
    },
    // 修改简介
    jieshaoClick() {
      this.introShow = true;
      this.$set(this.message, "flage", "intro");
    },
    // 点击从相册中选择相片
    showimgselect() {
      // 得到上传框对象
      let myfile = this.$refs.myfile;
      // 触发它的点击事件
      myfile.click();
    },
    // 当选择的图片发生改变时,会触发
    changeing() {
      // 得到当前的图片
      let myimg = this.$refs.myfile.files[0];
      // 如果要预览图片
      // 要么将图片转成为一个在线地址
      let imgPath = URL.createObjectURL(myimg); //不建议使用,兼容性不好
      window.console.log(imgPath);
      // 要么将图片转成为一个base64格式的字符串
      // 转换方法: 创建一个fileReader对象
      let reader = new FileReader();
      // 调用转换的方法
      reader.readAsDataURL(myimg);
      // 注册load事件
      reader.addEventListener("load", () => {
        // window.console.log(reader.result);
        // 预览图片
        ImagePreview({
          images: [reader.result],
          // 注意要使用箭头函数
          onClose: () => {
            // 关闭时触发,图片预览自带的配置项
            // 关闭时触发另一个函数
            this.setIconImg();
          }
        });
      });
    },
    // 关闭图片预览面板后要执行的逻辑
    setIconImg() {
      // 关闭更换头像面板
      this.imgShow = false;
      // 打开询问弹出层
      this.$dialog.confirm({
        title: "标题",
        message: "要将此图片设置为头像吗?"
      })
        .then(async () => {
          // 确定,发送axios,保存图片
          // 获取file图片对象
          let photo = this.$refs.myfile.files[0];
         let res = await apiUserPhoto(photo);
         //保存
         this.message.photo = res.data.data.photo;
         window.console.log(res);
          
        })
        .catch(() => {
          window.console.log('2222');
          // on cancel
        });
    }
  },
  async created() {
    //data数据创建了,但是el挂载点还没有创建(准备创建el)
    let res = await apiUserProfile();
    this.message = res.data.data;
    //  window.console.log(res);
    let res2 = await apiUserId();
    this.$set(this.message, "intro", res2.data.data.intro);
  }
};
</script>

<style lang="less">
.message {
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
  .van-nav-bar__text {
    font-size: 14px;
    color: #fff;
  }
  .img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .van-icon.van-icon-search {
    display: none;
  }
  .van-popup {
    width: 80%;
  }
}

//  this.$dialog
//         .confirm({
//           title: "提示",
//           message: "要将此图片设置为头像吗"
//         })
//         .then(async () => {
//           window.console.log("确定");
//           // 确定,发送axios,保存到服务器
//           // 得到图片对象
//           let photo = this.$resf.myfile.files[0];
//           window.console.log(photo);
//           // let res = await apiUserPhoto(photo);
//           // window.console.log(res);
//         })
//         .catch(() => {
//           window.console.log("取消");
//           // 取消
//         });
</style>