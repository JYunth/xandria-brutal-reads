
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import WalletConnectModal from '@/components/WalletConnectModal';
import { useAuth } from '@/context/AuthContext';

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isConnected, isNewUser } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isConnected) {
      navigate(isNewUser ? '/onboarding' : '/bookstore');
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-accent">XANDRIA</h1>
        <div>
          {isConnected ? (
            <Button onClick={() => navigate('/bookstore')}>
              {isNewUser ? 'Complete Setup' : 'Enter Library'}
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setIsModalOpen(true)}>
              Connect Wallet
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6">
            The World's Knowledge,
            <br />
            <span className="text-accent">Decentralized</span>
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Xandria reinvents the library for the digital age. Own your books truly and forever, with AI-enhanced reading experiences.
          </p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="text-lg px-8 py-6"
          >
            Begin Your Journey
          </Button>
        </div>
      </main>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 max-w-6xl mx-auto">
        <div className="brutalist-container">
          <h3 className="font-serif text-xl font-medium mb-2">True Ownership</h3>
          <p className="text-muted-foreground">
            All books are stored on decentralized networks, giving you permanent, verifiable ownership.
          </p>
        </div>

        <div className="brutalist-container">
          <h3 className="font-serif text-xl font-medium mb-2">AI Enhancement</h3>
          <p className="text-muted-foreground">
            Intelligent assistant to help you understand, analyze and connect ideas within your texts.
          </p>
        </div>

        <div className="brutalist-container">
          <h3 className="font-serif text-xl font-medium mb-2">Knowledge Graph</h3>
          <p className="text-muted-foreground">
            Track your reading journey and visualize connections between texts and concepts.
          </p>
        </div>
      </div>

      <footer className="p-8 text-center text-sm text-muted-foreground">
        <p>© 2025 Xandria - Reviving the Library of Alexandria for the Web3 Era</p>
      </footer>

      <WalletConnectModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
};

export default LandingPage;
