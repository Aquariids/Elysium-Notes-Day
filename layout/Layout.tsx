import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import { LayoutProps } from "./Layout.props";
import Sidebar from "./Sidebar/Sidebar";
import s from "./Layout.module.scss";
import { FunctionComponent } from "react";
import { useSession } from "next-auth/react";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { getActiveNotebookWithoutId } from "../pages/api/auth/lib/Get";
import { useWithoutId } from "../hooks/useWithoutId";

const Layout = ({ children, ...props }: LayoutProps) => {
  const session = useSession();
  // props из withLayout
  return (
    <div className={s.wrapper}>
      <Header className={s.header} />
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

  return function WithLayoutComponent(props: T): JSX.Element {
    // пропсы передаю в лейоут и потом получаю где нужно. sidebar, footer, header и так далее.
    return (
     
        <Layout {...props}>
          <Component {...props} />
        </Layout>
        
     
    );
  };
};

