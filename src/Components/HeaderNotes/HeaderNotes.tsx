import { useEffect, useState } from 'react';
import s from './HeaderNotes.module.scss';
import Notes from './notes.svg';
import Recycle from './recycle.svg';
import { useRouter } from 'next/router';


const HeaderNotes = ({data}:any) => {
  const [counterNotes, setCounterNotes] = useState(data.length);
  const router = useRouter();
  const routerRecycle = router.asPath.split('/')[1] === 'recycle';
  useEffect(()=> {
    setCounterNotes(data.length)
  },[router])


  function declOfNum(number:number, titles:string[]) { // это не я такой умный, это не моя функция, ну простите..
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[
      number % 100 > 4 && number % 100 < 20
        ? 2
        : cases[number % 10 < 5 ? number % 10 : 5]
    ];
  }
  

  
const result = `${counterNotes} ${declOfNum(counterNotes, ['Заметка', 'Заметки', 'Заметок'])}`;
  return <div className={s.header}>
    <div className={s.container}>
    {routerRecycle ?   <><Recycle /><p>КОРЗИНА</p></> : <><Notes /><p>ЗАМЕТКИ</p></>}
      
      </div>

    <div className={s.allNotesCounter}>{result}</div>
  </div>;
};

export default HeaderNotes;
