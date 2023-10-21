import { useCallback, useEffect, useState } from "react";
import {
  create_data,
  delete_restore_action,
  get_action,
  update_action,
} from "../../../../pages/api/actios";
import s from "./ModalBooks.module.scss";
import cn from "classnames";
import Xmark from "./xmark.svg";
import DropdownMenuEditor from "@/Components/UI/DropdownMenu/DropdownMenu";
import DotsMenu from "./dots.svg";
import { useRouter } from "next/router";
import Done from "./done.svg";
const ModalBooks = ({ active, setActive, userId, email }: any) => {
  const [currentIdPage, setCurrentIdPage] = useState<string>("");
  const [activeLink, setActiveLink] = useState<any>(false);
  const [bookName, setBookName] = useState<string>("");
  const [dataBook, setDataBook] = useState<any>();
  const [idForBook, setIdForBook] = useState<any>();
  const [activeModal, setActiveModal] = useState(false);
  const router = useRouter();
  let idPageCounter = dataBook && dataBook.length;

  function close () {
    setActive(false);

    setTimeout(() => {
      setActiveLink("");
      setCurrentIdPage("");
      getIdForBookMain();
      setBookName("");
    },1000)
  
  }

  function returnPageAll() {
    updateBookForNotes("all");
    setActive(false);
    router.push(router.asPath);
  }

  const updateBookForNotes = useCallback(async (idForBook: any) => {
    try {
      const response = await fetch(
        `/api/updateData?action=${update_action.update_id_book_for_all_notes}`,
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

      if (response.ok) router.push(router.asPath);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const updateNameBookForNotes = useCallback(async (name: any) => {
    try {
      const response = await fetch(
        `/api/updateData?action=${update_action.update_id_book_for_all_notes}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            email,
            name: name,
          }),
        }
      );

      if (response.ok) router.push(router.asPath);
    } catch (err) {
      console.error(err);
    }
  }, []);

  async function getDatabook() {
    try {
      const res = await fetch(
        `/api/getData?action=${get_action.id_page_book}&userId=${userId}&email=${email}`
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
      const resIdPageNotes = await fetch(
        `/api/getData?action=${get_action.data_editorBook}&userId=${userId}&email=${email}&idPage=${idPage}`
      );
      const data = await resIdPageNotes.json();
      const dataIdPage = {
        userId: userId,
        email: email,
        idPage: data[0] ? data[0].idPage : "",
      };
      const deleteIdPage = await fetch(
        `/api/updateData?action=${update_action.delete_id_page}`,
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
      }
    } catch (err) {
      console.error(err);
    }
  }
  async function getIdForBookMain() {
    try {
      const idPageForBooks = await fetch(
        `/api/getData?action=${get_action.id_for_books}&userId=${userId}&email=${email}`
      );
      const [idPage, nameBook] = await idPageForBooks.json();
      setIdForBook(idPage);
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    getDatabook();
    getIdForBookMain();
  }, [userId]);

  async function buttonCreateNewBook(nameBook: string) {
    try {
      const res = await fetch(
        `/api/createData?action=${create_data.create_book}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: nameBook,
            idPage: idPageCounter,
            email: email,
            userId: userId,
          }),
        }
      );

      getDatabook();
    } catch (err) {
      console.error(err);
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
         
          <Xmark
            onClick={close}
          />
        </span>
        <div className={s.body__content}>
          <div>
            <div style={{display: 'flex', flexDirection:'column'}}>
            <input maxLength={30}className={s.body__input}
              onChange={(e) => {
                setBookName(e.target.value);
              }}
              placeholder="Введите название..."
              value={bookName}
            />
            <button
              disabled={!bookName && true}
              className={cn(s.btn__input,s.btn)}
              onClick={() => {
                buttonCreateNewBook(bookName);
                updateNameBookForNotes(bookName);
                setBookName("");
                router.push(router.asPath);
              }}
            >
              Создать блокнот
            </button>
            </div>
            <div className={s.books}>
              <div className={s.books__list}>
                <p className={s.title_books}>ПЕРЕЙТИ В БЛОКНОТ:</p>
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
                              router.push(router.asPath);
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
            <button
            className={s.btn}
              onClick={close}
            >
              Отмена
            </button>
            <button
              disabled={!activeLink && true || String(idForBook) === currentIdPage}
              className={s.btn}
              onClick={() => {
                updateBookForNotes(currentIdPage && currentIdPage);
                currentIdPage === "all" && setIdForBook("all");
                close()
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
