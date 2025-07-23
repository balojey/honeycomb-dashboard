import React, { useEffect, useState } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { useWallet } from '@solana/wallet-adapter-react';
import { CreateProjectModal } from './CreateProjectModal';
import { createProject } from '../services/projectService';

export const ProjectList: React.FC<any> = ({ client }) => {
  const { projects, isLoading, error, fetchProjects } = useProjectStore();
  const wallet = useWallet();
  const { publicKey } = wallet;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    if (publicKey) {
      fetchProjects(publicKey.toBase58());
    }
  }, [publicKey, fetchProjects]);

  const handleCreateProject = async (projectName: string) => {
    setCreateError(null);
    try {
      if (!publicKey) {
        throw new Error("Wallet not connected.");
      }
      await createProject(projectName, wallet, client);
      fetchProjects(publicKey.toBase58()); // Refresh project list
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to create project:", err);
      setCreateError(err instanceof Error ? err.message : "An unknown error occurred.");
    }
  };

  if (!publicKey) {
    return <div>Please connect your wallet to see your projects.</div>;
  }

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  if (error || createError) {
    return <div>Error: {error || createError}</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2>Your Projects</h2>
        <button onClick={() => setIsModalOpen(true)}>Create New Project</button>
      </div>
      {projects.length === 0 ? (
        <div>No projects found.</div>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.address.toString()}>{project.name}</li>
          ))}
        </ul>
      )}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
};
