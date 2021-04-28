<!-- 账单制定计划-->
<template>
  <div>
    <van-nav-bar
      title="制定计划"
      left-arrow
      @click-left="$router.push('/homePage/home')"
      @click-right="$router.push('/addCardPage')"
    >
      <van-icon name="plus" class="f-32" slot="right" />
    </van-nav-bar>
    <div class="body-box oh">
      <div class="header-box-46"></div>
      <!-- 模式列表 -->
      <ul class="pad-25 pad-l-10 pad-r-10">
        <li
          v-for="(v,k) in returnData"
          :key="k"
          @click="openUrl(v)"
          class="pad-20 pad-b-30 pad-t-30 bg-fff fiex bor-5 mag-20"
        >
          <div>
            <img class="bill-iocn-img" :src="v.icon?v.icon:commonConfig.errorHeaderImg"  />
          </div>
          <div class="fiex1 mag-l-20">
            <div class="fiex">
              <div>
                <div class="f-32 c43 fiex pr">
                  <span>{{v.aisleName}}</span>
                  <img
                    @click.stop="openTipFun(v)"
                    class="bill-iocn-tip mag-l-10"
                    src="../../images/zd_shuoming.png"
                  />
                  <!-- 支持的银行 -->
                  <div
                    v-if="v.tipOpen==1"
                    @click.stop="openTipFun(v)"
                    class="pa pad-20 bill-tip fff f-22 f-left"
                  >
                    <div class="pr icon-down">
                      <div class="pa triangle-up"></div>
                      <div>{{v.remarks}}</div>
                    </div>
                  </div>
                </div>
                <div
                  class="c94 f-20 f-left"
                >还款金额 {{v.minAmount|moneYuan}}元-{{v.maxAmount|moneYuan}}元</div>
              </div>
              <div class="c43 f-30 fiex1 f-right">{{v.rate|accMul100}}% + {{v.d0Fee|moneYuan}}</div>
            </div>
          </div>
        </li>
        <li class="pad-30 bg-fff fiex mag-t-20 bor-5" style="display: none;">
          <div>
            <img class="bill-iocn-img" src="../../images/zd_huankuan2.png" />
          </div>
          <div class="fiex1 mag-l-20">
            <div class="fiex">
              <div>
                <div class="f-32 c43 fiex pr">
                  <span>小额新手模式</span>
                  <img class="bill-iocn-tip mag-l-10" src="../../images/zd_shuoming.png" />
                  <!-- 支持的银行 -->
                  <!-- <div class="pa pad-20 bill-tip fff f-22 f-left">
                         <div class="pr icon-down">
                           <div class="pa triangle-up"></div>
                           支持浦发银行单笔单日1万；邮储，光大，招商，交通，民生，华夏，平安，广州，上海，建设，工商，北京，中信
                         </div>
                  </div>-->
                </div>
                <div class="c94 f-20 f-left">还款金额500.00-1000000.00</div>
              </div>
              <div class="c43 f-30 fiex1 f-right">0.64%+1</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
var self = "";
export default {
  data() {
    return {
      returnData: {}
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    self = this;
    self.init();
      // window.removeEventListener("popstate",test,false);
  },
  //方法定义
  methods: {
    openUrl(v) {
      //判断是否绑定储蓄卡
      if (self.$store.state.card == "0") {
         self.$dialog.confirm({
          title: "提示",
          message: "您尚未绑定储蓄卡请绑定"
        })
          .then(() => {
            self.$router.push("/addSavingsDepositCard");
          })
          .catch(() => {
          });
        return;
      }
      //判断是否绑定信用卡
      if (self.$store.state.credit == "0") {
         self.$dialog.confirm({
          title: "提示",
          message: "您尚未绑定信用卡请绑定"
        })
          .then(() => {
            self.$router.push("/addCardPage");
          })
          .catch(() => {
          });
        return;
      }
      var sendData = {
        merchantId: self.$store.state.merChantId,
        institutionId: self.$store.state.institutionId,
        appId: self.$store.state.appId,
        token: self.$store.state.token,
        hearderType:"1",//显示头部
      };
      var sendStr = self.parameterSplicing(sendData);
      console.log(sendStr);
      location.href = v.url + "?" + sendStr;
    },
    openTipFun(v) {
      //打开详细信息弹窗
      if (v.tipOpen == 1) {
        v.tipOpen = 0;
      } else {
        v.tipOpen = 1;
      }
      self.$forceUpdate();
    },
    async init() {
      var rate = await self.$axios(
        //获取各个计划的费率
        "http://47.104.161.254:1181/aisle/rate",
        {
          merchantId: self.$store.state.merChantId,
          open: "1",
          sort: "orderBy",
          order: "asc",
          institutionId: self.$store.state.institutionId,
          appId: self.$store.state.appId
        },
        "post"
      );
      if (rate.respCode == "0000") {
        self.returnData = rate.data;
        $.each(self.returnData, (k, v) => {
          v.tipOpen = 0; //植入tip的弹窗提示开关 0:关闭 1:开启
        });
      } else {
        self.$toast(rate.respDesc);
      }
      console.log("rate", rate);
    }
  }
};
</script>
<style lang='less' scoped>
/* @import url(); 引入css类 */
@import "./index.less";
</style>