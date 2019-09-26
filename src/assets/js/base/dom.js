/**
 * @name 通用dom操作
 * @description
 * @author: gongjf
 * @since: 2019年6月24日 11:13:00
 */

import Vue from "vue";

export function hasClass(el, className) {
  let reg = new RegExp("(^|\\s)" + className + "(\\s|$)");
  return reg.test(el.className);
}

export function addClass(el, className) {
  if (hasClass(el, className)) {
    return;
  }

  let newClass = el.className.split(" ");
  newClass.push(className);
  el.className = newClass.join(" ");
}

export function getData(el, name, val) {
  const prefix = "data-";
  if (val) {
    return el.setAttribute(prefix + name, val);
  }
  return el.getAttribute(prefix + name);
}

let elementStyle = document.createElement("div").style;

let vendor = (() => {
  let transformNames = {
    webkit: "webkitTransform",
    Moz: "MozTransform",
    O: "OTransform",
    ms: "msTransform",
    standard: "transform"
  };

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
  }

  return false;
})();

export function prefixStyle(style) {
  if (vendor === false) {
    return false;
  }
  if (vendor === "standard") {
    return style;
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}

/**
 * 创建自定义组件
 * @param target_：覆盖物组件的挂载目标，格式为类似JQuery的选择器的字符串
 * @param template_：覆盖物组件的HTML模版
 * @param methods_：覆盖物组件的私有方法集合
 * @param data_：覆盖物组件的私有属性集合
 */
export function createComponent(target_, template_, methods_, data_) {
  let DynamicComp = Vue.extend({
    template: template_,
    methods: methods_,
    data() {
      return data_;
    }
  });
  let comp = new DynamicComp().$mount();
  // 加入到指定元素中
  let parent = document.querySelector(target_);
  parent.appendChild(comp.$el);
  return comp.$el;
}
