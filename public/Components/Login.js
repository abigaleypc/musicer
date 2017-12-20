import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import { api, MUSICER } from '../config/const';
import { userInfoAction } from '../store/actions'

import Sidebar from './Sidebar'
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
    userInfoAction
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
      tips: null
    };
    this.urlChange = this.urlChange.bind(this);
    this.methodChange = this.methodChange.bind(this);
    this.paramsChange = this.paramsChange.bind(this);
    this.getCookie = this.getCookie.bind(this);
    this.login = this.login.bind(this);
    this.firstLogin = this.firstLogin.bind(this);
    this.loginByToken = this.loginByToken.bind(this);
  }

  componentWillMount() {

    let { url, params, method } = this.state.data[this.props.currentPanel.str];
    this.setState({
      params, url, method
    })
    this.firstLogin(url, params, method)
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

        <button className="btn btn-primary" onClick={this.login.bind(this, this.state.url, this.state.params, this.state.method)}>请求</button>
        <button className="btn btn-primary" onClick={this.clearCookie.bind(this)}>清理登录信息</button>
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
  login(uri, params, method) {
    let cookie = this.getCookie();
    // 第一次登录：无token
    if (!cookie) {
      let _method = method.toLowerCase();
      request[_method](uri, {
        json: true,
        qs: params
      }).on('error', err => {
        // res.status(500).end(err);
      }).on('data', data => {
        try {
          data = JSON.parse(data);
          this.setState({
            result: JSON.stringify(data, undefined, '\t')
          })
          if (data.code == 1) {
            localStorage.setItem('musicer', JSON.stringify({
              id: data.account_info.id,
              expires_in: moment().add(data.expires_in, 's'),
              token: data.token
            }));
            // console.log(moment(curtime).isBefore(time));
          }

        } catch (err) {
          this.setState({
            result: err
          })

        }
      })
    }else {
      
      let currentDate = moment(),
      expiresDate = JSON.parse(cookie).expires_in
      // cookie未过期
      if(moment(currentDate).isBefore(expiresDate)){

      }else {
        // 过期
        
      }
    }
  }

  loginByToken(){

  }

  firstLogin(uri, params, method) {
    let _method = method.toLowerCase();
    request[_method](uri, {
      json: true,
      qs: params
    }).on('error', err => {
      // res.status(500).end(err);
    }).on('data', data => {
      try {
        data = JSON.parse(data);
        this.setState({
          result: JSON.stringify(data, undefined, '\t')
        })
        if (data.code == 1) {
          localStorage.setItem(MUSICER, JSON.stringify({
            id: data.account_info.id,
            expires_in: moment().add(data.expires_in, 's'),
            token: data.token
          }));
          // console.log(moment(curtime).isBefore(time));
        }

      } catch (err) {
        this.setState({
          result: err
        })

      }
    })
  }



  clearCookie() {
    localStorage.removeItem(MUSICER);
    if (!localStorage.getItem(MUSICER)) {
      console.log('成功清理musicer');
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

        <div>{this.state.result}</div>
      </div>
    )
  }
}


const connectLogin = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

export default connectLogin;
