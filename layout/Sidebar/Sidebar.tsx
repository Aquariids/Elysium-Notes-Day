import s from './Sidebar.module.scss';
import { SidebarProps } from './Sidebar.props';
import cn from 'classnames';
import Login from '../../pages/login';

const Sidebar = ({ className, ...props }: SidebarProps) => {
    return (
        <div className={cn(className, s.siderbar)} {...props}>

            <Login />
        </div>)
}

export default Sidebar;
