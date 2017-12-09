import { combineReducers, createRenderer } from 'redux'
import { LOGIN, USER_INFO, CURRENT_PANEL } from './actions'


function toLoginReducer(state = { isLogin: false }, action) {
  const { type, payload } = action;
  let nextState = Object.assign({}, state);
  if (type === LOGIN) {
    nextState.isLogin = payload.isLogin;
  }
  return nextState;
}


function userInfoReducer(state = { userInfo: {} }, action) {
  const { type, payload } = action;
  let nextState = state;
  if (type == USER_INFO) {
    nextState.userInfo = payload.userInfo;
  }
  return nextState;
}

function currentPanelReaducer(state = { currentPanel: 'main' }, action) {
  const { type, payload } = action;
  let nextState = state;
  if (type == CURRENT_PANEL) {
    nextState.currentPanel = payload.currentPanel;
  }
}

const doubanFmReducers = combineReducers({
  toLoginReducer,
  userInfoReducer,
  currentPanelReaducer
})


export default doubanFmReducers;
