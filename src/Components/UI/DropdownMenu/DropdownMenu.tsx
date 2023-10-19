import { DropdownMenuEditorProps } from "./DropdownMenuEditor.props";
import s from './DropdownMenuEditor.module.scss';
import cn from 'classnames';
import { useEffect, useRef, useState } from "react";
const DropdownMenuEditor = ({children,icon,style,toolbarMainButton = false, tollbarActive, activeModal}:DropdownMenuEditorProps) => {
    const [activeMenu, setActiveMenu] = useState<boolean>(false);
    const refActiveMenu = useRef<HTMLDivElement>(null);

    const handleOutsideClick = (event: any) => {
        if (
          refActiveMenu.current && 
          !refActiveMenu.current.contains(event.target) 
        ) {
            setActiveMenu(false);
        }
      };
      useEffect(() => {
        document.addEventListener("click", handleOutsideClick, false);
        return () => {
          document.removeEventListener("click", handleOutsideClick, false);
        };
      }, []);
      useEffect(() => {
        if(activeModal === true) setActiveMenu(false)
      },[activeModal])
    
    return(
        <div
        ref={refActiveMenu}
        className={style ? style.dropdown : s.dropdown}
      >
      {
        tollbarActive ? <button
        className={cn(style ? style.dropbtn: s.dropbtn, {
          [style ? style.active : s.active]: activeMenu,
          [s.activeToolbar ]: toolbarMainButton === true,
        })}
      >
        {" "}
        {icon}
      </button>:<button
          onClick={(e) => {
            setActiveMenu(!activeMenu);
          }}
          className={cn(style ? style.dropbtn: s.dropbtn, {
            [style ? style.active : s.active]: activeMenu,
          })}
        >
          {" "}
          {icon}
        </button>
      }
        <div
          className={cn(style ? style.dropdown_content : s.dropdown_content, {
            [style ? style.show : s.show]: activeMenu,
          })}
        >
          {children}
        </div>
      </div>
    )
}


export default DropdownMenuEditor;