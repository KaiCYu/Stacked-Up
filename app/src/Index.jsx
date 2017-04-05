import React from 'react';
import ReactDOM from 'react-dom';
import './main.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
    };
  }

  render() {
    return (
      <div> Stacked Up! </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
