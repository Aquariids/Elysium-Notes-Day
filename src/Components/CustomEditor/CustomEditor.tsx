import { SetStateAction, useEffect, useState, useCallback } from "react";
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
import { Session } from "next-auth";

const CustomEditor = ({ id }: any) => {
  const { data: session } = useSession();
  const _id = id;

  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createWithContent(convertFromRaw(emptyRawContentState))
  );

  const handleEditorChange = useCallback(
    (editorState: SetStateAction<EditorState>) => {
      setEditorState(editorState);
    },
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      if (_id) {
        const data = await fetch(`/api/getData?_id=${_id}`);
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
    };

    fetchData();
  }, [_id, session]);
  useEffect(() => {
    const updateData = async (editorState: EditorState, session: Session | null, _id: any) => {
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
        console.log("🚀 ~ file: CustomEditor.tsx:66 ~ updateData ~ error:", error)
        // Обработка ошибок, если необходимо
      }
    };
  
    const timer = setTimeout(() => {
      updateData(editorState, session, _id);
      console.log('дав');
      
    }, 300);
  
    return () => clearTimeout(timer);
  }, [editorState, session, _id]);
  
  return (
    <>
      <ToolbarButtons
        editorState={editorState}
        setEditorState={setEditorState}
      />

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
