# Requirements

## Functional
1.  **FR1 (Updated)**: A user must be able to sign up or log in using their social account (e.g., Google), which will create and manage an underlying Solana wallet for them via an account abstraction service.
2.  **FR2**: An authenticated user must be able to create a new Honeycomb Project and view a list of projects associated with their wallet's public key.
3.  **FR3**: A user must be able to view a list of all users and their associated profiles within one of their projects.
4.  **FR4**: A user must be able to create new resources (both fungible and non-fungible) for a project and mint those resources to a specified user wallet.
5.  **FR5**: A user must be able to create new character models for a project, defining them as either "Wrapped" from existing NFTs or "Assembled" as native characters.

## Non-Functional
1.  **NFR1**: The user interface must be intuitive and responsive, providing a seamless experience on modern desktop browsers.
2.  **NFR2 (Updated)**: The application must securely manage the embedded wallet solution, ensuring the user has a seamless and safe transaction signing experience.
3.  **NFR3**: The dashboard must load in under 3 seconds, and user actions should provide immediate visual feedback.
4.  **NFR4**: The application must be compatible with the latest versions of Chrome, Firefox, and Safari.
