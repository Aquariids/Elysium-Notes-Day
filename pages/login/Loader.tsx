import s from "./login.module.scss";

const Loader = () => {
  return (
    <div className={s.container}>
     <div className={s.loading}>
     
     </div>
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
};

export default Loader;
