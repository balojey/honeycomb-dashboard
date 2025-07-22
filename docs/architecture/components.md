# Components

## Component List

  * **Authentication Service (Frontend):**
      * **Responsibility:** Manages user authentication via the Solana Wallet Adapter. It will handle the wallet connection flow, provide the application with the user's public key, and request transaction signatures from the user's wallet.
  * **Honeycomb API Client (Backend):** Handles all communication with the Honeycomb GraphQL API.
  * **BFF API Layer (Backend):** Implements the RESTful API for the frontend using Hono.
  * **Project Management UI (Frontend):** The main dashboard "hub" components.
  * **Asset Management UI (Frontend):** The components for the individual management "spokes" (Resources, Characters, etc.).
