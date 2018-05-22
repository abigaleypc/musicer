import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import { api } from '../config/const';
import { userInfoAction, songInfoAction, currentPanelAction, forwardPanelAction, isPlayAction, isLikeAction, lyricTypeAction, lyricListAction, lyricTimeListAction, currentTimeAction } from '../store/actions'
import moment from 'moment'
import Lyric from './Lyric.jsx'
import Share from './Share.jsx'
import Login from './Login.jsx'
import Account from './Account.jsx'
import ToneAnimation from './ToneAnimation.jsx'
import Channel from './Channel.jsx';

import { getAccountList } from "../utils/account";

import '../style/Home.less';

function mapStateToProps(state) {
  const { isLogin } = state.loginReducer
  const { userInfo } = state.userInfoReducer;
  const { songInfo } = state.songInfoReducer;
  const { currentPanel } = state.currentPanelReducer;
  const { forwardPanel } = state.forwardPanelReducer;
  const { isPlay } = state.isPlayReducer;
  const { isLike } = state.isLikeReducer;
  const { lyricType } = state.lyricTypeReducer;
  const { lyricList } = state.lyricListReducer;
  const { lyricTimeList } = state.lyricTimeListReducer;
  const { currentTime } = state.currentTimeReducer;
  return { isLogin, userInfo, songInfo, currentPanel, forwardPanel, isPlay, isLike, lyricType, lyricList, lyricTimeList, currentTime };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    userInfoAction, songInfoAction, currentPanelAction, forwardPanelAction, isPlayAction, isLikeAction, lyricTypeAction, lyricListAction, lyricTimeListAction, currentTimeAction
  }, dispatch)

}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      songInfo: {},
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
      channelId: localStorage.getItem('channelId') || ''
    };

    this.nextSong = this.nextSong.bind(this)
    this.initSong = this.initSong.bind(this)
    this.onPlay = this.onPlay.bind(this)
    this.onPause = this.onPause.bind(this)
    this.onTimeUpdate = this.onTimeUpdate.bind(this)
    this.like = this.like.bind(this)
    this.delete = this.delete.bind(this)
    this.showPanel = this.showPanel.bind(this);
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
    // 一次只允许一个请求
    if (this.state.isNextSong) return;

    const {channelId} = this.state;
    const sid = this.props.songInfo.sid || '';

    this.initSong();
    this.setState({isNextSong: true})

    return fetch(`${api}/song/next?sid=${sid}&channelId=${channelId}`)
      .then((res) => {
        return res.json();
      }).then((data) => {
        let songInfo = [];

        if (data.song.length) {
          songInfo = data.song[0];
          this.props.songInfoAction({ songInfo });
          this.setState({
            currentSecond: 0,
            currentMinute: 0,
            totalTime: data.song[0].length,
            totalSecond: this.dateFormat(data.song[0].length).second,
            totalMinute: this.dateFormat(data.song[0].length).minute.toString(),
            isNextSong: false
          });
          this._video.src = songInfo.url;
          this.props.currentTimeAction({ currentTime: 0 })
          this.props.isPlayAction({ isPlay: true })
          this.props.isLikeAction({ isLike: false })

          this.getLyric();
        } else {
          this.setState({isNextSong: false});
          return this.nextSong();
        }

        return songInfo;
      });
  }

  like() {
    if (this.props.isLogin) {
      fetch(`${api}/song/like?sid=${this.props.songInfo.sid}&isLike=${!this.props.isLike}&username=${this.props.userInfo.username}&token=${this.props.userInfo.token}`)
        .then((res) => {
          return res.json()
        });
      this.props.isLikeAction({ isLike: !this.props.isLike })
    } else {
      let currentPanel = 'login';
      let forwardPanel = 'main';
      this.props.currentPanelAction({ currentPanel })
      this.props.forwardPanelAction({ forwardPanel })
    }
  }

  delete() {
    fetch(`${api}/song/delete?sid=${this.props.songInfo.sid}`)
      .then(res => res.json())
      .then((data) => {
        let songInfo = [];
        if (data.song.length > 0) {
          songInfo = data.song[0];
          this.props.songInfoAction({ songInfo });
          this.setState({
            totalTime: data.song[0].length,
            currentSecond: 0,
            currentMinute: 0,
            totalTime: data.song[0].length,
            totalSecond: this.dateFormat(data.song[0].length).second,
            totalMinute: this.dateFormat(data.song[0].length).minute,
            isNextSong: false
          });
          this._video.src = songInfo.url;
          this.props.currentTimeAction({ currentTime: 0 })
        } else {
          this.nextSong();
        }
        return songInfo;
      }).then(() => {
        this.getLyric();
      });
  }

  onPlay() {
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



  getLyric() {
    let { sid, ssid } = this.props.songInfo;
    if (sid && ssid) {
      fetch(`${api}/song/lyric?sid=${sid}&ssid=${ssid}`)
        .then(res => res.json())
        .then(data => {
          this.props.lyricTypeAction({ lyricType: data.type })
          this.props.lyricListAction({ lyricList: data.lyricList })
          this.props.lyricTimeListAction({ lyricTimeList: data.timeList })
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
  }
  showPanel(panel) {
    let accountList = getAccountList()
    if (panel == 'login' && accountList && accountList.length > 0) {
      let data = JSON.parse(localStorage.getItem(accountList[0]))
      let isExpire = moment().isBefore(data.expires_in)
      if (isExpire) {
        this.props.currentPanelAction({
          currentPanel: 'account'
        })
        this.props.forwardPanelAction({
          forwardPanel: this.props.currentPanel
        })
        this.props.userInfoAction({
          userInfo: data
        })
      }
    } else {
      let currentPanel = panel;
      let forwardPanel = this.props.currentPanel;
      this.props.currentPanelAction({ currentPanel })
      this.props.forwardPanelAction({ forwardPanel })
    }
  }

  goBack() {
    let currentPanel = this.props.forwardPanel;
    let forwardPanel = this.props.currentPanel;
    this.props.currentPanelAction({ currentPanel })
    this.props.forwardPanelAction({ forwardPanel })
  }

  /**
   * 修改频道
   * @param {string} channelId 频道id
   */
  changeChannel(channelId) {
    this.setState({channelId}, () => {
      localStorage.setItem('channelId', channelId);
      this.nextSong().then(() => this.goBack());
    });
  }

  render() {
    return (
      <section>
        <div className="warpper">
          {/* 主面板 */}
          <div className={this.props.currentPanel == 'main' ? 'rotate_wrapper opacity_1' : 'rotate_wrapper opacity_0'}>
            <a className="tone-animation" onClick={this.showPanel.bind(this, 'channel')}><ToneAnimation />频道</a>
            <a className="interface_control_btn" onClick={this.showPanel.bind(this, 'login')}><i className="fa fa-user-circle-o" aria-hidden="true"></i></a>
            <div className="playing_info">

              {/* 右上角按钮 */}
              <img src={this.props.songInfo.picture} className='img_filter_normal' />
              <div className='btnAndInfo'>
                <div className="text_info center layout_row">
                  <div className="left"><a onClick={this.showPanel.bind(this, 'lyric')}>詞</a></div>
                  <div className="middle">
                    <div><strong>{this.props.songInfo.title}</strong></div>
                    <div className="artist">{this.props.songInfo.artist}</div>
                  </div>
                  <div className="right">
                    <a onClick={this.showPanel.bind(this, 'share')}><i className="fa fa-share-alt" aria-hidden="true"></i></a>
                  </div>
                </div>

                {/* 进度条 */}
                <div className="progress">
                  <div className="red_progress" style={{ width: (this.props.currentTime / this.state.totalTime * 100) + '%' }}></div>
                  <div className="left">{this.state.currentMinute}:{this.state.currentSecond}</div>
                  <div className="right">{this.state.totalMinute}:{this.state.totalSecond}</div>
                </div>

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
            <a className="interface_control_btn" onClick={this.goBack}><i className="fa fa-angle-left" aria-hidden="true"></i></a>
            <img src={this.props.songInfo.picture} className='img_blur_10' />

            <div className='contains'>
              <Lyric />
            </div>
          </div>

          {/* 分享面板 */}
          <div className={this.props.currentPanel == 'share' ? 'rotate_wrapper opacity_1' : 'rotate_wrapper opacity_0'}>
            <a className="interface_control_btn" onClick={this.goBack}><i className="fa fa-angle-left" aria-hidden="true"></i></a>
            <img src={this.props.songInfo.picture} className='img_blur_10' />

            <div className='contains'>
              <Share />
            </div>
          </div>

          {/* 登录面板 */}
          <div className={this.props.currentPanel == 'login' ? 'rotate_wrapper opacity_1' : 'rotate_wrapper opacity_0'}>
            <a className="interface_control_btn" onClick={this.goBack}><i className="fa fa-angle-left" aria-hidden="true"></i></a>
            <img src={this.props.songInfo.picture} className='img_blur_10' />

            <div className='contains'>
              <Login />
            </div>
          </div>


          {/* 个人信息面板 */}
          <div className={this.props.currentPanel == 'account' ? 'rotate_wrapper opacity_1' : 'rotate_wrapper opacity_0'}>
            <a className="interface_control_btn" onClick={this.goBack}><i className="fa fa-angle-left" aria-hidden="true"></i></a>
            <img src={this.props.songInfo.picture} className='img_blur_10' />
            <div className='contains'>
              <Account />
            </div>
          </div>

          {/* 换频道面板 */}
          <div className={this.props.currentPanel == 'channel' ? 'rotate_wrapper opacity_1' : 'rotate_wrapper opacity_0'} style={{overflow:'auto'}}>
            <a className="interface_control_btn" onClick={this.goBack}><i className="fa fa-angle-left" aria-hidden="true"></i></a>
            <img src={this.props.songInfo.picture} className='img_blur_10' />
            <div className='contains'>
              <Channel changeChannel={this.changeChannel.bind(this)} />
            </div>
          </div>

          <video autoPlay src={this.props.songInfo.url} controls="controls" ref={r => this._video = r} onPlay={this.onPlay} onTimeUpdate={this.onTimeUpdate} className="opacity_0" ></video>
          {/* autoPlay */}




          {/* {this.state.isShowShare &&
            <Share
              sid={this.state.songInfo.sid}
              ssid={this.state.songInfo.ssid}
              picture={this.state.songInfo.picture}
              title={this.state.songInfo.title}
              closePopup={() => { this.setState({ isShowShare: false }) }} />
          } */}
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
