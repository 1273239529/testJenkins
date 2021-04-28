<!--我的卡包 信用卡-->
<template>
  <div>
    <van-nav-bar title="我的卡包" left-arrow @click-left="$router.back()" @click-right="addCard()">
      <van-icon name="plus" class="f-32" slot="right" />
    </van-nav-bar>
    <div class="body-box oh">
      <div class="header-box-46"></div>
      <!-- 头部切换 -->
      <van-tabs
        v-model="active"
        :offset-top="45"
        :sticky="true"
        title-active-color="#3A87F8FF"
        color="#3A87F8FF"
      >
        <van-tab title="信用卡">
          <creditCardPage v-if="active==0"></creditCardPage>
        </van-tab>
        <van-tab title="储蓄卡">
          <savingsDepositCard v-if="active==1"></savingsDepositCard>
        </van-tab>
      </van-tabs>
      <!-- 头部切换end -->
    </div>
    <!-- 添加卡 -->
    <van-popup v-model="show" position="bottom">
      <div @click="addJumCard('CC')" class="vont-bottom pad-20">信用卡</div>
      <div @click="addJumCard('SC')" class="vont-bottom pad-20">储蓄卡</div>
    </van-popup>
  </div>
</template>

<script>
var self = "";
import creditCardPage from "@/views/creditCardPage/index.vue";
import savingsDepositCard from "@/views/savingsDepositCard/index.vue";
export default {
  data() {
    return {
      active: 0,
      show: false, //添加卡弹出框
      Cardlist: "" //卡列表
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    self = this;
    self.init(); //加载数据
  },
  components: {
    creditCardPage, //信用卡卡包
    savingsDepositCard //储蓄卡卡包
  },
  //方法定义
  methods: {
    addCard() {
      //添加卡弹层开启
      self.show = true;
    },
    addJumCard(type) {
      //添加卡 type: SC”储蓄卡，“CC”信用卡
      self.show = false;
      setTimeout(() => {
        if (type == "SC") {
          self.$router.push("/addSavingsDepositCard");
          return;
        }
        if (type == "CC") {
          self.$router.push("/addCardPage");
          return;
        }
      }, 100);

      // $router.push('/addSavingsDepositCard')
    },
    async init() {
       console.log("你好");
       console.log({aa:"你好"});
      var getCard = await self.$axios(
        self.$store.state.http + "CardInformation/getCard",
        {
          merChantId: self.$store.state.merChantId, //商户号
          token: self.$store.state.token,
          cardType: "CC" //（“SC”储蓄卡，“CC”信用卡）
        },
        "post"
      );
      // 加载状态结束
      self.loading = false;
      self.finished = true;
      if (getCard.respCode == "0000") {
        //存储用户登录的卡信息
        self.Cardlist = getCard.data;
        //计算还款日期
        if (self.Cardlist.length != 0) {
          $.each(self.Cardlist, function(k, v) {
            v.countDown = self.$fmthkdate(v.statementDate, v.repaymentDate); //计算还款日期
          });
        }
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