import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface TreeConfigBasic {
  numAssets: number;
}

interface TreeConfigAdvanced {
  maxDepth: number;
  maxBufferSize: number;
  canopyDepth: number;
}

interface TreeConfig {
  basic?: TreeConfigBasic;
  advanced?: TreeConfigAdvanced;
}

interface CreateCharacterTreeFormProps {
  projectId: string;
  modelId: string;
  onSuccess: (treeAddress: string) => void;
  onCancel: () => void;
}

export const CreateCharacterTreeForm: React.FC<CreateCharacterTreeFormProps> = ({
  projectId,
  modelId,
  onSuccess,
  onCancel
}) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  
  const [configType, setConfigType] = useState<'basic' | 'advanced'>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [basicConfig, setBasicConfig] = useState<TreeConfigBasic>({ numAssets: 10000 });
  const [advancedConfig, setAdvancedConfig] = useState<TreeConfigAdvanced>({
    maxDepth: 14,
    maxBufferSize: 64,
    canopyDepth: 10
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (configType === 'basic' && (!basicConfig.numAssets || basicConfig.numAssets <= 0)) {
      newErrors.numAssets = 'Number of assets must be a positive number';
    }
    
    if (configType === 'advanced') {
      if (!advancedConfig.maxDepth || advancedConfig.maxDepth <= 0) {
        newErrors.maxDepth = 'Max depth must be a positive number';
      }
      if (!advancedConfig.maxBufferSize || advancedConfig.maxBufferSize <= 0) {
        newErrors.maxBufferSize = 'Max buffer size must be a positive number';
      }
      if (advancedConfig.canopyDepth < 0) {
        newErrors.canopyDepth = 'Canopy depth must be a non-negative number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      // Prepare the tree config based on selected type
      const treeConfig = configType === 'basic' 
        ? { basic: basicConfig } 
        : { advanced: advancedConfig };
      
      // Prepare the payload
      const payload = {
        treeConfig
      };
      
      // Call the BFF endpoint
      const response = await fetch(`/api/projects/${projectId}/character-models/${modelId}/tree`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          authority: publicKey.toString()
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create character tree');
      }
      
      const { transaction: serializedTransaction, treeAddress } = await response.json();
      
      // Deserialize the transaction
      const transaction = Transaction.from(Buffer.from(serializedTransaction, 'base64'));
      
      // Sign and send the transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Confirm the transaction
      await connection.confirmTransaction(signature, 'confirmed');
      
      toast.success('Character tree created successfully!');
      onSuccess(treeAddress);
    } catch (error) {
      console.error('Error creating character tree:', error);
      toast.error(`Failed to create character tree: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create Character Tree</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {/* Tree Config Type Selection */}
          <div className="mb-6">
            <Label className="mb-2">
              Tree Configuration
            </Label>
            <ToggleGroup 
              type="single" 
              value={configType} 
              onValueChange={(value: 'basic' | 'advanced') => value && setConfigType(value)}
              className="mb-4"
            >
              <ToggleGroupItem value="basic" aria-label="Basic configuration">
                Basic
              </ToggleGroupItem>
              <ToggleGroupItem value="advanced" aria-label="Advanced configuration">
                Advanced
              </ToggleGroupItem>
            </ToggleGroup>
            
            {/* Basic Config */}
            {configType === 'basic' && (
              <div className="border rounded-md p-4">
                <Label htmlFor="numAssets" className="mb-1">
                  Number of Assets
                </Label>
                <Input
                  id="numAssets"
                  type="number"
                  value={basicConfig.numAssets}
                  onChange={(e) => setBasicConfig({ ...basicConfig, numAssets: parseInt(e.target.value) || 0 })}
                  className={errors.numAssets ? 'border-destructive' : ''}
                  min="1"
                />
                {errors.numAssets && <p className="text-sm text-destructive mt-1">{errors.numAssets}</p>}
              </div>
            )}
            
            {/* Advanced Config */}
            {configType === 'advanced' && (
              <div className="border rounded-md p-4 space-y-4">
                <div>
                  <Label htmlFor="maxDepth" className="mb-1">
                    Max Depth
                  </Label>
                  <Input
                    id="maxDepth"
                    type="number"
                    value={advancedConfig.maxDepth}
                    onChange={(e) => setAdvancedConfig({ ...advancedConfig, maxDepth: parseInt(e.target.value) || 0 })}
                    className={errors.maxDepth ? 'border-destructive' : ''}
                    min="1"
                  />
                  {errors.maxDepth && <p className="text-sm text-destructive mt-1">{errors.maxDepth}</p>}
                </div>
                
                <div>
                  <Label htmlFor="maxBufferSize" className="mb-1">
                    Max Buffer Size
                  </Label>
                  <Input
                    id="maxBufferSize"
                    type="number"
                    value={advancedConfig.maxBufferSize}
                    onChange={(e) => setAdvancedConfig({ ...advancedConfig, maxBufferSize: parseInt(e.target.value) || 0 })}
                    className={errors.maxBufferSize ? 'border-destructive' : ''}
                    min="1"
                  />
                  {errors.maxBufferSize && <p className="text-sm text-destructive mt-1">{errors.maxBufferSize}</p>}
                </div>
                
                <div>
                  <Label htmlFor="canopyDepth" className="mb-1">
                    Canopy Depth
                  </Label>
                  <Input
                    id="canopyDepth"
                    type="number"
                    value={advancedConfig.canopyDepth}
                    onChange={(e) => setAdvancedConfig({ ...advancedConfig, canopyDepth: parseInt(e.target.value) || 0 })}
                    className={errors.canopyDepth ? 'border-destructive' : ''}
                    min="0"
                  />
                  {errors.canopyDepth && <p className="text-sm text-destructive mt-1">{errors.canopyDepth}</p>}
                </div>
              </div>
            )}
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
              {isSubmitting ? 'Creating...' : 'Create Character Tree'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateCharacterTreeForm;