export interface Database {
  public: {
    Tables: {
      wallet_addresses: {
        Row: {
          id: string;
          address: string;
          created_at: string | null;
          updated_at: string | null;
          last_connected_at: string | null;
        };
        Insert: {
          id?: string;
          address: string;
          created_at?: string | null;
          updated_at?: string | null;
          last_connected_at?: string | null;
        };
        Update: {
          id?: string;
          address?: string;
          created_at?: string | null;
          updated_at?: string | null;
          last_connected_at?: string | null;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          project_address: string;
          wallet_address_id: string;
          authority_public_key: string;
          achievements: string[];
          custom_data_fields: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          project_address: string;
          wallet_address_id: string;
          authority_public_key: string;
          achievements?: string[];
          custom_data_fields?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          project_address?: string;
          wallet_address_id?: string;
          authority_public_key?: string;
          achievements?: string[];
          custom_data_fields?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}