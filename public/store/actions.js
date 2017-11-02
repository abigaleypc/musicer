/*
 * action 类型
 */

export const LOGIN = 'LOGIN';
export const LOGINWINDOW = 'LOGINWINDOW';
export const USER_INFO = 'USER_INFO';

/*
 * action 创建函数
 */

export function tologinAction(payload) {
  return { type: LOGIN, payload }
}

export function loginwindowAction(payload) {
  return { type: LOGINWINDOW, payload }
}


export function userInfoAction(payload) {
  return { type: USER_INFO, payload }
}


