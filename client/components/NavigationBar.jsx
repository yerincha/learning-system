import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <div className="navbar-header">
          <Link to='/' className='navbar-brand'> Home </Link>
          <Link to='/classroom' className='navbar-brand'> 강의실 </Link>
        </div>

        <div>
          <Link to="/login"> Log In </Link>
          <Link to="/signup"> Sign Up </Link>
        </div>
      </div> 
    </nav>
  );
}