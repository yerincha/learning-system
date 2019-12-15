/* eslint-disable no-alert */
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

class Signout extends Component {
  componentDidMount() {
    const { signout } = this.props;
    signout();
    alert('You signed out safely');
  }

  render() {
    return (
      <div>
        <Redirect to="/" />
      </div>
    );
  }
}

Signout.propTypes = {
  signout: PropTypes.func.isRequired,
};

export default Signout;
