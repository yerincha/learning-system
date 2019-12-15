/* eslint-disable no-unused-expressions */
import React from 'react';
import propTypes from 'prop-types';

import CourseRegister from './CourseRegister';
import CardGrid from './CardGrid';

const Body = ({
  signedIn, course, isAdmin, selectedCourse, onViewClick, fetchCourseData, userId,
}) => {
  let content = null;
  if (signedIn && Object.keys(course).length > 0) {
    content = (
      <div>
        <CardGrid
          course={course}
          selectedCourse={selectedCourse}
          onViewClick={onViewClick}
          isAdmin={isAdmin}
          fetchCourseData={fetchCourseData}
        />
        {isAdmin ? null : <CourseRegister userId={userId} fetchCourseData={fetchCourseData} />}
      </div>
    );
  } else if (signedIn) {
    content = (
      <div>
        {isAdmin ? null : <CourseRegister userId={userId} fetchCourseData={fetchCourseData} />}
      </div>
    );
  }
  return content;
};

Body.propTypes = {
  signedIn: propTypes.bool.isRequired,
  course: propTypes.objectOf(propTypes.object),
  isAdmin: propTypes.bool.isRequired,
  selectedCourse: propTypes.number.isRequired,
  onViewClick: propTypes.func.isRequired,
  userId: propTypes.number.isRequired,
  fetchCourseData: propTypes.func.isRequired,
};

Body.defaultProps = {
  course: {},
};

export default Body;
