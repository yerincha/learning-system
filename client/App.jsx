import React from 'react';
import ReactDOM from 'react-dom';
import NavigationBar from './components/NavigationBar.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div className="header">
        <NavigationBar />
      </div>
    )
  }
}

export default App;
