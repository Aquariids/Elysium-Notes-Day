import cn from 'classnames';
import s from 'Header.module.scss';


const Header = ({className, ...props}) => {
    return <header {...props} className={cn(className,)}>Header</header>
}

export default Header;