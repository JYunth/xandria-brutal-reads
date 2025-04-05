
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";

interface WalletConnectModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const WalletConnectModal = ({ isOpen, setIsOpen }: WalletConnectModalProps) => {
  const { connectWallet } = useAuth();

  const handleConnect = async () => {
    await connectWallet();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md border-2 border-black bg-beige">
        <DialogHeader>
          <DialogTitle className="text-center font-almendra font-medium text-3xl">Connect your Wallet</DialogTitle>
          <DialogDescription className="text-center font-space text-md font-medium text-muted-foreground">
            Connect your wallet to access Xandria's decentralized library.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4 font-notoserif">
          <Button
            onClick={handleConnect}
            className="w-full bg-accent hover:bg-accent/90 transition-colors duration-300"
          >
            Connect Petra
          </Button>
          <Button
            onClick={handleConnect}
            variant="outline"
            className="w-full border-primary/20 hover:bg-muted hover:text-muted-foreground transition-colors duration-300"
          >
            Connect WalletConnect
          </Button>
          <Button
            onClick={handleConnect}
            variant="outline"
            className="w-full border-primary/20 hover:bg-muted hover:text-muted-foreground transition-colors duration-300"
          >
            Connect Coinbase Wallet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectModal;
