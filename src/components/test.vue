<!-- 首页公共底部 -->
<template>
  <div>
    测试组件
  </div>
</template>

<script>
import footer1 from "@/images/footer1-1.png";
import footer12 from "@/images/footer1-2.png";
import footer21 from "@/images/footer2-1.png";
import footer22 from "@/images/footer2-2.png";
import footer31 from "@/images/footer3-1.png";
import footer32 from "@/images/footer3-2.png";
import bus from '@/main'
var self = "";
export default {
  data() {
    return {
      active2:0,
      icon: {
        active: footer1,
        inactive: footer12
      },
      icon2: {
        active: footer21,
        inactive: footer22
      },
      icon3: {
        active: footer31,
        inactive: footer32
      }
    };
  },
  props:['active'],
  //生命周期 - 创建完成（访问当前this实例）
  created() {
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    self = this;
    self.active2 = self.active;
    console.log("父组件的数据",this.$attrs)
  },
  //方法定义
  methods: {
    selFooter(val) {
      if(val==0){
        this.$router.push("/homePage/home");
        return
      }
       if(val==1){
        this.$router.push("/homePage/share");
        return
      }
       if(val==2){
        this.$router.push("/homePage/me");
        return
      }
     
    }
  }
};
</script>
<style lang='less' scoped>
/* @import url(); 引入css类 */
// @import './index.less';
</style>