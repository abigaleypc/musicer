import React from 'react';

class Lyric extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sid: null,
      ssid: null,
      lyricList: [],
      timeList: [],
      currentLyricIndex: 0
    }
    this.getLyric = this.getLyric.bind(this);
    this.lyricListElement = this.lyricListElement.bind(this);
    this.lyricOn = this.lyricOn.bind(this);
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
      fetch(`http://localhost:8082/lyric?sid=${sid}&ssid=${ssid}`)
        .then(res => res.json())
        .then(data => {
          let lyricSplit = data.lyric.split('\r\n'), lyricList = [], timeList = [], time = 0, timeSplit = []
          lyricSplit.forEach(it => {
            it.replace(/(\[(.+?)\])?(.*)/, (str, $1, $2, $3) => {
              timeSplit = $2.split(':');
              time = Number(timeSplit[0] * 60 + Number(timeSplit[1])).toFixed(2);
              timeList.push(Number(time));
              self.setState({
              })
              lyricList.push({
                'time': $1,
                'content': $3
              })
            })
          })
          if (lyricSplit.length == lyricList.length) {
            self.setState({
              lyricList: lyricList,
              timeList: timeList
            })

            console.log(self.state.timeList);
          }
        })
    }
  }
  lyricListElement() {
    let self = this, _lyricList = [];
    if (self.state.lyricList) {
      self.state.lyricList.forEach((it, index) => {
        _lyricList.push(<div key={index} style={this.state.currentLyricIndex==index?'color:"#eee"':''}>{it.content}</div>)
      })
    }
    return _lyricList;
  }

  lyricOn() {
    if (this.state.lyricList.length > 0) {
      let curTime = Number(this.props.currentTime).toFixed(2);
      let timeList = this.state.timeList;
      for (let i = 0; i < timeList.length; i++) {
        if (timeList[i] < curTime && timeList[i + 1] > curTime) {
          this.setState({
            currentLyricIndex: i
          })
        }
      }
    }
  }


  render() {
    this.lyricOn()
    return (
      <div>
        {this.props.currentTime}
        {this.lyricListElement()}
      </div>
    )
  }
}
export default Lyric;
