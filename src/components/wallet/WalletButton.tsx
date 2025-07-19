import React, { useState } from 'react';
import { Wallet, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { walletsService } from '@/lib/database';

export function WalletButton() {
  const [copied, setCopied] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      const wallet = await walletsService.getUserWallet();
      const address = wallet?.public_key || '';
      if (isMounted) setWalletAddress(address);
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const shortAddress = React.useMemo(() => {
    if (!walletAddress) return '';
    return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  }, [walletAddress]);

  const handleCopyAddress = async () => {
    if (!walletAddress) return;
    
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying address:', error);
      toast.error('Failed to copy address');
    }
  };

  if (!walletAddress) {
    return (
      <Button
        disabled
        className="w-full flex items-center gap-2"
        size="lg"
      >
        <Wallet className="w-4 h-4" />
        Wallet Not Found
      </Button>
    );
  }

  return (
    <div className="w-full flex items-center gap-2">
      <Button
        variant="outline"
        className="w-full flex-grow flex items-center justify-start gap-2 bg-gray-100 dark:bg-gray-800"
        size="lg"
        disabled
      >
        <Wallet className="w-4 h-4 text-gray-500" />
        <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
          {shortAddress}
        </span>
      </Button>
      <Button
        onClick={handleCopyAddress}
        size="lg"
        variant="ghost"
        className="flex-shrink-0"
        aria-label="Copy wallet address"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}