# Backend Architecture

  * **Approach:** A lightweight, containerized Hono BFF running on Bun.
  * **Routing:** File-based routing (e.g., `src/routes/projects.ts`).
  * **Data Access:** All data access is handled by the `Honeycomb API Client` service.
  * **Authentication:** A simple middleware will handle credentials passed from the frontend.
