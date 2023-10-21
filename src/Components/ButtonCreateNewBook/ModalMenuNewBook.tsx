import cn from 'classnames';
import s from './ButtonCreateNewBook.module.scss';

const ModalMenuNewBook = ({activeModalMenu}:any) => {
    return(
        
      <div className={cn(s.modal, {
        [s.show]: activeModalMenu === true
      })}>

<div className={s.content_modal}>

    Создать заметку
</div>
      </div>
    )
}

export default ModalMenuNewBook;