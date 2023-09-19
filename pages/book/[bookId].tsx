
import { useRouter } from 'next/router';

function BookPage() {
  const router = useRouter();
  const { bookId } = router.query;

  // Здесь вы можете использовать значение bookId для отображения контента, связанного с этим параметром.

  return (
    <div>
      <h1>Страница книги</h1>
      <p>Динамический параметр (bookId): {bookId}</p>
    </div>
  );
}

export default BookPage;





// getServerSideProps
// fetch 
// если не создан путь
// перенаправляю на book