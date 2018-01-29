import React from 'react'
import { connect } from "react-connect";
import { bindActionCreators } from 'redux'

import { isLoginAction } from '../store/actions'

function mapStateToProps(state) {
  const { isLogin } = state.isLoginReducer;
  return { isLogin }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    isLoginAction
  }, dispatch)
}

class Account extends React.Component {
  constructor(props){
    super(props)
    this.state={}
  }

  render(){
    return (
      <div>Account</div>
    )
  }

}

const connectAccount = connect(
  mapStateToProps,
  mapDispatchToProps
)(Account)

export default connectAccount;
