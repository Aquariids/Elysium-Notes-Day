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
              {/* <div className ={s.user_name}>{session.user.name}</div> */}
            <DropdownMenuEditor style={style} icon={<Array user ={session.user.name}/>}>
            <div className={s.login}>
              <p style={{ color: "#3d3d3d" }}>{session.user.email}</p>
              <button className={s.login_btn} onClick={() => signOut()}>
                {" "}
                Выйти{" "}
              </button>
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
