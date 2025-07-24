import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { ApiResponse } from 'shared/dist'
import { fetchProjects, createCreateProjectTransaction, fetchProfilesForProject, createCreateNewResourceTransaction, createMintResourceTransaction, fetchResourcesForProject, createCreateNewResourceTreeTransaction } from './honeycomb-client'
import { PublicKey } from '@solana/web3.js'
import type { CreateResourceRequest, CreateResourceResponse } from 'shared/dist'
import { createAssemblerConfig } from './routes/assemblerConfigs'

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

app.get('/api/projects/:projectAddress/resources', async (c) => {
  const projectAddress = c.req.param('projectAddress')
  if (!projectAddress) {
    return c.json({ error: 'Project address is required' }, 400)
  }

  try {
    const projectPublicKey = new PublicKey(projectAddress)
    const resources = await fetchResourcesForProject(projectPublicKey)
    return c.json(resources)
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500)
    }
    return c.json({ error: 'An unknown error occurred' }, 500)
  }
})

app.post('/api/projects/:projectId/resources/:resourceId/mint', async (c) => {
  try {
    const resourceId = c.req.param('resourceId');
    const { amount, owner, authority } = await c.req.json();

    if (!resourceId || !amount || !owner || !authority) {
      return c.json({ error: 'Missing required fields for minting' }, 400);
    }
    console.log('Received request to mint resource:', { resourceId, amount, owner, authority });

    const txResponse = await createMintResourceTransaction(
      resourceId,
      amount,
      owner,
      authority
    );

    return c.json({ tx: txResponse });
  } catch (error) {
    console.error('Error in POST /api/projects/:projectId/resources/:resourceId/mint:', error);
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: 'An unknown error occurred' }, 500);
  }
});

app.post('/api/projects/:projectId/resources/:resourceId/tree', async (c) => {
  try {
    const projectId = c.req.param('projectId');
    const resourceId = c.req.param('resourceId');
    const { authority } = await c.req.json();

    if (!projectId || !resourceId || !authority) {
      return c.json({ error: 'Missing required fields for resource tree creation' }, 400);
    }

    const txResponse = await createCreateNewResourceTreeTransaction(
      projectId,
      resourceId,
      authority
    );

    return c.json({ tx: txResponse });
  } catch (error) {
    console.error('Error in POST /api/projects/:projectId/resources/:resourceId/tree:', error);
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: 'An unknown error occurred' }, 500);
  }
});

// Route for creating assembler configs
app.post('/api/projects/:projectId/assembler-configs', createAssemblerConfig);

export default app
