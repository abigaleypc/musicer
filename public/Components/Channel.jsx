import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

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

class Channel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channels: {}
    }
  }

  componentWillMount() {
    this.getChannels().then(data => {
      const {data:{channels}} = data;
      this.setState({channels});
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
    const {channels} = this.state;

    return (
      <div className="channel-content">
        {Object.keys(channels).map(typeKey => {
          return (
            <div className="channel-type" key={typeKey}>
              {/* <h5>{typeKey}</h5> */}
              {channels[typeKey].map(channel => {
                return (
                  <p key={channel.id}
                    onClick={this.onChangeChannel.bind(this, channel.id)}
                    style={{cursor:'pointer'}}>{channel.name}</p>
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
