
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Define types
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  cover: string;
  price: string;
  pages: number;
  preview: string;
  genre: string[];
}

interface BookContextType {
  storeBooks: Book[];
  userBooks: Book[];
  purchaseBook: (bookId: string) => void;
  currentBook: Book | null;
  setCurrentBook: (book: Book | null) => void;
  readingProgress: Record<string, number>;
  updateReadingProgress: (bookId: string, page: number) => void;
}

// Create the context
const BookContext = createContext<BookContextType | undefined>(undefined);

// Sample books data
const SAMPLE_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Eternal Library',
    author: 'Alexandria Reed',
    description: 'A fascinating journey through the ancient libraries of the world, culminating in an exploration of the Library of Alexandria and its lasting impact on human knowledge.',
    cover: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098',
    price: '0.05 ETH',
    pages: 324,
    preview: 'The Library of Alexandria was one of the largest and most significant libraries of the ancient world...',
    genre: ['History', 'Non-fiction', 'Ancient Civilization']
  },
  {
    id: '2',
    title: 'Concrete Dreams',
    author: 'Marcus Vitruvius',
    description: 'An architectural masterpiece examining the brutal beauty of modern concrete structures and their impact on urban landscapes.',
    cover: 'https://images.unsplash.com/photo-1494891848038-7bd202a2afeb',
    price: '0.03 ETH',
    pages: 210,
    preview: 'The raw, unfinished texture of concrete speaks to something primal in our understanding of shelter...',
    genre: ['Architecture', 'Design', 'Modernism']
  },
  {
    id: '3',
    title: 'Decentralized Knowledge',
    author: 'Satoshi Bibliotech',
    description: 'A groundbreaking exploration of how blockchain technology is revolutionizing access to information and reshaping traditional institutions of knowledge.',
    cover: 'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e',
    price: '0.08 ETH',
    pages: 412,
    preview: 'The promise of blockchain extends far beyond currency - it offers a new paradigm for information ownership and access...',
    genre: ['Technology', 'Blockchain', 'Information Science']
  },
  {
    id: '4',
    title: 'Minimalist Manifestation',
    author: 'Claire Whitespace',
    description: 'A philosophical guide to finding beauty in simplicity and creating spaces that breathe with intention and purpose.',
    cover: 'https://images.unsplash.com/photo-1486718448742-163732cd1544',
    price: '0.04 ETH',
    pages: 186,
    preview: 'Empty space is not nothing - it is the canvas upon which meaningful objects can assert their presence...',
    genre: ['Philosophy', 'Design', 'Minimalism']
  },
  {
    id: '5',
    title: 'Royal Archives',
    author: 'Elizabeth Manuscript',
    description: 'Dive into the secret archives of European royal families, with newly uncovered documents revealing centuries of intrigue and power.',
    cover: 'https://images.unsplash.com/photo-1466442929976-97f336a657be',
    price: '0.07 ETH',
    pages: 520,
    preview: 'Behind every throne lies a shadow archive, documents preserved by those who understood the power of the written word...',
    genre: ['History', 'Royalty', 'European Studies']
  },
  {
    id: '6',
    title: 'Modern Structures',
    author: 'Brutus Architect',
    description: 'An analysis of contemporary brutalist architecture and its renaissance in digital culture and design aesthetics.',
    cover: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625',
    price: '0.06 ETH',
    pages: 287,
    preview: 'The honesty of raw materials speaks a language more authentic than any ornamental flourish could achieve...',
    genre: ['Architecture', 'Art History', 'Design']
  }
];

export function BookProvider({ children }: { children: ReactNode }) {
  const [storeBooks, setStoreBooks] = useState<Book[]>(SAMPLE_BOOKS);
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [readingProgress, setReadingProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    // Load user's books from local storage
    const storedBooks = localStorage.getItem('xandria_user_books');
    if (storedBooks) {
      setUserBooks(JSON.parse(storedBooks));
    }

    // Load reading progress from local storage
    const storedProgress = localStorage.getItem('xandria_reading_progress');
    if (storedProgress) {
      setReadingProgress(JSON.parse(storedProgress));
    }
  }, []);

  const purchaseBook = (bookId: string) => {
    const book = storeBooks.find(book => book.id === bookId);
    if (book && !userBooks.some(userBook => userBook.id === bookId)) {
      const updatedUserBooks = [...userBooks, book];
      setUserBooks(updatedUserBooks);
      localStorage.setItem('xandria_user_books', JSON.stringify(updatedUserBooks));
      toast.success(`"${book.title}" added to your library!`);
    } else {
      toast.error('You already own this book!');
    }
  };

  const updateReadingProgress = (bookId: string, page: number) => {
    const updatedProgress = { ...readingProgress, [bookId]: page };
    setReadingProgress(updatedProgress);
    localStorage.setItem('xandria_reading_progress', JSON.stringify(updatedProgress));
  };

  return (
    <BookContext.Provider value={{
      storeBooks,
      userBooks,
      purchaseBook,
      currentBook,
      setCurrentBook,
      readingProgress,
      updateReadingProgress
    }}>
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
}
