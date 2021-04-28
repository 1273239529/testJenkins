<!--实名认证 -->
<template>
  <div>
    <van-nav-bar title="实名认证" left-arrow @click-left="$router.back()" />
    <div class="body-box oh">
      <div class="header-box-46"></div>
      <div class="mag-t-20">
        <van-field
          type
          label="姓名"
          v-model="sendData.merName"
          placeholder="请输入姓名"
          class="field__label_200 f-left"
          required
        />
        <van-field
          type
          label="身份证"
          v-model="sendData.certNo"
          placeholder="请输入身份证号"
          class="field__label_200 f-left"
          required
        />
        <van-field
          type
          label="储蓄卡号"
          placeholder="请输入储蓄卡号"
          class="field__label_200 f-left"
          @input="cardBinFun()"
          v-model="sendData.cardNumber"
          required
        />
        <van-field
          type
          disabled
          label="发卡行"
          placeholder="发卡行"
          v-model="sendData.issuingname"
          class="field__label_200 f-left"
          required
        />
        <van-field
          type
          label="推荐人手机号"
          placeholder="推荐人手机号"
          class="field__label_200 f-left mag-t-20"
          :disabled="sendData.bindType==2"
          v-model="sendData.phone"
          required
        />
      </div>
      <div class="pad-20">
        <div @click="subDataFun()" class="blue-btn fff center mag-t-100">确认</div>
      </div>
    </div>
  </div>
</template>

<script>
var self = "";
export default {
  data() {
    return {
      cardtype:"",//01:储蓄卡
      sendData: {
        //提交的数据
        token: "",
        merName: "", //用户姓名
        certNo: "", //身份证
        cardNumber: "", //储蓄卡号
        issuingBank: "", //backCode
        issuingname: "", //发卡行名称
        bindType: "1", //(1:未绑定2:绑定)
        phone: "", //关系人手机号
        merMp: "", //用户手机号
        merMp: "", //用户手机号
        merChantId: "", //商户号
        institutionId: "" //机构号
      }
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  async mounted() {
    self = this;
    self.sendData.merMp = self.$store.state.merMp; //获取当前用户手机号
    self.sendData.appId = self.$store.state.appId; //APPID
    self.sendData.token = self.$store.state.token; //获取当前用户手机号
    self.sendData.merChantId = self.$store.state.merChantId; //获取当前商户号
    self.sendData.institutionId = self.$store.state.institutionId; //获取当前机构号
    //检查是否绑定关系
    if(self.$store.state.status=='Y'){//已经绑定
       //已绑定回填手机号
        self.sendData.bindType = '2';
        self.sendData.phone = self.$store.state.phone; //绑定人的手机号
    }else{ //未绑定
        self.sendData.bindType = '1';
    }
  },
  //方法定义
  methods: {
    onClickLeft() {},
    async subDataFun() {
      //提交数据
      if (self.sendData.merName == "") {
        self.$toast("请输入姓名");
        return;
      }
      if (self.sendData.certNo == "") {
        self.$toast("请输入身份证号");
        return;
      }
      if (self.sendData.cardNumber == "") {
        self.$toast("请输入储蓄卡号");
        return;
      }
      if(self.cardtype!='01'){
        self.$toast("请输入储蓄卡");
        return;
      }
      if (self.sendData.issuingBank == "") {
        self.$toast("当前银行暂不支持");
        return;
      }
      if (self.sendData.phone == "") {
        self.$toast("请输入推荐人手机号");
        return;
      }
      console.log("self.sendData", self.sendData);

      var attestations = await self.$axios(
        self.$store.state.http + "CommonRealName/attestations",
        self.sendData,
        "post"
      );
      if (attestations.respCode == "0000") {
        self.$toast("实名认证成功");
        self.$store.commit("memoryLoginData", {
          merStat: "Y"
        }); //设置实名状态设置为成功
      //查商户 更新用户实名信息
      var getMerChants = await self.$axios(
        self.$store.state.http + "MerChants/getMerChant",
        {
          merChantId: self.$store.state.merChantId, //商户号
          token: self.$store.state.token
        },
        "post"
      );
      if (getMerChants.respCode == "0000") {
        //存储用户登录的数据
        self.$store.commit("memoryLoginData", getMerChants.data); //完善用户登录信息
      }
        setTimeout(() => {
          self.$router.back();
        }, 800);
      } else {
        self.$toast(attestations.respDesc);
        return;
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
                self.cardtype = queryList.data.list[0].cardtype; //提交的时候校验 必须是储蓄卡
              if (queryList.data.list[0].cardtype == "01") {
                //判断是否为储蓄卡
                self.sendData.issuingBank = queryList.data.list[0].bankcode;
                self.sendData.issuingname = queryList.data.list[0].issuingname;
              } else {
                self.sendData.issuingBank ="";
                self.sendData.issuingname ="";
                self.$toast("请请输入储蓄卡卡号");
              }
            } else {
              self.sendData.issuingBank = "";
              self.sendData.issuingname = "";
              self.$toast("该银行暂不支持请联系客服");
            }
          } else {
            //卡bin库无数据
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