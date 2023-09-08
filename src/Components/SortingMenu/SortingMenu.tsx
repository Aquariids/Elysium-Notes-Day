import SortIcon from "./sort.svg";
import cn from "classnames";
import Arrow from "./arrow.svg";
import { useEffect, useRef, useState } from "react";
import s from "./SortintMenu.module.scss";
import { useSession } from "next-auth/react";

const SortingMenu = ({ sort, setSort }: any) => {
  const [sortMenuActive, setSortMenuActive] = useState(false);
  const refActiveMenu = useRef<HTMLDivElement>(null);
  const session = useSession();

  const handleOutsideClick = (event: any) => {
    if (
      refActiveMenu.current &&
      !refActiveMenu.current.contains(event.target)
    ) {
      setSortMenuActive(false);
    }
  };
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

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, false);
    return () => {
      document.removeEventListener("click", handleOutsideClick, false);
    };
  }, []);
  return (
    <div ref={refActiveMenu} className={s.dropdown}>
      <button
        onClick={(e) => {
          setSortMenuActive(!sortMenuActive);
        }}
        className={s.dropbtn}
      >
        {" "}
        <SortIcon />
      </button>
      <div
        id={s.myDropdown}
        className={cn(s.dropdown_content, {
          [s.show]: sortMenuActive === true,
        })}
      >
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
      </div>
    </div>
  );
};

export default SortingMenu;
