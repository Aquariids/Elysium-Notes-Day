import { useEffect, useState } from "react";
import s from "./HeaderNotes.module.scss";
import Notes from "./notes.svg";
import Recycle from "./recycle.svg";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { delete_restore_action } from "../../../pages/api/actions";
import { RECYCLE } from "../../../pages/api/paths";
import SortingMenu from "../SortingMenu/SortingMenu";
import ButtonCreateNewNotes from "../ButtonCreateNewNotes/ButtonCreateNewNotes";

const HeaderNotes = ({ data, setSort, sort,showMobileNotesList }: any) => {
  const router = useRouter();
  const routerRecycle = router.asPath.split("/")[1] === RECYCLE;
  const session = useSession();
  const userId = session.data?.user.userId;
  const [counterNotes, setCounterNotes] = useState(data.length);

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


  function declOfNum(number: number, titles: string[]) {
    // это не я такой умный, это не моя функция, ну простите..
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[
      number % 100 > 4 && number % 100 < 20
        ? 2
        : cases[number % 10 < 5 ? number % 10 : 5]
    ];
  }
  
  useEffect(() => {
    setCounterNotes(data.length);
  }, [router]);


  

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
        <div className={s.test}>
        <SortingMenu sort={sort} setSort={setSort}/>
        {showMobileNotesList && <div className={s.newNoteMobile}> <ButtonCreateNewNotes/> </div>}
        </div>
       
     
      </div>
    </div>
  );
};

export default HeaderNotes;
