/**
 * @name 帐户全局变量
 * @description
 * @author gongjf
 * @since 2019年7月10日 10:25:42
 */

import * as Storage from "assets/js/base/storage";

const user = {
  // 全局状态数据（相当于字段）
  state: {
    userInfo:
      Storage.getSessionStore("userInfo") || {},
    roles:
      Storage.getSessionStore("roles") || [],
    menus:
      Storage.getSessionStore("menus") || [],
  },
  // 获取state值
  getters: {
    GET_USER_INFO: state => state.userInfo,
    GET_ROLES: state => state.roles,
    GET_MENUS: state => state.menus,
  },
  // 对state的同步操作，相当于setters
  mutations: {
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo;
      Storage.setSessionStore({
        name: "userInfo",
        value: state.userInfo,
      });
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
      Storage.setSessionStore({
        name: "roles",
        value: state.roles,
      });
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus;
      Storage.setSessionStore({
        name: "menus",
        value: state.menus,
      });
    }
  },
  // 对state的异步操作
  actions: {
    // 用户进入系统
    USER_IN(context, params) {
      // 不保存密码
      delete params.pass;
      delete params.password;
      // 设置用户信息
      if(params) context.commit("SET_USER_INFO", params);
      // 设置角色
      if(params && params.authority) context.commit("SET_ROLES", params.authority);
      // 设置菜单
      if(params && params.module) context.commit("SET_MENUS", params.module);
    },
    // 用户离开系统
    USER_OUT(context) {
      // 清除用户信息
      context.commit("SET_USER_INFO", {});
      // 清除角色
      context.commit("SET_ROLES", []);
      // 清除菜单
      context.commit("SET_MENUS", []);
    }
  }
};

export default user;
