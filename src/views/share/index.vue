<!-- 登录首页 -->
<template>
  <div class="body-box" id="donwloadImg">
    <van-nav-bar title="分享" />
    <div class="header-box-46"></div>
    <div class="share-bg pr" :style="{'backgroundImage':'url('+bg_img+')' }">
      <div class="pa share-code center">
        <div class="bg-fff pad-10 dis-inline-block">
          <div id="qrcode"></div>
        </div>
        <!-- <div class="fff f-24 mag-t-20">长按识别二维码或扫一扫</div> -->
      </div>
    </div>
    <div class="bg-fff share-bottom pad-25 f-32">
      <div @click="downLladImg">点击保存图片</div>
    </div>
    <div style="opacity:0">123</div>
     <Footer :active="1" />
  </div>
</template>

<script>
var self = "";
import QRCode from "qrcodejs2";
import Footer from "@/components/footer.vue";
import html2canvas from "html2canvas";
import share_bg from "../../images/share-bg.png";
export default {
  data() {
    return {
      active: 1,
      screenUrl: "",
      bg_img: "" //图片背景图
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
    self.init();
  },
  //方法定义
  methods: {
    async init() {
      //获取背景图片
      var selectBannerList = await self.$axios(
        self.$store.state.http + "Banner/selectBannerList",
        {
          appId: self.$store.state.appId,
          status: "4"
        },
        "post"
      );
      if (selectBannerList.respCode == "0000") {
        self.bg_img = selectBannerList.data[0].imgURL;
        if (self.bg_img == "") {
          //没有背景图替换为默认图片
          self.bg_img = share_bg;
        }
        console.log("self.bg_img", self.bg_img);
      } else {
        self.$toast(selectBannerList.respDesc);
      }
      self.qrcode(); //二维码生成

      console.log("selectBannerList", selectBannerList);
    },
    qrcode() {
      //二维码生成的二维码
      var codeSrc = ""; //二维码生成连接
      if (self.$store.state.institutionId == "T00000006") {
        codeSrc =
          self.$store.state.http +
          "MDregister.html" +
          "?merMp=" +
          self.$store.state.merMp +
          "&appId=" +
          self.$store.state.appId +
          "&institutionId=" +
          self.$store.state.institutionId;
      } else {
        codeSrc =
          self.$store.state.http +
          "register.html" +
          "?merMp=" +
          self.$store.state.merMp +
          "&appId=" +
          self.$store.state.appId +
          "&institutionId=" +
          self.$store.state.institutionId;
      }
      console.log("codeSrc", codeSrc);
      let qrcode = new QRCode("qrcode", {
        width: 100,
        height: 100,
        render: 'table',
        text: codeSrc // 二维码内容
      });
    },
    downLladImg() {
      //图片下载
      // donwloadImg
      // qrcode
      // html2canvas($("#qrcode")[0]).then(canvas => {
      //   const a = document.createElement("a"); // 创建a标签
      //   a.setAttribute("download", ""); // download属性
      //   a.setAttribute("href", canvas.toDataURL()); // href链接
      //   a.click(); // 自执行点击事件
      // });
       html2canvas($("#donwloadImg")[0]).then(canvas => {
        const a = document.createElement("a"); // 创建a标签
        a.setAttribute("download", ""); // download属性
        a.setAttribute("href", canvas.toDataURL()); // href链接
        a.click(); // 自执行点击事件
      });
    }
  }
};
</script>
<style lang='less' scoped>
/* @import url(); 引入css类 */
@import "./index.less";
</style>