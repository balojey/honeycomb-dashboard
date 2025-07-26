import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { CreateCharacterModelForm } from '../features/asset-management/components/CreateCharacterModelForm';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

interface CharacterModel {
  address: string;
  kind: string;
}

interface CharacterModelListPageProps {}

export const CharacterModelListPage: React.FC<CharacterModelListPageProps> = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [characterModels, setCharacterModels] = useState<CharacterModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const projectAddress = window.location.pathname.split('/')[2]; // Extract project address from URL

  // Fetch character models when component mounts
  useEffect(() => {
    const fetchCharacterModels = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/projects/${projectAddress}/character-models`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch character models: ${response.status} ${response.statusText}`);
        }
        
        const data: CharacterModel[] = await response.json();
        setCharacterModels(data);
      } catch (err) {
        console.error('Error fetching character models:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (projectAddress) {
      fetchCharacterModels();
    }
  }, [projectAddress]);

  // Handler for when character model creation is successful
  const handleModelCreated = (modelId?: string) => {
    setIsCreateModalOpen(false);
    // Refresh the character models list
    window.location.reload();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Character Models</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>Create Character Model</Button>
      </div>
      
      {/* Character Models List */}
      <div className="bg-background border rounded-md">
        {loading ? (
          // Loading state
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : error ? (
          // Error state
          <Alert variant="destructive" className="m-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : characterModels.length === 0 ? (
          // Empty state
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No character models found for this project.</p>
            <p className="text-sm mt-2">Create your first character model to get started.</p>
          </div>
        ) : (
          // Data state
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model Address</TableHead>
                <TableHead>Kind</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {characterModels.map((model, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-sm">{model.address}</TableCell>
                  <TableCell>{model.kind}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
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