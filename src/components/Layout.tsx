
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react"; // Import useWallet
import { WalletDetails } from "@/components/wallet/WalletDetails"; // Import WalletDetails
import { Card, CardContent } from "@/components/ui/card"; // Import Card components

const Layout = () => {
  // Existing auth logic
  const { isConnected: isAuthConnected, isNewUser } = useAuth(); 
  const navigate = useNavigate();
  // Aptos wallet connection status
  const { connected: isWalletConnected } = useWallet(); 

  useEffect(() => {
    // Keep existing auth routing logic for now
    if (!isAuthConnected) {
      navigate('/');
    } else if (isNewUser) {
      navigate('/onboarding');
    }
  }, [isAuthConnected, isNewUser, navigate]); // Fixed: use isAuthConnected here

  return (
    <div className="min-h-screen flex flex-col bg-background marble-texture">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col gap-8"> {/* Added flex-col and gap */}
        {/* Conditionally render WalletDetails if connected */}
        {isWalletConnected && (
          <Card>
            <CardContent className="pt-6"> {/* Added padding top like in guide */}
              <WalletDetails />
            </CardContent>
          </Card>
        )}
        {/* Always render the main route content */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
