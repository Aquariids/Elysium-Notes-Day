import Link from "next/link";
import React from "react";

const Error404 = ({ notes = false }: any): JSX.Element => {
  if (notes) {
    return (
      <div className="error404">
        <h1>Аниме девочка украла заметку</h1>
        <div className="error__image">
          <img src="/error404Notes.jpg" />
          <p>Такой заметки не существует</p>
          <span>
          Заметка, которую вы ищете, не существует или была удалена.
          </span>
          <button className="error__btn">
            {" "}
            <Link href={"/notes"}>Вернуться к заметкам</Link>{" "}
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="error404">
        <h1>Страница не найдена</h1>
        <div className="error__image">
          <img src="/error404.jpg" />
          <p>Мы не смогли найти то, что вы искали.</p>
          <span>
            Пожалуйста, свяжитесь с владельцем сайта, с которого вы перешли по
            URL адресу, и дайте знать о сломанной ссылке.
          </span>
          <button className="error__btn">
            {" "}
            <Link href={"/"}>Вернуться на главную страницу</Link>{" "}
          </button>
        </div>
      </div>
    );
  }
};

export default Error404;
