import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { connect } from 'react-redux';

import reducers from '../../store/reducers'
import { LOGIN, tologinAction } from '../../store/actions';


const store = createStore(
  reducers,
  applyMiddleware(
    logger,
    thunk
  )
);

function mapStateToProps(state) {
  const { isLogin } = state.toLoginReducer;
  return { isLogin };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    tologinAction
  }, dispatch);
}

class Login extends React.Component {
  constructor(props) {
    super(props);
  }
  login() {
    this.props.tologinAction({ isLogin: true });
  }
  render() {
  console.log('------------------------------------');
  console.log("entry login ");
  console.log('------------------------------------');
    return (
      <div>
        <button onClick={this.login.bind(this)}>Login</button>
      </div>
    )
  }
};

const ConnectLogin = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

// export default ConnectLogin;


let loginWindow = ReactDOM.render(
  <Provider store={store}>
    <ConnectLogin />
  </Provider>,
  document.getElementById('login')
)
