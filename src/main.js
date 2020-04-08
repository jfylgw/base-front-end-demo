import Vue from "vue";
import VueCookies from "vue-cookies";
import ElementUI from "element-ui";
import VueParticles from "vue-particles";

import store from "store/index";
import router from "router/index";
import request from "assets/js/base/request";
import * as Util from "assets/js/base/util";
import App from "@/App.vue";

// 引入ElementUI默认主题
import "element-ui/lib/theme-chalk/index.css";
import "assets/scss/index.scss";

// 引入Cookie控制
VueCookies.config("7d"); // 设置默认保存时间为7天
Vue.use(VueCookies);
// 引入ElementUI控件
Vue.use(ElementUI);
// 引入粒子控件
Vue.use(VueParticles);
// 配置全局异步请求对象
Vue.prototype.$request = request;
// 全局工具方法
Vue.prototype.$util = Util;
// 判断是否为调试环境
const isDebug = process.env.NODE_ENV !== 'production';
Vue.config.productionTip = isDebug;
Vue.config.silent = isDebug;

// 过长字段省略
Vue.filter('ellipsis', function (value, length) {
  if (!value) return '';
  length = length || 10;
  if (value.length > length) {
      return value.slice(0, length) + '...';
  }
  return value;
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
