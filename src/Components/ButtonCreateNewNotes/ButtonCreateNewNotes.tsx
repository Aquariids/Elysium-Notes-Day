import { emptyRawContentState } from "contenido";
import { convertFromRaw } from "draft-js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { AppContext } from "../../../context/app.context";

const ButtonCreateNewNotes = ({userId}:any) => {
  const emptyContentState = convertFromRaw(emptyRawContentState);
  const { idPage, setIdPage } = useContext(AppContext);
  const { data: session, status } = useSession();
  
  const router = useRouter()
  const create = async () => {
    const data = {
      userId: userId,
      email: session?.user.email,
      body: emptyContentState, // данные редактора
    };

     await fetch("/api/createData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      setIdPage(data._id)
      router.push(`/MainPage/${idPage}`);
    })

    

  };

  return <button onClick={create}>Создать новую заметку</button>;
};

export default ButtonCreateNewNotes;
