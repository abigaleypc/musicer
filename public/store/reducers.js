import { combineReducers } from 'redux'
import { LOGIN } from './actions'


function toLoginReducer(state = {isLogin: false}, action) {
  const {type, payload} = action;
  let nextState = Object.assign({}, state);
  if (type === LOGIN) {
    nextState.isLogin = payload.isLogin;
  }
  return nextState;
}

function addMusic(state = {}, music) {
  state = music;
  return state;
}

const doubanFmReducers = combineReducers({
  toLoginReducer
})

export default doubanFmReducers;
