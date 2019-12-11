import React from 'react';
import propTypes from 'prop-types';
import Axios from 'axios';
import FileSystem from './FileSystem';

const Classroom = ({
  isAdmin, adminName, course, selectedCourse
}) => {

  const [values, setValues] = React.useState({
    title: '',
    summary: '',
  });

  const handleChange = (name) => (event) => {
    setValues({
      ...values,
      [name]: event.target.value,
    });
  };

  const onCourseSubmit = (e) => {
    e.preventDefault();
    Axios.post('/api/course', {
      title: values.title,
      summary: values.summary,
      madeBy: adminName,
      updatedBy: adminName,
      image: 'https://source.unsplash.com/random',
    })
      .then((res) => {
        console.log(res.data);
        setIsClicked(() => false);
      })
      .catch(() => {
        // console.log('not valid');
      });
  };
  return (
    <FileSystem
      isAdmin={isAdmin}
      course={course}
      selectedCourse={selectedCourse}
      handleChange={handleChange}
      onCourseSubmit={onCourseSubmit}
    />
  );
};

Classroom.propTypes = {
  course: propTypes.arrayOf(propTypes.object).isRequired,
  selectedCourse: propTypes.number.isRequired,
};

export default Classroom;
