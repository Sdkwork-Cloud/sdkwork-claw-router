CREATE TABLE IF NOT EXISTS studio_catalog_action (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT,
    request_id VARCHAR(128),
    trace_id VARCHAR(128),
    payload_hash VARCHAR(128),
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    retention_until TIMESTAMPTZ,
    legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    target_type INTEGER,
    target_id BIGINT,
    release_id BIGINT,
    action_type INTEGER,
    rating_score NUMERIC(38, 12),
    review_title VARCHAR(200),
    review_body TEXT,
    client_ip_hash VARCHAR(128),
    user_agent_hash VARCHAR(128)
);

CREATE INDEX IF NOT EXISTS idx_studio_catalog_action_target_type ON studio_catalog_action (target_type, target_id, action_type, created_at, id);
CREATE INDEX IF NOT EXISTS idx_studio_catalog_action_user ON studio_catalog_action (tenant_id, organization_id, user_id, action_type, created_at, id);

CREATE TABLE IF NOT EXISTS studio_catalog_asset (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    target_type INTEGER,
    target_id BIGINT,
    artifact_id BIGINT,
    asset_type INTEGER,
    asset_media_resource_id VARCHAR(128),
    asset_object_blob_id BIGINT,
    asset_resource_snapshot JSONB,
    thumbnail_media_resource_id VARCHAR(128),
    thumbnail_object_blob_id BIGINT,
    thumbnail_resource_snapshot JSONB,
    title VARCHAR(200),
    alt_text VARCHAR(500),
    mime_type VARCHAR(128),
    width INTEGER,
    height INTEGER,
    duration_seconds NUMERIC(38, 12),
    file_size BIGINT,
    sort_order INTEGER,
    published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_studio_catalog_asset_target ON studio_catalog_asset (tenant_id, organization_id, target_type, target_id, asset_type, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_studio_catalog_asset_artifact ON studio_catalog_asset (tenant_id, organization_id, artifact_id, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_studio_catalog_asset_seed_source ON studio_catalog_asset (tenant_id, organization_id, status);
CREATE INDEX IF NOT EXISTS idx_studio_catalog_asset_seed_kind ON studio_catalog_asset (tenant_id, organization_id, target_type);

CREATE TABLE IF NOT EXISTS studio_catalog_artifact (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version VARCHAR(64),
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    target_type INTEGER,
    target_id BIGINT,
    artifact_type INTEGER,
    platform_type VARCHAR(64),
    os_name VARCHAR(64),
    artifact_ref VARCHAR(512),
    artifact_media_resource_id VARCHAR(128),
    artifact_object_blob_id BIGINT,
    artifact_resource_snapshot JSONB,
    artifact_size_bytes BIGINT,
    runtime VARCHAR(128),
    frameworks JSONB,
    license_name VARCHAR(128),
    checksum_hash VARCHAR(128),
    release_notes TEXT,
    published_at TIMESTAMPTZ,
    deprecated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_studio_catalog_artifact_target ON studio_catalog_artifact (tenant_id, organization_id, target_type, target_id, status, published_at, id);
CREATE UNIQUE INDEX IF NOT EXISTS uk_studio_catalog_artifact_version ON studio_catalog_artifact (tenant_id, organization_id, target_type, target_id, artifact_type, version, platform_type, os_name);
CREATE INDEX IF NOT EXISTS idx_studio_catalog_artifact_seed_source ON studio_catalog_artifact (tenant_id, organization_id, status);
CREATE INDEX IF NOT EXISTS idx_studio_catalog_artifact_seed_kind ON studio_catalog_artifact (tenant_id, organization_id, target_type);
