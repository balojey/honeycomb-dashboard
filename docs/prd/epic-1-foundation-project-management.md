# Epic 1: Foundation & Project Management

**Epic Goal**: This epic establishes the complete technical foundation for the dashboard. It ensures the project is properly scaffolded, allows a developer to connect their wallet for authentication, and delivers the first piece of core functionality: the ability to see a list of their existing Honeycomb projects. By the end of this epic, the application will be a functional, connectable, and useful tool.

## Story 1.1: Project Scaffolding
**As a** developer, **I want** the initial monorepo structure with frontend and backend applications set up, **so that** I have a clean, organized foundation to start building features on.

**Acceptance Criteria:**
1.  A monorepo using Bun Workspaces is created.
2.  A new React + Vite application is scaffolded in the `apps/web` directory.
3.  A new Hono application is scaffolded in the `apps/api` directory.
4.  Shared TypeScript configuration is set up for the workspace.
5.  The developer can run both the frontend and backend applications with a single command from the root.

---
## Story 1.2 (Updated): Implement Social Login
**As a** new user, **I want** to sign up or log in using my Google account, **so that** I can access the dashboard without needing a pre-existing Solana wallet.

**Acceptance Criteria:**
1.  The main page displays "Login with Google" and other social provider buttons.
2.  Clicking a social login button initiates the authentication flow with the chosen account abstraction SDK (e.g., Crossmint).
3.  After successful social authentication, the SDK creates an embedded wallet for the user.
4.  The application displays the user's email or social handle, indicating they are logged in.
5.  The application has access to the user's underlying Solana public key for making API calls.

---
## Story 1.3: Display Project List
**As a** user, **I want** to see a list of all my Honeycomb projects after I log in, **so that** I can get an immediate overview of my assets.

**Acceptance Criteria:**
1.  Upon successful login, the application makes a GraphQL query to the Honeycomb API's `project` endpoint, using the **public key from the embedded wallet** as the `authority`.
2.  If the API call is successful, the dashboard displays a list of projects, showing at least the project name.
3.  If the user has no projects, a message is displayed indicating "No projects found."
4.  If the API call fails, a user-friendly error message is displayed.
