CREATE TABLE IF NOT EXISTS studio_mcp_server (
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
    server_key VARCHAR(128) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id BIGINT,
    category_code VARCHAR(128),
    transport VARCHAR(64) NOT NULL,
    visibility INTEGER NOT NULL DEFAULT 1,
    owner_user_id BIGINT,
    latest_revision_id BIGINT,
    current_revision_id BIGINT,
    health_status VARCHAR(64) NOT NULL DEFAULT 'unchecked',
    last_checked_at TIMESTAMPTZ,
    last_error_masked TEXT,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    published_at TIMESTAMPTZ,
    deprecated_at TIMESTAMPTZ,
    CONSTRAINT uk_studio_mcp_server_key UNIQUE (tenant_id, organization_id, server_key)
);

CREATE INDEX IF NOT EXISTS idx_studio_mcp_server_scope_status ON studio_mcp_server (tenant_id, organization_id, visibility, status, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_studio_mcp_server_category ON studio_mcp_server (tenant_id, organization_id, category_id, status, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_studio_mcp_server_health ON studio_mcp_server (tenant_id, organization_id, health_status, status, updated_at, id);

CREATE TABLE IF NOT EXISTS studio_mcp_server_revision (
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
    server_id BIGINT NOT NULL,
    revision_no VARCHAR(64) NOT NULL,
    transport VARCHAR(64) NOT NULL,
    endpoint_url VARCHAR(1024),
    command VARCHAR(1024),
    args_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    env_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
    auth_type VARCHAR(64) NOT NULL DEFAULT 'none',
    secret_ref VARCHAR(512),
    timeout_ms INTEGER NOT NULL DEFAULT 30000,
    retry_policy JSONB NOT NULL DEFAULT '{}'::jsonb,
    config_hash VARCHAR(128),
    lifecycle_status VARCHAR(64) NOT NULL DEFAULT 'draft',
    created_by BIGINT,
    published_at TIMESTAMPTZ,
    deprecated_at TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    CONSTRAINT uk_studio_mcp_server_revision_no UNIQUE (tenant_id, organization_id, server_id, revision_no)
);

CREATE INDEX IF NOT EXISTS idx_studio_mcp_server_revision_server ON studio_mcp_server_revision (tenant_id, organization_id, server_id, lifecycle_status, created_at, id);
CREATE INDEX IF NOT EXISTS idx_studio_mcp_server_revision_transport ON studio_mcp_server_revision (tenant_id, organization_id, transport, lifecycle_status, created_at, id);

CREATE TABLE IF NOT EXISTS studio_mcp_tool (
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
    server_id BIGINT NOT NULL,
    server_revision_id BIGINT,
    tool_key VARCHAR(128) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    input_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
    risk_level VARCHAR(64) NOT NULL DEFAULT 'low',
    requires_approval BOOLEAN NOT NULL DEFAULT FALSE,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    rate_limit_policy JSONB NOT NULL DEFAULT '{}'::jsonb,
    schema_hash VARCHAR(128),
    discovered_at TIMESTAMPTZ,
    last_invoked_at TIMESTAMPTZ,
    sort_weight INTEGER NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    CONSTRAINT uk_studio_mcp_tool_key UNIQUE (tenant_id, organization_id, server_id, tool_key)
);

CREATE INDEX IF NOT EXISTS idx_studio_mcp_tool_server ON studio_mcp_tool (tenant_id, organization_id, server_id, enabled, sort_weight, id);
CREATE INDEX IF NOT EXISTS idx_studio_mcp_tool_revision ON studio_mcp_tool (tenant_id, organization_id, server_revision_id, discovered_at, id);
CREATE INDEX IF NOT EXISTS idx_studio_mcp_tool_risk ON studio_mcp_tool (tenant_id, organization_id, risk_level, requires_approval, enabled, id);

CREATE TABLE IF NOT EXISTS studio_mcp_binding (
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
    server_id BIGINT NOT NULL,
    server_revision_id BIGINT,
    tool_id BIGINT,
    owner_type VARCHAR(64) NOT NULL,
    owner_id BIGINT NOT NULL,
    allowed_tools JSONB NOT NULL DEFAULT '[]'::jsonb,
    denied_tools JSONB NOT NULL DEFAULT '[]'::jsonb,
    policy_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    priority INTEGER NOT NULL DEFAULT 0,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    snapshot_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_studio_mcp_binding_owner ON studio_mcp_binding (tenant_id, organization_id, owner_type, owner_id, priority, id);
CREATE INDEX IF NOT EXISTS idx_studio_mcp_binding_server ON studio_mcp_binding (tenant_id, organization_id, server_id, server_revision_id, enabled, id);
CREATE INDEX IF NOT EXISTS idx_studio_mcp_binding_tool ON studio_mcp_binding (tenant_id, organization_id, tool_id, enabled, id);
