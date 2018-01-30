import React from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

import { loginAction ,userInfoAction} from '../store/actions'

function mapStateToProps(state) {
  const { isLogin } = state.loginReducer;
  const { userInfo } = state.userInfoReducer;
  return { isLogin ,userInfo}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loginAction,
    userInfoAction
  }, dispatch)
}



class Account extends React.Component {
  constructor(props){
    super(props)
    this.state={}
  }
  componentWillMount(){
    this.props.userInfo.name
  }

  render(){
    return (
      <div>Account
        {this.props.userInfo.name}
      </div>
    )
  }

}

const connectAccount = connect(
  mapStateToProps,
  mapDispatchToProps
)(Account)

export default connectAccount;
