# Epic 1: Foundation & Project Management

**Epic Goal**: This epic establishes the complete technical foundation for the dashboard. It ensures the project is properly scaffolded, enables user authentication via **wallet connection**, and delivers the first piece of core functionality: the ability to see a list of their existing Honeycomb projects.

## Story 1.1: Project Scaffolding
**As a** developer, **I want** the initial monorepo structure with frontend and backend applications set up, **so that** I have a clean, organized foundation to start building features on.

**Acceptance Criteria:**
1.  A monorepo using Bun Workspaces is created.
2.  A new React + Vite application is scaffolded in the `app/client` directory.
3.  A new Hono application is scaffolded in the `app/server` directory.
4.  Shared TypeScript configuration is set up for the workspace.
5.  The developer can run both the frontend and backend applications with a single command from the root.

---
## Story 1.2 (Updated): Implement Social Login
**As a** user, **I want** to see a "Connect Wallet" button and a wallet connection modal, **so that** I can authenticate with the application.

**Acceptance Criteria:**
1.  The main page displays a "Connect Wallet" button when no wallet is connected.
2.  Clicking the button opens a Solana wallet adapter modal listing compatible wallets.
3.  Selecting a wallet and approving the connection successfully connects the wallet to the application.
4.  Once connected, the button's text changes to show the user's truncated wallet address.
5.  The application stores the connected wallet state for use in subsequent API calls.

---
## Story 1.3: Display Project List
**As a** user, **I want** to see a list of all my Honeycomb projects after I connect my wallet, **so that** I can get an immediate overview of my assets.

**Acceptance Criteria:**
1.  Upon successful wallet connection, the application makes a GraphQL query to the Honeycomb API's `project` endpoint, using the **public key from the connected wallet** as the `authority`.
2.  If the API call is successful, the dashboard displays a list of projects, showing at least the project name.
3.  If the user has no projects, a message is displayed indicating "No projects found."
4.  If the API call fails, a user-friendly error message is displayed.
