import { useRouter } from 'next/router';
import { SIGNIN } from '../api/paths';
import { get_action } from '../api/actios';
import { authOptions } from '../api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';

function BookPage() {
  const router = useRouter();
  const { bookId } = router.query;

  // Здесь вы можете использовать значение bookId для отображения контента, связанного с этим параметром.


  return (
    <div>
      {bookId}
    </div>
  );
}

export default BookPage;


export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const { bookId } = context.query;  
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


  if(!data[bookId]) {
    return {
      redirect: {
        destination: `/book`
      }
    }
  }
  // console.log(data.length - 1 > data[data.length] );
  

  return {
    props: {
      data,
    },
  };
}
