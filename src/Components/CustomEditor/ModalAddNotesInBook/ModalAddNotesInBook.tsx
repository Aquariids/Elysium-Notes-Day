import { useCallback, useEffect, useState } from "react";
import { get_action, update_action } from "../../../../pages/api/actios";
import s from "./ModalAddNotesInBook.module.scss";
import cn from "classnames";
import { useRouter } from "next/router";
import Xmark from "./xmark.svg";
import Done from './done.svg';
const ModalAddNotesInBook = ({
  active,
  setActive,
  currentNote,
  session,
  
}: any) => {

  const router = useRouter();
  const [currentIdPage, setCurrentIdPage] = useState<string>("");
  const [activeLink, setActiveLink] = useState<any>(false);
  const [allBooks, setAllBooks] = useState([]);
  const email = session?.user.email;
  const userId =  session?.user.userId;

  const getBook = useCallback(async () => {
    const resBook = await fetch(
      `/api/getData?action=${get_action.id_page_book}&userId=${userId}&email=${email}`
    );
    const databook = await resBook.json();
    setAllBooks(databook)
  },[allBooks])

  useEffect(() => {
    getBook();
  }, [router])
  
  function close () {
    setActive(false)
    setTimeout(() => {
      setActiveLink('')
    },1000)
  }

  const addIdPageForNote = async () => {
    
    
    const data = {
      email: email,
      userId:userId,
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
             {allBooks && allBooks.map((item: any, i:number) => {
  
            return (
                <span
                className={cn({
                  [s.currentActiveBook]: activeLink._id === item._id,
                  [s.activeBook]: currentNote.idPage === String(item.idPage) && !activeLink,
                })}
                  onClick={(e) => {
                    setCurrentIdPage(String(item.idPage));
                    setActiveLink(item)
                  }}
                  key={item._id}
                >
                  <div className={s.content_link}>
                            <Done
                              className={cn(s.hide, {
                                [s.show]:
                                  (activeLink._id  == item.idPage &&
                                    !currentIdPage) ||
                                  currentIdPage === String(item.idPage),
                              })}
                            />{" "}
                            <span className={s.text}>{item.name}</span>
                          </div>
                </span>
              );
            })}
          </div>
          <div className={s.footer__buttons}>
            <button className={s.btn} onClick={close}>Отмена</button>
            <button className={s.btn} disabled={activeLink._id && String(activeLink.idPage) !== currentNote.idPage ? false : true} onClick={()=> {
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
