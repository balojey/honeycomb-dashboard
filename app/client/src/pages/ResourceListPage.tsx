import React, { useEffect, useState } from 'react';
import { useResourceStore } from '../stores/resourceStore';
import { ResourceList } from '@/components/ResourceList';
import { Button } from '@/components/ui/button';
import { CreateResourceModal } from '@/components/CreateResourceModal';
import { mintResource, createResourceTree } from '../services/resourceService';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import { sendClientTransactions } from '@honeycomb-protocol/edge-client/client/walletHelpers';
import createEdgeClient, { Resource } from '@honeycomb-protocol/edge-client';
import { MintResourceModal } from '@/components/MintResourceModal';

const API_KEY = import.meta.env.VITE_API_KEY || "https://edge.test.honeycombprotocol.com/";

interface ResourceListPageProps {}

export const ResourceListPage: React.FC<ResourceListPageProps> = () => {
  const { resources, fetchResources } = useResourceStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isMintModalOpen, setMintModalOpen] = React.useState(false);
  const wallet = useWallet();
  const client = createEdgeClient(API_KEY, true);
  
  const projectAddress = window.location.pathname.split('/')[2]; // Extract project address from URL

  useEffect(() => {
    if (projectAddress) {
      fetchResources(projectAddress);
    }
  }, [projectAddress, fetchResources]);

  const handleMint = (resource: Resource) => {
    setSelectedResource(resource);
    setMintModalOpen(true);
    // For now, we'll just open a modal or handle minting directly
    // In a full implementation, this would open a mint modal
    console.log('Mint resource:', resource);
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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Resources</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>Create Resource</Button>
      </div>
      
      <ResourceList 
        resources={resources} 
        onMint={handleMint} 
        onCreateResourceTree={handleCreateResourceTree} 
      />
      
      <CreateResourceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projectId={projectAddress}
      />

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