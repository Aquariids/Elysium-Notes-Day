import { useRouter } from 'next/router';
import { useState } from 'react';
import { NOTES } from '../../../pages/api/paths';
import Login from '../../../pages/login';
import SidebarLink from '../UI/SidebarLink/SidebarLink';
import s from './SidebarMenu.module.scss';

const SideBarMenu = ({data}:any) => {
  const [id, setId] = useState();
    const router = useRouter();
  
    return (
    <div className={s.sidebar}>
    <div className={s.sidebar_auth}>
      <Login />
      
      </div>    
      <ul className={s.list}>
      <SidebarLink href='/'> Главное меню </SidebarLink>
      <SidebarLink btn={'add'} href={`/${NOTES}`}> Заметки </SidebarLink>
      <SidebarLink href={`/recycle`}> Корзина </SidebarLink>
      </ul>
        </div>
    )
}


export default SideBarMenu;