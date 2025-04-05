
import { useState, useEffect } from 'react';
import { useBooks } from '@/context/BookContext';

interface PDFViewerProps {
  bookId: string;
}

const PDFViewer = ({ bookId }: PDFViewerProps) => {
  const { currentBook, readingProgress, updateReadingProgress } = useBooks();
  const [zoom, setZoom] = useState(100);
  
  // In a real app, we'd load the actual PDF document
  // For this demo, we'll simulate PDF pages
  const totalPages = currentBook?.pages || 10;
  const [currentPage, setCurrentPage] = useState(1);
  
  // Initialize with saved reading progress
  useEffect(() => {
    if (bookId && readingProgress[bookId]) {
      setCurrentPage(readingProgress[bookId]);
    }
  }, [bookId, readingProgress]);
  
  // Update reading progress when page changes
  useEffect(() => {
    if (bookId) {
      updateReadingProgress(bookId, currentPage);
    }
  }, [bookId, currentPage, updateReadingProgress]);

  const navigateToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate mock content for the page
  const generatePageContent = () => {
    if (!currentBook) return null;
    
    return (
      <div className="p-8 font-serif">
        <h1 className="text-2xl font-bold mb-6">{currentBook.title}</h1>
        <h2 className="text-xl mb-8">Chapter {Math.ceil(currentPage / 5)}</h2>
        
        <p className="mb-4">
          {currentBook.preview} This is page {currentPage} of the book. 
        </p>
        
        <p className="mb-4">
          The library of Alexandria was one of the largest and most significant libraries of the ancient world. 
          The library was part of a larger research institution called the Mouseion, which functioned as a
          cultural center, university, and library. The library is famous for having been burned, resulting in
          the loss of many scrolls and books.
        </p>
        
        <p>
          The burning of the Library of Alexandria represents for many the loss of cultural knowledge and
          highlights the fragility of human knowledge in the face of destruction. Many wonder what
          knowledge and insights were lost in the fire, and how our modern world might be different if
          those texts had survived.
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="space-x-4">
          <button
            onClick={() => navigateToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-1 bg-muted rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => navigateToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 bg-muted rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <div>
            <button 
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="px-2 py-1 bg-muted rounded"
            >
              -
            </button>
            <span className="mx-2 text-sm">{zoom}%</span>
            <button 
              onClick={() => setZoom(Math.min(200, zoom + 10))}
              className="px-2 py-1 bg-muted rounded"
            >
              +
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto bg-white">
        <div 
          className="min-h-full w-full max-w-3xl mx-auto border shadow-lg"
          style={{ 
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s'
          }}
        >
          {generatePageContent()}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
