/* eslint-disable no-else-return */
import React from 'react';
import propTypes from 'prop-types';
import { Typography, CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import CourseEdit from './CourseEdit';
import ContainerEdit from './ContainerEdit';
import ContentEdit from './ContentEdit';
import ContentView from './ContentView';
import ContainerOrderEdit from './ContainerOrderEdit';
import ContentOrderEdit from './ContentOrderEdit';

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
}));

const Editor = ({
  isCourseEditClicked, isContainerEditClicked, isContentEditClicked, handleChange,
  fetchCourseContent, courseTitle, courseSummary, containerTitle,
  selectedCourseData, selectedCourseItem,
  fetchCourseData, adminName, selectedContainer, selectedContent, isContentClicked,
  isContainerOrderEditClick, containerOrderEditClick, isContentOrderEditClick,
  contentOrderEditClick,
}) => {
  const renderContent = () => {
    if (isCourseEditClicked) {
      return (
        <CourseEdit
          handleChange={handleChange}
          fetchCourseContent={fetchCourseContent}
          courseTitle={courseTitle}
          courseSummary={courseSummary}
          selectedCourseItem={selectedCourseItem}
          fetchCourseData={fetchCourseData}
          adminName={adminName}
          containerOrderEditClick={containerOrderEditClick}
        />
      );
    } else if (isContainerEditClicked) {
      return (
        <ContainerEdit
          handleChange={handleChange}
          containerTitle={containerTitle}
          adminName={adminName}
          selectedContainer={selectedContainer}
          fetchCourseData={fetchCourseData}
          contentOrderEditClick={contentOrderEditClick}
        />
      );
    } else if (isContentEditClicked) {
      return (
        <ContentEdit
          selectedContent={selectedContent}
          fetchCourseData={fetchCourseData}
        />
      );
    } else if (isContentClicked) {
      return (
        <ContentView
          selectedContent={selectedContent}
        />
      );
    } else if (isContainerOrderEditClick) {
      return (
        <ContainerOrderEdit
          selectedCourseData={selectedCourseData}
          fetchCourseData={fetchCourseData}
        />
      );
    } else if (isContentOrderEditClick) {
      return (
        <ContentOrderEdit
          fetchCourseData={fetchCourseData}
          selectedContainer={selectedContainer}
        />
      );
    }
    return null;
  };

  const classes = useStyles();

  return (
    <main className={classes.content}>
      <CssBaseline />
      <div className={classes.toolbar} />
      <Typography component="span" paragraph>
        {renderContent()}
      </Typography>
    </main>
  );
};

Editor.propTypes = {
  isCourseEditClicked: propTypes.bool.isRequired,
  isContainerEditClicked: propTypes.bool.isRequired,
  isContentEditClicked: propTypes.bool.isRequired,
  handleChange: propTypes.func.isRequired,
  fetchCourseContent: propTypes.func.isRequired,
  courseTitle: propTypes.string.isRequired,
  courseSummary: propTypes.string.isRequired,
  containerTitle: propTypes.string.isRequired,
  selectedCourseData: propTypes.arrayOf(propTypes.object),
  selectedCourseItem: propTypes.shape({
    id: propTypes.number,
    title: propTypes.string,
  }),
  fetchCourseData: propTypes.func.isRequired,
  adminName: propTypes.string.isRequired,
  selectedContainer: propTypes.shape({
    id: propTypes.number,
    title: propTypes.string,
  }),
  isContentClicked: propTypes.bool.isRequired,
  selectedContent: propTypes.shape({
    id: propTypes.number,
  }),
  isContainerOrderEditClick: propTypes.bool.isRequired,
  containerOrderEditClick: propTypes.func.isRequired,
  isContentOrderEditClick: propTypes.bool.isRequired,
  contentOrderEditClick: propTypes.func.isRequired,
};

Editor.defaultProps = {
  selectedCourseData: null,
  selectedCourseItem: null,
  selectedContainer: null,
  selectedContent: null,
};

export default Editor;
