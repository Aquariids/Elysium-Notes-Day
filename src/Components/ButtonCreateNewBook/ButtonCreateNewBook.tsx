import { emptyRawContentState } from "contenido";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NOTES } from "../../../pages/api/paths";
import s from "./ButtonCreateNewBook.module.scss";
import { create_data } from "../../../pages/api/actios";
import cn from 'classnames';
interface IButton {
  alert?: "alert";
}
const ButtonCreateNewBook = ({ dataBook, nameBook,setActiveModalMenu }: any) => {
  const session = useSession();
  const email = session.data?.user.email;
  const userId = session.data?.user.userId;
 async function buttonCreateNewBook(nameBook: string) {
    try {
      const res = fetch(`/api/createData?action=${create_data.create_book}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: nameBook,
          idPage: dataBook.length,
          email: email,
          userId: userId,
        }),
      });


    } catch (err) {
      console.error(err);
    }
  }
    return  (
      <>
      <button onClick={
        ()=> {
          setActiveModalMenu(true)
        }
      } className={s.btn} >
        +
      </button>

      </>
    ) 
};

export default ButtonCreateNewBook;
