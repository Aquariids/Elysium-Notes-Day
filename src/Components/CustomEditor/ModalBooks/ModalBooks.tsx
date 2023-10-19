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
import { useSession } from "next-auth/react";
import DropdownMenuEditor from "@/Components/UI/DropdownMenu/DropdownMenu";
import DotsMenu from "./dots.svg";
import { useRouter } from "next/router";
const ModalBooks = ({ active, setActive, setUpdateBooks, session }: any) => {
  const [currentIdPage, setCurrentIdPage] = useState<string>("");
  const [activeLink, setActiveLink] = useState<any>(false);
  const [bookName, setBookName] = useState<string>("");
  const email = session.data?.user.email;
  console.log("🚀 ~ file: ModalBooks.tsx:20 ~ ModalBooks ~ email:", email)
  const userId = session.data?.user.userId;
  console.log("🚀 ~ file: ModalBooks.tsx:22 ~ ModalBooks ~ userId:", userId)
  const [dataBook, setDataBook] = useState<any>();
  const [idForBook, setIdForBook] = useState<any>();
  const [activeModal, setActiveModal] = useState(false);
  const router = useRouter();
  let idPageCounter = dataBook && dataBook.length;

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
      const dataIdPage =  {
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

      if(res.ok)  {
        getDatabook();
        setActiveModal(false);
      }
      
    } catch (err) {
      console.error(err)
    }
  }
  async function getIdForBookMain() {
    try {
      const idPageForBooks = await fetch(
        `/api/getData?action=${get_action.id_for_books}&userId=${userId}&email=${email}`
      );
      const answ = await idPageForBooks.json();
      setIdForBook(answ)
    }

    catch(err) {
      console.error(err)
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
          <h1>ВСЕ</h1>
          <Xmark onClick={() => {
           setUpdateBooks('Я жалкий');
            setActive(false)}} />
        </span>
        <div className={s.body__content}>
          <div>
            <input
              onChange={(e) => setBookName(e.target.value)}
              placeholder="создать блокнот"
              value={bookName}
            />
            <button
              disabled={!bookName && true}
              className={cn(s.btn, {})}
              onClick={() => {
                setUpdateBooks('Создал запись');
                buttonCreateNewBook(bookName);
                setBookName("");
                
              }}
            >
              Создать блокнот
            </button>

            <div className={s.books}>
              <div className={s.books__list}>
                <span
                  className={cn({
                    [s.test]: idForBook == 'all',
                    [s.test2]: currentIdPage == 'all'
                  })}
                  onClick={(e) => {
                    setCurrentIdPage("all");
                    setActiveLink("all");
                    
                  }}
                >
                  Все
                </span>
                {dataBook &&
                  dataBook.map((item: any, i: number) => {
                    return (
                      <div key={i} className={s.bookLink}>
                        <span
                          className={cn({
                            [s.test]: idForBook == item.idPage,
                            [s.test2]: currentIdPage === String(item.idPage),
                          })}
                          onClick={(e) => {
                            setCurrentIdPage(String(item.idPage));
                            setActiveLink(item);
                          }}
                        >
                          {item.name}
                        </span>
                        <DropdownMenuEditor
                          style={s}
                          activeModal={activeModal}
                          icon={<DotsMenu />}
                        >
                          <div
                            className={s.delete__btn}
                            onClick={() => {
                              setActiveModal(true)
                              deleteBook(item._id, item.idPage);
                              setUpdateBooks('Удалил запись');
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
            <button onClick={() => {
              setActive(false);
              setActiveLink('');
              setCurrentIdPage('')
              getIdForBookMain();
              setUpdateBooks('Я даун');
            }}>Отмена</button>
            <button
              disabled = {!activeLink && true}
              className={s.btn__confirm}
              onClick={() => {
                updateBookForNotes(currentIdPage && currentIdPage);
                setActive(false);
                setActiveLink('')
                currentIdPage === 'all' && setIdForBook('all')
                setCurrentIdPage('')
                getIdForBookMain();
                
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
