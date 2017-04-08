import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import App from './components/App';


class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
    };
  }

  render() {
    return (
      <div>
        <App />
      </div>
    );
  }
  componentDidMount() {
    var HOST = location.origin.replace(/^http/, 'ws')
    console.log('mounted, HOST = ', HOST);
    var ws = new WebSocket('ws://localhost:3000');
    ws.onmessage = function (msg) {
          msg = JSON.parse(msg.data);
          console.log(msg);
    };
  }

}


const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(thunk),
  ),
);

ReactDOM.render(
  <Provider store={store}>
    <Index />
  </Provider>,
  document.getElementById('app'),
);
