import { useCallback, useEffect, useState } from "react";
import { get_action, update_action } from "../../../../pages/api/actions";
import s from "./ModalAddNotesInBook.module.scss";
import cn from "classnames";
import { useRouter } from "next/router";
import Xmark from "./xmark.svg";
import Done from "./done.svg";
const ModalAddNotesInBook = ({
  active,
  setActive,
  currentNote,
  session,
  updateBooks
}: any) => {
  console.log("🚀 ~ updateBooks:", updateBooks)

  const router = useRouter();
  const [currentIdPage, setCurrentIdPage] = useState<string>("");
  const [activeLink, setActiveLink] = useState<any>(false);
const [test, setTest] = useState(true)
  const [allBooks, setAllBooks] = useState([]);
  const email = session?.user.email;
  const userId = session?.user.userId;

  const getBook = useCallback(async () => {
    const resBook = await fetch(
      `/api/getData?action=${get_action.get_all_user_notebook}&userId=${userId}&email=${email}`
    );
    const databook = await resBook.json();
    setAllBooks(databook);
  }, [updateBooks]);

  useEffect(() => {
    getBook();
  }, [updateBooks]);

  function close() {
    setActive(false);
    setTimeout(() => {
      setActiveLink("");
    }, 1000);
  }

  const addIdPageForNote = async () => {
    const data = {
      email: email,
      userId: userId,
      _id: currentNote._id,
      idPage: currentIdPage,
    };
    const res = await fetch(
      `/api/updateData?action=${update_action.update_notebook_id_for_note}`,
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
            {allBooks && allBooks.length > 0 ? (
              allBooks.map((item: any, i: number) => {
                return (
                  <span
                    className={cn({
                      [s.currentActiveBook]: activeLink._id === item._id,
                      [s.activeBook]:
                        currentNote.idPage === String(item.idPage) &&
                        !activeLink,
                    })}
                    onClick={(e) => {
                      setCurrentIdPage(String(item.idPage));
                      setActiveLink(item);

                      if(activeLink._id === item._id) {
                        
                        
                      }
                    }}
                    key={item._id}
                  >
                    <div className={s.content_link}>
                      <Done
                        className={cn(s.hide, {
                          [s.show]:
                            (activeLink._id === item._id && !currentIdPage) ||
                            currentNote.idPage === String(item.idPage),
                        })}
                      />{" "}
                      <span className={s.text}>{item.name}</span>
                    </div>
                  </span>
                );
              })
            ) : (
              <span>Здесь нет доступных книг</span>
            )}
          </div>
          <div className={s.footer__buttons}>
            <button className={s.btn} onClick={close}>
              Отмена
            </button>
            <button
              className={s.btn}
              disabled={
                activeLink._id && 
                String(activeLink.idPage) !== currentNote.idPage
                  ? false
                  : true
                  
              }
             
              onClick={() => {
                addIdPageForNote();
                setActive(false);
              }}
            >
              Готово
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAddNotesInBook;
