import * as React from 'react';
import { convertFromRaw, convertToRaw, Editor, EditorState } from 'draft-js';
import { useEditorApi } from './context';
import cn from 'classnames';
import { BLOCK_RENDER_MAP, CUSTOM_STYLE_MAP } from './config';
import { ITextEditorProps } from './TextEditor.props';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const emptyContentState = convertFromRaw({
  blocks: [
      {
          text: "",
          key: "foo",
          type: "unstyled",
          entityRanges: [],
      },
  ],
  entityMap: {},
});


const TextEditor: React.FC<ITextEditorProps> = ({ className }) => {
  const { data: session, status } = useSession();
  const userId = session?.user.userId;
  const [newData, setNewData] = useState<any>();

  // const [text, setText] = useState<any>();
  // onChange(newEditorState)
  // const [state1, setState] = React.useState(() => EditorState.createEmpty());

  const [state, setState] = React.useState({editorState:EditorState.createWithContent(emptyContentState)});
  const onChange = (editorState: any) => {
    const contentState =  editorState
  }
  async function updateData() {
    // получаем состояние редактора(contentState) с помощью getCurrentContent()
    const contentState = state.editorState.getCurrentContent();
    // преобразуем в сырой объект тдля отпарки в базу данных
    const dataRaw = convertToRaw(contentState);
    

    const data = { // отправляем в базу
      email: session?.user.email, // мыло пользователя
      userId: userId, // айди пользователя
      body: dataRaw // данные редактора
    };

    const response = await fetch('/api/updateChek', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)

    });


  }

  // const  getDataFromBd = async () => {
  //       // сразу получаем данные
  //   fetch(`/api/chek?userId=${userId}`).then(response => response.json())
  //   .then(newContentState => convertFromRaw(newContentState))
  //   .then(newEditorState => EditorState.createWithContent(newEditorState))
  //   .then((newEditorState) => {
  //     onChange(newEditorState);
  //   })
  //       // преобразуем сырой объект в contentState то есть в состояние для редактора
  //       // создаем новое состаяние на основе полученных данных выше
  //   // меням состояние
    
  // }

  
const  getDataFromBd = async () => {
fetch(`/api/chek?userId=${userId}`).then(response => response.json())
.then(rawContent => {
  if(rawContent) {
    setNewData({editorState:EditorState.createWithContent(convertFromRaw(rawContent))})
  } else {
    setNewData({editorState: EditorState.createWithContent(emptyContentState)})
  }
})

}
  // useEffect(() => {
  //   getDataFromBd()
  // }, [session])

//   const newData = state.getCurrentContent();

// const text = newData.getPlainText();
  return (
    <div className={cn("text-editor", className)}>
      <Editor
        handleKeyCommand={handleKeyCommand}
        editorKey="editor"
        editorState={state}
        onChange={onChange}
        blockRenderMap={BLOCK_RENDER_MAP}
        customStyleMap={CUSTOM_STYLE_MAP}
      />
      <button onClick={updateData}>Нажми</button>
      <div>
      {/* {state && state.getCurrentContent().getPlainText()} */}
      </div>
      <div>

      </div>
    </div>
  );
}

export default TextEditor;