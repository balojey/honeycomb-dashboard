import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Resource, ResourceStorageEnum } from '@honeycomb-protocol/edge-client';

interface ResourceListProps {
  resources: Resource[];
  onMint: (resource: Resource) => void;
  onCreateResourceTree: (resource: Resource) => void;
}

export const ResourceList: React.FC<ResourceListProps> = ({ resources, onMint, onCreateResourceTree }) => {
  console.log('Rendering ResourceList with resources:', resources);

  if (!resources || resources.length === 0) {
    return <p>No resources found for this project.</p>;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <Card key={resource.address.toString()}>
          <CardHeader>
            <CardTitle>{resource.storage.kind}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="truncate">Symbol: {resource.symbol}</p>
            <p className="truncate">URI: {resource.uri}</p>
            <Button onClick={() => onMint(resource)} className="mt-4">Mint</Button>
            {resource.storage.kind === ResourceStorageEnum.LedgerState && (
              <Button onClick={() => onCreateResourceTree(resource)} className="mt-4 ml-2">Create Resource Tree</Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};