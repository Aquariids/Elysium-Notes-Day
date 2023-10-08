import { useState } from "react";
import { update_action } from "../../../../pages/api/actios";
import s from "./ModalAddNotesInBook.module.scss";
import cn from 'classnames';
const ModalAddNotesInBook = ({ books = [], active, setActive, currentNote,session }: any) => {
const [currentIpPage, setCurrentIdPage] = useState('')
  console.log("🚀 ~ file: ModalAddNotesInBook.tsx:7 ~ ModalAddNotesInBook ~ currentIpPage:", currentIpPage)
  const addIdPageForNote = () => {
    const data = {
        email: session?.user.email,
        userId: session?.user.userId,
        _id: currentNote._id,
        idPage: currentIpPage,
    }
    const res  = fetch(`/api/updateData?action=${update_action.update_id_page}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    } );
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
