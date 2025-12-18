'use client';

import React, { useEffect, useState } from 'react';
import { useWalletOperations } from '@/hooks/useWalletOperations';
import { Button } from './ui/button';

export default function WalletDashboard() {
  const { getBalance, connected, publicKey } = useWalletOperations();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBalance = async () => {
    if (!connected) return;
    
    setLoading(true);
    try {
      const bal = await getBalance();
      setBalance(bal);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (connected) {
      fetchBalance();
    } else {
      setBalance(null);
    }
  }, [connected]);

  if (!connected || !publicKey) {
    return null;
  }

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Balance</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {loading ? (
                  <span className="animate-pulse">...</span>
                ) : balance !== null ? (
                  `${balance.toFixed(4)}`
                ) : (
                  'Error'
                )}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">SOL</p>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={fetchBalance}
              disabled={loading}
              className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-800"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </Button>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
          <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">Network</p>
          <p className="text-lg font-bold text-green-900 dark:text-green-100">Devnet</p>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-xs text-green-600 dark:text-green-400">Connected</p>
          </div>
        </div>
      </div>
    </div>
  );
}