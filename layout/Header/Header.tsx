import cn from 'classnames';
import s from 'Header.module.scss';
import { HeaderProps } from './Header.props';


const Header = ({ className, ...props }:HeaderProps) => {
    return (

        <header className={cn(className, )} {...props}></header>

    )
}

export default Header;