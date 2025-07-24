import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CharacterTraitInput {
  label: string;
  name: string;
  uri: string;
}

interface AddTraitsFormProps {
  projectId: string;
  assemblerConfigId: string;
  existingTraits?: CharacterTraitInput[];
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddTraitsForm: React.FC<AddTraitsFormProps> = ({
  projectId, 
  assemblerConfigId,
  existingTraits = [],
  onSuccess, 
  onCancel 
}) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  
  const [traits, setTraits] = useState<CharacterTraitInput[]>([{ label: '', name: '', uri: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Check if traits array is empty
    if (traits.length === 0) {
      newErrors.traits = 'At least one trait is required';
      setErrors(newErrors);
      return false;
    }
    
    // Validate each trait
    for (let i = 0; i < traits.length; i++) {
      const trait = traits[i];
      
      if (!trait.label.trim()) {
        newErrors[`label-${i}`] = 'Label is required';
      }
      
      if (!trait.name.trim()) {
        newErrors[`name-${i}`] = 'Name is required';
      }
      
      if (!trait.uri.trim()) {
        newErrors[`uri-${i}`] = 'URI is required';
      } else if (!trait.uri.match(/^https?:\/\/.+/)) {
        newErrors[`uri-${i}`] = 'URI must be a valid URL';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleAddTrait = () => {
    setTraits([...traits, { label: '', name: '', uri: '' }]);
  };
  
  const handleRemoveTrait = (index: number) => {
    const newTraits = [...traits];
    newTraits.splice(index, 1);
    setTraits(newTraits);
  };
  
  const handleTraitChange = (index: number, field: keyof CharacterTraitInput, value: string) => {
    const newTraits = [...traits];
    newTraits[index] = { ...newTraits[index], [field]: value };
    setTraits(newTraits);
    
    // Clear error for this field if it exists
    if (errors[`${field}-${index}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${field}-${index}`];
      setErrors(newErrors);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the BFF endpoint
      const response = await fetch(
        `/api/projects/${projectId}/assembler-configs/${assemblerConfigId}/traits`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(traits),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add traits');
      }
      
      const { transaction: serializedTransaction } = await response.json();
      
      // Deserialize the transaction
      const transaction = Transaction.from(Buffer.from(serializedTransaction, 'base64'));
      
      // Sign and send the transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Confirm the transaction
      await connection.confirmTransaction(signature, 'confirmed');
      
      toast.success('Traits added successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error adding traits:', error);
      toast.error(`Failed to add traits: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Add Traits to Assembler Config</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Display existing traits if any */}
        {existingTraits.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Existing Traits</h3>
            <div className="space-y-2">
              {existingTraits.map((trait, index) => (
                <div key={index} className="bg-muted p-3 rounded-md flex items-center">
                  <div className="flex-1">
                    <div className="font-medium">{trait.name}</div>
                    <div className="text-sm text-muted-foreground">{trait.label}</div>
                  </div>
                  {trait.uri && (
                    <div className="ml-2 w-10 h-10 bg-muted rounded-md overflow-hidden">
                      <img 
                        src={trait.uri} 
                        alt={trait.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Traits */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <Label className="text-base">New Traits</Label>
              <Button type="button" onClick={handleAddTrait} variant="default" size="sm">
                Add Trait
              </Button>
            </div>
            
            {errors.traits && <p className="text-sm text-destructive mb-2">{errors.traits}</p>}
            
            <div className="space-y-4">
              {traits.map((trait, index) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <Label htmlFor={`label-${index}`} className="mb-1">
                        Label
                      </Label>
                      <Input
                        id={`label-${index}`}
                        value={trait.label}
                        onChange={(e) => handleTraitChange(index, 'label', e.target.value)}
                        className={errors[`label-${index}`] ? 'border-destructive' : ''}
                        placeholder="e.g., Weapon"
                      />
                      {errors[`label-${index}`] && (
                        <p className="text-sm text-destructive mt-1">{errors[`label-${index}`]}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor={`name-${index}`} className="mb-1">
                        Name
                      </Label>
                      <Input
                        id={`name-${index}`}
                        value={trait.name}
                        onChange={(e) => handleTraitChange(index, 'name', e.target.value)}
                        className={errors[`name-${index}`] ? 'border-destructive' : ''}
                        placeholder="e.g., Sword"
                      />
                      {errors[`name-${index}`] && (
                        <p className="text-sm text-destructive mt-1">{errors[`name-${index}`]}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor={`uri-${index}`} className="mb-1">
                        Image URI
                      </Label>
                      <Input
                        id={`uri-${index}`}
                        value={trait.uri}
                        onChange={(e) => handleTraitChange(index, 'uri', e.target.value)}
                        className={errors[`uri-${index}`] ? 'border-destructive' : ''}
                        placeholder="https://example.com/image.png"
                      />
                      {errors[`uri-${index}`] && (
                        <p className="text-sm text-destructive mt-1">{errors[`uri-${index}`]}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => handleRemoveTrait(index)}
                      variant="outline"
                      size="sm"
                      disabled={traits.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Traits'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddTraitsForm;