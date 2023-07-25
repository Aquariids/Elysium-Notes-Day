import { useRouter } from 'next/router';
import s from './ModalDelete.module.scss';

const ModalDelete = ({active, setActive}:any) => {

    const router = useRouter();
    console.log("🚀 ~ file: ModalDelete.tsx:7 ~ ModalDelete ~ router:", router)

    
  return <div className={s.modal}>
        <div className={s.modal_content}>

        </div>
  </div>;
};

export default ModalDelete;
