<!-- 登录首页 -->
<template>
  <div class="body-box">
    <van-pull-refresh v-if="!iswxType" v-model="isLoading" @refresh="init">
    <div class="box-w-100">
      <!-- 用户信息 -->
      <div class="header-box pad-40">
        <!-- 头部 -->
        <div class="fiex">
          <div class="herader-img-box">
            <img
              class="herader-img"
              :src="userData.faceImgUrl?userData.faceImgUrl:commonConfig.errorHeaderImg"
              alt
            />
          </div>
          <div class="fff mag-l-20 f-32" v-if="userData.merName">{{userData.merName}}</div>
          <div class="fff mag-l-20 f-32" v-else>{{userData.merMp|handlePhone}}(未实名)</div>
        </div>
        <!-- 展示内容 -->
        <div class="mag-t-30 user-content-box bg-fff pad-30 fiex center">
          <div class="fiex1 card-data-box pr" @click="$router.push('/selCard')">
            <div class="f-48">{{userData.card+userData.credit}}</div>
            <div class="c94 f-28">已绑银行卡</div>
          </div>
          <div class="fiex1" @click="$router.push('/repaymentPlan')">
            <div class="f-48" v-if="userData.planNums">{{userData.planNums}}</div>
            <div class="f-48" v-else>0</div>
            <div class="c94 f-28">执行中计划</div>
          </div>
        </div>
      </div>
      <!-- 用户信息end -->
      <!-- 系统消息 -->
      <!-- <div class="pad-40 pad-t-25 pad-b-25 bg-fff f-left fiex">
        <div>
          <img class="notice-img" src="@/images/xtNotice.png" />
        </div>
        <div class="mag-l-30">
          <span class="f-28 c94">暂无系统消息</span>
        </div>
      </div>-->
      <!-- 系统消息end -->
      <!-- 底部内容部分 -->
      <div class="pad-25">
        <div class="fiex">
          <div class="bg-fff bor-5 fiex1 pad-40 pad-l-50">
            <div class="fiex" @click="noCardPay()">
              <div>
                <img class="list-img" src="@/images/wukazhifu.png" />
              </div>
              <div class="mag-l-20 f-left">
                <p class="f-34 c51">无卡支付</p>
                <p class="f-24 c94">快速到账</p>
              </div>
            </div>
          </div>
          <div style="width:0.2rem"></div>
          <div class="bg-fff bor-5 fiex1 pad-40 pad-l-50">
            <div class="fiex" @click="$router.push('/billExtension')">
              <div>
                <img class="list-img" src="@/images/zhangdanyanqi.png" />
              </div>
              <div class="mag-l-20 f-left">
                <p class="f-34 c51">制定计划</p>
                <p class="f-24 c94">还款延期</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分享 -->
      <div class="pad-20 pad-t-0" @click="shareBtn()">
        <img class="conten-img" src="@/images/fenxiang-money.png" />
      </div>
      <!-- 分享end -->
      <!-- 商学院 -->
      <div class="pad-20 pad-t-10" @click="sxyJum">
        <img class="conten-img" src="@/images/shangxueyuan.png" />
      </div>
      <!-- 商学院end -->
    </div>
     <Footer :active="0" />
    </van-pull-refresh>
    <div v-else>
        <img src="@/images/weixin.jpg" style="width:100vw;height:100vh"/>
    </div>
  </div>
</template>

<script>
var self = "";
import Footer from "@/components/footer.vue";
import bus from '@/main'
export default {
  data() {
    return {
      active: 2,
      isLoading:false,//下拉刷新
      userData: {//用户数据
          card:0,
          credit:0,
          palnNums:0,
      },
      iswxType:false,//判断是否为微信 true:是微信 false:不是微信
    };
  },
  components: {
    Footer
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    self = this;
    //判断是否为微信浏览器(不允许用户在微信使用)
     var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      self.iswxType = true;
      return
    }else{
       self.iswxType = false;
    }
    //提取url地址参数
    var institutionId = self.getUrl("institutionId");
     var appId = self.getUrl("appId");
    if(!institutionId){ //如果没有传从缓存中读取
          institutionId =  self.$store.state.institutionId;
          appId =  self.$store.state.appId;
    }
    if(self.$store.state.token){//存有token
      if(self.$store.state.institutionId==institutionId&&self.$store.state.appId==appId){ //存储的机构号与当前登录的机构号一致
           self.init(); //数据初始化
      }else{//存储的机构号与当前登录的机构号不一致
        //存储最新登录信息
        self.$store.commit("memoryLoginData",
          {
            institutionId:institutionId,//机构号
            appId:appId,//appid
          })
        self.$router.push('/login');//返回登录页面
      }

    }else{ //没有token 返回登录页面
      //存储institutionId(机构号) 与 appId
       self.$store.commit("memoryLoginData",
          {
            institutionId:institutionId,//机构号
            appId:appId,//appid
          })
        self.$router.push('/login');
    }
  },
  //方法定义
  methods: {
    shareBtn(){
      bus.$emit("selFooter", 1); //首页底部选择
      self.$router.push('/share');
    },
    sxyJum() {
      //商学院
      window.location.href = "https://uahlu.duanshu.com/#/";
    },
    async init() {
       bus.$emit("selFooter", 0); //首页底部选择 默认选择第一个
      //数据初始化
      //查商户
      var getMerChants = await self.$axios(
        self.$store.state.http + "MerChants/getMerChant",
        {
          merChantId: self.$store.state.merChantId, //商户号
          token: self.$store.state.token
        },
        "post"
      );
       setTimeout(() => {
           self.isLoading = false; //关闭下拉刷新状态
       },500)
      if (getMerChants.respCode == "0000") {
        //存储用户登录的数据
        self.$store.commit("memoryLoginData", getMerChants.data); //完善用户登录信息
        self.userData = getMerChants.data; //用户数据
      } else {
        return;
      }
      console.log("查商户的数据", getMerChants);
    },
    async noCardPay() {
      //无卡支付
      //测试外链
      // window.location.href = "http://hnocar.1818pay.cn/?merChantId="+self.$store.state.merChantId+"&institutionId="+self.$store.state.institutionId+"&appId="+self.$store.state.appId+"&token="+self.$store.state.token+'&hearderType=1&'+Math.random();
      // return
      //验证是否实名
      if (self.$store.state.merStat != "Y") {
        //没有实名
        self.$router.push("/realName"); //前往实名
        return;
      }
      //验证资质
      var Information = await self.$axios(
        self.commonConfig.qualifications + "/Information/select",
        {
          merChantId: self.$store.state.merChantId //商户号
        },
        "post"
      );
      //artificial:1:活体 2:人工
      //state: 1:成功 2:失败
      if (Information.respCode == "0000") {
        if (Information.data) { //有值
          if (Information.data.state == 1) { 
            //已经完成资料补充
            //跳转H5外链
            window.location.href =
              "http://hnocar.1818pay.cn/?merChantId=" +
              self.$store.state.merChantId +
              "&institutionId=" +
              self.$store.state.institutionId +
              "&appId=" +
              self.$store.state.appId +
              "&token=" +
              self.$store.state.token +
              "&hearderType=1&" +
              Math.random();
          } else {
            //没有完成资料认证
            self.$router.push("/manualAudit");
          }
        }else{ //接口没有参数
            //没有完成资料认证
            self.$router.push("/manualAudit");
        }
      } else {
        //失败原因
        self.$toast(Information.respDesc);
      }
      // console.log("资质验证",Information)

      // if(self.userData.merName){ //用户已经实名

      // }else{ //没有实名'
      //   self.$router.push('/manualAudit');
      // }
    }
  }
};
</script>
<style lang='less' scoped>
/* @import url(); 引入css类 */
@import "./index.less";
</style>