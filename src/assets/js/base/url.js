/**
 * @name url配置
 * @description
 * @author gongjf
 * @since 2019年7月24日 11:12:49
 */

const proxyHosts = [
    // 'http://47.107.32.16/xdap'
]; 

const isPro = process.env.NODE_ENV === 'production';

// 代理前缀，要对上服务器的代理配置
export function getProxyPrefix() {
    // 开发环境
    if(!isPro) {
        return '/backend';
    }
    let host = window.location.host;
    // 线上生产环境
    if(proxyHosts.indexOf(host) > -1) {
        return `http://${host}`;
    }
    // 本地生产环境
    return `http://${host}`;
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
