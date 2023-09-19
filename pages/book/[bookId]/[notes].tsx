import { useRouter } from 'next/router';

function SubPage() {
  const router = useRouter();
  const { bookId, notes } = router.query;

  // Здесь вы можете использовать значения bookId и subId для отображения контента,
  // связанного с первым и вторым параметрами соответственно.

  return (
    <div>
      <h1>Второй динамический путь</h1>
      <p>Первый динамический параметр (bookId): {bookId}</p>
      <p>Второй динамический параметр (notes): {notes}</p>
    </div>
  );
}

export default SubPage;
