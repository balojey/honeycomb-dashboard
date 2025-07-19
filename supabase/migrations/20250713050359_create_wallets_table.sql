CREATE TABLE wallets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id),
  public_key text NOT NULL,
  secret_key text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for the wallets table
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own wallet
CREATE POLICY "Allow individual read access"
ON wallets
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can create their own wallet
CREATE POLICY "Allow individual insert access"
ON wallets
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Optional: If you want to allow users to update their own wallets
-- CREATE POLICY "Allow individual update access"
-- ON wallets
-- FOR UPDATE
-- USING (auth.uid() = user_id)
-- WITH CHECK (auth.uid() = user_id);

-- Optional: If you want to allow users to delete their own wallets
-- CREATE POLICY "Allow individual delete access"
-- ON wallets
-- FOR DELETE
-- USING (auth.uid() = user_id);
