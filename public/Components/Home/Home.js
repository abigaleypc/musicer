import React from 'react';
import ReactDOM from 'react-dom';

import ShadeModal from '../../Components/ShadeModal';


export default class Root extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mp4Info: ''
    };
    this.getMp4Info = this.getMp4Info.bind(this)
  }
  
  getMp4Info(){
    let result = ''
    let self = this;
    let sid = this.state.mp4Info.sid?this.state.mp4Info.sid:null;


    fetch('http://localhost:8082/get_douban_fm',{sid: sid?sid:null})
      .then(res => res.json())
      .then(function(data) {
        self.setState({
            mp4Info: data.song[0]
        })
      });
  }
  componentWillMount(){
    this.getMp4Info();
  }
  render(){
    return (
      <div>
         {/* <ShadeModal /> */}
        <video src={this.state.mp4Info.url} controls="controls" ></video>
        {/* autoPlay */}
        <button onClick={this.getMp4Info}>下一首</button>
        <p>歌曲名：{this.state.mp4Info.albumtitle}</p>
        <p>歌手：{this.state.mp4Info.artist}</p>
      </div>
    )
  }
}


const styles = {
}



