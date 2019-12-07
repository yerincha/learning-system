import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';

import NavigationBar from './components/NavigationBar.jsx';
import Greetings from './components/Greetings.jsx';
import SignupPage from "./components/signup/SignupPage.jsx";
import AdminSignupPage from "./components/signup/AdminSignupPage.jsx";
import LoginPage from "./components/login/LoginPage.jsx";
import Signout from "./components/login/Signout.jsx"
import Student from "./components/Student.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      userId: '',
      course: [],
      isAdmin: false,
    }
    this.login = this.login.bind(this);
    this.signout = this.signout.bind(this);
    this.fetchUserData = this.fetchUserData.bind(this);
  }

  componentDidMount() {
    this.fetchUserData();
  }

  login(user) {
    console.log('user', user)
    this.setState({
      loggedIn: true,
      userId: user.id,
      isAdmin: user.admin,
    },() => this.fetchUserData());
  }

  fetchUserData() {
    const { loggedIn, userId, isAdmin } = this.state;
    axios.get(`/user?id=${userId}`, { isAdmin })
    .then((result) => {
      if(result.status === 200) {
        this.setState({
          loggedIn: true,
          userId: result.data.id,
          isAdmin: result.data.admin,
          course: result.data.course,
        });
      } 
    })
  }

  fetchCourseData() {
    axios.get('/api/course', {
      params: {
        id: this.state.id,
        isAdmin: this.state.admin
      }
    })
      .then((courses) => {
        console.log('courses', courses)
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
      <Route {...rest} render={(props) => (
        loggedIn
          ? <Component {...props} />
          : <Redirect to='/login' />
      )} />
    )

    return (
      <Router>
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
          {/* <Route path="/classroom">
            <Student />
          </Route> */}
          <Route exact path="/admin_signup" >
            <AdminSignupPage />
          </Route>
          <Route exact path="/signout" >
            <Signout signout={this.signout} />
          </Route>
          <PrivateRoute path="/student" component={<Student />} />
        </Switch>
      </Router>
    );
  }
}

export default App;
