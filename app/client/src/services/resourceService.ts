import { CreateResourceRequest, CreateResourceResponse } from '../../../shared';

const API_URL = 'http://localhost:3000'; // TODO: Make this configurable

export const createResource = async (
  projectId: string,
  resourceData: Omit<CreateResourceRequest, 'projectId'>,
  authority: string,
): Promise<CreateResourceResponse> => {
  const response = await fetch(`${API_URL}/api/projects/${projectId}/resources`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...resourceData, projectId, authority }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create resource');
  }

  return response.json();
};

export const mintResource = async (
  projectId: string,
  resourceId: string,
  amount: number,
  owner: string,
  authority: string
) => {
  const response = await fetch(`${API_URL}/api/projects/${projectId}/resources/${resourceId}/mint`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, owner, authority }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to mint resource');
  }

  return response.json();
};