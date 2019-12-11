import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import Axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import FileSystem from './FileSystem';
import Editor from './Editor/Editor';

const useStyles = makeStyles(() => ({
  classroom: {
    display: 'flex',
  },
}));

const Classroom = ({
  isAdmin, adminName, course, selectedCourse, selectedCourseItem, fetchCourseData,
}) => {
  const classes = useStyles();
  const [selectedCourseData, setSelectedCourseData] = React.useState(null);
  const [isCourseEditClick, setIsCourseEditClick] = React.useState(false);
  const [isContainerEditClick, setIsContainerEditClick] = React.useState(false);
  const [isContentEditClick, setIsContentEditClick] = React.useState(false);

  const [values, setValues] = React.useState({
    courseTitle: selectedCourseItem.title,
    courseSummary: selectedCourseItem.summary,
    containerTitle: '',
    contentTitle: '',
    content: '',
  });


  const handleChange = (name) => (event) => {
    setValues({
      ...values,
      [name]: event.target.value,
    });
  };

  const fetchCourseContent = () => {
    Axios.get(`/api/course?id=${selectedCourse}`)
      .then((data) => {
        console.log('fetched', data);
        setSelectedCourseData(data.data);
      });
  };

  useEffect(() => {
    fetchCourseContent();
  }, []);

  const onContainerSubmit = () => {
    Axios.post('/api/container', {
      title: values.containerTitle,
      madeBy: adminName,
      updatedBy: adminName,
      courseId: selectedCourse,
    })
      .then((res) => {
        console.log('container submitted', res.data);
        fetchCourseContent();
      });
  };

  const courseEditClick = () => {
    setIsCourseEditClick(true);
  };
  const containerEditClick = () => {
    setIsContainerEditClick(true);
  };
  const contentEditClick = () => {
    setIsContentEditClick(true);
  };

  const containerDeleteClick = () => {
  };
  const contentDeleteClick = () => {
  };

  const containerPublishToggle = () => {
  };
  const contentPublishToggle = () => {
  };

  console.log('selecte', selectedCourseItem)

  return (
    <div className={classes.classroom}>
      <FileSystem
        isAdmin={isAdmin}
        course={course}
        selectedCourse={selectedCourse}
        handleChange={handleChange}
        onContainerSubmit={onContainerSubmit}
        fetchCourseContent={fetchCourseContent}
        selectedCourseData={selectedCourseData}
        courseEditClick={courseEditClick}
        containerEditClick={containerEditClick}
        contentEditClick={contentEditClick}
        selectedCourseItem={selectedCourseItem}
      />
      <Editor
        handleChange={handleChange}
        isCourseEditClick={isCourseEditClick}
        isContainerEditClick={isContainerEditClick}
        isContentEditClick={isContentEditClick}
        fetchCourseContent={fetchCourseContent}
        courseTitle={values.courseTitle}
        courseSummary={values.courseSummary}
        containerTitle={values.containerTitle}
        contentTitle={values.contentTitle}
        content={values.content}
        selectedCourseData={selectedCourseData}
        course={course}
        selectedCourseItem={selectedCourseItem}
        fetchCourseData={fetchCourseData}
        adminName={adminName}
        // updateCourseItem={updateCourseItem}
      />
    </div>
  );
};

Classroom.propTypes = {
  course: propTypes.arrayOf(propTypes.object).isRequired,
  selectedCourse: propTypes.number.isRequired,
  isAdmin: propTypes.bool.isRequired,
  adminName: propTypes.string.isRequired,
};

export default Classroom;
