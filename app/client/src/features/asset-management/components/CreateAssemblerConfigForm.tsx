import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import { toast } from 'sonner';

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
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Assembler Config</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Ticker Input */}
        <div className="mb-6">
          <label htmlFor="ticker" className="block text-sm font-medium text-gray-700 mb-1">
            Ticker ID
          </label>
          <input
            type="text"
            id="ticker"
            value={formData.ticker}
            onChange={(e) => setFormData({ ...formData, ticker: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.ticker ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter a unique ticker ID"
          />
          {errors.ticker && <p className="mt-1 text-sm text-red-600">{errors.ticker}</p>}
        </div>
        
        {/* Layer Order */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Layer Order
          </label>
          <div className="flex mb-2">
            <input
              type="text"
              value={layerInput}
              onChange={(e) => setLayerInput(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
              placeholder="Enter layer name"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLayer())}
            />
            <button
              type="button"
              onClick={handleAddLayer}
              className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          {errors.order && <p className="mt-1 text-sm text-red-600">{errors.order}</p>}
          
          {formData.order.length > 0 && (
            <div className="mt-2">
              <ul className="space-y-2">
                {formData.order.map((layer, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                    <span>{layer}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLayer(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Tree Config Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tree Configuration
          </label>
          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${
                configType === 'basic'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setConfigType('basic')}
            >
              Basic
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${
                configType === 'advanced'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setConfigType('advanced')}
            >
              Advanced
            </button>
          </div>
          
          {/* Basic Config */}
          {configType === 'basic' && (
            <div className="border border-gray-200 rounded-md p-4">
              <label htmlFor="numAssets" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Assets
              </label>
              <input
                type="number"
                id="numAssets"
                value={basicConfig.numAssets}
                onChange={(e) => setBasicConfig({ ...basicConfig, numAssets: parseInt(e.target.value) || 0 })}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.numAssets ? 'border-red-500' : 'border-gray-300'
                }`}
                min="1"
              />
              {errors.numAssets && <p className="mt-1 text-sm text-red-600">{errors.numAssets}</p>}
            </div>
          )}
          
          {/* Advanced Config */}
          {configType === 'advanced' && (
            <div className="border border-gray-200 rounded-md p-4 space-y-4">
              <div>
                <label htmlFor="maxDepth" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Depth
                </label>
                <input
                  type="number"
                  id="maxDepth"
                  value={advancedConfig.maxDepth}
                  onChange={(e) => setAdvancedConfig({ ...advancedConfig, maxDepth: parseInt(e.target.value) || 0 })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.maxDepth ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min="1"
                />
                {errors.maxDepth && <p className="mt-1 text-sm text-red-600">{errors.maxDepth}</p>}
              </div>
              
              <div>
                <label htmlFor="maxBufferSize" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Buffer Size
                </label>
                <input
                  type="number"
                  id="maxBufferSize"
                  value={advancedConfig.maxBufferSize}
                  onChange={(e) => setAdvancedConfig({ ...advancedConfig, maxBufferSize: parseInt(e.target.value) || 0 })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.maxBufferSize ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min="1"
                />
                {errors.maxBufferSize && <p className="mt-1 text-sm text-red-600">{errors.maxBufferSize}</p>}
              </div>
              
              <div>
                <label htmlFor="canopyDepth" className="block text-sm font-medium text-gray-700 mb-1">
                  Canopy Depth
                </label>
                <input
                  type="number"
                  id="canopyDepth"
                  value={advancedConfig.canopyDepth}
                  onChange={(e) => setAdvancedConfig({ ...advancedConfig, canopyDepth: parseInt(e.target.value) || 0 })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.canopyDepth ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min="0"
                />
                {errors.canopyDepth && <p className="mt-1 text-sm text-red-600">{errors.canopyDepth}</p>}
              </div>
            </div>
          )}
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Assembler Config'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAssemblerConfigForm;