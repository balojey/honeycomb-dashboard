# Core Workflows

## Create New Resource Workflow

```mermaid
sequenceDiagram
    participant User
    participant Frontend as React Frontend
    participant BFF as Hono BFF
    participant JS_Client as Honeycomb JS Client
    participant HPL_API as Honeycomb API

    User->>Frontend: Fills and submits "Create Resource" form
    Frontend->>BFF: POST /api/projects/{id}/resources
    BFF->>JS_Client: client.createCreateNewResourceTransaction(...)
    JS_Client->>HPL_API: (Handles GraphQL Mutation)
    HPL_API-->>JS_Client: Returns serialized transaction
    JS_Client-->>BFF: Returns transaction object
    BFF-->>Frontend: Returns { transaction: "..." }
    
    %% Signing flow remains the same %%
    Frontend->>Wallet: requestSignature(transaction)
    Wallet-->>User: Prompts user to approve
    User->>Wallet: Approves transaction
    Wallet-->>Frontend: Returns signed transaction
    Frontend->>JS_Client: client.sendTransaction(...)
    JS_Client->>HPL_API: (Handles Transaction Submission)
    HPL_API-->>JS_Client: Returns confirmation
    JS_Client-->>Frontend: Returns confirmation
    Frontend-->>User: Displays success message
```
