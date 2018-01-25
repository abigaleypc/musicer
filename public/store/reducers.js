import { combineReducers, createRenderer } from 'redux'
import { LOGIN, USER_INFO, SONG_INFO, CURRENT_PANEL, FORWARD_PANEL, IS_PLAY, IS_LIKE, LYRIC_TYPE, LYRIC_LIST, LYRIC_TIME_LIST, CURRENT_TIME } from './actions'
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';


function loginReducer(state = { isLogin: false }, action) {
  const { type, payload } = action;
  let nextState = Object.assign({}, state);
  if (type === LOGIN) {
    nextState.isLogin = payload.isLogin;
  }
  return nextState;
}


function userInfoReducer(state = { userInfo: {} }, action) {
  const { type, payload } = action;
  let nextState = Object.assign({}, state);
  if (type == USER_INFO) {
    nextState.userInfo = payload.userInfo;
  }
  return nextState;
}

function songInfoReducer(state = { songInfo: {} }, action) {
  const { type, payload } = action;
  let nextState = Object.assign({}, state);
  if (type == SONG_INFO) {
    nextState.songInfo = payload.songInfo;
  }
  return nextState;
}

function currentPanelReducer(state = { currentPanel: 'login' }, action) {
  const { type, payload } = action;
  let nextState = Object.assign({}, state);
  if (type == CURRENT_PANEL) {
    nextState.currentPanel = payload.currentPanel;
  }
  return nextState;
}

function forwardPanelReducer(state = { forwardPanel: null }, action) {
  const { type, payload } = action;
  let nextState = Object.assign({}, state);
  if (type == FORWARD_PANEL) {
    nextState.forwardPanel = payload.forwardPanel;
  }
  return nextState;
}

function isPlayReducer(state = { isPlay: true }, action) {
  const { type, payload } = action;
  let nextState = Object.assign({}, state);
  if (type == IS_PLAY) {
    nextState.isPlay = payload.isPlay;
  }
  return nextState;
}

function isLikeReducer(state = { isLike: false }, action) {
  const { type, payload } = action;
  let nextState = Object.assign({}, state);
  if (type == IS_LIKE) {
    nextState.isLike = payload.isLike;
  }
  return nextState;
}


/**
 * 是否点赞
 * @param {*} state //null:暂无歌词， noTime:不支持滚动   normal
 */
function lyricTypeReducer(state = { lyricType: null }, action) {
  const { type, payload } = action;
  let nextState = Object.assign({}, state);
  if (type == LYRIC_TYPE) {
    nextState.lyricType = payload.lyricType;
  }
  return nextState;
}

function lyricListReducer(state = { lyricList: [] }, action) {
  const { type, payload } = action;
  let nextState = Object.assign({}, state);
  if (type == LYRIC_LIST) {
    nextState.lyricList = payload.lyricList;
  }
  return nextState;
}

function lyricTimeListReducer(state = { lyricTimeList: [] }, action) {
  const { type, payload } = action;
  let nextState = Object.assign({}, state);
  if (type == LYRIC_TIME_LIST) {
    nextState.lyricTimeList = payload.lyricTimeList;
  }
  return nextState;
}

function currentTimeReducer(state = { currentTime: 0 }, action) {
  const { type, payload } = action;
  let nextState = Object.assign({}, state);
  if (type == CURRENT_TIME) {
    nextState.currentTime = payload.currentTime;
  }
  return nextState;
}

const doubanFmReducers = combineReducers({
  loginReducer,
  userInfoReducer,
  songInfoReducer,
  currentPanelReducer,
  forwardPanelReducer,
  forwardPanelReducer,
  isPlayReducer,
  isLikeReducer,
  lyricTypeReducer,
  lyricListReducer,
  lyricTimeListReducer,
  currentTimeReducer
})


export default doubanFmReducers;
