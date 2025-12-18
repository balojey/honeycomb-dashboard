'use client';

import React, { useEffect, useState } from 'react';
import { useWalletAddress } from '@/hooks/useWalletAddress';
import { WalletAddressRecord } from '@/types/wallet';

export default function WalletAddressManager() {
  const { getAllWalletAddresses } = useWalletAddress();
  const [walletAddresses, setWalletAddresses] = useState<WalletAddressRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadWalletAddresses = async () => {
    setIsLoading(true);
    try {
      const addresses = await getAllWalletAddresses();
      setWalletAddresses(addresses);
    } catch (error) {
      console.error('Error loading wallet addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWalletAddresses();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Connected Wallet Addresses
            </h2>
            <button
              onClick={loadWalletAddresses}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : walletAddresses.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No wallet addresses found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Wallet Address
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      First Connected
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Last Connected
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {walletAddresses.map((wallet) => (
                    <tr
                      key={wallet.id}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="py-3 px-4">
                        <div className="font-mono text-sm">
                          <span className="hidden sm:inline">{wallet.address}</span>
                          <span className="sm:hidden">{truncateAddress(wallet.address)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        {formatDate(wallet.created_at)}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        {formatDate(wallet.last_connected_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}