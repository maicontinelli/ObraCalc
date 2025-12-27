-- ==============================================================================
-- MIGRATION V2: ESTRUTURA PARA PAINEL ADMIN E LEADS
-- ==============================================================================
-- 1. CRIAR TABELA DE PERFIS (PROFILES)
-- Esta tabela será um espelho público dos usuários, permitindo listar cadastros no Admin.
create table public.profiles (
    id uuid not null references auth.users on delete cascade,
    email text,
    full_name text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (id)
);
-- Habilitar segurança (RLS)
alter table public.profiles enable row level security;
-- Política 1: Usuários podem ver seus próprios perfis
create policy "Users can view own profile" on public.profiles for
select using (auth.uid() = id);
-- Política 2: Usuários podem atualizar seus próprios perfis
create policy "Users can update own profile" on public.profiles for
update using (auth.uid() = id);
-- (A política para o ADMIN ver TUDO será criada mais abaixo)
-- 2. TRIGGER PARA CRIAR PERFIL AUTOMATICAMENTE
-- Toda vez que um usuário se cadastra no Auth, cria uma linha em public.profiles
create or replace function public.handle_new_user() returns trigger as $$ begin
insert into public.profiles (id, email, full_name)
values (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name'
    );
return new;
end;
$$ language plpgsql security definer;
-- Trigger
create trigger on_auth_user_created
after
insert on auth.users for each row execute procedure public.handle_new_user();
-- 3. MELHORAR TABELA DE ORÇAMENTOS (BUDGETS)
-- Adiciona colunas para filtrar leads sem precisar ler o JSON
alter table public.budgets
add column if not exists client_name text,
    add column if not exists client_phone text,
    add column if not exists project_type text,
    add column if not exists status text default 'draft';
-- 'draft' (rascunho) ou 'completed' (gerou relatório)
-- 4. PERMISSÕES DE ADMIN (Crucial para o seu Dashboard)
-- Substitua 'maicontinelli@gmail.com' pelo seu email exato de login
-- Função para verificar se é admin
create or replace function is_admin() returns boolean as $$ begin return (auth.jwt()->>'email') = 'maicontinelli@gmail.com';
end;
$$ language plpgsql security definer;
-- Política: Admin pode ver TODOS os perfis
create policy "Admins can view all profiles" on public.profiles for
select using (is_admin());
-- Política: Admin pode ver TODOS os orçamentos (Leads)
create policy "Admins can view all budgets" on public.budgets for
select using (is_admin());
-- ==============================================================================
-- FIM DA MIGRAÇÃO
-- ==============================================================================