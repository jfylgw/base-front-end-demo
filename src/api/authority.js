/**
 * @name 认证接口
 * @description
 * @author gongjf
 * @since 2019年7月9日 10:25:42
 */

import request from "assets/js/base/request";
import Status from "assets/js/base/status";
import {getProxyPrefix} from 'assets/js/base/url';

// 模块前缀
const modulePrefix = `${getProxyPrefix()}/entry`;

const signInUrl = `${modulePrefix}/login`;
const signOutUrl = `${modulePrefix}/logout`;
const signUpUrl = `${modulePrefix}/register`;
const modifyPassUrl = `${modulePrefix}/modifyPass`;

/**
 * 登入
 */
export async function signIn(data) {
  if (!data) return Status.httpStatus.PreconditionFailed;
  return await request.put(signInUrl, data);
}

/**
 * 登出
 */
export async function signOut() {
  await request.delete(signOutUrl);
}

/**
 * 注册
 */
export async function signUp(data) {
  if (!data) return Status.httpStatus.PreconditionFailed;
  return await request.post(signUpUrl, data);
}

/**
 * 修改密码
 */
export async function modifyPass(data) {
  if (!data) return Status.httpStatus.PreconditionFailed;
  return await request.post(modifyPassUrl, data);
}
