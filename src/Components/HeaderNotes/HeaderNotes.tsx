import { useEffect, useRef, useState } from "react";
import s from "./HeaderNotes.module.scss";
import Notes from "./notes.svg";
import Recycle from "./recycle.svg";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { delete_restore_action } from "../../../pages/api/actios";
import { RECYCLE } from "../../../pages/api/paths";
import SortIcon from "./sort.svg";
import cn from 'classnames';
const HeaderNotes = ({ data, setSort, sort }: any) => {
  const router = useRouter();
  const routerRecycle = router.asPath.split("/")[1] === RECYCLE;
  const session = useSession();
  const userId = session.data?.user.userId;
  const refActiveMenu = useRef<HTMLDivElement>(null);
  const [sortMenuActive, setSortMenuActive] = useState(false);
  async function deleteAllDataRecycle() {
    let result = confirm(
      "Уверены, что хотите очистить корзину? Данные будут окончательно удалены без возможности восстановления."
    );

    if (result) {
      fetch(
        `/api/deleteAndRestoreData?action=${delete_restore_action.delete_all_notes_recycle}&userId=${userId}`
      ).then(() => {
        router.push(`/${RECYCLE}`);
      });
    }
  }

  const handleOutsideClick = (event: any) => {
    if (
      refActiveMenu.current &&
      !refActiveMenu.current.contains(event.target)
    ) {
      setSortMenuActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, false);
    return () => {
      document.removeEventListener("click", handleOutsideClick, false);
    };
  }, []);
  function dateSort() {
    const sort = localStorage.setItem("sorting", "date");
    setSort(sort);
    router.push(router.asPath);
    
  }

  function normSort() {
    const sort = localStorage.setItem("sorting", "no-date");
    setSort(sort);
    router.push(router.asPath);
  }

  const [counterNotes, setCounterNotes] = useState(data.length);

  useEffect(() => {
    setCounterNotes(data.length);
  }, [router]);

  function declOfNum(number: number, titles: string[]) {
    // это не я такой умный, это не моя функция, ну простите..
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[
      number % 100 > 4 && number % 100 < 20
        ? 2
        : cases[number % 10 < 5 ? number % 10 : 5]
    ];
  }

  const result = `${counterNotes} ${declOfNum(counterNotes, [
    "Заметка",
    "Заметки",
    "Заметок",
  ])}`;
  return (
    <div className={s.header}>
      <div className={s.container}>
        {routerRecycle ? (
          <div className={s.recycle}>
            <Recycle />
            <p className={s.text}>КОРЗИНА</p>{" "}
            <button className={s.recycle_btn} onClick={deleteAllDataRecycle}>
              Очистить корзину
            </button>
          </div>
        ) : (
          <>
            <Notes />
            <p>ЗАМЕТКИ</p>
          </>
        )}
      </div>
      <div className={s.header__foter}>
        <div className={s.allNotesCounter}>{result}</div>
        <div ref={refActiveMenu} className={s.dropdown}>
          <button
            onClick={(e) => {
              setSortMenuActive(!sortMenuActive);
            }}
            className={s.dropbtn}
          >
            {" "}
            <SortIcon />
          </button>
          <div id={s.myDropdown} className={cn(s.dropdown_content, {
            [s.show] : sortMenuActive === true
          })}>
            <span>Сортировать по</span>
            <button
              className={cn(s.btn_sort, {
                [s.active_btn_sort]: sort === 'date'
              })}
              onClick={() => {
                dateSort();
              }}
            >
              дате создания
            </button>
            <button
              className={s.btn_sort}
              onClick={() => {
                normSort();
              }}
            >
              Обратно
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderNotes;
