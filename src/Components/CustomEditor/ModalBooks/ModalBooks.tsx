import { useCallback, useEffect, useState } from "react";
import {
  create_data_action,
  delete_restore_action,
  get_action,
  update_action,
} from "../../../../pages/api/actions";
import s from "./ModalBooks.module.scss";
import cn from "classnames";
import Xmark from "./xmark.svg";
import DotsMenu from "./dots.svg";
import { useRouter } from "next/router";
import Done from "./done.svg";
import dynamic from "next/dynamic";


const ModalBooks = ({ active, setActive, userId, email }: any) => {
  const DropdownMenuEditor = dynamic(( import('@/Components/UI/DropdownMenu/DropdownMenu')))
  const [currentIdPage, setCurrentIdPage] = useState<string>("");
  const [activeLink, setActiveLink] = useState<any>(false);
  const [bookName, setBookName] = useState<string>("");
 
  const [dataBook, setDataBook] = useState<any>();
 
  const [idForBook, setIdForBook] = useState<any>();
  const [activeModal, setActiveModal] = useState(false);
  const router = useRouter();

  function close() {
    setActive(false);
    setTimeout(() => {
      setActiveLink("");
      setCurrentIdPage("");
      getIdForBookMain();
      setBookName("");
    }, 1000);
  }

  function returnPageAll() {
    updateBookForNotes("all");
    setActive(false);
    router.push(router.asPath);
  }

  const updateBookForNotes = useCallback(async (idForBook: any) => {
    try {
      const response = await fetch(
        `/api/updateData?action=${update_action.update_active_notebook}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            email,
            book: idForBook,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        router.push(router.asPath);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  async function getDatabook() {
    try {
      const res = await fetch(
        `/api/getData?action=${get_action.get_all_user_notebook}&userId=${userId}&email=${email}`
      );
      if (!res.ok) {
        throw new Error(`Ошибка при запросе: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setDataBook(data); // Обновляем состояние dataBook
      
    } catch (err) {
      console.error(err);
    }
  }
  async function deleteBook(_id: any, idPage: any) {
    try {
      const dataIdPage = {
        userId: userId,
        email: email,
        idPage: String(idPage),
      };

      const deleteIdPage = await fetch(
        `/api/deleteAndRestoreData?action=${delete_restore_action.remove_notebook_id_from_note}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataIdPage),
        }
      );
      const res = await fetch(
        `/api/deleteAndRestoreData?action=${delete_restore_action.delete_id_page_book}&userId=${userId}&_id=${_id}`
      );

      if (res.ok) {
        getDatabook();
        setActiveModal(false);
        setCurrentIdPage("");
       
      }
    } catch (err) {
      console.error(err);
    }
  }

  
  const getIdForBookMain = useCallback(async () => {
    try {
      const idPageForBooks = await fetch(
        `/api/getData?action=${get_action.get_active_notebook}&userId=${userId}&email=${email}`
      );
      const [idPage, nameBook] = await idPageForBooks.json();
      setIdForBook(idPage);
    } catch (err) {
      console.error(err);
    }
  }, [router]);
  
  useEffect(() => {
    getDatabook();
    getIdForBookMain();
  }, [router]);

  async function buttonCreateNewBook(nameBook: string) {
    function removeStartSpacesAndEnd (string:string) {
      return string.trim();
    }


    
   
    
   const isName = dataBook.some((item: { name: string; }) => removeStartSpacesAndEnd(item.name) === removeStartSpacesAndEnd(nameBook) );
   


   
    let maxIdPage = 0;
    if (dataBook && dataBook.length > 0) {
      maxIdPage = Math.max(
        ...dataBook.map((book: { idPage: any }) => book.idPage)
      );
    }

    if(!isName) {
      try {
        const res = await fetch(
          `/api/createData?action=${create_data_action.create_notebook}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: removeStartSpacesAndEnd(nameBook),
              idPage: maxIdPage + 1,
              email: email,
              userId: userId,
            }),
          }
        );
  
        getDatabook();
      } catch (err) {
        console.error(err);
      }
    } else {
      alert('Это имя уже занято. Назовите блокнот по другому')
      
    }
    
  }

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
          <div>
            <h1>Блокноты:</h1>
            <p>В блокнотах удобно группировать заметки с общей темой.</p>
          </div>

          <Xmark onClick={close} />
        </span>
        <div className={s.body__content}>
          <div className={s.body_wrapper}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <input
                maxLength={30}
                className={s.body__input}
                onChange={(e) => {
                  setBookName(e.target.value);
                }}
                placeholder="Введите название..."
                value={bookName}
              />
              <button
                disabled={!bookName && true}
                className={cn(s.btn__input, s.btn)}
                onClick={() => {
                  buttonCreateNewBook(bookName);
                  setBookName("");
                  router.push(router.asPath)
                }}
              >
                Создать блокнот
              </button>
            </div>
            <div className={s.books}>
            <p className={s.title_books}>ПЕРЕЙТИ В БЛОКНОТ:</p>
              <div className={s.books__list}>
                <span
                  className={cn(s.block, {
                    [s.currentActiveBook]: idForBook == "all" && !currentIdPage,
                    [s.activeBook]: currentIdPage == "all",
                  })}
                  onClick={(e) => {
                    setCurrentIdPage("all");
                    setActiveLink("all");
                  }}
                >
                  <div className={s.content_link}>
                    <Done
                      className={cn(s.hide, {
                        [s.show]:
                          (idForBook == "all" && !currentIdPage) ||
                          currentIdPage == "all",
                      })}
                    />{" "}
                    <span className={s.text}>Все заметки</span>
                  </div>
                </span>
                {dataBook &&
                  dataBook.map((item: any, i: number) => {
                    return (
                      <div key={i} className={s.bookLink}>
                        <span
                          className={cn(s.block, {
                            [s.currentActiveBook]:
                              idForBook == item.idPage && !currentIdPage,
                            [s.activeBook]:
                              currentIdPage === String(item.idPage),
                          })}
                          onClick={(e) => {
                            setCurrentIdPage(String(item.idPage));
                            setActiveLink(item);
                          }}
                        >
                          <div className={s.content_link}>
                            <Done
                              className={cn(s.hide, {
                                [s.show]:
                                  (idForBook == item.idPage &&
                                    !currentIdPage) ||
                                  currentIdPage === String(item.idPage),
                              })}
                            />{" "}
                            <span className={s.text}>{item.name}</span>
                          </div>
                        </span>
                        {/* <span>{`(${dataBook.length})`}</span> */}
                        <DropdownMenuEditor
                          style={s}
                          activeModal={activeModal}
                          icon={<DotsMenu />}
                        >
                          <div
                            className={s.delete__btn}
                            onClick={() => {
                              setActiveModal(true);
                              deleteBook(item._id, item.idPage);
                              idForBook === String(item.idPage) &&
                                returnPageAll();
                              
                            }}
                          >
                            Удалить блокнот
                          </div>
                        </DropdownMenuEditor>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className={s.footer__buttons}>
            <button className={s.btn} onClick={close}>
              Отмена
            </button>
            <button
              className={s.btn}
              disabled={
                (!activeLink && true) ||
                String(idForBook) === currentIdPage ||
                !currentIdPage
              }
              onClick={() => {
                updateBookForNotes(currentIdPage && currentIdPage);
                currentIdPage === "all" && setIdForBook("all");
                close();
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

export default ModalBooks;
