import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {  } from '../store/actions'

import '../style/Share.less';
const QRCode = require('qrcode');

function mapStateToProps(state) {
  const { sid, ssid, picture, title } = state.songInfoReducer.songInfo;
  return { sid, ssid, picture, title };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

class Share extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qrcode: null
    }
  }

  componentWillReceiveProps() {
    let url = `https://douban.fm/song/${this.props.sid}g${this.props.ssid}?from_=qrcode`;
    QRCode.toDataURL(url, (err, url) => {
      this.setState({
        qrcode: url
      })
    })
  }

  render() {

    return (
      <a className="pupop" onClick={this.closePopup} ref={(pupop) => { this.pupop = pupop }}>
        <div className="modal" ref={(modal) => { this.pupop = modal }}>
          <div className="share-header">
            <div className="share-pic"><img src={this.props.picture} /></div>
            <div className="share-title">{this.props.title}</div>
          </div>
          <div className="share-body">
          <div className="QRCode center" >
            <img src={this.state.qrcode}/>
            {/* <img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKQAAACkCAYAAAAZtYVBAAAAAklEQ…sih7UucljrIoe1LnJY6yKHtS5yWOsih7UucljrIoe1LvJ/sccSWjaw5OAAAAAASUVORK5CYII='  className="QRCode"/> */}
            </div>
            <div className="scan-tip">扫码分享到微信</div>
          </div>
        </div>
      </a>
    )
  }
}

const connectShare = connect(
  mapStateToProps,
  mapDispatchToProps
)(Share);

export default connectShare;
