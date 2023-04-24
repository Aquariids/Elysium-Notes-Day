import s from './Button.module.scss';
import cn from 'classnames';
import { ReactNode } from 'react';
import ButtonProps from './Button.props';


const Button = ({ icon_class, id_btn, btn_class_format: btn_format, btn_class_option: btn_options,children, ...props}: ButtonProps) => {
    return (
        <button {...props} id={id_btn} className={cn()}>
            {children}
        </button>
    )
}

export default Button;