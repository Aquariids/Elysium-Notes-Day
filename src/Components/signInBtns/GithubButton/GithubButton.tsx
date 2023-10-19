import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import s from '../btns.module.scss'
import Github from '../github.svg';
const GithubButton = () => {
  const seatchParams = useSearchParams();
  const callbackUrl =  seatchParams.get('callbackUrl') || '/'
  return (
    <button className={s.btn}  onClick={() => signIn("github", { callbackUrl })}>
      {" "}
      <Github className={s.logo}/> <span> Войти с помощью Github </span>
    </button>
  );
};

export default GithubButton;
