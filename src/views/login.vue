<template>
  <div class="login">
    <!-- navBar导航 -->
    <van-nav-bar class="loginBar">
      <!-- 使用插槽的两种方法 -->
      <div class="title" slot="title">登录</div>
      <!-- <template slot="title">
           <div class="title">登录</div>
      </template>-->
    </van-nav-bar>
    <!-- 输入框 -->
    <van-cell-group>
      <van-field value="请输入手机" v-model="user.phone" :error-message="check.phone">
        <i class="iconfont icon-phone" slot="left-icon"></i>
      </van-field>
      <van-field value="请输入验证码" v-model="user.password" :error-message="check.password">
        <i class="iconfont icon-icon--" slot="left-icon"></i>
        <van-button slot="button" size="small" class="login-btn">获取验证码</van-button>
      </van-field>
    </van-cell-group>
    <!-- 按钮 -->
    <div class="mybtn">
      <van-button
        class="btn"
        type="info"
        size="large"
        @click="loginClick"
        :loading="isloading"
        loading-text="登录中..."
      >登录</van-button>
    </div>
    <!-- 隐私条款 -->
    <div class="info">隐私条款</div>
  </div>
</template>

<script>
// 导入登录api
import { apiLogin } from "../api/api.js";
import { async } from "q";
// import axios from "axios";
export default {
  // name:login,
  data() {
    return {
      user: {
        phone: "13911111111",
        password: "246810"
      },
      check: {
        phone: "",
        password: ""
      },
      isloading: false
    };
  },
  methods: {
    // 点击登录按钮发送axios,并跳转页面
    loginClick() {
      this.isloading = true;
      if (!this.checking()) {
        return;
      }
      // 定时器loading状态的实现
      setTimeout(async () => {
        try {
          // 发送 axios获取用户信息
          let res = await apiLogin({
            mobile: this.user.phone,
            code: this.user.password
          });
          // 将信息保存在Vuex仓库中
          this.$store.commit("setuser", res.data.data);
          // this.$router.push('/index');
          // 获当前路由的路径
          let path = this.$route.path;
          // 跳转首页
          if(path==='/login' || path==='/'){
            this.$router.push('/index');
          }
          // 返回上一个页面
          if(path==='/checklogin'){
            window.console.log("hahah");
            this.$router.back();
          }
        } catch (error) {
          this.$toast.fail("登录失败");
        }
        this.isloading = false;
      }, 1000);
    },
    //验证手机号与验证码是否合法
    checking() {
      let phone = true;
      let password = true;
      let res = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (!res.test(this.user.phone)) {
        this.check.phone = "手机号符合法";
        phone = false;
      } else {
        this.check.phone = "";
      }
      if (this.user.password.trim().length != 6) {
        this.check.password = "验证码不合法";
        password = false;
      } else {
        this.check.password = "";
      }
      return phone && password;
    }
  }
};
</script>

<style lang="less">
.login {
  .loginBar {
    background-color: rgb(50, 150, 250);
    .title {
      color: #fff;
    }
  }
  .login-btn {
    background-color: rgb(238, 242, 246);
    border-radius: 20px;
  }
  .iconfont {
    font-size: 20px;
  }
  .mybtn {
    margin: 40px 20px 20px 20px;

    .btn {
      border-radius: 10px;
    }
  }
  .info {
    position: absolute;
    bottom: 20px;
    left: 50%;
    margin-left: -50px;
    color: #ccc;
  }
}
</style>