import createEdgeClient from '@honeycomb-protocol/edge-client';
import { Keypair, PublicKey } from '@solana/web3.js';

// Initialize the Honeycomb Edge Client 
const API_URL = "https://edge.test.honeycombprotocol.com/";
const client = createEdgeClient(API_URL, true)

// This is a placeholder for the actual authority.
// In a real application, you would get this from the authenticated user.
const authority = new Keypair();

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
