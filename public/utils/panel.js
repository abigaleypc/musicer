import { createStore } from 'redux'
import reducer from '../store/reducers'
let store = createStore(reducer)
let state = store.getState()

import { currentPanelAction, forwardPanelAction } from '../store/actions'

store.dispatch({
  type: 'LOGIN',
  payload: {isLogin: true}
})

export function changePanel () {
  let { currentPanel } = state.currentPanelReducer
  let { forwardPanel } = state.forwardPanelReducer
debugger
  currentPanelAction({
    currentPanel: forwardPanel
  })
  forwardPanelAction({
    forwardPanel: currentPanel
  })
  // store.dispatch({
  //   type: 'CURRENT_PANEL',
  //   payload: {currentPanel: forwardPanel}
  // })

  // store.dispatch({
  //   type: 'FORWARD_PANEL',
  //   payload: {forwardPanel: currentPanel}
  // })
}
