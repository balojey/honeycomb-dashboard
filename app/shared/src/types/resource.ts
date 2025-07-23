import { ResourceStorageEnum, type Transaction } from '@honeycomb-protocol/edge-client';

export interface CreateResourceRequest {
  name: string;
  symbol: string;
  decimals: number;
  uri: string;
  storageType: ResourceStorageEnum.AccountState | ResourceStorageEnum.LedgerState;
  projectId: string;
}

export interface CreateResourceResponse {
  tx: Transaction;
}