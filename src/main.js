import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/common/js/format-date.js'

var  bus = new Vue();
export default bus
//vant下拉刷新
import { PullRefresh } from 'vant';
Vue.use(PullRefresh);
//vant确认弹窗
import { Dialog } from 'vant';
Vue.use(Dialog);
//vant地区选择
import { Area } from 'vant';
Vue.use(Area);
//vant 弹出框
import { Popup } from 'vant';
Vue.use(Popup);
//vant下拉列表
import { List } from 'vant';
Vue.use(List);
//vant 文件上传
import { Uploader } from 'vant';
Vue.use(Uploader);
//vant 气泡弹出
import { Toast } from 'vant';
Vue.use(Toast);
//vant 单元格箭头
import { Cell, CellGroup } from 'vant';
Vue.use(Cell).use(CellGroup);
//vant tab 切换
import { Tab, Tabs } from 'vant';
Vue.use(Tab).use(Tabs);
//vant icon
import { Icon } from 'vant';
Vue.use(Icon);
//vant 输入框
import { Field } from 'vant';
Vue.use(Field);
// vant 底部导航
import { Tabbar, TabbarItem } from 'vant';
Vue.use(Tabbar).use(TabbarItem);
//vant 头部导航
import { NavBar } from 'vant';
Vue.use(NavBar);
//公共方法
import PublicMethod from '@/common/js/publicMethod'
//公共样式
import '@/common/css/common.css'
console.log("store", store)

Vue.use(PublicMethod)

Vue.config.productionTip = false

//为不同的页面切换title
router.beforeEach((to, from, next) => {
  // window.document.title = to.meta.title;
  // console.log("to.meta.title",to.meta.title)
  //验证是否需要登录
  //验证是否需要实名
  next();
  if (to.meta.merStat == true) { //需要实名
      if(store.state.merStat=='Y'){ //已经实名
         next();
      }else{ //没有实名
        Toast('请先实名');
         setTimeout(() => {
          next({
            path: '/realName'
          })
        }, 800)
      }
  }else{
    next();
  }
})



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
