
import { useState } from 'react';
import { Book, useBooks } from '@/context/BookContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface BookCardProps {
  book: Book;
  inLibrary?: boolean;
}

const BookCard = ({ book, inLibrary = false }: BookCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const { purchaseBook } = useBooks();

  const handlePurchase = () => {
    setPurchasing(true);
    setTimeout(() => {
      purchaseBook(book.id);
      setPurchased(true);
      
      // Reset after showing success
      setTimeout(() => {
        setPurchasing(false);
        setPurchased(false);
        setShowDetails(false);
      }, 1500);
    }, 1000);
  };

  return (
    <>
      <div 
        onClick={() => setShowDetails(true)}
        className="group cursor-pointer overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="brutalist-container h-full flex flex-col">
          <div className="relative aspect-[2/3] overflow-hidden mb-4">
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col flex-grow">
            <h3 className="font-serif text-lg font-medium">{book.title}</h3>
            <p className="text-sm text-muted-foreground">{book.author}</p>
            {!inLibrary && (
              <p className="mt-auto pt-2 text-sm font-medium text-primary">{book.price}</p>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{book.title}</DialogTitle>
            <DialogDescription>{book.author}</DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <img src={book.cover} alt={book.title} className="w-full rounded-md" />
            </div>
            
            <div className="col-span-2 space-y-4">
              <div>
                <h4 className="font-medium">Description</h4>
                <p className="text-sm text-muted-foreground">{book.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {book.genre.map((tag) => (
                  <span key={tag} className="bg-muted px-2 py-1 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pages: {book.pages}</p>
                  {!inLibrary && <p className="font-medium">{book.price}</p>}
                </div>
                
                {inLibrary ? (
                  <Link to={`/read/${book.id}`}>
                    <Button>Read Now</Button>
                  </Link>
                ) : (
                  <Button 
                    disabled={purchasing}
                    onClick={handlePurchase}
                    className={cn(
                      "relative",
                      purchasing && "bg-muted text-muted-foreground"
                    )}
                  >
                    {purchasing ? (
                      purchased ? (
                        <span className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500 animate-check-mark" />
                          Added to Library
                        </span>
                      ) : (
                        "Processing..."
                      )
                    ) : (
                      "Purchase"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookCard;
