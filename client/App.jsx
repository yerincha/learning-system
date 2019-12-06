import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';

import NavigationBar from './components/NavigationBar.jsx';
import Greetings from './components/Greetings.jsx';
import SignupPage from "./components/signup/SignupPage.jsx";
import LoginPage from "./components/login/LoginPage.jsx";
import Student from "./components/Student.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    }
  }


  render() {
    return (
      <Router>
          <NavigationBar />
        <Switch>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/signup">
            <SignupPage />
          </Route>
          <Route exact path="/" Component={Greetings}/>
          <Route path="/classroom">
            <Student />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
