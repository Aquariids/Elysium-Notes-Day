import { getServerSession } from "next-auth/next";
import { signOut, useSession } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]";
import Loader from "./Loader";
import s from "./signin.module.scss";
import GoogleButton from "@/Components/signInBtns/GoogleButton/GoogleButton";
import GithubButton from "@/Components/signInBtns/GithubButton/GithubButton";
import DropdownMenuEditor from "@/Components/UI/DropdownMenu/DropdownMenu";
import style from  './DropdownLogin.module.scss';
import Array from "./Array";
const Login: React.FunctionComponent = (): JSX.Element => {
  const { data: session, status: loading } = useSession();
  
  if (loading == "loading") {
    return <Loader />;
  } else {
    return (
      <>
        <main className={s.main}>
          {!session && (
            <div className={s.wrapper_login}>
            <div className={s.login_form}>
            <img className={s.logo} src="/logo.png" alt="Logo"/>
              <p className={s.title}>Elysium Notes Day</p>
              <p className={s.text}>Посвяти день заметкам в месте блаженства и вечной жизни.</p>
              <GoogleButton />
              <GithubButton />
            </div>
            </div>
          )}

          {session && (
            <div className={s.wrapper_user}>
            <DropdownMenuEditor style={style} icon={<Array user ={session.user.name} avatar={session.user.image}/>}>
            <div className={s.login}>
              <div className={s.login_content}>
              <h2 className={s.account}>АККАУНТ</h2>
              <div className={s.user}>
              <img src={session.user.image}/>
              <p className={s.email}>{session.user.email}</p>
              </div>
              </div>
            
            </div>
            <div className={s.footer}>
            <span className={s.login_btn} onClick={() => signOut()}>
                {" "}
                Завершить сеанс{" "}
              </span>
              </div>
            </DropdownMenuEditor>
            </div>
          )}
        </main>
      </>
    );
  }
};

export default Login;

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  try {
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };

} catch(err) {
  alert(err)
}
}
