import createEdgeClient from '@honeycomb-protocol/edge-client';
import type { Context } from 'hono';

const API_URL = "https://edge.test.honeycombprotocol.com/";
const client = createEdgeClient(API_URL, true)

// POST /api/projects/:projectId/assembler-configs
export const createAssemblerConfig = async (c: Context) => {
  try {
    const { projectId } = c.req.param();
    const { ticker, order, treeConfig } = await c.req.json();
    
    // Validate required fields
    if (!ticker || !order || !treeConfig) {
      return c.json({ 
        message: 'Missing required fields: ticker, order, and treeConfig are required' 
      }, 400);
    }
    
    // Validate order is an array
    if (!Array.isArray(order)) {
      return c.json({ 
        message: 'Order must be an array of layer names' 
      }, 400);
    }
    
    // Validate treeConfig has either basic or advanced configuration
    if (!treeConfig.basic && !treeConfig.advanced) {
      return c.json({ 
        message: 'treeConfig must include either basic or advanced configuration' 
      }, 400);
    }
    
    // Validate basic config if provided
    if (treeConfig.basic) {
      if (typeof treeConfig.basic.numAssets !== 'number' || treeConfig.basic.numAssets <= 0) {
        return c.json({ 
          message: 'basic.numAssets must be a positive number' 
        }, 400);
      }
    }
    
    // Validate advanced config if provided
    if (treeConfig.advanced) {
      const { maxDepth, maxBufferSize, canopyDepth } = treeConfig.advanced;
      if (typeof maxDepth !== 'number' || maxDepth <= 0) {
        return c.json({ 
          message: 'advanced.maxDepth must be a positive number' 
        }, 400);
      }
      if (typeof maxBufferSize !== 'number' || maxBufferSize <= 0) {
        return c.json({ 
          message: 'advanced.maxBufferSize must be a positive number' 
        }, 400);
      }
      if (typeof canopyDepth !== 'number' || canopyDepth < 0) {
        return c.json({ 
          message: 'advanced.canopyDepth must be a non-negative number' 
        }, 400);
      }
    }
    
    // Create the transaction using the Honeycomb API client
    // Note: This assumes you have middleware that adds the wallet public key to the context
    const { createCreateAssemblerConfigTransaction: 
      { tx: transaction }
     } = await client.createCreateAssemblerConfigTransaction({
      project: projectId || "",
      authority: c.get('walletPublicKey'), // Assuming this is added by middleware
      treeConfig,
      ticker,
      order,
      // Optional fields can be added here if provided in the request
    });
    
    // Return the serialized transaction to the frontend
    return c.json({ transaction: transaction });
  } catch (error) {
    console.error('Error creating assembler config transaction:', error);
    return c.json({ 
      message: 'Failed to create assembler config transaction',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
};