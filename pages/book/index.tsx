import { useRouter } from "next/router";
import { useState } from "react";

const page = () => {
const [isButtonClicked, setButtonClicked] = useState(false);
const router = useRouter()






    // const handleButtonClick = () => {
    //     // Вы можете добавить здесь логику для проверки разрешения.
    //     // Например, если пользователь авторизован и имеет право на доступ,
    //     // вы можете установить isButtonClicked в true.
    
    //     // В данном примере просто устанавливаем isButtonClicked в true:
    //     setButtonClicked(true);
    //     router.push('/book/1'); // Перенаправление на динамический путь после нажатия кнопки.
    //   };
    return (
  <div>Список блокнотов</div>
    )
}


export default page;




const getServerSideProps = (context:any) => {




}