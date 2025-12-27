-- ==============================================================================
-- MIGRATION V3: DADOS RICOS PARA MARKETPLACE (PROFISSÃO, EMPRESA, LOCALIZAÇÃO)
-- ==============================================================================
-- 1. MELHORAR PERFIS (PROFILES) - Dados do PRESTADOR
-- Adiciona colunas para saber quem é o profissional e onde ele atua.
alter table public.profiles
add column if not exists company_name text,
    add column if not exists profession text,
    -- Ex: Engenheiro, Arquiteto, Empreiteiro
add column if not exists phone text,
    add column if not exists city text,
    add column if not exists state text;
-- UF
-- Permitir que usuários editem suas próprias colunas novas
-- (As políticas existentes já cobrem UPDATE no "own profile", então está ok!)
-- 2. MELHORAR ORÇAMENTOS (BUDGETS) - Dados do LEAD
-- Adiciona local da obra para futura distribuição geográfica.
alter table public.budgets
add column if not exists work_city text,
    -- Cidade da Obra
add column if not exists work_state text;
-- UF da Obra