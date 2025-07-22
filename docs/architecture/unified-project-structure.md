# Unified Project Structure

```plaintext
honeycomb-dashboard/
├── .github/
│   └── workflows/
├── app/
│   ├── client/                 # React + Vite Frontend Application
│   │   ├── public/
│   │   └── src/
│   │       ├── components/
│   │       ├── features/
│   │       ├── services/
│   │       └── ...
│   ├── server/                 # Hono BFF Application
│   │   └── src/
│   │       ├── routes/
│   │       ├── services/
│   │       └── index.ts
│   └── shared/                 # Shared TypeScript interfaces & utilities
│       └── src/
├── infrastructure/
│   └── Dockerfile
├── package.json                # Root package.json with Bun Workspaces
└── turborepo.json
```
