/**
 * @name 通用状态编码
 * @description
 * @author: gongjf
 * @since: 2019年6月24日 11:13:10
 */

const httpStatus = {
  OK: 200,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  PreconditionFailed: 412,
  InternalServerError: 500,
  ServiceUnavailable: 503,
  GatewayTimeout: 504
};

const serverStatus = {
  OK: 0
}

export default { httpStatus, serverStatus };
