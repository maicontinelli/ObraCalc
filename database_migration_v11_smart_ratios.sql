-- Add breakdown columns if they don't exist
ALTER TABLE services
ADD COLUMN IF NOT EXISTS material_price numeric DEFAULT 0;
ALTER TABLE services
ADD COLUMN IF NOT EXISTS labor_price numeric DEFAULT 0;
-- Smart Update: Apply different ratios based on Category
UPDATE services
SET material_price = CASE
        WHEN category LIKE '%SERVIÇOS PRELIMINARES%' THEN ROUND(price * 0.15, 2)
        WHEN category LIKE '%DEMOLIÇÕES%' THEN ROUND(price * 0.05, 2)
        WHEN category LIKE '%MOVIMENTAÇÃO DE TERRA%' THEN ROUND(price * 0.10, 2)
        WHEN category LIKE '%INFRAESTRUTURA%' THEN ROUND(price * 0.55, 2)
        WHEN category LIKE '%SUPERESTRUTURA%' THEN ROUND(price * 0.55, 2)
        WHEN category LIKE '%PAREDES E PAINÉIS%' THEN ROUND(price * 0.60, 2)
        WHEN category LIKE '%ESTRUTURAS METÁLICAS%' THEN ROUND(price * 0.70, 2)
        WHEN category LIKE '%COBERTURA E TELHADO%' THEN ROUND(price * 0.65, 2)
        WHEN category LIKE '%IMPERMEABILIZAÇÃO%' THEN ROUND(price * 0.45, 2)
        WHEN category LIKE '%REVESTIMENTOS DE PAREDE%' THEN ROUND(price * 0.60, 2)
        WHEN category LIKE '%FORROS%' THEN ROUND(price * 0.60, 2)
        WHEN category LIKE '%PISOS E RODAPÉS%' THEN ROUND(price * 0.70, 2)
        WHEN category LIKE '%ESQUADRIAS E VIDROS%' THEN ROUND(price * 0.85, 2)
        WHEN category LIKE '%INSTALAÇÕES ELÉTRICAS%' THEN ROUND(price * 0.45, 2)
        WHEN category LIKE '%INSTALAÇÕES HIDRÁULICAS%' THEN ROUND(price * 0.45, 2)
        WHEN category LIKE '%LOUÇAS E METAIS%' THEN ROUND(price * 0.85, 2)
        WHEN category LIKE '%PINTURA%' THEN ROUND(price * 0.30, 2)
        WHEN category LIKE '%SERVIÇOS FINAIS%' THEN ROUND(price * 0.20, 2)
        ELSE ROUND(price * 0.50, 2) -- Default fallback
    END,
    labor_price = CASE
        WHEN category LIKE '%SERVIÇOS PRELIMINARES%' THEN ROUND(price * 0.85, 2)
        WHEN category LIKE '%DEMOLIÇÕES%' THEN ROUND(price * 0.95, 2)
        WHEN category LIKE '%MOVIMENTAÇÃO DE TERRA%' THEN ROUND(price * 0.90, 2)
        WHEN category LIKE '%INFRAESTRUTURA%' THEN ROUND(price * 0.45, 2)
        WHEN category LIKE '%SUPERESTRUTURA%' THEN ROUND(price * 0.45, 2)
        WHEN category LIKE '%PAREDES E PAINÉIS%' THEN ROUND(price * 0.40, 2)
        WHEN category LIKE '%ESTRUTURAS METÁLICAS%' THEN ROUND(price * 0.30, 2)
        WHEN category LIKE '%COBERTURA E TELHADO%' THEN ROUND(price * 0.35, 2)
        WHEN category LIKE '%IMPERMEABILIZAÇÃO%' THEN ROUND(price * 0.55, 2)
        WHEN category LIKE '%REVESTIMENTOS DE PAREDE%' THEN ROUND(price * 0.40, 2)
        WHEN category LIKE '%FORROS%' THEN ROUND(price * 0.40, 2)
        WHEN category LIKE '%PISOS E RODAPÉS%' THEN ROUND(price * 0.30, 2)
        WHEN category LIKE '%ESQUADRIAS E VIDROS%' THEN ROUND(price * 0.15, 2)
        WHEN category LIKE '%INSTALAÇÕES ELÉTRICAS%' THEN ROUND(price * 0.55, 2)
        WHEN category LIKE '%INSTALAÇÕES HIDRÁULICAS%' THEN ROUND(price * 0.55, 2)
        WHEN category LIKE '%LOUÇAS E METAIS%' THEN ROUND(price * 0.15, 2)
        WHEN category LIKE '%PINTURA%' THEN ROUND(price * 0.70, 2)
        WHEN category LIKE '%SERVIÇOS FINAIS%' THEN ROUND(price * 0.80, 2)
        ELSE ROUND(price * 0.50, 2) -- Default fallback
    END
WHERE price IS NOT NULL;