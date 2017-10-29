/*
 * action 类型
 */

export const LOGIN = 'LOGIN';
export const USER_NAME = 'USER_NAME';
export const MUSIC_LIST = 'MUSIC_LIST';

/*
 * action 创建函数
 */

export function tologinAction(payload) {
  return { type: LOGIN, payload }
}

export function addMusic(music) {
  return { type: MUSIC_LIST, music }
}
