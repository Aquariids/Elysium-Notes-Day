import cn from 'classnames';
import s from 'Header.module.scss';
import { HeaderProps } from './Header.props';
import Link from 'next/link';


const Header = ({ className, ...props }:HeaderProps) => {
    return (

        <header className={cn(className, )} {...props}>

            <Link href={'/recycle'}> КОрзина </Link>
        </header>

    )
}

export default Header;