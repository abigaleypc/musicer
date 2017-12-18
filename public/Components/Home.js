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
      data: REQUEST_CONTENT,
      url: null,
      method: null,
      params: null
    };
    this.urlChange = this.urlChange.bind(this);
    this.methodChange = this.methodChange.bind(this);
    this.paramsChange = this.paramsChange.bind(this);
  }

  componentWillMount() {

    let { url, params, method } = this.state.data[this.props.currentPanel.str];
    this.setState({
      params, url, method
    })
    this.getData(url, params, method)
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

        <button className="btn btn-default" onClick={this.getData.bind(this, this.state.url, this.state.params, this.state.method)}>Request</button>
      </div>
    )
  }

  getData(uri, params, method) {
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

      } catch (err) {
        this.setState({
          result: err
        })

      }
    })
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

            <div>{this.state.result}</div>
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
