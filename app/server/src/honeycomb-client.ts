import createEdgeClient, { ResourceStorageEnum } from '@honeycomb-protocol/edge-client';
import { Keypair, PublicKey } from '@solana/web3.js';

// Initialize the Honeycomb Edge Client 
const API_URL = "https://edge.test.honeycombprotocol.com/";
const client = createEdgeClient(API_URL, true)

export const fetchProjects = async (authorityPublicKey: PublicKey) => {
  try {
    const projects = await client.findProjects({
      authorities: [authorityPublicKey.toString()],
    });
    console.log('Fetched projects:', projects);
    return projects.project;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch projects');
  }
};

export const createCreateProjectTransaction = async (
  projectName: string,
  authorityPublicKey: PublicKey
) => {
  try {
    const { createCreateProjectTransaction: { tx: txResponse } } = await client.createCreateProjectTransaction({
      name: projectName,
      authority: authorityPublicKey.toString(),
      payer: authorityPublicKey.toString(),
    });
    return txResponse;
  } catch (error) {
    console.error('Error preparing create project transaction:', error);
    throw new Error('Failed to prepare create project transaction');
  }
};

export const createCreateNewResourceTransaction = async (
  projectPublicKey: PublicKey,
  name: string,
  symbol: string,
  decimals: number,
  uri: string,
  storageType: ResourceStorageEnum.AccountState | ResourceStorageEnum.LedgerState,
  authorityPublicKey: PublicKey
) => {
  try {
    const { createCreateNewResourceTransaction: { tx: txResponse } } = await client.createCreateNewResourceTransaction({
      project: projectPublicKey.toString(),
      params: {
        name: name,
        symbol: symbol,
        decimals: decimals,
        uri: uri,
        storage: storageType,
      },
      authority: authorityPublicKey.toString(),
      payer: authorityPublicKey.toString(),
    });
    console.log('Prepared create new resource transaction:', txResponse);
    return txResponse;
  } catch (error) {
    console.error('Error preparing create new resource transaction:', error);
    throw new Error('Failed to prepare create new resource transaction');
  }
};

export const fetchProfilesForProject = async (projectPublicKey: PublicKey) => {
  try {
    const { profile: profiles } = await client.findProfiles({
      projects: [projectPublicKey.toString()],
    });
    console.log('Fetched profiles:', profiles);
    return profiles;
  } catch (error) {
    console.error('Error fetching profiles:', error);
    throw new Error('Failed to fetch profiles');
  }
}
