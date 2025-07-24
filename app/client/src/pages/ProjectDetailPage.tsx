
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useProjectStore } from '../stores/projectStore';
import { useProfileStore } from '../stores/profileStore';
import { useResourceStore } from '../stores/resourceStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ProfileList } from '../components/ProfileList';
import { ResourceList } from '../components/ResourceList';
import { Button } from '../components/ui/button';
import { CreateResourceModal } from '../components/CreateResourceModal';
import { MintResourceModal } from '../components/MintResourceModal';
import { mintResource, createResourceTree } from '../services/resourceService';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import { sendClientTransactions } from '@honeycomb-protocol/edge-client/client/walletHelpers';
import createEdgeClient, { Resource } from '@honeycomb-protocol/edge-client';
import { CreateCharacterModelForm } from '../features/asset-management/components/CreateCharacterModelForm';
import { CreateAssemblerConfigForm } from '../features/asset-management/components/CreateAssemblerConfigForm';
import { AddTraitsForm } from '../features/asset-management/components/AddTraitsForm';

const API_KEY = import.meta.env.VITE_API_KEY || "https://edge.test.honeycombprotocol.com/";

export const ProjectDetailPage: React.FC = () => {
  const { projectAddress } = useParams<{ projectAddress: string }>();
  const { projects } = useProjectStore();
  const { fetchProfiles } = useProfileStore();
  const { resources, fetchResources } = useResourceStore();
  const [isCreateModalOpen, setCreateModalOpen] = React.useState(false);
  const [isMintModalOpen, setMintModalOpen] = React.useState(false);
  const [isCreateCharacterModalOpen, setCreateCharacterModalOpen] = React.useState(false);
  const [isCreateAssemblerConfigModalOpen, setCreateAssemblerConfigModalOpen] = React.useState(false);
  const [isAddTraitsModalOpen, setAddTraitsModalOpen] = React.useState(false);
  const [assemblerConfigId, setAssemblerConfigId] = React.useState('');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const wallet = useWallet();
  const client = useMemo(() => createEdgeClient(API_KEY, true), []);

  const project = projects.find(p => p.address.toString() === projectAddress);

  useEffect(() => {
    if (projectAddress) {
      fetchProfiles(projectAddress);
      fetchResources(projectAddress);
    }
  }, [projectAddress, fetchProfiles, fetchResources]);

  const handleMint = (resource: Resource) => {
    setSelectedResource(resource);
    setMintModalOpen(true);
  };

  const handleCreateResourceTree = async (resource: Resource) => {
    if (!projectAddress || !wallet.publicKey) return;

    try {
      const result = await createResourceTree(
        projectAddress,
        resource.address.toString(),
        wallet.publicKey.toString()
      );
      console.log('Create resource tree successful:', result);
      await sendClientTransactions(client, wallet, result.tx);
      toast.success('Resource tree created successfully!');
    } catch (error) {
      console.error('Failed to create resource tree:', error);
      toast.error('Failed to create resource tree.');
    }
  };

  const handleMintSubmit = async (amount: number, owner: string) => {
    if (!projectAddress || !selectedResource || !wallet.publicKey) return;

    try {
      const result = await mintResource(
        projectAddress,
        selectedResource.address,
        amount,
        owner,
        wallet.publicKey.toString()
      );
      console.log('Minting successful:', result);
      await sendClientTransactions(client, wallet, result.tx);
      toast.success('Resource minted successfully!');
      setMintModalOpen(false);
    } catch (error) {
      console.error('Failed to mint resource:', error);
      toast.error('Failed to mint resource.');
    }
  };

  if (!project) {
    return <div className="text-center text-muted-foreground">Project not found.</div>;
  }

  return (
    <div className="container mx-auto">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">{project.name}</h1>
          <p className="text-sm text-muted-foreground truncate mt-1">
            {project.address.toString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setCreateAssemblerConfigModalOpen(true)}>Create Assembler Config</Button>
          <Button onClick={() => setCreateCharacterModalOpen(true)}>Create Character Model</Button>
          <Button onClick={() => setAddTraitsModalOpen(true)}>Add Traits</Button>
          <Button onClick={() => setCreateModalOpen(true)}>Create Resource</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResourceList resources={resources} onMint={handleMint} onCreateResourceTree={handleCreateResourceTree} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Users & Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileList />
          </CardContent>
        </Card>
      </div>

      <CreateResourceModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        projectId={project.address.toString()}
      />
      {isCreateCharacterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <CreateCharacterModelForm
            projectId={project.address.toString()}
            onSuccess={() => {
              setCreateCharacterModalOpen(false);
              // TODO: Refresh character models when they are implemented
            }}
            onCancel={() => setCreateCharacterModalOpen(false)}
          />
        </div>
      )}
      {isCreateAssemblerConfigModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <CreateAssemblerConfigForm
            projectId={project.address.toString()}
            onSuccess={() => {
              setCreateAssemblerConfigModalOpen(false);
              // TODO: Refresh assembler configs when they are implemented
            }}
            onCancel={() => setCreateAssemblerConfigModalOpen(false)}
          />
        </div>
      )}
      {isAddTraitsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          {!assemblerConfigId ? (
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add Traits to Assembler Config</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Please enter the Assembler Config ID to add traits to:</p>
                <Input
                  value={assemblerConfigId}
                  onChange={(e) => setAssemblerConfigId(e.target.value)}
                  placeholder="Enter assembler config ID"
                  className="mb-4"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && assemblerConfigId.trim()) {
                      e.preventDefault();
                    }
                  }}
                />
                <div className="flex justify-end space-x-3">
                  <Button
                    onClick={() => {
                      setAddTraitsModalOpen(false);
                      setAssemblerConfigId('');
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // The form will show when assemblerConfigId is set
                    }}
                    disabled={!assemblerConfigId.trim()}
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <AddTraitsForm
              projectId={project.address.toString()}
              assemblerConfigId={assemblerConfigId}
              onSuccess={() => {
                setAddTraitsModalOpen(false);
                setAssemblerConfigId('');
                // TODO: Refresh traits when they are implemented
              }}
              onCancel={() => {
                setAddTraitsModalOpen(false);
                setAssemblerConfigId('');
              }}
            />
          )}
        </div>
      )}
      {selectedResource && (
        <MintResourceModal
          isOpen={isMintModalOpen}
          onClose={() => setMintModalOpen(false)}
          onSubmit={handleMintSubmit}
          resourceName={selectedResource.name}
        />
      )}
    </div>
  );
};
