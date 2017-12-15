/*
 * action 类型
 */

export const CURRENT_PANEL = 'CURRENT_PANEL';
export const LOGIN = 'LOGIN';
export const USER_INFO = 'USER_INFO';

/*
 * action 创建函数
 */

export function tologinAction(payload) {
  return { type: LOGIN, payload }
}

export function userInfoAction(payload) {
  return { type: USER_INFO, payload }
}

export function currentPanelAction(payload) {
  return { type: CURRENT_PANEL, payload }
}
