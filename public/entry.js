import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { connect } from 'react-redux';

import reducers from './store/reducers'
// import * as actions from './store/actions'

import Home from './Constants/Home/Home'
import Header from './Constants/Header/Header'

import ShadeModal from './Components/ShadeModal'


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

  render() {
    return (
      <div>
        <div style={styles.header}>
          <Header />
        </div>

        <div style={styles.home}>
          <Home />
        </div>
      </div>
    );
  }
}


const styles = {
  header: {
  },
  home: {

  }
}

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  // <Root />,
  document.getElementById('root')
);

