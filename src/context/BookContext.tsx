import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Define types
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  cover: string; // URL to cover image
  pages: number;
  genre: string[];

  // Pricing
  priceApt: number; // Price in APT (e.g., 0.05)

  // Ratings & Status
  upvotes: number;
  downvotes: number;
  isDRM: boolean; // Is the book DRM protected?
  isNFT: boolean; // Is this listing represented as an NFT?
  isVerifiedAuthor: boolean; // Is the author verified?

  // Preview
  previewPageUrls: string[]; // Array of image URLs for the preview modal
}

interface BookContextType {
  storeBooks: Book[];
  userBooks: Book[];
  purchaseBook: (bookId: string) => void; // Keep simulation for now
  currentBook: Book | null;
  setCurrentBook: (book: Book | null) => void;
  readingProgress: Record<string, number>;
  updateReadingProgress: (bookId: string, page: number) => void;
}

// Create the context
const BookContext = createContext<BookContextType | undefined>(undefined);

// --- Updated Sample Books Data ---
const SAMPLE_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Eternal Library',
    author: 'Alexandria Reed',
    description: 'A fascinating journey through the ancient libraries of the world, culminating in an exploration of the Library of Alexandria and its lasting impact on human knowledge.',
    cover: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098',
    pages: 324,
    genre: ['History', 'Non-fiction', 'Ancient Civilization'],
    priceApt: 0.05,
    upvotes: 125,
    downvotes: 10,
    isDRM: true,
    isNFT: true,
    isVerifiedAuthor: true,
    previewPageUrls: [
      'https://via.placeholder.com/600x800/cccccc/888888?text=Preview+Page+1',
      'https://via.placeholder.com/600x800/cccccc/888888?text=Preview+Page+2'
    ]
  },
  {
    id: '2',
    title: 'Concrete Dreams',
    author: 'Marcus Vitruvius',
    description: 'An architectural masterpiece examining the brutal beauty of modern concrete structures and their impact on urban landscapes.',
    cover: 'https://images.unsplash.com/photo-1494891848038-7bd202a2afeb',
    pages: 210,
    genre: ['Architecture', 'Design', 'Modernism'],
    priceApt: 0.03,
    upvotes: 88,
    downvotes: 5,
    isDRM: true,
    isNFT: true,
    isVerifiedAuthor: false,
    previewPageUrls: [
      'https://via.placeholder.com/600x800/cccccc/888888?text=Preview+Page+1',
      'https://via.placeholder.com/600x800/cccccc/888888?text=Preview+Page+2'
    ]
  },
  {
    id: '3',
    title: 'Decentralized Knowledge',
    author: 'Satoshi Bibliotech',
    description: 'A groundbreaking exploration of how blockchain technology is revolutionizing access to information and reshaping traditional institutions of knowledge.',
    cover: 'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e',
    pages: 412,
    genre: ['Technology', 'Blockchain', 'Information Science'],
    priceApt: 0.08,
    upvotes: 210,
    downvotes: 15,
    isDRM: true,
    isNFT: true,
    isVerifiedAuthor: true,
    previewPageUrls: [
      'https://via.placeholder.com/600x800/cccccc/888888?text=Preview+Page+1',
      'https://via.placeholder.com/600x800/cccccc/888888?text=Preview+Page+2'
    ]
  },
  {
    id: '4',
    title: 'Minimalist Manifestation',
    author: 'Claire Whitespace',
    description: 'A philosophical guide to finding beauty in simplicity and creating spaces that breathe with intention and purpose.',
    cover: 'https://images.unsplash.com/photo-1486718448742-163732cd1544',
    pages: 186,
    genre: ['Philosophy', 'Design', 'Minimalism'],
    priceApt: 0.04,
    upvotes: 95,
    downvotes: 3,
    isDRM: true,
    isNFT: true,
    isVerifiedAuthor: false,
    previewPageUrls: [
      'https://via.placeholder.com/600x800/cccccc/888888?text=Preview+Page+1',
      'https://via.placeholder.com/600x800/cccccc/888888?text=Preview+Page+2'
    ]
  },
  {
    id: '5',
    title: 'Royal Archives',
    author: 'Elizabeth Manuscript',
    description: 'Dive into the secret archives of European royal families, with newly uncovered documents revealing centuries of intrigue and power.',
    cover: 'https://images.unsplash.com/photo-1466442929976-97f336a657be',
    pages: 520,
    genre: ['History', 'Royalty', 'European Studies'],
    priceApt: 0.07,
    upvotes: 150,
    downvotes: 25,
    isDRM: true,
    isNFT: true,
    isVerifiedAuthor: true,
    previewPageUrls: [
      'https://via.placeholder.com/600x800/cccccc/888888?text=Preview+Page+1',
      'https://via.placeholder.com/600x800/cccccc/888888?text=Preview+Page+2'
    ]
  },
  {
    id: '6',
    title: 'Modern Structures',
    author: 'Brutus Architect',
    description: 'An analysis of contemporary brutalist architecture and its renaissance in digital culture and design aesthetics.',
    cover: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625',
    pages: 287,
    genre: ['Architecture', 'Art History', 'Design'],
    priceApt: 0.06,
    upvotes: 115,
    downvotes: 8,
    isDRM: true,
    isNFT: true,
    isVerifiedAuthor: false,
    previewPageUrls: [
      'https://via.placeholder.com/600x800/cccccc/888888?text=Preview+Page+1',
      'https://via.placeholder.com/600x800/cccccc/888888?text=Preview+Page+2'
    ]
  }
];
// --- End Sample Books Data ---

// LocalStorage Keys
const STORE_BOOKS_KEY = 'xandria_store_books';
const USER_BOOKS_KEY = 'xandria_user_books';
const READING_PROGRESS_KEY = 'xandria_reading_progress';

export function BookProvider({ children }: { children: ReactNode }) {
  const [storeBooks, setStoreBooks] = useState<Book[]>([]);
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [readingProgress, setReadingProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    // Load store books from local storage or initialize
    const storedStoreBooks = localStorage.getItem(STORE_BOOKS_KEY);
    if (storedStoreBooks) {
      setStoreBooks(JSON.parse(storedStoreBooks));
    } else {
      setStoreBooks(SAMPLE_BOOKS);
      localStorage.setItem(STORE_BOOKS_KEY, JSON.stringify(SAMPLE_BOOKS));
    }

    // Load user's books from local storage
    const storedUserBooks = localStorage.getItem(USER_BOOKS_KEY);
    if (storedUserBooks) {
      setUserBooks(JSON.parse(storedUserBooks));
    }

    // Load reading progress from local storage
    const storedProgress = localStorage.getItem(READING_PROGRESS_KEY);
    if (storedProgress) {
      setReadingProgress(JSON.parse(storedProgress));
    }
  }, []);

  // --- Simulation - Replace with actual Aptos interaction ---
  const purchaseBook = (bookId: string) => {
    const book = storeBooks.find(book => book.id === bookId);
    if (book && !userBooks.some(userBook => userBook.id === bookId)) {
      const updatedUserBooks = [...userBooks, book];
      setUserBooks(updatedUserBooks);
      localStorage.setItem(USER_BOOKS_KEY, JSON.stringify(updatedUserBooks)); // Persist user books
      toast.success(`"${book.title}" added to your library!`);
    } else if (userBooks.some(userBook => userBook.id === bookId)) {
       toast.error('You already own this book!');
    } else {
       toast.error('Book not found.');
    }
  };
  // --- End Simulation ---

  const updateReadingProgress = (bookId: string, page: number) => {
    const updatedProgress = { ...readingProgress, [bookId]: page };
    setReadingProgress(updatedProgress);
    localStorage.setItem(READING_PROGRESS_KEY, JSON.stringify(updatedProgress)); // Persist progress
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
