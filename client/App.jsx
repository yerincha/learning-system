import React from 'react';
import { CssBaseline } from '@material-ui/core';
import {
  BrowserRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom';
import axios from 'axios';

import NavigationBar from './components/NavigationBar.jsx';
import Greetings from './components/Greetings.jsx';
import SignupPage from './components/signup/SignupPage.jsx';
import AdminSignupPage from './components/signup/AdminSignupPage.jsx';
import LoginPage from './components/login/LoginPage.jsx';
import Signout from './components/login/Signout.jsx';
import Student from './components/Student.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      userId: '',
      course: null,
      isAdmin: false,
    };
    this.login = this.login.bind(this);
    this.signout = this.signout.bind(this);
    this.fetchUserData = this.fetchUserData.bind(this);
  }

  componentDidMount() {
    this.fetchUserData();
  }

  login(user) {
    console.log('user', user);
    this.setState({
      loggedIn: true,
      userId: user.id,
      isAdmin: user.admin,
    }, () => this.fetchUserData());
  }

  fetchUserData() {
    const { userId, isAdmin } = this.state;
    axios.get(`/user?id=${userId}`, { isAdmin })
      .then((result) => {
        if (result.status === 200) {
          this.setState({
            loggedIn: true,
            userId: result.data.id,
            isAdmin: result.data.admin,
            course: result.data.course,
          });
        }
      });
  }

  fetchCourseData() {
    const { id, admin } = this.state;
    axios.get('/api/course', {
      params: {
        id,
        isAdmin: admin,
      },
    })
      .then((courses) => {
        console.log('courses', courses);
        this.setState({
          course: courses,
        });
      });
  }

  signout() {
    axios.get('/api/signout');
    this.setState({
      loggedIn: false,
    });
  }


  render() {
    const { loggedIn } = this.state;

    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={(props) => (
          loggedIn
            // ? <Component {...props} />
            ? <Student {...props} />
            : <Redirect to="/login" />
        )}
      />
    );

    return (
      <Router>
        <CssBaseline />
        <NavigationBar loggedIn={loggedIn} />
        <Switch>
          <Route exact path="/login">
            <LoginPage loggedIn={loggedIn} login={this.login} />
          </Route>
          <Route exact path="/signup">
            <SignupPage />
          </Route>
          <Route exact path="/">
            <Greetings />
          </Route>
          <Route exact path="/admin_signup">
            <AdminSignupPage />
          </Route>
          <Route exact path="/signout">
            <Signout signout={this.signout} />
          </Route>
          <PrivateRoute path="/classroom" />
        </Switch>
      </Router>
    );
  }
}

export default App;
