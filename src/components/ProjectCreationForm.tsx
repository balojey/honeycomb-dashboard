'use client';

import { useState } from 'react';
import { useWalletAddress } from '@/hooks/useWalletAddress';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Plus, Trash2, Rocket, AlertCircle, CheckCircle2, Wallet } from 'lucide-react';

interface ProjectFormData {
  name: string;
  achievements: string[];
  customDataFields: string[];
}

interface CreateProjectResponse {
  success: boolean;
  error?: string;
  projectAddress: string;
  txResponse: any;
  projectData: {
    name: string;
    authorityPublicKey: string;
    achievements: string[];
    customDataFields: string[];
    walletAddress: string;
  };
}

export default function ProjectCreationForm() {
  const { walletRecord } = useWalletAddress();
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    achievements: [''],
    customDataFields: [''],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (field: 'achievements' | 'customDataFields', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item),
    }));
  };

  const addArrayItem = (field: 'achievements' | 'customDataFields') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (field: 'achievements' | 'customDataFields', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletRecord?.address) {
      setError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Filter out empty strings from arrays
      const cleanedAchievements = formData.achievements.filter(a => a.trim() !== '');
      const cleanedCustomDataFields = formData.customDataFields.filter(f => f.trim() !== '');

      // Step 1: Create the project transaction
      const createResponse = await fetch('/api/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          authorityPublicKey: walletRecord.address,
          payerPublicKey: walletRecord.address,
          achievements: cleanedAchievements,
          customDataFields: cleanedCustomDataFields,
          walletAddress: walletRecord.address,
        }),
      });

      const createData: CreateProjectResponse = await createResponse.json();

      if (!createData.success) {
        throw new Error(createData.error || 'Failed to create project transaction');
      }

      // Step 2: Here you would normally sign the transaction with the user's wallet
      // For now, we'll simulate a successful transaction
      // In a real implementation, you'd use a wallet adapter like @solana/wallet-adapter-react
      
      // Simulate transaction signing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 3: Store the project after successful signing
      const storeResponse = await fetch('/api/projects/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectAddress: createData.projectAddress,
          ...createData.projectData,
          transactionSignature: 'simulated_signature_' + Date.now(),
        }),
      });

      const storeData = await storeResponse.json();

      if (!storeData.success) {
        throw new Error(storeData.error || 'Failed to store project');
      }

      setSuccess(`Project "${formData.name}" created successfully! Address: ${createData.projectAddress}`);
      
      // Reset form
      setFormData({
        name: '',
        achievements: [''],
        customDataFields: [''],
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!walletRecord?.address) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-3 p-8 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <Wallet className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-black mb-1">
                Wallet Required
              </h3>
              <p className="text-black">
                Please connect your wallet to create a project
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl text-black">Create Honeycomb Project</CardTitle>
          <CardDescription className="text-black">
            Set up a new project on the Honeycomb Protocol with custom achievements and data fields
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-black">Project Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your project name"
                className="text-black"
                required
              />
            </div>

            {/* Connected Wallet Info */}
            <div className="space-y-2">
              <Label className="text-black">Connected Wallet</Label>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                <p className="font-mono text-sm text-black break-all">
                  {walletRecord.address}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  This wallet will be used as both the project authority and transaction payer
                </p>
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-black">Achievements</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('achievements')}
                  className="flex items-center space-x-1 text-black"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Achievement</span>
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={achievement}
                      onChange={(e) => handleArrayChange('achievements', index, e.target.value)}
                      placeholder={`Achievement ${index + 1}`}
                      className="flex-1 text-black"
                    />
                    {formData.achievements.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('achievements', index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Data Fields */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-black">Custom Data Fields</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('customDataFields')}
                  className="flex items-center space-x-1 text-black"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Field</span>
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.customDataFields.map((field, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={field}
                      onChange={(e) => handleArrayChange('customDataFields', index, e.target.value)}
                      placeholder={`Custom field ${index + 1}`}
                      className="flex-1 text-black"
                    />
                    {formData.customDataFields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('customDataFields', index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Project...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Rocket className="w-4 h-4" />
                  <span>Create Project</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-black mb-1">
                  Error Creating Project
                </h4>
                <p className="text-sm text-black">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {success && (
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-black mb-1">
                  Project Created Successfully!
                </h4>
                <p className="text-sm text-black">{success}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}