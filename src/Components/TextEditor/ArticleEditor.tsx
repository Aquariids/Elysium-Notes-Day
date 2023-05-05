import React, { useEffect } from 'react';
import { ContentState, convertFromRaw, convertToRaw, Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';


const emptyContentState = convertFromRaw({
  entityMap: {},
  blocks: [
    {
      text: "",
      key: "foo",
      type: "unstyled",
      entityRanges: [],
    },
  ],
});


function MyEditor(value: any) {

  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(emptyContentState)
  );
  const data = editorState.getCurrentContent();
  const content = JSON.stringify(convertToRaw(data))
  const data11 = JSON.parse(content);
  return (
    <>
      <Editor editorState={editorState} onChange={setEditorState} />
      {data11.blocks.map(item => {
        console.log(item.text);
      })}
    </>
  )
}

export default MyEditor;