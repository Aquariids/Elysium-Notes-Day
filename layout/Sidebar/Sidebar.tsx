import s from "./Sidebar.module.scss";
import { SidebarProps } from "./Sidebar.props";
import cn from "classnames";
import Login from "../../pages/login";
import ButtonCreateNewNotes from "@/Components/ButtonCreateNewNotes/ButtonCreateNewNotes";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
const Sidebar = ({ className, ...props }: SidebarProps) => {

const session = useSession();
const userId = session.data?.user.userId;
const email = session.data?.user.email;
  return (
    <div className={cn(className, s.siderbar)} {...props}>
      <Login />
      <br />
      <ButtonCreateNewNotes userId={userId}/>

      
    </div>
  );
};

export default Sidebar;
