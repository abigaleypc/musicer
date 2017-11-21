import React from 'react';
import '../style/ToneAnimation.less'

class ToneAnimation extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="tone-section">
          <div className="tone-item tone-item-1"></div>
          <div className="tone-item tone-item-2"></div>
          <div className="tone-item tone-item-3"></div>
          <div className="tone-item tone-item-4"></div>
      </div>
    )
  }
}
export default ToneAnimation;