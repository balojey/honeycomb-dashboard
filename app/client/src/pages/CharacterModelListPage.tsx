import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { CreateCharacterModelForm } from '../features/asset-management/components/CreateCharacterModelForm';

interface CharacterModelListPageProps {}

export const CharacterModelListPage: React.FC<CharacterModelListPageProps> = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const projectAddress = window.location.pathname.split('/')[2]; // Extract project address from URL

  // Handler for when character model creation is successful
  const handleModelCreated = (modelId?: string) => {
    setIsCreateModalOpen(false);
    // TODO: Refresh character models when they are implemented
    // If a modelId is provided, you might want to do something with it
    console.log('Character model created with ID:', modelId);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Character Models</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>Create Character Model</Button>
      </div>
      
      {/* Placeholder for character model list - to be implemented later */}
      <div className="bg-muted p-4 rounded-md text-center">
        <p>Character model list will be displayed here.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Implementation of fetching and displaying character models is pending.
        </p>
      </div>
      
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <CreateCharacterModelForm
            projectId={projectAddress}
            onSuccess={handleModelCreated}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
};