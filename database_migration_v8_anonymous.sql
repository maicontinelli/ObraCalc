-- ==============================================================================
-- MIGRATION V8: ARAPUCA DE LEADS (CAPTURE ANONYMOUS)
-- ==============================================================================
-- 1. Create a standalone table for anonymous captures
-- keeping it separate from 'budgets' prevents messing up user quotas or auth logic.
CREATE TABLE IF NOT EXISTS public.anonymous_leads (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- Provider Info (The anonymous user)
    provider_name text,
    provider_phone text,
    -- Client/Project Info (The job)
    client_name text,
    client_phone text,
    project_type text,
    work_city text,
    work_state text,
    -- Metadata
    origin text DEFAULT 'editor_guest',
    -- to track where it came from
    converted boolean DEFAULT false -- for future use if you mark them as 'contacted'
);
-- 2. Security (RLS) - CRITICAL
-- We must allow ANYONE (anon) to INSERT, but ONLY ADMIN to SELECT.
ALTER TABLE public.anonymous_leads ENABLE ROW LEVEL SECURITY;
-- Allow anonymous users to INSERT data (The "Trap")
CREATE POLICY "Allow anonymous insert" ON public.anonymous_leads FOR
INSERT TO anon,
    authenticated WITH CHECK (true);
-- Allow ONLY Admin to VIEW data
-- (Assuming we check email in the stored procedure or app logic, or use service_role in admin)
-- For simplicity in the app, we usually use the same email check as existing tables
CREATE POLICY "Allow admin select" ON public.anonymous_leads FOR
SELECT TO authenticated USING (
        auth.jwt()->>'email' = 'maicontinelli@gmail.com'
    );
-- Grant permissions
GRANT INSERT ON public.anonymous_leads TO anon,
    authenticated;
GRANT SELECT ON public.anonymous_leads TO authenticated;