<!-- 登录页面 -->
<template>
  <div class="box-w-100">
    <div class="logo-bg-title  pad-25 center fiex">
      <div class="fiex1">
        <img :src="$store.state.logo" style="width:2rem;height:2rem;border-radius: 0.5rem;" />
        <!-- <div class="fff f-30 mag-t-20 f-b">{{$store.state.appName}}</div> -->
      </div>
    </div>
    <div class="pad-100 f-left">
      <div class="f-40 font-w-500">登录</div>
      <div class="mag-t-50 f-30">
        <van-field
          style="padding-left: 0;"
          v-model="sendCodeData.merMp"
          clearable
          class="noborder border-b"
          placeholder="请输入手机号"
          @input="clickLogin()"
        />
        <div class="fiex border-b">
          <van-field
            clearable
            style="padding-left: 0;"
            v-model="codeData.identifying"
            class="noborder fiex1"
            placeholder="请输入验证码"
            @input="clickLogin()"
          />
          <div v-if="codeData.type==false" class="c-blue f-30" @click="sendCode">发送验证码</div>
          <div v-else class="c-blue f-30">{{codeData.time}}s</div>
        </div>
      </div>
      <div
        @click="loginFun()"
        :class="{'opacity-5':loginBtnType==false}"
        class="blue-btn fff center mag-t-100"
      >登录</div>
      <test :tt="codeData" />
    </div>
  </div>
</template>

<script>
import config from "../../common/js/config.js";
import test from "@/components/test.vue";
var self = "";
export default {
  components:{
    test
  },
  data() {
    return {
      value: "",
      codeData: {
        //短信验证码
        box: "",
        time: 60,
        type: false,
        identifying: "" //短信验证码
      },
      sendCodeData: {
        //短信验证码发送数据
        institutionId: "", //机构号
        appId: "", //APPId
        appName: "", //APP名字
        merMp: "" //手机号
      },
      loginBtnType: false, //登录按钮的点击状态
      merChantId:""//商户号 (短信登录接口返回)
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    self = this;
    //登录信息存储
    this.init(); //获取店铺logo
  },
  //方法定义
  methods: {
    //监听登录按钮是否是否可以点击
    clickLogin() {
      if (self.sendCodeData.merMp == "" || self.codeData.identifying == "") {
        //手机号 与验证码 有一个为空登录按钮则为不可点击状态
        self.loginBtnType = false;
        return;
      } else {
        self.loginBtnType = true;
        return;
      }
    },
    async init() {
      //首页需要携带参数 institutionId appId
      //数据初始化
      var reqData = await self.$axios(
        "http://47.105.48.45:1079/public/data/getObject",
        {
          //存在问题机构号不是APP的唯一标识
          institutionId: self.$store.state.institutionId, //机构号 (初始数据来源于home页面)
          appId: self.$store.state.appId // appID (初始数据来源于home页面)
        },
        "get"
      );
      if(reqData.respCode=='0000'){
           //存储用户登录的数据
           //变更title
          window.document.title = reqData.data.appName;
          self.$store.commit("memoryLoginData",
          {
            http:reqData.data.domainName,//域名
            logo:reqData.data.logo,//银行logo
            appName:reqData.data.appName,//APP名字
          })
          self.$forceUpdate();

      }else{
        self.$toast(reqData.respDesc)
      }
    },
    async sendCode() {
      if (self.sendCodeData.merMp == "") {
        self.$toast("请输入手机号");
        return;
      }
      //发送短信验证码
      if (self.codeData.type == false) {
        var reqData = await self.$axios(
          self.$store.state.http + "/MerChants/mergeOrInsert",
          {
            merMp:self.sendCodeData.merMp,//手机号
            institutionId:self.$store.state.institutionId, //机构号 (初始数据来源于home页面)
            appId:self.$store.state.appId, //APPid
            appName:self.$store.state.appName,//APP名称
          },
          "post"
        );
        if (reqData.respCode == "0000") {
          self.merChantId = reqData.data;
          self.$toast("发送成功");
          self.codeData.box = setInterval(() => {
            self.codeData.time--;
            if (self.codeData.time == 1) {
              clearInterval(self.codeData.box);
              self.codeData.time = 60;
              self.codeData.type = false;
            }
          }, 1000);
          self.codeData.type = true;
        } else {
          self.$toast(reqData.respDesc);
        }
      } else {
        self.codeData.type = false;
      }
    },
    async loginFun() {
       if (self.sendCodeData.merMp == "") {
          self.$toast("请输入手机号");
          return
      }
      if (self.codeData.identifying == "") {
          self.$toast("请输入验证码");
          return
      }
      var reqData = await self.$axios(
        self.$store.state.http + "/MerChants/login",
        {
          merChantId:self.merChantId,//商户号
          merMp:self.sendCodeData.merMp,//手机号
          identifying:self.codeData.identifying,//验证码
          appId:self.sendCodeData.appId,//APPId
        },
        "post"
      );
     
     
      if (reqData.respCode == "0000") {
          //存储用户登录的数据
          self.$store.commit("memoryLoginData",
          {
            merChantId:self.merChantId,//商户号
            merMp:self.sendCodeData.merMp,//手机号
            appId:self.$store.state.appId,//来源于地址传递的参数
            token:reqData.data,//token
          })
          console.log("merChantId",self.merChantId)
          console.log("token",reqData.data)
         self.$router.push('/homePage/home');
      } else {
        self.$toast(reqData.respDesc);
      }
    }
  }
};
</script>
<style lang='less' scoped>
/* @import url(); 引入css类 */
@import "./index.less";
</style>