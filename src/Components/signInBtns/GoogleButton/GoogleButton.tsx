import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import s from '../btns.module.scss';
import Google from '../google.svg';
const GoogleButton = () => {
  const seatchParams = useSearchParams();
  const callbackUrl =  seatchParams.get('callbackUrl') || '/'
  return (
    <button className={s.btn} onClick={() => signIn("google", { callbackUrl })}>
      {" "}
      <Google className={s.logo}/> <span>Войти с помощью Google</span> 
    </button>

    
  );
};

export default GoogleButton;
