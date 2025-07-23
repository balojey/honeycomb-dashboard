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