<!--信用卡管理-->
<template>
  <div>
    <van-nav-bar title="卡管理" left-arrow @click-left="$router.back()" @click-right="delCard()">
      <van-icon name="ellipsis" class="f-32" slot="right" />
    </van-nav-bar>
    <div class="body-box oh">
      <div class="header-box-46"></div>
      <ul class="card-list save pad-20 pad-b-50 bg-fff">
        <li class="fff mag-b-20" @click="$router.push('/cardManagement')">
          <div class="fiex fiex-top" style="line-height: 1.2em;">
            <div class="back-logo-box">
              <img
                class="back-logo"
                :src="cardDetil.issuingBank|fmtBankimsrc"
                :onerror="commonConfig.errorImg"
              />
            </div>
            <div class="f-34 mag-l-20 f-left fiex1">
              <div>{{cardDetil.issuingBank|backName}}【{{cardDetil.cardNumber|backOrder}}】</div>
              <div class="f-24 f-left mag-t-10">储蓄卡</div>
              <div class="mag-t-30 f-25">
                <div class="fiex f-left">
                  <div class="fiex1">****</div>
                  <div class="fiex1">****</div>
                  <div class="fiex1">****</div>
                  <div
                    class="fiex1 f-36"
                    style="margin-top:-0.15rem;"
                  >{{cardDetil.cardNumber|backOrder}}</div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <!-- 账单日 -->
      <div class="f-left">
        <van-cell-group>
          <van-field
            class="f-30 w-200"
            label="预留手机号"
            v-model="cardDetil.merMp"
            placeholder="预留手机号"
          />
        </van-cell-group>
        <!-- <van-cell title="预留手机号" is-link value="1533666201" /> -->
      </div>
      <div class="pad-20">
        <div @click="saveCard()" class="blue-btn fff center mag-t-100">保存</div>
      </div>
      <!-- 账单日end -->
    </div>
    <!-- 删除弹出层 -->
    <van-popup v-model="show" position="bottom">
      <div @click="confirm" class="vont-bottom pad-20 red">删除卡</div>
      <div @click="cancle" class="vont-bottom pad-20">取消</div>
    </van-popup>
  </div>
</template>

<script>
var self = "";
export default {
  data() {
    return {
      cardDetil: "", //卡详情
      cardId: "", //获取卡id
      show:false
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    self = this;
    self.cardId = self.$route.query.cardId;
    self.init();
  },
  //方法定义
  methods: {
    async delCard() { //打开删除卡弹窗
      self.show = true;
    },
    cancle() { //取消
      self.show = false;
    },
   async confirm() { //确认删除
      var getCard = await self.$axios(
        self.$store.state.http + "CardInformation/delCard",
        {
          token: self.$store.state.token,
          merChantId:self.cardDetil.merChantId,//商户号
          cardNumber:self.cardDetil.cardNumber,//卡号
          cardType:self.cardDetil.cardType,//卡类型
          appId:self.$store.state.appId,//商户号
        },
        "post"
      );
      if(getCard.respCode=='0000'){
        self.$toast("删除成功");
        setTimeout(()=>{
           self.$router.back();
        },300)
       
      }else{
        self.$toast(getCard.respDesc);
      }
      self.show = false;
    },
    async init() {
      var getCard = await self.$axios(
        self.$store.state.http + "CardInformation/getCardById",
        {
          cardId: self.cardId, //卡id
          token: self.$store.state.token
        },
        "post"
      );
      // 加载状态结束
      self.loading = false;
      self.finished = true;
      self.cardDetil = getCard;
      self.cardDetil.token = self.$store.state.token; //加入token
    },
    async saveCard() {
      if (self.cardDetil.merMp == "") {
        self.$toast("请输入手机号");
        return;
      }
      var alterCards = await self.$axios(
        self.$store.state.http + "CardInformation/alterCard",
        self.cardDetil,
        "post"
      );
      if (alterCards.respCode == "0000") {
        self.$toast("保存成功");
        return;
      } else {
        self.$toast(alterCards.respDesc);
      }
      console.log("alterCards", alterCards);
    }
  }
};
</script>
<style lang='less' scoped>
/* @import url(); 引入css类 */
@import "./index.less";
</style>