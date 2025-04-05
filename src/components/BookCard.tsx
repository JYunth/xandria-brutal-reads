import { useState } from 'react';
import { Book, useBooks } from '@/context/BookContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// Re-import Dialog components for Details modal
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CheckCircle, ThumbsUp, ThumbsDown, ShieldCheck, Sparkles, Eye, Verified, Info } from 'lucide-react'; // Added Info icon
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
// Assuming Aptos logo SVG or component exists
// import AptosLogo from '@/components/AptosLogo';

interface BookCardProps {
  book: Book;
  inLibrary?: boolean; // Keep this prop if needed elsewhere, though BookstorePage doesn't use it
}

// Helper to calculate rating percentage
const calculateRating = (upvotes: number, downvotes: number): number => {
  const total = upvotes + downvotes;
  return total === 0 ? 0 : Math.round((upvotes / total) * 100);
};

export const BookCard = ({ book, inLibrary = false }: BookCardProps) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false); // State for details modal
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const { purchaseBook } = useBooks();

  const handlePurchase = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering modal if button is inside card click area
    setPurchasing(true);
    // --- Simulation ---
    setTimeout(() => {
      purchaseBook(book.id); // This uses the simulated context function
      setPurchased(true);
      // Reset after showing success
      setTimeout(() => {
        setPurchasing(false);
        setPurchased(false);
        // Optionally close preview modal if open? // Comment no longer relevant
      }, 1500);
    }, 1000);
    // --- End Simulation ---
  };

  const ratingPercent = calculateRating(book.upvotes, book.downvotes);
  const glowIntensity = ratingPercent > 85 ? 'high' : ratingPercent > 70 ? 'medium' : 'low';

  return (
    // Removed the outer fragment <> </> as it's no longer needed after removing the Dialog
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
        // Removed glassmorphism and glow effect classes
      )}
    >
      {/* Badges Overlay */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end">
        {book.isNFT && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {/* Wrap Badge in a span for proper ref forwarding */}
                <span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 border-purple-300 cursor-default">
                    <Sparkles className="h-3 w-3 mr-1" /> NFT
                  </Badge>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>This book includes a unique NFT representing ownership.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {book.isDRM && (
           <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                 {/* Wrap Badge in a span for proper ref forwarding */}
                 <span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-300 cursor-default">
                    <ShieldCheck className="h-3 w-3 mr-1" /> DRM
                  </Badge>
                 </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>DRM-Protected eBook for secure reading.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
         {book.isVerifiedAuthor && (
           <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                 {/* Wrap Badge in a span for proper ref forwarding */}
                 <span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300 cursor-default">
                    <Verified className="h-3 w-3 mr-1" /> Verified
                  </Badge>
                 </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Author identity verified.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Cover Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
         {/* Optional: Add a subtle gradient overlay */}
         <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-50 group-hover:opacity-75 transition-opacity"></div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow space-y-2">
        <h3 className="font-serif text-lg font-semibold leading-tight truncate">{book.title}</h3>
        <p className="text-sm text-muted-foreground truncate">{book.author}</p>

        {/* Ratings */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
           <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                 {/* Wrap div in a span for proper ref forwarding */}
                 <span className="inline-flex items-center gap-2 cursor-default">
                    <div className="flex items-center gap-0.5 text-green-600">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{book.upvotes}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-red-600">
                      <ThumbsDown className="h-3.5 w-3.5" />
                       <span>{book.downvotes}</span>
                    </div>
                 </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{ratingPercent}% Positive Rating</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="font-medium">{ratingPercent}% 👍</span>
          {/* Price Display */}
          <span className="font-medium">{book.priceApt?.toFixed(2)} APT</span>
        </div> {/* Close Ratings & Price div */}

        {/* Buttons */}
        <div className="flex gap-2 pt-2 mt-auto">
           {/* Details Button & Modal */}
           <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
             <DialogTrigger asChild>
               <Button variant="outline" size="sm" className="flex-1" onClick={(e) => e.stopPropagation()}>
                 <Info className="mr-1 h-4 w-4" /> Details
               </Button>
             </DialogTrigger>
             <DialogContent className="sm:max-w-[425px] md:max-w-[600px]"> {/* Adjust size as needed */}
               <DialogHeader>
                 {/* Title moved outside flex container to stay at top */}
                 <DialogTitle>{book.title}</DialogTitle>
               </DialogHeader>
               {/* Flex container for image and text */}
               <div className="flex gap-6 py-4">
                  {/* Cover Image (Smaller, on the side) */}
                  <div className="w-1/3 md:w-1/4 flex-shrink-0"> {/* Adjust width as needed */}
                    <img src={book.cover} alt={book.title} className="w-full h-auto object-contain rounded-md border" />
                  </div>
                  {/* Text Content Area */}
                  <div className="flex-grow space-y-4">
                     {/* Rating Info */}
                     <div className="flex items-center justify-between text-sm">
                     <span className="font-medium">{ratingPercent}% Positive Rating</span>
                     <div className="flex items-center gap-4 text-muted-foreground">
                       <div className="flex items-center gap-1">
                         <ThumbsUp className="h-4 w-4 text-green-600" />
                         <span>{book.upvotes}</span>
                       </div>
                       <div className="flex items-center gap-1">
                         <ThumbsDown className="h-4 w-4 text-red-600" />
                         <span>{book.downvotes}</span>
                       </div>
                     </div>
                  </div>
                  {/* Description */}
                  <p className="text-sm text-muted-foreground">{book.description}</p>
                  {/* Buy/Read Button inside Modal */}
                  <div className="pt-4">
                     {inLibrary ? (
                       <Link to={`/read/${book.id}`} className="w-full">
                         <Button size="sm" className="w-full" onClick={() => setShowDetailsModal(false)}>Read Now</Button>
                       </Link>
                     ) : (
                       <Button
                         size="sm"
                         className="w-full relative"
                         disabled={purchasing}
                         onClick={(e) => {
                           handlePurchase(e);
                           // Optionally close modal after purchase starts or finishes
                           // setShowDetailsModal(false);
                         }}
                       >
                         {purchasing ? (
                           purchased ? (
                             <span className="flex items-center justify-center">
                               <CheckCircle className="mr-1 h-4 w-4 text-white" /> Added
                             </span>
                           ) : (
                             "Processing..."
                           )
                         ) : (
                           `Buy & Mint NFT (${book.priceApt?.toFixed(2)} APT)`
                         )}
                       </Button>
                     )}
                     </div>
                  </div> {/* End Text Content Area */}
               </div> {/* End Flex Container */}
             </DialogContent>
           </Dialog>

          {/* Original Buy/Read Button */}
          {inLibrary ? (
             <Link to={`/read/${book.id}`} className="flex-1"> {/* Adjusted width */}
               <Button size="sm" className="w-full">Read Now</Button>
             </Link>
          ) : (
            <Button
              size="sm"
              className="flex-1 relative" // Adjusted width
              disabled={purchasing}
              onClick={handlePurchase}
            >
              {purchasing ? (
                purchased ? (
                  <span className="flex items-center justify-center">
                    <CheckCircle className="mr-1 h-4 w-4 text-white" /> Added
                  </span>
                ) : (
                  "Processing..."
                )
              ) : (
                "Buy & Mint NFT"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;