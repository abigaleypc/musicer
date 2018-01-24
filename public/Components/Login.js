import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {  } from '../store/actions'

import '../style/Login.less';
const QRCode = require('qrcode');

function mapStateToProps(state) {
  const { sid, ssid, picture, title } = state.songInfoReducer.songInfo;
  return { sid, ssid, picture, title };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qrcode: null,
      isNeedVeri:false
    }
  }

  componentWillReceiveProps(nextProps) {
  
  }

  render() {

    return (
      <div className="login">
        <div className="logo">登录</div>
        {/* 需要验证码的布局 */}
        {this.state.isNeedVeri && <form className="">
          <div className="input-item">
            <i className="fa fa-user" aria-hidden="true"></i>
            <input placeholder="用户名"/>
          </div>
          <div className="input-item">
            <i className="fa fa-lock" aria-hidden="true"></i>
            <input placeholder="密码" />
          </div>
          <div className="input-item verification">
            
          </div>
          <div className="input-item">
            <input placeholder="验证码" />
          </div>
          <a type="button" className="btn">登录</a>
        </form>}
        {/* 不需要验证码的布局 */}
        {!this.state.isNeedVeri &&<form className="no-veri-layout">
          <div className="input-item">
            <i className="fa fa-user" aria-hidden="true"></i>
            <input placeholder="用户名"/>
          </div>
          <div className="input-item">
            <i className="fa fa-lock" aria-hidden="true"></i>
            <input placeholder="密码" />
          </div>
          <a type="button" className="btn">登录</a>

        <div className="register">注册</div>
        </form>}
      </div>
    )
  }
}

const connectLogin = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

export default connectLogin;
