// Read network from environment variable, default to testnet
export const NETWORK = import.meta.env.VITE_APP_NETWORK ?? "testnet";

// Read module address from environment variable (optional)
export const MODULE_ADDRESS = import.meta.env.VITE_MODULE_ADDRESS;

// Read Aptos API key from environment variable or use the provided one
export const APTOS_API_KEY = import.meta.env.VITE_APTOS_API_KEY ?? "AG-7YQUX8WMERBZGBJNX5SF8AH6AX3PGRLVX";
