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

interface AssemblerConfigFormData {
  ticker: string;
  order: string[];
  treeConfig: TreeConfig;
}

interface CreateAssemblerConfigFormProps {
  projectId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateAssemblerConfigForm: React.FC<CreateAssemblerConfigFormProps> = ({ 
  projectId, 
  onSuccess, 
  onCancel 
}) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  
  const [formData, setFormData] = useState<AssemblerConfigFormData>({
    ticker: '',
    order: [],
    treeConfig: { basic: { numAssets: 1000 } }
  });
  
  const [layerInput, setLayerInput] = useState('');
  const [configType, setConfigType] = useState<'basic' | 'advanced'>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [basicConfig, setBasicConfig] = useState<TreeConfigBasic>({ numAssets: 1000 });
  const [advancedConfig, setAdvancedConfig] = useState<TreeConfigAdvanced>({
    maxDepth: 14,
    maxBufferSize: 64,
    canopyDepth: 10
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.ticker.trim()) {
      newErrors.ticker = 'Ticker ID is required';
    }
    
    if (formData.order.length === 0) {
      newErrors.order = 'At least one layer is required';
    }
    
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

  const handleAddLayer = () => {
    if (layerInput.trim() && !formData.order.includes(layerInput.trim())) {
      setFormData({
        ...formData,
        order: [...formData.order, layerInput.trim()]
      });
      setLayerInput('');
    }
  };

  const handleRemoveLayer = (index: number) => {
    const newOrder = [...formData.order];
    newOrder.splice(index, 1);
    setFormData({
      ...formData,
      order: newOrder
    });
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
        ticker: formData.ticker,
        order: formData.order,
        treeConfig
      };
      
      // Call the BFF endpoint
      const response = await fetch(`/api/projects/${projectId}/assembler-configs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create assembler config');
      }
      
      const { transaction: serializedTransaction } = await response.json();
      
      // Deserialize the transaction
      const transaction = Transaction.from(Buffer.from(serializedTransaction, 'base64'));
      
      // Sign and send the transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Confirm the transaction
      await connection.confirmTransaction(signature, 'confirmed');
      
      toast.success('Assembler config created successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error creating assembler config:', error);
      toast.error(`Failed to create assembler config: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create Assembler Config</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {/* Ticker Input */}
          <div className="mb-6">
            <Label htmlFor="ticker" className="mb-1">
              Ticker ID
            </Label>
            <Input
              id="ticker"
              value={formData.ticker}
              onChange={(e) => setFormData({ ...formData, ticker: e.target.value })}
              className={errors.ticker ? 'border-destructive' : ''}
              placeholder="Enter a unique ticker ID"
            />
            {errors.ticker && <p className="text-sm text-destructive mt-1">{errors.ticker}</p>}
          </div>
          
          {/* Layer Order */}
          <div className="mb-6">
            <Label className="mb-1">
              Layer Order
            </Label>
            <div className="flex mb-2">
              <Input
                value={layerInput}
                onChange={(e) => setLayerInput(e.target.value)}
                className="flex-1 rounded-r-none"
                placeholder="Enter layer name"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLayer())}
              />
              <Button
                type="button"
                onClick={handleAddLayer}
                className="rounded-l-none"
              >
                Add
              </Button>
            </div>
            {errors.order && <p className="text-sm text-destructive">{errors.order}</p>}
            
            {formData.order.length > 0 && (
              <div className="mt-2">
                <ul className="space-y-2">
                  {formData.order.map((layer, index) => (
                    <li key={index} className="flex items-center justify-between bg-muted px-3 py-2 rounded-md">
                      <span>{layer}</span>
                      <Button
                        type="button"
                        onClick={() => handleRemoveLayer(index)}
                        variant="ghost"
                        size="sm"
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
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
              {isSubmitting ? 'Creating...' : 'Create Assembler Config'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateAssemblerConfigForm;