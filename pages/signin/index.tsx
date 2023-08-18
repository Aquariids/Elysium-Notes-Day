import { getServerSession } from "next-auth/next";
import { signIn, signOut, useSession } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]";
import Loader from "./Loader";
import s from "./signin.module.scss";
import GoogleButton from "@/Components/signInBtns/GoogleButton/GoogleButton";
import GithubButton from "@/Components/signInBtns/GithubButton/GithubButton";

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
              <p>Посвяти день заметкам в месте блаженства и вечной жизни.</p>
              <GoogleButton />
              <GithubButton />
            </div>
            </div>
          )}

          {session && (
            <div className={s.login}>
              <p style={{ color: "#fff" }}>{session.user.email}</p>
              <button className={s.login_btn} onClick={() => signOut()}>
                {" "}
                Выйти{" "}
              </button>
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
}
