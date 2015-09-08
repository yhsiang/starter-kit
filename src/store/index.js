import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import createMiddleware from '../middlewares/client';
import rootReducer from '../reducers';

const logger = createLogger({
  level: 'info',
  collapsed: false
});

export default function createRevenuReportStore(client, initialState) {
  const middleware = createMiddleware(client)
  let finalCreateStore;
  if (process.env.NODE_ENV !== 'production') {
    const { devTools, persistState } = require('redux-devtools');
    finalCreateStore = compose(
      applyMiddleware(
        thunk,
        middleware,
        logger
      ),
      devTools(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(createStore);
  } else {
    finalCreateStore = applyMiddleware(middleware)(createStore);
  }

  const store = finalCreateStore(rootReducer, initialState);
  store.client = client;

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
