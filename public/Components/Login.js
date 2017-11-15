import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { loginWindow, loginwindowAction } from '../store/actions'

const { ipcRenderer } = window.require('electron');



const BrowserWindow = window.require('electron').remote.BrowserWindow
const path = require('path')
let win


function mapStateToProps(state) {
  const { loginWindow } = state.loginwindowReducer;
  return { loginWindow }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loginwindowAction, loginwindowAction }, dispatch)
}

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  openWindow() {

    const modalPath = path.join('file://', __dirname, '/Users/yuabigale/Documents/Codes/bitbucket/douban.fm/public/loginWindow.html')
    win = new BrowserWindow({ width: 300, height: 350,frame:false});

    win.loadURL(modalPath);
    win.show()
  }

  closeWindow() {
    win.hide();
  }

  render() {
    this.props.loginWindow && this.openWindow();
    win && !this.props.loginWindow && this.closeWindow();
    return (
      <div>
      </div>
    )
  }
}

const connectLogin = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)

export default connectLogin;



