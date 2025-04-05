import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface User {
  address: string;
  name: string;
  age: number;
  readingLevel: string;
  englishProficiency: number;
  xp: number;
  level: number;
}

interface AuthContextType {
  isConnected: boolean;
  user: User | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isNewUser: boolean;
  updateUserProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('xandria_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsConnected(true);
      setIsNewUser(false);
    }
  }, []);

  const connectWallet = async () => {
    try {
      // Simulate wallet connection
      const mockAddress = '0x' + Math.random().toString(16).substring(2, 14);
      
      // Check if this is a new user
      const storedUser = localStorage.getItem('xandria_user');
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsNewUser(false);
      } else {
        // Create new user with default values
        const newUser: User = {
          address: mockAddress,
          name: '',
          age: 0,
          readingLevel: '',
          englishProficiency: 3,
          xp: 0,
          level: 1
        };
        setUser(newUser);
        setIsNewUser(true);
      }
      
      setIsConnected(true);
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet.');
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setUser(null);
    // We don't remove from localStorage as we want to keep the user data
    toast.info('Wallet disconnected.');
  };

  const updateUserProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('xandria_user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully!');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isConnected, 
      user, 
      connectWallet, 
      disconnectWallet,
      isNewUser,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
