# Technical Assumptions

## Repository Structure

  * **Recommendation**: Monorepo
      * **Rationale**: A monorepo will simplify development by allowing the React/Vite frontend and the Hono backend to share code, especially type definitions for the Honeycomb API.

## Service Architecture

  * **Recommendation**: Monolith (specifically a Backend-for-Frontend pattern)
      * **Rationale**: The core logic resides in the Honeycomb Protocol. The Hono backend will act as a simple and highly performant BFF, perfectly suited for serving the frontend without unnecessary complexity.

## Testing Requirements

  * **Recommendation**: Unit + Integration
      * **Rationale**: This ensures individual components work as expected (unit tests) and that the dashboard correctly interacts with the live Honeycomb API (integration tests), providing a good balance of speed and confidence.

## Additional Technical Assumptions and Requests

  * The frontend will be built using **React** and the **Vite** toolchain for a fast development experience.
  * The backend API server will be built with **Hono**.
  * The entire application will use the **Bun** runtime for superior performance.
  * **User authentication will be handled by an account abstraction SDK (e.g., Crossmint), replacing the need for a traditional user-managed wallet adapter.**
  * Deployment will be to a platform that supports the Bun runtime (e.g., Docker container on AWS/GCP, Fly.io). The final choice will be determined by the Architect.
