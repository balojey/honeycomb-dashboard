-- Create projects table to store Honeycomb Protocol projects
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  project_address text NOT NULL UNIQUE,
  wallet_address_id uuid NOT NULL REFERENCES public.wallet_addresses(id) ON DELETE CASCADE,
  authority_public_key text NOT NULL,
  achievements text[] DEFAULT '{}',
  custom_data_fields text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own projects" ON public.projects
  FOR SELECT USING (wallet_address_id IN (
    SELECT id FROM public.wallet_addresses WHERE address = auth.jwt() ->> 'wallet_address'
  ));

CREATE POLICY "Users can insert their own projects" ON public.projects
  FOR INSERT WITH CHECK (wallet_address_id IN (
    SELECT id FROM public.wallet_addresses WHERE address = auth.jwt() ->> 'wallet_address'
  ));

CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE USING (wallet_address_id IN (
    SELECT id FROM public.wallet_addresses WHERE address = auth.jwt() ->> 'wallet_address'
  ));

CREATE POLICY "Users can delete their own projects" ON public.projects
  FOR DELETE USING (wallet_address_id IN (
    SELECT id FROM public.wallet_addresses WHERE address = auth.jwt() ->> 'wallet_address'
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_wallet_address_id ON public.projects(wallet_address_id);
CREATE INDEX IF NOT EXISTS idx_projects_project_address ON public.projects(project_address);;
