
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Book, Home, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { isConnected, user, disconnectWallet } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Bookstore', path: '/bookstore', icon: Home },
    { name: 'My Library', path: '/library', icon: Book },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        {/* Added relative and justify-center */}
        <div className="relative flex items-center justify-center">
          {/* Positioned logo absolutely */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Link to="/" className="font-almendra text-2xl font-bold text-accent">
              XANDRIA
            </Link>
          </div>

          {isConnected && (
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-2 font-medium transition-colors",
                    location.pathname === item.path 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          )}

          {/* Positioned profile section absolutely */}
          <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center space-x-4">
            {isConnected ? (
              <>
                <span className="hidden md:block text-sm text-muted-foreground">
                  {user?.name || user?.address.substring(0, 8)}...
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnectWallet}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Disconnect</span>
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
