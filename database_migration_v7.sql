-- ==============================================================================
-- MIGRATION V7: CAMPOS AVANÇADOS DE PERFIL
-- ==============================================================================
-- Adicionar colunas para registro profissional e tamanho da equipe
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS registration_number text,
    -- CREA/CAU
ADD COLUMN IF NOT EXISTS team_size text;
-- Tamanho da equipe
-- A coluna 'profession' já existe (criada na v3/v6), vamos usar no frontend as opções:
-- Engenheiro, Arquiteto, Empreiteiro, Orçamentista, Designer de Interiores, Mestre de Obras, Outros
-- Garantir permissões (boas práticas)
GRANT ALL ON public.profiles TO authenticated;