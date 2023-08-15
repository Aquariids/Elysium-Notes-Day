import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ButtonDeleteProps } from "./ButtonDeleteNotes.props";
import s from "./ButtonDeleteNotes.module.scss";
const ButtonDeleteNotes = ({
  body,
  setDeleteElement,
  setLoadingDelete,
  ...props
}: ButtonDeleteProps) => {
  const router = useRouter();
  const session = useSession();
  const recycleRouter = router.asPath.split("/")[1] === "recycle";
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

   
    restore ? await fetch(`/api/restoreData?_id=${linkId}&userId=${userId}`): await fetch(
      `/api/${
        recycleRouter ? "deleteData" : "deleteDataRecycle"
      }?_id=${linkId}&userId=${userId}`
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
      router.push("/notes");
    } else if (all_id.length === 1 && recycle) {
      console.log('че такое');
      
      router.push("/recycle");
    } else {
      alert("ЧЕ ТО ТЫ НЕ ТО ДЕЛАЕШЬ");
    }
    const timer = setTimeout(() => {
      !recycleRouter && setLoadingDelete(false);
    }, 300);

    return () => clearTimeout(timer);
  };

  return (
    <>
      {recycleRouter ? (
        <>
          <div
            onClick={() =>
              handleDeleteLink({ linkId: selectedId, recycle: recycleRouter })
            }
            className={s.delete}
          >
            <p>Окончательно удалить</p>
          </div>
          <div
            onClick={() =>
              handleDeleteLink({ linkId: selectedId, restore: true,  recycle: recycleRouter})
            }
            className={s.delete}
          >
            <p>Восстановить запись</p>
          </div>
        </>
      ) : (
        <div
          className={s.delete}
          onClick={() => handleDeleteLink({ linkId: selectedId })}
          {...props}
        >
          <p>Переместить в корзину</p>
        </div>
      )}
    </>
  );
};

export default ButtonDeleteNotes;
