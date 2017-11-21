import React from 'react';
import '../style/Lyric.less'

class Lyric extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLyricIndex: 0,
      offsetHeight: 0,
      lyricType: {} //null:暂无歌词， noTime:不支持滚动   normal
    }
    this.lyricListElement = this.lyricListElement.bind(this);
  }

  componentWillReceiveProps() {
    let { lyricList, timeList, currentTime, lyricType, isNextSong } = this.props, offsetHeight = 0, text = null;
    if (isNextSong) {
      this.lyrics.scrollTop = 0;
    }
    if (!lyricType) {
      text = '暂无歌词'
    } else if (lyricType == 'noTime') {
      text = '本歌词暂不支持滚动'
    }
    this.setState({
      lyricType: {
        type: lyricType,
        text: text
      }
    })
    if (lyricList && lyricList.length > 0 && lyricType == 'normal') {
      for (let i = 0; i < timeList.length; i++) {
        if (timeList[i] < currentTime && timeList[i + 1] > currentTime) {
          if (this.state.currentLyricIndex != i) {
            this.setState({
              currentLyricIndex: i
            })
            // 计算该句歌词之前所有歌词高度
            for (let j = 7; j < i; j++) {
              offsetHeight += (this.lyrics.childNodes)[j].offsetHeight
            }
            this.lyrics.scrollTop = offsetHeight;
            this.setState({
              offsetHeight
            })
          }
        }
      }

    }
  }

  lyricListElement() {
    const { lyricList } = this.props;
    let _lyricList = [];
    if (lyricList) {
      lyricList.forEach((it, index) => {
        _lyricList.push(
          <div key={index}
            className="lyric-item"
            style={
              (this.state.currentLyricIndex == index && this.state.lyricType.type == 'normal') ? { color: "green" } : null
            }>
            {it.content}
          </div>
        )
      })
    }
    return _lyricList;
  }

  render() {
    return (
      <div
        className="lyric-content"
        // style={{ top: this.state.offsetHeight }}
        ref={(input) => { this.lyrics = input; }}>
        <div>{this.state.lyricType.text}</div>
        {this.lyricListElement()}
      </div>
    )
  }
}
export default Lyric;
