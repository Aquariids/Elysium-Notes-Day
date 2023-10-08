import { useState } from "react";
import { update_action } from "../../../../pages/api/actios";
import s from "./ModalAddNotesInBook.module.scss";
import cn from 'classnames';
import { useRouter } from "next/router";
const ModalAddNotesInBook = ({ books = [], active, setActive, currentNote,session }: any) => {
  const router = useRouter()
const [currentIpPage, setCurrentIdPage] = useState('')
  const addIdPageForNote = async () => {
    const data = {
        email: session?.user.email,
        userId: session?.user.userId,
        _id: currentNote._id,
        idPage: currentIpPage,
    }
    const res   = await fetch(`/api/updateData?action=${update_action.update_id_page}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    } );

    if(res.ok) router.push(router.asPath)

  } 
  return (
    <div className={cn(
        s.modal, {
            [s.modal__active]: active
        }
    )} onClick={() => setActive(false)}>
      <div className={cn(s.modal__content, {
        [s.modal__active]: active
      })} onClick={(e) => e.stopPropagation() }>
        <div className={s.books}>
          {books.map((item: any) => {
            return <span onClick={()=> {setCurrentIdPage(String(item.idPage))}} key={item.name}>{item.name}</span>;
          })}
        </div>
        <button onClick={addIdPageForNote}>нажми</button>
      </div>
    </div>
  );
};

export default ModalAddNotesInBook;
