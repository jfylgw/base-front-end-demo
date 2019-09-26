/**
 * @name cookie工具
 * @description
 * @author: gongjf
 * @since: 2019年6月24日 11:12:49
 */

import VueCookies from "vue-cookies";

// import * as base64 from "@/assets/js/coding/base64";

// token 名称
export const tokenKey = "x-access-token";

// token 有效期
export const tokenValidTime = "1d";

/**
 * 设置cookie
 */
export function set(key, value, time) {
  VueCookies.set(key, value, time);
}

/**
 * 获取cookie
 */
export function get(key) {
  VueCookies.get(key);
}

/**
 * 移除cookie
 */
export function remove(key) {
  VueCookies.remove(key);
}

/**
 * 清除cookie
 */
export function clear() {
  VueCookies.keys().forEach(function(val) {
    this.remove(val);
  }, this);
}

/**
 * 检查cookie是否已经存在
 */
export function isExist(key) {
  VueCookies.isKey(key);
}
