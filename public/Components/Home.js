import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import { api } from '../config/const';
import { userInfoAction } from '../store/actions'
import { MainColor, GrayColor } from '../Theme'

import RedHeart from './RedHeart'
import Trash from './Trash'
import PlayAndPause from './PlayAndPause'
import Next from './Next'
import VolumeSlider from './VolumeSlider'
import LyricDownloadShareBtn from './LyricDownloadShareBtn'
import Lyric from './Lyric'
import Share from './Share'
import ToneAnimation from './ToneAnimation'


import '../style/Home.less'
import { request } from 'https';
import { ipcRenderer } from 'electron';

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
      songInfo: {},
      isBegining: false,
      isPause: false,
      totalTime: 0,
      remainTime: 0,
      isLike: false,
      isShowLyric: false,
      lyricList: [],
      lyricType: null,
      lyricTimeList: [],
      currentTime: 0,
      isNextSong: false,
      isShowShare: false
    };

    this.nextSong = this.nextSong.bind(this)
    this.initSong = this.initSong.bind(this)
    this.onPlay = this.onPlay.bind(this)
    this.onPause = this.onPause.bind(this)
    this.onTimeUpdate = this.onTimeUpdate.bind(this)
    this.like = this.like.bind(this)
    this.delete = this.delete.bind(this)
    this.toggleType = this.toggleType.bind(this);
  }

  componentWillMount() {
    this.nextSong();
  }

  initSong() {
    this.setState({
      totalTime: 0,
      remainTime: 0
    })

  }

  nextSong() {
    this.initSong();
    this.setState({
      isNextSong: true
    })
    fetch(`${api}/song/next?sid=${this.state.songInfo.sid}`)
      .then((res) => {
        res.json();

      })
      .then((data) => {
        if (data.song.length > 0) {
          this.setState({
            songInfo: data.song[0],
            totalTime: data.song[0].length,
            remainTime: data.song[0].length,
            currentTime: 0,
            second: 0,
            minute: 0,
            isNextSong: false
          });
          this._video.src = this.state.songInfo.url
        }
        else {
          this.nextSong();
        }
      })
      .then(() => {
        if (this.state.songInfo)
          this.getLyric();
      });
  }

  like() {
    fetch(`${api}/song/like?sid=${this.state.songInfo.sid}&isLike=${!this.state.isLike}`)
    this.setState({
      isLike: !this.state.isLike
    })
  }

  delete() {
    fetch(`${api}/song/delete?sid=${this.state.songInfo.sid}`)
      .then(res => res.json())
      .then((data) => {
        if (data.song.length > 0) {
          this.setState({
            songInfo: data.song[0],
            totalTime: data.song[0].length,
            remainTime: data.song[0].length,
            currentTime: 0,
            second: 0,
            minute: 0,
            isNextSong: false
          });
          this._video.src = this.state.songInfo.url
        }
        else {
          this.nextSong();
        }
      })
      .then(() => {
        if (this.state.songInfo)
          this.getLyric();
      });

  }

  onPlay(e) {
    let self = this;
    self.setState({
      isBegining: true
    })
  }

  onPause() {
    let self = this;
    self.setState({
      isPause: !self.state.isPause
    })
    if (self.state.isPause) {
      this._video.play();
    } else {
      this._video.pause();
    }
  }

  onTimeUpdate(data) {
    let { currentTime } = this.state;

    // if (data.target.currentTime - currentTime < 1) {
    //   return;
    // }

    this.setState({
      currentTime: data.target.currentTime
    });

    let _remainSecond = Math.floor(this.state.remainTime % 60) > 0 ? Math.floor(this.state.remainTime % 60) : 0,
      _remainMinute = Math.floor(this.state.remainTime / 60) > 0 ? Math.floor(this.state.remainTime / 60) : 0;
    if (this.state.remainTime < 0) {
      this.nextSong();
    } else {
      this.setState({
        remainTime: this.state.totalTime - data.target.currentTime,
        second: _remainSecond < 10 ? ('0' + _remainSecond) : _remainSecond,
        minute: _remainMinute
      })
    }
  }

  toggleType(type) {
    if (type == 'lyric') {
      ipcRenderer.send('window-layout', {
        width: 200,
        height: 400
      })
      this.setState({
        isShowLyric: !this.state.isShowLyric
      })

    } else if (type == 'download') {
    } else {
      this.setState({
        isShowShare: !this.state.isShowShare
      })

    }
  }

  getLyric() {
    let { sid, ssid } = this.state.songInfo;
    if (sid && ssid) {
      fetch(`${api}/song/lyric?sid=${sid}&ssid=${ssid}`)
        .then(res => res.json())
        .then(data => {
          this.setState({
            lyricList: data.lyricList,
            lyricTimeList: data.timeList,
            lyricType: data.type
          })
        })
    }
  }

  render() {
    return (
      <section>
        <div className="warpper">
          <div className="left">
            {this.state.isShowLyric &&
              <div>
                <Lyric
                  lyricList={this.state.lyricList}
                  timeList={this.state.lyricTimeList}
                  currentTime={this.state.currentTime}
                  lyricType={this.state.lyricType}
                  isNextSong={this.state.isNextSong} />
              </div>
            }
            {!this.state.isShowLyric &&
              <div >
                <img width="90" height="90" src="https://img3.doubanio.com/f/fm/1e89298732fbf090aea0812f7fb2af30ad82ab61/pics/fm/landingpage/qr_2@2x.png" alt="FM APP" />
                <div>下载豆瓣FM APP  让好音乐继续</div>
              </div>
            }
          </div>

          <div className="middle">

            <div className="songType"><ToneAnimation />豆瓣精选MHz</div>
            <div className="songTitle">{this.state.songInfo.title}</div>
            <div className="songAuthor">{this.state.songInfo.artist}</div>
            <div className="volumeAnLyricGroup">
              <div className="volumeAndTime">
                <span className="time">-{this.state.minute}:{this.state.second}</span>
                <VolumeSlider setVolume={num => { this._video.volume = num }} />
                {this.props.isShowLyric}
              </div>
              <LyricDownloadShareBtn toggleType={type => this.toggleType(type)} />
            </div>
            <div className="progress">
              <div style={{ position: 'absolute', width: '100%', height: '3px', background: MainColor, left: (-this.state.remainTime / this.state.totalTime * 100) + '%' }}></div>
            </div>

            <div className="btnGroup">
              <div className="supBtnGroup">
                <a onClick={this.like}><RedHeart isLike={this.state.isLike} /></a>
                <a onClick={this.delete}><Trash /></a>
              </div>
              <div className="supBtnGroup">
                <a onClick={this.onPause}><PlayAndPause isPause={this.state.isPause} /></a>
                <a onClick={this.nextSong}><Next /></a>
              </div>
            </div>
            <video src={this.state.songInfo.url} controls="controls" ref={r => this._video = r} onPlay={this.onPlay} onTimeUpdate={this.onTimeUpdate} ></video>
          </div>

          <div className="right">
            <img src={this.state.songInfo.picture} className="playingCover" />
          </div>
          {this.state.isShowShare &&
            <Share
              sid={this.state.songInfo.sid}
              ssid={this.state.songInfo.ssid}
              picture={this.state.songInfo.picture}
              title={this.state.songInfo.title}
              closePopup={() => { this.setState({ isShowShare: false }) }} />
          }
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
