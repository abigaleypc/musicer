import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { Player } from 'Video-react'

import { userInfoAction } from '../../store/actions'

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
  componentWillMount() {
    this.getSongInfo();
  }
  render() {
    return (
      <div>
        <Player ref="player" preload="metadata">
          <source src={this.state.songInfo.url} />
        </Player>
        <div><img src={this.state.songInfo.picture} /></div>
        {/* <video src={this.state.songInfo.url} controls="controls" ></video> */}
        {/* autoPlay */}
        <button onClick={this.getSongInfo}>下一首</button>
        <button onClick={this.like.bind(this)}>喜欢</button>
        <p>歌曲名：{this.state.songInfo.albumtitle}</p>
        <p>歌手：{this.state.songInfo.artist}</p>
      </div>
    )
  }
}


const styles = {
}

const connectHome = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

export default connectHome;
