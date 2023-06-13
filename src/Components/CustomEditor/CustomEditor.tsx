import { SetStateAction, useEffect, useState } from "react";
import {
    ContentState,
  convertFromRaw,
  convertToRaw,
  EditorState,
  RawDraftContentState,
} from "draft-js";
import {
  Editor,
  getDefaultKeyBindingFn,
  shortcutHandler,
  emptyRawContentState,
} from "contenido";
import ToolbarButtons from "./ToolbarButtons";
import { useSession } from "next-auth/react";
import draftToHtml from 'draftjs-to-html';


const CustomEditor = () => {
// получаем сессию авторизованного человека
  const { data: session, status } = useSession();
  const userId = session?.user.userId; // айди авторизованного человека

  async function updateData() {
    // получаем состояние редактора(contentState) с помощью getCurrentContent()
    // const contentState = editorState.getCurrentContent();
    // // преобразуем в сырой объект тдля отпарки в базу данных
    // const dataRaw = convertToRaw(contentState);
    const content = JSON.stringify(convertToRaw(editorState.getCurrentContent()));

    const data = { // отправляем в базу
      email: session?.user.email, // мыло пользователя
      userId: userId, // айди пользователя
      body: content // данные редактора
    };

    const response = await fetch('/api/updateData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)

    });


  }
  const emptyContentState = convertFromRaw(emptyRawContentState);
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createWithContent(emptyContentState)
  );

const handleEditorChange = (editorState: SetStateAction<EditorState>) => {
    setEditorState(editorState);
  };
  const [test,setTest] = useState<any>();

  // получаем состояние редактора(contentState) с помощью getCurrentContent()
//   const data = editorState.getCurrentContent();
  // преобразуем в сырой объект тдля отпарки в базу данных
//   const dataRaw = convertToRaw(data);

//   useEffect(() => {
//     fetch(`/api/getData?userId=${userId}`)
//     .then(response => response.json())
//     .then(data => {
//         const body = draftToHtml(data);
//         setTest(body)
//     })
//   },[session])

useEffect(() => {
    async function fetchData() {
        if(userId) {
            const response = await fetch(`/api/getData?userId=${userId}`);
            const data = await response.json();
            const contentState = convertFromRaw(JSON.parse(data));
            setEditorState(EditorState.createWithContent(contentState));
      
        }
   
    }

    fetchData();
  },[session]);


  
  return (
    <>
      <ToolbarButtons
        editorState={editorState}
        setEditorState={setEditorState}
      />
      <button onClick={updateData}> нажми </button>

      <Editor
        editorKey="editor"
        editorState={editorState}
        onChange={handleEditorChange }
        handleKeyCommand={shortcutHandler(setEditorState)}
        keyBindingFn={getDefaultKeyBindingFn}
      />

    
    </>
  );
};

export default CustomEditor;
