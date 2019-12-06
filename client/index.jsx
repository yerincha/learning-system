import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, BrowserRouter as Router, Route } from 'react-router-dom';

import App from './App.jsx';
import Greetings from './components/Greetings.jsx';
import SignupPage from "./components/signup/SignupPage.jsx";
import loginPage from "./components/login/loginPage.jsx";
import Student from "./components/Student.jsx";

ReactDOM.render(
  <HashRouter>
    <div>
      <Route path="/" component={App} />
      <Route exact path="/" component={Greetings} />
      <Route path="/login" component={loginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/classroom" component={Student} />
    </div>
  </HashRouter>, document.getElementById('main'));
