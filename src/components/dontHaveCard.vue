<!-- 没有卡的时候 -->
<template>
 <div class="">
     <div class="fiex1">
         <img class="nodata-img" src="../images/kzt_wk.png" />
     </div>
 </div>
</template>

<script>
var self='';
export default {
data() {
return {

}
},
//生命周期 - 创建完成（访问当前this实例）
created() {

},
//生命周期 - 挂载完成（访问DOM元素）
mounted() {
self=this;
}
//方法定义
,methods:{
}
}
</script>
<style lang='less' scoped>
/* @import url(); 引入css类 */
.on-data{height: 100vh;}
.nodata-img{width:1.66rem; height: 1.56rem; }
</style>