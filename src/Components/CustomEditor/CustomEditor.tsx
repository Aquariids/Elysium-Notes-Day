import { SetStateAction, useCallback, useEffect, useState } from "react";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import {
  getDefaultKeyBindingFn,
  shortcutHandler,
  Editor,
  initialStyleMap,
  blockStyleFn,
} from "contenido";
import ToolbarButtons from "./ToolbarButtons";
import { useSession } from "next-auth/react";
import s from "./CustomEditor.module.scss";
import TextareaAutosize from 'react-textarea-autosize';
const CustomEditor = ({
  id,
  body,
  title,
  setCheckTitle,

}: any) => {
  const [value, setValue] = useState(title);
  const { data: session } = useSession();
  const _id = id;

 
  // convertFromRaw - с помощью этого метода мы наш пустой объект превращаем в спец объект для draft js
  const [editorState, setEditorState] = useState(() => {
    const contentState = convertFromRaw(JSON.parse(body)); // и теперь на основе нашего спец объекта мы создаем состояние редактора. Изначально оно пустое.
    return EditorState.createWithContent(contentState);
  });
 
  const handleEditorChange = useCallback((editorState: SetStateAction<EditorState>) => {
    setEditorState(editorState);
  }, []);

  useEffect(() => {
    if (body) {
      const contentState = convertFromRaw(JSON.parse(body)); // тут мы парсим данные с базы в спец объект draft js
      setEditorState(EditorState.createWithContent(contentState)); // и на его основе меняем состояние редактора\
     
    }
  }, [body]);

  

useEffect(() => {
  setValue(title);
}, [title])
  
  const updateData = useCallback(async (editorState:any, session: any, _id:string) => {
    
    const content = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    const data = {
      email: session?.user.email,
      userId: session?.user.userId,
      _id: _id,
      body: content,
    };

    try {
      const response = await fetch(`/api/updateData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.log("🚀 ~ file: CustomEditor.tsx:66 ~ updateData ~ error:", error);
    }
  }, []);

  const updateTitle = useCallback(async (session:any, _id:string, title:string) => {
    
    const data = {
      email: session?.user.email,
      userId: session?.user.userId,
      _id: _id,
      title: title,
    };

    try {
      const response = await fetch(`/api/updateTitle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      alert(error);
    }
  }, []);



  useEffect(() => {
    const timer = setTimeout(() => {
      updateData(editorState, session, _id);
      setCheckTitle((prevCheckTitle: boolean) => !prevCheckTitle);
    }, 300);

    return () => clearTimeout(timer);
  }, [editorState, _id, session, updateData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateTitle(session, _id, value);
      setCheckTitle((prevCheckTitle:boolean) => !prevCheckTitle);
    }, 300);

    return () => clearTimeout(timer);
  }, [value, updateTitle]);


  
  const styleMap = {
    ...initialStyleMap,
    COLORIZE: {
      fontWeight: 'bold',
      color: '#4cb5f5',
    },
  };
  return (
    <>
      <div className={s.toolbar}>
        <ToolbarButtons 
          editorState={editorState}
          setEditorState={setEditorState}
        />


        <div className={s.body}>
         
          <TextareaAutosize 
            placeholder="Заголовок"
            value={value}
            className={s.title}
            onChange={(e) => setValue(e.target.value)}
          />
       
          <Editor
            placeholder="Введите текст"
            editorKey="editor"
            editorState={editorState}
            onChange={handleEditorChange}
            handleKeyCommand={shortcutHandler(setEditorState)}
            keyBindingFn={getDefaultKeyBindingFn}
            blockStyleFn={blockStyleFn}
          />
        </div>
      </div>
    </>
  );
};

export default CustomEditor;
