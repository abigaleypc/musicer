import React from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from 'redux'



import { loginAction, userInfoAction, currentPanelAction, forwardPanelAction } from '../store/actions'

import { changePanel } from "./../utils/panel";

function mapStateToProps(state) {
  const { isLogin } = state.loginReducer;
  const { userInfo } = state.userInfoReducer;
  const { currentPanel } = state.currentPanelReducer;
  const { forwardPanel } = state.forwardPanelReducer;
  return { isLogin, userInfo, currentPanel, forwardPanel }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loginAction,
    userInfoAction,
    currentPanelAction,
    forwardPanelAction
  }, dispatch)
}



class Account extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.logout = this.logout.bind(this)
  }
  componentWillMount() {
    this.props.userInfo.name
    debugger
    console.log(this.props)
  }

  componentWillMount() {

  }

  componentDidUpdate() {

  }

  logout() {
    this.props.loginAction({ isLogin: false })

    this.props.userInfoAction({
      userInfo: {}
    })

    let { username } = this.props.userInfo
    let key = `musicer_${username}_info`
    localStorage.removeItem(key)

    // changePanel()
    let currentPanel = this.props.forwardPanel;
    let forwardPanel = this.props.currentPanel;
    this.props.currentPanelAction({ currentPanel })
    this.props.forwardPanelAction({ forwardPanel })



  }

  render() {
    return (
      <div>Account
        {this.props.userInfo.name}
        <a onClick={this.logout}>退出登录</a>
      </div>
    )
  }

}

const connectAccount = connect(
  mapStateToProps,
  mapDispatchToProps
)(Account)

export default connectAccount;
