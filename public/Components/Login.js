import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import { api, MUSICER } from '../config/const';
import { userInfoAction, currentPanelAction } from '../store/actions'

import request from 'request'
import { REQUEST_CONTENT } from '../config/data'

import moment from 'moment';


import '../style/style.less'

function mapStateToProps(state) {
  const { currentPanel } = state.currentPanelReducer;
  const { userInfo } = state.userInfoReducer;
  return { currentPanel, userInfo };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    userInfoAction, currentPanelAction
  }, dispatch)

}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: REQUEST_CONTENT,
      url: null,
      method: null,
      params: null,
      captcha: null,
      tips: null,
      captchaRequire: false,
      captchaImageUrl: null,
      captchaId: null
    };
    this.urlChange = this.urlChange.bind(this);
    this.methodChange = this.methodChange.bind(this);
    this.paramsChange = this.paramsChange.bind(this);
    this.getCookie = this.getCookie.bind(this);
    this.login = this.login.bind(this);
    this.loginByToken = this.loginByToken.bind(this);
    this.captchaChange = this.captchaChange.bind(this);
    this.loginWithCaptcha = this.loginWithCaptcha.bind(this);
    this.getBasic = this.getBasic.bind(this);
    this.initLogin = this.initLogin.bind(this);
  }

  componentWillMount() {
    let { url, params, method } = this.state.data[this.props.currentPanel.str];
    // this.clearCookie()
    this.setState({
      params, url, method
    })
    // this.login(url, params, method)
    this.login()
  }

  urlChange(e) {
    this.setState({
      url: e.target.value
    })
  }
  methodChange(e) {
    this.setState({
      method: e.target.value
    })
  }
  paramsChange(e) {
    this.setState({
      params: e.target.value
    })
  }

  captchaChange(e) {
    this.setState({
      captcha: e.target.value
    })
  }

  renderPanel() {
    let { url, params, method } = this.state;
    return (
      <div>
        <h3>🌸 {this.props.currentPanel.title}</h3>
        <div className="form-group">
          <label >URL</label>
          <input className="form-control" defaultValue={url} onChange={this.urlChange} />
          {/* {this.urlInput.value} */}
        </div>

        <div className="form-group">
          <label>method</label>
          <input className="form-control" defaultValue={method} onChange={this.methodChange} />
        </div>

        <div className="form-group">
          <label>Params</label>
          <textarea className="form-control" defaultValue={JSON.stringify(params)} onChange={this.paramsChange} />
        </div>

        {this.state.captchaRequire && <div className="form-group">
          <label>验证码</label>
          <input className="form-control" onChange={this.captchaChange} />
        </div>}

        <button className="btn btn-primary" onClick={this.login.bind(this, this.state.url, this.state.params, this.state.method)}>请求</button>
        <button className="btn btn-primary" onClick={this.clearCookie.bind(this, 'btn')}>清理登录信息</button>


        {this.state.captchaRequire && <img src={this.state.captchaImageUrl} />}
      </div>
    )
  }

  getCookie() {
    let musicer = localStorage.getItem(MUSICER);
    if (musicer) {
      this.setState({
        tips: '非初次登录'
      })
      return musicer;
    } else {
      this.setState({
        tips: '初次登录'
      })
      return false;
    }
  }
  // login(uri, params, method) {
  //   let cookie = this.getCookie();
  //   params = JSON.parse(params);
  //   // 第一次登录：无token
  //   if (!cookie) {
  //     request.post(uri, {
  //       json: true,
  //       qs: params
  //     }).on('error', err => {
  //       // res.status(500).end(err);
  //     }).on('data', data => {
  //       try {
  //         data = JSON.parse(data);
  //         this.setState({
  //           result: JSON.stringify(data, undefined, '\t')
  //         })
  //         if (data.code == 1) {
  //           localStorage.setItem('musicer', JSON.stringify({
  //             id: data.account_info.id,
  //             expires_in: moment().add(data.expires_in, 's'),
  //             token: data.token
  //           }));
  //           // console.log(moment(curtime).isBefore(time));
  //         } 

  //       } catch (err) {
  //         this.setState({
  //           result: err
  //         })

  //       }
  //     })
  //   } else {
  //     let _cookie = JSON.parse(cookie);
  //     let currentDate = moment();
  //     let expiresDate = _cookie.expires_in;
  //     // cookie未过期
  //     if (moment(currentDate).isBefore(expiresDate)) {
  //       this.loginByToken(_cookie.id, _cookie.token)
  //     } else {
  //       // 过期

  //     }
  //   }
  // }

  login() {
    let cookie = this.getCookie();
    if (cookie) {
      cookie = JSON.parse(cookie);
      let currentDate = moment();
      let expiresDate = cookie.expires_in;
      if (moment(currentDate).isBefore(expiresDate)) {
        this.loginByToken();
      }
      else {
        this.initLogin();
      }
    } else {
      this.initLogin();
    }

  }
  loginByToken(id) {
    let cookie = JSON.parse(this.getCookie());
    let { url } = this.state.data['LOGINBYTOKEN'];
    request.get(url, {
      json: true,
      qs: {
        id,
        token: cookie.token
      }
    }).on('data', data => {
      let _data = JSON.parse(data);
      if (data.code == 0) {
        this.setState({
          result: JSON.stringify(_data, undefined, '\t')
        })
      } else {
        this.setState({
          tips: '采用token登录失败，清楚缓存，重新登录'
        })
        this.clearCookie('loginByToken event');
        this.login(this.state.url, this.state.params, this.state.method);


      }
    })
  }
  initLogin(params, method) {
    let uri = this.state.data[this.props.currentPanel.str].url;
    
    let _params = Object.assign({}, params, {
      captcha_id: this.state.captcha_id,
      captcha_solution: this.state.captcha
    })
    let _method = method.toLowerCase();

    if (!cookie) {
      this.setState({
        tips: '首次登录'
      })
      request[_method](uri, {
        json: true,
        qs: _params
      }).on('error', err => {
        // res.status(500).end(err);
      }).on('data', data => {
        try {
          data = JSON.parse(data);
          this.setState({
            result: JSON.stringify(data, undefined, '\t')
          })
          // 请求成功时localStorage存下信息
          if (data.code === 1) {
            let res = data.data
            let _musicer = JSON.stringify({
              id: res.douban_user_id,//data.account_info.id,
              expires_in: moment().add(res.expires_in, 's'),
              token: res.refresh_token//data.token
            })
            localStorage.setItem(MUSICER, _musicer);
            // 根据token登录获取基本信息
            // this.loginByToken(res.douban_user_id);
            this.getBasic()
            // 请求完成后清除验证码
            this.setState({
              captchaRequire: false,
              captchaImageUrl: null,
              captcha: null,
              captchaId: null
            })
          }
          // 当需要验证码时
          if (data.code === -2) {
            //验证码
            this.setState({
              captchaRequire: true,
              captchaImageUrl: data.payload.captcha_image_url,
              captchaId: data.payload.captcha_id
            })
          } else {
            console.log('------------------------------------');
            console.log(data);
            console.log('------------------------------------');
          }

        } catch (err) {
          this.setState({
            result: err.toString()
          })
        }
      })
    } else {
      let _cookie = JSON.parse(cookie);
      let currentDate = moment();
      let expiresDate = _cookie.expires_in;
      // cookie未过期


      if (moment(currentDate).isBefore(expiresDate)) {
        this.setState({
          tips: '采用token登录：cookie未过期'
        })
        this.loginByToken(_cookie.id);

      } else {
        this.setState({
          tips: '采用token登录：cookie过期,重新登录'
        })
        // 过期
        this.clearCookie('login event');
        this.login(uri, params, method);

      }
    }
  }

  loginWithCaptcha() {

  }

  getBasic() {
    // request.get('')
  }


  clearCookie(type) {
    this.setState({
      captchaRequire: false
    })
    localStorage.removeItem(MUSICER);
    if (!localStorage.getItem(MUSICER)) {
      console.log(type + '  成功清理musicer');
    }
  }

  render() {
    return (
      <div>
        {this.renderPanel()}
        {/* <div className=""></div> */}
        <hr />
        <h4>请求结果</h4>
        <h6>{this.state.tips}</h6>

        <pre>{this.state.result}</pre>
        <hr />
        <h4>备注</h4>
        <ul>
          <li>第一次登录需要用户名密码</li>
          <li>第一次登录之后需要拿到token去验证获取基本信息</li>
          <li>拿到的token需要做一次有效期的验证</li>
        </ul>
      </div>
    )
  }
}


const connectLogin = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

export default connectLogin;
