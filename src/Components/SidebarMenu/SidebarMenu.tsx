import { NOTES, RECYCLE } from "../../../pages/api/paths";
import Login from "../../../pages/signin";
import SidebarLink from "../UI/SidebarLink/SidebarLink";
import s from "./SidebarMenu.module.scss";
import Home from './home.svg';
import Notes from './notes.svg';
import Recycle from './recycle.svg';
import Book from './book.svg';
const SideBarMenu = () => {
  return (
    <div className={s.sidebar}>
      <div className={s.sidebar_auth}>
        <Login />
      </div>
      <ul className={s.list}>
        <SidebarLink href="/"><Home/><span className={s.content}> Главная </span></SidebarLink>
        <SidebarLink btn={"add"} href={`/${NOTES}`}> <Notes/> <span className={s.content}>Заметки</span> </SidebarLink>
        <SidebarLink href={`/${RECYCLE}`}> <Recycle/> <span className={s.content}>Корзина</span> </SidebarLink>
        <SidebarLink btn={"add_book"} href={`/book`}> <Book/> <span className={s.content}>Блокноты</span> </SidebarLink>        
      </ul>
    </div>
  );
};

export default SideBarMenu;
