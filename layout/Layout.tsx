import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import { LayoutProps } from "./Layout.props";
import Sidebar from "./Sidebar/Sidebar";
import s from './Layout.module.scss';
import { FunctionComponent } from "react";
import { SessionProvider } from "next-auth/react";
const Layout = ({ children }: LayoutProps) => {
    return (
        <div className={s.wrapper}>
            <Header className={s.header} />
            <Sidebar className={s.sidebar} />
            <main className={s.body}>{children}</main>
            <Footer className={s.footer} />
        </div>
    )
}


export const withLayout = <T extends Record<string, unknown>>(Component: FunctionComponent<T>) => {

    return function withLayoutComponent(props: T): JSX.Element {

        return (
                <Layout>
                    <Component {...props} />
                </Layout>
        );
    };
};