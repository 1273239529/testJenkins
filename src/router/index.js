import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/test',
    name: '/test',
    component: () => import('@/views/test/index.vue'),
    meta: {
    }
  },
  {
    path: '/',
    redirect: '/homePage/home'
  },
  {
    path: '/homePage',
    name: '/homePage',
    component: () => import('@/views/homePage/index.vue'),
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: "发现",
          // keepAlive: true
        }
      },
      {
        path: 'me',
        name: 'me',
        component: () => import('@/views/me/index.vue'),
        meta: {
          title: '我的',
          // keepAlive: true
        }
      },
      {
        path: 'share',
        name: 'share',
        component: () => import('@/views/share/index.vue'),
        meta: {
          title: '分享',
          // keepAlive: true
        }
      },
    ]
  },
  {
    path: '/login',
    name: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      isLogin: false,
      title: "登录"
    }
  },
  {
    path: '/selCard',
    name: '/selCard',
    component: () => import('@/views/selCard/index.vue'),
    meta: {
      title: "我的卡包",
    }
  },
  {
    path: '/share',
    name: '/share',
    component: () => import('@/views/share/index.vue'),
    meta: {
      title: '分享',
      keepAlive: true
    }
  },
  {
    path: '/me',
    name: '/me',
    component: () => import('@/views/me/index.vue'),
    meta: {
      title: '我的',
      keepAlive: true
    }
  },
  {
    path: '/realName',
    name: '/realName',
    component: () => import('@/views/realName/index.vue'),
    meta: {
      title: "实名认证"
    }
  },
  {
    path: '/planDetail',
    name: '/planDetail',
    component: () => import('@/views/planDetail/index.vue'),
    meta: {
      title: "计划详情"
    }
  },
  {
    path: '/creditCardPage',
    name: '/creditCardPage',
    component: () => import('@/views/creditCardPage/index.vue'),
    meta: {
      title: "我的卡包",
      merStat: true
    }
  },
  {
    path: '/addCardPage',
    name: '/addCardPage',
    component: () => import('@/views/addCardPage/index.vue'),
    meta: {
      title: "添加信用卡"
    }
  },
  {
    path: '/savingsDepositCard',
    name: '/savingsDepositCard',
    component: () => import('@/views/savingsDepositCard/index.vue'),
    meta: {
      title: "我的卡包"
    }
  },
  {
    path: '/addSavingsDepositCard',
    name: '/addSavingsDepositCard',
    component: () => import('@/views/addSavingsDepositCard/index.vue'),
    meta: {
      title: "添加储蓄卡"
    }
  },
  {
    path: '/cardManagement',
    name: '/cardManagement',
    component: () => import('@/views/cardManagement/index.vue'),
    meta: {
      title: "卡管理"
    }
  },
  {
    path: '/savingsCardManagement',
    name: '/savingsCardManagement',
    component: () => import('@/views/savingsCardManagement/index.vue'),
    meta: {
      title: "卡管理"
    }
  },
  {
    path: '/repaymentPlan',
    name: '/repaymentPlan',
    component: () => import('@/views/repaymentPlan/index.vue'),
    meta: {
      title: "还款计划"
    }
  },
  {
    path: '/repaymentPlanHistory',
    name: '/repaymentPlanHistory',
    component: () => import('@/views/repaymentPlanHistory/index.vue'),
  },
  {
    path: '/billExtension',
    name: '/billExtension',
    component: () => import('@/views/billExtension/index.vue'),
    meta: {
      title: "制定计划"
    }
  },
  {
    path: '/manualAudit',
    name: '/manualAudit',
    component: () => import('@/views/manualAudit/index.vue'),
    meta: {
      title: "开通收款"
    }
  },
]

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router
