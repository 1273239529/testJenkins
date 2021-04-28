<!--开通收款-->
<template>
  <div>
    <van-nav-bar title="开通收款" left-arrow @click-left="$router.back()"></van-nav-bar>
    <div class="body-box oh">
      <div class="header-box-46"></div>
      <div class="bg-fff pad-l-45 pad-r-45 pad-t-25 pad-b-30 f-left oh">
        <div class="f-26 c94 mag-b-25">请拍摄并上传身份证</div>
        <div class="fiex mag-b-20">
          <van-uploader :after-read="userIDCardA"  @oversize="oversizeFun" style="width:100%">
            <div v-if="sendData.userIDCardA" class="w-100">
              <img class="pa camera-icon" src="@/images/zhezhao.png" />
              <img class="sfz-img" :src="sendData.userIDCardA?sendData.userIDCardA:commonConfig.errorImg2" />
              <div class="f-26 center mag-t-10 c63">身份证人像面</div>
            </div>
            <div v-else>
              <img class="sfz-img" src="../../images/sfzrx.png" />
              <div class="f-26 center mag-t-10 c63">身份证人像面</div>
            </div>
          </van-uploader>

          <div style="width:0.6rem"></div>

          <van-uploader :after-read="faceImg"  @oversize="oversizeFun" style="width:100%">
            <div v-if="sendData.faceImg" class="pr fiex1">
              <img class="pa camera-icon" src="@/images/zhezhao.png" />
              <img class="sfz-img" :src="sendData.faceImg?sendData.faceImg:commonConfig.errorImg2" />
              <div class="f-26 center mag-t-10 c63">本人手持身份证</div>
            </div>
            <div v-else>
              <img class="sfz-img" src="../../images/scsfz1.png" />
              <div class="f-26 center mag-t-10 c63">本人手持身份证</div>
            </div>
          </van-uploader>
        </div>
        <div class="fiex mag-b-10">
          <van-uploader :after-read="userIDCardB"  @oversize="oversizeFun" style="width:100%">
            <div v-if="sendData.userIDCardB" class="w-100">
              <img class="pa camera-icon" src="@/images/zhezhao.png" />
              <img class="sfz-img" :src="sendData.userIDCardB?sendData.userIDCardB:commonConfig.errorImg2" />
              <div class="f-26 center mag-t-10 c63">身份证国徽面</div>
            </div>
            <div v-else>
              <img class="sfz-img" src="../../images/sfzrx1.png" />
              <div class="f-26 center mag-t-10 c63">身份证国徽面</div>
            </div>
          </van-uploader>
          <div style="width:0.6rem"></div>
           <van-uploader :after-read="cardImgA" @oversize="oversizeFun" style="width:100%">
            <div v-if="sendData.cardImgA" class="w-100">
              <img class="pa camera-icon" src="@/images/zhezhao.png" />
              <img class="sfz-img" :src="sendData.cardImgA?sendData.cardImgA:commonConfig.errorImg2" />
              <div class="f-26 center mag-t-10 c63">银行卡正面</div>
            </div>
            <div v-else>
              <img class="sfz-img" src="../../images/scsfz.png" />
              <div class="f-26 center mag-t-10 c63">银行卡正面</div>
            </div>
          </van-uploader>
        </div>
      </div>
      <div class="mag-t-20 bg-fff c94 f-left pad-20 pad-l-45 pad-r-45 f-26">
        <div class="c63 f-28">温馨提示</div>
        <div>1、提交资料后，系统会在24小时内返回认证结果，感谢您的使用</div>
      </div>
      <div class="pad-20">
        <div v-if="sendData.state==2" data-v-1b7f4b26 class="blue-btn fff center mag-t-100 opacity-5">审核中</div>
        <div v-else @click="sendDataFun()" data-v-1b7f4b26 class="blue-btn fff center mag-t-100">提交</div>
      </div>
    </div>
  </div>
</template>

<script>
var self = "";
export default {
  data() {
    return {
      sendData: {
        userIDCardA: "", //身份证正面
        userIDCardB: "", //身份证反面
        faceImg:"", //手持身份证面
        cardImgA:""//银行卡正面
        ,merChantId:"" //商户号
        ,merName:"" //姓名
        ,certNo:"" //身份证号
        ,institutionId:"" //机构号
        ,appId:""
        ,agentId:"" //代理商号
        ,mobile:"" //手机号
        ,type :"ARTIFICIAL" //提交的时候不走活体
      }
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  async mounted() {
    self = this;
    console.log("self.sendData",self.sendData);
    //加载回填上传的图片
    var Information = await self.$axios(
      self.commonConfig.qualifications + "/Information/select",
      {
        merChantId: self.$store.state.merChantId
      },
      "post"
    );
    if (Information.respCode == "0000") {
      self.sendData = $.extend(true, self.sendData, Information.data);
       //填写用户基本信息
      self.sendData.merChantId = self.$store.state.merChantId;
      self.sendData.merName = self.$store.state.merName;
      self.sendData.certNo = self.$store.state.certNo;
      self.sendData.institutionId = self.$store.state.institutionId;
      self.sendData.appId = self.$store.state.appId;
      self.sendData.agentId = self.$store.state.agentId;
      self.sendData.mobile= self.$store.state.merMp;
      console.log("回填的数据", self.sendData);
    } else {
      self.$toast(Information.respCode);
    }
  },
  //方法定义
  methods: {
    oversizeFun(){ //文件大小限制
     self.$toast("图片大小不可以超过1M")
    },
    async sendDataFun(){
      if(self.sendData.userIDCardA==''){
        self.$toast("请上传身份证人像面");
        return
      }
       if(self.sendData.userIDCardB==''){
        self.$toast("请上传本人手持身份证");
        return
      }
       if(self.sendData.faceImg==''){
        self.$toast("请上传身份证国徽面");
        return
      }
       if(self.sendData.cardImgA==''){
        self.$toast("请上传银行卡正面");
        return
      }
       var baiduyun = await self.$axios(
        "http://47.104.4.155:1172/Information/baiduyun",
         self.sendData,
        "post"
      );
      if(baiduyun.respCode=='0000'){
        self.$toast("提交成功,请等待系统后台审核");
        setTimeout(()=>{
          self.$router.back();
        },1200)
      }else{
         self.$toast(baiduyun.respDesc);
      }

    },
    async userIDCardA(file) { //身份证人像面
      //FRONT_ID_CARD_PHOTO上传身份证正面资质BACK_ID_CARD_PHOTO上传身份证反面资质BANK_CARD_IMG上传银行卡资质HAND_ID_CARD_PHOTO上传手持身份证资质
      var param = new FormData();
      param.append("name", "FRONT_ID_CARD_PHOTO");
      param.append("merChantId", self.$store.state.merChantId);
      param.append("file", file.file);
      var Information = await self.$upInformationFile(
        self.commonConfig.qualifications + "/Information/addFaceImgUrl",
        param,
        "post"
      );
      if(Information.respCode=='0000'){
           self.sendData.userIDCardA = Information.data;
           self.$toast("上传成功")
      }else{
          self.$toast(Information.respDesc);
      }
      console.log("文件", file);
      console.log("param", param.get("file"));
    },
    async faceImg(file) { //身份证人像面
      var param = new FormData();
      param.append("name", "HAND_ID_CARD_PHOTO");
      param.append("merChantId", self.$store.state.merChantId);
      param.append("file", file.file);
      var Information = await self.$upInformationFile(
        self.commonConfig.qualifications + "/Information/addFaceImgUrl",
        param,
        "post"
      );
      if(Information.respCode=='0000'){
           self.sendData.faceImg = Information.data;
           self.$toast("上传成功")
      }else{
          self.$toast(Information.respDesc);
      }
      console.log("文件", file);
      console.log("param", param.get("file"));
    },
     async userIDCardB(file) { //身份证人像面
      var param = new FormData();
      console.log("file",file)
      param.append("name", "BACK_ID_CARD_PHOTO");
      param.append("merChantId", self.$store.state.merChantId);
      param.append("file", file.file);
      var Information = await self.$upInformationFile(
        self.commonConfig.qualifications + "/Information/addFaceImgUrl",
        param,
        "post"
      );
      if(Information.respCode=='0000'){
           self.sendData.userIDCardB = Information.data;
           self.$toast("上传成功")
      }else{
          self.$toast(Information.respDesc);
      }
      console.log("文件", file);
      console.log("param", param.get("file"));
    },
    async cardImgA(file) { //银行卡正面
      var param = new FormData();
      param.append("name", "BANK_CARD_IMG");
      param.append("merChantId", self.$store.state.merChantId);
      param.append("file", file.file);
      var Information = await self.$upInformationFile(
        self.commonConfig.qualifications + "/Information/addFaceImgUrl",
        param,
        "post"
      );
      if(Information.respCode=='0000'){
           self.sendData.cardImgA = Information.data;
           self.$toast("上传成功")
      }else{
          self.$toast(Information.respDesc);
      }
      console.log("文件", file);
      console.log("param", param.get("file"));
    },
  }
};
</script>
<style lang='less' scoped>
/* @import url(); 引入css类 */
@import "./index.less";
</style>