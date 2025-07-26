import createEdgeClient from '@honeycomb-protocol/edge-client';
import type { Context } from 'hono';

const API_URL = "https://edge.test.honeycombprotocol.com/";
const client = createEdgeClient(API_URL, true);

// POST /api/projects/:projectId/character-models
export const createCharacterModel = async (c: Context) => {
  try {
    const { projectId } = c.req.param();
    const { config } = await c.req.json();
    
    // Validate required fields
    if (!config) {
      return c.json({ 
        message: 'Missing required field: config is required' 
      }, 400);
    }
    
    // Validate config has a kind
    if (!config.kind) {
      return c.json({ 
        message: 'config.kind is required (Wrapped or Assembled)' 
      }, 400);
    }
    
    // Validate based on kind
    if (config.kind === 'Wrapped') {
      // Validate wrapped config
      if (!config.criterias) {
        return c.json({ 
          message: 'Wrapped config must include criterias array' 
        }, 400);
      }
      
      if (!Array.isArray(config.criterias)) {
        return c.json({ 
          message: 'criterias must be an array' 
        }, 400);
      }
      
      // Validate each criteria
      for (let i = 0; i < config.criterias.length; i++) {
        const criteria = config.criterias[i];
        
        if (!criteria.kind) {
          return c.json({ 
            message: `Criteria at index ${i} is missing required field: kind` 
          }, 400);
        }
        
        if (!['MerkleTree', 'Collection', 'Creator'].includes(criteria.kind)) {
          return c.json({ 
            message: `Criteria at index ${i} has invalid kind. Must be MerkleTree, Collection, or Creator` 
          }, 400);
        }
        
        if (!criteria.params) {
          return c.json({ 
            message: `Criteria at index ${i} is missing required field: params` 
          }, 400);
        }
      }
    } else if (config.kind === 'Assembled') {
      // Validate assembled config
      if (!config.assemblerConfigInput) {
        return c.json({ 
          message: 'Assembled config must include assemblerConfigInput' 
        }, 400);
      }
      
      const { assemblerConfigInput } = config;
      
      // Validate required fields in assemblerConfigInput
      if (!assemblerConfigInput.assemblerConfig) {
        return c.json({ 
          message: 'assemblerConfigInput.assemblerConfig is required' 
        }, 400);
      }
      
      if (!assemblerConfigInput.collectionName) {
        return c.json({ 
          message: 'assemblerConfigInput.collectionName is required' 
        }, 400);
      }
      
      if (!assemblerConfigInput.name) {
        return c.json({ 
          message: 'assemblerConfigInput.name is required' 
        }, 400);
      }
      
      if (!assemblerConfigInput.symbol) {
        return c.json({ 
          message: 'assemblerConfigInput.symbol is required' 
        }, 400);
      }
      
      if (assemblerConfigInput.sellerFeeBasisPoints === undefined) {
        return c.json({ 
          message: 'assemblerConfigInput.sellerFeeBasisPoints is required' 
        }, 400);
      }
      
      if (typeof assemblerConfigInput.sellerFeeBasisPoints !== 'number' || 
          assemblerConfigInput.sellerFeeBasisPoints < 0 || 
          assemblerConfigInput.sellerFeeBasisPoints > 10000) {
        return c.json({ 
          message: 'assemblerConfigInput.sellerFeeBasisPoints must be a number between 0 and 10000' 
        }, 400);
      }
      
      if (!assemblerConfigInput.creators) {
        return c.json({ 
          message: 'assemblerConfigInput.creators is required' 
        }, 400);
      }
      
      if (!Array.isArray(assemblerConfigInput.creators)) {
        return c.json({ 
          message: 'assemblerConfigInput.creators must be an array' 
        }, 400);
      }
      
      // Validate creators
      let totalShare = 0;
      for (let i = 0; i < assemblerConfigInput.creators.length; i++) {
        const creator = assemblerConfigInput.creators[i];
        
        if (!creator.address) {
          return c.json({ 
            message: `Creator at index ${i} is missing required field: address` 
          }, 400);
        }
        
        if (creator.share === undefined) {
          return c.json({ 
            message: `Creator at index ${i} is missing required field: share` 
          }, 400);
        }
        
        if (typeof creator.share !== 'number' || creator.share <= 0) {
          return c.json({ 
            message: `Creator at index ${i} share must be a positive number` 
          }, 400);
        }
        
        totalShare += creator.share;
      }
      
      if (totalShare !== 100) {
        return c.json({ 
          message: 'Total creator shares must equal 100' 
        }, 400);
      }
    } else {
      return c.json({ 
        message: 'config.kind must be either "Wrapped" or "Assembled"' 
      }, 400);
    }
    
    // Create the transaction using the Honeycomb API client
    // Note: This assumes you have middleware that adds the wallet public key to the context
    const { createCreateCharacterModelTransaction: 
      { tx: transaction }
     } = await client.createCreateCharacterModelTransaction({
      project: projectId || "",
      authority: c.get('walletPublicKey'), // Assuming this is added by middleware
      config,
      // Optional fields can be added here if provided in the request
    });
    
    // Return the serialized transaction to the frontend
    return c.json({ transaction: transaction });
  } catch (error) {
    console.error('Error creating character model transaction:', error);
    return c.json({ 
      message: 'Failed to create character model transaction',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
};

// POST /api/projects/:projectId/character-models/:modelId/tree
export const createCharacterTree = async (c: Context) => {
  try {
    const { projectId, modelId } = c.req.param();
    const { treeConfig, authority, payer, lutAddresses, computeUnitPrice } = await c.req.json();
    
    // Validate required fields
    if (!projectId) {
      return c.json({ message: 'projectId is required' }, 400);
    }
    
    if (!modelId) {
      return c.json({ message: 'modelId is required' }, 400);
    }
    
    if (!authority) {
      return c.json({ message: 'authority is required' }, 400);
    }
    
    if (!treeConfig) {
      return c.json({ message: 'treeConfig is required' }, 400);
    }
    
    // Validate treeConfig has either basic or advanced configuration
    if (!treeConfig.basic && !treeConfig.advanced) {
      return c.json({ 
        message: 'treeConfig must include either basic or advanced configuration' 
      }, 400);
    }
    
    if (treeConfig.basic && treeConfig.advanced) {
      return c.json({ 
        message: 'treeConfig cannot include both basic and advanced configurations' 
      }, 400);
    }
    
    // Validate basic config if provided
    if (treeConfig.basic) {
      if (!treeConfig.basic.numAssets || treeConfig.basic.numAssets <= 0) {
        return c.json({ 
          message: 'basic.numAssets must be a positive number' 
        }, 400);
      }
    }
    
    // Validate advanced config if provided
    if (treeConfig.advanced) {
      const { maxDepth, maxBufferSize, canopyDepth } = treeConfig.advanced;
      
      if (!maxDepth || maxDepth <= 0) {
        return c.json({ 
          message: 'advanced.maxDepth must be a positive number' 
        }, 400);
      }
      
      if (!maxBufferSize || maxBufferSize <= 0) {
        return c.json({ 
          message: 'advanced.maxBufferSize must be a positive number' 
        }, 400);
      }
      
      if (canopyDepth === undefined || canopyDepth < 0) {
        return c.json({ 
          message: 'advanced.canopyDepth must be a non-negative number' 
        }, 400);
      }
    }
    
    // Create the transaction using the Honeycomb API client
    const { createCreateCharactersTreeTransaction: 
      { tx: transaction, treeAddress }
     } = await client.createCreateCharactersTreeTransaction({
      project: projectId,
      characterModel: modelId,
      authority,
      treeConfig,
      payer: payer || authority, // Default to authority if not provided
      lutAddresses,
      computeUnitPrice
    });
    
    // Return the serialized transaction and tree address to the frontend
    return c.json({ 
      transaction: transaction,
      treeAddress: treeAddress
    });
  } catch (error) {
    console.error('Error creating character tree transaction:', error);
    return c.json({ 
      message: 'Failed to create character tree transaction',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
};