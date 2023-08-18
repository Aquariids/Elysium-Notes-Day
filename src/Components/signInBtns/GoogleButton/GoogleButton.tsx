import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import s from '../btns.module.scss';
const GoogleButton = () => {
  const seatchParams = useSearchParams();
  const callbackUrl =  seatchParams.get('callbackUrl') || '/'
  return (
    <button className={s.btn} onClick={() => signIn("google", { callbackUrl })}>
      {" "}
     <img className={s.logo}  src="https://authjs.dev/img/providers/google.svg"/> <span>Войти с помощью Google</span> 
    </button>

    
  );
};

export default GoogleButton;
