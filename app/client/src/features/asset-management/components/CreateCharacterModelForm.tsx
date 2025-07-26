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
import { Textarea } from '@/components/ui/textarea';
import { CreateCharacterTreeForm } from './CreateCharacterTreeForm';

interface Criteria {
  kind: 'MerkleTree' | 'Collection' | 'Creator';
  params: string;
}

interface Creator {
  address: string;
  share: number;
}

interface AssemblerConfigInput {
  assemblerConfig: string;
  collectionName: string;
  name: string;
  symbol: string;
  description: string;
  sellerFeeBasisPoints: number;
  creators: Creator[];
}

interface CharacterModelFormData {
  kind: 'Wrapped' | 'Assembled';
  criterias: Criteria[];
  assemblerConfigInput: AssemblerConfigInput;
}

interface CreateCharacterModelFormProps {
  projectId: string;
  onSuccess: (modelId?: string) => void;
  onCancel: () => void;
}

export const CreateCharacterModelForm: React.FC<CreateCharacterModelFormProps> = ({
  projectId, 
  onSuccess, 
  onCancel 
}) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  
  const [formData, setFormData] = useState<CharacterModelFormData>({
    kind: 'Wrapped',
    criterias: [{ kind: 'MerkleTree', params: '' }],
    assemblerConfigInput: {
      assemblerConfig: '',
      collectionName: '',
      name: '',
      symbol: '',
      description: '',
      sellerFeeBasisPoints: 500,
      creators: [{ address: '', share: 100 }]
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // State for adding new criteria
  const [newCriteria, setNewCriteria] = useState<Criteria>({ kind: 'MerkleTree', params: '' });
  
  // State for adding new creators
  const [newCreator, setNewCreator] = useState<Creator>({ address: '', share: 0 });
  
  // State for showing the create tree form
  const [showCreateTreeForm, setShowCreateTreeForm] = useState(false);
  const [createdModelId, setCreatedModelId] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate based on selected kind
    if (formData.kind === 'Wrapped') {
      if (formData.criterias.length === 0) {
        newErrors.criterias = 'At least one criteria is required';
      } else {
        formData.criterias.forEach((criteria, index) => {
          if (!criteria.params.trim()) {
            newErrors[`criteria-${index}-params`] = 'Parameter is required';
          }
        });
      }
    } else if (formData.kind === 'Assembled') {
      const { assemblerConfigInput } = formData;
      
      if (!assemblerConfigInput.assemblerConfig.trim()) {
        newErrors.assemblerConfig = 'Assembler Config is required';
      }
      
      if (!assemblerConfigInput.collectionName.trim()) {
        newErrors.collectionName = 'Collection Name is required';
      }
      
      if (!assemblerConfigInput.name.trim()) {
        newErrors.characterName = 'Character Name is required';
      }
      
      if (!assemblerConfigInput.symbol.trim()) {
        newErrors.symbol = 'Symbol is required';
      }
      
      if (assemblerConfigInput.sellerFeeBasisPoints < 0 || assemblerConfigInput.sellerFeeBasisPoints > 10000) {
        newErrors.sellerFeeBasisPoints = 'Seller fee must be between 0 and 10000 basis points';
      }
      
      if (assemblerConfigInput.creators.length === 0) {
        newErrors.creators = 'At least one creator is required';
      } else {
        let totalShare = 0;
        assemblerConfigInput.creators.forEach((creator, index) => {
          if (!creator.address.trim()) {
            newErrors[`creator-${index}-address`] = 'Creator address is required';
          }
          
          if (creator.share <= 0) {
            newErrors[`creator-${index}-share`] = 'Share must be greater than 0';
          }
          
          totalShare += creator.share;
        });
        
        if (totalShare !== 100) {
          newErrors.creators = 'Total creator shares must equal 100';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCriteria = () => {
    if (newCriteria.params.trim()) {
      setFormData({
        ...formData,
        criterias: [...formData.criterias, { ...newCriteria }]
      });
      setNewCriteria({ kind: 'MerkleTree', params: '' });
    }
  };

  const handleRemoveCriteria = (index: number) => {
    const newCriterias = [...formData.criterias];
    newCriterias.splice(index, 1);
    setFormData({
      ...formData,
      criterias: newCriterias
    });
  };

  const handleAddCreator = () => {
    if (newCreator.address.trim() && newCreator.share > 0) {
      setFormData({
        ...formData,
        assemblerConfigInput: {
          ...formData.assemblerConfigInput,
          creators: [...formData.assemblerConfigInput.creators, { ...newCreator }]
        }
      });
      setNewCreator({ address: '', share: 0 });
    }
  };

  const handleRemoveCreator = (index: number) => {
    const newCreators = [...formData.assemblerConfigInput.creators];
    newCreators.splice(index, 1);
    setFormData({
      ...formData,
      assemblerConfigInput: {
        ...formData.assemblerConfigInput,
        creators: newCreators
      }
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
      // Prepare the payload based on the selected kind
      let payload: any;
      
      if (formData.kind === 'Wrapped') {
        payload = {
          config: {
            kind: 'Wrapped',
            criterias: formData.criterias
          }
        };
      } else {
        payload = {
          config: {
            kind: 'Assembled',
            assemblerConfigInput: formData.assemblerConfigInput
          }
        };
      }
      
      // Call the BFF endpoint
      const response = await fetch(`/api/projects/${projectId}/character-models`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create character model');
      }
      
      const { transaction: serializedTransaction } = await response.json();
      
      // Deserialize the transaction
      const transaction = Transaction.from(Buffer.from(serializedTransaction, 'base64'));
      
      // Sign and send the transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Confirm the transaction
      await connection.confirmTransaction(signature, 'confirmed');
      
      toast.success('Character model created successfully!');
      
      // Set the model ID (in a real implementation, this would come from the response)
      // For now we'll use a placeholder
      const modelId = 'placeholder-model-id';
      setCreatedModelId(modelId);
      
      // Show the create tree form
      setShowCreateTreeForm(true);
    } catch (error) {
      console.error('Error creating character model:', error);
      toast.error(`Failed to create character model: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle successful tree creation
  const handleTreeSuccess = (treeAddress: string) => {
    toast.success(`Character tree created successfully! Address: ${treeAddress}`);
    setShowCreateTreeForm(false);
    onSuccess(createdModelId);
  };

  // Handle canceling tree creation
  const handleTreeCancel = () => {
    setShowCreateTreeForm(false);
    onSuccess(createdModelId);
  };

  // If showCreateTreeForm is true, render the CreateCharacterTreeForm instead
  if (showCreateTreeForm) {
    return (
      <CreateCharacterTreeForm
        projectId={projectId}
        modelId={createdModelId}
        onSuccess={handleTreeSuccess}
        onCancel={handleTreeCancel}
      />
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create Character Model</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {/* Kind Selection */}
          <div className="mb-6">
            <Label className="mb-2">
              Configuration Kind
            </Label>
            <ToggleGroup 
              type="single" 
              value={formData.kind} 
              onValueChange={(value: 'Wrapped' | 'Assembled') => value && setFormData({ 
                ...formData, 
                kind: value,
                // Reset the other section when switching
                criterias: value === 'Wrapped' ? formData.criterias : [{ kind: 'MerkleTree', params: '' }],
                assemblerConfigInput: value === 'Assembled' ? formData.assemblerConfigInput : {
                  assemblerConfig: '',
                  collectionName: '',
                  name: '',
                  symbol: '',
                  description: '',
                  sellerFeeBasisPoints: 500,
                  creators: [{ address: '', share: 100 }]
                }
              })}
              className="mb-4"
            >
              <ToggleGroupItem value="Wrapped" aria-label="Wrapped configuration">
                Wrapped
              </ToggleGroupItem>
              <ToggleGroupItem value="Assembled" aria-label="Assembled configuration">
                Assembled
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          {/* Wrapped Configuration */}
          {formData.kind === 'Wrapped' && (
            <div className="mb-6">
              <Label className="mb-2">
                Wrapping Criteria
              </Label>
              <div className="border rounded-md p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <Label htmlFor="criteriaKind">Criteria Type</Label>
                    <select
                      id="criteriaKind"
                      value={newCriteria.kind}
                      onChange={(e) => setNewCriteria({ ...newCriteria, kind: e.target.value as any })}
                      className="w-full border rounded-md p-2"
                    >
                      <option value="MerkleTree">Merkle Tree</option>
                      <option value="Collection">Collection</option>
                      <option value="Creator">Creator</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="criteriaParams">Parameter (Address)</Label>
                    <Input
                      id="criteriaParams"
                      value={newCriteria.params}
                      onChange={(e) => setNewCriteria({ ...newCriteria, params: e.target.value })}
                      placeholder="Enter address"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={handleAddCriteria}
                  className="w-full"
                >
                  Add Criteria
                </Button>
              </div>
              
              {formData.criterias.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Added Criteria</h4>
                  <ul className="space-y-2">
                    {formData.criterias.map((criteria, index) => (
                      <li key={index} className="flex items-center justify-between bg-muted px-3 py-2 rounded-md">
                        <div>
                          <span className="font-medium">{criteria.kind}:</span> {criteria.params}
                        </div>
                        <Button
                          type="button"
                          onClick={() => handleRemoveCriteria(index)}
                          variant="ghost"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                  {errors.criterias && <p className="text-sm text-destructive mt-1">{errors.criterias}</p>}
                </div>
              )}
            </div>
          )}
          
          {/* Assembled Configuration */}
          {formData.kind === 'Assembled' && (
            <div className="mb-6 space-y-4">
              <div>
                <Label htmlFor="assemblerConfig" className="mb-1">
                  Assembler Config Address
                </Label>
                <Input
                  id="assemblerConfig"
                  value={formData.assemblerConfigInput.assemblerConfig}
                  onChange={(e) => setFormData({
                    ...formData,
                    assemblerConfigInput: {
                      ...formData.assemblerConfigInput,
                      assemblerConfig: e.target.value
                    }
                  })}
                  className={errors.assemblerConfig ? 'border-destructive' : ''}
                  placeholder="Enter assembler config address"
                />
                {errors.assemblerConfig && <p className="text-sm text-destructive mt-1">{errors.assemblerConfig}</p>}
              </div>
              
              <div>
                <Label htmlFor="collectionName" className="mb-1">
                  Collection Name
                </Label>
                <Input
                  id="collectionName"
                  value={formData.assemblerConfigInput.collectionName}
                  onChange={(e) => setFormData({
                    ...formData,
                    assemblerConfigInput: {
                      ...formData.assemblerConfigInput,
                      collectionName: e.target.value
                    }
                  })}
                  className={errors.collectionName ? 'border-destructive' : ''}
                  placeholder="Enter collection name"
                />
                {errors.collectionName && <p className="text-sm text-destructive mt-1">{errors.collectionName}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="characterName" className="mb-1">
                    Character Name
                  </Label>
                  <Input
                    id="characterName"
                    value={formData.assemblerConfigInput.name}
                    onChange={(e) => setFormData({
                      ...formData,
                      assemblerConfigInput: {
                        ...formData.assemblerConfigInput,
                        name: e.target.value
                      }
                    })}
                    className={errors.characterName ? 'border-destructive' : ''}
                    placeholder="Enter character name"
                  />
                  {errors.characterName && <p className="text-sm text-destructive mt-1">{errors.characterName}</p>}
                </div>
                
                <div>
                  <Label htmlFor="symbol" className="mb-1">
                    Symbol
                  </Label>
                  <Input
                    id="symbol"
                    value={formData.assemblerConfigInput.symbol}
                    onChange={(e) => setFormData({
                      ...formData,
                      assemblerConfigInput: {
                        ...formData.assemblerConfigInput,
                        symbol: e.target.value
                      }
                    })}
                    className={errors.symbol ? 'border-destructive' : ''}
                    placeholder="Enter symbol"
                  />
                  {errors.symbol && <p className="text-sm text-destructive mt-1">{errors.symbol}</p>}
                </div>
              </div>
              
              <div>
                <Label htmlFor="description" className="mb-1">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.assemblerConfigInput.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    assemblerConfigInput: {
                      ...formData.assemblerConfigInput,
                      description: e.target.value
                    }
                  })}
                  placeholder="Enter description"
                />
              </div>
              
              <div>
                <Label htmlFor="sellerFeeBasisPoints" className="mb-1">
                  Seller Fee (Basis Points)
                </Label>
                <Input
                  id="sellerFeeBasisPoints"
                  type="number"
                  min="0"
                  max="10000"
                  value={formData.assemblerConfigInput.sellerFeeBasisPoints}
                  onChange={(e) => setFormData({
                    ...formData,
                    assemblerConfigInput: {
                      ...formData.assemblerConfigInput,
                      sellerFeeBasisPoints: parseInt(e.target.value) || 0
                    }
                  })}
                  className={errors.sellerFeeBasisPoints ? 'border-destructive' : ''}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  100 basis points = 1%. Example: 500 = 5%
                </p>
                {errors.sellerFeeBasisPoints && <p className="text-sm text-destructive mt-1">{errors.sellerFeeBasisPoints}</p>}
              </div>
              
              <div>
                <Label className="mb-2">
                  Creators
                </Label>
                <div className="border rounded-md p-4 mb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <Label htmlFor="creatorAddress">Creator Address</Label>
                      <Input
                        id="creatorAddress"
                        value={newCreator.address}
                        onChange={(e) => setNewCreator({ ...newCreator, address: e.target.value })}
                        placeholder="Enter creator address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="creatorShare">Share (%)</Label>
                      <Input
                        id="creatorShare"
                        type="number"
                        min="1"
                        max="100"
                        value={newCreator.share}
                        onChange={(e) => setNewCreator({ ...newCreator, share: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddCreator}
                    className="w-full"
                  >
                    Add Creator
                  </Button>
                </div>
                
                {formData.assemblerConfigInput.creators.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Added Creators</h4>
                    <ul className="space-y-2">
                      {formData.assemblerConfigInput.creators.map((creator, index) => (
                        <li key={index} className="flex items-center justify-between bg-muted px-3 py-2 rounded-md">
                          <div>
                            <span className="font-medium">{creator.address}:</span> {creator.share}%
                          </div>
                          <Button
                            type="button"
                            onClick={() => handleRemoveCreator(index)}
                            variant="ghost"
                            size="sm"
                          >
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                    {errors.creators && <p className="text-sm text-destructive mt-1">{errors.creators}</p>}
                  </div>
                )}
              </div>
            </div>
          )}
          
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
              {isSubmitting ? 'Creating...' : 'Create Character Model'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateCharacterModelForm;