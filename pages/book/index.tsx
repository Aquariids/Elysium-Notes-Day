import { useRouter } from "next/router";
import { useState } from "react";

const page = () => {
const [isButtonClicked, setButtonClicked] = useState(false);
const router = useRouter()






    const handleButtonClick = () => {
        // Вы можете добавить здесь логику для проверки разрешения.
        // Например, если пользователь авторизован и имеет право на доступ,
        // вы можете установить isButtonClicked в true.
    
        // В данном примере просто устанавливаем isButtonClicked в true:
        setButtonClicked(true);
        router.push('/book/1'); // Перенаправление на динамический путь после нажатия кнопки.
      };
    return (
        <div>
        <div>Тут я создаю блокнот и даю ему название.</div>
        <input placeholder="блокнот 1"/>
        <div>Это название сохраняется в базе.</div>
        <div>Сам блокнот при этом это номер в динамическом пути. То есть первый блокнот, не важно как его назвал человек, это в любом случае будет book/1</div>
        <div>Всем заметкам которые я буду добавлять в этот блокнот будет присваиваться номер блокнота, то есть в случае с первым это 1. Это мы будем записывать заметке в базе.</div>
        <div>Что значит, что там будут отображаться заметки у которых совпадает их номер и bookId из route </div>
        <hr/>
        <br/>
        <div>Теперь нужна логика этого всего. То есть мне нужно заблокировать любые переходы по пути, пока пользователь не создал блокнот</div>
        <div>При создании блокнота сразу туда перемещать пользователя или нет?</div>
        <div>Нужно сделать логику того, как человек будет добавлять заметку к блокноту.</div>

        <div>
      <h1>Домашняя страница</h1>
      {!isButtonClicked ? (
        <button onClick={handleButtonClick}>Нажмите, чтобы создать динамический путь</button>
      ) : (
        <p>Динамический путь создан, вы можете перейти на <a href="/book/1">/book/1</a></p>
      )}
    </div> 
        </div>

        
    )
}


export default page;




const getServerSideProps = (context:any) => {




}