/**
 * @name 通用全局变量
 * @description
 * @author gongjf
 * @since 2019年7月10日 10:25:42
 */

import * as Storage from "assets/js/base/storage";
import Router from "router/index";

const common = {
  // 全局状态数据（相当于字段）
  state: {
    platformName: '演示平台', // 平台名称
    copyright: 'Copyright © 2019 XAG Co.,Ltd. All Rights Reserved', // 版权说明
    signInRoute: "signIn", // 登录页路由
    theme: Storage.getSessionStore("theme") || "", // 主题名称
    showSignInDialog: true, // 是否展示全局登录弹窗
    screenLock: false, // 是否锁屏
    routeAccessBtns: [], // 当前路由的需要授权的按钮
    routerTabs: [], // 路由标签页
    componentTabs: [], // 组件标签页
    currentComponentTab: {} // 当前组件标签页
  },
  // 获取state值
  getters: {
    GET_PLATFORM_NAME: state => state.platformName,
    GET_COPYRIGHT: state => state.copyright,
    GET_SIGNIN_ROUTE: state => state.signInRoute,
    GET_SHOW_SIGNIN_DIALOG: state => state.showSignInDialog,
    GET_THEME: state => state.theme,
    GET_SCREEN_LOCK: state => state.screenLock,
    GET_ROUTER_ACCESS_BTN: state => state.routeAccessBtns,
    GET_ROUTER_TABS: state => state.routerTabs,
    GET_COMPONENT_TABS: state => state.componentTabs,
    GET_CURRENT_COMPONENT_TAB: state => state.currentComponentTab
  },
  // 对state的同步操作，相当于setters
  mutations: {
    SET_SHOW_SIGNIN_DIALOG: (state, isShow) => {
      state.showSignInDialog = isShow;
    },
    SET_THEME: (state, color) => {
      state.theme = color;
      Storage.setSessionStore({
        name: "theme",
        value: state.theme
      });
    },
    SET_SCREEN_LOCK: (state, isLock) => {
      state.screenLock = isLock;
      Storage.setSessionStore({
        name: "screenLock",
        value: state.screenLock
      });
    },
    SET_ROUTE_ACCESS_BTNS: (state, btns) => {
      state.routeAccessBtns = btns;
      // Storage.setSessionStore({
      //   name: "routeAccessBtns",
      //   value: state.routeAccessBtns
      // });
    },
    SET_ROUTER_TABS: (state, tabs) => {
      state.routerTabs = tabs;
    },
    SET_COMPONENT_TABS: (state, tabs) => {
      state.componentTabs = tabs;
    },
    SET_CURRENT_COMPONENT_TAB: (state, tab) => {
      state.currentComponentTab = tab;
    },
    PUSH_TO_ROUTER_TABS: (state, tab) => {
      let index = state.routerTabs.findIndex(val => Object.is(val.name, tab.name));
      if(index < 0) state.routerTabs.push(tab);
    },
    PUSH_TO_COMPONENT_TABS: (state, tab) => {
      let index = state.componentTabs.findIndex(val => Object.is(val.name, tab.name));
      if(index < 0) state.componentTabs.push(tab);
    },
    REMOVE_FROM_ROUTER_TABS: (state, name) => {
      let index = state.routerTabs.findIndex(val => Object.is(val.name, name));
      if (index > -1) state.routerTabs.splice(index, 1);
    },
    REMOVE_FROM_COMPONENT_TABS: (state, name) => {
      let index = state.componentTabs.findIndex(val => Object.is(val.name, name));
      if (index > -1) state.componentTabs.splice(index, 1);
    }
  },
  // 对state的异步操作
  actions: {
    SHOW_SIGNIN_DIALOG: (context) => {
      context.commit("SET_SHOW_SIGNIN_DIALOG", true);
    },
    HIDE_SIGNIN_DIALOG: (context) => {
      context.commit("SET_SHOW_SIGNIN_DIALOG", false);
    },
    ROUTER_TO_SIGNIN: (context) => {
      context.commit("SET_SHOW_SIGNIN_DIALOG", false);
      Router.replace({
        path: context.state.signInRoute
      });
    },
    CHANGE_ROUTE_ACCESS_BTNS: (context, params) => {
      context.commit("SET_ROUTE_ACCESS_BTNS", params);
    },
    CLEAN_ROUTE_ACCESS_BTNS: (context) => {
      context.commit("SET_ROUTE_ACCESS_BTNS", []);
    },
    ADD_ROUTER_TAB: (context, params) => {
      // 加入到标签页数组
      context.commit("PUSH_TO_ROUTER_TABS", params);
    },
    REMOVE_ROUTER_TAB: (context, params) => {
      // 从标签页数组中移除
      context.commit("REMOVE_FROM_ROUTER_TABS", params);
    },
    CLEAR_ROUTE_TABS: (context) => {
      // 加入到标签页数组
      context.commit("SET_ROUTER_TABS", []);
    },
    ADD_COMPONENT_TAB: (context, params) => {
      // 加入到组件标签页数组
      context.commit("PUSH_TO_COMPONENT_TABS", params);
    },
    REMOVE_COMPONENT_TAB: (context, params) => {
      // 从组件标签页数组中移除
      context.commit("REMOVE_FROM_COMPONENT_TABS", params);
    },
    CHANGE_CURRENT_COMPONENT_TAB: (context, params) => {
      // 设置当前组件标签页
      context.commit("SET_CURRENT_COMPONENT_TAB", params);
    },
    CLEAR_COMPONENT_TABS: (context) => {
      // 设置组件标签页数组为空
      context.commit("SET_COMPONENT_TABS", []);
    },
    CLEAR_TABS: (context) => {
      // 设置路由标签页数组为空
      context.commit("SET_ROUTE_TABS", []);
      // 设置组件标签页数组为空
      context.commit("SET_COMPONENT_TABS", []);
    }
  }
};

export default common;
