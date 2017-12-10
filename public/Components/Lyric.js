import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { lyricTypeAction, lyricListAction, lyricTimeListAction, currentTimeAction } from '../store/actions'
import '../style/Lyric.less'

function mapStateToProps(state) {
  const { lyricType } = state.lyricTypeReducer;
  const { lyricList } = state.lyricListReducer;
  const { lyricTimeList } = state.lyricTimeListReducer;
  const { currentTime } = state.currentTimeReducer;
  return { lyricType, lyricList, lyricTimeList, currentTime };
}



function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    lyricTypeAction, lyricListAction, lyricTimeListAction, currentTimeAction
  }, dispatch)

}

class Lyric extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLyricIndex: 0,
      offsetHeight: 0,
      lyricTip: null
    }
    this.lyricListElement = this.lyricListElement.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let { lyricList, lyricTimeList, currentTime, lyricType } = nextProps, offsetHeight = 0;
    if (currentTime == 0) {
      this.lyrics.scrollTop = 0;
    }
    if (!lyricType) {
      this.setState({
        lyricTip: '暂无歌词'
      })
    } else if (lyricType == 'noTime') {
      this.setState({
        lyricTip: '本歌词暂不支持滚动'
      })
    }
    // this.props.lyricTypeAction({ lyricType })
    if (lyricList && lyricList.length > 0 && lyricType == 'normal') {
      this.setState({
        lyricTip: null
      })
      for (let i = 0; i < lyricTimeList.length; i++) {
        if (lyricTimeList[i] < currentTime && lyricTimeList[i + 1] > currentTime) {
          if (this.state.currentLyricIndex != i) {
            this.setState({
              currentLyricIndex: i
            })
            // 计算该句歌词之前所有歌词高度
            for (let j = 3; j < i; j++) {
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
              (this.state.currentLyricIndex == index && this.props.lyricType == 'normal') ? { color: "green" } : null
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
        <div>{this.state.lyricTip}</div>
        {this.lyricListElement()}
      </div>
    )
  }
}

const connectLyric = connect(
  mapStateToProps,
  mapDispatchToProps
)(Lyric);

export default connectLyric;
