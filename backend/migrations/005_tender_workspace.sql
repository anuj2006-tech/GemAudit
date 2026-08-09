-- ---------------------------------------------------------
-- Tender Workspace Schema Migrations & Storage Policies
-- ---------------------------------------------------------

-- 1. Alter existing tenders table to support new columns
ALTER TABLE tenders ADD COLUMN IF NOT EXISTS reference_number VARCHAR(100);
ALTER TABLE tenders ADD COLUMN IF NOT EXISTS issuing_authority VARCHAR(255);
ALTER TABLE tenders ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE tenders ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE tenders ADD COLUMN IF NOT EXISTS publication_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
ALTER TABLE tenders ADD COLUMN IF NOT EXISTS submission_deadline TIMESTAMP WITH TIME ZONE;
ALTER TABLE tenders ADD COLUMN IF NOT EXISTS estimated_value NUMERIC(15, 2);
ALTER TABLE tenders ADD COLUMN IF NOT EXISTS overall_score NUMERIC(5, 2);

-- Migrate existing data
UPDATE tenders SET submission_deadline = deadline WHERE submission_deadline IS NULL AND deadline IS NOT NULL;
UPDATE tenders SET estimated_value = budget WHERE estimated_value IS NULL AND budget IS NOT NULL;

-- 2. Create tender_documents table
CREATE TABLE IF NOT EXISTS tender_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    tender_id UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL, -- RFP, Tender Notice, BOQ, Technical Specification, Addendum, Clarification, Other
    storage_path VARCHAR(512) NOT NULL, -- companies/{company_id}/tenders/{tender_id}/{document_id}/{filename}
    mime_type VARCHAR(100),
    file_size INTEGER,
    processing_status VARCHAR(50) NOT NULL DEFAULT 'QUEUED', -- QUEUED, EXTRACTING, EXTRACTED, ANALYZING, FAILED, COMPLETED
    extracted_text TEXT,
    error_message TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create tender_requirements table
CREATE TABLE IF NOT EXISTS tender_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    tender_id UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
    requirement_type VARCHAR(100) NOT NULL, -- FINANCIAL, EXPERIENCE, CERTIFICATION, LEGAL, TECHNICAL, PERSONNEL, EQUIPMENT, LOCATION, DOCUMENT, OTHER
    title VARCHAR(255) NOT NULL,
    description TEXT,
    mandatory BOOLEAN NOT NULL DEFAULT false,
    operator VARCHAR(50), -- >=, <=, =, etc.
    required_value NUMERIC(15, 2),
    required_unit VARCHAR(50),
    required_years INTEGER,
    source_document_id UUID REFERENCES tender_documents(id) ON DELETE SET NULL,
    source_page INTEGER,
    confidence NUMERIC(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create tender_analysis table
CREATE TABLE IF NOT EXISTS tender_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    tender_id UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
    overall_score NUMERIC(5, 2),
    eligibility_status VARCHAR(50) NOT NULL DEFAULT 'REVIEW_REQUIRED', -- ELIGIBLE, NOT_ELIGIBLE, REVIEW_REQUIRED
    summary TEXT,
    strengths JSONB DEFAULT '[]'::jsonb,
    weaknesses JSONB DEFAULT '[]'::jsonb,
    risks JSONB DEFAULT '[]'::jsonb,
    missing_requirements JSONB DEFAULT '[]'::jsonb,
    recommendation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create tender_requirement_results table
CREATE TABLE IF NOT EXISTS tender_requirement_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    tender_id UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
    requirement_id UUID NOT NULL REFERENCES tender_requirements(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'REVIEW', -- PASS, FAIL, REVIEW, NOT_FOUND
    score NUMERIC(5, 2),
    reason TEXT,
    evidence TEXT,
    source_document_id UUID REFERENCES company_brain_documents(id) ON DELETE SET NULL,
    source_page INTEGER,
    confidence NUMERIC(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ---------------------------------------------------------
-- Indices for Tenant Isolation Performance
-- ---------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_tenders_company_id ON tenders(company_id);
CREATE INDEX IF NOT EXISTS idx_tenders_company_id_status ON tenders(company_id, status);

CREATE INDEX IF NOT EXISTS idx_tender_documents_company_id ON tender_documents(company_id);
CREATE INDEX IF NOT EXISTS idx_tender_documents_company_id_tender_id ON tender_documents(company_id, tender_id);

CREATE INDEX IF NOT EXISTS idx_tender_requirements_company_id ON tender_requirements(company_id);
CREATE INDEX IF NOT EXISTS idx_tender_requirements_company_id_tender_id ON tender_requirements(company_id, tender_id);

CREATE INDEX IF NOT EXISTS idx_tender_analysis_company_id ON tender_analysis(company_id);
CREATE INDEX IF NOT EXISTS idx_tender_analysis_company_id_tender_id ON tender_analysis(company_id, tender_id);

CREATE INDEX IF NOT EXISTS idx_tender_req_results_company_id ON tender_requirement_results(company_id);
CREATE INDEX IF NOT EXISTS idx_tender_req_results_company_id_tender_id ON tender_requirement_results(company_id, tender_id);

-- ---------------------------------------------------------
-- Row-Level Security (RLS) Enablement & Policies
-- ---------------------------------------------------------
ALTER TABLE tender_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tender_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE tender_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tender_requirement_results ENABLE ROW LEVEL SECURITY;

-- 1. Policies for tender_documents
DROP POLICY IF EXISTS "Enforce tenant read access on tender_documents" ON tender_documents;
CREATE POLICY "Enforce tenant read access on tender_documents" ON tender_documents
    FOR SELECT TO authenticated USING (company_id = get_current_tenant_id());

DROP POLICY IF EXISTS "Enforce tenant insert access on tender_documents" ON tender_documents;
CREATE POLICY "Enforce tenant insert access on tender_documents" ON tender_documents
    FOR INSERT TO authenticated WITH CHECK (company_id = get_current_tenant_id());

DROP POLICY IF EXISTS "Enforce tenant update access on tender_documents" ON tender_documents;
CREATE POLICY "Enforce tenant update access on tender_documents" ON tender_documents
    FOR UPDATE TO authenticated USING (company_id = get_current_tenant_id());

DROP POLICY IF EXISTS "Enforce tenant delete access on tender_documents" ON tender_documents;
CREATE POLICY "Enforce tenant delete access on tender_documents" ON tender_documents
    FOR DELETE TO authenticated USING (company_id = get_current_tenant_id());

-- 2. Policies for tender_requirements
DROP POLICY IF EXISTS "Enforce tenant read access on tender_requirements" ON tender_requirements;
CREATE POLICY "Enforce tenant read access on tender_requirements" ON tender_requirements
    FOR SELECT TO authenticated USING (company_id = get_current_tenant_id());

DROP POLICY IF EXISTS "Enforce tenant write access on tender_requirements" ON tender_requirements;
CREATE POLICY "Enforce tenant write access on tender_requirements" ON tender_requirements
    FOR ALL TO authenticated USING (company_id = get_current_tenant_id());

-- 3. Policies for tender_analysis
DROP POLICY IF EXISTS "Enforce tenant read access on tender_analysis" ON tender_analysis;
CREATE POLICY "Enforce tenant read access on tender_analysis" ON tender_analysis
    FOR SELECT TO authenticated USING (company_id = get_current_tenant_id());

DROP POLICY IF EXISTS "Enforce tenant write access on tender_analysis" ON tender_analysis;
CREATE POLICY "Enforce tenant write access on tender_analysis" ON tender_analysis
    FOR ALL TO authenticated USING (company_id = get_current_tenant_id());

-- 4. Policies for tender_requirement_results
DROP POLICY IF EXISTS "Enforce tenant read access on tender_requirement_results" ON tender_requirement_results;
CREATE POLICY "Enforce tenant read access on tender_requirement_results" ON tender_requirement_results
    FOR SELECT TO authenticated USING (company_id = get_current_tenant_id());

DROP POLICY IF EXISTS "Enforce tenant write access on tender_requirement_results" ON tender_requirement_results;
CREATE POLICY "Enforce tenant write access on tender_requirement_results" ON tender_requirement_results
    FOR ALL TO authenticated USING (company_id = get_current_tenant_id());

-- ---------------------------------------------------------
-- Storage Bucket & Security Policies
-- ---------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tenders', 'tenders', false) 
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage bucket 'tenders'
DROP POLICY IF EXISTS "Allow company owners/admins read access to their tenders folder" ON storage.objects;
CREATE POLICY "Allow company owners/admins read access to their tenders folder"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'tenders' AND
  (storage.foldername(name))[1] = 'companies' AND
  (storage.foldername(name))[2] = get_current_tenant_id()::text
);

DROP POLICY IF EXISTS "Allow company owners/admins insert access to their tenders folder" ON storage.objects;
CREATE POLICY "Allow company owners/admins insert access to their tenders folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'tenders' AND
  (storage.foldername(name))[1] = 'companies' AND
  (storage.foldername(name))[2] = get_current_tenant_id()::text
);

DROP POLICY IF EXISTS "Allow company owners/admins delete access to their tenders folder" ON storage.objects;
CREATE POLICY "Allow company owners/admins delete access to their tenders folder"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'tenders' AND
  (storage.foldername(name))[1] = 'companies' AND
  (storage.foldername(name))[2] = get_current_tenant_id()::text
);
