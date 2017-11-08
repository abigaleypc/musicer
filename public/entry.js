import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import Header from './Components/Header';
import Home from './Components/Home';
import reducers from './store/reducers'

const logger = createLogger({
  collapsed: true
});


const store = createStore(
  reducers,
  applyMiddleware(
    logger,
    thunk
  )
);

class Root extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    fetch('http://localhost:8082/userInfo').then(res => res.json()).then(data => {
      if (Object.keys(data).length > 0) {
        for (let key in data) {
          const userInfo = data[key].data;
          console.log(userInfo);
        }
      }
    }).catch(error => {
      alert(error.errMsg);
    })
  }

  render() {
    return (
      <div style={styles.content}>
          <Header />

          <Home />
      </div>
    );
  }
}


const styles = {
  content:{
    fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,PingFang SC,Source Han Sans CN,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,sans-serif'
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById('root')
);
