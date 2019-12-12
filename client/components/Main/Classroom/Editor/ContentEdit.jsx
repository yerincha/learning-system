import React from 'react';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';

const ContentEdit = ({ selectedContent}) => {
  const MOCK_DATA = 'Hello.\n\n * This is markdown.\n * It is fun\n * Love it or leave it.';
  const mdParser = new MarkdownIt();

  // handleEditorChange({ html, text }) {
  //   console.log('handleEditorChange', html, text);
  // }

  const data = () => {
    let result = '';
    if(selectedContent.data) {
      result = selectedContent.data;
    }
    return result;
  }

  return (
    <MdEditor
      value={data()}
      renderHTML={(text) => mdParser.render(text)}
    // onChange={this.handleEditorChange}
    />
  );
};

ContentEdit.propTypes = {

};

export default ContentEdit;
