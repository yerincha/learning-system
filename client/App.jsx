import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import NavigationBar from './components/NavigationBar.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  // fetchUserData(){
  //   axios.get()
  // }

  render() {
    return (
      <div className="header">
        <NavigationBar />
      </div>
    )
  }
}

export default App;
