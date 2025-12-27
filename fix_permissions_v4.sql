-- ==============================================================================
-- FIX PERMISSIONS V4: CORREÇÃO DE SALVAMENTO DE PERFIL
-- ==============================================================================
-- 1. GARANTIR COLUNAS (Caso a V3 tenha falhado ou sido parcial)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS company_name text,
    ADD COLUMN IF NOT EXISTS profession text,
    ADD COLUMN IF NOT EXISTS phone text,
    ADD COLUMN IF NOT EXISTS city text,
    ADD COLUMN IF NOT EXISTS state text;
-- 2. REFORÇAR POLÍTICAS DE SEGURANÇA (RLS)
-- Dropamos as antigas para garantir que as novas entrem sem conflito
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
-- Política de UPDATE: Permite que o usuário edite QUALQUER coluna do seu próprio ID
CREATE POLICY "Users can update own profile" ON public.profiles FOR
UPDATE USING (auth.uid() = id);
-- Política de INSERT: Permite que o usuário crie seu perfil (caso o trigger tenha falhado ou seja o primeiro acesso manual)
CREATE POLICY "Users can insert own profile" ON public.profiles FOR
INSERT WITH CHECK (auth.uid() = id);
-- 3. GRANT PERMISSIONS (Permissões de nível de banco)
-- Garante que o role 'authenticated' (usuários logados) possa fazer tudo na tabela profiles
GRANT SELECT,
    INSERT,
    UPDATE ON public.profiles TO authenticated;
-- ==============================================================================
-- FIM DA CORREÇÃO
-- Execute este arquivo no SQL Editor do Supabase para destravar o salvamento.
-- ==============================================================================