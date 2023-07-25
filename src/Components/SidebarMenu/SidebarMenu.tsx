import { NOTES } from '../../../pages/api/paths';
import Login from '../../../pages/login';
import SidebarLink from '../UI/SidebarLink/SidebarLink';
import s from './SidebarMenu.module.scss';

const SideBarMenu = ({data}:any) => {
    
    return (
    <div className={s.sidebar}>
    <div className={s.sidebar_auth}>
      <Login />
      
      </div>    
      <ul className={s.list}>
      <SidebarLink href='/'> Главное меню </SidebarLink>
      <SidebarLink btn={'add'} href={`/${NOTES}/${data[0]._id}`}> Заметки </SidebarLink>
      </ul>
        </div>
    )
}


export default SideBarMenu;