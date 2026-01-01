-- Add breakdown columns
ALTER TABLE services
ADD COLUMN IF NOT EXISTS material_price numeric DEFAULT 0;
ALTER TABLE services
ADD COLUMN IF NOT EXISTS labor_price numeric DEFAULT 0;
-- Update existing rows applying the 60/40 rule (60% Material, 40% Labor)
-- We use existing 'price' as the source of truth for the total
UPDATE services
SET material_price = ROUND(price * 0.60, 2),
    labor_price = ROUND(price * 0.40, 2)
WHERE price IS NOT NULL;
-- Optional: You might want to remove the 'price' column later or keep it as a cached total.
-- For now, we will keep it but relying on the sum of parts in the frontend logic.