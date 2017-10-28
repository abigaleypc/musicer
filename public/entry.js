import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import Home from './Constants/Home/Home'
import Header from './Constants/Header/Header'

import ShadeModal from './Components/ShadeModal'


const logger = createLogger({
  collapsed: true
});

const actions = {
  IS_LOGIN: 'IS_LOGIN',
  USER_NAME: 'USE_NAME'
}

const reducers = {
  login: (state = actions.IS_LOGIN, action) => {
    return state;
  }
}

const store = createStore(
  combineReducers({ reducers }),
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



let mainWindow = ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  // <Root />,
  document.getElementById('root')
);

