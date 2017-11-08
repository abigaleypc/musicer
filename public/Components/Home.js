import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import { userInfoAction } from '../store/actions'
import { MainColor, GrayColor } from '../Theme'

import RedHeart from './RedHeart'
import Trash from './Trash'
import PlayAndPause from './PlayAndPause'
import Next from './Next'


function mapStateToProps(state) {
  const { userInfo } = state.userInfoReducer;
  return { userInfo };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ userInfoAction }, dispatch)

}


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      songInfo: '',
      isBegining: false,
      isPause: false,
      totalTime: 0,
      remainTime: 0,
      videoElement: null,
      volume: .5,
      isLike: false
    };
    this.nextSong = this.nextSong.bind(this)
    this.initSong = this.initSong.bind(this)
    this.onPlay = this.onPlay.bind(this)
    this.onPause = this.onPause.bind(this)
    this.onTimeUpdate = this.onTimeUpdate.bind(this)
    this.handleVolunmChange = this.handleVolunmChange.bind(this)
    this.like = this.like.bind(this)
    this.delete = this.delete.bind(this)
  }

  initSong() {
    let self = this;
    self.setState({
      totalTime: 0,
      remainTime: 0
    })

  }
  nextSong() {
    let result = ''
    let self = this;
    this.initSong();

    fetch('http://localhost:8082/playlist')
      .then(res => res.json())
      .then(function (data) {
        self.setState({
          songInfo: data.song[0],
          totalTime: data.song[0].length,
          remainTime: data.song[0].length,
          second: 0,
          minute: 0,
        })
      });
  }

  like() {
    this.setState({
      isLike: !this.state.isLike
    })


  }
  delete() {

  }
  onPlay(e) {
    let self = this;
    self.setState({
      isBegining: true,
      videoElement: e.target
    })
  }
  onPause() {
    console.log("isPause")
    let self = this;
    self.setState({
      isPause: !self.state.isPause
    })
    if (self.state.isPause) {
      self.state.videoElement.play();
    } else {
      self.state.videoElement.pause();
    }
  }
  onTimeUpdate(data) {
    let _remainSecond = Math.floor(this.state.remainTime % 60) > 0 ? Math.floor(this.state.remainTime % 60) : 0,
      _remainMinute = Math.floor(this.state.remainTime / 60) > 0 ? Math.floor(this.state.remainTime / 60) : 0
    if (_remainMinute == 0 && _remainSecond == 0) {
      this.nextSong()
    } else {
      this.setState({
        remainTime: this.state.totalTime - data.target.currentTime,
        second: _remainSecond < 10 ? ('0' + _remainSecond) : _remainSecond,
        minute: _remainMinute
      })
    }
  }
  handleVolunmChange(event) {
    this.setState({ volume: event.target.value });
    console.log(this.state.videoElement.volume = event.target.value)

  }
  componentWillMount() {
    this.nextSong();
  }
  render() {
    return (
      <div style={styles.section}>
        <div style={styles.warpper}>
          <div style={styles.left}><img src={this.state.songInfo.picture} style={{ width: '100%' }} />
          </div>

          <div style={styles.middle}>
            <div style={styles.songType}>豆瓣精选MHz</div>
            <div style={styles.songTitle}>{this.state.songInfo.albumtitle}</div>
            <div style={styles.songAuthor}>{this.state.songInfo.artist}</div>
            <div style={styles.volumeAndTime}>
              <span>-{this.state.minute}:{this.state.second}</span>
              <input
                type="range"
                min="0" max="1"
                value={this.state.volume}
                onChange={this.handleVolunmChange}
                step="0.1" value={this.state.videoElement ? this.state.videoElement.volume : 0} />
            </div>
            <div style={styles.process}>
              <div style={{ position: 'absolute', width: '100%', height: '3px', background: MainColor, left: (-this.state.remainTime / this.state.totalTime * 100) + '%' }}></div>
            </div>

            <div style={styles.btnGroup}>
              <div style={styles.supBtnGroup}>
                <a onClick={this.like} style={styles.a}><RedHeart isLike={this.state.isLike} /></a>
                <a onClick={this.delete} style={styles.a}><Trash /></a>
              </div>
              <div style={styles.supBtnGroup}>
                <a onClick={this.onPause} style={styles.a}><PlayAndPause isPause={this.state.isPause} /></a>
                <a onClick={this.nextSong} style={styles.a}><Next /></a>
              </div>
            </div>
            <video src={this.state.songInfo.url} controls="controls" autoPlay onPlay={this.onPlay} onTimeUpdate={this.onTimeUpdate}></video>
          </div>
          <div style={styles.right}><img src={this.state.songInfo.picture} style={styles.playingCover} /></div>
        </div>
      </div>
    )
  }
}


const styles = {
  a: {
    display: 'inline-block',
    cursor: 'pointer'
  },
  section: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warpper: {
    width: '780px',
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  left: {
    width: '130px',
    padding: 10

  },
  middle: {
    width: '420px',
    position: 'relative'
  },
  songType: {
    color: MainColor,
    marginBottom: '30px'
  },
  songTitle: {
    fontSize: '22px',
    width: '375px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  songAuthor: {
  },
  volumeAndTime: {
    marginTop: '30px'
  },
  process: {
    position: 'relative',
    width: '100%',
    height: '3px',
    background: GrayColor,
    overflow: 'hidden',
    margin: '15px 0'
  },
  currentProcess: {

  },
  right: {
    width: '250px',
    height: '250px'
  },
  playingCover: {
    borderRadius: '50%',
    width: '100%'
  },
  btnGroup: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  supBtnGroup:{
    display: 'flex',
    width:'75px',
    justifyContent: 'space-around'

  }
}

const connectHome = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

export default connectHome;
