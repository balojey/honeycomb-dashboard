import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWallet } from '@solana/wallet-adapter-react';
import { sendClientTransactions } from '@honeycomb-protocol/edge-client/client/walletHelpers';
import { createResource } from '../services/resourceService';
import { toast } from 'sonner';
import createEdgeClient, { ResourceStorageEnum } from '@honeycomb-protocol/edge-client';

interface CreateResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const API_KEY = import.meta.env.VITE_API_KEY || "https://edge.test.honeycombprotocol.com/";

export const CreateResourceModal: React.FC<CreateResourceModalProps> = ({ isOpen, onClose, projectId }) => {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [decimals, setDecimals] = useState('');
  const [uri, setUri] = useState('');
  const [storageType, setStorageType] = useState<ResourceStorageEnum.AccountState | ResourceStorageEnum.LedgerState>(ResourceStorageEnum.AccountState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const client = useMemo(() => createEdgeClient(API_KEY, true), []);

  const wallet = useWallet();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!symbol.trim()) newErrors.symbol = 'Symbol is required.';
    if (!decimals.trim()) {
      newErrors.decimals = 'Decimals is required.';
    } else if (isNaN(Number(decimals)) || Number(decimals) < 0) {
      newErrors.decimals = 'Decimals must be a non-negative number.';
    }
    if (!uri.trim()) newErrors.uri = 'URI is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    if (!wallet.connected || !wallet.publicKey) {
      setErrors(prev => ({ ...prev, wallet: 'Wallet not connected.' }));
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const resourceData = {
        name,
        symbol,
        decimals: Number(decimals),
        uri,
        storageType,
      }

      const { tx } = await createResource(projectId, resourceData, wallet.publicKey.toString());
      await sendClientTransactions(client, wallet, tx);

      toast.success('Resource created successfully!');
      onClose();
      // TODO: Refresh the project's resource list
    } catch (error) {
      console.error('Failed to create resource:', error);
      setErrors(prev => ({ ...prev, submit: (error as Error).message || 'An unexpected error occurred.' }));
      toast.error((error as Error).message || 'Failed to create resource.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Resource</DialogTitle>
          <DialogDescription>
            Define the properties for your new game resource.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Gold"
                className="col-span-3"
              />
            </div>
            {errors.name && <p className="text-red-500 text-sm col-span-4 text-right">{errors.name}</p>}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="symbol" className="text-right">
                Symbol
              </Label>
              <Input
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="e.g., GLD"
                className="col-span-3"
              />
            </div>
            {errors.symbol && <p className="text-red-500 text-sm col-span-4 text-right">{errors.symbol}</p>}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="decimals" className="text-right">
                Decimals
              </Label>
              <Input
                id="decimals"
                type="number"
                value={decimals}
                onChange={(e) => setDecimals(e.target.value)}
                placeholder="e.g., 9"
                className="col-span-3"
              />
            </div>
            {errors.decimals && <p className="text-red-500 text-sm col-span-4 text-right">{errors.decimals}</p>}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="uri" className="text-right">
                URI
              </Label>
              <Input
                id="uri"
                value={uri}
                onChange={(e) => setUri(e.target.value)}
                placeholder="e.g., https://example.com/gold.json"
                className="col-span-3"
              />
            </div>
            {errors.uri && <p className="text-red-500 text-sm col-span-4 text-right">{errors.uri}</p>}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="storageType" className="text-right">
                Storage Type
              </Label>
              <Select value={storageType} onValueChange={(value: ResourceStorageEnum.AccountState | ResourceStorageEnum.LedgerState) => setStorageType(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select storage type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AccountState">AccountState</SelectItem>
                  <SelectItem value="LedgerState">LedgerState</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.wallet && <p className="text-red-500 text-sm col-span-4 text-center">{errors.wallet}</p>}
            {errors.submit && <p className="text-red-500 text-sm col-span-4 text-center">{errors.submit}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Resource'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
