import { useState, useMemo } from 'react';
import { Book, useBooks } from '@/context/BookContext'; // Import Book type
import { BookCard } from '@/components/BookCard'; // Use named import
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
// Import Dialog components for list view modal
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, LayoutGrid, List, Rows, Library, Filter, ArrowUpDown, Wallet, X, Download, Tag, Eye, Info, ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react'; // Added Info, ThumbsUp, ThumbsDown, CheckCircle
import Fuse from 'fuse.js'; // Import Fuse.js for fuzzy search
import { Link } from 'react-router-dom'; // Import Link
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"; // Import Carousel
import { Card, CardContent } from "@/components/ui/card"; // Import Card for Author Spotlight
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar for Author Spotlight
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; // Import Accordion for Explainer

const BookstorePage = () => {
  const { storeBooks, userBooks } = useBooks(); // Also get userBooks for the drawer
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popularity'); // Default sort
  const [viewMode, setViewMode] = useState<'grid' | 'carousel' | 'list'>('grid');
  const [showFree, setShowFree] = useState(false);
  const [showStaked, setShowStaked] = useState(false); // Assuming isVerifiedAuthor maps to staked? Need clarification

  // Helper to calculate rating percentage (can be moved to utils)
  const calculateRating = (upvotes: number, downvotes: number): number => {
    const total = upvotes + downvotes;
    return total === 0 ? 0 : Math.round((upvotes / total) * 100);
  };

  // --- Filtering & Sorting Logic ---
  const fuse = useMemo(() => new Fuse(storeBooks, {
    keys: ['title', 'author', 'genre'], // Add 'tags' if available in Book interface later
    threshold: 0.4, // Adjust threshold for fuzziness (0.0 = exact match, 1.0 = match anything)
    includeScore: true,
  }), [storeBooks]);

  const filteredAndSortedBooks = useMemo(() => {
    let booksToDisplay: Book[] = storeBooks;

    // 1. Fuzzy Search (if query exists)
    if (searchQuery.trim()) {
      booksToDisplay = fuse.search(searchQuery.trim()).map(result => result.item);
    }

    // 2. Genre Filter
    if (selectedGenres.length > 0) {
      booksToDisplay = booksToDisplay.filter(book =>
        selectedGenres.every(selGenre => book.genre.includes(selGenre))
      );
    }

    // 3. Optional Filters
    if (showFree) {
      booksToDisplay = booksToDisplay.filter(book => book.priceApt === 0);
    }
    if (showStaked) {
      // Assuming isVerifiedAuthor indicates a staked author for now
      booksToDisplay = booksToDisplay.filter(book => book.isVerifiedAuthor);
    }

    // 4. Sorting - Create a copy to avoid mutating the original array
    const sortedBooks = [...booksToDisplay];
    switch (sortBy) {
      case 'popularity': // Higher rating = more popular
        sortedBooks.sort((a, b) => {
          const ratingA = calculateRating(a.upvotes, a.downvotes);
          const ratingB = calculateRating(b.upvotes, b.downvotes);
          return ratingB - ratingA; // Descending
        });
        break;
      case 'newest':
        // Requires a 'createdAt' or similar field in Book interface. Assuming ID implies order for now.
        sortedBooks.sort((a, b) => parseInt(b.id) - parseInt(a.id)); // Descending ID
        break; // Added missing break
      case 'rating': // Same as popularity for now
        sortedBooks.sort((a, b) => {
          const ratingA = calculateRating(a.upvotes, a.downvotes);
          const ratingB = calculateRating(b.upvotes, b.downvotes);
          return ratingB - ratingA; // Descending
        });
        break;
      case 'price_asc':
        sortedBooks.sort((a, b) => a.priceApt - b.priceApt); // Ascending
        break;
      case 'price_desc':
        sortedBooks.sort((a, b) => b.priceApt - a.priceApt); // Descending
        break;
      default:
        break; // No sort or default sort
    }

    return sortedBooks;
  }, [storeBooks, searchQuery, selectedGenres, showFree, showStaked, sortBy, fuse]);

  // --- End Filtering & Sorting Logic ---


  // TODO: Get actual wallet status from AuthContext
  const walletStatus = { connected: true, address: 'jheyanth.apt' }; // Placeholder

  // Dynamically get unique genres from the books
  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    storeBooks.forEach(book => book.genre.forEach(g => genres.add(g)));
    return Array.from(genres).sort();
  }, [storeBooks]);

  // Handle genre selection changes (for multi-select later)
  const handleGenreChange = (value: string) => {
    // Use a special value for "All Genres"
    if (value === "__ALL__") {
      setSelectedGenres([]);
    } else {
       // For now, simple single select replace
       setSelectedGenres([value]);
       // TODO: Implement multi-select logic if needed
       // setSelectedGenres(prev =>
       //   prev.includes(value) ? prev.filter(g => g !== value) : [...prev, value]
       // );
    }
  };


  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* 1. Hero + Search Section */}
      <section className="relative text-center max-w-3xl mx-auto mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Own. Don't just read.</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Explore DRM-protected eBooks with true digital ownership.
        </p>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by Title, Author, Genre, Tags..."
            className="w-full pl-10 pr-4 py-2 rounded-full border-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* TODO: Add filter by NFT status dropdown/toggle here? */}
        </div>
        {/* Removed Wallet Status Badge */}
      </section>

      {/* 2. Filter + Sort Toolbar */}
      <section className="top-[60px] z-10 bg-background py-4 mb-8 border-b">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap"> {/* Left side of toolbar */}
            {/* Genre Filters - Using simple select for now, replace with multi-select later */}
             <Select onValueChange={handleGenreChange} value={selectedGenres[0] || "__ALL__"}>
               <SelectTrigger className="w-[180px]">
                 <Filter className="h-4 w-4 mr-2" />
                 <SelectValue placeholder="Filter by Genre" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="__ALL__">All Genres</SelectItem> {/* Changed value */}
                 {allGenres.map(genre => (
                   <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
             {/* Display selected genres (temporary) */}
             {selectedGenres.map(g => (
                <Badge key={g} variant="secondary" className="flex items-center gap-1">
                    {g}
                    <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => handleGenreChange(g)}>
                        <X className="h-3 w-3"/>
                    </Button>
                </Badge>
             ))}

            {/* Optional Filters */}
            <div className="flex items-center space-x-2 pl-4">
              <Checkbox id="showFree" checked={showFree} onCheckedChange={(checked) => setShowFree(!!checked)} />
              <label htmlFor="showFree" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Only Free
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="showStaked" checked={showStaked} onCheckedChange={(checked) => setShowStaked(!!checked)} />
              <label htmlFor="showStaked" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Staked Authors
              </label>
            </div>
          </div> {/* End left side of toolbar */}

          <div className="flex items-center gap-4"> {/* Right side of toolbar */}
            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                 <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as any)} variant="outline">
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
              {/* <ToggleGroupItem value="carousel" aria-label="Carousel view" disabled> TODO: Implement Carousel View
                <Rows className="h-4 w-4" />
              </ToggleGroupItem> */}
              <ToggleGroupItem value="list" aria-label="List view"> {/* Enable List View */}
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div> {/* End right side of toolbar */}
        </div> {/* End main flex container for toolbar */}
      </section>

      {/* 3. Book Cards Grid/List/Carousel */}
      <section>
        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredAndSortedBooks.length > 0 ? (
              filteredAndSortedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-10">No books match your criteria.</p>
            )}
            {/* TODO: Add loading state */}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
           <div className="space-y-4">
             {filteredAndSortedBooks.length > 0 ? (
               filteredAndSortedBooks.map((book) => {
                 // --- State for List Item Modal ---
                 // Note: Managing state inside map is not ideal, consider refactoring to BookListItem component later
                 const [showDetailsModal, setShowDetailsModal] = useState(false);
                 const [purchasing, setPurchasing] = useState(false); // Need purchase state per item
                 const [purchased, setPurchased] = useState(false); // Need purchase state per item
                 const { purchaseBook } = useBooks(); // Get purchase function

                 const handlePurchase = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    setPurchasing(true);
                    setTimeout(() => {
                      purchaseBook(book.id);
                      setPurchased(true);
                      setTimeout(() => {
                        setPurchasing(false);
                        setPurchased(false);
                        setShowDetailsModal(false); // Close modal after purchase simulation
                      }, 1500);
                    }, 1000);
                  };

                 const ratingPercent = calculateRating(book.upvotes, book.downvotes);
                 // --- End State ---

                 return (
                   // TODO: Create a BookListItem component for better layout control
                   <div key={book.id} className="flex gap-4 border p-4 rounded-lg items-center bg-card">
                      <img src={book.cover} alt={book.title} className="w-16 h-24 object-cover rounded-md flex-shrink-0"/>
                      <div className="flex-grow space-y-1">
                        <h3 className="font-semibold">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                        <p className="text-xs line-clamp-2">{book.description}</p>
                         {/* Add Price, Rating, Badges here similar to Card */}
                         <div className="flex items-center gap-2 text-xs pt-1">
                            <span className="font-mono font-semibold text-primary">{book.priceApt.toFixed(2)} APT</span>
                            <span className="text-muted-foreground">|</span>
                            <span>{calculateRating(book.upvotes, book.downvotes)}% 👍</span>
                            {/* Add badges */}
                         </div>
                     </div>
                     <div className="flex flex-col gap-2 items-end">
                        {/* Details Button & Modal for List Item */}
                        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full justify-start px-2"> {/* Make button full width for consistency */}
                              <Info className="mr-1 h-4 w-4" /> Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
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
                                  {/* Check if book is in userBooks (simple check for now) */}
                                  {userBooks.some(userBook => userBook.id === book.id) ? (
                                    <Link to={`/read/${book.id}`} className="w-full">
                                      <Button size="sm" className="w-full" onClick={() => setShowDetailsModal(false)}>Read Now</Button>
                                    </Link>
                                  ) : (
                                    <Button
                                      size="sm"
                                      className="w-full relative"
                                      disabled={purchasing}
                                      onClick={handlePurchase} // Use specific handler for list item
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

                         {/* Original Buy Button (now needs state/logic similar to modal) */}
                         {/* TODO: Refactor buy logic or remove this button if modal is sufficient */}
                         {userBooks.some(userBook => userBook.id === book.id) ? (
                            <Link to={`/read/${book.id}`} className="w-full">
                                <Button size="sm" variant="secondary" className="w-full justify-start px-2"> {/* Changed variant */}
                                    <Eye className="mr-1 h-4 w-4" /> Read Now
                                </Button>
                            </Link>
                         ) : (
                            <Button size="sm" className="w-full justify-start px-2" disabled> {/* Disabled for now, use modal */}
                                Buy & Mint
                            </Button>
                         )}
                     </div>
                   </div>
                 );
               })
             ) : (
               <p className="text-center text-muted-foreground py-10">No books match your criteria.</p>
             )}
             {/* TODO: Add loading state */}
           </div>
        )}
         {/* TODO: Implement Carousel view here */}
      </section>

      {/* Separator moved down */}

      {/* 4. Trending & Featured Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold font-serif">Trending Now</h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {/* Sort books by rating for trending - show top 6? */}
            {storeBooks
              .sort((a, b) => calculateRating(b.upvotes, b.downvotes) - calculateRating(a.upvotes, a.downvotes))
              .slice(0, 6) // Limit to top 6 trending
              .map((book) => (
                <CarouselItem key={book.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="p-1 h-full">
                    <BookCard book={book} />
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 hidden md:inline-flex" />
          <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 hidden md:inline-flex" />
        </Carousel>
        {/* TODO: Implement Staff picks / "You might like" */}
      </section>

      {/* Author Spotlight Section Removed */}

      <Separator />

      {/* 7. DRM & Ownership Explainer */}
      <section className="space-y-6 max-w-4xl mx-auto">
         <h2 className="text-2xl font-semibold font-serif text-center mb-8">Understanding Your Ownership</h2>
         <Accordion type="single" collapsible className="w-full">
           <AccordionItem value="item-1">
             <AccordionTrigger className="text-lg">Why Blockchain?</AccordionTrigger>
             <AccordionContent className="text-muted-foreground">
               Blockchain provides a transparent, immutable ledger to prove ownership of your digital book NFT. Unlike traditional platforms where your purchases are licenses, here you truly own the asset, recorded permanently on the Aptos blockchain. This enables features like verifiable scarcity and potential resale (future feature).
             </AccordionContent>
           </AccordionItem>
           <AccordionItem value="item-2">
             <AccordionTrigger className="text-lg">What is DRM-protected Web3 Reading?</AccordionTrigger>
             <AccordionContent className="text-muted-foreground">
               We combine the security of Digital Rights Management (DRM) to protect authors' work with the ownership benefits of Web3. Your NFT acts as a key. When you want to read, the system verifies your NFT ownership on the blockchain and decrypts the book content securely for your reading session, preventing unauthorized copying while ensuring you control access via your wallet.
             </AccordionContent>
           </AccordionItem>
           <AccordionItem value="item-3">
             <AccordionTrigger className="text-lg">Why NFTs? What do I really own?</AccordionTrigger>
             <AccordionContent className="text-muted-foreground">
               The NFT (Non-Fungible Token) is your unique, verifiable proof of ownership for a specific digital book copy. You own the token, which grants you the right to access and read the DRM-protected book file stored securely (e.g., on Irys/Arweave). Think of it like owning a specific, numbered print of a limited edition artwork, but for the digital age. It's more than just access; it's a digital collectible.
                {/* TODO: Add visual timeline here or link to modal */}
             </AccordionContent>
           </AccordionItem>
         </Accordion>
         <div className="text-center mt-6">
            <Button variant="outline">See the Visual Timeline</Button> {/* TODO: Link to modal */}
         </div>
      </section>

      {/* 8. AI-Powered Book Assistant (Optional) */}
      {/* TODO: Implement if needed */}

      {/* 9. Footer */}
      <footer className="pt-8 border-t font-space text-center text-sm font-medium text-muted-foreground">
        <p>made with love by team minions in a durag ❤️</p>
      </footer>

      {/* 6. What You Own (Mini Library Drawer) */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg">
            <Library className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>My Library</SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-4">
            {userBooks.length > 0 ? (
              userBooks.map(book => (
                <div key={book.id} className="flex items-center gap-4 p-2 border rounded-md">
                  <img src={book.cover} alt={book.title} className="w-12 h-16 object-cover rounded-sm" />
                  <div className="flex-grow">
                    <p className="font-medium text-sm">{book.title}</p>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                  </div>
                  {/* TODO: Add Read/Download/Sell buttons */}
                   <div className="flex flex-col gap-1 items-end">
                      <Link to={`/read/${book.id}`}>
                         <Button size="sm" variant="ghost" className="w-full justify-start px-2 h-8"> {/* Changed size to sm, adjusted height */}
                            <Eye className="mr-1 h-3.5 w-3.5" /> Read
                         </Button>
                      </Link>
                      {/* TODO: Implement Download functionality */}
                      <Button size="sm" variant="ghost" className="w-full justify-start px-2 h-8" disabled> {/* Changed size to sm, adjusted height */}
                         <Download className="mr-1 h-3.5 w-3.5" /> Download
                      </Button>
                      {/* TODO: Implement Sell functionality */}
                      <Button size="sm" variant="ghost" className="w-full justify-start px-2 h-8" disabled> {/* Changed size to sm, adjusted height */}
                         <Tag className="mr-1 h-3.5 w-3.5" /> Sell NFT
                      </Button>
                   </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center">Your library is empty.</p>
            )}
          </div>
        </SheetContent>
      </Sheet>

    </div>
  );
};

export default BookstorePage;
