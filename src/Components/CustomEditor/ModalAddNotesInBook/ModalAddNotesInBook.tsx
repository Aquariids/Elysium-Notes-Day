import s from "./ModalAddNotesInBook.module.scss";
import cn from 'classnames';
const ModalAddNotesInBook = ({ books, active, setActive }: any) => {
  return (
    <div className={cn(
        s.modal, {
            [s.modal__active]: active === true
        }
    )} onClick={() => setActive(false)}>
      <div className={s.modal__content} onClick={(e) => e.stopPropagation() }>
        <div className={s.books}>
          {books.map((item: any) => {
            return <span>{item.name}</span>;
          })}
        </div>
      </div>
    </div>
  );
};

export default ModalAddNotesInBook;
