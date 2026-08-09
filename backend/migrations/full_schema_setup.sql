-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ---------------------------------------------------------
-- Helper Functions for Multi-Tenancy
-- ---------------------------------------------------------

-- Returns the company_id for the current tenant from session context or JWT claims
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID AS $$
DECLARE
  tenant_id text;
BEGIN
  -- 1. Try to read from local transaction-level setting (for backend direct connections)
  tenant_id := current_setting('app.current_company_id', true);
  IF tenant_id IS NOT NULL AND tenant_id <> '' THEN
    RETURN tenant_id::uuid;
  END IF;

  -- 2. Try to read from auth.jwt() claims
  -- Check user_metadata first
  tenant_id := auth.jwt() -> 'user_metadata' ->> 'company_id';
  IF tenant_id IS NOT NULL AND tenant_id <> '' THEN
    RETURN tenant_id::uuid;
  END IF;

  -- Check root level payload of JWT
  tenant_id := auth.jwt() ->> 'company_id';
  IF tenant_id IS NOT NULL AND tenant_id <> '' THEN
    RETURN tenant_id::uuid;
  END IF;

  RETURN NULL;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;


-- ---------------------------------------------------------
-- Tables Definitions
-- ---------------------------------------------------------

-- 1. plans
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    limits JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. companies (Tenants)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    country VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(255),
    plan_id UUID REFERENCES plans(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. roles (RBAC Roles)
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE, -- NULL means platform-defined global role
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_company_role UNIQUE(company_id, name)
);

-- 4. departments
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_company_department UNIQUE(company_id, name)
);

-- 6. permissions (RBAC Permissions)
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. role_permissions
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 8. users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. tenders
CREATE TABLE IF NOT EXISTS tenders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, under_review, approved, submitted, won, lost
    deadline TIMESTAMP WITH TIME ZONE,
    budget NUMERIC(15, 2),
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. documents
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    tender_id UUID REFERENCES tenders(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL, -- e.g., company-id/documents/filename.pdf
    file_type VARCHAR(100),
    file_size INTEGER,
    processing_status VARCHAR(50) DEFAULT 'queued', -- queued, extracting, analyzing, embedding, indexed, failed, indexed_no_analysis
    indexing_status VARCHAR(50) DEFAULT 'pending',
    structured_data JSONB DEFAULT '{}'::jsonb,
    error_message TEXT,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Let's correct references for documents: REFERENCES companies(id)
ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_company_id_fkey;
DROP TABLE IF EXISTS documents CASCADE;
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    tender_id UUID REFERENCES tenders(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    file_type VARCHAR(100),
    file_size INTEGER,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. document_versions
CREATE TABLE IF NOT EXISTS document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    file_size INTEGER,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. embeddings
CREATE TABLE IF NOT EXISTS embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    chunk_content TEXT NOT NULL,
    embedding VECTOR(1536) NOT NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. chat_history
CREATE TABLE IF NOT EXISTS chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(100) NOT NULL,
    message_role VARCHAR(50) NOT NULL, -- user, assistant
    message_content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE, -- NULL for platform admin operations
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100),
    entity_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 16. activity_logs
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 17. billing
CREATE TABLE IF NOT EXISTS billing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD' NOT NULL,
    status VARCHAR(50) NOT NULL, -- paid, pending, failed
    invoice_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ---------------------------------------------------------
-- Indexes Definitions
-- ---------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_companies_plan ON companies(plan_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_company ON subscriptions(company_id);
CREATE INDEX IF NOT EXISTS idx_departments_company ON departments(company_id);
CREATE INDEX IF NOT EXISTS idx_roles_company ON roles(company_id);
CREATE INDEX IF NOT EXISTS idx_users_company ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_tenders_company ON tenders(company_id);
CREATE INDEX IF NOT EXISTS idx_tenders_assigned ON tenders(assigned_to);
CREATE INDEX IF NOT EXISTS idx_documents_company ON documents(company_id);
CREATE INDEX IF NOT EXISTS idx_documents_tender ON documents(tender_id);
CREATE INDEX IF NOT EXISTS idx_document_versions_doc ON document_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_company ON embeddings(company_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_doc ON embeddings(document_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_session ON chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_company ON audit_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_activity_logs_company ON activity_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_billing_company ON billing(company_id);

-- Cosine similarity index for embeddings (pgvector)
CREATE INDEX IF NOT EXISTS idx_embeddings_vector ON embeddings USING hnsw (embedding vector_cosine_ops);

-- ---------------------------------------------------------
-- Row Level Security (RLS) Policies
-- ---------------------------------------------------------

-- Enable RLS on all tenant-owned tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS companies_isolation ON companies;
DROP POLICY IF EXISTS subscriptions_isolation ON subscriptions;
DROP POLICY IF EXISTS departments_isolation ON departments;
DROP POLICY IF EXISTS roles_isolation ON roles;
DROP POLICY IF EXISTS users_isolation ON users;
DROP POLICY IF EXISTS tenders_isolation ON tenders;
DROP POLICY IF EXISTS documents_isolation ON documents;
DROP POLICY IF EXISTS document_versions_isolation ON document_versions;
DROP POLICY IF EXISTS embeddings_isolation ON embeddings;
DROP POLICY IF EXISTS chat_history_isolation ON chat_history;
DROP POLICY IF EXISTS audit_logs_isolation ON audit_logs;
DROP POLICY IF EXISTS notifications_isolation ON notifications;
DROP POLICY IF EXISTS activity_logs_isolation ON activity_logs;
DROP POLICY IF EXISTS billing_isolation ON billing;

-- 1. companies policies (A user can only select/update their own company profile)
CREATE POLICY companies_isolation ON companies
    FOR ALL
    USING (id = get_current_tenant_id());

-- 2. subscriptions policies
CREATE POLICY subscriptions_isolation ON subscriptions
    FOR ALL
    USING (company_id = get_current_tenant_id());

-- 3. departments policies
CREATE POLICY departments_isolation ON departments
    FOR ALL
    USING (company_id = get_current_tenant_id());

-- 4. roles policies
CREATE POLICY roles_isolation ON roles
    FOR ALL
    USING (company_id = get_current_tenant_id() OR company_id IS NULL);

-- 5. users policies
CREATE POLICY users_isolation ON users
    FOR ALL
    USING (company_id = get_current_tenant_id());

-- 6. tenders policies
CREATE POLICY tenders_isolation ON tenders
    FOR ALL
    USING (company_id = get_current_tenant_id());

-- 7. documents policies
CREATE POLICY documents_isolation ON documents
    FOR ALL
    USING (company_id = get_current_tenant_id());

-- 8. document_versions policies
CREATE POLICY document_versions_isolation ON document_versions
    FOR ALL
    USING (company_id = get_current_tenant_id());

-- 9. embeddings policies
CREATE POLICY embeddings_isolation ON embeddings
    FOR ALL
    USING (company_id = get_current_tenant_id());

-- 10. chat_history policies
CREATE POLICY chat_history_isolation ON chat_history
    FOR ALL
    USING (company_id = get_current_tenant_id());

-- 11. audit_logs policies
CREATE POLICY audit_logs_isolation ON audit_logs
    FOR ALL
    USING (company_id = get_current_tenant_id());

-- 12. notifications policies
CREATE POLICY notifications_isolation ON notifications
    FOR ALL
    USING (company_id = get_current_tenant_id());

-- 13. activity_logs policies
CREATE POLICY activity_logs_isolation ON activity_logs
    FOR ALL
    USING (company_id = get_current_tenant_id());

-- 14. billing policies
CREATE POLICY billing_isolation ON billing
    FOR ALL
    USING (company_id = get_current_tenant_id());

-- ---------------------------------------------------------
-- Default Seed Data
-- ---------------------------------------------------------

-- Seed default plans
INSERT INTO plans (name, price, limits) VALUES
('Starter', 49.00, '{"tenders": 5, "users": 3, "storage_gb": 5, "ai_requests": 100}'),
('Professional', 149.00, '{"tenders": 25, "users": 10, "storage_gb": 20, "ai_requests": 1000}'),
('Enterprise', 499.00, '{"tenders": 99999, "users": 99999, "storage_gb": 500, "ai_requests": 99999}')
ON CONFLICT (name) DO NOTHING;

-- Seed default global permissions
INSERT INTO permissions (name, description) VALUES
('tenders:create', 'Create new tenders'),
('tenders:read', 'View tenders'),
('tenders:update', 'Edit existing tenders'),
('tenders:delete', 'Delete tenders'),
('documents:upload', 'Upload documents'),
('documents:read', 'View documents'),
('documents:delete', 'Delete documents'),
('users:create', 'Create new company users'),
('users:read', 'View company users'),
('users:update', 'Edit company user info/roles'),
('users:delete', 'Delete company users'),
('settings:update', 'Manage company general settings'),
('billing:read', 'View company invoices and subscription billing settings'),
('billing:update', 'Change subscriptions or payment info'),
('departments:manage', 'Manage company organizational departments'),
('ai:chat', 'Use the AI chat assistant for bid evaluation')
ON CONFLICT (name) DO NOTHING;

-- Seed default global roles (company_id is NULL)
INSERT INTO roles (company_id, name, description) VALUES
(NULL, 'PLATFORM_ADMIN', 'Internal service operations role'),
(NULL, 'COMPANY_OWNER', 'Company creator with full administrative access'),
(NULL, 'ADMIN', 'Company administrator who manages operations, employees, and settings'),
(NULL, 'BID_MANAGER', 'Manages, reviews, and submits bid responses and proposals'),
(NULL, 'PROPOSAL_WRITER', 'Generates proposals and uploads supporting documentation'),
(NULL, 'REVIEWER', 'Reviews proposals, marks criteria checklists, and issues suggestions'),
(NULL, 'EMPLOYEE', 'Standard staff member assigned to complete specific tender checklist items'),
(NULL, 'VIEWER', 'ReadOnly stakeholder who has access to view dashboard metrics and tenders')
ON CONFLICT (company_id, name) DO NOTHING;

-- Map default role permissions (PLATFORM_ADMIN and global roles)
DO $$
DECLARE
    owner_role_id UUID;
    admin_role_id UUID;
    bid_mgr_role_id UUID;
    writer_role_id UUID;
    reviewer_role_id UUID;
    employee_role_id UUID;
    viewer_role_id UUID;
    perm_rec RECORD;
BEGIN
    SELECT id INTO owner_role_id FROM roles WHERE name = 'COMPANY_OWNER' AND company_id IS NULL;
    SELECT id INTO admin_role_id FROM roles WHERE name = 'ADMIN' AND company_id IS NULL;
    SELECT id INTO bid_mgr_role_id FROM roles WHERE name = 'BID_MANAGER' AND company_id IS NULL;
    SELECT id INTO writer_role_id FROM roles WHERE name = 'PROPOSAL_WRITER' AND company_id IS NULL;
    SELECT id INTO reviewer_role_id FROM roles WHERE name = 'REVIEWER' AND company_id IS NULL;
    SELECT id INTO employee_role_id FROM roles WHERE name = 'EMPLOYEE' AND company_id IS NULL;
    SELECT id INTO viewer_role_id FROM roles WHERE name = 'VIEWER' AND company_id IS NULL;

    -- COMPANY_OWNER gets all permissions
    FOR perm_rec IN SELECT id FROM permissions LOOP
        INSERT INTO role_permissions (role_id, permission_id) VALUES (owner_role_id, perm_rec.id) ON CONFLICT DO NOTHING;
    END LOOP;

    -- ADMIN gets almost all permissions except billing updates
    FOR perm_rec IN SELECT id FROM permissions WHERE name NOT IN ('billing:update') LOOP
        INSERT INTO role_permissions (role_id, permission_id) VALUES (admin_role_id, perm_rec.id) ON CONFLICT DO NOTHING;
    END LOOP;

    -- BID_MANAGER gets tenders, documents, and ai
    FOR perm_rec IN SELECT id FROM permissions WHERE name IN ('tenders:create', 'tenders:read', 'tenders:update', 'documents:upload', 'documents:read', 'ai:chat') LOOP
        INSERT INTO role_permissions (role_id, permission_id) VALUES (bid_mgr_role_id, perm_rec.id) ON CONFLICT DO NOTHING;
    END LOOP;

    -- PROPOSAL_WRITER gets tenders:read, documents:upload, documents:read, ai:chat
    FOR perm_rec IN SELECT id FROM permissions WHERE name IN ('tenders:read', 'documents:upload', 'documents:read', 'ai:chat') LOOP
        INSERT INTO role_permissions (role_id, permission_id) VALUES (writer_role_id, perm_rec.id) ON CONFLICT DO NOTHING;
    END LOOP;

    -- REVIEWER gets tenders:read, documents:read, ai:chat
    FOR perm_rec IN SELECT id FROM permissions WHERE name IN ('tenders:read', 'documents:read', 'ai:chat') LOOP
        INSERT INTO role_permissions (role_id, permission_id) VALUES (reviewer_role_id, perm_rec.id) ON CONFLICT DO NOTHING;
    END LOOP;

    -- EMPLOYEE gets tenders:read, documents:read
    FOR perm_rec IN SELECT id FROM permissions WHERE name IN ('tenders:read', 'documents:read') LOOP
        INSERT INTO role_permissions (role_id, permission_id) VALUES (employee_role_id, perm_rec.id) ON CONFLICT DO NOTHING;
    END LOOP;

    -- VIEWER gets tenders:read
    FOR perm_rec IN SELECT id FROM permissions WHERE name IN ('tenders:read') LOOP
        INSERT INTO role_permissions (role_id, permission_id) VALUES (viewer_role_id, perm_rec.id) ON CONFLICT DO NOTHING;
    END LOOP;
END $$;
-- Transactional function to handle multi-tenant registration
CREATE OR REPLACE FUNCTION register_company_and_owner(
  p_company_name text,
  p_industry text,
  p_country text,
  p_phone text,
  p_company_email text,
  p_owner_name text,
  p_owner_email text,
  p_password_hash text
)
RETURNS JSONB AS $$
DECLARE
  v_company_id uuid;
  v_role_id uuid;
  v_user_id uuid;
  v_plan_id uuid;
  v_result jsonb;
BEGIN
  -- Get default Starter plan
  SELECT id INTO v_plan_id FROM plans WHERE name = 'Starter' LIMIT 1;
  IF v_plan_id IS NULL THEN
    RAISE EXCEPTION 'Starter subscription plan not found. Seed plans first.';
  END IF;
  
  -- Check if email is already taken
  IF EXISTS (SELECT 1 FROM users WHERE email = LOWER(p_owner_email)) THEN
    RAISE EXCEPTION 'Email % is already registered.', p_owner_email;
  END IF;

  -- 1. Insert Company
  INSERT INTO companies (name, industry, country, phone, email, plan_id)
  VALUES (p_company_name, p_industry, p_country, p_phone, p_company_email, v_plan_id)
  RETURNING id INTO v_company_id;

  -- 2. Insert Subscription
  INSERT INTO subscriptions (company_id, plan_id, status, current_period_start, current_period_end)
  VALUES (v_company_id, v_plan_id, 'active', now(), now() + interval '30 days');
  
  -- 3. Get global COMPANY_OWNER role ID
  SELECT id INTO v_role_id FROM roles WHERE name = 'COMPANY_OWNER' AND company_id IS NULL;
  IF v_role_id IS NULL THEN
    RAISE EXCEPTION 'COMPANY_OWNER role not found. Seed roles first.';
  END IF;
  
  -- 4. Insert Owner User
  INSERT INTO users (company_id, name, email, password_hash, role_id)
  VALUES (v_company_id, p_owner_name, LOWER(p_owner_email), p_password_hash, v_role_id)
  RETURNING id INTO v_user_id;

  -- 5. Create Audit Log (bypasses RLS limits if run internally, but since RLS is on, this function runs SECURITY DEFINER)
  INSERT INTO audit_logs (company_id, user_id, action, entity_name, entity_id, details)
  VALUES (v_company_id, v_user_id, 'company_registration', 'companies', v_company_id, jsonb_build_object(
    'owner_name', p_owner_name,
    'owner_email', p_owner_email,
    'company_name', p_company_name
  ));

  -- 6. Build and return result object
  v_result := jsonb_build_object(
    'company_id', v_company_id,
    'user_id', v_user_id,
    'role', 'COMPANY_OWNER'
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Transactional similarity search with strict company boundary filter
CREATE OR REPLACE FUNCTION match_embeddings(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  p_company_id uuid
)
RETURNS TABLE (
  id uuid,
  document_id uuid,
  chunk_content text,
  similarity float
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    embeddings.id,
    embeddings.document_id,
    embeddings.chunk_content,
    1 - (embeddings.embedding <=> query_embedding) AS similarity
  FROM embeddings
  WHERE embeddings.company_id = p_company_id -- Mandatory tenant isolation check
    AND 1 - (embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
