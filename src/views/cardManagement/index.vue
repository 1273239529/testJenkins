<!--信用卡管理-->
<template>
  <div>
    <van-nav-bar
      title="卡管理"
      left-arrow
      @click-left="$router.back()"
      @click-right="delCard()"
    >
      <van-icon name="ellipsis" class="f-32" slot="right" />
    </van-nav-bar>
    <div class="body-box oh">
      <div class="header-box-46"></div>
      <ul class="card-list pad-20 bg-fff">
        <li class="fff mag-b-20">
          <div class="fiex">
            <div class="back-logo-box">
              <img
                class="back-logo"
                :src="cardDetil.issuingBank|fmtBankimsrc"
                :onerror="commonConfig.errorImg"
              />
            </div>
            <div
              class="f-34 mag-l-20"
            >{{cardDetil.issuingBank|backName}}【{{cardDetil.cardNumber|backOrder}}】</div>
          </div>
          <div class="mag-t-30 f-25">
            <div class="fiex f-left">
              <div class="fiex1">账单日:{{cardDetil.statementDate}}</div>
              <div class="fiex1">还款日:{{cardDetil.repaymentDate}}</div>
              <div style="margin-top:-0.15rem;">
                距离还款日:
                <span class="f-50">{{cardDetil.countDown}}</span> 天
              </div>
            </div>
          </div>
        </li>
      </ul>
      <!-- 账单日 -->
      <div class="f-left">
        <van-cell @click="selDataOpen(1)" title="账单日" is-link v-model="cardDetil.statementDate" />
        <van-cell @click="selDataOpen(2)" title="还款日" is-link v-model="cardDetil.repaymentDate" />
        <van-field
          type
          label="预留手机号"
          v-model="cardDetil.merMp"
          placeholder="请输入手机号"
          class="field__label_200 f-left mag-t-20"
        />
      </div>
      <div class="pad-20">
        <div @click="saveCard()" class="blue-btn fff center mag-t-100">保存</div>
      </div>
      <!-- 账单日end -->
    </div>
    <!--账单日 -->
    <van-popup v-model="showTip" position="bottom" :overlay="true">
      <van-area
        :area-list="selDataJson"
        @cancel="showTip=false"
        columns-num="1"
        title
        @confirm="selData"
      />
    </van-popup>
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
      show:false,
      selType: "1", //1:账单日 2:还款日
      showTip: false, //显示弹窗
      selDataJson: {
        province_list: {}
      }, //选择的日期集合
      cardDetil: {}, //卡详情
      cardId: "", //获取卡id
      show: false
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    self = this;
    self.cardId = self.$route.query.cardId;
    //日期列表
    for (var i = 1; i < 32; i++) {
      self.selDataJson.province_list[i] = i;
    }
    self.init();
  },
  //方法定义
  methods: {
    delCard() {
      //打开删除卡弹窗
      self.show = true;
    },
    cancle() {
      //取消
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
    async saveCard() {
      //保存信用卡修改
      if (self.cardDetil.merMp == "") {
          self.$toast("请输入手机号");
          return;
      }
      if(self.cardDetil.statementDate==self.cardDetil.repaymentDate){ //账单日与还款日不可以为同一天
          self.$toast("账单日与还款日不可以为同一天")
          return
      }
      var alterCards = await self.$axios(
        self.$store.state.http + "CardInformation/alterCards",
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
    },
    selDataOpen(val) {
      //1:账单日 2:还款日
      self.selType = val;
      self.showTip = true;
    },
    selData(val) {
      //选择的日期
      //1:账单日 2:还款日
      if (self.selType == 1) {
        self.cardDetil.statementDate = self.PrefixInteger(val[0].code, 2);
      } else {
        self.cardDetil.repaymentDate = self.PrefixInteger(val[0].code, 2);
      }
      //计算还款天数
      self.cardDetil.countDown =  self.$fmthkdate(self.cardDetil.statementDate,self.cardDetil.repaymentDate);
      self.$forceUpdate();
      self.showTip = false;
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
      //计算还款日期
      self.cardDetil.countDown = self.$fmthkdate(
        self.cardDetil.statementDate,
        self.cardDetil.repaymentDate
      ); //计算还款日期
      console.log("self.$store.state.token", self.$store.state.token);
      self.cardDetil.token = self.$store.state.token; //加入token
    }
  }
};
</script>
<style lang='less' scoped>
/* @import url(); 引入css类 */
@import "./index.less";
</style>