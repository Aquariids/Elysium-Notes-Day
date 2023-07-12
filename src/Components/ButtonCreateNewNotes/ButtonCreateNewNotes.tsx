import { emptyRawContentState } from "contenido";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";


const ButtonCreateNewNotes = () => {
  const {data: session} = useSession();
   // emptyRawContentState - пустой объект содержимого draft js. Превращаем его в JSON и отправляем в базу
  const content = JSON.stringify(emptyRawContentState); 

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
      router.push(`/mainPage/${responseData._id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={create}>Создать новую заметку</button>;
};

export default ButtonCreateNewNotes;
