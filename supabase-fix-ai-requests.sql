-- ============================================
-- CORREÇÃO DE SCHEMA - COLUNA AI_REQUESTS
-- ============================================
-- O erro "invalid input syntax for type integer" indica que a coluna 
-- 'ai_requests' foi criada incorretamente como um número inteiro (INTEGER),
-- mas ela deve armazenar dados JSON (JSONB).
-- Este script remove a coluna incorreta e a recria com o tipo correto.
-- 1. Remover a coluna incorreta (se existir)
ALTER TABLE orcamento DROP COLUMN IF EXISTS ai_requests;
-- 2. Adicionar a coluna com o tipo correto (JSONB)
ALTER TABLE orcamento
ADD COLUMN ai_requests JSONB DEFAULT '[]'::jsonb;
-- 3. Verificação (Opcional - para confirmar a mudança)
SELECT column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'orcamento'
    AND column_name = 'ai_requests';