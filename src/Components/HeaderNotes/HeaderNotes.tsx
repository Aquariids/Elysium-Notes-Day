import s from './HeaderNotes.module.scss';
import Notes from './notes.svg';
const HeaderNotes = () => {
  return <div className={s.header}>
    <div className={s.container}><Notes/> <p>ЗАМЕТКИ</p></div>
  </div>;
};

export default HeaderNotes;
