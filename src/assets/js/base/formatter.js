/**
 * @name 通用格式化操作
 * @description
 * @author: gongjf
 * @since: 2019年6月24日 11:13:05
 */

/***************************** 时间 ******************************************/

/**
 * 返回指定格式的字符串
 * @param date 
 * @param format 字符串格式，y年，M月，d日，h时，m分，s秒
 */
export function dateFormat(date, format) {
  format = format || "yyyy-MM-dd hh:mm:ss";
  let o = {
    "M+": date.getMonth() + 1, // 月份
    "d+": date.getDate(), // 日
    "h+": date.getHours(), // 小时
    "m+": date.getMinutes(), // 分
    "s+": date.getSeconds(), // 秒
    "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(format))
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return format;
}

/***************************** 路由 ******************************************/

/**
 * 格式化路由
 * @param aMenu
 * @param first
 */
export const formatRoutes = (aMenu, first) => {
  const aRouter = [];

  aMenu.forEach(oMenu => {
    const { path, component, name, icon, children } = oMenu;
    if (!component) {
      const isChild = children.length !== 0;
      const oRouter = {
        path: path,
        component(resolve) {
          // 判断是否为首路由
          if (first) {
            require(["../page/index"], resolve);
            return;
            // 判断是否为多层路由
          } else if (isChild && !first) {
            require(["../page/index/layout"], resolve);
            return;
            // 判断是否为最终的页面视图
          } else {
            require([`../${component}.vue`], resolve);
          }
        },
        name: name,
        icon: icon,
        redirect: (() => {
          if (!isChild && first) return `${path}/index`;
          else return "";
        })(),
        // 处理是否为一级路由
        children: !isChild
          ? (() => {
              if (first) {
                return [
                  {
                    component(resolve) {
                      require([`../${component}.vue`], resolve);
                    },
                    icon: icon,
                    name: name,
                    path: "index"
                  }
                ];
              }
              return [];
            })()
          : (() => {
              return formatRoutes(children, false);
            })()
      };
      aRouter.push(oRouter);
    }
  });

  return aRouter;
};

/***************************** 颜色 ******************************************/

/**
 * RGBA格式转为十六进制格式
 * @param aColor_
 * @return {*}
 */
export function colorHexAlpha(aColor_) {
  if (/^(rgba|RGBA)/.test(aColor_)) {
    let aColor = aColor_.replace(/(?:||rgba|RGBA)*/g, "").Trim();
    aColor = aColor.substring(1, aColor.length - 1).split(",");
    let strHex = "#";
    let alpha = aColor[aColor.length - 1];
    for (let i = 0; i < aColor.length - 1; i++) {
      let hexNum = Number(aColor[i]);
      let hex = hexNum.toString(16);
      if (hexNum < 16) {
        hex = "0" + hex;
      }
      strHex += hex;
    }
    // 转换为不是#号加6位，就返回原字符串
    if (strHex.length !== 7) {
      strHex = aColor;
    }
    return { color: strHex.Trim(), opacity: alpha.Trim() };
  } else {
    return aColor_.Trim();
  }
}

/**
 * 十六进制格式与透明度转为RGBA格式
 * @param sColor
 * @param alpha
 * @return {*}
 */
export function colorRgba(sColor, alpha) {
  const colorReg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  sColor = sColor.toLowerCase().Trim();
  if (sColor && colorReg.test(sColor)) {
    // 将 “#fff”之类的字符串转为“#ffffff”的字符串
    if (sColor.length === 4) {
      let sColorNew = "#";
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //处理六位的颜色值，每次取两位，#号舍弃
    let sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
    }
    // 加入透明度
    sColorChange.push(alpha);
    return "rgba(" + sColorChange.join(",") + ")";
  } else {
    return sColor.Trim();
  }
}
