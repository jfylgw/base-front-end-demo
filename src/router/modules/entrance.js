/**
 * @name 入口路由配置
 * @description
 * @author gongjf
 * @since 2019年6月24日 11:11:08
 */

export default [
  /********************* 登录 ***************************/
  {
    path: "/sign-in",
    name: "sign-in",
    component: () => import("@/views/sign/SignIn.vue")
  },
  {
    path: "/sign-out",
    name: "sign-out",
    component: () => import("@/views/sign/SignOut.vue")
  },
  {
    path: "/sign-up",
    name: "sign-up",
    component: () => import("@/views/sign/SignUp.vue")
  },
  /********************* 入口 ***************************/
  {
    path: "/home",
    name: "home",
    props: true,
    component: () => import("@/views/Home.vue")
  }
];
