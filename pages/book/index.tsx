import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { create_data, delete_restore_action, get_action, update_action } from "../api/actios";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { withLayout } from "../../layout/Layout";
import { SIGNIN } from "../api/paths";
import { useSession } from "next-auth/react";
import Link from "next/link";
import cn from 'classnames';
import s from './book.module.scss';
import DotsMenu from './dots.svg';
import DropdownMenuEditor from "@/Components/UI/DropdownMenu/DropdownMenu";
const index = ({ data }: any) => {
  const [isButtonClicked, setButtonClicked] = useState(false);
  const [dataBook, setDataBook] = useState<any>();
  console.log("🚀 ~ file: index.tsx:17 ~ index ~ dataBook:", dataBook)
  const router = useRouter();
  const [bookName, setBookName] = useState<string>('');
  const session = useSession();
  const email = session.data?.user.email;
  const userId = session.data?.user.userId;
  const [activeModal, setActiveModal] = useState(false);
  let idPageCounter = dataBook && dataBook.length; 
  async function buttonCreateNewBook(nameBook: string) {
    try {
      // const newIdPage = dataBook.length + 1; 
      const res = await fetch(`/api/createData?action=${create_data.create_book}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameBook,
          idPage: idPageCounter ,
          email: email,
          userId: userId,
        }),
      });
      


      if (res.ok) {
        // Если запрос успешен, добавляем новый элемент в dataBook и обновляем состояние
        const newDataBook = [...dataBook, { email: email, userId:userId, name: nameBook, idPage: idPageCounter  }];
        setDataBook(newDataBook);
      } else {
        console.error(`Ошибка при создании: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      console.error(err);
    }
  }


  async function deleteBook (_id:any, idPage:any) {
    try {

      const resIdPageNotes = await fetch(`/api/getData?action=${get_action.data_editorBook}&userId=${userId}&email=${email}&idPage=${idPage}`)
      const data = await resIdPageNotes.json(); 
      const dataIdPage = {
        userId: userId,
        email:email,
        idPage:data[0] ? data[0].idPage: '',
      }
     
      const deleteIdPage = await fetch(`/api/updateData?action=${update_action.delete_id_page}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dataIdPage)
      })
  
      const res = await fetch(`/api/deleteAndRestoreData?action=${delete_restore_action.delete_id_page_book}&userId=${userId}&_id=${_id}`)
     
      const newDataBook = dataBook.filter(item => item.idPage !== idPage);
      newDataBook.forEach((item, index) => {
        item.idPage = index;
      });

      
      if (newDataBook.length > 0) {
        const updateIdPage = await fetch(`/api/updateData?action=${update_action.update_id_page}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newDataBook)
        })
      } else {
      }
      getDatabook();
     
      // setDataBook(newDataBook);
      // может создать отдельную коллекцию, где при создании блокнотов, я буду создавать счетчик. сделал один блокнот +1 удалил -1 
      // const newDataBook = [...dataBook, { idPage: idPageCounter  }];
      // console.log("🚀 ~ file: index.tsx:75 ~ deleteBook ~ newDataBook:", newDataBook)
    }

    catch (err) {
      console.error

    }
  
  }
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

  useEffect(() => {
    getDatabook();
  }, [userId]);

  return (
    <div className={s.wrapper}>
      <input
        onChange={(e) => setBookName(e.target.value)}
        placeholder="создать блокнот" value={bookName}
      />
      <button disabled={!bookName && true } className={cn(s.btn, {
        
      })}
        onClick={() => {
          buttonCreateNewBook(
            bookName
          );
          setBookName('')
        }}
      >
        Создать блокнот
      </button>
      {dataBook &&
        dataBook.map((item:any, id:number) => {
          
          return <div className={s.bookLink} key={id}><Link href={`book/${item.idPage}`} key={item.name}> {item.name} </Link>  <DropdownMenuEditor activeModal={activeModal}  icon={<DotsMenu />}  >
        <div onClick={() => deleteBook(item._id, item.idPage)}>Удалить блокнот</div>
            
          </DropdownMenuEditor></div>
        })}
    </div>
  );
};

export default withLayout(index);

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const email = session?.user.email;
  const userId = session?.user.userId;
  const res = await fetch(
    `${process.env.DOMAIN}/api/getData?action=${get_action.id_page_book}&userId=${userId}&email=${email}`
  );
  const data = await res.json();

  if (!session) {
    return {
      redirect: {
        destination: `/${SIGNIN}`,
        permanent: false,
      },
    };
  }

  // if(session && data[0] != undefined) {
  //   return {
  //     redirect: {
  //       destination: `/book/${test}/${data[0]._id}`,
  //       permanent: false,
  //     },
  //      props:{ data}
  //   };
  // }  

  return {
    props: {
      data,
    },
  };
}
