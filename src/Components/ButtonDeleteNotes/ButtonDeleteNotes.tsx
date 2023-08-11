import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ButtonDeleteProps } from "./ButtonDeleteNotes.props";

const ButtonDeleteNotes = ({body, ...props}:ButtonDeleteProps) => {
    const router = useRouter();
    const session = useSession();
    const recycleRouter = router.asPath.split('/')[1] === 'recycle';
    console.log("🚀 ~ file: ButtonDeleteNotes.tsx:9 ~ ButtonDeleteNotes ~ RecycleRouter:", recycleRouter)
    const selectedId = router.query.index;
    const userId = session.data?.user.userId; 

    const handleDeleteLink = async (linkId?: string | string[]) => {  
        // setDeleleElement(linkId)
        const res = await fetch(`/api/deleteData?_id=${linkId}&userId=${userId}`);
        let all_id = body && body.map((obj: { _id: string }) => obj._id);
        await all_id.filter((link:string) => link !== linkId);
        const currentIndex = all_id.findIndex((i: string) => i == selectedId);
        // setLoadingDelete(true);
    
       
          if (all_id.length >= 2 && res.status === 200) {
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
          } else if (all_id.length === 1) {
            router.push("/notes");
          } else {
            alert("ЧЕ ТО ТЫ НЕ ТО ДЕЛАЕШЬ");
          }

        //   setTimeout(() => {
        //     setLoadingDelete(false);
        //   }, 2000);
      };
    return(
       <>
       {recycleRouter ? <span>Окончательно удалить</span>: <div onClick={(() => handleDeleteLink(selectedId))} {...props} >Переместить в корзину</div>}
       </>
    )
}


export default ButtonDeleteNotes;