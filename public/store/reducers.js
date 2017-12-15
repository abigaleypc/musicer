import { combineReducers, } from 'redux'
import { LOGIN, USER_INFO, CURRENT_PANEL } from './actions'


function currentPanelReducer(state = {
  currentPanel: {
    str: 'LOGIN',
    title: '登录'
  }
}, action) {
  const { type, payload } = action;
  let nextState = Object.assign({}, state);
  if (type == CURRENT_PANEL) {
    nextState.currentPanel = payload.currentPanel;
  }
  return nextState;
}

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
  let nextState = Object.assign({}, state);
  if (type == USER_INFO) {
    nextState.userInfo = payload.userInfo;
  }
  return nextState;
}


const doubanFmReducers = combineReducers({
  currentPanelReducer,
  toLoginReducer,
  userInfoReducer
})


export default doubanFmReducers;
