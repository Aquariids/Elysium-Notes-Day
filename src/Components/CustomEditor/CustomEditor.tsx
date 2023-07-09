import { SetStateAction, useContext, useEffect, useState } from "react";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import {
  Editor,
  getDefaultKeyBindingFn,
  shortcutHandler,
  emptyRawContentState,
} from "contenido";
import ToolbarButtons from "./ToolbarButtons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { AppContext } from "../../../context/app.context";

// сразу пару моментов. - слишком много рендеринга, надо чет будет делать.
// мне не нужно каждый раз обновлять айди и мыло пользователя - тоже чет делать будем.
// но пока работает и норм. Оптимизация потом.
const CustomEditor = ({id}:any) => {
  const { idPage } = useContext(AppContext);
  
  // получаем сессию авторизованного человека
  const { data: session, status } = useSession();
  const router = useRouter();
  const userId = session?.user.userId; // айди авторизованного человека

  async function updateData() {
    // получаем состояние редактора(contentState) с помощью getCurrentContent()
    // convertToRaw преобразуеnт в сырой объект тдля отпарки в базу данных
    const content = JSON.stringify(
      convertToRaw(editorState.getCurrentContent())
    );

    const data = {
      email: session?.user.email,
      userId:session?.user.userId,
      _id:idPage,
      body: content, // данные редактора
    };

    const response = await fetch("/api/updateData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  const emptyContentState = convertFromRaw(emptyRawContentState);
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createWithContent(emptyContentState)
  );

  const handleEditorChange = (editorState: SetStateAction<EditorState>) => {
    setEditorState(editorState);
  };

  useEffect(()=> {
   setTimeout(() => {
    updateData();
   },500)
   console.log('пусть будет пока что так');
   
  })

  useEffect(() => {
    async function fetchData() {
      if (userId) {
        // получаем данные
        const data = await fetch(`/api/getData?userId=${userId}`);
        if (data) {
          const response = await data.json();
          if (typeof response === "string") {
            const contentState = await convertFromRaw(JSON.parse(response));
            setEditorState(EditorState.createWithContent(contentState));
          } else {
            setEditorState(EditorState.createEmpty());
          }
        } 
      }
    }

    fetchData();
  }, [session]);

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
        onChange={handleEditorChange}
        handleKeyCommand={shortcutHandler(setEditorState)}
        keyBindingFn={getDefaultKeyBindingFn}
      />
    </>
  );
};

export default CustomEditor;
