import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ButtonDeleteProps } from "./ButtonDeleteNotes.props";
import s from "./ButtonDeleteNotes.module.scss";
import cn from "classnames";
import { NOTES, RECYCLE } from "../../../pages/api/paths";
import {
  delete_restore_action,
  update_action,
} from "../../../pages/api/actions";
import { DateTime, Settings } from "luxon";
import { useEffect, useState } from "react";

Settings.defaultLocale = "ru";
DateTime.local().setLocale("ru");

const ButtonDeleteNotes = ({
  all_id,
  setDeleteElement,
  setLoadingDelete,
  currentNote,
  ...props
}: ButtonDeleteProps) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userDate = DateTime.now().setZone(userTimeZone);

  const router = useRouter();
  const session = useSession();
  const recycleRouter = router.asPath.split("/")[1] === `${RECYCLE}`;
  const selectedId = router.query.index;
  const userId = session.data?.user.userId;
  const email = session.data?.user.email;
  const [test, setTest] = useState<boolean>();
  useEffect(() => {
    setTest(false)
  },[])

  interface DeleteLinkProps {
    linkId?: string | string[];
    recycle?: boolean;
    restore?: true;
  }


  // const addIdPageForNote = async () => {
  //   const data = {
  //     email: email,
  //     userId: userId,
  //     _id: currentNote._id,
  //     idPage: currentNote.idPage && '',
  //   };
  //   const res = await fetch(
  //     `/api/updateData?action=${update_action.update_notebook_id_for_note}`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     }
  //   );

  //   if (res.ok) router.push(router.asPath);
  // };

  const deleteDate = async (data: any) => {
    setTest(true)
    await fetch(`/api/updateData?action=${update_action.update_note_deletion_date}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };
  const handleDeleteLink = async ({
    linkId,
    recycle,
    restore,
  }: DeleteLinkProps) => {
    !recycleRouter && setDeleteElement(linkId);
    const { restore_data, delete_one_notes, delete_one_notes_recycle } =
      delete_restore_action;

    const data = {
      userId: userId,
      _id: linkId,
      email: session.data?.user.email,
      deleteDate: userDate.toFormat("EEEE, d MMMM yyyyг, HH:mm"),
    };

    await deleteDate(data);
    await fetch(
      `/api/deleteAndRestoreData?action=${
        restore
          ? restore_data
          : "" || recycleRouter
          ? delete_one_notes
          : delete_one_notes_recycle
      }&_id=${linkId}&userId=${userId}`
    );

    
    await all_id.filter((link: string) => link !== linkId);
    const currentIndex = all_id.findIndex((i: string) => i == selectedId);
    !recycleRouter && setLoadingDelete(true);
    if (all_id.length >= 2) {
      if (linkId != selectedId) {
        router.push(all_id[currentIndex]);
      } else if (
        linkId === selectedId &&
        all_id[currentIndex + 1] === undefined
      ) {
        router.push(all_id[currentIndex - 1]);
      } else {
        router.push(all_id[currentIndex + 1]);
      }
    } else if (all_id.length === 1 && !recycle && !restore) {
      !recycleRouter && setLoadingDelete(false);
      router.push(`/${NOTES}`);
    } else if (all_id.length === 1 && recycle) {
      router.push(`/${RECYCLE}`);
    } else {
      alert("ЧЕ ТО ТЫ НЕ ТО ДЕЛАЕШЬ");
    }
    const timer = setTimeout(() => {
      !recycleRouter && setLoadingDelete(false);
    }, 600);

    return () => clearTimeout(timer);
  };

  return (
    <>
      {recycleRouter ? (
        <>
          <div
            onClick={() =>
              handleDeleteLink({
                linkId: selectedId,
                restore: true,
                recycle: recycleRouter,
              })
            }
            className={s.delete}
          >
            <p className={s.text}>Восстановить запись</p>
          </div>
          <div
            onClick={() =>
              handleDeleteLink({ linkId: selectedId, recycle: recycleRouter })
            }
            className={s.delete}
          >
            <p className={s.text}>Окончательно удалить</p>
          </div>
        </>
      ) : (
        <>
        <div
          className={cn(s.delete)}
          onClick={() => handleDeleteLink({ linkId: selectedId })}
          {...props}
        >
         {test ?  <p className={s.text}>Удалить....</p> : <p className={s.text}>Удалить </p>}
        </div>
        {/* <div
          className={cn(s.delete, {
            [s.hide]: !currentNote.idPage
          })}
          onClick={() => {
            addIdPageForNote()
            
          
          }
        }
          {...props}
        >
          <p className={s.text}>Удалить из блокнота</p>
        </div> */}
        </>
        
      )}
    </>
  );
};

export default ButtonDeleteNotes;
