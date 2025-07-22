# Components

## Component List

  * **Authentication Service (Frontend):**
      * **Responsibility:** Manages user authentication via the Solana Wallet Adapter. It will handle the wallet connection flow, provide the application with the user's public key, and request transaction signatures from the user's wallet.
  * **Honeycomb API Client (Backend):**
      * **Responsibility:** This module will be a thin wrapper around the `@honeycomb-protocol/edge-client`. It will initialize the client and expose its methods (e.g., `createCreateNewResourceTransaction`, `findProjects`) to the rest of the BFF. It will be responsible for handling the direct interaction with the Honeycomb Protocol.
      * **Key Interfaces:** `client.createCreateNewResourceTransaction(...)`, `client.findProjects(...)`
      * **Dependencies:** `@honeycomb-protocol/edge-client`
  * **BFF API Layer (Backend):** Implements the RESTful API for the frontend using Hono.
  * **Project Management UI (Frontend):** The main dashboard "hub" components.
  * **Asset Management UI (Frontend):** The components for the individual management "spokes" (Resources, Characters, etc.).
