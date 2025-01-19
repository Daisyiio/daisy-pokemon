import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router';

const routers: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   name: 'index',
  //   component: () => import('../views/index.vue')
  // },
  {
    path: '/',
    name: 'daisy',
    redirect: '/daisy/pokemon',
    component: () => import('@/views/daisy/layout/index.vue'),
    children: [
      // {
      //   name: "daisyHome",
      //   path: "/daisy/home",
      //   component: () => import("@/views/daisy/home/index.vue"),
      //   meta: {},
      //   // redirect: "/seize-ship-control",
      // },
      {
        name:"pokemon",
        path:'/daisy/pokemon',
        component:()=>import('@/views/daisy/pokemon/index.vue'),
        meta:{}
      },
    ],
  },
  // // araski主页 add by araski 240427
  // { 
  //   path: '/araski',
  //   name: 'araski',
  //   component: () => import('@/views/araski/home/araskihome.vue'),
  //   beforeEnter: (to, from, next) => {  
  //     to.meta.needsRefresh = true;  
  //     from.meta.needsRefresh = true;
  //     next();  
  //   } 
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routers
})

export default router