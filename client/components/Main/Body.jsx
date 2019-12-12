import React from 'react';
import propTypes from 'prop-types';

import CourseRegister from './CourseRegister';
import CardGrid from './CardGrid';

const Body = ({
  loggedIn, course, isAdmin, selectedCourse, onViewClick,
}) => {
  let content = null;
  if (loggedIn && course.length === 0) {
    content = <CourseRegister />;
  } else if (loggedIn) {
    content = (
      <CardGrid
        course={course}
        selectedCourse={selectedCourse}
        onViewClick={onViewClick}
      />
    );
  }
  return content;
};

Body.propTypes = {
  loggedIn: propTypes.bool.isRequired,
  course: propTypes.arrayOf(propTypes.object),
  isAdmin: propTypes.bool.isRequired,
  selectedCourse: propTypes.number.isRequired,
  onViewClick: propTypes.func.isRequired,
};

Body.defaultProps = {
  course: [],
};

export default Body;
