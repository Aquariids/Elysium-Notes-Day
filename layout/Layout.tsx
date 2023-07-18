import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import { LayoutProps } from "./Layout.props";
import Sidebar from "./Sidebar/Sidebar";
import s from "./Layout.module.scss";
import { FunctionComponent } from "react";
import { AppContextProvider } from "../context/app.context";

const Layout = ({ children, ...props }: LayoutProps) => {
  // props из withLayout
  return (
    <div className={s.wrapper}>
      {/* <Header className={s.header} /> */}
      <Sidebar {...props} className={s.sidebar} />
      <main className={s.body}>{children}</main>
      {/* <Footer className={s.footer} /> */}
    </div>
  );
};

export const withLayout = <T extends Record<string, unknown>>(
  Component: FunctionComponent<T>
) => {
  //  оборачиваю страницу и получаю ее пропсы

  return function withLayoutComponent(props: T): JSX.Element {
    // пропсы передаю в лейоут и потом получаю где нужно. sidebar, footer, header и так далее.
    return (
      <AppContextProvider title={props.title1}>
        <Layout {...props}>
          <Component {...props} />
        </Layout>
      </AppContextProvider>
    );
  };
};
