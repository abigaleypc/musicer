import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

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
