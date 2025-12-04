-- ============================================
-- OBRACALC - SUPABASE DATABASE SCHEMA
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- Dashboard → SQL Editor → New Query
-- ============================================
-- 1. Criar tabela de orçamentos
CREATE TABLE IF NOT EXISTS orcamento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    cliente TEXT,
    phone TEXT,
    -- Novos campos para captura de leads
    provider_name TEXT,
    provider_phone TEXT,
    provider_city TEXT,
    provider_state TEXT,
    project_type TEXT CHECK (project_type IN ('self', 'provider')),
    bdi_percent NUMERIC DEFAULT 20,
    ai_requests JSONB DEFAULT '[]'::jsonb,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Índices para performance
    CONSTRAINT orcamento_titulo_check CHECK (char_length(titulo) > 0)
);
-- 2. Criar tabela de itens do orçamento
CREATE TABLE IF NOT EXISTS orcamento_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    orcamento_id UUID NOT NULL REFERENCES orcamento(id) ON DELETE CASCADE,
    categoria TEXT NOT NULL,
    nome TEXT NOT NULL,
    unidade TEXT NOT NULL,
    quantidade NUMERIC NOT NULL DEFAULT 0,
    valor_medio NUMERIC NOT NULL DEFAULT 0,
    valor_manual NUMERIC,
    incluir BOOLEAN DEFAULT false,
    is_custom BOOLEAN DEFAULT false,
    ai_request_id UUID,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT orcamento_item_quantidade_check CHECK (quantidade >= 0),
    CONSTRAINT orcamento_item_valor_check CHECK (valor_medio >= 0)
);
-- 3. Criar tabela de contagem mensal de orçamentos (para limites de plano)
CREATE TABLE IF NOT EXISTS user_monthly_estimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    month TEXT NOT NULL,
    -- Formato: "2024-12"
    estimates_count INTEGER DEFAULT 0,
    estimates_ids UUID [] DEFAULT ARRAY []::UUID [],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Garantir um registro por usuário por mês
    UNIQUE(user_id, month)
);
-- 4. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_orcamento_user_id ON orcamento(user_id);
CREATE INDEX IF NOT EXISTS idx_orcamento_data_criacao ON orcamento(data_criacao DESC);
CREATE INDEX IF NOT EXISTS idx_orcamento_item_orcamento_id ON orcamento_item(orcamento_id);
CREATE INDEX IF NOT EXISTS idx_user_monthly_estimates_user_month ON user_monthly_estimates(user_id, month);
-- 5. Criar função para atualizar data_atualizacao automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.data_atualizacao = NOW();
RETURN NEW;
END;
$$ language 'plpgsql';
-- 6. Criar trigger para atualizar data_atualizacao
DROP TRIGGER IF EXISTS update_orcamento_updated_at ON orcamento;
CREATE TRIGGER update_orcamento_updated_at BEFORE
UPDATE ON orcamento FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- 7. Criar função para incrementar contagem mensal
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
-- 8. Criar função para verificar limite de orçamentos
CREATE OR REPLACE FUNCTION check_estimate_limit(p_user_id UUID, p_max_estimates INTEGER) RETURNS BOOLEAN AS $$
DECLARE current_month TEXT;
current_count INTEGER;
BEGIN -- Se limite é -1 (ilimitado), sempre permitir
IF p_max_estimates = -1 THEN RETURN TRUE;
END IF;
-- Obter mês atual
current_month := TO_CHAR(NOW(), 'YYYY-MM');
-- Obter contagem atual
SELECT COALESCE(estimates_count, 0) INTO current_count
FROM user_monthly_estimates
WHERE user_id = p_user_id
    AND month = current_month;
-- Verificar se está dentro do limite
RETURN current_count < p_max_estimates;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- 9. Habilitar Row Level Security (RLS)
ALTER TABLE orcamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamento_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_monthly_estimates ENABLE ROW LEVEL SECURITY;
-- 10. Criar políticas de segurança para orcamento
-- Usuários podem ver apenas seus próprios orçamentos
CREATE POLICY "Users can view own estimates" ON orcamento FOR
SELECT USING (auth.uid() = user_id);
-- Usuários podem criar seus próprios orçamentos
CREATE POLICY "Users can create own estimates" ON orcamento FOR
INSERT WITH CHECK (auth.uid() = user_id);
-- Usuários podem atualizar seus próprios orçamentos
CREATE POLICY "Users can update own estimates" ON orcamento FOR
UPDATE USING (auth.uid() = user_id);
-- Usuários podem deletar seus próprios orçamentos
CREATE POLICY "Users can delete own estimates" ON orcamento FOR DELETE USING (auth.uid() = user_id);
-- 11. Criar políticas de segurança para orcamento_item
-- Usuários podem ver itens de seus orçamentos
CREATE POLICY "Users can view own estimate items" ON orcamento_item FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM orcamento
            WHERE orcamento.id = orcamento_item.orcamento_id
                AND orcamento.user_id = auth.uid()
        )
    );
-- Usuários podem criar itens em seus orçamentos
CREATE POLICY "Users can create own estimate items" ON orcamento_item FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM orcamento
            WHERE orcamento.id = orcamento_item.orcamento_id
                AND orcamento.user_id = auth.uid()
        )
    );
-- Usuários podem atualizar itens de seus orçamentos
CREATE POLICY "Users can update own estimate items" ON orcamento_item FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM orcamento
            WHERE orcamento.id = orcamento_item.orcamento_id
                AND orcamento.user_id = auth.uid()
        )
    );
-- Usuários podem deletar itens de seus orçamentos
CREATE POLICY "Users can delete own estimate items" ON orcamento_item FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM orcamento
        WHERE orcamento.id = orcamento_item.orcamento_id
            AND orcamento.user_id = auth.uid()
    )
);
-- 12. Criar políticas para user_monthly_estimates
CREATE POLICY "Users can view own monthly counts" ON user_monthly_estimates FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own monthly counts" ON user_monthly_estimates FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can modify own monthly counts" ON user_monthly_estimates FOR
UPDATE USING (auth.uid() = user_id);
-- ============================================
-- DADOS DE TESTE (OPCIONAL)
-- ============================================
-- Descomente para inserir dados de teste
/*
 -- Inserir orçamento de exemplo (substitua USER_ID_AQUI pelo ID real)
 INSERT INTO orcamento (user_id, titulo, cliente, phone, provider_name, provider_phone, provider_city, provider_state, project_type, bdi_percent)
 VALUES (
 'USER_ID_AQUI',
 'Reforma Residencial - Teste',
 'João Silva',
 '(11) 98765-4321',
 'Construtora ABC',
 '(11) 91234-5678',
 'São Paulo',
 'SP',
 'provider',
 20
 );
 
 -- Inserir itens de exemplo
 INSERT INTO orcamento_item (orcamento_id, categoria, nome, unidade, quantidade, valor_medio, incluir)
 SELECT 
 id,
 'Alvenaria',
 'Tijolo cerâmico 6 furos',
 'un',
 1000,
 0.85,
 true
 FROM orcamento
 WHERE titulo = 'Reforma Residencial - Teste'
 LIMIT 1;
 */
-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- Execute para verificar se tudo foi criado corretamente
SELECT 'Tabelas criadas:' as status;
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name IN (
        'orcamento',
        'orcamento_item',
        'user_monthly_estimates'
    );
SELECT 'Funções criadas:' as status;
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
    AND routine_name IN (
        'increment_monthly_estimate_count',
        'check_estimate_limit'
    );
SELECT 'Políticas RLS criadas:' as status;
SELECT tablename,
    policyname
FROM pg_policies
WHERE schemaname = 'public';