-- Enable the pg_net extension
create extension if not exists pg_net with schema extensions;

-- Create the function to call the edge function
create or replace function public.create_user_wallet_on_signup()
returns trigger
language plpgsql
security definer set search_path = public
as $function$
begin
  perform
    net.http_post(
      url:='https://gyaytggnrffolewiaeib.supabase.co/functions/v1/create-user-wallet',
      body:=jsonb_build_object('user_id', new.id),
      headers:=jsonb_build_object(
        'Content-Type', 'application/json'
      )
    );
  return new;
end;
$function$;

-- Create the new trigger
create trigger on_new_user_create_wallet
  after insert on auth.users
  for each row execute procedure public.create_user_wallet_on_signup();
