/* eslint-disable no-else-return */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import CourseEdit from './CourseEdit';
import ContainerEdit from './ContainerEdit';
import ContentEdit from './ContentEdit';

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
}));

const Editor = ({
  isCourseEditClick, isContainerEditClick, isContentEditClick, handleChange, fetchCourseContent,
  courseTitle, courseSummary, containerTitle, contentTitle, content, selectedCourseData, selectedCourseItem,
  fetchCourseData, adminName, updateCourseItem,
}) => {
  const renderContent = () => {
    if (isCourseEditClick) {
      return (
        <CourseEdit
          handleChange={handleChange}
          fetchCourseContent={fetchCourseContent}
          courseTitle={courseTitle}
          courseSummary={courseSummary}
          selectedCourseItem={selectedCourseItem}
          fetchCourseData={fetchCourseData}
          adminName={adminName}
          // updateCourseItem={updateCourseItem}
        />
      );
    } else if (isContainerEditClick) {
      return (
        <ContainerEdit
          handleChange={handleChange}
          fetchCourseContent={fetchCourseContent}
          containerTitle={containerTitle}
          selectedCourseData={selectedCourseData}
          adminName={adminName}
        />
      );
    } else if (isContentEditClick) {
      return (
        <ContentEdit
          handleChange={handleChange}
          fetchCourseContent={fetchCourseContent}
          contentTitle={contentTitle}
          content={content}
          selectedCourseData={selectedCourseData}
          adminName={adminName}
        />
      );
    }
    return null;
  };

  const classes = useStyles();

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Typography component="span" paragraph>
        {renderContent()}
      </Typography>
    </main>
  );
};

Editor.propTypes = {

};
export default Editor;
