import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

class Signout extends Component {
  componentDidMount() {
    const { loggedOut } = this.props;
    if (loggedOut) {
      // eslint-disable-next-line no-alert
      alert('안전하게 로그아웃 되었습니다.');
    }
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

};

export default Signout;
