
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProjectStore } from '../stores/projectStore';
import { useProfileStore } from '../stores/profileStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ProfileList } from '../components/ProfileList';
import { Button } from '../components/ui/button';
import { CreateResourceModal } from '../components/CreateResourceModal';

export const ProjectDetailPage: React.FC = () => {
  const { projectAddress } = useParams<{ projectAddress: string }>();
  const { projects } = useProjectStore();
  const { fetchProfiles } = useProfileStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const project = projects.find(p => p.address.toString() === projectAddress);

  useEffect(() => {
    if (projectAddress) {
      fetchProfiles(projectAddress);
    }
  }, [projectAddress, fetchProfiles]);

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
        <Button onClick={() => setIsModalOpen(true)}>Create Resource</Button>
      </header>

      <div className="grid grid-cols-1 gap-6">
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={project.address.toString()}
      />
    </div>
  );
};
