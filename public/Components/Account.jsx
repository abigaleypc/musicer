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
    console.log(this.props);
  }

  componentDidUpdate() {}

  logout() {
    this.props.loginAction({ isLogin: false });

    this.props.userInfoAction({
      userInfo: {}
    });

    let { username } = this.props.userInfo;
    let key = `musicer_${username}_info`;
    localStorage.removeItem(key);

    // changePanel()
    let currentPanel = this.props.forwardPanel;
    let forwardPanel = this.props.currentPanel;
    this.props.currentPanelAction({ currentPanel });
    this.props.forwardPanelAction({ forwardPanel });
  }

  render() {
    let _userInfo = {
      avatar: {
        icon: "https://img3.doubanio.com/icon/ui168889042-1.jpg",
        large: "https://img3.doubanio.com/icon/ul168889042-1.jpg",
        median: "https://img3.doubanio.com/icon/us168889042-1.jpg",
        medium: "https://img3.doubanio.com/icon/up168889042-1.jpg",
        raw: "https://img3.doubanio.com/icon/ur168889042-1.jpg",
        small: "https://img3.doubanio.com/icon/u168889042-1.jpg"
      },
      expires_in: "2018-06-17T08:32:07.323Z",
      id: "168889042",
      name: "abigaleyu",
      token: "376b2bcb9ab737cca6418362d025a764",
      uid: "168889042",
      username: "13798994068"
    };
    console.log(this.props);
    return (
      <div>
        <div className="account_warpper">
          <img src={_userInfo.avatar.medium} alt="" className="avatar" />
          <div className="username">{this.props.userInfo.name}</div>
          <a onClick={this.logout} className="logout">
            退出登录
          </a>
        </div>
      </div>
    );
  }
}

const connectAccount = connect(mapStateToProps, mapDispatchToProps)(Account);

export default connectAccount;
