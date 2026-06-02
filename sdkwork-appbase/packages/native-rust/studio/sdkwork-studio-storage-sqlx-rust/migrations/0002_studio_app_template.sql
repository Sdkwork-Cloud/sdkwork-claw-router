CREATE TABLE IF NOT EXISTS studio_app_template (
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
    template_no VARCHAR(64) NOT NULL,
    template_code VARCHAR(128) NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id BIGINT,
    category_code VARCHAR(128),
    template_type VARCHAR(64),
    runtime VARCHAR(128),
    framework VARCHAR(128),
    language VARCHAR(64),
    icon_media_resource_id VARCHAR(128),
    icon_object_blob_id BIGINT,
    icon_resource_snapshot JSONB,
    cover_media_resource_id VARCHAR(128),
    cover_object_blob_id BIGINT,
    cover_resource_snapshot JSONB,
    visibility INTEGER NOT NULL DEFAULT 1,
    publish_status INTEGER NOT NULL DEFAULT 1,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    sort_weight INTEGER NOT NULL DEFAULT 0,
    owner_user_id BIGINT,
    source_app_id BIGINT,
    git_repo_url VARCHAR(1024),
    git_ref VARCHAR(128),
    git_sub_path VARCHAR(1024),
    current_version_id BIGINT,
    app_config_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
    default_app_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    variable_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
    dependency_manifest JSONB NOT NULL DEFAULT '[]'::jsonb,
    capability_manifest JSONB NOT NULL DEFAULT '[]'::jsonb,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    published_at TIMESTAMPTZ,
    deprecated_at TIMESTAMPTZ,
    CONSTRAINT uk_studio_app_template_no UNIQUE (tenant_id, template_no),
    CONSTRAINT uk_studio_app_template_code UNIQUE (tenant_id, organization_id, template_code)
);

CREATE INDEX IF NOT EXISTS idx_studio_app_template_scope_status ON studio_app_template (tenant_id, organization_id, visibility, publish_status, status, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_studio_app_template_category ON studio_app_template (tenant_id, organization_id, category_id, publish_status, sort_weight, id);
CREATE INDEX IF NOT EXISTS idx_studio_app_template_type_runtime ON studio_app_template (tenant_id, organization_id, template_type, runtime, framework, status, id);
CREATE INDEX IF NOT EXISTS idx_studio_app_template_git_source ON studio_app_template (tenant_id, organization_id, git_repo_url, git_sub_path, status, id);
CREATE INDEX IF NOT EXISTS idx_studio_app_template_featured ON studio_app_template (tenant_id, organization_id, featured, sort_weight, id);

CREATE TABLE IF NOT EXISTS studio_app_template_version (
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
    template_id BIGINT NOT NULL,
    version_no VARCHAR(64) NOT NULL,
    artifact_id BIGINT,
    changelog TEXT,
    file_manifest JSONB NOT NULL DEFAULT '[]'::jsonb,
    dependency_manifest JSONB NOT NULL DEFAULT '[]'::jsonb,
    capability_manifest JSONB NOT NULL DEFAULT '[]'::jsonb,
    variable_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
    app_config_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
    default_app_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    publish_status INTEGER NOT NULL DEFAULT 1,
    published_at TIMESTAMPTZ,
    deprecated_at TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    CONSTRAINT uk_studio_app_template_version_no UNIQUE (tenant_id, organization_id, template_id, version_no)
);

CREATE INDEX IF NOT EXISTS idx_studio_app_template_version_template ON studio_app_template_version (tenant_id, organization_id, template_id, publish_status, created_at, id);
CREATE INDEX IF NOT EXISTS idx_studio_app_template_version_artifact ON studio_app_template_version (tenant_id, organization_id, artifact_id, status, id);

CREATE TABLE IF NOT EXISTS studio_app_template_usage (
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
    template_id BIGINT NOT NULL,
    template_version_id BIGINT,
    target_app_id BIGINT,
    user_id BIGINT,
    request_id VARCHAR(128),
    usage_type INTEGER NOT NULL DEFAULT 1,
    input_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_studio_app_template_usage_template ON studio_app_template_usage (tenant_id, organization_id, template_id, template_version_id, created_at, id);
CREATE INDEX IF NOT EXISTS idx_studio_app_template_usage_target ON studio_app_template_usage (tenant_id, organization_id, target_app_id, created_at, id);
CREATE INDEX IF NOT EXISTS idx_studio_app_template_usage_user ON studio_app_template_usage (tenant_id, organization_id, user_id, created_at, id);
CREATE INDEX IF NOT EXISTS idx_studio_app_template_usage_request ON studio_app_template_usage (tenant_id, organization_id, request_id, id);
