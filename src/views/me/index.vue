<!-- 登录首页 -->
<template>
  <div class="body-box">
    <div class="bg-fff">
      <div class="pad-40 fiex">
          <div>
              <img class="head-portrait-img" :src="$store.state.faceImgUrl?$store.state.faceImgUrl:commonConfig.errorHeaderImg" alt="" />
          </div>
          <div class="f-44 mag-l-25">
            <span v-if="$store.state.merName">{{$store.state.merName}}</span>
            <span v-else>{{$store.state.merMp|handlePhone}}</span>
          </div>
      </div>
    </div>
    <!-- 列表 -->
    <div class="fiex common-list-box mag-t-20 c51">
        <div class="oh">
          <div class="list-icon fl mag-r-20">
             <img src="../../images/shiming.png" alt="">
          </div>
          <div class="c51 f-32 fl">实名认证</div>
        </div>
        <div class="fiex1 oh" @click="relNameJum">
            <div class="fiex fr oh f-28">
               <span class="yellow mag-r-10" v-if="$store.state.merStat!='Y'" >未实名</span>
               <span class="blue mag-r-10" v-else >已实名</span>
               <van-icon name="arrow" class="c999"/>
            </div>
        </div>
    </div>
    <div @click="bindCard"  class="fiex common-list-box mag-t-20 c51 bottom">
        <div class="oh">
          <div class="list-icon fl mag-r-20">
             <img src="../../images/kabao.png" alt="">
          </div>
          <div class="c51 f-32 fl">我的卡包</div>
        </div>
        <div class="fiex1 oh">
            <div class="fiex fr oh f-28">
               <span class="yellow mag-r-10" v-if="$store.state.card=='0'">去绑卡</span>
               <van-icon name="arrow" class="c999"/>
            </div>
        </div>
    </div>
    <div @click="exitLogin()" class="fiex common-list-box c51">
        <div class="oh">
          <div class="list-icon fl mag-r-20">
             <img src="../../images/shezhi.png" alt="">
          </div>
          <div class="c51 f-32 fl">退出登录</div>
        </div>
        <div class="fiex1 oh">
            <div class="fiex fr oh f-28">
               <van-icon name="arrow" class="c999"/>
            </div>
        </div>
    </div>
    <Footer :active="2" />
  </div>
</template>

<script>
import Footer from "@/components/footer.vue";
import bus from '@/main'
var self = '';
export default {
  data() {
    return {
      active:2
    };
  },
  components:{
    Footer
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  async mounted() {
    self = this;
  },
  //方法定义
  methods: {
    exitLogin(){ //退出登录
      //清楚Vux 中的Token
       self.$store.commit("memoryLoginData",
        {
          token:"",
        });
      self.$router.push("/login");
    },
    bindCard(){
      if(self.$store.state.merStat!='Y'){ //没有实名提示去实名
          self.$dialog.alert({
            title: '提示',
            message: '请先实名',
        }).then(() => {
            self.$router.push("/realName");
        });
      }else{
        this.$router.push('/selCard');
      }
      
    },
    relNameJum(){
      if(self.$store.state.merStat!='Y'){  //未实名
           self.$router.push("/realName");
      }else{ //已经实名
        
      }
      
    }
  }
};
</script>
<style lang='less' scoped>
/* @import url(); 引入css类 */
@import "./index.less";
</style>