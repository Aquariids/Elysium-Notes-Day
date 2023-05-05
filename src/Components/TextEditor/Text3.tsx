import React, { useState, useEffect } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';

const DraftEditorRawExample = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    const rawEditorData = getSavedEditorData();
    if (rawEditorData !== null) {
      const contentState = convertFromRaw(rawEditorData);
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  const onChange = (editorState) => {
    const raw = convertToRaw(editorState.getCurrentContent());
    saveEditorContent(raw);
    setEditorState(editorState);
  };

  const saveEditorContent = (data) => {
    localStorage.setItem('editorData', JSON.stringify(data));
  };

  const getSavedEditorData = () => {
    const savedData = localStorage.getItem('editorData');
    return savedData ? JSON.parse(savedData) : null;
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return true;
    }
    return false;
  };

  const renderContentAsRawJs = () => {
    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    return JSON.stringify(raw, null, 2);
  };

  return (
    <div>
      <h4>Draft js editor</h4>
      <div className="editor-container">
        <Editor
          handleKeyCommand={handleKeyCommand}
          editorState={editorState}
          onChange={onChange}
        />
      </div>
      <h4>Editor content as raw JS</h4>
      <pre>{renderContentAsRawJs()}</pre>
    </div>
  );
};

export default DraftEditorRawExample;