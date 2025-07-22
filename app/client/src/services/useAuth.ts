import { useWallet } from '@solana/wallet-adapter-react';

export const useAuth = () => {
  const wallet = useWallet();

  return {
    ...wallet,
    isAuthenticated: wallet.connected,
  };
};