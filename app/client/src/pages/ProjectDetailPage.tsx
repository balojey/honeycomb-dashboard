
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useProjectStore } from '../stores/projectStore';
import { useProfileStore } from '../stores/profileStore';
import { useResourceStore } from '../stores/resourceStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ProfileList } from '../components/ProfileList';
import { ResourceList } from '../components/ResourceList';
import { Button } from '../components/ui/button';
import { CreateResourceModal } from '../components/CreateResourceModal';
import { MintResourceModal } from '../components/MintResourceModal';
import { mintResource } from '../services/resourceService';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import { sendClientTransactions } from '@honeycomb-protocol/edge-client/client/walletHelpers';
import createEdgeClient from '@honeycomb-protocol/edge-client';

const API_KEY = import.meta.env.VITE_API_KEY || "https://edge.test.honeycombprotocol.com/";

export const ProjectDetailPage: React.FC = () => {
  const { projectAddress } = useParams<{ projectAddress: string }>();
  const { projects } = useProjectStore();
  const { fetchProfiles } = useProfileStore();
  const { resources, fetchResources } = useResourceStore();
  const [isCreateModalOpen, setCreateModalOpen] = React.useState(false);
  const [isMintModalOpen, setMintModalOpen] = React.useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const wallet = useWallet();
  const client = useMemo(() => createEdgeClient(API_KEY, true), []);

  const project = projects.find(p => p.address.toString() === projectAddress);

  useEffect(() => {
    if (projectAddress) {
      fetchProfiles(projectAddress);
      fetchResources(projectAddress);
    }
  }, [projectAddress, fetchProfiles, fetchResources]);

  const handleMint = (resource: any) => {
    setSelectedResource(resource);
    setMintModalOpen(true);
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
        <Button onClick={() => setCreateModalOpen(true)}>Create Resource</Button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResourceList resources={resources} onMint={handleMint} />
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
