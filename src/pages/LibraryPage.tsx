
import { useBooks } from '@/context/BookContext';
import BookCard from '@/components/BookCard';

const LibraryPage = () => {
  const { userBooks } = useBooks();

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="font-serif text-4xl font-bold mb-4">Your Library</h1>
        <p className="text-muted-foreground">
          Your personal collection of books, owned and secured in your wallet.
        </p>
      </div>

      {userBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {userBooks.map((book) => (
            <BookCard key={book.id} book={book} inLibrary={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 brutalist-container">
          <h3 className="font-serif text-xl mb-2">Your library is empty</h3>
          <p className="text-muted-foreground mb-4">
            Visit the bookstore to discover and purchase books for your collection.
          </p>
          <a href="/bookstore" className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md">
            Browse Bookstore
          </a>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
