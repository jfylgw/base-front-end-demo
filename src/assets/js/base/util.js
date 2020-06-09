/**
 * @name 通用工具方法
 * @description
 * @author gongjf
 * @since 2019年6月24日 11:13:38
 */

/***************************** 数字 ******************************************/

/**
 * 保留给定数值的小数长度，默认不保留小数，设定数值大于位数时不作扩展
 * @param decimal
 * @return {number}
 */
export const numberToDecimal = (num, decimal) => {
  let f = parseFloat(num);
  if (isNaN(f)) return;
  decimal = decimal
    ? typeof(decimal) === "string"
      ? parseInt(decimal)
      : decimal
    : 0;
  let times = 1;
  for (let i = 0; i < decimal; i++) times *= 10;
  return Math.round(f * times) / times;
}

/**
 * 获取任意整数
 * @param min
 * @param max
 * @return {number}
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * 生成随机len位数字
 */
export function getRandomLenNum(len, date) {
  let random = "";
  random = Math.ceil(Math.random() * 100000000000000)
    .toString()
    .substr(0, len || 4);
  if (date) random = random + Date.now();
  return random;
}

/***************************** 数组 ******************************************/

/**
 * 打乱数组排序
 * @param arr
 */
export function arrayShuffle(arr) {
  let _arr = arr.slice();
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i);
    let t = _arr[i];
    _arr[i] = _arr[j];
    _arr[j] = t;
  }
  return _arr;
}

/**
 * 根据给定值，移除数组对应值
 * @param value
 */
export function arrayRemoveByValue(arr, value) {
  let index = arr.findIndex(val => Object.is(val, value));
  if (index > -1) arr.splice(index, 1);
}

/***************************** 对象 ******************************************/

/**
 * 判断A是否属于B类型
 * @param A
 * @param B
 * @return {boolean}
 * @private
 */
export function instanceOf(A, B) {
  let O = B.prototype; // 取B的显示原型
  A = A.__proto__; // 取A的隐式原型
  if (A === null) return false;
  if (O === A) return true;
  return instanceOf(A, B);
}

/**
 * 获取对象类型
 * @param obj
 */
export function getObjType(obj) {
  let toString = Object.prototype.toString;
  let map = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regExp",
    "[object Undefined]": "undefined",
    "[object Null]": "null",
    "[object Object]": "object"
  };
  if (obj instanceof Element) {
    return "element";
  }
  return map[toString.call(obj)];
}

/**
 * 表单序列化
 * @param data
 * @return {string}
 */
export function serialize(data) {
  let list = [];
  Object.keys(data).forEach(ele => {
    list.push(`${ele}=${data[ele]}`);
  });
  return list.join("&");
}

/**
 * 对象深拷贝
 */
export function deepClone(data) {
  let type = getObjType(data);
  let obj;
  if (type === "array") {
    obj = [];
  } else if (type === "object") {
    obj = {};
  } else {
    // 不再具有下一层次
    return data;
  }
  if (type === "array") {
    for (let i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]));
    }
  } else if (type === "object") {
    for (let key in data) {
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
}

/**
 * 函数柯里化：将使用多个参数的一个函数转换成一系列使用一个参数的函数
 */
export function curry(fn, args = [], holes = []) {
  let length = fn.length;

  return function() {
    let _args = args.slice(0),
      _holes = holes.slice(0),
      argsLen = args.length,
      holesLen = holes.length,
      arg, i, index = 0;

    for (i = 0; i < arguments.length; i++) {
      arg = arguments[i];
      // 处理类似 fn(1, _, _, 4)(_, 3) 这种情况，index 需要指向 holes 正确的下标
      if (arg === _ && holesLen) {
        index++
        if (index > holesLen) {
          _args.push(arg);
          _holes.push(argsLen - 1 + index - holesLen)
        }
      }
      // 处理类似 fn(1)(_) 这种情况
      else if (arg === _) {
        _args.push(arg);
        _holes.push(argsLen + i);
      }
      // 处理类似 fn(_, 2)(1) 这种情况
      else if (holesLen) {
        // fn(_, 2)(_, 3)
        if (index >= holesLen) {
          _args.push(arg);
        }
        // fn(_, 2)(1) 用参数 1 替换占位符
        else {
          _args.splice(_holes[index], 1, arg);
          _holes.splice(index, 1)
        }
      }
      else {
        _args.push(arg);
      }
    }

    if (_holes.length || _args.length < length) {
      return curry.call(this, fn, _args, _holes);
    }
    else {
      return fn.apply(this, _args);
    }
  }
}

/***************************** 字符串 ******************************************/

/**
 * 清除两侧空格
 */
export function stringTrim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 清除左侧空格
 */
export function stringLTrim(str) {
  return str.replace(/(^\s*)/g, "");
}

/**
 * 清除右侧空格
 */
export function stringRTrim(str) {
  return str.replace(/(\s*$)/g, "");
}

/***************************** 事件 ******************************************/

/**
 * 主动点击指定元素对象
 */
export function activeClick(elementObj) {
  let ev = document.createEvent("MouseEvents");
  ev.initMouseEvent(
      "click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null
  );
  elementObj.dispatchEvent(ev);
}

/**
 * 防抖：频繁触发的情况下，只有停止触发后等待一定时间，才执行代码一次
 * func：目标函数
 * wait：动作后的等待时间
 * immediate：是否立即执行
 */
export function debounce(func, wait, immediate) {
  let timeout, result;

  let debounced = function () {
    // 将this指向正确的对象
    let context = this;
    // 将原事件对象传入
    let args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      // 如果已经执行过，不再执行
      let callNow = !timeout;
      timeout = setTimeout(function(){
        timeout = null;
      }, wait)
      if (callNow) result = func.apply(context, args)
    }
    else {
      timeout = setTimeout(function(){
        func.apply(context, args)
      }, wait);
    }
    return result;
  };

  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}

/**
 * 节流：如果持续触发事件，一定时间内只执行代码一次
 * func：目标函数
 * wait：时间间隔
 * options：leading：false 表示禁用第一次执行
            trailing: false 表示禁用停止触发的回调
 */
export function throttle(func, wait, options) {
  let timeout, context, args, result;
  let previous = 0;
  if (!options) options = {};

  let later = function() {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    func.apply(context, args);
    if (!timeout) context = args = null;
  };

  let throttled = function() {
    let now = new Date().getTime();
    if (!previous && options.leading === false) previous = now;
    let remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
  };

  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = null;
  };

  return throttled;
}

/***************************** 文件操作 ******************************************/

/**
 * 下载
 */
export function download(fileName, blobData) {
  let urlObject = window.URL || window.webkitURL || window;
  // 创建超链接对象
  let linkObj = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
  linkObj.href = urlObject.createObjectURL(blobData);
  linkObj.download = fileName;
  activeClick(linkObj);
}
