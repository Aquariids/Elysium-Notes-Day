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

const updateData = async (editorState: EditorState, session: Session | null, _id: any) => {
  const content = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
  const data = {
    email: session?.user.email,
    userId: session?.user.userId,
    _id: _id,
    body: content,
  };

  const response = await fetch(`/api/updateData`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

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
    setTimeout(() => {
      updateData(editorState, session, _id);
    }, 1000);
    console.log("пусть будет пока что так");
  }, [editorState]);

  return (
    <>
      <ToolbarButtons
        editorState={editorState}
        setEditorState={setEditorState}
      />
      <button onClick={() => updateData(editorState, session, _id)}>нажми</button>

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
