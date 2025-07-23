import createEdgeClient, { ResourceStorageEnum } from '@honeycomb-protocol/edge-client';
import { PublicKey } from '@solana/web3.js';

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

export const createMintResourceTransaction = async (
  resourceId: string,
  amount: number,
  owner: string,
  authority: string,
) => {
  console.log('Preparing mint resource transaction for resource:', resourceId, 'with amount:', String(amount), 'and owner:', owner);
  try {
    const { createMintResourceTransaction: txResponse } = await client.createMintResourceTransaction({
      resource: resourceId,
      amount: String(amount),
      owner: owner,
      authority: authority,
      payer: authority,
    });
    console.log('Prepared mint resource transaction:', txResponse);
    return txResponse;
  } catch (error) {
    console.error('Error preparing mint resource transaction:', error);
    throw new Error('Failed to prepare mint resource transaction');
  }
}

export const fetchResourcesForProject = async (projectPublicKey: PublicKey) => {
  try {
    const { resources: resources } = await client.findResources({
      projects: [projectPublicKey.toString()],
    });
    console.log('Fetched resources:', resources);
    return resources;
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw new Error('Failed to fetch resources');
  }
}

export const createCreateNewResourceTreeTransaction = async (
  projectId: string,
  resourceId: string,
  authority: string,
) => {
  try {
    const { createCreateNewResourceTreeTransaction: { tx: txResponse } } = await client.createCreateNewResourceTreeTransaction({
      project: projectId,
      resource: resourceId,
      treeConfig: {
        basic: {
          numAssets: 10000
        }
      },
      authority: authority,
      payer: authority,
    });
    console.log('Prepared create new resource tree transaction:', txResponse);
    return txResponse;
  } catch (error) {
    console.error('Error preparing create new resource tree transaction:', error);
    throw new Error('Failed to prepare create new resource tree transaction');
  }
}
