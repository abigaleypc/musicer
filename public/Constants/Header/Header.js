import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { LOGIN, tologinAction } from '../../store/actions';

const { ipcRenderer } = window.require('electron')


function mapStateToProps(state) {
  const { isLogin } = state.toLoginReducer;
  return { isLogin };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    tologinAction
  }, dispatch);
}

// const { app } = window.require('electron').remote;
const BrowserWindow = window.require('electron').remote.BrowserWindow
const path = require('path')

const manageWindowBtn = document.getElementById('manage-window')
let win

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  loginWindow() {

    const modalPath = path.join('file://', __dirname, '/Users/yuabigale/Documents/Codes/bitbucket/douban.fm/public/loginWindow.html')

    win = new BrowserWindow({ width: 400, height: 275 })
    win.on('close', function () { win = null })
    win.loadURL(modalPath)
    win.show()
  }

  render() {
    ipcRenderer.on('login-event', (event, arg) => {
      this.props.tologinAction(arg)
    })
    return (
      <div style={styles.header}>
        <h4>豆瓣FM</h4>
        <button onClick={this.loginWindow.bind(this)}>登录：{this.props.isLogin ? '已登录' : '未登录'}</button>
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
