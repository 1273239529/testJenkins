<!--添加信用卡 -->
<template>
  <div>
    <van-nav-bar
      title="添加信用卡"
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>
    <div class="body-box oh">
      <div class="header-box-46"></div>
      <div class="mag-t-20">
        <van-field
          type
          label="姓名"
          v-model="sendData.merName"
          disabled
          placeholder="请输入姓名"
          class="field__label_200 f-left"
        />
        <van-field
          type
          label="卡号"
          v-model="sendData.cardNumber"
          @input="cardBinFun()"
          placeholder="请输入卡号"
          class="field__label_200 f-left mag-t-20"
        />
        <van-field
          type
          label="银行"
          v-model="sendData.issuingname"
          disabled
          placeholder="银行"
          class="field__label_200 f-left"
        />
        <van-cell @click="selDataOpen(1)" class="f-left" value="请选择" title="账单日" is-link>
          <span v-if="sendData.statementDate" class="c000">{{sendData.statementDate}}</span>
          <span v-else style="color:#949494;">请选择</span>
        </van-cell>
        <van-cell @click="selDataOpen(2)" class="f-left" value="请选择" title="还款日" is-link>
          <span v-if="sendData.repaymentDate" class="c000">{{sendData.repaymentDate}}</span>
          <span v-else style="color:#949494;">请选择</span>
        </van-cell>
        <van-field type label="手机号" v-model="sendData.merMp" placeholder="请输入手机号" class="field__label_200 f-left mag-t-20" />
      </div>
      <div class="pad-20">
        <div @click="saveCard()" class="blue-btn fff center mag-t-100">确认</div>
      </div>
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
  </div>
</template>

<script>
var self = "";
export default {
  data() {
    return {
      selType: "1", //1:账单日 2:还款日
      showTip: false, //显示弹窗
      cardtype:"", //卡类型 01 为储蓄卡 02 为信用卡
      selDataJson: {
        province_list: {}
      }, //选择的日期集合
      sendData: {
        cardNumber: "", //信用卡号
        issuingBank: "", //开卡银行coed
        issuingname: "", //开卡银行名称
        merName: "", //用户姓名
        token: "",
        merChantId: "", //商户号
        merMp: "", //手机号
        agentId: "", //代理商号
        institutionId: "", //机构号
        appId: "",
        cardType: "CC", //信用卡
        statementDate: "", //账单日
        repaymentDate: "" //账单日
      }
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    self = this;
    //日期列表
    for (var i = 1; i < 32; i++) {
      self.selDataJson.province_list[i] = i;
    }
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
        self.$toast("请输入信用卡卡号");
        return;
      }
      if(self.sendData.statementDate == "") {
        self.$toast("请选择账单日");
        return;
      }
      if(self.sendData.repaymentDate == "") {
        self.$toast("请选择还款日");
        return;
      }
       if(self.sendData.statementDate == self.sendData.repaymentDate) {
        self.$toast("账单日与还款日不可以为同一天");
        return;
      }
      if (self.sendData.merMp == "") {
        self.$toast("请输入手机号");
        return;
      }
      if(self.cardtype!='02'){
        self.$toast("请输入信用卡卡号");
        return;
      }
      console.log("提交的数据",self.sendData)
      var queryList = await self.$axios(
        self.$store.state.http + "CommonRealName/addCard",
        self.sendData,
        "post"
      );
      if (queryList.respCode == "0000") {
        var credit = self.$store.state.credit;//信用卡的张数
        self.$store.commit("memoryLoginData",{credit:credit++});
        self.$toast("添加成功");
        setTimeout(() => {
          self.$router.back();
        }, 300);
      } else {
        self.$toast(queryList.respDesc);
      }
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
        self.sendData.statementDate = self.PrefixInteger(val[0].code, 2);
      } else {
        self.sendData.repaymentDate = self.PrefixInteger(val[0].code, 2);
      }

      self.showTip = false; //关闭选择弹窗
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
              self.cardtype = queryList.data.list[0].cardtype; //存储卡类型 添加信用卡 只容许添加信用卡 01:储蓄卡 02:信用卡
              if (queryList.data.list[0].cardtype == "02") {
                //判断是否为储蓄卡
                self.sendData.issuingBank = queryList.data.list[0].bankcode;
                self.sendData.issuingname = queryList.data.list[0].issuingname;
              } else {
                self.sendData.issuingBank ="";
                self.sendData.issuingname ="";
                self.$toast("请输入信用卡卡号");
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