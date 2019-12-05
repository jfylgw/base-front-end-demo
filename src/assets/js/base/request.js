/**
 * @name 通用异步请求配置
 * @description
 * @author gongjf
 * @since 2019年6月24日 11:17:37
 */

import Axios from "axios";
import Jsonp from "jsonp";
import Qs from 'qs';
import Store from "store/index";
import { Message } from "element-ui";

/***************************************     配置     *************************************/

// 字符编码
const encode = 'UTF-8';

/**
 * Jsonp 配置
 */
const jsonpOption = {
  // param: "jsonpCallback",
  timeout: 30000
};

// 默认请求数据类型
const defaultContentType = `application/json;charset=${encode}`;
// const defaultContentType = `application/x-www-form-urlencoded;charset=${encode}`;
// const defaultContentType = `multipart/form-data;charset=${encode}`;
// 默认响应数据类型
const defaultDataType = 'json';
// const defaultDataType = 'text';

/**
 * axios 配置
 */
// 30秒后超时
Axios.defaults.timeout = 30000;
// 跨域请求，允许保存cookie
Axios.defaults.withCredentials = true;
// 限定返回状态码
Axios.defaults.validateStatus = status => {
  return status >= 200 && status <= 500; // 默认的
};

/***************************************     拦截     *************************************/

/**
 * 请求拦截器
 */
Axios.interceptors.request.use(
  config => {
    // 处理请求头
    config.headers = Object.assign({
      'Content-Type': defaultContentType,
      dataType: defaultDataType
    }, config.headers);

    // 处理请求数据
    let params = config.data || {};
    let contentType = config.headers['Content-Type'];
    if(contentType.indexOf('json')>-1) {
      config.data = JSON.stringify(params)
    } 
    else if(contentType.indexOf('urlencoded')>-1) {
      config.data = Qs.stringify(params);
    } 
    else if(contentType.indexOf('form-data')>-1) {
      let formData = new FormData();
      for(let key in params) {
        formData.append(key, params[key]);
      }
      config.data = formData;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
Axios.interceptors.response.use(
  data => {
    let serverStatus = data.data.status || 200
    let serverMsg = data.data.message || '';
    
    // 处理响应状态
    if (serverStatus < 0) {
      // "未登陆"
      if(serverStatus === -1) {
          // 展示登录弹窗
          Store.dispatch("SHOW_SIGNIN_DIALOG");
      }
      // // "无使用权限"
      // else if(serverStatus === -2) {}
      // // "您无对于该范围数据的操作权限"
      // else if(serverStatus === -6) {}
      // // "token无效"
      // else if(serverStatus === -1004) {}

      // 打印错误信息
      if(serverStatus !== 3004) Message({ type: "error", showClose: true, message: serverMsg });

      return null;
    }

    // 处理响应数据
    let { dataType } = data.config.headers;
    // let { responseType } = data.config;
    if(typeof data.data === 'string') {
      data.data = JSON.parse(data.data);
    }
    if(data.data.data && typeof data.data.data === 'string' && dataType === 'json') {
      data.data.data = JSON.parse(data.data.data);
    }

    return data;
  },
  error => {
    return Promise.reject(error);
  }
);

/***************************************     方法     *************************************/

/**
 * 为url追加参数
 * @param url
 * @param data
 * @return {*}
 */
function appendUrlParam(url, data) {
  if (!data && !Object.is(data, {})) return url;

  let paramStr = "";
  for (let k in data) {
    let value = data[k] ? data[k] : "";
    paramStr = `${paramStr}&${k}=${encodeURIComponent(value)}`;
  }
  paramStr = paramStr && paramStr.length > 0 ? paramStr.substring(1) : "";
  paramStr = `${!url.includes("?") ? "?" : "&"}${paramStr}`;

  return `${url}${paramStr}`;
}

/**
 * 异步请求对象
 */
const request = {
  get: async (url, data, options) => {
    let promise = null;
    try {
      promise = await Axios.get(appendUrlParam(url, data), options);
    } catch (e) {
      return e;
    }
    return promise;
  },
  post: async (url, data, options) => {
    let promise = null;
    try {
      promise = await Axios.post(url, data, options);
    } catch (e) {
      return e;
    }
    return promise;
  },
  put: async (url, data, options) => {
    let promise = null;
    try {
      promise = await Axios.put(url, data, options);
    } catch (e) {
      return e;
    }
    return promise;
  },
  delete: async (url, data, options) => {
    let promise = null;
    try {
      promise = await Axios.delete(url, data, options);
    } catch (e) {
      return e;
    }
    return promise;
  },
  jsonp: async (url, data, options) => {
    let promise = null;
    try {
      promise = await new Promise(resolve => {
        Jsonp(appendUrlParam(url, data), jsonpOption, (err, res) => { resolve(res); });
      });
    } catch (e) {
      return e;
    }
    return promise;
  }
};

export default request;