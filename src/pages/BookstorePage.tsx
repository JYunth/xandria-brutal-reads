
import { useBooks } from '@/context/BookContext';
import BookCard from '@/components/BookCard';

const BookstorePage = () => {
  const { storeBooks } = useBooks();

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="font-serif text-4xl font-bold mb-4">Xandria Bookstore</h1>
        <p className="text-muted-foreground">
          Browse our curated collection of knowledge. Each book you purchase is truly yours forever.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {storeBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BookstorePage;
