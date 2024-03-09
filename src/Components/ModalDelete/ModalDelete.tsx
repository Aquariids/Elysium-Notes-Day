import { useRouter } from 'next/router';
import s from './ModalDelete.module.scss';

const ModalDelete = ({active, setActive}:any) => {

    const router = useRouter();

    
  return <div className={s.modal}>
        <div className={s.modal_content}>

        </div>
  </div>;
};

export default ModalDelete;
