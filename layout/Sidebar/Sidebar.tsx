import s from "./Sidebar.module.scss";
import { SidebarProps } from "./Sidebar.props";
import cn from "classnames";
import React from "react";
import SideBarMenu from "@/Components/SidebarMenu/SidebarMenu";
const Sidebar = ({ className,  ...props }: SidebarProps) => {
  

  return (
    <div className={cn(className, s.sidebar)} {...props}>

      <SideBarMenu/>
      
    </div>
  );
};

export default Sidebar;




