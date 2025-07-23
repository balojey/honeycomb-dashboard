import { Project } from '@honeycomb-protocol/edge-client';
import { sendClientTransactions } from '@honeycomb-protocol/edge-client/client/walletHelpers';
import { WalletContextState } from '@solana/wallet-adapter-react';

const API_URL = 'http://localhost:3000'; // TODO: Make this configurable

export const fetchProjects = async (authority: string): Promise<Project[]> => {
  const response = await fetch(`${API_URL}/api/projects?authority=${authority}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch projects');
  }

  return response.json();
};

export const createProject = async (
  projectName: string,
  wallet: WalletContextState,
  client: any
): Promise<void> => {
  if (!wallet.publicKey) {
    throw new Error('Wallet not connected.');
  }

  const response = await fetch(`${API_URL}/api/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: projectName, authority: wallet.publicKey.toString() }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create project');
  }

  const { tx: txResponse } = await response.json();
  await sendClientTransactions(client, wallet, txResponse);
};
