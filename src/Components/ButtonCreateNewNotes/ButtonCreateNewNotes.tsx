import { emptyRawContentState } from "contenido";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {useState } from "react";

const ButtonCreateNewNotes = ({userId}:any) => {
  const emptyContentState = convertFromRaw(emptyRawContentState);
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createWithContent(emptyContentState)
  );
  const {data: session, status} = useSession();
  const content = JSON.stringify(
    convertToRaw(editorState.getCurrentContent())
  );
  const router = useRouter()
  const create = async () => { 

    const data = {
      userId: session?.user.userId,
      email: session?.user.email,
      body: content, // данные редактора
    };

    try {
      const response = await fetch("/api/createData", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      router.push(`/MainPage/${responseData._id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={create}>Создать новую заметку</button>;
};

export default ButtonCreateNewNotes;
