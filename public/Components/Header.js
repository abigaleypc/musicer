import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { tologinAction, userInfoAction } from '../store/actions';

import { api } from '../config/const';

const { ipcRenderer } = window.require('electron');

import '../style/Header.less'
// 打开新窗口
const BrowserWindow = window.require('electron').remote.BrowserWindow
const path = require('path')
let win

function mapStateToProps(state) {
  const { isLogin } = state.toLoginReducer;
  const { userInfo } = state.userInfoReducer;

  return { isLogin, userInfo };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    tologinAction, userInfoAction
  }, dispatch);
}


class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      avatar: ''
    }
  }
  componentDidMount() {
    fetch(`${api}/user/info`).then(res => res.json()).then(data => {
      if (data && data.basic && data.basic.data) {
        let account_info = data.basic.data.account_info;
        this.props.tologinAction({ isLogin: true });
        this.props.userInfoAction({ userInfo: account_info });
        this.setState({
          userName: account_info.name,
          avatar: account_info.avatar.icon
        })
      }
    }).catch(error => {
      alert(error.errMsg);
    })

  }
  componentWillReceiveProps() {

    // console.log('------------------------------------');
    // console.log(this.props);
    // console.log('------------------------------------');
  }
  login() {
    const modalPath = `file://${window.__dirname}/login.html`;
    win = new BrowserWindow({ width: 300, height: 350, frame: false });

    win.loadURL(modalPath);
    win.show()

  }
  logOut() {
    this.props.tologinAction({ isLogin: false })
  }
  render() {

    ipcRenderer.on('login-event', (event, arg) => {
      this.props.tologinAction({ isLogin: arg.isLogin });
      this.props.userInfoAction({ userInfo: arg.basic });
      this.setState({
        userName: arg.basic.name,
        avatar: arg.basic.avatar.icon
      })
    });

    return (
      <div className='header'>
        <img className='logo' src='https://img3.doubanio.com/dae/staticng/s/bragi/fac999b8062c57ed5308bd24d761678880ebea30/deploy/b6a46d59a094ec51ec67452607965e2c.svg' />
        {
          this.props.isLogin ?
            <div className='userInfo'>
              <img className='avatar' src={this.state.avatar} />
              <div className='userName'>{this.props.userInfo.name} | </div>
              <a className='btn' onClick={this.logOut.bind(this)}>退出</a>
            </div>
            :
            <a className='btn' onClick={this.login.bind(this)}>登录</a>
        }
      </div>
    )
  }
}

const ConnectHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);

export default ConnectHeader;
