<!--还款计划-->
<template>
  <div>
    <van-nav-bar title="还款记录" left-arrow @click-left="$router.back()"></van-nav-bar>
    <div class="body-box oh">
      <div class="header-box-46"></div>
      <!-- 数据列表 -->
      <div v-if="listData!=''">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <ul class="plan-box pad-30">
            <li
              @click="saveData(v)"
              class="bg-fff mag-b-20"
              v-for="(v,k) in listData"
              :key="k"
            >
              <div class="pad-20 pad-t-10 pad-b-10 fiex">
                <div class="c94 f-24">计划编号：{{v.pId}}</div>
                <div class="fiex1 f-28 f-right">
                  <span v-if="v.state==2" class="pr blue implement-blue-dot">执行中</span>
                  <span v-if="v.state==4" class="pr yellow implement-blue-dot">已中断</span>
                </div>
              </div>
              <div class="hui-border-b"></div>
              <div class="pad-20">
                <div class="fiex">
                  <!-- <img class="plan-card-icon"  src="../../images/qita.png" /> -->
                  <img
                    class="plan-card-icon"
                    style="height:0.38rem"
                    :src="v.bankCode|fmtBankimsrc"
                    :onerror="commonConfig.errorHeadPortrait"
                  />
                  <div class="mag-l-20 f-32">{{v.bankCode|backName}}【{{v.cardNo|backOrder}}】</div>
                </div>
                <div class="mag-t-20 fiex f-22 f-left">
                  <div class="fiex1">
                    <div class="blue">还款金额</div>
                    <div class="blue f-32">{{v.totalAmount|moneYuan}}</div>
                  </div>
                  <div class="fiex1 c94">
                    <div class>预留金额</div>
                    <div class="f-32">{{v.basicAmount|moneYuan}}</div>
                  </div>
                  <div class="fiex1 c94">
                    <div class>已还</div>
                    <div class="f-32">{{v.alreadyAmount|moneYuan}}</div>
                  </div>
                  <div class="fiex1 c94">
                    <div class>手续费</div>
                    <div class="f-32">{{v.totalFee|moneYuan}}</div>
                  </div>
                  <div class="c94 f-32">
                    <van-icon name="arrow" />
                  </div>
                </div>
              </div>
              <!-- 分隔线 -->
              <div class="pad-20 separate-box pr">
                <div class="hui-border-b"></div>
              </div>
              <div v-if="v.createTime" class="pad-20 c1 f-24 f-left pad-t-0 fiex">
                <div>制定时间：{{v.createTime.substr(0,19)}}</div>
              </div>
            </li>
          </ul>
        </van-list>
      </div>
      <!-- 没有数据 -->
      <div v-else class="bg-fff fiex card-no-data" style="height:94vh">
        <div class="fiex1 c94 f-24">
          <div style="margin-top:-2rem">
            <img style="height:2.84rem" class="card-no-data-img" src="../../images/kzt_wjl.png" />
          </div>
          <div class="mag-t-30">还没有正在执行的计划哦</div>
          <div class="blue f-30 mag-t-50" @click="$router.push('/billExtension')">去制定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var self = "";
export default {
  data() {
    return {
      listData: [],
      loading: false,
      finished: false,
      sendData: {
        pageNum: "1",
        pageSize: "10",
        merchantId: "", //商户号
        state: "" ,//计划执行状态
        sort:"createTime",
        order:"desc"
      }
    };
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
         //数据初始化
      self.sendData.merchantId = self.$store.state.merChantId;
      var getMerChants = await self.$axios(
        "http://hlb.1818pay.cn:1003/common/plan/findPlanByTime",
        self.sendData,
        "get"
      );
      if (getMerChants.list != "") {
        self.listData = self.listData.concat(getMerChants.list); //加载当前数据
      }
      self.loading = false; //加载结束
      if (getMerChants.pageNum >= getMerChants.pages) {
        self.finished = true; //加载完成
      } else {
        self.sendData.pageNum++;
      }
    },
    saveData(v){ //存储数据
        var planDetail  = v;
        self.$store.commit("memoryLoginData",{
          planDetail:planDetail
        });
        self.$router.push('/planDetail?pId='+v.pId)
    },
    onLoad() {
        self.init();
    }
  }
};
</script>
<style lang='less' scoped>
/* @import url(); 引入css类 */
@import "./index.less";
</style>