import s from "./Sidebar.module.scss";
import { SidebarProps } from "./Sidebar.props";
import cn from "classnames";
import Login from "../../pages/login";
import ButtonCreateNewNotes from "@/Components/ButtonCreateNewNotes/ButtonCreateNewNotes";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
const Sidebar = ({ className, ...props }: SidebarProps) => {
  const router = useRouter();
  const path = router.query.index;
  const { data }: any = props;
  const all_id = data.map((obj: { _id: any; }) => obj._id)
  const [links, setLinks] = useState(all_id);
  const handleDeleteLink = async (linkId: any) => {
    setLinks(links.filter((link: any) => link !== linkId));
    fetch(`/api/deleteData?_id=${linkId}`)
    router.push(router.asPath);
  };

  return (
    <div className={cn(className, s.siderbar)} {...props}>
      <Login />
      <br />
      {all_id &&
        all_id.map((item: any, i: any) => {
          return (
            <React.Fragment key={item}>
            <Link
              {...(path === item? { style: { color: "red" } } : "")}
              href={`/mainPage/${item}`}
            >
              <div>{`Новая заметка ${i}`}</div>
            </Link>
             <button onClick={() => handleDeleteLink(item)}>Удалить</button>
             </React.Fragment>
          );
        })}

      <ButtonCreateNewNotes />
    </div>
  );
};

export default Sidebar;
