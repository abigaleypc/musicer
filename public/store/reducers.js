import { combineReducers, createRenderer } from 'redux'
import { LOGIN, LOGINWINDOW, USER_INFO } from './actions'


function toLoginReducer(state = { isLogin: false }, action) {
  const { type, payload } = action;
  let nextState = Object.assign({}, state);
  if (type === LOGIN) {
    nextState.isLogin = payload.isLogin;
  }
  return nextState;
}

function loginwindowReducer(state = { loginWindow: false }, action) {
  const { type, payload } = action;
  let nextState = Object.assign({}, state);
  if (type === LOGINWINDOW) {
    nextState.loginWindow = payload.loginWindow;
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

const doubanFmReducers = combineReducers({
  toLoginReducer,
  loginwindowReducer,
  userInfoReducer
})


export default doubanFmReducers;
