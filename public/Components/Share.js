import React from 'react';
import '../style/Share.less';
const QRCode = require('qrcode');

class Share extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qrcode: null
    }
    this.closePopup =this.closePopup.bind(this)
  }

  componentWillReceiveProps() {
    let url = `https://douban.fm/song/${this.props.sid}g${this.props.ssid}?from_=qrcode`;
    QRCode.toDataURL(url, (err, url) => {
      this.setState({
        qrcode: url
      })
    })
  }
  closePopup(e) {
    if(e.target.querySelector('.modal')) {
      this.props.closePopup()
    }
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
            <img src={this.state.qrcode} className="QRCode" />
            <div>扫码分享到微信</div>
          </div>
        </div>
      </a>
    )
  }
}
export default Share;