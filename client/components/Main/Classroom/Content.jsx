/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
import React from 'react';
import propTypes from 'prop-types';
import Axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import {
  ListItem,
  Switch,
  ListItemText, ListItemSecondaryAction, IconButton,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const Content = ({
  content, contentEditClick, contentBodyClick, isAdmin, fetchCourseContent,
}) => {
  const classes = useStyles();
  const [dense, setDense] = React.useState(true);
  const [checked, setChecked] = React.useState(content.published);

  const handleToggle = () => {
    setChecked((prev) => !prev);
    Axios.put('/api/content_published', {
      id: content.id,
      published: !checked,
    })
      .catch(() => {
        alert('Failed to update published');
        setChecked((prev) => !prev);
      });
  };

  const handleDelete = () => {
    const isOkay = confirm('Do you want to delete this content?');
    if (isOkay) {
      Axios.delete('/api/content', {
        params: {
          id: content.id,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            fetchCourseContent();
          }
        })
        .catch(() => {
          alert('Failed to delete this content');
        });
    }
  };

  return (
    <ListItem
      button
      className={classes.nested}
      dense={dense}
      onClick={() => contentBodyClick(content)}
    >
      <ListItemText primary={content.title} />
      {isAdmin
        ? (
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="edit" size="small" onClick={() => contentEditClick(content)}>
              <EditIcon />
            </IconButton>
            <IconButton edge="end" aria-label="delete" size="small" onClick={() => handleDelete()}>
              <DeleteIcon />
            </IconButton>
            <Switch
              edge="end"
              size="small"
              onChange={handleToggle}
              checked={checked}
              color="primary"
            />
          </ListItemSecondaryAction>
        )
        : null}
    </ListItem>

  );
};

Content.propTypes = {
  content: propTypes.shape({
    id: propTypes.number.isRequired,
    title: propTypes.string,
    published: propTypes.bool,
  }),
  contentEditClick: propTypes.func.isRequired,
  contentBodyClick: propTypes.func.isRequired,
  isAdmin: propTypes.bool.isRequired,
  fetchCourseContent: propTypes.func.isRequired,
};

Content.defaultProps = {
  content: {
    id: 0,
  },
};

export default Content;
