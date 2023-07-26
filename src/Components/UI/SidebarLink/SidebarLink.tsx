import Link from "next/link";
import { useRouter } from "next/router";
import s from './SidebarLink.module.scss';
import cn from 'classnames';
import ButtonCreateNewNotes from "@/Components/ButtonCreateNewNotes/ButtonCreateNewNotes";
import { use, useEffect, useState } from "react";

interface IsidebarLink {
    children: React.ReactNode;
    href:string;
    btn?: 'add';
}
const SidebarLink = ({children,href,btn}:IsidebarLink) => {
    const router = useRouter();
  
   



    
    return(
        <li className={cn(s.container, {
            [s.active]: href === '/',
            [s.active]: href ===  `/${router.asPath.split('/')[1]}`,
         
            
        })}>
        <Link className={s.link} href={href}>{children}</Link>
         <div className={s.btn}>{btn === 'add' ? <ButtonCreateNewNotes/>: ''}</div>
        </li>
    )
}

export default SidebarLink;