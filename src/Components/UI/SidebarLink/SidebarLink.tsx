import Link from "next/link";
import { useRouter } from "next/router";
import s from './SidebarLink.module.scss';
import cn from 'classnames';
import ButtonCreateNewNotes from "@/Components/ButtonCreateNewNotes/ButtonCreateNewNotes";
import ButtonCreateNewBook from "@/Components/ButtonCreateNewBook/ButtonCreateNewBook";
import Caret from './caret.svg';
import sDrop from './Dropdown.module.scss'
interface IsidebarLink {
    children: React.ReactNode;
    href:string;
    btn?: 'add' | 'add_book'
}
const SidebarLink = ({children,href,btn,}:IsidebarLink) => {
    const router = useRouter();

    
    return(
        <li className={cn(s.container, {
            [s.active]: href === '/',
            [s.active]: href ===  `/${router.asPath.split('/')[1]}`,   
        })}>
            <div className={cn(sDrop.dropdown, {
                
            })}>
            <button className={cn(s.hide, sDrop.dropbtn,{
                [s.show]: btn === 'add_book'
            })}><Caret/></button>
            <div className={sDrop.dropdown_content}>
            <div>Привет</div>
            </div>
          
            </div>
           
        <Link className={cn(s.link, {
            [s.bookLink]: btn === 'add_book'
        })} href={href}>{children}</Link>
         <div className={s.btn}>{btn === 'add' ? <ButtonCreateNewNotes/>: ''}</div>
        <div className={s.btn}>{btn === 'add_book' ? <ButtonCreateNewBook/>: ''}</div>
        </li>
    )
}

export default SidebarLink;