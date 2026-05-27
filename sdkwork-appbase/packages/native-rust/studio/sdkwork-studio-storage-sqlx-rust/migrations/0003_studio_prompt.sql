CREATE TABLE IF NOT EXISTS studio_prompt (
    id BIGINT PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status INTEGER NOT NULL DEFAULT 1,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    version BIGINT NOT NULL DEFAULT 0,
    prompt_key VARCHAR(128) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id BIGINT,
    category_code VARCHAR(128),
    prompt_type VARCHAR(64) NOT NULL,
    visibility INTEGER NOT NULL DEFAULT 1,
    owner_user_id BIGINT,
    latest_version_id BIGINT,
    current_version_id BIGINT,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    published_at TIMESTAMPTZ,
    deprecated_at TIMESTAMPTZ,
    CONSTRAINT uk_studio_prompt_key UNIQUE (tenant_id, organization_id, prompt_key)
);

CREATE INDEX IF NOT EXISTS idx_studio_prompt_scope_status ON studio_prompt (tenant_id, organization_id, visibility, status, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_studio_prompt_category ON studio_prompt (tenant_id, organization_id, category_id, status, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_studio_prompt_type ON studio_prompt (tenant_id, organization_id, prompt_type, status, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_studio_prompt_owner ON studio_prompt (tenant_id, organization_id, owner_user_id, status, updated_at, id);

CREATE TABLE IF NOT EXISTS studio_prompt_version (
    id BIGINT PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status INTEGER NOT NULL DEFAULT 1,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    version BIGINT NOT NULL DEFAULT 0,
    prompt_id BIGINT NOT NULL,
    version_no VARCHAR(64) NOT NULL,
    title VARCHAR(255),
    content TEXT NOT NULL,
    variable_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
    model_constraints JSONB NOT NULL DEFAULT '{}'::jsonb,
    safety_policy JSONB NOT NULL DEFAULT '{}'::jsonb,
    examples_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    checksum_hash VARCHAR(128),
    lifecycle_status VARCHAR(64) NOT NULL DEFAULT 'draft',
    review_status VARCHAR(64) NOT NULL DEFAULT 'pending',
    review_comment TEXT,
    created_by BIGINT,
    published_at TIMESTAMPTZ,
    deprecated_at TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    CONSTRAINT uk_studio_prompt_version_no UNIQUE (tenant_id, organization_id, prompt_id, version_no)
);

CREATE INDEX IF NOT EXISTS idx_studio_prompt_version_prompt ON studio_prompt_version (tenant_id, organization_id, prompt_id, lifecycle_status, created_at, id);
CREATE INDEX IF NOT EXISTS idx_studio_prompt_version_review ON studio_prompt_version (tenant_id, organization_id, review_status, created_at, id);

CREATE TABLE IF NOT EXISTS studio_prompt_binding (
    id BIGINT PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status INTEGER NOT NULL DEFAULT 1,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    version BIGINT NOT NULL DEFAULT 0,
    prompt_id BIGINT NOT NULL,
    prompt_version_id BIGINT,
    owner_type VARCHAR(64) NOT NULL,
    owner_id BIGINT NOT NULL,
    binding_role VARCHAR(64) NOT NULL,
    priority INTEGER NOT NULL DEFAULT 0,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    policy_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    snapshot_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_studio_prompt_binding_owner ON studio_prompt_binding (tenant_id, organization_id, owner_type, owner_id, binding_role, priority, id);
CREATE INDEX IF NOT EXISTS idx_studio_prompt_binding_prompt ON studio_prompt_binding (tenant_id, organization_id, prompt_id, prompt_version_id, enabled, id);
