/**
 * @name 入口路由配置
 * @description
 * @author gongjf
 * @since 2019年6月24日 11:11:08
 */

export default [
  /********************* 登录 ***************************/
  {
    path: "/signIn",
    name: "signIn",
    component: () => import("@/views/entrance/SignIn.vue")
  },
  {
    path: "/signOut",
    name: "signOut",
    component: () => import("@/views/entrance/SignOut.vue")
  },
  {
    path: "/signUp",
    name: "signUp",
    component: () => import("@/views/entrance/SignUp.vue")
  },
  /********************* 入口 ***************************/
  {
    path: "/home",
    name: "home",
    props: true,
    component: () => import("@/views/entrance/Home.vue")
  }
];
