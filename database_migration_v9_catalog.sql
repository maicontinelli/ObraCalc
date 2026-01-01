-- Create services catalog table
create table if not exists services (
    id text primary key,
    category text not null,
    name text not null,
    unit text not null,
    price numeric not null,
    description text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Enable RLS
alter table services enable row level security;
-- Create policy for reading (public access for now, or authenticated)
create policy "Public services are viewable by everyone" on services for
select using (true);
-- Create policy for inserting/updating (only specific admin or service_role)
-- For simplicity, we allow authenticated users to view, but only specific email to edit?
-- Actually, let's stick to simple "Enable Read for All" and "Write for Admin Context Only".
-- Since Supabase Dashboard SQL Editor runs as superuser, we don't strictly need insert policies for the seed script if it uses service_role key, 
-- but if we use the client key with user session, we need a policy.
create policy "Admins can insert services" on services for
insert with check (
        auth.jwt()->>'email' = 'maicontinelli@gmail.com'
    );
create policy "Admins can update services" on services for
update using (
        auth.jwt()->>'email' = 'maicontinelli@gmail.com'
    );
create policy "Admins can delete services" on services for delete using (
    auth.jwt()->>'email' = 'maicontinelli@gmail.com'
);
-- Create index for search
create index if not exists services_name_idx on services using gin(to_tsvector('portuguese', name));
create index if not exists services_category_idx on services (category);