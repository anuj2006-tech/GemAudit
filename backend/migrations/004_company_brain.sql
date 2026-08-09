-- ---------------------------------------------------------
-- Company Brain Schema Migrations & Storage Policies
-- ---------------------------------------------------------

-- 1. company_brain_documents
CREATE TABLE IF NOT EXISTS company_brain_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- company_profile, financial, experience, certification, technical
    file_name VARCHAR(255) NOT NULL,
    storage_path VARCHAR(512) NOT NULL, -- companies/{company_id}/company-brain/{category}/{filename}
    mime_type VARCHAR(100),
    file_size INTEGER,
    processing_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
    extracted_text TEXT,
    error_message TEXT,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. company_brain_facts
CREATE TABLE IF NOT EXISTS company_brain_facts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES company_brain_documents(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- company_profile, financial, experience, certification, technical
    fact_type VARCHAR(100) NOT NULL, -- company_name, net_worth, project, etc.
    fact_value TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_company_brain_docs_company ON company_brain_documents(company_id);
CREATE INDEX IF NOT EXISTS idx_company_brain_docs_category ON company_brain_documents(category);
CREATE INDEX IF NOT EXISTS idx_company_brain_facts_company ON company_brain_facts(company_id);
CREATE INDEX IF NOT EXISTS idx_company_brain_facts_doc ON company_brain_facts(document_id);
CREATE INDEX IF NOT EXISTS idx_company_brain_facts_type ON company_brain_facts(fact_type);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE company_brain_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_brain_facts ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies (Isolate access to current tenant company ID)
DROP POLICY IF EXISTS company_brain_documents_isolation ON company_brain_documents;
CREATE POLICY company_brain_documents_isolation ON company_brain_documents
    FOR ALL
    USING (company_id = get_current_tenant_id());

DROP POLICY IF EXISTS company_brain_facts_isolation ON company_brain_facts;
CREATE POLICY company_brain_facts_isolation ON company_brain_facts
    FOR ALL
    USING (company_id = get_current_tenant_id());

-- 6. Setup Supabase Storage bucket for Company Brain
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-brain', 'company-brain', false)
ON CONFLICT (id) DO NOTHING;

-- 7. Supabase Storage Policies
-- A user can only access documents under companies/{company_id}/company-brain/...
-- Supabase path syntax: foldername(name)[1] is 'companies', foldername(name)[2] is {company_id}

DROP POLICY IF EXISTS "Allow company owners/admins read access to their company-brain folder" ON storage.objects;
CREATE POLICY "Allow company owners/admins read access to their company-brain folder"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'company-brain' AND
  (storage.foldername(name))[1] = 'companies' AND
  (storage.foldername(name))[2] = get_current_tenant_id()::text
);

DROP POLICY IF EXISTS "Allow company owners/admins insert access to their company-brain folder" ON storage.objects;
CREATE POLICY "Allow company owners/admins insert access to their company-brain folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'company-brain' AND
  (storage.foldername(name))[1] = 'companies' AND
  (storage.foldername(name))[2] = get_current_tenant_id()::text
);

DROP POLICY IF EXISTS "Allow company owners/admins delete access to their company-brain folder" ON storage.objects;
CREATE POLICY "Allow company owners/admins delete access to their company-brain folder"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'company-brain' AND
  (storage.foldername(name))[1] = 'companies' AND
  (storage.foldername(name))[2] = get_current_tenant_id()::text
);

-- Seed the default demo company so that the hardcoded aayush@rockstar.in bypass user works in the database
INSERT INTO companies (id, name, industry, country, phone, email, plan_id)
VALUES (
  '11111111-1111-1111-1111-111111111111', 
  'Rockstar Technologies', 
  'IT Services', 
  'India', 
  '1234567890', 
  'aayush@rockstar.in', 
  (SELECT id FROM plans WHERE name = 'Starter' LIMIT 1)
)
ON CONFLICT (id) DO NOTHING;
