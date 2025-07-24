import React, { useEffect } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import { useProjectStore } from '../stores/projectStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';

export const ProjectDetailPage: React.FC = () => {
  const { projectAddress } = useParams<{ projectAddress: string }>();
  const navigate = useNavigate();
  const { projects } = useProjectStore();
  
  const project = projects.find(p => p.address.toString() === projectAddress);

  useEffect(() => {
    // Redirect to the default tab (users) when accessing the base project route
    if (projectAddress && window.location.pathname === `/project/${projectAddress}`) {
      navigate(`/project/${projectAddress}/users`);
    }
  }, [projectAddress, navigate]);

  if (!project) {
    return <div className="text-center text-muted-foreground">Project not found.</div>;
  }

  return (
    <div className="container mx-auto">
      <header className="mb-6">
        <div>
          <h1 className="text-4xl font-bold">{project.name}</h1>
          <p className="text-sm text-muted-foreground truncate mt-1">
            {project.address.toString()}
          </p>
        </div>
      </header>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger 
            value="users" 
            onClick={() => navigate(`/project/${projectAddress}/users`)}
          >
            Users & Profiles
          </TabsTrigger>
          <TabsTrigger 
            value="resources" 
            onClick={() => navigate(`/project/${projectAddress}/resources`)}
          >
            Resources
          </TabsTrigger>
          <TabsTrigger 
            value="characters" 
            onClick={() => navigate(`/project/${projectAddress}/characters`)}
          >
            Character Models
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>
            {window.location.pathname.endsWith('/users') && 'Users & Profiles'}
            {window.location.pathname.endsWith('/resources') && 'Resources'}
            {window.location.pathname.endsWith('/characters') && 'Character Models'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Outlet />
        </CardContent>
      </Card>
    </div>
  );
};