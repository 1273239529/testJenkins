<!-- 登录首页 -->
<template>
  <div class="body-box">
    <keep-alive>
     
    </keep-alive>
     <router-view />
     <!-- <Footer /> -->
  </div>
</template>

<script>
var self = "";
import Footer from "@/components/footer.vue";
export default {
  data() {
    return {
      active: 0,
      isLoading: false, //下拉刷新
      userData: {
        //用户数据
        card: 0,
        credit: 0
      }
    };
  },
  components: {
    Footer
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    
  },
  //方法定义
  methods: {}
};
</script>
<style lang='less' scoped>
/* @import url(); 引入css类 */
@import "./index.less";
</style>