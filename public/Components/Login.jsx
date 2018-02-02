import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const { shell } = require('electron')

import { api } from '../config/const'
import { currentPanelAction, forwardPanelAction, loginAction, userInfoAction } from '../store/actions'

import moment from 'moment'

import { getAccountList } from "../utils/account";

import '../style/Login.less'

import { changePanel } from "./../utils/panel";

function mapStateToProps(state) {
  const { isLogin } = state.loginReducer
  const { currentPanel } = state.currentPanelReducer;
  const { userInfo } = state.userInfoReducer;
  const { forwardPanel } = state.forwardPanelReducer;
  return { currentPanel, isLogin, userInfo, forwardPanel }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    currentPanelAction,
    loginAction,
    userInfoAction,
    forwardPanelAction
  }, dispatch)
}

let registerURL = 'https://accounts.douban.com/register'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      captcha: '',
      isNeedCaptcha: false,
      tip: '',
      captchaImageUrl: './assets/captcha.jpeg',
      captchaId: ''
    }
    this.login = this.login.bind(this)
  }

  componentWillMount() {

  }

  /**
   * 监视props变化
   * 
   * @param {any} nextProps 
   * @memberof Login
   */
  componentWillReceiveProps(nextProps) {

  }

  goRegister() {
    shell.openExternal(registerURL)
  }

  login() {
    let username = this.username.value
    let password = this.password.value
    fetch(`${api}/user/login?username=${username}&password=${password}`, { method: 'POST' })
      .then(res => {
        return res.json()
      })
      .then(res => {
        if (res.code == 1) {
          let data = res.data
          this.props.loginAction({ isLogin: true })
          // 将有效时间存在内存
          let userToken = JSON.stringify({
            id: data.douban_user_id,
            expires_in: moment().add(data.expires_in, 's'),
            token: data.access_token,
            username
          })
          localStorage.setItem(`musicer_${username}_info`, userToken)
        } else {
          this.setState({
            tip: '登录失败'
          })
        }
      })
      .then(() => {
        this.getBasicInfo()
      })
  }

  getBasicInfo() {
    let username = this.username.value;
    let password = this.password.value;
    let captcha = this.captcha && this.captcha.value ? this.captcha.value : '';
    let userToken = JSON.parse(localStorage.getItem(`musicer_${username}_info`))
    fetch(`${api}/user/basic?username=${username}&password=${password}&token=${userToken.token}&solution=${captcha}&id=${this.state.captchaId}`)
      .then(res => res.json())
      .then(res => {
        if (res.code == 1) {
          this.setState({
            isNeedCaptcha: false,
            tip: ''
          })
          let data = Object.assign({}, userToken, res.data)
          localStorage.setItem(`musicer_${username}_info`, JSON.stringify(data))

          this.props.userInfoAction({
            userInfo: data
          })

          //跳转到登录完成界面
          // changePanel()
          let currentPanel = this.props.forwardPanel;
          let forwardPanel = this.props.currentPanel;
          console.log(currentPanel)
          console.log(forwardPanel)
          this.props.currentPanelAction({ currentPanel })
          this.props.forwardPanelAction({ forwardPanel })
          this.props.userInfoAction({
            userInfo: data
          })
        } else if (res.code == -1) {
          this.setState({
            isNeedCaptcha: true,
            tip: '',
            captchaImageUrl: res.data.captcha_image_url,
            captchaId: res.data.captcha_id
          })
          // 需要验证码
          // 返回 
          // {
          //   data:{
          //     "captcha_signature_sample": "17:c,18:6",
          //     "captcha_id": "logiVVJ959yJAzYCf",
          //     "captcha_image_url": "https://acounYCll"
          //   }
          // }
        } else {
          this.setState({
            tip: '登录失败，请重新登录',
            isNeedCaptcha: false,
            password: '',
            captcha: ''
          })
        }
      })
  }

  handleChange(key, event) {
    const { target: { value } } = event;
    this.setState({
      [key]: value
    });
  }

  isExpire(date) {
    let currentDate = new Date()
    // if

  }


  render() {
    return (
      <div className='login'>
        <div className='logo'>
          登录
        </div>
        {/* 需要验证码的布局 */}
        <form className=''>
          <div className='input-item login-top-radius'>
            <i className='fa fa-user' aria-hidden='true'></i>
            {/* <input placeholder='用户名' type='text' ref={(username) => {
                this.username = username;
              }} /> */}
            <input placeholder='用户名' ref={(username) => {
              this.username = username;
            }}
              value={this.state.username}
              onChange={this.handleChange.bind(this, 'username')} />
          </div>
          <div className='input-item'>
            <i className='fa fa-lock' aria-hidden='true'></i>
            <input placeholder='密码' ref={(password) => {
              this.password = password;
            }}
              value={this.state.password}
              onChange={this.handleChange.bind(this, 'password')} />
          </div>
          {/* <div className='input-item verification'>
                                   <img src={this.state.captchaImageUrl}/>
                                   </div> */}

          {this.state.isNeedCaptcha && <div className='input-item  login-bottom-radius ' >
            <img src={this.state.captchaImageUrl} className='img-captcha' />
            {/* <input placeholder='' className='input-captcha'
              ref={(captcha) => { this.captcha = captcha }}
              value={this.state.captcha} /> */}
            <input placeholder='' className='input-captcha' ref={(captcha) => {
              this.captcha = captcha;
            }}
              value={this.state.captcha}
              onChange={this.handleChange.bind(this, 'captcha')} />
          </div>}
        </form>
        <div className='login-bottom-block '>
          <a type='button' className='btn center' onClick={this.login}>登录</a>
          <a className='register' onClick={this.goRegister}>注册</a>
          <span>{this.state.tip}</span>
        </div>
      </div>
    )
  }
}

const connectLogin = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)

export default connectLogin
