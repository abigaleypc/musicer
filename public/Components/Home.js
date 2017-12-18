import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import { api } from '../config/const';
import { userInfoAction } from '../store/actions'

import Sidebar from './Sidebar'
import Login from './Login'
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

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  render() {
    return (
      <section>
        <div className="row">
          <div className="col-xs-2 col-md-2">
            <Sidebar />
          </div>
          <div className="col-xs-9 col-md-9">
          {this.props.currentPanel.str=='LOGIN'&&<Login />}
          {/* {this.state.currentPanel=='LOGIN'&&<Login />} */}
          </div>
        </div>
      </section>
    )
  }
}


const connectHome = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

export default connectHome;
