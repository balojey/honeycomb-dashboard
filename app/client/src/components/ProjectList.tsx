import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjectStore } from '../stores/projectStore';
import { useWallet } from '@solana/wallet-adapter-react';
import { CreateProjectModal } from './CreateProjectModal';
import { createProject } from '../services/projectService';
import { Button } from './ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

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
    return <div className="text-center text-muted-foreground">Please connect your wallet to see your projects.</div>;
  }

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading projects...</div>;
  }

  if (error || createError) {
    return <div className="text-center text-destructive">Error: {error || createError}</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Your Projects</h2>
        <Button onClick={() => setIsModalOpen(true)}>Create New Project</Button>
      </div>
      {projects.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">No projects found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link to={`/project/${project.address.toString()}`} key={project.address.toString()} className="block hover:shadow-lg transition-shadow duration-200 rounded-lg">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription className='truncate'>Address: {project.address.toString()}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
};