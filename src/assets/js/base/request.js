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
import { serialize } from "assets/js/base/util";
// import Status from "api/status";
// import { authApis } from "api/url";

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
const defaultContentType = `application/json;charset=${encode}`; // 适用于Restful API
// const defaultContentType = `application/x-www-form-urlencoded;charset=${encode}`;
// const defaultContentType = `multipart/form-data;charset=${encode}`;

// 默认响应数据类型
const defaultDataType = 'json';
// const defaultDataType = 'text';

/**
 * axios 配置
 */
// 默认上下文类型
// Axios.defaults.headers['Content-Type'] = defaultContentType;
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
 * 请求拦截
 */
Axios.interceptors.request.use(
  config => {
    // 参数序列化
    if (config.headers.serialize) {
      config.data = serialize(config.data);
      delete config.data.serialize;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截
 */
Axios.interceptors.response.use(
  data => {
    return data.data || {};
  },
  error => {
    return Promise.reject(error);
  }
);

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
 * 设置默认请求头
 * @param headers
 */
function setRequestHeader(headers) {
  headers = headers || {};
  // 请求类型
  let contentType = headers['Content-Type'] || defaultContentType;
  headers['Content-Type'] = contentType;
  // 响应类型
  let dataType = headers['Data-Type'] || defaultDataType;
  headers['Data-Type'] = dataType;
  return headers;
}

/**
 * 对请求数据进行处理
 * @param headers
 * @param data
 */
function paramFilter(headers, data) {
  // 请求类型
  let contentType = headers['Content-Type'] || defaultContentType;
  let content = data;
  if(contentType.indexOf('json')>-1) {
    content = JSON.stringify(data)
  } else if(contentType.indexOf('urlencoded')>-1) {
    content = Qs.stringify(data);
  } else if(contentType.indexOf('form-data')>-1) {
    content = new FormData();
    for(let key in data) {
      data.append(key, data[key]);
    }
  }
  return content;
}

/**
 * 对响应数据进行处理
 * @param promise
 * @param dataType
 */
function dataFilter(promise, dataType) {
  dataType = dataType || defaultDataType;
  if (promise) {
    if(typeof promise === 'string') {
      promise = JSON.parse(promise);
    }
    if(promise.data && dataType === 'json') {
      promise.data = JSON.parse(promise.data);
    }
  }

  if (promise && promise.status && promise.status<0) {
    // 未登陆，直接跳转到登录页，不需要提示
    if(promise.status === -1) {
        // // 跳转到登录页
        // Store.dispatch("ROUTER_TO_SIGNIN");
        // 展示全局登录弹窗
        Store.dispatch("SHOW_SIGNIN_DIALOG");
        return null;
    }

    Message({ type: "error", showClose: true, message: promise.message });
    // "无使用权限"
    if(promise.status === -2) {
        return null;
    }
    // "您无对于该范围数据的操作权限"
    else if(promise.status === -6) {
        return null;
    }
    // "token无效"
    else if(promise.status === -1004) {
        return null;
    }
  }
  return promise;
}

/***************************************     提供外部方法     *************************************/

/**
 * 异步请求对象
 */
const request = {
  get: async (url, data, headers) => {
    let promise = null;
    try {
      headers = setRequestHeader(headers);
      promise = dataFilter(await Axios.get(appendUrlParam(url, data), data, {headers}), headers['Data-Type']);
    } catch (e) {
      return e;
    }
    return promise;
  },
  post: async (url, data, headers) => {
    let promise = null;
    try {
      headers = setRequestHeader(headers);
      promise = dataFilter(await Axios.post(url, paramFilter(headers, data), {headers}), headers['Data-Type']);
    } catch (e) {
      return e;
    }
    return promise;
  },
  put: async (url, data, headers) => {
    let promise = null;
    try {
      headers = setRequestHeader(headers);
      promise = dataFilter(await Axios.put(url, paramFilter(headers, data), {headers}), headers['Data-Type']);
    } catch (e) {
      return e;
    }
    return promise;
  },
  delete: async (url, data, headers) => {
    let promise = null;
    try {
      headers = setRequestHeader(headers);
      promise = dataFilter(await Axios.delete(url, paramFilter(headers, data), {headers}), headers['Data-Type']);
    } catch (e) {
      return e;
    }
    return promise;
  },
  jsonp: async (url, data, dataType) => {
    let promise = null;
    url = appendUrlParam(url, data);
    try {
      promise = await new Promise(resolve => {
        Jsonp(url, jsonpOption, (err, res) => {
          resolve(res);
        });
      });
      promise = dataFilter(promise, dataType);
    } catch (e) {
      return e;
    }
    return promise;
  }
};

export default request;