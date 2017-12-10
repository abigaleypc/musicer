import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import { api } from '../config/const';
import { userInfoAction, currentPanelAction, forwardPanelAction, isPlayAction, isLikeAction, lyricTypeAction, lyricListAction, lyricTimeListAction, currentTimeAction } from '../store/actions'

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
import { ipcRenderer } from 'electron';

function mapStateToProps(state) {
  const { userInfo } = state.userInfoReducer;
  const { currentPanel } = state.currentPanelReducer;
  const { forwardPanel } = state.forwardPanelReducer;
  const { isPlay } = state.isPlayReducer;
  const { isLike } = state.isLikeReducer;
  const { lyricType } = state.lyricTypeReducer;
  const { lyricList } = state.lyricListReducer;
  const { lyricTimeList } = state.lyricTimeListReducer;
  const { currentTime } = state.currentTimeReducer;
  return { userInfo, currentPanel, forwardPanel, isPlay, isLike, lyricType, lyricList, lyricTimeList, currentTime };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    userInfoAction, currentPanelAction, forwardPanelAction, isPlayAction, isLikeAction, lyricTypeAction, lyricListAction, lyricTimeListAction, currentTimeAction
  }, dispatch)

}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      songInfo: {},
      isBegining: false,
      currentTime: 0,
      totalTime: 0,
      currentMinute: 0,
      currentSecond: 0,
      totalMinute: 0,
      totalSecond: 0,
      lyricList: [],
      lyricTimeList: [],
      isNextSong: false,
      isShowShare: false,
      isShowDisk: false,
      forwardModule: '',
      lyricPanel: null
    };

    this.nextSong = this.nextSong.bind(this)
    this.initSong = this.initSong.bind(this)
    this.onPlay = this.onPlay.bind(this)
    this.onPause = this.onPause.bind(this)
    this.onTimeUpdate = this.onTimeUpdate.bind(this)
    this.like = this.like.bind(this)
    this.delete = this.delete.bind(this)
    this.toggleType = this.toggleType.bind(this);
    this.showLyric = this.showLyric.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  componentWillMount() {
    this.nextSong();
  }

  initSong() {
    this.setState({
      totalTime: 0
    })
    this.props.currentTimeAction({ currentTime: 0 })

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
            currentSecond: 0,
            currentMinute: 0,
            totalTime: data.song[0].length,
            totalSecond: this.dateFormat(data.song[0].length).second,
            totalMinute: this.dateFormat(data.song[0].length).minute.toString(),
            isNextSong: false
          });
          this._video.src = this.state.songInfo.url;
          this.props.currentTimeAction({ currentTime: 0 })
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
    fetch(`${api}/song/like?sid=${this.state.songInfo.sid}&isLike=${!this.props.isLike}`);
    this.props.isLikeAction({ isLike: !this.props.isLike })
    // this.setState({
    //   isLike: !this.state.isLike
    // })
  }

  delete() {
    fetch(`${api}/song/delete?sid=${this.state.songInfo.sid}`)
      .then(res => res.json())
      .then((data) => {
        if (data.song.length > 0) {
          this.setState({
            songInfo: data.song[0],
            totalTime: data.song[0].length,
            currentSecond: 0,
            currentMinute: 0,
            totalTime: data.song[0].length,
            totalSecond: this.dateFormat(data.song[0].length).second,
            totalMinute: this.dateFormat(data.song[0].length).minute,
            isNextSong: false
          });
          this._video.src = this.state.songInfo.url;
          this.props.currentTimeAction({ currentTime: 0 })
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

  onPlay() {
    let self = this;
    self.setState({
      isBegining: true
    })
  }

  onPause() {
    this.props.isPlayAction({ isPlay: !this.props.isPlay })
    if (this.props.isPlay) {
      this._video.pause();
    } else {
      this._video.play();
    }
  }

  onTimeUpdate(data) {
    let _currentTime = data.target.currentTime;
    this.props.currentTimeAction({ currentTime: _currentTime })
    let { second, minute } = this.dateFormat(_currentTime)

    if (_currentTime > this.state.totalTime) {
      this.nextSong();
    } else {
      this.setState({
        currentSecond: second,
        currentMinute: minute
      })
    }
  }

  showLyric() {
    let currentPanel = 'lyric';
    let forwardPanel = this.props.currentPanel;
    this.props.currentPanelAction({ currentPanel })
    this.props.forwardPanelAction({ forwardPanel })

  }

  toggleType(type) {
    if (type == 'lyric') {


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
          this.props.lyricTypeAction({ lyricType: data.type })
          this.props.lyricListAction({ lyricList: data.lyricList })
          this.props.lyricTimeListAction({ lyricTimeType: data.timeList })
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
    let currentPanel = this.props.forwardPanel;
    let forwardPanel = this.props.currentPanel;
    this.props.currentPanelAction({ currentPanel })
    this.props.forwardPanelAction({ forwardPanel })


  }

  render() {
    return (
      <section>
        {/* <a className="close_btn" href='javascript:window.close()'>✘</a> */}
        <div className="warpper">
          {/* {this.lyricModule()} */}

          {/* {this.mainModule()} */}

          {/* {this.diskModule()} */}
          {/* 主面板 */}
          <div className={this.props.currentPanel == 'main' ? 'rotate_wrapper opacity_1' : 'rotate_wrapper opacity_0'}>
            <a className="interface_control_btn"><i className="fa fa-user-circle-o" aria-hidden="true"></i></a>
            <div className="playing_info">
              {/* 右上角按钮 */}
              <img src={this.state.songInfo.picture} className='img_filter_normal' />



              <div className='btnAndInfo'>
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
                  <div className="red_progress" style={{ width: (this.props.currentTime / this.state.totalTime * 100) + '%' }}></div>
                  <div className="left">{this.state.currentMinute}:{this.state.currentSecond}</div>
                  <div className="right">{this.state.totalMinute}:{this.state.totalSecond}</div>
                </a>

                {/* 按钮组 */}
                <div className="btn_group layout_row">
                  <a className="btn_item layout_row red_heart" onClick={this.like}>
                    <i className="fa fa-heart fa-lg"
                      aria-hidden="true"
                      style={this.props.isLike ? { color: '#ed5153' } : null}></i>
                  </a>
                  <a className="btn_item layout_row btn_item_middle" onClick={this.onPause}>
                    {this.props.isPlay && (<i className="fa fa-pause fa-lg" aria-hidden="true"></i>)}
                    {!this.props.isPlay && (<i className="fa fa-play fa-lg" aria-hidden="true"></i>)}
                  </a>
                  <a className="btn_item layout_row" onClick={this.nextSong}>
                    <i className="fa fa-forward fa-lg" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* 歌词面板 */}
          <div className={this.props.currentPanel == 'lyric' ? 'rotate_wrapper opacity_1' : 'rotate_wrapper opacity_0'}>
            <a className="interface_control_btn" onClick={this.goBack}><i className="fa fa-reply" aria-hidden="true"></i></a>
            <img src={this.state.songInfo.picture} className='img_blur_10' />

            <div className='lyric'>
              <Lyric />
            </div>

          </div>

          <video src={this.state.songInfo.url} controls="controls" ref={r => this._video = r} onPlay={this.onPlay} onTimeUpdate={this.onTimeUpdate} className="opacity_0" autoPlay></video>




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
