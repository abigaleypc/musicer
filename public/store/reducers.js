import { combineReducers ,createRenderer} from 'redux'
import { LOGIN, LOGINWINDOW } from './actions'


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

function addMusic(state = {}, music) {
  state = music;
  return state;
}

const doubanFmReducers = combineReducers({
  toLoginReducer,
  loginwindowReducer
})


export default doubanFmReducers;
