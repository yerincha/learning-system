import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

const NavigationBar = props => {

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <div className="navbar-header">
          <Link to='/' className='navbar-brand'> Home </Link>
          <Link to='/classroom' className='navbar-brand'> 강의실 </Link>
        </div>
        {props.loggedIn
          ?
          <div>
            <Link to='/signout' onClick={props.signout}> Sign Out </Link>
          </div>
          :
          <div>
            <Link to="/login" > Log In </Link>
            <Link to="/signup"> Sign Up </Link>
          </div>
        }
      </div>
    </nav>
  );
}

NavigationBar.propTypes = {

};

export default NavigationBar;