import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const {shell} = require('electron')

import {api} from '../config/const'
import { loginAction } from '../store/actions'

import moment from 'moment';

import '../style/Login.less'

function mapStateToProps (state) {
  const { isLogin } = state.loginReducer
  return {isLogin}
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loginAction
  }, dispatch)
}

let registerURL = 'https://accounts.douban.com/register'

class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      qrcode: null,
      isNeedVeri: false,
      username:null,
      tip:''
    }
    this.login = this.login.bind(this)
  }

  /**
   * 监视props变化
   * 
   * @param {any} nextProps 
   * @memberof Login
   */
  componentWillReceiveProps (nextProps) {
  }

  goRegister () {
    shell.openExternal(registerURL)
  }
  login () {
    let username = this.username.value;
    let password = this.password.value;
    api
    fetch(`${api}/user/login?username=${username}&password=${password}`,{method:'POST'})
      .then(res=>{
        return res.json();
      })
      .then(res =>{
        if(res.code == 1) {
          this.props.loginAction({isLogin:true})
          // 将有效时间存在内存
          let musicer = JSON.stringify({
            // id:res.
          })
        }else {
          this.setState({
            tip:'登录失败'
          })
        }
      })
   

  }

  render () {
    return (
      <div className='login'>
        <div className='logo'>
          登录
        </div>
        {/* 需要验证码的布局 */}
        {this.state.isNeedVeri && 
        <form className=''>
          <div className='input-item'>
            <i className='fa fa-user' aria-hidden='true'></i>
            <input placeholder='用户名' type='text' ref={(username) => {
              this.username = username;}} />
          </div>
          <div className='input-item'>
            <i className='fa fa-lock' aria-hidden='true'></i>
            <input placeholder='密码' ref='password' />
          </div>
          <div className='input-item verification'>
          </div>
          <div className='input-item'>
            <input placeholder='验证码' />
          </div>
          <a type='button' className='btn'>登录</a>
        </form>}
        {/* 不需要验证码的布局 */}
        {!this.state.isNeedVeri && 
        <form className='no-veri-layout'>
          <div className='input-item'>
            <i className='fa fa-user' aria-hidden='true'></i>
            <input placeholder='用户名' ref={(username) => {
                                                                      this.username = username;}}  />
          </div>
          <div className='input-item'>
            <i className='fa fa-lock' aria-hidden='true'></i>
            <input placeholder='密码' ref={(password) => {
                                                                      this.password = password;}}  />
      </div>
      <a type='button' className='btn' onClick={this.login}>登录</a>
      <a className='register' onClick={this.goRegister}>注册</a>
        <span>{this.state.tip}</span>
                                   </form>}
        
      </div>
    )
  }
}

const connectLogin = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)

export default connectLogin
