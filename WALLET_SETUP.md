# Wallet Address Storage Setup

This guide explains how to set up the wallet address storage functionality in your Supabase database.

## Database Setup

### 1. Run the Migration

Execute the SQL migration in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/001_create_wallet_addresses_table.sql`
4. Run the query

This will create:
- `wallet_addresses` table with proper schema
- Indexes for performance
- Row Level Security (RLS) policies
- Automatic timestamp updates

### 2. Table Schema

The `wallet_addresses` table includes:

```sql
- id: UUID (Primary Key, auto-generated)
- address: TEXT (Unique wallet address)
- created_at: TIMESTAMP (When first connected)
- updated_at: TIMESTAMP (Last record update)
- last_connected_at: TIMESTAMP (Last connection time)
```

## How It Works

### Automatic Wallet Tracking

When a user connects their wallet:

1. **First Connection**: The wallet address is automatically saved to the database
2. **Subsequent Connections**: The `last_connected_at` timestamp is updated
3. **Visual Feedback**: Users see loading states and confirmation messages

### Components

- **`useWalletAddress` Hook**: Manages wallet address operations
- **`WalletConnection` Component**: Updated to automatically save addresses
- **`WalletAddressManager` Component**: Admin view to see all connected wallets

### Usage

The wallet address tracking happens automatically when users connect their wallets. No additional user action is required.

To view all connected wallet addresses, you can add the `WalletAddressManager` component to any page:

```tsx
import WalletAddressManager from '@/components/WalletAddressManager';

export default function AdminPage() {
  return (
    <div>
      <WalletAddressManager />
    </div>
  );
}
```

## Environment Variables

Make sure your `.env.local` file includes:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Security Notes

- Row Level Security (RLS) is enabled on the table
- Current policy allows all operations (modify as needed for your use case)
- Consider adding user authentication and restricting access based on your requirements

## Testing

1. Connect a wallet through the app
2. Check the Supabase dashboard to see the new record
3. Disconnect and reconnect to see the `last_connected_at` update
4. Use the `WalletAddressManager` component to view all records