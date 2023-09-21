import Arr from '../arr.svg';
import s from './signin.module.scss'

const Array = ({user,avatar}:any) => {
    return(

        <div className={s.container_arr}>
          <img src={avatar}/>
           <span className={s.user_name}>{user}  </span><Arr/>
        </div>
    )


}

export default Array;