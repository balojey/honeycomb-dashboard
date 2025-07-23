import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { ApiResponse } from 'shared/dist'
import { fetchProjects, createCreateProjectTransaction, fetchProfilesForProject, createCreateNewResourceTransaction } from './honeycomb-client'
import { PublicKey } from '@solana/web3.js'
import type { CreateResourceRequest, CreateResourceResponse } from 'shared/dist'

const app = new Hono()

app.use(cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/hello', async (c) => {

  const data: ApiResponse = {
    message: "Hello BHVR!",
    success: true
  }

  return c.json(data, { status: 200 })
})

app.get('/api/projects', async (c) => {
  const authority = c.req.query('authority')
  if (!authority) {
    return c.json({ error: 'Authority is required' }, 400)
  }

  try {
    const authorityPublicKey = new PublicKey(authority)
    const projects = await fetchProjects(authorityPublicKey)
    return c.json(projects)
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500)
    }
    return c.json({ error: 'An unknown error occurred' }, 500)
  }
})

app.post('/api/projects', async (c) => {
  try {
    const { name, authority } = await c.req.json();

    if (!name || !authority) {
      return c.json({ error: 'Project name and authority are required' }, 400);
    }

    const authorityPublicKey = new PublicKey(authority);
    const txResponse = await createCreateProjectTransaction(name, authorityPublicKey);

    return c.json({ tx: txResponse });
  } catch (error) {
    console.error('Error in POST /api/projects:', error);
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: 'An unknown error occurred' }, 500);
  }
});

app.post('/api/projects/:projectId/resources', async (c) => {
  try {
    const projectId = c.req.param('projectId');
    const { name, symbol, decimals, uri, storageType } = await c.req.json() as CreateResourceRequest;
    const { authority } = await c.req.json();
    console.log('Received request to create resource for project:', projectId, 'with authority:', authority);

    if (!projectId || !name || !symbol || decimals === undefined || !uri || !storageType || !authority) {
      return c.json({ error: 'Missing required fields for resource creation' }, 400);
    }

    const projectPublicKey = new PublicKey(projectId);
    const authorityPublicKey = new PublicKey(authority);
    const txResponse = await createCreateNewResourceTransaction(
      projectPublicKey,
      name,
      symbol,
      decimals,
      uri,
      storageType,
      authorityPublicKey
    );

    const response: CreateResourceResponse = { tx: txResponse };
    return c.json(response);
  } catch (error) {
    console.error('Error in POST /api/projects/:projectId/resources:', error);
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: 'An unknown error occurred' }, 500);
  }
});

app.get('/api/projects/:projectAddress/profiles', async (c) => {
  const projectAddress = c.req.param('projectAddress')
  if (!projectAddress) {
    return c.json({ error: 'Project address is required' }, 400)
  }

  try {
    const projectPublicKey = new PublicKey(projectAddress)
    const profiles = await fetchProfilesForProject(projectPublicKey)
    return c.json(profiles)
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500)
    }
    return c.json({ error: 'An unknown error occurred' }, 500)
  }
})

export default app
