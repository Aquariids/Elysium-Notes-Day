import { DetailedHTMLProps, HTMLAttributes } from 'react';
import cn from 'classnames';
export interface ModalProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {

}
const ModalRecycle = ({className,...props}:ModalProps) => {    
    return (
        
            <div {...props}  className={cn(className)}>
                <p>! Вы не можете изменять заметку в корзине</p>
        </div>
    )
}

export default ModalRecycle;