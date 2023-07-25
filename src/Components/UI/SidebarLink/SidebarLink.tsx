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
    console.log("🚀 ~ file: SidebarLink.tsx:14 ~ SidebarLink ~ href:", href)
    const [url, setUrl] = useState('/');
    console.log("🚀 ~ file: SidebarLink.tsx:16 ~ SidebarLink ~ url:", url)
    const router = useRouter();
    
useEffect(() => {
    if(router.query.index) {
        setUrl(router.asPath.split('/')[1])
    } else {
        setUrl('/')
    }
    
},[])
    
    return(
        <li className={cn(s.container, {
            [s.active]: href === url || href.split('/')[1] === url,
            
        })}>
        <Link className={s.link} href={href}>{children}</Link>
         <div className={s.btn}>{btn === 'add' ? <ButtonCreateNewNotes/>: ''}</div>
        </li>
    )
}

export default SidebarLink;