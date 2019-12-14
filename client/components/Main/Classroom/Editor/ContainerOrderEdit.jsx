/* eslint-disable no-alert */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import propTypes from 'prop-types';
import Axios from 'axios';
import { List, arrayMove } from 'react-movable';

import {
  Button, CssBaseline, Typography, Container,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  courseform: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  coursesubmit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const ContainerOrderEdit = ({
  selectedCourseData, fetchCourseData,
}) => {
  const classes = useStyles();

  const [items, setItems] = useState(selectedCourseData);

  const handleSaveClick = () => {
    const updateItemWithIndex = items.map((item, idx) => ({
      id: item.id,
      index: idx,
    }));

    Axios.put('api/container_update_index', updateItemWithIndex).then(() => {
      fetchCourseData();
    })
      .catch(() => {
        alert('Fail to update container orders');
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="span" variant="h5">
          Course Container Order Edit
        </Typography>
        <Button onClick={handleSaveClick}>SAVE</Button>
      </div>
      <List
        values={items}
        onChange={({ oldIndex, newIndex }) => setItems(arrayMove(items, oldIndex, newIndex))}
        renderList={({ children, props }) => <ul {...props}>{children}</ul>}
        renderItem={({ value, props }) => <li {...props}>{value.title}</li>}
      />
    </Container>
  );
};

ContainerOrderEdit.propTypes = {
  fetchCourseData: propTypes.func.isRequired,
  selectedCourseData: propTypes.arrayOf(propTypes.object),
};

ContainerOrderEdit.defaultProps = {
  selectedCourseData: [],
};

export default ContainerOrderEdit;
