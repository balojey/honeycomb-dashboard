import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { ApiResponse } from 'shared/dist'
import { fetchProjects, createCreateProjectTransaction } from './honeycomb-client'
import { PublicKey } from '@solana/web3.js'

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

export default app
