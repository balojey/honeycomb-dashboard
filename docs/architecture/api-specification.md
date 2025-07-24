# API Specification

## REST API Specification

This OpenAPI 3.0 spec outlines the RESTful API that the Hono BFF will expose to the React frontend.

```yaml
openapi: 3.0.0
info:
  title: Honeycomb Dashboard BFF API
  version: 1.0.0
servers:
  - url: /api
paths:
  /projects:
    get:
      summary: Get Projects for User
  /projects/{projectId}/profiles:
    get:
      summary: Get Profiles for a Project
  /projects/{projectId}/resources:
    post:
      summary: Create a New Resource
  /projects/{projectId}/resources/{resourceId}/tree:
    post:
      summary: Create a Resource Tree for a LedgerState Resource
  /projects/{projectId}/resources/{resourceId}/mint:
    post:
      summary: Mint a Resource
  /projects/{projectId}/assembler-configs:
    post:
      summary: Create a New Assembler Config
  /projects/{projectId}/assembler-configs/{configId}/traits:
    post:
      summary: Add Traits to an Assembler Config
  /projects/{projectId}/character-models:
    get:
      summary: Get Character Models
    post:
      summary: Create a New Character Model
  /projects/{projectId}/character-models/{modelId}/tree:
    post:
      summary: Create a Character Tree for a Character Model
```
