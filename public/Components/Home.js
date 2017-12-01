import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import { api } from '../config/const';
import { userInfoAction } from '../store/actions'

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
      currentTime: 0,
      totalTime: 0,
      currentMinute: 0,
      currentSecond: 0,
      totalMinute: 0,
      totalSecond: 0,
      isLike: false,
      lyricList: [],
      lyricType: null,
      lyricTimeList: [],
      isShowLyric: false,
      isNextSong: false,
      isShowShare: false,
      isShowDisk: false
    };

    this.nextSong = this.nextSong.bind(this)
    this.initSong = this.initSong.bind(this)
    this.onPlay = this.onPlay.bind(this)
    this.onPause = this.onPause.bind(this)
    this.onTimeUpdate = this.onTimeUpdate.bind(this)
    this.like = this.like.bind(this)
    this.delete = this.delete.bind(this)
    this.toggleType = this.toggleType.bind(this);
    this.lyricModule = this.lyricModule.bind(this);
    this.diskModule = this.diskModule.bind(this);
    this.mainModule = this.mainModule.bind(this);
    this.showLyric = this.showLyric.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  componentWillMount() {
    this.nextSong();
  }

  initSong() {
    this.setState({
      totalTime: 0,
      currentTime: 0
    })

  }

  nextSong() {
    this.initSong();
    this.setState({
      isNextSong: true
    })
    fetch(`${api}/song/next?sid=${this.state.songInfo.sid}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.song.length > 0) {

          this.setState({
            songInfo: data.song[0],
            currentTime: 0,
            currentSecond: 0,
            currentMinute: 0,
            totalTime: data.song[0].length,
            totalSecond: this.dateFormat(data.song[0].length).second,
            totalMinute: this.dateFormat(data.song[0].length).minute.toString(),
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
            currentTime: 0,
            currentSecond: 0,
            currentMinute: 0,
            totalTime: data.song[0].length,
            totalSecond: this.dateFormat(data.song[0].length).second,
            totalMinute: this.dateFormat(data.song[0].length).minute,
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
    this.setState({
      currentTime: data.target.currentTime
    });
    let { second, minute } = this.dateFormat(this.state.currentTime)

    if (this.state.currentTime > this.state.totalTime) {
      this.nextSong();
    } else {
      this.setState({
        currentSecond: second,
        currentMinute: minute
      })
    }
  }

  showLyric() {
    this.setState({
      isShowLyric: !this.state.isShowLyric
    })
  }

  toggleType(type) {
    if (type == 'lyric') {

      this.setState({
        isShowLyric: !this.state.isShowLyric
      })
      if (this.state.isShowLyric) {
        ipcRenderer.send('window-layout', {
          width: -220
        })
      } else {
        ipcRenderer.send('window-layout', {
          width: 220
        })

      }

    } else if (type == 'download') {
      this.setState({
        isShowDisk: !this.state.isShowDisk
      })
      if (this.state.isShowDisk) {
        ipcRenderer.send('window-layout', {
          width: -220
        })
      } else {
        ipcRenderer.send('window-layout', {
          width: 220
        })

      }
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

  dateFormat(date) {
    let _second = Math.floor(date % 60) > 0 ? Math.floor(date % 60) : 0,
      minute = Math.floor(date / 60) > 0 ? Math.floor(date / 60) : 0;

    let second = _second < 10 ? ('0' + _second) : _second;
    return {
      second, minute
    }
    // if (this.state.currentTime > this.state.totalTime) {
    //   this.nextSong();
    // } else {
    //   this.setState({
    //     second: _currentSecond < 10 ? ('0' + _currentSecond) : _currentSecond,
    //     minute: _currentMinute
    //   })
    // }
  }

  goBack() {
    this.setState({
      isShowLyric: false
    })
  }

  lyricModule() {
    if (this.state.isShowLyric) {
      return (
        <div className="left" >
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
      )
    }
    return;
  }

  diskModule() {
    if (this.state.isShowDisk) {
      return (<div className="right">
        <img src={this.state.songInfo.picture} className="playingCover" />
      </div>)
    }
    return;
  }
  mainModule() {
    return (<div className="middle">
      <div className="songType"><ToneAnimation />豆瓣精选MHz</div>
      <div className="songTitle">{this.state.songInfo.title}</div>
      <div className="songAuthor">{this.state.songInfo.artist}</div>
      <div className="volumeAnLyricGroup">
        <div className="volumeAndTime">
          <span className="time">-{this.state.minute}:{this.state.second}</span>
          <VolumeSlider setVolume={num => { this._video.volume = 0 }} />
          {this.props.isShowLyric}
        </div>
        <LyricDownloadShareBtn toggleType={type => this.toggleType(type)} />
      </div>
      <div className="progress">
        {/* <div style={{ position: 'absolute', width: '100%', height: '3px', background: MainColor, left: (-this.state.remainTime / this.state.totalTime * 100) + '%' }}></div> */}
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
    </div>)
  }
  render() {
    return (
      <section>
        {/* <a className="close_btn" href='javascript:window.close()'>✘</a> */}
        <div className="warpper">
          {/* {this.lyricModule()} */}

          {/* {this.mainModule()} */}

          {/* {this.diskModule()} */}
          <div className="playing_info">
            {/* 右上角按钮 */}
            <a style={{ display: 'block' ,position:'absolute',zIndex:100}} onClick={this.goBack}>点击</a>
            <img src={this.state.songInfo.picture} className={this.state.isShowLyric ? 'img_blur_10' : 'img_filter_normal'} />


            {/* 主面板 */}
            <div className={this.state.isShowLyric ? 'opacity_0' : 'btnAndInfo opacity_1'}>
              <div className="text_info center layout_row">
                <div className="left"><a onClick={this.showLyric}>詞</a></div>
                <div className="middle">
                  <div><strong>{this.state.songInfo.title}</strong></div>
                  <div className="artist">{this.state.songInfo.artist}</div>
                </div>
                <div className="right">
                  <i className="fa fa-share-alt" aria-hidden="true"></i>
                </div>
              </div>

              {/* 进度条 */}
              <a className="progress">
                <div className="red_progress" style={{ width: (this.state.currentTime / this.state.totalTime * 100) + '%' }}></div>
                <div className="left">{this.state.currentMinute}:{this.state.currentSecond}</div>
                <div className="right">{this.state.totalMinute}:{this.state.totalSecond}</div>
              </a>

              {/* 按钮组 */}
              <div className="btn_group layout_row">
                <a className="btn_item layout_row red_heart" onClick={this.like}>
                  <i className="fa fa-heart fa-lg"
                    aria-hidden="true"
                    style={this.state.isLike ? { color: '#ed5153' } : null}></i>
                </a>
                <a className="btn_item layout_row btn_item_middle" onClick={this.onPause}>
                  {!this.state.isPause && (<i className="fa fa-pause fa-lg" aria-hidden="true"></i>)}
                  {this.state.isPause && (<i className="fa fa-play fa-lg" aria-hidden="true"></i>)}
                </a>
                <a className="btn_item layout_row" onClick={this.nextSong}>
                  <i className="fa fa-forward fa-lg" aria-hidden="true"></i>
                </a>
              </div>
            </div>

            {/* 歌词面板 */}
            <div className={this.state.isShowLyric ? 'lyric opacity_1' : 'opacity_0'}>
              <Lyric
                lyricList={this.state.lyricList}
                timeList={this.state.lyricTimeList}
                currentTime={this.state.currentTime}
                lyricType={this.state.lyricType}
                isNextSong={this.state.isNextSong} />
            </div>
          </div>

          <video src={this.state.songInfo.url} controls="controls" ref={r => this._video = r} onPlay={this.onPlay} onTimeUpdate={this.onTimeUpdate} autoPlay></video>




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
