import s from "./Sidebar.module.scss";
import { SidebarProps } from "./Sidebar.props";
import cn from "classnames";
import Login from "../../pages/login";
import ButtonCreateNewNotes from "@/Components/ButtonCreateNewNotes/ButtonCreateNewNotes";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import SideBarMenu from "@/Components/SidebarMenu/SidebarMenu";
const Sidebar = ({ className,  ...props }: SidebarProps) => {
  
  const { data }: any = props;
 const session = useSession();

  return (
    <div className={cn(className, s.sidebar)} {...props}>

      <SideBarMenu data ={data}/>
      
    </div>
  );
};

export default Sidebar;




