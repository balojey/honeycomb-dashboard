# Core Workflows

## Create New Resource Workflow

```mermaid
sequenceDiagram
    participant User
    participant Frontend as React Frontend
    participant BFF as Hono BFF
    participant HPL_API as Honeycomb API

    User->>Frontend: Fills and submits "Create Resource" form
    Frontend->>BFF: POST /api/projects/{id}/resources
    BFF->>HPL_API: createCreateNewResourceTransaction(...)
    HPL_API-->>BFF: Returns serialized transaction
    BFF-->>Frontend: Returns { transaction: "..." }
    
    User->>Frontend: Signs transaction via Wallet
    Frontend->>HPL_API: Submits signed transaction
    HPL_API-->>Frontend: Confirmation
    
    alt If Resource is LedgerState
        User->>Frontend: Clicks "Create Resource Tree"
        Frontend->>BFF: POST /api/projects/{id}/resources/{id}/tree
        BFF->>HPL_API: createCreateNewResourceTreeTransaction(...)
        HPL_API-->>BFF: Returns serialized transaction
        BFF-->>Frontend: Returns { transaction: "..." }
        User->>Frontend: Signs transaction via Wallet
        Frontend->>HPL_API: Submits signed transaction
        HPL_API-->>Frontend: Confirmation
    end
```
