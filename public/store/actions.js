/*
 * action 类型
 */

export const LOGIN = 'LOGIN';
export const USER_INFO = 'USER_INFO';
export const SONG_INFO = 'SONG_INFO';
export const CURRENT_PANEL = 'CURRENT_PANEL';
export const FORWARD_PANEL = 'FORWARD_PANEL';
export const IS_PLAY = 'IS_PLAY';
export const IS_LIKE = 'IS_LIKE';
export const LYRIC_TYPE = 'LYRIC_TYPE';
export const LYRIC_LIST = 'LYRIC_LIST';
export const LYRIC_TIME_LIST = 'LYRIC_TIME_LIST';
export const CURRENT_TIME = 'CURRENT_TIME';

/*
 * action 创建函数
 */

export function tologinAction(payload) {
  return { type: LOGIN, payload }
}

export function userInfoAction(payload) {
  return { type: USER_INFO, payload }
}

export function songInfoAction(payload) {
  return { type: SONG_INFO, payload }
}

export function currentPanelAction(payload) {
  return { type: CURRENT_PANEL, payload }
}

export function forwardPanelAction(payload) {
  return { type: FORWARD_PANEL, payload }
}

export function isPlayAction(payload) {
  return { type: IS_PLAY, payload }
}

export function isLikeAction(payload) {
  return { type: IS_LIKE, payload }
}

export function lyricTypeAction(payload) {
  return { type: LYRIC_TYPE, payload }
}


export function lyricListAction(payload) {
  return { type: LYRIC_LIST, payload }
}

export function lyricTimeListAction(payload) {
  return { type: LYRIC_TIME_LIST, payload }
}

export function currentTimeAction(payload) {
  return { type: CURRENT_TIME, payload }
}
