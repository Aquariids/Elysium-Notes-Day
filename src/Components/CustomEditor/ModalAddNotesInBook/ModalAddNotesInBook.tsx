import s from "./ModalAddNotesInBook.module.scss";
import cn from 'classnames';
const ModalAddNotesInBook = ({ books = [], active, setActive }: any) => {
  return (
    <div className={cn(
        s.modal, {
            [s.modal__active]: active
        }
    )} onClick={() => setActive(false)}>
      <div className={cn(s.modal__content, {
        [s.modal__active]: active
      })} onClick={(e) => e.stopPropagation() }>
        <div className={s.books}>
          {books.map((item: any) => {
            return <span key={item.name}>{item.name}</span>;
          })}
        </div>
      </div>
    </div>
  );
};

export default ModalAddNotesInBook;
