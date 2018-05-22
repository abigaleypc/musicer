import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import '../style/Channel.less'

function mapStateToProps(state) {
  const { lyricType } = state.lyricTypeReducer;
  const { lyricList } = state.lyricListReducer;
  const { lyricTimeList } = state.lyricTimeListReducer;
  const { currentTime } = state.currentTimeReducer;
  return { lyricType, lyricList, lyricTimeList, currentTime };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch)
}


const k_v = [{
  key: 'scenario',
  value: '心情 / 场景'
}, {
  key: 'language',
  value: '语言 / 年代'
}, {
  key: 'genre',
  value: '风格 / 流派'
}, {
  key: 'artist',
  value: '从艺术家出发'
}, {
  key: 'track',
  value: '从单曲出发'
}, {
  key: 'brand',
  value: '品牌兆赫'
}]


class Channel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channels: {}
    }
  }

  componentWillMount() {
    this.getChannels().then(data => {
      const { data: { channels } } = data;
      this.setState({ channels });
    })
  }

  getChannels() {
    const url = `https://douban.fm/j/v2/rec_channels?specific=all`;
    const p = fetch(url).then(res => res.json()).then(data => {
      if (data.status) {
        return Promise.resolve(data);
      } else {
        return Promise.reject(data);
      }
    }).catch(error => {
      console.error('get channels failed', error);
      return Promise.reject(error);
    });
    return p;
  }

  onChangeChannel(id) {
    this.props.changeChannel(id);
  }

  render() {
    const { channels } = this.state;
    return (
      <div className="channel-content">
        {
          k_v.map(it => {
            return (
              <div className="channel-type" key={it.key}>
              <div className="channel-title">{it.value}</div>
                {it.key && channels[it.key] && channels[it.key].map(channel => {
                  return (
                    <span key={channel.id}
                      onClick={this.onChangeChannel.bind(this, channel.id)}
                      className="channel-btn">{channel.name}</span>
                  );
                })}
              </div>
            )
          })}
      </div>
    )
  }
}

const connectChannel = connect(
  mapStateToProps,
  mapDispatchToProps
)(Channel);

export default connectChannel;
