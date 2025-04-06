import { PropsWithChildren } from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
// Internal components (using isolated version)
import { useToast } from "./ui/use-toast"; // Updated import path
// Internal constants
import { APTOS_API_KEY, NETWORK } from "../../constants"; // Updated import path

export function WalletProvider({ children }: PropsWithChildren) {
  const { toast } = useToast(); // Using isolated toast

  return (
    <AptosWalletAdapterProvider
      autoConnect={true} // Attempts to reconnect to the last used wallet on load
      dappConfig={{ network: NETWORK, aptosApiKeys: {[NETWORK]: APTOS_API_KEY} }}
      onError={(error) => {
        // Basic error handling using toast notifications
        toast({
          variant: "destructive",
          title: "Error",
          description: error?.message || "Unknown wallet error", // Use error.message if available
        });
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
