
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
        <div className="flex items-center justify-between">
          <Link to="/" className="font-serif text-2xl font-bold text-accent">
            XANDRIA
          </Link>

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

          <div className="flex items-center space-x-4">
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
