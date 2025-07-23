import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface MintResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number, owner: string) => void;
  resourceName: string;
}

export const MintResourceModal: React.FC<MintResourceModalProps> = ({ isOpen, onClose, onSubmit, resourceName }) => {
  const [amount, setAmount] = useState('');
  const [owner, setOwner] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    // Basic Solana address validation (length)
    if (owner.length < 32 || owner.length > 44) {
      setError('Please enter a valid Solana wallet address.');
      return;
    }
    onSubmit(numAmount, owner);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Mint ${resourceName}`}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
              type="number"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="owner" className="text-right">
              Owner
            </Label>
            <Input
              id="owner"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="col-span-3"
            />
          </div>
          {error && <p className="text-red-500 text-sm col-span-4 text-center">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Mint</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};