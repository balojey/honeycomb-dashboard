'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import WalletDashboard from './WalletDashboard';

export default function WalletConnection() {
  const { wallet, publicKey, connected } = useWallet();

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-3">
            <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-blue-600 hover:!from-purple-700 hover:!to-blue-700" />
            {connected && <WalletDisconnectButton />}
          </div>

          {connected && publicKey ? (
            <div className="w-full space-y-6">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    Connected to {wallet?.adapter.name}
                  </span>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Wallet Address</p>
                  <p className="font-mono text-sm break-all text-gray-800 dark:text-gray-200">
                    {publicKey.toString()}
                  </p>
                </div>
              </div>
              
              <WalletDashboard />
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Connect your wallet to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}