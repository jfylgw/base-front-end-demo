/**
 * @name url配置
 * @description
 * @author gongjf
 * @since 2019年7月24日 11:12:49
 */

// 代理前缀，要对上服务器的代理配置
export function getProxyPrefix() {
    let host = window.location.host;
    // 线上环境
    if(host === 'agis.xair.cn:8080') {
        return '/backend';
    }
    return '';
}

// 开放的API接口
export const openApis = {

};

// 需要验证的API接口
export const authApis = {

}

// 开放的页面路由
export const openRoutes = {

};

// 需要验证的页面路由
export const authRoutes = {

}
