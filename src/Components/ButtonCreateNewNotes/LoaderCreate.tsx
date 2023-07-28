import s from './ButtonCreateNewNotes.module.scss';

const LoaderCreate = () => {
    return (
        <div className={s.container}>
         

         <div className={s.lds_spinner}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
       
      );
}

export default LoaderCreate;