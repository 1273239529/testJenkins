<!--添加信用卡 -->
<template>
  <div>
    <van-nav-bar
      title="添加储蓄卡"
      left-arrow
      @click-left="$router.back('')"
      @click-right="$router.push('/addCardPage')"
    ></van-nav-bar>
    <div class="body-box oh">
      <div class="header-box-46"></div>
      <div class="mag-t-20">
        <van-field
          type
          disabled
          label="姓名"
          v-model="sendData.merName"
          placeholder="请输入姓名"
          class="field__label_200 f-left"
        />
        <van-field
          v-model="sendData.cardNumber"
          @input="cardBinFun()"
          type
          label="卡号"
          placeholder="请输入卡号"
          class="field__label_200 f-left mag-t-20"
        />
        <van-field
          type
          label="发卡银行"
          v-model="sendData.issuingname"
          disabled
          placeholder="发卡银行"
          class="field__label_200 f-left"
        />
        <van-field
          type
          label="手机号"
          v-model="sendData.merMp"
          placeholder="请输入手机号"
          class="field__label_200 f-left mag-t-20"
        />
      </div>
      <div class="pad-20">
        <div @click="saveCard()" class="blue-btn fff center mag-t-100">提交</div>
      </div>
    </div>
  </div>
</template>

<script>
var self = "";
export default {
  data() {
    return {
       cardtype:"", //卡类型 01 为储蓄卡 02 为信用卡
      sendData: {
        cardNumber: "", //储蓄卡号
        issuingBank: "", //开卡银行coed
        issuingname: "", //开卡银行名称
        merName: "", //用户姓名
        token: "",
        merChantId: "", //商户号
        merMp: "", //手机号
        agentId: "", //代理商号
        institutionId: "", //机构号
        cardType:"SC",//储蓄卡
        appId: ""
      }
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    self = this;
    self.sendData.merName = self.$store.state.merName;
    self.sendData.token = self.$store.state.token;
    self.sendData.merChantId = self.$store.state.merChantId;
    self.sendData.agentId = self.$store.state.agentId;
    self.sendData.institutionId = self.$store.state.institutionId;
    self.sendData.appId = self.$store.state.appId;
  },
  //方法定义
  methods: {
    async saveCard() {
      //保存卡
      if (self.sendData.cardNumber == "") {
        self.$toast("请输入储蓄卡卡号");
        return;
      }
      if (self.sendData.merMp == "") {
        self.$toast("请输入手机号");
        return;
      }
       if(self.cardtype!='01'){
        self.$toast("请输入储蓄卡卡号");
        return;
      }
      var queryList = await self.$axios(
        self.$store.state.http + "CommonRealName/addCard",
        self.sendData,
        "post"
      );
      if (queryList.respCode == "0000") {
        self.$toast("添加成功");
        var card = self.$store.state.card;//储蓄卡的张数
        self.$store.commit("memoryLoginData",{card:card++});
        setTimeout(() => {
          self.$router.back();
        }, 300);
      } else {
         self.$toast(queryList.respDesc);
      }
    },
    async cardBinFun() {
      //查询出,发卡行
      console.log(
        "self.sendData.cardNumber.length",
        self.sendData.cardNumber.length
      );
      if (self.sendData.cardNumber.length == 6) {
        //满足6位的时候会查询
        //01 储蓄卡 02 信用卡
        var queryList = await self.$axios(
          "http://47.105.48.45:1079/bind/data/queryList",
          {
            bankidentworth: self.sendData.cardNumber
          },
          "get"
        );
        if (queryList.respCode == "0000") {
          if (queryList.data.list.length != 0) {
            //卡bin库有数据
            if (queryList.data.list[0].bankcode) {
               self.cardtype = queryList.data.list[0].cardtype; //存储卡类型 添加储蓄卡 只容许添加信用卡 01:储蓄卡 02:信用卡
              if (queryList.data.list[0].cardtype == "01") {
                //判断是否为储蓄卡
                self.sendData.issuingBank = queryList.data.list[0].bankcode;
                self.sendData.issuingname = queryList.data.list[0].issuingname;
              } else {
                self.sendData.issuingBank ="";
                self.sendData.issuingname ="";
                self.$toast("请输入储蓄卡卡号");
              }
            } else {
              self.sendData.issuingBank = "";
              self.sendData.issuingname = "";
              self.$toast("该银行暂不支持请联系客服");
            }
          } else {
            //卡bin库没有数据
            self.sendData.issuingBank = "";
            self.sendData.issuingname = "";
            self.$toast("该银行暂不支持请联系客服");
          }
        } else {
          self.$toast(queryList.respDesc);
          return;
        }
        if (!queryList.bankcode) {
        }
        console.log("queryList", queryList);
      }
    }
  }
};
</script>
<style lang='less' scoped>
/* @import url(); 引入css类 */
@import "./index.less";
</style>