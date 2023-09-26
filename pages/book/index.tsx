import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { create_data, get_action } from "../api/actios";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { withLayout } from "../../layout/Layout";
import { redirect } from "next/dist/server/api-utils";
import { SIGNIN } from "../api/paths";
import { useSession } from "next-auth/react";
import Link from "next/link";

const page = ({ data }: any) => {
  const [isButtonClicked, setButtonClicked] = useState(false);
  const [dataBook, setDataBook] = useState<any>();
  const router = useRouter();
  const [bookName, setBookName] = useState<string>('');
  const session = useSession();
  const email = session.data?.user.email;
  const userId = session.data?.user.userId;

  async function buttonCreateNewBook(nameBook: string) {
    try {
      const res = fetch(`/api/createData?action=${create_data.create_book}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: nameBook,
          idPage: dataBook.length,
          email: email,
          userId: userId,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  }
  async function getDatabook() {
    try {
      const res = await fetch(
        `/api/getData?action=${get_action.id_page_book}&userId=${userId}&email=${email}`
      );
      if (!res.ok) {
        throw new Error(`Ошибка при запросе: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setDataBook(data); // Обновляем состояние dataBook
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getDatabook();
  }, [userId, email,bookName]);

  // const handleButtonClick = () => {
  //     // Вы можете добавить здесь логику для проверки разрешения.
  //     // Например, если пользователь авторизован и имеет право на доступ,
  //     // вы можете установить isButtonClicked в true.

  //     // В данном примере просто устанавливаем isButtonClicked в true:
  //     setButtonClicked(true);
  //     router.push('/book/1'); // Перенаправление на динамический путь после нажатия кнопки.
  //   };

  return (
    <div>
      <input
        onChange={(e) => setBookName(e.target.value)}
        placeholder="создать блокнот" value={bookName}
      />
      <button
        onClick={() => {
          buttonCreateNewBook(
            bookName
          );
          setBookName('')
        }}
      >
        Создать блокнот
      </button>
      {dataBook &&
        dataBook.map((item:any, id:number) => {
          return <div key={id}><Link href={`book/${item.idPage}`} key={item.name}> {item.name} </Link></div>
        })}
    </div>
  );
};

export default withLayout(page);

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const email = session?.user.email;
  const userId = session?.user.userId;
  const res = await fetch(
    `${process.env.DOMAIN}/api/getData?action=${get_action.id_page_book}&userId=${userId}&email=${email}`
  );
  const data = await res.json();

  if (!session) {
    return {
      redirect: {
        destination: `/${SIGNIN}`,
        permanent: false,
      },
    };
  }


  return {
    props: {
      data,
    },
  };
}
