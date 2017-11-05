import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { tologinAction, loginwindowAction, userInfoAction } from '../../store/actions';
import Login from './Login';
import { MainColor } from '../../Theme'

const { ipcRenderer } = window.require('electron');


function mapStateToProps(state) {
  const { isLogin } = state.toLoginReducer;
  const { loginWindow } = state.loginwindowReducer;
  const { userInfo } = state.userInfoReducer;

  return { isLogin, loginWindow, userInfo };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    tologinAction, loginwindowAction, userInfoAction
  }, dispatch);
}


class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      avatar: ''
    }
  }
  login() {
    this.props.loginwindowAction({ loginWindow: true })
  }
  logOut() {
    this.props.tologinAction({ isLogin: false })
  }
  render() {

    console.log('------------------------------------');
    console.log(this.props.userInfo);
    console.log('------------------------------------');
    ipcRenderer.on('login-event', (event, arg) => {
      this.props.loginwindowAction({ loginWindow: false });
      this.props.tologinAction({ isLogin: arg.isLogin });
      this.props.userInfoAction({ userInfo: arg.basic });
      this.setState({
        userName: arg.basic.name,
        avatar: arg.basic.avatar.icon
      })
    });

    return (
      <div>
        <div style={styles.header}>
          <img style={styles.logo} src='https://img3.doubanio.com/dae/staticng/s/bragi/fac999b8062c57ed5308bd24d761678880ebea30/deploy/b6a46d59a094ec51ec67452607965e2c.svg' />
          {
            this.props.isLogin ?
              <div style={styles.userInfo}>
                <img style={styles.avatar} src={this.state.avatar} />
                <div style={styles.userName}>{this.props.userInfo.name} | </div>
                <a style={styles.btn} onClick={this.logOut.bind(this)}>退出</a>
              </div>
              :
              <a style={styles.btn} onClick={this.login.bind(this)}>登录</a>
          }
        </div>
        <Login />
      </div>
    )
  }
}

const styles = {
  header: {
    backgroundColor: 'rgba(250, 250, 250, 0.93)',
    display: 'flex',
    justifyContent: 'space-between',
    height: 70,
    alignItems: 'center',
    padding: '0 10px'
  },
  logo: {
    height: '70%'
  },
  btn: {
    cursor: 'pointer',
    fontSize: 12,
    color: MainColor
  },
  userInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: '50%',
    border: '1px solid #e2e2e2'
  },
  userName: {
    padding: '0 5px',

  }
}

const ConnectHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);

export default ConnectHeader;
