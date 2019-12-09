import React, { Component } from 'react';

import AdminSignupForm from './AdminSignupForm.jsx';


class AdminSignupPage extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-4 col-md-offset-4">
          <AdminSignupForm />
        </div>
      </div>
    );
  }
}

export default AdminSignupPage;