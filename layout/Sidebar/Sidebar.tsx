import s from "./Sidebar.module.scss";
import { SidebarProps } from "./Sidebar.props";
import cn from "classnames";
import Login from "../../pages/login";
import ButtonCreateNewNotes from "@/Components/ButtonCreateNewNotes/ButtonCreateNewNotes";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
const Sidebar = ({ className, ...props }: SidebarProps) => {
  
  const { data }: any = props;
 

  return (
    <div className={cn(className, s.sidebar)} {...props}>
      <div className={s.sidebar_auth}>
      <Login />
      <ButtonCreateNewNotes />
      </div>

      
    </div>
  );
};

export default Sidebar;
