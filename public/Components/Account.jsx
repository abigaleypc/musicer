import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  loginAction,
  userInfoAction,
  currentPanelAction,
  forwardPanelAction
} from "../store/actions";

import { changePanel } from "./../utils/panel";

import "../style/Account.less";

function mapStateToProps(state) {
  const { isLogin } = state.loginReducer;
  const { userInfo } = state.userInfoReducer;
  const { currentPanel } = state.currentPanelReducer;
  const { forwardPanel } = state.forwardPanelReducer;
  return { isLogin, userInfo, currentPanel, forwardPanel };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loginAction,
      userInfoAction,
      currentPanelAction,
      forwardPanelAction
    },
    dispatch
  );
}

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.logout = this.logout.bind(this);
  }
  componentWillMount() {
    this.props.userInfo.name;
  }

  componentDidUpdate() { }

  logout() {
    this.props.loginAction({ isLogin: false });

    this.props.userInfoAction({
      userInfo: {}
    });

    let { username } = this.props.userInfo;
    let key = `musicer_info_${username}`;
    localStorage.removeItem(key);

    // changePanel()
    let currentPanel = this.props.forwardPanel;
    let forwardPanel = this.props.currentPanel;
    this.props.currentPanelAction({ currentPanel });
    this.props.forwardPanelAction({ forwardPanel });
  }

  render() {

    if (Object.keys(this.props.userInfo).length > 0) {
      let { name, avatar: { medium: avatar } } = this.props.userInfo;

      return (
        <div>
          {this.props.userInfo &&
            <div className="account_warpper">
              <img src={avatar} alt="" className="avatar" />
              <div className="username">{name}</div>
              <a onClick={this.logout} className="logout">
                退出登录
          </a>
            </div>
          }
        </div>
      );
    } else {
      return <div>无消息</div>
    }
  }
}

const connectAccount = connect(mapStateToProps, mapDispatchToProps)(Account);

export default connectAccount;
