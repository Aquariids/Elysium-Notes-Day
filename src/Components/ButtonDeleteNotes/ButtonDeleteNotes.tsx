import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ButtonDeleteProps } from "./ButtonDeleteNotes.props";
import s from "./ButtonDeleteNotes.module.scss";
import cn from "classnames";
import { NOTES, RECYCLE } from "../../../pages/api/paths";
import { delete_restore_action } from "../../../pages/api/actios";
const ButtonDeleteNotes = ({
  body,
  setDeleteElement,
  setLoadingDelete,
  ...props
}: ButtonDeleteProps) => {
  const router = useRouter();
  const session = useSession();
  const recycleRouter = router.asPath.split("/")[1] === `${RECYCLE}`;
  const selectedId = router.query.index;
  const userId = session.data?.user.userId;
  interface DeleteLinkProps {
    linkId?: string | string[];
    recycle?: boolean;
    restore?: true;
  }
  const handleDeleteLink = async ({
    linkId,
    recycle,
    restore,
  }: DeleteLinkProps) => {
    !recycleRouter && setDeleteElement(linkId);
    const { restore_data, delete_one_notes, delete_one_notes_recycle } =
      delete_restore_action;

    await fetch(
      `/api/deleteAndRestoreData?action=${
        restore
          ? restore_data
          : "" || recycleRouter
          ? delete_one_notes
          : delete_one_notes_recycle
      }&_id=${linkId}&userId=${userId}`
    );

    let all_id = body && body.map((obj: { _id: string }) => obj._id);
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
    }, 700);

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
        <div
          className={cn(s.delete)}
          onClick={() => handleDeleteLink({ linkId: selectedId })}
          {...props}
        >
          <p className={s.text}>Удалить</p>
        </div>
      )}
    </>
  );
};

export default ButtonDeleteNotes;
