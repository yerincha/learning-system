import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <div className="navbar-header">
          <Link to='/' className='navbar-brand'>Learning System</Link>
        </div>
        <div className="collapse navbar-collapse">
          <ul className="nav navbar-nav navbar-right">
            <li><Link to="/signup"> Sign Up </Link></li>
          </ul>
        </div>
      </div> 
    </nav>
  );
}