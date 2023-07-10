import s from "./Sidebar.module.scss";
import { SidebarProps } from "./Sidebar.props";
import cn from "classnames";
import Login from "../../pages/login";
import ButtonCreateNewNotes from "@/Components/ButtonCreateNewNotes/ButtonCreateNewNotes";
import Link from "next/link";
import { useRouter } from "next/router";
const Sidebar = ({ className, ...props }: SidebarProps) => {
const router = useRouter();
const path = router.query.index;

  const { data }:any = props;
  return (
    <div className={cn(className, s.siderbar)} {...props}>
      <Login />
      <br />
      {data &&
        data.map((item: any, i: any) => {
          return (
            <Link {...path === item._id ? {style: { color: "red" }}:''} key={i} href={`/mainPage/${item._id}`}>
              <div  >{`Новая заметка ${i}`}</div>
            </Link>
          );
        })}

      <ButtonCreateNewNotes />
    </div>
  );
};

export default Sidebar;
