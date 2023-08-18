import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import s from '../btns.module.scss'
const GithubButton = () => {
  const seatchParams = useSearchParams();
  const callbackUrl =  seatchParams.get('callbackUrl') || '/'
  return (
    <button className={s.btn}  onClick={() => signIn("github", { callbackUrl })}>
      {" "}
      <img className={s.logo}  src="https://authjs.dev/img/providers/github.svg"/> <span> Войти с помощью Github </span>
    </button>
  );
};

export default GithubButton;
