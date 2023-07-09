import { emptyRawContentState } from "contenido";
import { convertFromRaw } from "draft-js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { AppContext } from "../../../context/app.context";

const ButtonCreateNewNotes = ({userId}:any) => {
  const emptyContentState = convertFromRaw(emptyRawContentState);
  const {data: session, status} = useSession();
  
  const router = useRouter()
  const create = async () => { 
    const data = {
      userId: session?.user.userId,
      email: session?.user.email,
      body: emptyContentState, // данные редактора
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
