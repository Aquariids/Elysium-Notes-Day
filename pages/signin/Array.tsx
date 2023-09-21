import Arr from '../arr.svg';
import s from './signin.module.scss'

const Array = ({user}:any) => {
    return(

        <div className={s.container_arr}>
          <Arr/> {`${user} `} 
        </div>
    )


}

export default Array;