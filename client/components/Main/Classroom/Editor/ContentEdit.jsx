/* eslint-disable no-alert */
/* eslint-disable no-empty */
import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import Axios from 'axios';
import { Typography, Button, TextField } from '@material-ui/core';
import hljs from 'highlight.js';

const ContentEdit = ({ selectedContent, fetchCourseData }) => {
  // const classes = useStyles();
  const mdParser = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight(str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (__) { }
      }
      return ''; // use external default escaping
    },
  });
  const [contentBody, setContentBody] = useState('');
  const [contentTitle, setContentTitle] = React.useState(selectedContent.title);
  const handleContentTitleChange = (e) => {
    setContentTitle(e.target.value);
  };

  let mdEditor = null;
  const fetchContentBody = () => {
    Axios.get(`/api/content_file?id=${selectedContent.id}`)
      .then((res) => {
        setContentBody(`${res.data}`);
      })
      .catch(() => {
        setContentBody('');
      });
  };

  const handleSaveClick = () => {
    const body = mdEditor.getMdValue();
    Axios.post('/api/content_file', {
      body,
      id: selectedContent.id,
      title: contentTitle,
    })
      .then(() => {
        alert('File Saved!');
        fetchCourseData();
      })
      .catch(() => {
        alert('Fail to save file!');
      });
  };


  useEffect(() => {
    fetchContentBody();
  });

  return (
    <Typography component="span" paragraph>
      <TextField
        id="standard-basic"
        label="Content Title"
        defaultValue={selectedContent.title}
        onChange={handleContentTitleChange}
      />
      <Button variant="contained" onClick={handleSaveClick}> SAVE </Button>
      <MdEditor
        // eslint-disable-next-line no-return-assign
        ref={(node) => mdEditor = node}
        value={contentBody}
        renderHTML={(text) => mdParser.render(text)}
        id={selectedContent.id}
        style={{ height: '600px' }}
      />
    </Typography>
  );
};

ContentEdit.propTypes = {
  selectedContent: propTypes.shape({
    id: propTypes.number,
    title: propTypes.string,
  }),
  fetchCourseData: propTypes.func.isRequired,
};

ContentEdit.defaultProps = {
  selectedContent: null,
};

export default ContentEdit;
