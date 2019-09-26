/**
 * @name 通用状态编码
 * @description
 * @author: gongjf
 * @since: 2019年6月24日 11:13:10
 */

const HTTP_STATUS = {
  OK: 200,
  NO_AUTH: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONDITION_INVALID: 412,
  SERVER_ERROR: 500,
  SERVER_INVALID: 503,
  REQUEST_TIMEOUT: 504
};

const SERVER_STATUS = {
  OK: 0
}

export default { HTTP_STATUS, SERVER_STATUS };
