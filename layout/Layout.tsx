import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import { LayoutProps } from "./Layout.props";
import Sidebar from "./Sidebar/Sidebar";
import s from './Layout.module.scss';
const Layout = ({children}:LayoutProps) => {
    return(
        <div className={s.wrapper}>
        <Header className={s.header}/>
        <Sidebar className= {s.sidebar}/>
        <main className={s.body}>{children}</main>
        <Footer className= {s.footer}/>
        </div>
    )
}

export default Layout;