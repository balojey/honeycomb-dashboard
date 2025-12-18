export interface WalletAddressRecord {
  id: string;
  address: string;
  created_at: string;
  updated_at: string;
  last_connected_at: string;
}

export interface WalletAddressInsert {
  address: string;
  last_connected_at?: string;
}

export interface WalletAddressUpdate {
  last_connected_at?: string;
  updated_at?: string;
}