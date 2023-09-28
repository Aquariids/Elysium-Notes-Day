import Link from "next/link";
import { useRouter } from "next/router";
import s from './SidebarLink.module.scss';
import cn from 'classnames';
import ButtonCreateNewNotes from "@/Components/ButtonCreateNewNotes/ButtonCreateNewNotes";
import ButtonCreateNewBook from "@/Components/ButtonCreateNewBook/ButtonCreateNewBook";
import Caret from './caret.svg';
import sDrop from './Dropdown.module.scss'
import { useEffect, useState } from "react";
import { get_action } from "../../../../pages/api/actios";
import { useSession } from "next-auth/react";
import ModalMenuNewBook from "@/Components/ButtonCreateNewBook/ModalMenuNewBook";
interface IsidebarLink {
    children: React.ReactNode;
    href:string;
    btn?: 'add' | 'add_book'
}
const SidebarLink = ({children,href,btn,}:IsidebarLink) => {
    const [dataBook, setDataBook] = useState<any>();
    const [activeMenu, setActiveMenu] = useState<boolean>(false);
    const session = useSession();
    const email = session.data?.user.email;
    const userId = session.data?.user.userId;
    const router = useRouter();
    const [activeModalMenu, setActiveModalMenu] = useState<boolean>(false);

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
      }, [userId, email]);
    return(
        <>
        <li className={cn(s.container, {
            [s.active]: href === '/',
            [s.active]: href ===  `/${router.asPath.split('/')[1]}`,
               
        })}>
            <div className={cn(sDrop.dropdown, {
                
            })}>
            <button onClick={(e) => {
                 setActiveMenu(!activeMenu);
            }}  className={cn(s.hide, sDrop.dropbtn,{
                
                [s.show]: btn === 'add_book',
                [s.caretDown]:  activeMenu === true
            })}><Caret/></button>
            {/* <div className={cn(sDrop.dropdown_content, {
                [sDrop.show]: activeMenu === true
            })}>
            <div className={sDrop.dropLink}>{dataBook && dataBook.map((item,i) => {
                return <span> {item.name}</span>
            })}</div>
            </div> */}
          
            </div>
           
        <Link className={cn(s.link, {
            [s.bookLink]: btn === 'add_book'
        })} href={href}>{children}</Link>
         <div className={s.btn}>{btn === 'add' ? <ButtonCreateNewNotes/>: ''}</div>
        {/* <div className={s.btn}>{btn === 'add_book' ? <ButtonCreateNewBook setActiveModalMenu={setActiveModalMenu}/>: ''}</div> */}
        </li>


        {/* <ModalMenuNewBook activeModalMenu={activeModalMenu} /> */}
        </>
    )
}

export default SidebarLink;