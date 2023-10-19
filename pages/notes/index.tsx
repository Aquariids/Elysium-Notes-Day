import { withLayout } from "../../layout/Layout";
import s from "./notes.module.scss";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { NOTES } from "../api/paths";
import ButtonCreateNewNotes from "@/Components/ButtonCreateNewNotes/ButtonCreateNewNotes";
import { get_action } from "../api/actios";
import ModalBooks from "@/Components/CustomEditor/ModalBooks/ModalBooks";
import { useState } from "react";
const index = ({databook}:any) => {
  const [updateBooks, setUpdateBooks] = useState();
  const [activeModal, setActiveModal] = useState(false);
  return (
    // ну и паередаем его в наш редактор.
    <div className={s.wrapper}>
      <div className={s.notes_list}>
        <div className={s.container}>
          <div className={s.alert}>
            <h2>Создание первой заметки</h2>
            <div>
              Нажмите на кнопку {<ButtonCreateNewNotes alert="alert" />} в
              боковой панели "Заметки" или здесь, чтобы начать.
            </div>
          </div>
        </div>
      </div>
      
      <div className={s.editor}> 
      <p onClick={() => setActiveModal(true)}>Привет</p>
      <ModalBooks
            
            active={activeModal}
            setActive={setActiveModal}
          />
      </div>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const userId = session?.user.userId; // айди авторизованного человека
  const email = session?.user.email;
  try {

    const idPageForBooks = await fetch(
      `${process.env.DOMAIN}/api/getData?action=${get_action.id_for_books}&userId=${userId}&email=${email}`
    );
    const answ = await idPageForBooks.json();
    const res = answ === 'all' ? await fetch(
      `${process.env.DOMAIN}/api/getData?action=${get_action.data_editor}&userId=${userId}&email=${email}`
    ): await fetch(
      `${process.env.DOMAIN}/api/getData?action=${get_action.data_editorBook}&userId=${userId}&email=${email}&idPage=${answ}`
    );
    const actionSorting = await fetch(
      `${process.env.DOMAIN}/api/getData?action=${get_action.action_sorting}&userId=${userId}&email=${email}`
    ); 
 
    const resBook = await fetch(
      `${process.env.DOMAIN}/api/getData?action=${get_action.id_page_book}&userId=${userId}&email=${email}`
    );
    const databook = await resBook.json();
    // const datainbooks = await fetch(
    //   `${process.env.DOMAIN}/api/getData?action=${get_action.data_editorBook}&userId=${userId}&email=${email}&idPage=${answ}`
    // );
  
  const sort = await actionSorting.json();
  const data = await res.json();

  
  if(!session){
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }
  if (session && data[0] != undefined && sort[0].sorting === 'dateDown') {
    return {
      redirect: {
        destination: `/${NOTES}/${data[0]._id}`,
        permanent: false,
      },
    };
  } if (session && data[0] != undefined && sort[0].sorting === 'dateUp') {
    return {
      redirect: {
        destination: `/${NOTES}/${data[data.length - 1]._id}`,
        permanent: false,
      },
    };
  }  

  else if(session && data[0] != undefined) {
    return {
      redirect: {
        destination: `/${NOTES}/${data[0]._id}`,
        permanent: false,
      },
       props:{ data}
    };
  }  
  
  return {
    props:{ data,databook}
  }
  }

  catch(err) {
    console.error(err);
    
  }
  
}

export default withLayout(index);
