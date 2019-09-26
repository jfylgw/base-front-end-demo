/**
 * @name 后台路由配置
 * @description
 * @author gongjf
 * @since 2019年6月24日 11:11:14
 */

export default [
  {
    path: "/rear",
    name: "rear",
    component: () => import("@/views/rear/Rear.vue"),
    meta: {
      keepAlive: true
    },
    props: true,
    children: [
      {
        path: "user",
        name: "user",
        components: {
          // default: () => import("@/views/rear/User.vue"),
          rear: () => import("@/views/rear/User.vue")
        },
        meta: {
          keepAlive: true
        },
        props: true,
        children: []
      }
    ]
  }
];
