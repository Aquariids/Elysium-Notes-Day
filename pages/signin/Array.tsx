import Arr from './arr.svg';
import s from './signin.module.scss'

const Array = ({user,avatar}:any) => {

    const sliceUser = (str: string) => {
    if (str.length > 20) {
      const text = str.slice(0, 20) + "...";
      return text
    } else {
      return str
    }
  };
    return(

        <div className={s.container_arr}>
          <img src={avatar}/>
           <span title={user} className={s.user_name}>{sliceUser(user || 'none user')}  </span><Arr/>
        </div>
    )

}

export default Array;