/* eslint-disable no-alert */
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

class Signout extends Component {
  componentDidMount() {
    const { signout } = this.props;
    signout();
    alert('안전하게 로그아웃 되었습니다.');
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
