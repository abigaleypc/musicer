import React from 'react';

class PlayAndPause extends React.Component {
  constructor(props) {
    super(props);
  }
  renderBtn() {
    if (this.props.isPause) {
      return (<label title="播放"><svg title="Title" viewBox="15 8 10 13" height="22" width="22" style={{ verticalAlign: 'middle' }}><desc>Icon</desc><path d="M16.2404248,8.16131117 L24.4883398,13.8012748 C25.1705534,14.1855546 25.1705534,14.8143854 24.4883398,15.1986903 L16.2404248,20.8387042 C15.5581861,21.222984 15,20.8967404 15,20.1136905 L15,8.88632486 C15,8.1032498 15.5581861,7.7770062 16.2404248,8.16131117 Z" stroke="none" fill="#4a4a4a" fillRule="evenodd"></path></svg></label>)

    } else {
      return (<label title="暂停"><svg title="Title" viewBox="61 0 22 22" height="22" width="22" style={{ verticalAlign: 'middle' }}><desc>Icon</desc><path d="M61,1.00246167 C61,0.448817378 61.4509752,0 61.990778,0 L66.009222,0 C66.5564136,0 67,0.43945834 67,1.00246167 L67,20.9975383 C67,21.5511826 66.5490248,22 66.009222,22 L61.990778,22 C61.4435864,22 61,21.5605417 61,20.9975383 L61,1.00246167 Z M77,1.00246167 C77,0.448817378 77.4509752,0 77.990778,0 L82.009222,0 C82.5564136,0 83,0.43945834 83,1.00246167 L83,20.9975383 C83,21.5511826 82.5490248,22 82.009222,22 L77.990778,22 C77.4435864,22 77,21.5605417 77,20.9975383 L77,1.00246167 Z" stroke="none" fill="#4a4a4a" fillRule="evenodd"></path></svg></label>)
    }
  }
  render() {
    return (
      <div>
        {this.renderBtn()}
      </div>
    )
  }
}
export default PlayAndPause;