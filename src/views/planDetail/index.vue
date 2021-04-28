
<template>
  <div class="PlanDetails" style="background: rgb(242, 242, 242);">
    <van-nav-bar title="计划详情" left-arrow @click-left="$router.back()"></van-nav-bar>
    <div class="header-box-46" style="background: rgb(242, 242, 242);"></div>
    <!-- <header><img @click="goBack" src="http://hstatic.1818pay.cn/image/icon/left.png" /><span>方案详情</span></header> -->
    <div class="details" style="height:100%;background:#f2f2f2;">
      <div class="plandiv">
        <div style="display: flex;justify-content: space-between; width: 100%;background:#4F8BF4;">
          <div style=" color: #fff;width:90%;margin:5px auto;">
            <div style="display: inline-block;">
              <img
                style="width: 20px; height:20px"
                class="BankLogo"
                :src="previousData.bankCode|fmtBankimsrc"
                :onerror="commonConfig.errorImg"
              />
              <div class="BankTitle">
                <p
                  style="font-size: 14px;"
                >{{previousData.bankCode|backName}}【{{previousData.cardNo|backOrder}}】</p>
                <!-- <p style='font-size: 14px;'>{{planDetail.bankCode| fmtBankCode}}({{planDetail.cardNo | fmtCardNo }})</p> -->
              </div>
            </div>
            <div style="display: inline-block;text-align: right;" class="fr">
              <!-- <img style="    width: 20px;" class="BankLogo" :src='scdata.bankCode | fmtBankimsrc' /> -->
              <div class="BankTitle">
                <p v-if="planDetail.list!=''">
                  <span
                    class="mag-r-10"
                    style="margin-top: 0.1rem;display: inline-block;vertical-align: middle;"
                  >
                    <van-icon name="location-o" />
                  </span>
                  <span style="vertical-align: middle;">{{planDetail.list[0].city}}</span>
                </p>
                <!-- <p style='font-size: 14px;'>{{scdata.bankCode | fmtBankCode}}({{scdata.cardNo | fmtCardNo }})</p> -->
              </div>
            </div>
          </div>
        </div>
        <div style="clear: both;"></div>

        <div class="center mag-t-30">
          <div class="fiex pad-b-10">
            <div class="fiex1">
              <p class="TotalTex1 f-22 c999">总还款金额(元)</p>
              <p class="TotalTex2 f-30">{{previousData.totalAmount|moneYuan}}</p>
            </div>
            <div class="border-h"></div>
            <div class="fiex1">
              <p class="TotalTex1 f-22 c999">预留金额(元)</p>
              <p class="TotalTex2 f-30">{{previousData.basicAmount|moneYuan}}</p>
            </div>
            <div class="border-h"></div>
            <div class="fiex1">
              <p class="TotalTex1 f-22 c999">手续费(元)</p>
              <p class="TotalTex2 f-30">{{previousData.totalFee|moneYuan}}</p>
            </div>
          </div>
        </div>
        <div class="time-line">
          <div class="vont-bottom"></div>
        </div>
        <div class="pad-10 oh" style="padding-top: 0;">
          <span class="c999 f-26 mag-l-10 fl">计划编号:{{previousData.pId}}</span>
          <!-- <div v-if="planDetail.state==0" class="c-hui fr pr red dot-bth dot-red mag-r-10">失败</div>
                    <div class="c-hui fr pr blue dot-bth dot-blue mag-r-10">执行中</div>
                    <div v-if="planDetail.state==2" class="c-hui fr pr green dot-bth dot-green mag-r-10">成功</div>
          <div v-if="planDetail.state==3" class="c-hui fr pr red dot-bth dot-red mag-r-10">中断</div>-->
        </div>
        <div v-if="planDetail" class="BankSurplus"></div>
      </div>
      <div
        class="oh pad-20 pad-l-40 pad-r-40 bg-fff pr"
        style="line-height: 1.5em;margin-top: 0.2rem;box-shadow: 0px 4px 3px 3px rgba(245, 241, 241, 0.8)"
      >
        <div class="fl f-28">单笔详情</div>
        <!-- <div class="fr f-24 c999">
          到账时间
          <span>2019-11-14</span> 至
          <span>2019-11-14</span>
        </div> -->
      </div>
      <div style="margin: 0 auto;width:100%;background: #fff; overflow: scroll; height: 74vh;">
        <div class="line-hui"></div>
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div class="kk">
            <ul class="bill">
              <li
                class="pad-t-20 pad-b-20"
                v-for="(planValue,planKey) in planDetail.list"
                :key="planKey"
              >
                <!-- 消费-->
                <div v-if="planValue.payType==2" style="display: flex;align-items: flex-start;">
                  <p style="display: inline-block;" class="mag-r-10">
                    <img
                      style="width: 0.6rem;"
                      src="http://hstatic.1818pay.cn/image/icon/dae/xiaofei@3x.png"
                      alt
                    />
                  </p>
                  <div style="margin-left: 6px;  font-size: .25rem;">
                    <div class="tex1">
                      消费{{planValue.amount|moneYuan}}元
                      <div style="clear: both;"></div>
                    </div>
                    <p class="c999">(手续费{{planValue.fee|moneYuan}}元)</p>
                    <p v-if="planValue.isAnew==1" class="b-d-yellow mag-t-10">已补单</p>
                  </div>
                  <div class="fiex1 f-right">
                    <div v-if="planValue.state==0" class="c-hui pr red dot-bth dot-red mag-r-10">失败</div>
                    <div
                      v-if="planValue.state==1"
                      class="c-hui pr blue dot-bth dot-blue mag-r-10"
                    >待执行</div>
                    <div
                      v-if="planValue.state==2"
                      class="c-hui pr blue dot-bth dot-blue mag-r-10"
                    >执行中</div>
                    <div
                      v-if="planValue.state==3"
                      class="c-hui pr green dot-bth dot-green mag-r-10"
                    >完成</div>
                    <div v-if="planValue.state==4" class="c-hui pr org dot-bth dot-org mag-r-10">已中断</div>
                    <div
                      class="f-24 c999"
                    >{{new Date(planValue.executeTime).format('yyyy-MM-dd hh:mm:ss')}}</div>
                    <!-- <div v-if="planValue.isAnew==1" class="f-26 c999 mag-t-7">
                      <span>补单详情</span>
                      <van-icon name="arrow" style="margin-top: 3px;vertical-align: top;" />
                    </div> -->
                  </div>
                </div>
                <!-- 还款 -->
                <div v-if="planValue.payType==1" style=" display: flex;align-items: center;">
                  <p class="mag-r-10">
                    <img
                      style=" width: 0.6rem;"
                      src="http://hstatic.1818pay.cn/image/icon/dae/ruzhang@3x.png"
                      alt
                    />
                  </p>
                  <div v-if="planValue" style="margin-left: 6px;    font-size: .25rem;">
                    <div class="tex1">
                      还款 {{planValue.amount|moneYuan}} 元
                      <span class="red">(实际还款{{planValue.arrivalAmount|moneYuan}}) 元</span>
                      <div style="clear: both;"></div>
                    </div>
                    <p class="tex2">(手续费{{planValue.fee|moneYuan}} 元)</p>
                    <p v-if="planValue.state==6&&planValue.payState==4" style="color:black">
                      失败原因:
                      <span style="color:red">{{planValue.cause}}</span>
                    </p>
                  </div>
                  <div class="fiex1 f-right">
                    <div v-if="planValue.state==0" class="c-hui pr red dot-bth dot-red mag-r-10">失败</div>
                    <div
                      v-if="planValue.state==1"
                      class="c-hui pr blue dot-bth dot-blue mag-r-10"
                    >待执行</div>
                    <div
                      v-if="planValue.state==2"
                      class="c-hui pr blue dot-bth dot-blue mag-r-10"
                    >执行中</div>
                    <div
                      v-if="planValue.state==3"
                      class="c-hui pr green dot-bth dot-green mag-r-10"
                    >完成</div>
                    <div v-if="planValue.state==4" class="c-hui pr org dot-bth dot-org mag-r-10">已中断</div>
                    <div
                      class="f-24 c999"
                    >{{new Date(planValue.executeTime).format('yyyy-MM-dd hh:mm:ss')}}</div>
                    <div
                      v-if="planValue.isAnew==1"
                      @click="openDetail(planValue)"
                      class="f-26 c999 mag-t-7"
                    >
                      <span>补单详情</span>
                      <van-icon name="arrow" style="margin-top: 3px;vertical-align: top;" />
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </van-list>
      </div>
      <div style="clear: both;"></div>
    </div>

    <div style="clear: both;"></div>
    <!-- 计划详情弹出 -->
    <!-- <van-popup  v-model="planDetailJson.show" style="border-radius: 5px;" >
				<SupplementSheet v-if="planDetailJson.show" :planId="planDetailJson.orderNo" @closewin="closewinDetail"/>	
    </van-popup>-->
  </div>
</template>

<script>
var $th = "";
// import SupplementSheet from '@/views/SupplementSheet/index.vue';
export default {
  components: {
    // SupplementSheet
  },
  data() {
    return {
      planDetailJson: {
        show: false,
        orderNo: "1"
      },
      items: [],
      finished: false,
      loading: false,
      listItem: [],
      show: false,
      scdata: {}, //储蓄卡
      city: "", //位置
      plan: {}, //
      repNum: "", //到账次数
      li: "执行此计划信用卡需预留",
      lia: ",请确保此卡金额充足，以免交易失败",
      basicAmount: null,
      createPlan: "", //用户创建计划的信息
      planDetail:{
        list:[]
      }, //计划详情
      setPage: {
        pageSize: 10,
        pageNum: 1,
        total: 1,
        pages: 1
      },
      test: "",
      previousData: {
        //计划列表页面的数据
      }
    };
  },
  created: function() {},
  mounted() {
    $th = this;
    //获取计划详情
    $th.previousData = $th.$store.state.planDetail;
    console.log("计划详情", $th.previousData);
    // 获取预览计划
    // $th.createPlan =JSON.parse(localStorage.getItem("createPlan"));
    //预览计划
    // $th.init();
    console.log("$th.createPlan", $th.createPlan);
  },
  filters: {
    moneyData: function(val) {
      if (val) {
        var responese = $th.accMul(val, 0.01).toFixed(2);
        return responese;
      } else {
        return 0;
      }
    },
    fmtDate: function(time) {
      time = new Date(time);
      var year = time.getFullYear(time);
      var month =
          time.getMonth(time) + 1 < 10
            ? "0" + (time.getMonth() + 1)
            : time.getMonth() + 1, //月份是从0开始的
        day = time.getDate(time) < 10 ? "0" + time.getDate() : time.getDate(),
        hour =
          time.getHours(time) < 10 ? "0" + time.getHours() : time.getHours(),
        min =
          time.getMinutes(time) < 10
            ? "0" + time.getMinutes()
            : time.getMinutes();

      time = year + "-" + month + "-" + day + " " + hour + ":" + min;
      return time;
    },
    fmtDate2: function(time) {
      // console.log(time)
      var list = time.split(",");
      console.log(list);
      var create = null;
      var end = null;
      for (var i = 0; i < list.length; i++) {
        // console.log(111)
        var listitem = new Date(parseInt(list[i]));
        var year = listitem.getFullYear(listitem);
        var month =
            listitem.getMonth(listitem) + 1 < 10
              ? "0" + (listitem.getMonth() + 1)
              : listitem.getMonth() + 1, //月份是从0开始的
          day =
            listitem.getDate(listitem) < 10
              ? "0" + listitem.getDate()
              : listitem.getDate(),
          hour =
            listitem.getHours(listitem) < 10
              ? "0" + listitem.getHours()
              : listitem.getHours(),
          min =
            listitem.getMinutes(listitem) < 10
              ? "0" + listitem.getMinutes()
              : listitem.getMinutes();
        // console.log(year + '/' + month + '/' + day  )
        if (i == 0) {
          create = year + "/" + month + "/" + day;
        }
        if (i == list.length - 1) {
          end = year + "/" + month + "/" + day;
        }
      }
      return create + "~" + end;
    }
  },
  methods: {
    openDetail(val) {
      console.log("返回的结果", val);
      this.planDetailJson.show = true;
      this.planDetailJson.orderNo = val.newOrderNo;
    },
    closewinDetail() {
      this.planDetailJson.show = false;
    },
    async onLoad() {
        $th.init();
    },
    async init() {
      var cardDetial = await $th.$axios(
        "http://hlb.1818pay.cn:1003/common/plan/findPlanDetailByTime",
        {
          planId:$th.$store.state.planDetail.pId,
          sort:"executeTime",
          pageSize:$th.setPage.pageSize,
          pageNum:$th.setPage.pageNum,
          pages:$th.setPage.pages,
        },
        "get"
      );
       $th.loading = false; //加载结束
      // $th.planDetail = cardDetial;
      if (cardDetial.list != "") {
        $th.planDetail.list =  $th.planDetail.list.concat(cardDetial.list); //加载当前数据
      }
      console.log("$th.planDetail.list",$th.planDetail.list)
      if( $th.setPage.pageNum >= cardDetial.pages) {
        $th.finished = true; //加载完成
      } 
       $th.setPage.pageNum++;
    },
    async getDateFun() {},
    goBack() {
      this.$router.push({
        name: "zdjh",
        params: {
          cccard: this.cccard,
          city: this.$store.state.merchant_city,
          province: this.$route.params.province,
          amount: this.$route.params.amount
        }
      });
    },
    async showalert() {
      //数据提交
      try {
        var sendData = "";
        //提取通道
        var aisleListStr = "";
        $.each($th.planDetail.aisleList, function(k, v) {
          aisleListStr += v + ",";
        });

        sendData = {
          customerId: $th.planDetail.plan.customerId, // 用户id
          aisles: aisleListStr, // 可用通道，逗号分隔
          flag: "0" // 默认为0
        };

        var reqData = await $th.$axiosFun(
          "/plan/plan/commitPlan",
          sendData,
          "post"
        );
        if (reqData.code == 1000) {
          $th.$toast("制定成功");
          setTimeout(function() {
            $th.$router.push("/");
          }, 500);
        } else if (reqData.code == 9001) {
          localStorage.setItem("commitPlan", JSON.stringify(reqData.data));
          $th.$dialog
            .alert({
              title: "提示",
              message: "请开通用户协议"
            })
            .then(() => {
              localStorage.setItem("cardId", $th.planDetail.plan.cardId);
              $th.$router.push("/ktxyzf?cardId=" + $th.planDetail.plan.cardId);
            });
        } else {
          $th.$toast(reqData.message);
        }
      } catch (error) {}

      // this.show = true;
    },
    snb() {
      // this.$Spin.show();
      axios
        .get(this.$store.state.host + "/plans/savePlan", {
          params: {
            channelCode: this.$store.state.channelCode,
            planJsonKey: this.$store.state.plancccard.planJsonKey,
            token: this.$store.state.token
            // mccs: this.mccArr.join(","),
            // orderNos: this.mccOrderNo.join(",")
          }
        })
        .then(res => {
          if (res.data.respCode == "0000") {
            // this.$Spin.hide();
            this.$router.push("suok");
          } else {
            this.$Message.error(res.data.respDesc);
          }
        });
    }
  }
};
</script>
<style scoped="scoped" lang='less'>
@import "./index.less";
</style>
