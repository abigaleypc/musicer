import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const { shell } = require('electron')

import { api } from '../config/const'
import { loginAction } from '../store/actions'

import moment from 'moment'

import '../style/Login.less'

function mapStateToProps(state) {
  const { isLogin } = state.loginReducer
  return { isLogin }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loginAction
  }, dispatch)
}

let registerURL = 'https://accounts.douban.com/register'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      qrcode: null,
      isNeedVeri: false,
      username: null,
      tip: '',
      captchaImageUrl: './assets/captcha.jpeg'
    }
    this.login = this.login.bind(this)
  }

  /**
   * 监视props变化
   * 
   * @param {any} nextProps 
   * @memberof Login
   */
  componentWillReceiveProps(nextProps) { }

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
            token: data.access_token
          })
          localStorage.setItem(`musicer_${username}_info`, JSON.stringify(userToken))
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
    // http://localhost:8082/user/basic?username=13798994068&password=1234567890ypc&token=9c4af15ec3df22e3d4e0d41c4b9d68a9
    let userToken = JSON.parse(localStorage.getItem(`musicer_${username}_info`))
    fetch(`${api}/user/basic?username=${username}&password=${password}&token=${userToken.token}`)
      .then(res => {
        return res.json()
      })
      .then(res => {
        console.log('------------------------------------');
        console.log(res);
        console.log('------------------------------------');
        if (res.code == 1) {
          this.setState({
            isNeedVeri: false
          })
          let data = Object.assign({}, userToken, res.data)
          localStorage.setItem(`musicer_${username}_info`, JSON.stringify(data))

        } else if (res.code == -1) {
          this.setState({
            isNeedVeri: true,
            captchaImageUrl: res.data.captcha_image_url
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

        }
      })
  }

  render() {
    return (
      <div className='login'>
        <div className='logo'>
          登录
        </div>
        {/* 需要验证码的布局 */}
        {this.state.isNeedVeri &&
          <form className=''>
            <div className='input-item login-top-radius'>
              <i className='fa fa-user' aria-hidden='true'></i>
              {/* <input placeholder='用户名' type='text' ref={(username) => {
                this.username = username;
              }} /> */}
              <input placeholder='用户名' ref={(username) => {
                this.username = username;
              }} />
            </div>
            <div className='input-item'>
              <i className='fa fa-lock' aria-hidden='true'></i>
              <input placeholder='密码' ref='password' />
            </div>
            {/* <div className='input-item verification'>
                                   <img src={this.state.captchaImageUrl}/>
                                   </div> */}

            <div className='input-item  login-bottom-radius ' >
              <img src={this.state.captchaImageUrl} className='img-verification' />
              <input placeholder='验证码' className='input-verification' />
            </div>
          </form>}
        {/* 不需要验证码的布局 */}
        {!this.state.isNeedVeri &&
          <form className='no-veri-layout'>
            <div className='input-item login-top-radius'>
              <i className='fa fa-user' aria-hidden='true'></i>
              <input placeholder='用户名' ref={(username) => {
                this.username = username;
              }} />
            </div>
            <div className='input-item  login-bottom-radius'>
              <i className='fa fa-lock' aria-hidden='true'></i>
              <input placeholder='密码' ref={(password) => {
                this.password = password;
              }} />
            </div>
          </form>
        }
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
