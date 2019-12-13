/* eslint-disable react/no-danger */
/* eslint-disable no-empty */
import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import MarkdownIt from 'markdown-it';
import Axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import hljs from 'highlight.js';

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const ContentView = ({ selectedContent }) => {
  const classes = useStyles();
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

  const fetchContentBody = () => {
    Axios.get(`/api/content_file?id=${selectedContent.id}`)
      .then((res) => {
        setContentBody(`${res.data}`);
      })
      .catch(() => {
        setContentBody('');
      });
  };


  useEffect(() => {
    fetchContentBody();
  });

  const mdHtml = () => (mdParser.render(contentBody));

  return (
    <main className={classes.content}>
      <Typography component="span" paragraph>
        <p dangerouslySetInnerHTML={{ __html: mdHtml() }} />
      </Typography>
    </main>
  );
};

ContentView.propTypes = {
  selectedContent: propTypes.shape({
    id: propTypes.number,
  }),
};

ContentView.defaultProps = {
  selectedContent: null,
};

export default ContentView;
