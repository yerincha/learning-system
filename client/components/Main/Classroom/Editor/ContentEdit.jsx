import React, { useState, useEffect } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import Axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const ContentEdit = ({ selectedContent }) => {
  const classes = useStyles();
  const mdParser = new MarkdownIt();
  const [contentBody, setContentBody] = useState('');
  // handleEditorChange({ html, text }) {
  //   console.log('handleEditorChange', html, text);
  // }
  let mdEditor = null;
  const fetchContentBody = () => {
    Axios.get(`/api/content_file?id=${selectedContent.id}`)
      .then((res) => {
        console.log('loaded body', res.data);
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
    })
      .then(() => {
        alert('File Saved!');
      })
      .catch(() => {
        alert('Fail to save file!');
      });
  };


  useEffect(() => {
    fetchContentBody();
  });

  console.log('changing?????', selectedContent);
  console.log('contentBody?', contentBody);
  return (
    <main className={classes.content}>
      <Typography paragraph>
        <Button onClick={handleSaveClick}> SAVE </Button>
        <MdEditor
          // eslint-disable-next-line no-return-assign
          ref={(node) => mdEditor = node}
          value={contentBody}
          renderHTML={(text) => mdParser.render(text)}
          id={selectedContent.id}
          style={{ height: '600px' }}
        // onChange={this.handleEditorChange}
        />
      </Typography>
    </main>
  );
};

ContentEdit.propTypes = {

};

export default ContentEdit;
