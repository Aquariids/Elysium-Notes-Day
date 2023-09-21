import SortIcon from "./sort.svg";
import cn from "classnames";
import Arrow from "./arrow.svg";
import s from "./SortintMenu.module.scss";
import DropdownMenuEditor from "../UI/DropdownMenu/DropdownMenu";
import styleDropdown from './DropdownMenuSorting.module.scss'
const SortingMenu = ({ sort, setSort }: any) => {

  function dateSort() {
    let newSort;
    switch (sort) {
      case "dateDown":
        newSort = "dateUp";
        break;
      case "dateUp":
        newSort = "dateDown";
        break;
      default:
        newSort = "dateUp";
        break;
    }
    localStorage.setItem("sorting", newSort);
    setSort(newSort);
  }


  return (
    

    <DropdownMenuEditor icon={<SortIcon/>} style={styleDropdown}>
    <span className={s.title_sort}>СОРТИРОВАТЬ ПО</span>
        <button
          className={cn(s.btn_sort, {
            [s.active_btn_sortUp]: sort === "dateUp",
            [s.active_btn_sortDown]: sort === "dateDown",
          })}
          onClick={dateSort}
        >
          <Arrow /> <span>дате создания</span>
        </button>
    </DropdownMenuEditor>
  );
};

export default SortingMenu;
