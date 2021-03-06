/**
 * @name 缓存管理
 * @description
 * @author gongjf
 * @since 2019年6月24日 11:13:10
 */

import { validateNull } from "./validate";

/**
 * 存储到sessionStore
 */
export const setSessionStore = params => {
  const { name, value, data, time } = params;
  let obj = {
    value, data,
    time: time || new Date()
  };
  window.sessionStorage.setItem(name, JSON.stringify(obj));
};

/**
 * 存储到localStore
 */
export const setLocalStore = params => {
  const { name, value, data, time } = params;
  let obj = {
    value, data,
    time: time || new Date()
  };
  window.localStorage.setItem(name, JSON.stringify(obj));
};

/**
 * 存储到sessionStore和localStore
 */
export const setStore = params => {
  setSessionStore(params);
  setLocalStore(params);
};

/**
 * 获取sessionStore的对应项
 */
export const getSessionStore = name => {
  let obj = window.sessionStorage.getItem(name);
  if (validateNull(obj)) return;
  obj = JSON.parse(obj);

  let type = typeof obj.value;
  if (type === "number") {
    obj.value = Number(obj.value);
  } else if (type === "boolean") {
    obj.value = eval(obj.value);
  }
  return obj.value;
};

/**
 * 获取sessionStore的对应项的其他数据
 */
export const getSessionStoreData = name => {
  let obj = window.sessionStorage.getItem(name);
  if (validateNull(obj)) return;
  obj = JSON.parse(obj);

  let type = typeof obj.data;
  if (type === "number") {
    obj.data = Number(obj.data);
  } else if (type === "boolean") {
    obj.data = eval(obj.data);
  }
  return obj.data;
};

/**
 * 获取localStore的对应项
 */
export const getLocalStore = name => {
  let obj = window.localStorage.getItem(name);
  if (validateNull(obj)) return;
  obj = JSON.parse(obj);

  let type = typeof obj.value;
  if (type === "number") {
    obj.value = Number(obj.value);
  } else if (type === "boolean") {
    obj.value = eval(obj.value);
  }
  return obj.value;
};

/**
 * 获取localStore的对应项的其他数据
 */
export const getLocalStoreData = name => {
  let obj = window.localStorage.getItem(name);
  if (validateNull(obj)) return;
  obj = JSON.parse(obj);

  let type = typeof obj.data;
  if (type === "number") {
    obj.data = Number(obj.data);
  } else if (type === "boolean") {
    obj.data = eval(obj.data);
  }
  return obj.data;
};

/**
 * 获取sessionStore或localStore
 */
export const getStore = name => {
  let obj = getSessionStore(name);
  if (validateNull(obj)) getLocalStore(name);
  return obj;
};

/**
 * 删除sessionStore的值
 */
export const removeSessionStore = name => {
  window.sessionStorage.removeItem(name);
};

/**
 * 删除localStorage的值
 */
export const removeLocalStore = name => {
  window.localStorage.removeItem(name);
};

/**
 * 删除sessionStore和localStore的值
 */
export const removeStore = name => {
  removeSessionStore(name);
  removeLocalStore(name);
};

/**
 * 清空sessionStore
 */
export const clearSessionStore = () => {
  window.sessionStore.clear();
};

/**
 * 清空localStorage
 */
export const clearLocalStore = () => {
  window.localStorage.clear();
};

/**
 * 清空sessionStore和localStore的值
 */
export const clearStore = () => {
  clearSessionStore();
  clearLocalStore();
};
