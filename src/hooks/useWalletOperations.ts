'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { useCallback } from 'react';

export function useWalletOperations() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const getBalance = useCallback(async () => {
    if (!publicKey) return null;
    
    try {
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error getting balance:', error);
      return null;
    }
  }, [connection, publicKey]);

  const sendSol = useCallback(async (to: string, amount: number) => {
    if (!publicKey || !sendTransaction) {
      throw new Error('Wallet not connected');
    }

    try {
      const toPublicKey = new PublicKey(to);
      const lamports = amount * LAMPORTS_PER_SOL;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: toPublicKey,
          lamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'processed');
      
      return signature;
    } catch (error) {
      console.error('Error sending SOL:', error);
      throw error;
    }
  }, [connection, publicKey, sendTransaction]);

  return {
    getBalance,
    sendSol,
    publicKey,
    connected: !!publicKey,
  };
}