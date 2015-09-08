import React from 'react';
import { Provider } from 'react-redux';
import App from './containers/App';
import ApiClient from './utils/ApiClient';
import createRevenuReportStore from './store';

import 'normalize.css';
import './styles/app.less';

const client = new ApiClient();
const store = createRevenuReportStore(client);

export default class Root {
  render() {

    return (
      <Provider store={store}>
        {() =>
          <App />
        }
      </Provider>
    );
  }
}
React.render(<Root />, document.getElementById('app'))
