/**
 * @name 前台路由配置
 * @description
 * @author gongjf
 * @since 2018年10月9日 10:25:42
 */

export default [
  {
    path: "/front",
    name: "front",
    component: () => import("@/views/front/Front.vue"),
    meta: {
      keepAlive: true
    },
    prop: true,
    children: [
      {
        path: "map",
        name: "map",
        components: {
          // default: () => import("@/views/front/Map.vue"),
          front: () => import("@/views/front/Map.vue")
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
