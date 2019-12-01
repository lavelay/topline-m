import request from '@/utils/request.js'
/**
 *
 * @param {object} data - 登陆用户信息(mobile,code)
 */
export const login = data => {
  return request('app/v1_0/authorizations', 'post', data)
}
