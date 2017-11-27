import React from 'react';
import ReactDOM from 'react-dom';
import request from 'request'
import { api } from './config/const';

const { ipcRenderer } = window.require('electron');
const BrowserWindow = window.require('electron').remote.BrowserWindow

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null
    }
    this.loginServer.bind(this);
  }

  handleNameChange(e) {
    this.setState({ username: e.target.value });
  }
  handlePwdChange(e) {
    this.setState({ password: e.target.value });
  }
  login() {
    let username = this.state.username, password = this.state.password;
    if (!(username && password)) {
      // 用户名或密码不为空
    } else {
      this.loginServer(username, password).then(res => {
        window.close()
      }).catch(() => {
        // 登录错误
      })
    }
  }

  loginServer(username, password) {
    return new Promise((resolve, reject) => {
      var url = `${api}/user/login`;
      request.post(url, {
        json: true,
        qs: {
          username, password
        }
      }).on('error', err => {
        res.status(500).end(err);
      }).on('data', res => {
        let result = JSON.parse(res.toString());
        if (result.code == 1) {
          ipcRenderer.send('login-event', {
            isLogin: true,
            basic: result.payload.account_info
          });
          resolve();
        } else if (result.code == -1) {
          document.getElementById('captcha_img').src = result.payload.captcha_image_url;
          reject();
        } else {
          //提示密码错误
          ipcRenderer.send('login-event', { isLogin: false, userName: null })
          reject()
        }
      })
    })
  }

  render() {
    return (
      <div>
        <a style={styles.closeBtn} href='javascript:window.close()'>✘</a>
        <div style={styles.loginContent}>
          <img style={styles.logo} src='https://img3.doubanio.com/dae/staticng/s/bragi/fac999b8062c57ed5308bd24d761678880ebea30/deploy/b6a46d59a094ec51ec67452607965e2c.svg'
            alt='' />
          <div>
            <input id='username' name='username' type='text' placeholder='用户名' style={styles.nameInput} onChange={this.handleNameChange.bind(this)} />
            <input id='password' name='password' type='password' placeholder='密码' style={styles.pwdInput} onChange={this.handlePwdChange.bind(this)} />
          </div>
          <a style={styles.loginBtn} onClick={this.login.bind(this)}>登录</a>

        </div>
      </div>
    )
  }
}

const styles = {
  loginContent: {
    margin: '0 15%',
    padding: '0 auto',
    textAlign: 'center'
  },
  logo: {
    width: '100%',
    margin: '30px 0'
  },
  nameInput: {

    width: '100%',
    height: '30px',
    display: 'inline-block',
    borderStyle: 'solid',
    borderWidth: '1px',
    border: '1px solid #e1e1e1',
    padding: '0 5px',
    boxSizing: 'border-box',
    borderRadius: '5px 5px 0 0'
  },
  pwdInput: {

    width: '100%',
    height: '30px',
    display: 'inline-block',
    borderStyle: 'solid',
    borderWidth: '1px',
    border: '1px solid #e1e1e1',
    padding: '0 5px',
    boxSizing: 'border-box',
    borderRadius: '0 0 5px 5px',
    borderTop: 0
  },
  loginBtn: {
    width: '100%',
    height: '30px',
    background: 'rgb(47, 152, 66)',
    color: 'white',
    display: 'inline-block',
    margin: '30px 0',
    lineHeight: '30px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  closeBtn: {
    textDecoration: 'none',
    fontSize: '20px',
    color: 'rgb(47, 152, 66)'
  }
}

ReactDOM.render(
  <Login />,
  document.getElementById('login')
)



