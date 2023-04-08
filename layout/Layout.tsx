import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import { LayoutProps } from "./Layout.props";
import Sidebar from "./Sidebar/Sidebar";

const Layout = ({children}:LayoutProps) => {
    return(
        <>
        <Header/>
        <Sidebar/>
        <main>{children}</main>
        <Footer/>
        </>
    )
}

export default Layout;