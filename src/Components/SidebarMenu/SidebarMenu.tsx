import { NOTES, RECYCLE } from "../../../pages/api/paths";
import Login from "../../../pages/signin";
import SidebarLink from "../UI/SidebarLink/SidebarLink";
import s from "./SidebarMenu.module.scss";

const SideBarMenu = () => {
  return (
    <div className={s.sidebar}>
      <div className={s.sidebar_auth}>
        <Login />
      </div>
      <ul className={s.list}>
        <SidebarLink href="/"> Главное меню </SidebarLink>
        <SidebarLink btn={"add"} href={`/${NOTES}`}>
          {" "}
          Заметки{" "}
        </SidebarLink>
        <SidebarLink href={`/${RECYCLE}`}> Корзина </SidebarLink>
      </ul>
    </div>
  );
};

export default SideBarMenu;
