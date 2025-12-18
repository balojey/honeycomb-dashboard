'use client';

import React from 'react';
import { useWalletOperations } from '@/hooks/useWalletOperations';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import WalletDashboard from './WalletDashboard';
import { ChevronDown, Wallet, User, LogOut } from 'lucide-react';

export default function Header() {
  const { connected, publicKey, disconnect } = useWalletOperations();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Honeycomb
            </span>
          </div>

          {/* Wallet Dropdown */}
          <div className="flex items-center space-x-4">
            {connected && publicKey ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <Wallet className="w-3 h-3 text-white" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">
                      {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-0">
                  <DropdownMenuLabel className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Connected Wallet</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  
                  <div className="p-4">
                    <WalletDashboard />
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  <div className="p-2">
                    <DropdownMenuItem 
                      onClick={disconnect}
                      className="flex items-center space-x-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Disconnect Wallet</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Wallet className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">Not Connected</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}