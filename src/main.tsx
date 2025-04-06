import "./index.css"; // Your global styles

import React from "react";
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Optional: if using react-query

import App from './App.tsx';
// Internal components (using isolated versions)
import { Toaster } from "./components/wallet/ui/toaster"; // Updated import path
import { WalletProvider } from "./components/wallet/WalletProvider"; // Updated import path
// Optional: Component to alert user if connected to wrong network
// import { WrongNetworkAlert } from "'components/WrongNetworkAlert'"; // Assuming this doesn't exist yet or is not needed now

const queryClient = new QueryClient(); // Optional: if using react-query

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Wrap the entire app with WalletProvider */}
    <WalletProvider>
      {/* Optional: QueryClientProvider if using react-query */}
      <QueryClientProvider client={queryClient}>
        <App />
        {/* Optional: <WrongNetworkAlert /> */}
        <Toaster /> {/* Using isolated Toaster */}
      </QueryClientProvider>
    </WalletProvider>
  </React.StrictMode>,
);
