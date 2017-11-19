import React from 'react';

class Lyric extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLyricIndex: 0
    }
    this.lyricListElement = this.lyricListElement.bind(this);
  }

  componentDidMount() {
    let {lyricList, timeList} = this.props;

    if (lyricList && lyricList.length > 0) {
      let curTime = Number(this.props.currentTime).toFixed(2);

      for (let i = 0; i < timeList.length; i++) {
        if (timeList[i] < curTime && timeList[i + 1] > curTime) {
          this.setState({
            currentLyricIndex: i
          })
        }
      }
    }
  }

  lyricListElement() {
    const {lyricList} = this.props;
    let _lyricList = [];

    if (lyricList) {
      lyricList.forEach((it, index) => {
        _lyricList.push(
          <div key={index}
            style={
              this.state.currentLyricIndex == index ? { color: "#eee" } : null
            }>{it.content}
          </div>
        )
      })
    }

    return _lyricList;
  }

  render() {
    return (
      <div>
        {this.props.currentTime}
        {this.lyricListElement()}
      </div>
    )
  }
}
export default Lyric;
