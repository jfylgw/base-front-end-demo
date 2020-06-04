/**
 * @name 路由配置
 * @description
 * @author gongjf
 * @since 2019年6月24日 11:11:21
 */

import Vue from "vue";
import Router from "vue-router";
// import Store from "@/store/index";

import entranceRoutes from "./modules/entrance";
import frontRoutes from "./modules/front";
import rearRoutes from "./modules/rear";

Vue.use(Router);

const router = new Router({
  // mode: "history",
  base: process.env.BASE_URL,
  // 记录滚动位置（只在支持 history.pushState 的浏览器中可用）
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return {
        x: 0,
        y: to.meta.savedPosition || 0
      };
    }
  },
  routes: [
    {
      path: "/",
      redirect: "/signIn"
      // redirect: "/home"
      // redirect: "/rear/user",
      // redirect: "/front/map",
    }
  ].concat(entranceRoutes, frontRoutes, rearRoutes)
});

// 路由前过滤
router.beforeEach(async (to, from, next) => {
  if (!to || !from) return;
  // let token = Store.getters.GET_ACCESS_TOKEN;
  // // 如果没有登录过，就跳转到登录页
  // if ((!token || token.length === 0) && to.name !== Store.getters.GET_SIGNIN_PAGE) {
  //   await Store.dispatch("SIGN_OUT");
  //   next({
  //     name: Store.getters.GET_SIGNIN_PAGE
  //   });
  //   return;
  // }
  // 否则放过本次导航
  next();
});

// 路由后过滤
router.afterEach((to, from) => {
  if (!to || !from) return;
});

export default router;
