import s from './Sidebar.module.scss';
import { SidebarProps } from './Sidebar.props';
import cn from 'classnames';

const Sidebar = ({ className, ...props }: SidebarProps) => {
    return (
    <div className={cn(className, s.siderbar)} {...props}>

sidebar
    </div>)
}

export default Sidebar;
