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
