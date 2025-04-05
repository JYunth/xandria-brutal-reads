
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooks } from '@/context/BookContext';
import PDFViewer from '@/components/Reader/PDFViewer';
import AISidebar from '@/components/Reader/AISidebar';

const epubUrl = "https://backend.caco3.workers.dev/book/2656" ;

const ReaderPage = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const { userBooks, setCurrentBook, currentBook } = useBooks();
  const navigate = useNavigate();

  useEffect(() => {
    if (!bookId) {
      navigate('/library');
      return;
    }

    const book = userBooks.find(b => b.id === bookId);
    
    if (!book) {
      navigate('/library');
      return;
    }

    setCurrentBook(book);

    return () => {
      setCurrentBook(null);
    };
  }, [bookId, userBooks, navigate, setCurrentBook]);

  if (!currentBook) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl mb-2">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] -mt-8 -mx-4">
      <div className="flex h-full">
        <div className="flex-1 overflow-hidden">
          <PDFViewer epubUrl={epubUrl} />
        </div>
        <div className="w-80">
          <AISidebar />
        </div>
      </div>
    </div>
  );
};

export default ReaderPage;
