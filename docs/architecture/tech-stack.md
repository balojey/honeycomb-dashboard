# Tech Stack

## Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Language** | TypeScript | `~5.5` | Statically typed language for frontend code. | Provides type safety and better developer experience. |
| **Frontend Framework** | React | `~18.3` | UI library for building the user interface. | Chosen as part of the core BHVR stack. |
| **UI Component Library** | Shadcn/ui + Tailwind CSS | `~0.8` | UI components and styling. | A modern, accessible, and highly customizable component library. |
| **State Management** | Zustand | `~4.5` | Lightweight global state management. | Simple, unopinionated, and avoids boilerplate. |
| **Backend Language** | TypeScript | `~5.5` | Statically typed language for backend code. | Ensures type consistency across the full stack. |
| **Backend Framework** | Hono | `~4.4` | Fast, lightweight web framework for the BFF. | Chosen as part of the core BHVR stack. |
| **API Style** | GraphQL Client | `~17.0` | Query language for the client to interact with HPL API. | The Honeycomb Protocol API is GraphQL-based. |
| **Authentication** | Solana Wallet Adapter| `~1.2` | Solana wallet connection and transaction signing. | Standard library for integrating wallets into a React app. |
| **Frontend Testing**| Vitest + RTL | `~1.6` | Unit and component testing for the frontend. | Natively integrates with Vite for a fast testing experience. |
| **Backend Testing** | Vitest | `~1.6` | Unit and integration testing for the backend. | Bun has native support for Vitest. |
| **E2E Testing** | Playwright | `~1.45`| End-to-end testing for the entire application. | A modern and reliable tool for cross-browser E2E testing. |
| **Runtime / Build Tool** | Bun + Vite | `~1.1` / `~5.2` | Core runtime, package manager, and build tool. | Chosen as part of the core BHVR stack. |
| **IaC Tool** | Docker | `~27.0` | Containerization for consistent deployments. | Provides a portable and standard way to deploy our services. |
| **CI/CD** | GitHub Actions | `N/A` | Automated build, test, and deployment pipelines. | Tightly integrated with GitHub. |
