/**
 * @name 全局变量
 * @description
 * @author gongjf
 * @since 2019年7月10日 10:25:42
 */

import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import common from "./modules/common";
import createLogger from "vuex/dist/logger";

Vue.use(Vuex);

// 判断是否为生产模式
const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    common, user
  },
  strict: debug, // 严格模式，保证所有的状态变更都能被调试工具跟踪到，会深度监测状态树，影响性能
  plugins: debug
    ? [
        createLogger() // 启用日志打印
      ]
    : []
});
