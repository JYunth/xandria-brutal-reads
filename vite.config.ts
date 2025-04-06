import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.NEXT_PUBLIC_GEMINI_API_KEY),
    },
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {
      exclude: [
        "@aptos-labs/derived-wallet-solana",
        "@aptos-labs/derived-wallet-ethereum",
        "@mizuwallet-sdk/core",
        "aptos",
        "@telegram-apps/bridge",
      ],
    },
    build: {
      rollupOptions: {
        external: [
          "@aptos-labs/derived-wallet-solana",
          "@aptos-labs/derived-wallet-ethereum",
          "@mizuwallet-sdk/core",
          "aptos", // Exclude the 'aptos' package as requested by the error source
          "@telegram-apps/bridge",
        ],
      },
    },
  };
});
