import React, { useEffect } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { useWallet } from '@solana/wallet-adapter-react';

export const ProjectList: React.FC = () => {
  const { projects, isLoading, error, fetchProjects } = useProjectStore();
  const { publicKey } = useWallet();

  useEffect(() => {
    if (publicKey) {
      fetchProjects(publicKey.toBase58());
    }
  }, [publicKey, fetchProjects]);

  if (!publicKey) {
    return <div>Please connect your wallet to see your projects.</div>;
  }

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (projects.length === 0) {
    return <div>No projects found.</div>;
  }

  return (
    <div>
      <h2>Your Projects</h2>
      <ul>
        {projects.length > 0 ? projects.map((project) => (
          <li key={project.address.toString()}>{project.name}</li>
        )) : (
          <li>No projects available.</li>
        )}
      </ul>
    </div>
  );
};
