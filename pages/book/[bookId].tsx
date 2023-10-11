import { useRouter } from 'next/router';
import { SIGNIN } from '../api/paths';
import { get_action } from '../api/actios';
import { authOptions } from '../api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';

function BookPage({data, idforpage}:any) {
  console.log("🚀 ~ file: [bookId].tsx:8 ~ BookPage ~ idforpage:", idforpage)
  const router = useRouter();
  const { bookId } = router.query;
  // Здесь вы можете использовать значение bookId для отображения контента, связанного с этим параметром.
  if(idforpage != null && String(idforpage) === bookId) {
    return (
      <div>
        создать заметку +
      </div>
    )
  } else {
    return (
      <>

      НЕт такокооо
      </>
    )
  }

}

export default BookPage;

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const { bookId } = context.query;
  const email = session?.user.email;
  const userId = session?.user.userId;
  try {
    const res = await fetch(
      `${process.env.DOMAIN}/api/getData?action=${get_action.data_editorBook}&userId=${userId}&email=${email}&idPage=${bookId}`
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
    console.log("🚀 ~ file: [bookId].tsx:50 ~ getServerSideProps ~ data:", data)
    
    const idforpage = dataBook[bookId] ? dataBook[bookId].idPage: null; 
      
  if(!session){
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  if (session && data[0] != undefined && sort[0].sorting === 'dateDown') {
    return {
      redirect: {
        destination: `/book/${idforpage}/${data[0]._id}`,
        permanent: false,
      },
    };
  } if (session && data[0] != undefined && sort[0].sorting === 'dateUp') {
    return {
      redirect: {
        destination: `/book/${idforpage}/${data[data.length - 1]._id}`,
        permanent: false,
      },
    };
  }  


  if(session && data[0] != undefined) {
    return {
      redirect: {
        destination: `/book/${idforpage}/${data[0]._id}`,
        permanent: false,
      },
       props:{data}
    };
  }  


  return {
    props:{ data, idforpage}
    }
  }

  catch(err) {
    console.error(err);
  }
}
