import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import { LayoutProps } from "./Layout.props";
import Sidebar from "./Sidebar/Sidebar";
import s from './Layout.module.scss';
import { FunctionComponent, useState } from "react";
import { AppContextProvider } from "../context/app.context";
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
            <AppContextProvider idPage={undefined} setIdPage={undefined}>
                <Layout>
                    <Component {...props} />
                </Layout>
            </AppContextProvider>
        );
    };
};