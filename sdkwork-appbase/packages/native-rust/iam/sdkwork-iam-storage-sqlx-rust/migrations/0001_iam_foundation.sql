CREATE TABLE IF NOT EXISTS iam_tenant (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS iam_organization (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  parent_organization_id TEXT,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  organization_kind TEXT NOT NULL,
  tenant_boundary_kind TEXT NOT NULL,
  data_boundary_kind TEXT NOT NULL,
  app_boundary_enabled INTEGER NOT NULL DEFAULT 0,
  verification_status TEXT NOT NULL,
  path TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, code)
);

CREATE TABLE IF NOT EXISTS iam_organization_closure (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  ancestor_organization_id TEXT NOT NULL,
  descendant_organization_id TEXT NOT NULL,
  depth INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, ancestor_organization_id, descendant_organization_id)
);

CREATE TABLE IF NOT EXISTS iam_organization_membership (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  membership_kind TEXT NOT NULL,
  employee_no TEXT,
  display_name TEXT,
  is_primary INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  joined_at TEXT NOT NULL,
  left_at TEXT,
  remark TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, organization_id, user_id, membership_kind)
);

CREATE TABLE IF NOT EXISTS iam_department (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  parent_department_id TEXT,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  department_kind TEXT NOT NULL,
  path TEXT NOT NULL,
  cost_center_code TEXT,
  manager_membership_id TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, organization_id, code)
);

CREATE TABLE IF NOT EXISTS iam_department_closure (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  ancestor_department_id TEXT NOT NULL,
  descendant_department_id TEXT NOT NULL,
  depth INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, organization_id, ancestor_department_id, descendant_department_id)
);

CREATE TABLE IF NOT EXISTS iam_department_assignment (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  organization_membership_id TEXT NOT NULL,
  department_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  assignment_kind TEXT NOT NULL,
  is_primary INTEGER NOT NULL DEFAULT 0,
  effective_from TEXT NOT NULL,
  effective_to TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, organization_id, organization_membership_id, department_id, assignment_kind)
);

CREATE TABLE IF NOT EXISTS iam_position (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  department_id TEXT,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  position_kind TEXT NOT NULL,
  rank_level INTEGER,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, organization_id, code)
);

CREATE TABLE IF NOT EXISTS iam_position_assignment (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  department_assignment_id TEXT NOT NULL,
  position_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  is_primary INTEGER NOT NULL DEFAULT 0,
  effective_from TEXT NOT NULL,
  effective_to TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, organization_id, department_assignment_id, position_id)
);

CREATE TABLE IF NOT EXISTS iam_user (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  username TEXT NOT NULL,
  display_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  avatar_media_resource_id TEXT,
  avatar_object_blob_id TEXT,
  avatar_resource_snapshot TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, username)
);

CREATE TABLE IF NOT EXISTS iam_user_identity (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  subject TEXT NOT NULL,
  email TEXT,
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, provider, subject)
);

CREATE TABLE IF NOT EXISTS iam_credential (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  credential_type TEXT NOT NULL,
  credential_hash TEXT NOT NULL,
  status TEXT NOT NULL,
  expires_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS iam_session (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  user_id TEXT NOT NULL,
  app_id TEXT NOT NULL,
  environment TEXT NOT NULL,
  deployment_mode TEXT NOT NULL,
  auth_level TEXT NOT NULL,
  auth_token_hash TEXT NOT NULL,
  access_token_hash TEXT NOT NULL,
  refresh_token_hash TEXT,
  sharding_key TEXT NOT NULL,
  sharding_strategy TEXT NOT NULL,
  data_scope_json TEXT NOT NULL,
  permission_scope_json TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS iam_mfa_factor (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  factor_type TEXT NOT NULL,
  secret_ref TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS iam_device (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  device_fingerprint TEXT NOT NULL,
  name TEXT,
  trusted INTEGER NOT NULL DEFAULT 0,
  last_seen_at TEXT,
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, user_id, device_fingerprint)
);

CREATE TABLE IF NOT EXISTS iam_role (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, code)
);

CREATE TABLE IF NOT EXISTS iam_permission (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS iam_policy (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  policy_json TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, code)
);

CREATE TABLE IF NOT EXISTS iam_role_permission (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  permission_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS iam_role_binding (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  principal_kind TEXT NOT NULL,
  principal_id TEXT NOT NULL,
  scope_kind TEXT NOT NULL,
  scope_id TEXT NOT NULL,
  effect TEXT NOT NULL,
  condition_json TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, role_id, principal_kind, principal_id, scope_kind, scope_id)
);

CREATE TABLE IF NOT EXISTS iam_api_key (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  permission_scope_json TEXT NOT NULL,
  status TEXT NOT NULL,
  expires_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS iam_security_event (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT,
  session_id TEXT,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  detail_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS iam_audit_event (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  actor_user_id TEXT,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  request_id TEXT,
  app_id TEXT,
  environment TEXT,
  sharding_key TEXT,
  detail_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_iam_organization_tenant_parent
  ON iam_organization (tenant_id, parent_organization_id, status);

CREATE INDEX IF NOT EXISTS idx_iam_organization_closure_descendant
  ON iam_organization_closure (tenant_id, descendant_organization_id, ancestor_organization_id, depth);

CREATE INDEX IF NOT EXISTS idx_iam_organization_membership_tenant_user
  ON iam_organization_membership (tenant_id, user_id, organization_id, status);

CREATE INDEX IF NOT EXISTS idx_iam_department_tenant_organization_parent
  ON iam_department (tenant_id, organization_id, parent_department_id, status);

CREATE INDEX IF NOT EXISTS idx_iam_department_closure_descendant
  ON iam_department_closure (tenant_id, organization_id, descendant_department_id, ancestor_department_id, depth);

CREATE INDEX IF NOT EXISTS idx_iam_department_assignment_tenant_user
  ON iam_department_assignment (tenant_id, user_id, organization_id, department_id, status);

CREATE INDEX IF NOT EXISTS idx_iam_position_tenant_organization_department
  ON iam_position (tenant_id, organization_id, department_id, status);

CREATE INDEX IF NOT EXISTS idx_iam_position_assignment_tenant_user
  ON iam_position_assignment (tenant_id, user_id, organization_id, position_id, status);

CREATE INDEX IF NOT EXISTS idx_iam_role_binding_scope
  ON iam_role_binding (tenant_id, scope_kind, scope_id, status);

CREATE INDEX IF NOT EXISTS idx_iam_role_binding_principal
  ON iam_role_binding (tenant_id, principal_kind, principal_id, status);

CREATE INDEX IF NOT EXISTS idx_iam_user_tenant_status
  ON iam_user (tenant_id, status, created_at);

CREATE INDEX IF NOT EXISTS idx_iam_user_identity_tenant_user
  ON iam_user_identity (tenant_id, user_id, provider);

CREATE INDEX IF NOT EXISTS idx_iam_credential_tenant_user_type
  ON iam_credential (tenant_id, user_id, credential_type, status);

CREATE INDEX IF NOT EXISTS idx_iam_session_tenant_user
  ON iam_session (tenant_id, user_id, app_id, revoked_at, expires_at);

CREATE INDEX IF NOT EXISTS idx_iam_session_auth_token_hash
  ON iam_session (auth_token_hash);

CREATE INDEX IF NOT EXISTS idx_iam_session_access_token_hash
  ON iam_session (access_token_hash);

CREATE INDEX IF NOT EXISTS idx_iam_session_refresh_token_hash
  ON iam_session (refresh_token_hash);

CREATE INDEX IF NOT EXISTS idx_iam_role_tenant_status
  ON iam_role (tenant_id, status, code);

CREATE INDEX IF NOT EXISTS idx_iam_role_permission_tenant_permission
  ON iam_role_permission (tenant_id, permission_id, role_id);

CREATE INDEX IF NOT EXISTS idx_iam_api_key_tenant_user_status
  ON iam_api_key (tenant_id, user_id, status);

CREATE INDEX IF NOT EXISTS idx_iam_security_event_tenant_created_at
  ON iam_security_event (tenant_id, created_at, severity);

CREATE INDEX IF NOT EXISTS idx_iam_audit_event_tenant_created_at
  ON iam_audit_event (tenant_id, created_at, action);

CREATE INDEX IF NOT EXISTS idx_iam_audit_event_request_id
  ON iam_audit_event (request_id);
