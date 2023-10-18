import { useEffect, useState } from "react";
import { update_action } from "../../../../pages/api/actios";
import s from "./ModalAddNotesInBook.module.scss";
import cn from "classnames";
import { useRouter } from "next/router";
import Xmark from "./xmark.svg";
const ModalAddNotesInBook = ({
  books = [],
  active,
  setActive,
  currentNote,
  session,
  updateBooks
}: any) => {
  const router = useRouter();
  const [currentIdPage, setCurrentIdPage] = useState<string>("");
  const [activeLink, setActiveLink] = useState<any>(false);
  const [allBooks, setAllBooks] = useState(books && books);

  function close () {
    setActive(false)
    setTimeout(() => {
      setActiveLink('')
    },1000)
  }

  const addIdPageForNote = async () => {
    const data = {
      email: session?.user.email,
      userId: session?.user.userId,
      _id: currentNote._id,
      idPage: currentIdPage,
    };
    const res = await fetch(
      `/api/updateData?action=${update_action.update_id_page_one_note}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (res.ok) router.push(router.asPath);
  };
useEffect(() => {
  setAllBooks(books)
},[updateBooks])
  return (
    <div
      className={cn(s.modal, {
        [s.modal__active]: active,
      })}
    >
      <div
        className={cn(s.modal__content, {
          [s.modal__active]: active,
        })}
      >
        <span className={s.header__content}>
          <h1>Переместить заметку в...</h1>
          <Xmark onClick={close} />
        </span>
        <div className={s.body__content}>
          <div className={s.books}>
            {allBooks.map((item: any, i:number) => {
  
              return (
                <span
                className={cn({
                  [s.test]: activeLink._id === item._id,
                  [s.test2]: currentNote.idPage === String(item.idPage) && !activeLink,
                 
                })}
                  onClick={(e) => {
                    setCurrentIdPage(String(item.idPage));
                    setActiveLink(item)
                  }}
                  
                  key={item._id}
                >
                  {item.name}
                </span>
              );
            })}
          </div>
          <div className={s.footer__buttons}>
            <button onClick={close}>Отмена</button>
            <button className={s.btn__confirm} disabled={activeLink._id && String(activeLink.idPage) !== currentNote.idPage ? false : true} onClick={()=> {
              addIdPageForNote()
              setActive(false)
            }}>Готово</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAddNotesInBook;
