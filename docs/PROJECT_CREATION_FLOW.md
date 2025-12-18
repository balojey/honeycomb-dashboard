# Honeycomb Protocol Project Creation Flow

This document describes the implementation of the project creation flow for Honeycomb Protocol.

## Overview

The project creation flow allows users to create new Honeycomb Protocol projects with custom configurations including achievements and custom data fields. The flow consists of:

1. **Frontend Form** - User inputs project details
2. **Server-side Transaction Creation** - API route creates the transaction using Honeycomb client
3. **Transaction Signing** - User signs the transaction with their wallet
4. **Database Storage** - Project details are stored in Supabase

## Architecture

### Database Schema

#### `projects` Table
- `id` (uuid) - Primary key
- `name` (text) - Project name
- `project_address` (text) - Unique Honeycomb project address
- `wallet_address_id` (uuid) - Foreign key to wallet_addresses table
- `authority_public_key` (text) - Authority public key for the project
- `achievements` (text[]) - Array of achievement names
- `custom_data_fields` (text[]) - Array of custom data field names
- `created_at` (timestamptz) - Creation timestamp
- `updated_at` (timestamptz) - Last update timestamp

### API Routes

#### POST `/api/projects/create`
Creates a Honeycomb project transaction.

**Request Body:**
```json
{
  "name": "Project Name",
  "authorityPublicKey": "...",
  "payerPublicKey": "...", // Optional
  "achievements": ["Achievement 1", "Achievement 2"],
  "customDataFields": ["Field 1", "Field 2"],
  "walletAddress": "..."
}
```

**Response:**
```json
{
  "success": true,
  "projectAddress": "...",
  "txResponse": {...},
  "projectData": {...}
}
```

#### POST `/api/projects/store`
Stores the project in the database after successful transaction signing.

**Request Body:**
```json
{
  "projectAddress": "...",
  "name": "Project Name",
  "authorityPublicKey": "...",
  "achievements": [...],
  "customDataFields": [...],
  "walletAddress": "...",
  "transactionSignature": "..."
}
```

**Response:**
```json
{
  "success": true,
  "project": {...},
  "message": "Project created and stored successfully"
}
```

### Components

#### `ProjectCreationForm`
- Dynamic form for project creation
- Supports adding/removing achievements and custom data fields
- Handles transaction creation and signing flow
- Stores project after successful transaction

#### `ProjectsList`
- Displays all projects for the connected wallet
- Shows project details including achievements and custom fields
- Auto-refreshes when wallet changes

#### `ProjectDashboard`
- Main dashboard component with tabs
- Combines ProjectCreationForm and ProjectsList
- Provides navigation between creating and viewing projects

## Flow Diagram

```
User Connects Wallet
       ↓
User Fills Form (ProjectCreationForm)
       ↓
Submit → POST /api/projects/create
       ↓
Server calls client.createCreateProjectTransaction()
       ↓
Returns { projectAddress, txResponse }
       ↓
Frontend signs transaction with wallet
       ↓
POST /api/projects/store
       ↓
Store project in Supabase
       ↓
Display success message
       ↓
User can view project in ProjectsList
```

## Security

- Row Level Security (RLS) enabled on projects table
- Users can only view/modify their own projects
- Wallet address verification before storing projects
- Server-side validation of required fields

## Usage

1. Connect your Solana wallet
2. Navigate to "Create Project" tab
3. Fill in project details:
   - Project name (required)
   - Authority public key (required)
   - Payer public key (optional)
   - Achievements (dynamic array)
   - Custom data fields (dynamic array)
4. Click "Create Project"
5. Sign the transaction with your wallet
6. Project is stored and displayed in "My Projects" tab

## Future Enhancements

- [ ] Integrate real wallet signing (currently simulated)
- [ ] Add project editing functionality
- [ ] Add project deletion
- [ ] Add transaction history
- [ ] Add project analytics
- [ ] Support for project updates via Honeycomb Protocol
