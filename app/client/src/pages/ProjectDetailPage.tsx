
import React from 'react';
import { useParams } from 'react-router-dom';
import { useProjectStore } from '../stores/projectStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export const ProjectDetailPage: React.FC = () => {
  const { projectAddress } = useParams<{ projectAddress: string }>();
  const { projects } = useProjectStore();

  const project = projects.find(p => p.address.toString() === projectAddress);

  if (!project) {
    return <div className="text-center text-muted-foreground">Project not found.</div>;
  }

  return (
    <div className="container mx-auto">
      <header className="mb-6">
        <h1 className="text-4xl font-bold">{project.name}</h1>
        <p className="text-sm text-muted-foreground truncate mt-1">
          {project.address.toString()}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Users & Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">User and profile management will be available here soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
