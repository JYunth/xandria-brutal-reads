
import { useAuth } from '@/context/AuthContext';
import { useBooks } from '@/context/BookContext';

const ProfileStats = () => {
  const { user } = useAuth();
  const { userBooks, readingProgress } = useBooks();

  // Calculate various stats based on the user's reading habits
  const totalBooks = userBooks.length;
  const booksStarted = Object.keys(readingProgress).length;
  const totalPages = userBooks.reduce((sum, book) => sum + book.pages, 0);
  const pagesRead = Object.entries(readingProgress).reduce((sum, [bookId, page]) => {
    const book = userBooks.find(b => b.id === bookId);
    return sum + (book ? Math.min(page, book.pages) : 0);
  }, 0);
  const completionRate = totalPages > 0 ? Math.round((pagesRead / totalPages) * 100) : 0;

  // Calculate XP and level
  const level = user?.level || 1;
  const xp = user?.xp || 0;
  const xpForNextLevel = level * 100;
  const xpProgress = Math.min(100, Math.round((xp / xpForNextLevel) * 100));

  // Generate some mock vocabulary stats
  const vocabularyStats = [
    { word: "Decentralized", count: 15 },
    { word: "Brutalism", count: 9 },
    { word: "Architecture", count: 12 },
    { word: "Knowledge", count: 24 },
    { word: "Alexandria", count: 18 },
  ];

  return (
    <div className="space-y-8">
      {/* XP and Level */}
      <div className="brutalist-container">
        <h3 className="font-serif text-xl mb-4">Reading Level</h3>
        <div className="flex items-center space-x-4">
          <div className="text-3xl font-bold text-primary">{level}</div>
          <div className="flex-1">
            <div className="h-2 w-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>{xp} XP</span>
              <span>{xpForNextLevel} XP needed for level {level + 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reading Stats */}
      <div className="brutalist-container">
        <h3 className="font-serif text-xl mb-4">Reading Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted rounded-md">
            <div className="text-2xl font-bold">{totalBooks}</div>
            <div className="text-sm text-muted-foreground">Books Owned</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-md">
            <div className="text-2xl font-bold">{booksStarted}</div>
            <div className="text-sm text-muted-foreground">Books Started</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-md">
            <div className="text-2xl font-bold">{pagesRead}</div>
            <div className="text-sm text-muted-foreground">Pages Read</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-md">
            <div className="text-2xl font-bold">{completionRate}%</div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
          </div>
        </div>
      </div>

      {/* Vocabulary Stats */}
      <div className="brutalist-container">
        <h3 className="font-serif text-xl mb-4">Most Encountered Words</h3>
        <div className="space-y-3">
          {vocabularyStats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="font-medium">{stat.word}</span>
              <div className="flex items-center">
                <div className="h-2 bg-primary rounded-full mr-2" style={{ width: `${stat.count * 5}px` }}></div>
                <span className="text-sm text-muted-foreground">{stat.count}x</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
