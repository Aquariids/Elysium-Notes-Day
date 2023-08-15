import { ModalProps } from './CustomEditor.props';
import cn from 'classnames';
const Modal = ({className,...props}:ModalProps) => {    
    return (
        
            <div {...props}  className={cn(className)}>
                <p>! Вы не можете изменять заметку в корзине</p>
        </div>
    )
}

export default Modal;