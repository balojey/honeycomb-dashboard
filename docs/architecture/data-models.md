# Data Models

## Project

  * **Purpose:** Represents a single Honeycomb project.

### TypeScript Interface

```typescript
export interface HoneycombProject {
  address: string;
  authority: string;
  name: string;
}
```

## Profile & User

  * **Purpose:** Represents a user's project-specific data (`Profile`) and their global account (`User`).

### TypeScript Interfaces

```typescript
export interface ProfileInfo {
  name: string | null;
  bio: string | null;
  pfp: string | null;
}
export interface PlatformData {
  xp: number;
  achievements: number[];
}
export interface HoneycombProfile {
  address: string;
  project: string;
  userId: number;
  info: ProfileInfo;
  platformData: PlatformData;
}
export interface UserInfo {
  username: string;
  name: string;
  bio: string;
  pfp: string;
}
export interface Wallets {
  shadow: string;
  wallets: string[];
}
export interface HoneycombUser {
  id: number;
  address: string;
  info: UserInfo;
  wallets: Wallets;
}
```

## Resource & Character Model

  * **Purpose:** Represents game assets (`Resource`) and templates for creating characters (`CharacterModel`).

### TypeScript Interfaces

```typescript
export interface ResourceKind {
  kind: string;
  params: { decimals?: number; };
}
export interface ResourceStorage {
  kind: 'AccountState' | 'LedgerState';
}
export interface HoneycombResource {
  address: string;
  project: string;
  mint: string;
  storage: ResourceStorage;
  kind: ResourceKind;
}
export interface CharacterConfig {
  kind: 'Wrapped' | 'Assembled';
}
export interface HoneycombCharacterModel {
  address: string;
  project: string;
  config: CharacterConfig;
}
```
