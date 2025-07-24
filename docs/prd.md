# Honeycomb Protocol Dashboard Product Requirements Document (PRD)

## Goals and Background Context

### Goals

  * Increase the adoption and retention of the Honeycomb Protocol.
  * Reduce the time-to-market for developers building with Honeycomb.
  * Enable developers to create a project, define a resource, and mint it in under 5 minutes.
  * Decrease the volume of API-related support questions.

### Background Context

Honeycomb Protocol provides a powerful GraphQL API to simplify Web3 game development on Solana. However, developers currently lack a graphical interface for managing their projects, requiring them to build their own admin panels or interact directly with the API. This project will create the **Honeycomb Protocol Dashboard (or Hive Control)** to provide a user-friendly, web-based GUI. This will lower the barrier to entry, streamline project management, and accelerate development for game developers using the protocol.

### Change Log

| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2025-07-24 | 1.3 | Restructured Epic 3 with correct character creation workflow. | Sarah, PO |
| 2025-07-23 | 1.2 | Added Story 3.1.1 to handle LedgerState resource tree creation. | Sarah, PO |
| 2025-07-22 | 1.1 | Updated auth to social login per user feedback. | John, PM |
| 2025-07-21 | 1.0 | Initial PRD draft | John, PM |

## Requirements

### Functional

1.  **FR1 (Reverted)**: A user must be able to connect their Solana wallet to authenticate and log into the dashboard.
2.  **FR2**: An authenticated user must be able to create a new Honeycomb Project and view a list of projects associated with their wallet's public key.
3.  **FR3**: A user must be able to view a list of all users and their associated profiles within one of their projects.
4.  **FR4**: A user must be able to create new resources (both fungible and non-fungible) for a project and mint those resources to a specified user wallet.
5.  **FR5**: A user must be able to create new character models for a project, defining them as either "Wrapped" from existing NFTs or "Assembled" as native characters.

### Non-Functional

1.  **NFR1**: The user interface must be intuitive and responsive, providing a seamless experience on modern desktop browsers.
2.  **NFR2 (Reverted)**: All interactions with the Honeycomb API and the signing of transactions must be secure, ensuring user keys are never compromised during the wallet connection and transaction approval process.
3.  **NFR3**: The dashboard must load in under 3 seconds, and user actions should provide immediate visual feedback.
4.  **NFR4**: The application must be compatible with the latest versions of Chrome, Firefox, and Safari.

## User Interface Design Goals

### Overall UX Vision

The dashboard's user experience should prioritize **clarity, efficiency, and utility**. It is a professional tool for developers, so the design should be clean, data-dense, and predictable. The primary goal is to empower users to manage their projects quickly and confidently with minimal friction.

### Key Interaction Paradigms

The interface will follow established dashboard conventions:

  * A persistent left-hand navigation menu for major sections.
  * A main content area for displaying data tables, forms, and lists.
  * Modal dialogs for critical actions like creation or confirmation.
  * Clear breadcrumbs for easy navigation within nested views.

### Core Screens and Views

Conceptually, the MVP will require the following primary screens:

  * **Login/Connect Wallet Screen**: A simple page to connect a Solana wallet.
  * **Projects Dashboard**: The main landing page after login, listing all of the user's projects.
  * **Project View**: A detailed view for a single project, acting as a container for managing its users, resources, and characters.
  * **Resource Management Page**: An interface to view, create, and mint resources.
  * **Character Model Page**: An interface to view and create new character models.

### Accessibility

  * **Standard**: WCAG AA

### Branding

  * The initial design will use a clean, professional, and neutral "developer tool" aesthetic. If a specific brand guide or color palette for Honeycomb Protocol exists, it should be provided.

### Target Device and Platforms

  * Web Responsive

## Technical Assumptions

### Repository Structure

  * **Recommendation**: Monorepo
      * **Rationale**: A monorepo will simplify development by allowing the React/Vite frontend and the Hono backend to share code, especially type definitions for the Honeycomb API.

### Service Architecture

  * **Recommendation**: Monolith (specifically a Backend-for-Frontend pattern)
      * **Rationale**: The core logic resides in the Honeycomb Protocol. The Hono backend will act as a simple and highly performant BFF, perfectly suited for serving the frontend without unnecessary complexity.

### Testing Requirements

  * **Recommendation**: Unit + Integration
      * **Rationale**: This ensures individual components work as expected (unit tests) and that the dashboard correctly interacts with the live Honeycomb API (integration tests), providing a good balance of speed and confidence.

### Additional Technical Assumptions and Requests

  * The frontend will be built using **React** and the **Vite** toolchain for a fast development experience.
  * The backend API server will be built with **Hono**.
  * The entire application will use the **Bun** runtime for superior performance.
  * **User authentication will be handled by an account abstraction SDK (e.g., Crossmint), replacing the need for a traditional user-managed wallet adapter.**
  * Deployment will be to a platform that supports the Bun runtime (e.g., Docker container on AWS/GCP, Fly.io). The final choice will be determined by the Architect.

## Epic List

  * **Epic 1: Foundation & Project Management**
      * **Goal**: Establish the core application infrastructure, enable user authentication via social login, and allow users to create and view their projects.
  * **Epic 2: User and Profile Viewing**
      * **Goal**: Provide developers with the ability to view the users and their associated profiles within their projects, offering essential read-only insights.
  * **Epic 3: Core Asset Management**
      * **Goal**: Implement the primary creation functionalities of the dashboard, allowing developers to define and mint new Resources and Character Models for their games.

## Epic 1: Foundation & Project Management

**Epic Goal**: This epic establishes the complete technical foundation for the dashboard. It ensures the project is properly scaffolded, enables user authentication via **wallet connection**, and delivers the first piece of core functionality: the ability to see a list of their existing Honeycomb projects.

### Story 1.1: Project Scaffolding

**As a** developer, **I want** the initial monorepo structure with frontend and backend applications set up, **so that** I have a clean, organized foundation to start building features on.

**Acceptance Criteria:**

1.  A monorepo using Bun Workspaces is created.
2.  A new React + Vite application is scaffolded in the `app/client` directory.
3.  A new Hono application is scaffolded in the `app/server` directory.
4.  Shared TypeScript configuration is set up for the workspace.
5.  The developer can run both the frontend and backend applications with a single command from the root.

-----

### Story 1.2 (Updated): Implement Social Login

**As a** user, **I want** to see a "Connect Wallet" button and a wallet connection modal, **so that** I can authenticate with the application.

**Acceptance Criteria:**

1.  The main page displays a "Connect Wallet" button when no wallet is connected.
2.  Clicking the button opens a Solana wallet adapter modal listing compatible wallets.
3.  Selecting a wallet and approving the connection successfully connects the wallet to the application.
4.  Once connected, the button's text changes to show the user's truncated wallet address.
5.  The application stores the connected wallet state for use in subsequent API calls.

-----

### Story 1.3: Display Project List

**As a** user, **I want** to see a list of all my Honeycomb projects after I connect my wallet, **so that** I can get an immediate overview of my assets.

**Acceptance Criteria:**

1.  Upon successful wallet connection, the application makes a GraphQL query to the Honeycomb API's `project` endpoint, using the **public key from the connected wallet** as the `authority`.
2.  If the API call is successful, the dashboard displays a list of projects, showing at least the project name.
3.  If the user has no projects, a message is displayed indicating "No projects found."
4.  If the API call fails, a user-friendly error message is displayed.

-----

### **Story 1.4: Create New Project**

**As a** user, **I want** a "Create Project" button and a form to provide a project name, **so that** I can initialize a new project on the Honeycomb Protocol.

**Acceptance Criteria:**

1.  The Projects Dashboard displays a "Create New Project" button.
2.  Clicking the button opens a form or modal prompting for a "Project Name".
3.  The form includes client-side validation for the name field.
4.  Submitting the form initiates the `createCreateProjectTransaction` process via the BFF.
5.  The user is prompted by their connected wallet to sign and approve the creation transaction.
6.  Upon successful confirmation, the project list is refreshed to show the newly created project.
7.  If the transaction fails, a user-friendly error message is displayed.

## Epic 2: User and Profile Viewing

**Epic Goal**: This epic builds on the foundation of Epic 1 by allowing a developer to select one of their projects and view the associated users and profiles. This provides crucial, read-only insights for community management, user support, and understanding player data. It transforms the dashboard from a simple project lister into a valuable monitoring tool.

### Story 2.1: Project Navigation

**As a** user, **I want** to click on a project from my project list and be taken to a dedicated project detail page, **so that** I can access management features for that specific project.

**Acceptance Criteria:**

1.  Each project in the list (from Story 1.3) is a clickable link.
2.  Clicking a project link navigates the user to a new view/page (e.g., `/project/{projectAddress}`).
3.  The new page clearly displays the name of the selected project as a title.
4.  The page contains a designated area for displaying the list of users and profiles.

-----

### Story 2.2: Display User and Profile List

**As a** user, **I want** to see a list of all users and their profiles for the selected project, **so that** I can see who is playing my game.

**Acceptance Criteria:**

1.  When the project detail page loads, a GraphQL query is made to the Honeycomb API's `profile` endpoint, filtering by the `project` address from the URL.
2.  The returned data is displayed in a table or list format.
3.  The table displays key profile information, such as User ID, a truncated Profile Address, and any available `info` (name, pfp).
4.  If a project has no user profiles, a message like "No profiles found for this project" is displayed.
5.  If the API call fails, a user-friendly error message is shown.

## Epic 3: Core Asset Management

**Epic Goal**: This epic transforms the dashboard from a read-only tool into an active management platform. It will implement the primary "write" functionalities, allowing developers to create and manage the fundamental building blocks of their game economies: Resources and Characters. Completing this epic provides the highest value to the end-user, enabling them to define, create, and distribute on-chain assets directly from the UI.

### Story 3.1: Create New Resource

**As a** developer, **I want** a form to define and create a new game resource, **so that** I can establish the basic assets for my game's economy.

**Acceptance Criteria:**

1.  On the project detail page, there is a "Create Resource" button.
2.  Clicking the button opens a form or modal with fields for Name, Symbol, Decimals, URI, and Storage type (`AccountState` or `LedgerState`).
3.  The form includes client-side validation for all required fields.
4.  Submitting the form constructs the correct payload for the `createCreateNewResourceTransaction` GraphQL mutation.
5.  The user is prompted to sign the transaction with their connected wallet.
6.  Upon successful transaction, the user sees a confirmation message, and the new resource appears in a list of project resources.
7.  If the transaction fails, a user-friendly error message is displayed.

-----

### Story 3.1.1: Create Resource Tree

**As a** developer, **I want** to create a resource tree for my `LedgerState` resource, **so that** I can store its ownership and usage information on-chain.

**Acceptance Criteria:**

1.  After successfully creating a `LedgerState` resource, the UI presents an option to "Create Resource Tree".
2.  Clicking the button initiates the `createCreateNewResourceTreeTransaction` process via the BFF.
3.  The user is prompted by their connected wallet to sign and approve the transaction.
4.  Upon successful confirmation, the user sees a success message.
5.  Resources of type `AccountState` should not present this option.

-----

### Story 3.2: Mint Resource

**As a** developer, **I want** to mint a specific amount of a created resource to a user's wallet, **so that** I can distribute assets or rewards to my players.

**Acceptance Criteria:**

1.  Each resource in the project's resource list has a "Mint" action/button.
2.  Clicking "Mint" opens a modal prompting for an `amount` and a recipient `owner` wallet address.
3.  The form validates that the amount is a valid number and the owner is a valid Solana public key.
4.  Submitting the form uses the `createMintResourceTransaction` GraphQL mutation.
5.  The user is prompted to sign the transaction.
6.  Upon successful transaction, a confirmation message is displayed.

-----

### Story 3.3: Create Assembler Config

**As a** developer, **I want** to create an assembler configuration for my project, **so that** I can define the traits and layers for my "Assembled" characters.

**Acceptance Criteria:**

1.  A form allows me to create an Assembler Config with a `ticker` ID and define the layer `order`.
2.  The creation process also requires a `treeConfig` to store the character traits.
3.  Submitting the form uses the `createCreateAssemblerConfigTransaction` mutation.
4.  The user signs the transaction and receives feedback on success or failure.

-----

### Story 3.4: Add Traits to Assembler Config

**As a** developer, **I want** to add specific traits (e.g., "Sword", "Helmet") to my assembler configuration, **so that** I have a palette of components to build my characters from.

**Acceptance Criteria:**

1.  The UI allows me to select an existing Assembler Config.
2.  I can add one or more traits, providing a `label` (e.g., "Weapon"), `name` (e.g., "Sword"), and image `uri` for each.
3.  Submitting the form uses the `createAddCharacterTraitsTransactions` mutation.
4.  The user signs the transaction and receives feedback.

-----

### Story 3.5: Create Character Model

**As a** developer, **I want** a form to define a new character model, **so that** I can set up the templates for in-game characters or NFTs.

**Acceptance Criteria:**

1.  On the project detail page, there is a "Create Character Model" button.
2.  The form allows the user to select a configuration `kind`: "Wrapped" or "Assembled".
3.  If "Wrapped" is selected, the form provides fields to define the `criterias` for wrapping (e.g., by Merkle Tree, Collection, or Creator).
4.  If "Assembled" is selected, the form provides fields to input the `assemblerConfigInput`, referencing an existing Assembler Config.
5.  Submitting the form uses the `createCreateCharacterModelTransaction` GraphQL mutation with the correct payload.
6.  The user is prompted to sign the transaction, and appropriate success/error feedback is provided.

-----

### Story 3.6: Create Character Tree

**As a** developer, **I want** to create a character tree for my character model, **so that** I have a dedicated on-chain store for all characters minted from that model.

**Acceptance Criteria:**

1.  After a `CharacterModel` is successfully created, the UI presents an option to "Create Character Tree".
2.  Clicking the button initiates the `createCreateCharactersTreeTransaction` process.
3.  The user signs the transaction and receives success or failure feedback.

-----

### Story 3.7: Display Character Models

**As a** developer, **I want** to see a list of the character models I've created for a project, **so that** I can track and manage my game's character templates.

**Acceptance Criteria:**

1.  The project detail page has a section for Character Models.
2.  This section makes a GraphQL query to the `characterModel` endpoint, filtered by the project address.
3.  A list or table displays the created character models, showing their address and configuration kind ("Wrapped" or "Assembled").
4.  If no models exist, a message indicating this is shown.