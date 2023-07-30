import s from './HeaderNotes.module.scss';
import Notes from './notes.svg';

function declOfNum(number:number, titles:string[]) { // это не я такой умный, это не моя функция, ну простите..
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : cases[number % 10 < 5 ? number % 10 : 5]
  ];
}


const HeaderNotes = ({length}:any) => {

  const number = length;
const result = `${number} ${declOfNum(number, ['Заметка', 'Заметки', 'Заметок'])}`;
  return <div className={s.header}>
    <div className={s.container}><Notes/> <p>ЗАМЕТКИ</p></div>

    <div className={s.allNotesCounter}>{result}</div>
  </div>;
};

export default HeaderNotes;
