-- ==============================================================================
-- FIX V6: INCLUIR COLUNA UPDATED_AT QUE ESTAVA FALTANDO
-- ==============================================================================
-- Pelo erro reportado, a tabela profiles foi criada na V2 (ou antes) mas sem a coluna updated_at.
-- Vamos adicioná-la agora com segurança.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
-- Aproveitar para garantir novamente que as outras colunas da V3 estão lá
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS company_name text,
    ADD COLUMN IF NOT EXISTS profession text,
    ADD COLUMN IF NOT EXISTS phone text,
    ADD COLUMN IF NOT EXISTS city text,
    ADD COLUMN IF NOT EXISTS state text;
-- Re-aplicar permissões básicas para garantir
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;