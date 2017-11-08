import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import { userInfoAction } from '../store/actions'
import { MainColor, GrayColor } from '../Theme'

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
      songInfo: ''
    };
    this.getSongInfo = this.getSongInfo.bind(this)
  }

  getSongInfo() {
    let result = ''
    let self = this;

    // this.props.userName;


    fetch('http://localhost:8082/playlist')
      .then(res => res.json())
      .then(function (data) {
        self.setState({
          songInfo: data.song[0]
        })
      });
  }

  like() {


  }
  temp(e) {
  }
  componentWillMount() {
    this.getSongInfo();
  }
  render() {
    return (
      <div style={styles.section}>

        <div style={styles.warpper}>
          <div style={styles.left}><img src={this.state.songInfo.picture} style={{ width: '100%' }} /></div>

          {/* autoPlay */}
          <div style={styles.middle}>
            <div style={styles.songType}>豆瓣精选MHz</div>
            <div style={styles.songTitle}>{this.state.songInfo.albumtitle}</div>
            <div style={styles.songAuthor}>{this.state.songInfo.artist}</div>
            <div style={styles.process}>
              <div style={styles.greenProcess}></div>
            </div>
            {/* <video src={this.state.songInfo.url} controls="controls" onLoadStart={this.temp}></video>
             */}
            <div style={styles.btnGroup}>
              <button onClick={this.like.bind(this)}>喜欢</button>
              <button onClick={this.like.bind(this)}>删除</button>
              <button onClick={this.getSongInfo}>暂停</button>
              <button onClick={this.getSongInfo}>下一首</button>
            </div>
          </div>
          <div style={styles.right}><img src={this.state.songInfo.picture} style={styles.playingCover} /></div>
        </div>
      </div>
    )
  }
}


const styles = {
  section: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warpper: {
    width: '785px',
    height: '300px',
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
    position: 'absolute',
    color: MainColor
  },
  songTitle: {
    position: 'absolute',
    top: '60px',
    fontSize: '22px',
    width: '375px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  songAuthor: {
    position: 'absolute',
    top: '88px'
  },
  process: {
    position: 'absolute',
    top: '120px',
    width: '100%',
    height: '3px',
    background: GrayColor,
    overflow: 'hidden'
  },
  greenProcess: {
    position: 'absolute',
    width: '100%',
    height: '3px',
    background: MainColor,
    left: '-50%'
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
    position: 'absolute',
    top: '140px',

  }
}

const connectHome = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

export default connectHome;
