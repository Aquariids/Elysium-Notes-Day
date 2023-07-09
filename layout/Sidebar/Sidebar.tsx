import s from "./Sidebar.module.scss";
import { SidebarProps } from "./Sidebar.props";
import cn from "classnames";
import Login from "../../pages/login";
import ButtonCreateNewNotes from "@/Components/ButtonCreateNewNotes/ButtonCreateNewNotes";
const Sidebar = ({ className, ...props }: SidebarProps) => {


  // const userData = {...props};
  // const h = userData.data.map(item => {
  //   return(
  //     console.log(item.email)
      
  //   )
  // })

  return (
    <div className={cn(className, s.siderbar)} {...props}>
      <Login />
      <br />
      <ButtonCreateNewNotes  />
    </div>
  );
};

export default Sidebar;
