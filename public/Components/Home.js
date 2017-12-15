import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import { api } from '../config/const';
import { userInfoAction } from '../store/actions'

import Sidebar from './Sidebar'
import request from 'request'
import { REQUEST_CONTENT } from '../config/data'


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
    this.state = {
      data: REQUEST_CONTENT
    };
  }

  componentWillMount() {
  }

  renderPanel() {
    let { url, params, method } = this.state.data[this.props.currentPanel.str];

    // this.getData(url, params, method)

    return (
      <div>
        <h3>🌸 {this.props.currentPanel.title}</h3>
        <form>
          <div className="form-group">
            <label >URL</label>
            <input className="form-control" defaultValue={url} />
          </div>
          <div className="form-group">
            <label>method</label>
            <input className="form-control" defaultValue={method} />
          </div>

          <div className="form-group">
            <label>Params</label>
            <textarea className="form-control" defaultValue={JSON.stringify(params)} />
          </div>
          <button className="btn btn-default">Request</button>
        </form>
      </div>
    )
  }

  getData(uri,params,method){
    // let _method = method.toLowerCase();
    // request[_method](uri, {
    //   json: true,
    //   qs: params
    // }).on('error', err => {
    //   // res.status(500).end(err);
    // }).on('data', data => {
    //   try {
    //     // data = JSON.parse(data);
    //     // res.cookie('name', 'tobi', { domain: '.example.com', path: '/admin', secure: true });
    //     // res.json(data)
  
    //   } catch (err) {
  
    //   }
    // })
  }



  render() {
    return (
      <section>
        <div className="row">
          <div className="col-xs-2 col-md-2">
            <Sidebar />
          </div>
          <div className="col-xs-9 col-md-9">
            {this.renderPanel()}
            {/* <div className=""></div> */}
            <hr />
            <h4>请求结果</h4>
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
