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
  console.log('----------changePanel---------------');
  console.log('currentPanel:  '+currentPanel);
  console.log('forwardPanel:  '+forwardPanel);
  console.log('------------------------------------');
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
