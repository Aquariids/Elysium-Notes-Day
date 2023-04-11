import s from './Footer.module.scss'
import cn from 'classnames';
import { FooterProps } from './Footer.props';

const Footer = ({className, ...props}:FooterProps) => {
    const {footer} = s;
    
    return <footer className={cn(className, )} {...props}>
        
        Footer
        
        </footer>
}


export default Footer;