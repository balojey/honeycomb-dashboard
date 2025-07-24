# Epic 3: Core Asset Management

**Epic Goal**: This epic transforms the dashboard from a read-only tool into an active management platform. It will implement the primary "write" functionalities, allowing developers to create and manage the fundamental building blocks of their game economies: Resources and Characters. Completing this epic provides the highest value to the end-user, enabling them to define, create, and distribute on-chain assets directly from the UI.

## Story 3.1: Create New Resource

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

## Story 3.1.1: Create Resource Tree

**As a** developer, **I want** to create a resource tree for my `LedgerState` resource, **so that** I can store its ownership and usage information on-chain.

**Acceptance Criteria:**

1.  After successfully creating a `LedgerState` resource, the UI presents an option to "Create Resource Tree".
2.  Clicking the button initiates the `createCreateNewResourceTreeTransaction` process via the BFF.
3.  The user is prompted by their connected wallet to sign and approve the transaction.
4.  Upon successful confirmation, the user sees a success message.
5.  Resources of type `AccountState` should not present this option.

-----

## Story 3.2: Mint Resource

**As a** developer, **I want** to mint a specific amount of a created resource to a user's wallet, **so that** I can distribute assets or rewards to my players.

**Acceptance Criteria:**

1.  Each resource in the project's resource list has a "Mint" action/button.
2.  Clicking "Mint" opens a modal prompting for an `amount` and a recipient `owner` wallet address.
3.  The form validates that the amount is a valid number and the owner is a valid Solana public key.
4.  Submitting the form uses the `createMintResourceTransaction` GraphQL mutation.
5.  The user is prompted to sign the transaction.
6.  Upon successful transaction, a confirmation message is displayed.

-----

## Story 3.3: Create Assembler Config

**As a** developer, **I want** to create an assembler configuration for my project, **so that** I can define the traits and layers for my "Assembled" characters.

**Acceptance Criteria:**

1.  A form allows me to create an Assembler Config with a `ticker` ID and define the layer `order`.
2.  The creation process also requires a `treeConfig` to store the character traits.
3.  Submitting the form uses the `createCreateAssemblerConfigTransaction` mutation.
4.  The user signs the transaction and receives feedback on success or failure.

-----

## Story 3.4: Add Traits to Assembler Config

**As a** developer, **I want** to add specific traits (e.g., "Sword", "Helmet") to my assembler configuration, **so that** I have a palette of components to build my characters from.

**Acceptance Criteria:**

1.  The UI allows me to select an existing Assembler Config.
2.  I can add one or more traits, providing a `label` (e.g., "Weapon"), `name` (e.g., "Sword"), and image `uri` for each.
3.  Submitting the form uses the `createAddCharacterTraitsTransactions` mutation.
4.  The user signs the transaction and receives feedback.

-----

## Story 3.5: Create Character Model

**As a** developer, **I want** a form to define a new character model, **so that** I can set up the templates for in-game characters or NFTs.

**Acceptance Criteria:**

1.  On the project detail page, there is a "Create Character Model" button.
2.  The form allows the user to select a configuration `kind`: "Wrapped" or "Assembled".
3.  If "Wrapped" is selected, the form provides fields to define the `criterias` for wrapping (e.g., by Merkle Tree, Collection, or Creator).
4.  If "Assembled" is selected, the form provides fields to input the `assemblerConfigInput`, referencing an existing Assembler Config.
5.  Submitting the form uses the `createCreateCharacterModelTransaction` GraphQL mutation with the correct payload.
6.  The user is prompted to sign the transaction, and appropriate success/error feedback is provided.

-----

## Story 3.6: Create Character Tree

**As a** developer, **I want** to create a character tree for my character model, **so that** I have a dedicated on-chain store for all characters minted from that model.

**Acceptance Criteria:**

1.  After a `CharacterModel` is successfully created, the UI presents an option to "Create Character Tree".
2.  Clicking the button initiates the `createCreateCharactersTreeTransaction` process.
3.  The user signs the transaction and receives success or failure feedback.

-----

## Story 3.7: Display Character Models

**As a** developer, **I want** to see a list of the character models I've created for a project, **so that** I can track and manage my game's character templates.

**Acceptance Criteria:**

1.  The project detail page has a section for Character Models.
2.  This section makes a GraphQL query to the `characterModel` endpoint, filtered by the project address.
3.  A list or table displays the created character models, showing their address and configuration kind ("Wrapped" or "Assembled").
4.  If no models exist, a message indicating this is shown.