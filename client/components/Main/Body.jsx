import React from 'react';
import propTypes from 'prop-types';

import CourseRegister from './CourseRegister';
import CardGrid from './CardGrid';
import CardGridAdmin from './CardGridAdmin';

const Body = ({ loggedIn, course, isAdmin }) => {
  let content;
  if (!loggedIn) {
    content = <CourseRegister />;
  } else if (loggedIn && course.length >= 0 && !isAdmin) {
    content = <CardGrid />;
  } else if (loggedIn && isAdmin) {
    content = <CardGridAdmin />;
  }
  return content;
};

Body.propTypes = {
  loggedIn: propTypes.bool.isRequired,
  course: propTypes.arrayOf(propTypes.number),
  isAdmin: propTypes.bool.isRequired,
};

Body.defaultProps = {
  course: [],
};

export default Body;
