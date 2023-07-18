import { SetStateAction, useEffect, useState, useCallback, use, useInsertionEffect, useContext } from "react";
import {convertFromRaw, convertToRaw, EditorState, genKey } from "draft-js";
import {
  getDefaultKeyBindingFn,
  shortcutHandler,
  emptyRawContentState,
} from "contenido";
import ToolbarButtons from "./ToolbarButtons";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import Editor from '@draft-js-plugins/editor';
import s from './CustomEditor.module.scss'
import { useRouter } from "next/router";
import { AppContext } from "../../../context/app.context";
const CustomEditor = ({ id, body, title,setCheckTitle,checkTitle }: any) => {

  const [value, setValue] = useState('');
  const { data: session } = useSession();
  const router = useRouter()
  const _id = id;
  // const { title1 } = useContext(AppContext);


  


  // convertFromRaw - с помощью этого метода мы наш пустой объект превращаем в спец объект для draft js
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createWithContent(convertFromRaw(emptyRawContentState)) // и теперь на основе нашего спец объекта мы создаем состояние редактора. Изначально оно пустое.
  );

  const handleEditorChange = (editorState: SetStateAction<EditorState>) => {
      setEditorState(editorState);
    }

  useEffect(() => {
        if (body) {
         
            const contentState = convertFromRaw(JSON.parse(body)); // тут мы парсим данные с базы в спец объект draft js
            setEditorState(EditorState.createWithContent(contentState)); // и на его основе меняем состояние редактора\
            setValue(title)

          } 

  }, [_id, session]);
  useEffect(() => {
    if (title) {
     
        setValue(title)

      } 

}, [_id, session]);
 
  useEffect(() => {
  
    const updateData = async (editorState: EditorState, session: Session | null, _id: any,) => {
       // convertToRaw превращает объект draft js в обычный объект, который мы сразу бахаем в json, что бы отправить в базу данных
      const content = JSON.stringify(convertToRaw(editorState.getCurrentContent())); // getCurrentContent - возваращет нам состояние редактора в спец объект draft js
      const data = {
        email: session?.user.email,
        userId: session?.user.userId,
        _id: _id,
        body: content,
        title:value // короче делай отдельную функцию для  title обновления ее. Это будет только под тело! 
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
        console.log("🚀 ~ file: CustomEditor.tsx:66 ~ updateData ~ error:", error)
        // Обработка ошибок, если необходимо
      }

     
    };
  
    const timer = setTimeout(() => {
      updateData(editorState, session, _id);
    }, 200);
  
    return () => clearTimeout(timer);
  }, [editorState, session, _id,]);

  useEffect(() => {
    const updateTitle = async (session: Session | null, _id: any,) => {
      // convertToRaw превращает объект draft js в обычный объект, который мы сразу бахаем в json, что бы отправить в базу данных
     const data = {
       email: session?.user.email,
       userId: session?.user.userId,
       _id: _id,
       title:value // короче делай отдельную функцию для  title обновления ее. Это будет только под тело! 
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
       console.log("🚀 ~ file: CustomEditor.tsx:66 ~ updateData ~ error:", error)
       // Обработка ошибок, если необходимо
     }

    
   };


   const timer = setTimeout(() => {
    updateTitle(session, _id);
    setCheckTitle(!checkTitle);
  }, 200);

  return () => clearTimeout(timer);
 
  },[value])
  
  return (
    <>
    
    <div className={s.toolbar}>
      <ToolbarButtons
        editorState={editorState}
        setEditorState={setEditorState}
      />

      <div className={s.body}>
      <input placeholder="Заголовок " className={s.title} value={value} onChange={(e)=> setValue(e.target.value)}/>
      <Editor 
        placeholder="Введите текст"
        editorKey="editor"
        editorState={editorState}
        onChange={handleEditorChange}
        handleKeyCommand={shortcutHandler(setEditorState)}
        keyBindingFn={getDefaultKeyBindingFn}
      />
      </div>
      </div>
    </>
  );
};

export default CustomEditor;
