<!--我的卡包 信用卡-->
<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="init">
      <!-- 卡列表 -->
      <div class="body-box" v-if="dataList&&dataList.length!=0">
        <ul class="pad-30 card-list save">
          <li
            v-for="(v,k) in dataList"
            @click="$router.push('/savingsCardManagement?cardId='+v.cardId)"
            :key="k"
            class="fff mag-b-20 f-left"
          >
            <div class="fiex fiex-top" style="line-height: 1.2em;">
              <div class="back-logo-box">
                <img
                  class="back-logo"
                  :src="v.issuingBank|fmtBankimsrc"
                  :onerror="commonConfig.errorImg"
                />
              </div>
              <div class="f-34 mag-l-20 fiex1">
                <div>{{v.issuingBank|backName}}</div>
                <div class="f-24 f-left mag-t-10">储蓄卡</div>
                <div class="mag-t-60 fiex f-left">
                  <div class="fiex1">****</div>
                  <div class="fiex1">****</div>
                  <div class="fiex1">****</div>
                  <div class="fiex1 f-36" style="margin-top:-0.15rem;">{{v.cardNumber|backOrder}}</div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="bg-fff fiex card-no-data" v-else>
        <div class="fiex1 c94 f-24">
          <div style="margin-top:-2rem">
            <img class="card-no-data-img" src="../../images/kzt_wk.png" />
          </div>
          <div class="mag-t-30">还没有添加任何一张储蓄卡哦</div>
          <div @click="addJumCard('SC')" class="blue f-30 mag-t-50">去添加</div>
        </div>
      </div>
      </van-pull-refresh>
  </div>
</template>

<script>
var self = "";
import NODATCARD from "@/components/dontHaveCard.vue";
export default {
  data() {
    return {
      active: 1,
      isLoading: false,//下拉刷新
      show:false,
      dataList: "" //卡列表
    };
  },
  components: {},
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    self = this;
    self.init(); //加载数据
  },
  //方法定义
  methods: {
    addCard(){ //添加卡弹层开启
        self.show = true;
      // $router.push('/addSavingsDepositCard')
    },
    addJumCard(type){ //添加卡 type: SC”储蓄卡，“CC”信用卡
      if(type=='SC'){
        self.$router.push('/addSavingsDepositCard');
        return
      }
      if(type=='CC'){
         self.$router.push('/addCardPage');
        return
      }
      // $router.push('/addSavingsDepositCard')
    },
    async init() {
      var getCard = await self.$axios(
        self.$store.state.http + "CardInformation/getCard",
        {
          merChantId: self.$store.state.merChantId, //商户号
          token: self.$store.state.token,
          cardType: "SC" //（“SC”储蓄卡，“CC”信用卡）
        },
        "post"
      );
      // 加载状态结束
      self.loading = false;
      self.finished = true;
         setTimeout(()=>{
           self.isLoading = false;
        },500)
      if (getCard.respCode == "0000") {
        //存储用户登录的数据
        self.dataList = getCard.data;
      } else {
        return;
      }
    },
    selTitle(val) {
      //标签切换
      if (val == 0) {
        //信用卡
        this.$router.push("/creditCardPage");
        return;
      }
      if (val == 1) {
        //储蓄卡
        this.$router.push("/savingsDepositCard");
        return;
      }
    }
  }
};
</script>
<style lang='less' scoped>
/* @import url(); 引入css类 */
@import "./index.less";
</style>