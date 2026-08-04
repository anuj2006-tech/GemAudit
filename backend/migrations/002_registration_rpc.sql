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
