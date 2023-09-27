import { useRouter } from 'next/router';
import { SIGNIN } from '../api/paths';
import { get_action } from '../api/actios';
import { authOptions } from '../api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';

function BookPage({data}:any) {
  const router = useRouter();
  const { bookId } = router.query;

  // Здесь вы можете использовать значение bookId для отображения контента, связанного с этим параметром.

  return (
    <div>
      создать заметку +
    </div>
  );
}

export default BookPage;


export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const { bookId } = context.query;  
  const email = session?.user.email;
  const userId = session?.user.userId;


  try {
    const res = await fetch(
      `${process.env.DOMAIN}/api/getData?action=${get_action.data_editor}&userId=${userId}&email=${email}`
    );
    const actionSorting = await fetch(
      `${process.env.DOMAIN}/api/getData?action=${get_action.action_sorting}&userId=${userId}&email=${email}`
    );

    const resBook = await fetch(
      `${process.env.DOMAIN}/api/getData?action=${get_action.id_page_book}&userId=${userId}&email=${email}`
    );
    const dataBook = await resBook.json();
  
    const sort = await actionSorting.json();
    const data = await res.json();
    
  if(!session){
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }
  if(!dataBook[bookId]) {
    return {
      redirect: {
        destination: `/book`
      }
    }
  }

  if (session && data[0] != undefined && sort[0].sorting === 'dateDown') {
    return {
      redirect: {
        destination: `/book/${data[0]._id}`,
        permanent: false,
      },
    };
  } if (session && data[0] != undefined && sort[0].sorting === 'dateUp') {
    return {
      redirect: {
        destination: `/book/${data[data.length - 1]._id}`,
        permanent: false,
      },
    };
  }  

  if(session && data[0] != undefined) {
    return {
      redirect: {
        destination: `/book/${bookId}/${data[0]._id}`,
        permanent: false,
      },
       props:{ data}
    };
  }  
  
  return {
    props:{ data}
  }
  }

  catch(err) {
    console.error(err);
    
  }

}
