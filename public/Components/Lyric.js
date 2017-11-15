import React from 'react';
import request from 'request'

class Lyric extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sid: null,
      ssid: null,
      lyricList: null
    }
    this.getLyric = this.getLyric.bind(this);
    this.LyricListElement = this.LyricListElement.bind(this);
  }
  componentWillMount() {
    let sid = this.props.sid;
    let ssid = this.props.ssid;
    if (sid && ssid)
      this.getLyric(sid, ssid);
  }

  componentWillReceiveProps() {
    if (this.state.ssid != this.props.ssid && this.state.sid != this.props.sid) {
      this.setState({
        sid: this.props.sid,
        ssid: this.props.ssid
      })
      this.getLyric(this.props.sid, this.props.ssid);
    }
  }

  getLyric(sid, ssid) {
    let self = this;
    if (sid && ssid) {
      fetch(`http://localhost:8083/lyric?sid=${sid}&ssid=${ssid}`)
        .then(res => res.json())
        .then(data => {
          let lyricSplit = data.lyric.split('\r\n'), lyricList = []
          lyricSplit.forEach(it => {
            it.replace(/(\[.+?\])?(.*)/, (str, $1, $2) => {
              lyricList.push({
                'time': $1,
                'content': $2
              })
            })
          })
          if (lyricSplit.length == lyricList.length) {
            self.setState({
              lyricList: lyricList
            })
          }
        })
    }
  }
  LyricListElement() {
    let self = this, _lyricList = [];
    if (self.state.lyricList) {
      self.state.lyricList.forEach((it, index) => {
        _lyricList.push(<div key={index}>{it.content}</div>)
      })
    }
    return _lyricList;
  }

  render() {
    return (
      <div>
        {this.LyricListElement()}
      </div>
    )
  }
}
export default Lyric;