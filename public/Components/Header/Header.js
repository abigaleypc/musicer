import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {tologinAction, loginwindowAction } from '../../store/actions';

import Login from './Login'

const { ipcRenderer } = window.require('electron')


function mapStateToProps(state) {
  const { isLogin } = state.toLoginReducer;
  const { loginWindow } = state.loginwindowReducer

  return { isLogin, loginWindow };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    tologinAction, loginwindowAction
  }, dispatch);
}


class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  login() {
    this.props.loginwindowAction({ loginWindow: true })
  }
  render() {
    ipcRenderer.on('login-event', (event, arg) => {
      this.props.tologinAction(arg);
      this.props.loginwindowAction({loginWindow:false})
    })
    return (
      <div style={styles.header}>
        <Login />
        <h4>豆瓣FM</h4>
        <button onClick={this.login.bind(this)}>登录：{this.props.isLogin ? '已登录' : '未登录'}</button>
      </div>
    )
  }
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    height: 50,
    background: '#333'
  }
}

const ConnectHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);

export default ConnectHeader;
