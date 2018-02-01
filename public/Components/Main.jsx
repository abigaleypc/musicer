import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment'

import { currentPanelAction, forwardPanelAction, loginAction, userInfoAction } from '../store/actions'
import Home from './Home.jsx';

import { getAccountList } from "../utils/account";

function mapStateToProps(state) {
  const { isLogin } = state.loginReducer
  const { currentPanel } = state.currentPanelReducer;
  const { userInfo } = state.userInfoReducer;
  const { forwardPanel } = state.forwardPanelReducer;
  return { currentPanel, forwardPanel, isLogin, userInfo };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    currentPanelAction,
    loginAction,
    userInfoAction,
    forwardPanelAction
  }, dispatch)
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentWillMount() {
    let accountList = getAccountList()
    if (accountList.length > 0) {
      // 判断是否过了有效期
      let data = JSON.parse(localStorage.getItem(accountList[0]))
      let isExpire = moment().isBefore(data.expires_in)
      if (isExpire) {
        this.props.loginAction({
          isLogin: true
        })
        this.props.userInfoAction({
          userInfo: data
        })
      } else {
        this.props.loginAction({
          isLogin: false
        })
      }
    } else {
      this.props.loginAction({
        isLogin: false
      })
    }

    this.props.currentPanelAction({
      currentPanel: 'main'
    })
  }

  render() {
    return (
      <div>
        <Home />
      </div>
    )
  }
}

const connectMain = connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);

export default connectMain;
