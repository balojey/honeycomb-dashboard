'use client';

import { useCallback, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '@/lib/supabase';
import { WalletAddressRecord } from '@/types/wallet';

export function useWalletAddress() {
  const { publicKey, connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletRecord, setWalletRecord] = useState<WalletAddressRecord | null>(null);

  const checkAndSaveWalletAddress = useCallback(async (address: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // First, check if the wallet address already exists
      const { data: existingWallet, error: fetchError } = await supabase
        .from('wallet_addresses')
        .select('*')
        .eq('address', address)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected for new wallets
        throw fetchError;
      }

      if (existingWallet) {
        // Wallet exists, update the last_connected_at timestamp
        const { data: updatedWallet, error: updateError } = await supabase
          .from('wallet_addresses')
          .update({ last_connected_at: new Date().toISOString() })
          .eq('address', address)
          .select()
          .single();

        if (updateError) throw updateError;
        
        setWalletRecord(updatedWallet);
        console.log('Wallet address updated:', address);
      } else {
        // Wallet doesn't exist, create a new record
        const { data: newWallet, error: insertError } = await supabase
          .from('wallet_addresses')
          .insert({
            address,
            last_connected_at: new Date().toISOString()
          })
          .select()
          .single();

        if (insertError) throw insertError;
        
        setWalletRecord(newWallet);
        console.log('New wallet address saved:', address);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save wallet address';
      setError(errorMessage);
      console.error('Error managing wallet address:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Automatically check and save wallet address when connected
  useEffect(() => {
    if (connected && publicKey) {
      const address = publicKey.toString();
      checkAndSaveWalletAddress(address);
    } else {
      setWalletRecord(null);
      setError(null);
    }
  }, [connected, publicKey, checkAndSaveWalletAddress]);

  const getAllWalletAddresses = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('wallet_addresses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching wallet addresses:', err);
      return [];
    }
  }, []);

  return {
    walletRecord,
    isLoading,
    error,
    checkAndSaveWalletAddress,
    getAllWalletAddresses,
  };
}