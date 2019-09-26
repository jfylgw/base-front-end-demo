/**
 * @name 帐户接口
 * @description
 * @author gongjf
 * @since 2019年7月10日 10:25:42
 */

import request from "assets/js/base/request";
import Status from "api/base/status";
import {getProxyPrefix} from 'api/base/url';

// 模块前缀
const modulePrefix = `${getProxyPrefix()}/user`;

const saveUrl = `${modulePrefix}/`;
const removeUrl = `${modulePrefix}/`;
const detailUrl = `${modulePrefix}/`;
const findOneUrl = `${modulePrefix}/findOne`;
const findOneWithSortUrl = `${modulePrefix}/findOneWithSort`;
const listUrl = `${modulePrefix}/list`;
const pageUrl = `${modulePrefix}/page`;
const countUrl = `${modulePrefix}/count`;

/**
 * 保存用户信息
 */
export async function save(data) {
    if (!data) return Status.HTTP_STATUS.CONDITION_INVALID;
    return await request.post(saveUrl, data);
}

/**
 * 根据ID删除用户信息
 */
export async function remove(id) {
    if (!id) return Status.HTTP_STATUS.CONDITION_INVALID;
    return await request.delete(`${removeUrl}${id}`);
}

/**
 * 根据ID获取用户信息
 */
export async function detail(id) {
    if (!id) return Status.HTTP_STATUS.CONDITION_INVALID;
    return await request.get(`${detailUrl}${id}`);
}

/**
 * 获取用户信息
 */
export async function findOne(data) {
    if (!data) return Status.HTTP_STATUS.CONDITION_INVALID;
    return await request.put(findOneUrl, data);
}

/**
 * 获取用户信息（带排序参数）
 */
export async function findOneWithSort(data) {
    if (!data) return Status.HTTP_STATUS.CONDITION_INVALID;
    return await request.put(findOneWithSortUrl, data);
}

/**
 * 获取用户列表
 */
export async function list(data) {
    if (!data) return Status.HTTP_STATUS.CONDITION_INVALID;
    return await request.put(listUrl, data);
}

/**
 * 获取用户分页列表
 */
export async function page(data) {
    if (!data) return Status.HTTP_STATUS.CONDITION_INVALID;
    return await request.put(pageUrl, data);
}

/**
 * 获取用户计数
 */
export async function count(data) {
    if (!data) return Status.HTTP_STATUS.CONDITION_INVALID;
    return await request.put(countUrl, data);
}
