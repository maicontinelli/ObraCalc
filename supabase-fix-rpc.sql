-- ============================================
-- CORREÇÃO DA FUNÇÃO DE CONTAGEM DE ORÇAMENTOS
-- ============================================
-- Este script recria a tabela e a função necessárias para controlar
-- o limite de orçamentos mensais.
-- 1. Garantir que a tabela existe
CREATE TABLE IF NOT EXISTS user_monthly_estimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    month TEXT NOT NULL,
    -- Formato: "YYYY-MM"
    estimates_count INTEGER DEFAULT 0,
    estimates_ids UUID [] DEFAULT ARRAY []::UUID [],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, month)
);
-- 2. Habilitar RLS (Segurança)
ALTER TABLE user_monthly_estimates ENABLE ROW LEVEL SECURITY;
-- 3. Criar políticas de acesso (se não existirem)
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'user_monthly_estimates'
        AND policyname = 'Users can view own monthly counts'
) THEN CREATE POLICY "Users can view own monthly counts" ON user_monthly_estimates FOR
SELECT USING (auth.uid() = user_id);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'user_monthly_estimates'
        AND policyname = 'Users can update own monthly counts'
) THEN CREATE POLICY "Users can update own monthly counts" ON user_monthly_estimates FOR
INSERT WITH CHECK (auth.uid() = user_id);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'user_monthly_estimates'
        AND policyname = 'Users can modify own monthly counts'
) THEN CREATE POLICY "Users can modify own monthly counts" ON user_monthly_estimates FOR
UPDATE USING (auth.uid() = user_id);
END IF;
END $$;
-- 4. Recriar a função de incremento (RPC)
CREATE OR REPLACE FUNCTION increment_monthly_estimate_count(p_user_id UUID, p_estimate_id UUID) RETURNS void AS $$
DECLARE current_month TEXT;
BEGIN -- Obter mês atual no formato YYYY-MM
current_month := TO_CHAR(NOW(), 'YYYY-MM');
-- Inserir ou atualizar contagem
INSERT INTO user_monthly_estimates (user_id, month, estimates_count, estimates_ids)
VALUES (
        p_user_id,
        current_month,
        1,
        ARRAY [p_estimate_id]
    ) ON CONFLICT (user_id, month) DO
UPDATE
SET estimates_count = user_monthly_estimates.estimates_count + 1,
    estimates_ids = array_append(
        user_monthly_estimates.estimates_ids,
        p_estimate_id
    ),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- 5. Conceder permissão de execução para usuários autenticados
GRANT EXECUTE ON FUNCTION increment_monthly_estimate_count TO authenticated;
GRANT EXECUTE ON FUNCTION increment_monthly_estimate_count TO service_role;