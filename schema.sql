-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (linked to auth.users)
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  logo_url text,
  region text,
  updated_at timestamp with time zone
);

-- Price Catalog (Admin managed)
create table catalogo_item (
  id uuid default uuid_generate_v4() primary key,
  categoria text not null,
  nome text not null,
  unidade text not null, -- m2, m3, un, etc.
  valor_medio numeric not null,
  codigo text,
  region text default 'BR', -- To support multiple regions
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Estimates (Orcamentos)
create table orcamento (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  titulo text not null,
  cliente text,
  data_criacao timestamp with time zone default timezone('utc'::text, now()) not null,
  data_atualizacao timestamp with time zone default timezone('utc'::text, now()) not null,
  escopo text,
  bdi_percent numeric default 0,
  total_sem_bdi numeric default 0,
  total_com_bdi numeric default 0,
  versao_atual int default 1
);

-- Estimate Items
create table orcamento_item (
  id uuid default uuid_generate_v4() primary key,
  orcamento_id uuid references orcamento(id) on delete cascade not null,
  item_id uuid references catalogo_item(id), -- Optional link to catalog
  categoria text not null,
  nome text not null,
  unidade text not null,
  quantidade numeric default 0,
  valor_medio numeric default 0,
  valor_manual numeric, -- If null, use valor_medio
  incluir boolean default true,
  ordem int default 0
);

-- Versions
create table versao_orcamento (
  id uuid default uuid_generate_v4() primary key,
  orcamento_id uuid references orcamento(id) on delete cascade not null,
  numero_versao int not null,
  snapshot_json jsonb not null, -- Full copy of the estimate at that time
  criado_em timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies (Basic)
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using ( true );
create policy "Users can insert their own profile." on profiles for insert with check ( auth.uid() = id );
create policy "Users can update own profile." on profiles for update using ( auth.uid() = id );

alter table orcamento enable row level security;
create policy "Users can CRUD their own estimates." on orcamento for all using ( auth.uid() = user_id );

alter table orcamento_item enable row level security;
create policy "Users can CRUD their own estimate items." on orcamento_item for all using ( 
  exists ( select 1 from orcamento where id = orcamento_item.orcamento_id and user_id = auth.uid() )
);

alter table catalogo_item enable row level security;
create policy "Catalog is viewable by everyone." on catalogo_item for select using ( true );
-- Only admin can update catalog (omitted for simplicity, or add admin check)

alter table versao_orcamento enable row level security;
create policy "Users can CRUD their own versions." on versao_orcamento for all using (
  exists ( select 1 from orcamento where id = versao_orcamento.orcamento_id and user_id = auth.uid() )
);
