-- Generated from docs/schema-registry/sdkwork-claw-router.tables.yaml.
-- Do not edit by hand; update Schema Registry and regenerate.

CREATE TABLE IF NOT EXISTS system_installation_state (
    id BIGINT PRIMARY KEY,
    installation_id VARCHAR(64) NOT NULL,
    environment VARCHAR(64) NOT NULL,
    database_engine VARCHAR(32) NOT NULL,
    schema_version VARCHAR(64) NOT NULL,
    catalog_version VARCHAR(128) NOT NULL,
    seed_profile VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL,
    installed_at TIMESTAMPTZ,
    upgraded_at TIMESTAMPTZ,
    last_checked_at TIMESTAMPTZ,
    metadata JSONB NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_system_installation_state_installation_id ON system_installation_state (installation_id);
CREATE INDEX IF NOT EXISTS idx_system_installation_state_env_status ON system_installation_state (environment, status, last_checked_at);

CREATE TABLE IF NOT EXISTS system_schema_migration (
    id BIGINT PRIMARY KEY,
    migration_key VARCHAR(128) NOT NULL,
    migration_version VARCHAR(128) NOT NULL,
    checksum VARCHAR(128) NOT NULL,
    status VARCHAR(32) NOT NULL,
    started_at TIMESTAMPTZ NOT NULL,
    finished_at TIMESTAMPTZ,
    error_message TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_system_schema_migration_key ON system_schema_migration (migration_key);
CREATE INDEX IF NOT EXISTS idx_system_schema_migration_status_started ON system_schema_migration (status, started_at, id);

CREATE TABLE IF NOT EXISTS iam_tenant (
    id VARCHAR(128) PRIMARY KEY,
    code VARCHAR(128) NOT NULL,
    name VARCHAR(256) NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_iam_tenant_code ON iam_tenant (code);
CREATE INDEX IF NOT EXISTS idx_iam_tenant_status_created_at ON iam_tenant (status, created_at);

CREATE TABLE IF NOT EXISTS iam_organization (
    id VARCHAR(128) PRIMARY KEY,
    tenant_id VARCHAR(128) NOT NULL,
    parent_id VARCHAR(128),
    code VARCHAR(128) NOT NULL,
    name VARCHAR(256) NOT NULL,
    path VARCHAR(1024) NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_iam_organization_tenant_code ON iam_organization (tenant_id, code);
CREATE INDEX IF NOT EXISTS idx_iam_organization_tenant_parent ON iam_organization (tenant_id, parent_id, status);
CREATE INDEX IF NOT EXISTS idx_iam_organization_tenant_path ON iam_organization (tenant_id, path, status);

CREATE TABLE IF NOT EXISTS iam_organization_member (
    id VARCHAR(128) PRIMARY KEY,
    tenant_id VARCHAR(128) NOT NULL,
    organization_id VARCHAR(128) NOT NULL,
    user_id VARCHAR(128) NOT NULL,
    role_code VARCHAR(128),
    status VARCHAR(32) NOT NULL,
    joined_at TIMESTAMPTZ NOT NULL,
    left_at TIMESTAMPTZ,
    remark VARCHAR(500)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_iam_organization_member_tenant_org_user ON iam_organization_member (tenant_id, organization_id, user_id);
CREATE INDEX IF NOT EXISTS idx_iam_organization_member_tenant_user ON iam_organization_member (tenant_id, user_id, status);
CREATE INDEX IF NOT EXISTS idx_iam_organization_member_tenant_org ON iam_organization_member (tenant_id, organization_id, status);

CREATE TABLE IF NOT EXISTS iam_user (
    id VARCHAR(128) PRIMARY KEY,
    tenant_id VARCHAR(128) NOT NULL,
    username VARCHAR(128) NOT NULL,
    display_name VARCHAR(128) NOT NULL,
    email VARCHAR(256),
    phone VARCHAR(32),
    avatar_media_resource_id VARCHAR(128),
    avatar_object_blob_id BIGINT,
    avatar_resource_snapshot JSONB,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_iam_user_tenant_username ON iam_user (tenant_id, username);
CREATE INDEX IF NOT EXISTS idx_iam_user_tenant_status ON iam_user (tenant_id, status, created_at);

CREATE TABLE IF NOT EXISTS iam_user_identity (
    id VARCHAR(128) PRIMARY KEY,
    tenant_id VARCHAR(128) NOT NULL,
    user_id VARCHAR(128) NOT NULL,
    provider VARCHAR(64) NOT NULL,
    subject VARCHAR(256) NOT NULL,
    email VARCHAR(256),
    created_at TIMESTAMPTZ NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_iam_user_identity_tenant_provider_subject ON iam_user_identity (tenant_id, provider, subject);
CREATE INDEX IF NOT EXISTS idx_iam_user_identity_tenant_user ON iam_user_identity (tenant_id, user_id, provider);

CREATE TABLE IF NOT EXISTS iam_credential (
    id VARCHAR(128) PRIMARY KEY,
    tenant_id VARCHAR(128) NOT NULL,
    user_id VARCHAR(128) NOT NULL,
    credential_type VARCHAR(32) NOT NULL,
    credential_hash VARCHAR(512) NOT NULL,
    status VARCHAR(32) NOT NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_iam_credential_tenant_user_type ON iam_credential (tenant_id, user_id, credential_type, status);

CREATE TABLE IF NOT EXISTS iam_session (
    id VARCHAR(128) PRIMARY KEY,
    tenant_id VARCHAR(128) NOT NULL,
    organization_id VARCHAR(128),
    user_id VARCHAR(128) NOT NULL,
    app_id VARCHAR(128) NOT NULL,
    environment VARCHAR(32) NOT NULL,
    deployment_mode VARCHAR(32) NOT NULL,
    auth_level VARCHAR(32) NOT NULL,
    auth_token_hash VARCHAR(128) NOT NULL,
    access_token_hash VARCHAR(128) NOT NULL,
    refresh_token_hash VARCHAR(128),
    sharding_key VARCHAR(256) NOT NULL,
    sharding_strategy VARCHAR(64) NOT NULL,
    data_scope_json JSONB NOT NULL,
    permission_scope_json JSONB NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_iam_session_tenant_user ON iam_session (tenant_id, user_id, app_id, revoked_at, expires_at);
CREATE INDEX IF NOT EXISTS idx_iam_session_auth_token_hash ON iam_session (auth_token_hash);
CREATE INDEX IF NOT EXISTS idx_iam_session_access_token_hash ON iam_session (access_token_hash);
CREATE INDEX IF NOT EXISTS idx_iam_session_refresh_token_hash ON iam_session (refresh_token_hash);

CREATE TABLE IF NOT EXISTS iam_mfa_factor (
    id VARCHAR(128) PRIMARY KEY,
    tenant_id VARCHAR(128) NOT NULL,
    user_id VARCHAR(128) NOT NULL,
    factor_type VARCHAR(32) NOT NULL,
    secret_ref VARCHAR(512) NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS iam_device (
    id VARCHAR(128) PRIMARY KEY,
    tenant_id VARCHAR(128) NOT NULL,
    user_id VARCHAR(128) NOT NULL,
    device_fingerprint VARCHAR(256) NOT NULL,
    name VARCHAR(256),
    trusted BOOLEAN NOT NULL,
    last_seen_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_iam_device_tenant_user_fingerprint ON iam_device (tenant_id, user_id, device_fingerprint);

CREATE TABLE IF NOT EXISTS iam_role (
    id VARCHAR(128) PRIMARY KEY,
    tenant_id VARCHAR(128) NOT NULL,
    code VARCHAR(128) NOT NULL,
    name VARCHAR(256) NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_iam_role_tenant_code ON iam_role (tenant_id, code);
CREATE INDEX IF NOT EXISTS idx_iam_role_tenant_status ON iam_role (tenant_id, status, code);

CREATE TABLE IF NOT EXISTS iam_permission (
    id VARCHAR(128) PRIMARY KEY,
    code VARCHAR(128) NOT NULL,
    name VARCHAR(256) NOT NULL,
    resource VARCHAR(128) NOT NULL,
    action VARCHAR(128) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_iam_permission_code ON iam_permission (code);

CREATE TABLE IF NOT EXISTS iam_policy (
    id VARCHAR(128) PRIMARY KEY,
    tenant_id VARCHAR(128) NOT NULL,
    code VARCHAR(128) NOT NULL,
    name VARCHAR(256) NOT NULL,
    policy_json JSONB NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_iam_policy_tenant_code ON iam_policy (tenant_id, code);

CREATE TABLE IF NOT EXISTS iam_role_permission (
    id VARCHAR(128) PRIMARY KEY,
    tenant_id VARCHAR(128) NOT NULL,
    role_id VARCHAR(128) NOT NULL,
    permission_id VARCHAR(128) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_iam_role_permission_tenant_role_permission ON iam_role_permission (tenant_id, role_id, permission_id);
CREATE INDEX IF NOT EXISTS idx_iam_role_permission_tenant_permission ON iam_role_permission (tenant_id, permission_id, role_id);

CREATE TABLE IF NOT EXISTS iam_user_role (
    id VARCHAR(128) PRIMARY KEY,
    tenant_id VARCHAR(128) NOT NULL,
    user_id VARCHAR(128) NOT NULL,
    role_id VARCHAR(128) NOT NULL,
    organization_id VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_iam_user_role_tenant_user_role_org ON iam_user_role (tenant_id, user_id, role_id, organization_id);
CREATE INDEX IF NOT EXISTS idx_iam_user_role_tenant_user ON iam_user_role (tenant_id, user_id, organization_id, role_id);

CREATE TABLE IF NOT EXISTS iam_api_key (
    id VARCHAR(128) PRIMARY KEY,
    tenant_id VARCHAR(128) NOT NULL,
    user_id VARCHAR(128) NOT NULL,
    name VARCHAR(128) NOT NULL,
    key_hash VARCHAR(128) NOT NULL,
    permission_scope_json JSONB NOT NULL,
    status VARCHAR(32) NOT NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_iam_api_key_tenant_user_status ON iam_api_key (tenant_id, user_id, status);

CREATE TABLE IF NOT EXISTS iam_security_event (
    id VARCHAR(128) PRIMARY KEY,
    tenant_id VARCHAR(128) NOT NULL,
    user_id VARCHAR(128),
    session_id VARCHAR(128),
    event_type VARCHAR(64) NOT NULL,
    severity VARCHAR(32) NOT NULL,
    detail_json JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_iam_security_event_tenant_created_at ON iam_security_event (tenant_id, created_at, severity);

CREATE TABLE IF NOT EXISTS iam_audit_event (
    id VARCHAR(128) PRIMARY KEY,
    tenant_id VARCHAR(128) NOT NULL,
    organization_id VARCHAR(128),
    actor_user_id VARCHAR(128),
    action VARCHAR(128) NOT NULL,
    resource_type VARCHAR(128) NOT NULL,
    resource_id VARCHAR(128),
    request_id VARCHAR(128),
    app_id VARCHAR(128),
    environment VARCHAR(32),
    sharding_key VARCHAR(256),
    detail_json JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_iam_audit_event_tenant_created_at ON iam_audit_event (tenant_id, created_at, action);
CREATE INDEX IF NOT EXISTS idx_iam_audit_event_request_id ON iam_audit_event (request_id);

CREATE TABLE IF NOT EXISTS plus_app (
    id BIGINT PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    v BIGINT NOT NULL DEFAULT 0,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    data_scope INTEGER NOT NULL DEFAULT 0,
    user_id BIGINT,
    name VARCHAR(255) NOT NULL,
    icon JSONB,
    resource_list JSONB,
    project_id BIGINT,
    description TEXT,
    version VARCHAR(64),
    icon_media_resource_id VARCHAR(128),
    icon_object_blob_id BIGINT,
    icon_resource_snapshot JSONB,
    access_url VARCHAR(512),
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    status INTEGER NOT NULL DEFAULT 1,
    app_type VARCHAR(64),
    platforms JSONB,
    install_platforms JSONB,
    install_skill JSONB,
    install_config JSONB,
    release_notes JSONB,
    package_name VARCHAR(255),
    bundle_id VARCHAR(255),
    store_url VARCHAR(512),
    artifact_media_resource_id VARCHAR(128),
    artifact_object_blob_id BIGINT,
    artifact_resource_snapshot JSONB
);

CREATE INDEX IF NOT EXISTS idx_app_user_id ON plus_app (user_id);
CREATE INDEX IF NOT EXISTS idx_app_project_id ON plus_app (project_id);
CREATE INDEX IF NOT EXISTS idx_app_status ON plus_app (status);

CREATE TABLE IF NOT EXISTS plus_category (
    id BIGINT PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    v BIGINT NOT NULL DEFAULT 0,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    data_scope INTEGER NOT NULL DEFAULT 0,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    shop_id BIGINT,
    type INTEGER NOT NULL,
    group_name VARCHAR(128),
    code VARCHAR(128),
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    icon_media_resource_id VARCHAR(128),
    icon_object_blob_id BIGINT,
    icon_resource_snapshot JSONB,
    sort_weight INTEGER NOT NULL DEFAULT 0,
    parent_id BIGINT,
    path VARCHAR(1024),
    visible BOOLEAN NOT NULL DEFAULT TRUE,
    status INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_category_shop_id ON plus_category (shop_id);
CREATE INDEX IF NOT EXISTS idx_category_type_shop ON plus_category (type, shop_id);

CREATE TABLE IF NOT EXISTS plus_agent_skill_package (
    id BIGINT PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    v BIGINT NOT NULL DEFAULT 0,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    data_scope INTEGER NOT NULL DEFAULT 0,
    user_id BIGINT,
    package_key VARCHAR(128) NOT NULL,
    name VARCHAR(255) NOT NULL,
    summary VARCHAR(512),
    description VARCHAR(4000),
    icon_media_resource_id VARCHAR(128),
    icon_object_blob_id BIGINT,
    icon_resource_snapshot JSONB,
    cover_media_resource_id VARCHAR(128),
    cover_object_blob_id BIGINT,
    cover_resource_snapshot JSONB,
    category_id BIGINT,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    sort_weight INTEGER NOT NULL DEFAULT 0,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    latest_published_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_plus_agent_skill_package_key ON plus_agent_skill_package (tenant_id, organization_id, package_key);
CREATE INDEX IF NOT EXISTS idx_plus_agent_skill_package_user ON plus_agent_skill_package (user_id);
CREATE INDEX IF NOT EXISTS idx_plus_agent_skill_package_category ON plus_agent_skill_package (category_id);
CREATE INDEX IF NOT EXISTS idx_plus_agent_skill_package_market ON plus_agent_skill_package (enabled, featured, sort_weight);
CREATE INDEX IF NOT EXISTS idx_plus_agent_skill_package_seed_scope ON plus_agent_skill_package (tenant_id, organization_id, data_scope, id, uuid, package_key, name, sort_weight, enabled, featured);

CREATE TABLE IF NOT EXISTS plus_agent_skill (
    id BIGINT PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    v BIGINT NOT NULL DEFAULT 0,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    data_scope INTEGER NOT NULL DEFAULT 0,
    user_id BIGINT,
    skill_key VARCHAR(128) NOT NULL,
    name VARCHAR(255) NOT NULL,
    summary VARCHAR(512),
    description VARCHAR(4000),
    icon_media_resource_id VARCHAR(128),
    icon_object_blob_id BIGINT,
    icon_resource_snapshot JSONB,
    cover_media_resource_id VARCHAR(128),
    cover_object_blob_id BIGINT,
    cover_resource_snapshot JSONB,
    category_id BIGINT,
    package_id BIGINT,
    provider VARCHAR(128),
    version VARCHAR(64),
    version_name VARCHAR(64),
    runtime VARCHAR(64),
    entrypoint VARCHAR(255),
    manifest_url VARCHAR(500),
    repository_url VARCHAR(500),
    homepage_url VARCHAR(500),
    documentation_url VARCHAR(500),
    license_name VARCHAR(128),
    source_type VARCHAR(32) NOT NULL,
    market_status VARCHAR(32) NOT NULL,
    visibility VARCHAR(32) NOT NULL,
    review_status VARCHAR(32) NOT NULL,
    review_comment VARCHAR(1000),
    reviewed_by BIGINT,
    reviewed_at TIMESTAMPTZ,
    builtin BOOLEAN NOT NULL DEFAULT FALSE,
    is_builtin BOOLEAN NOT NULL DEFAULT FALSE,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    recommend_weight INTEGER NOT NULL DEFAULT 0,
    price NUMERIC(38, 12),
    currency VARCHAR(16) NOT NULL DEFAULT 'CNY',
    install_count BIGINT NOT NULL DEFAULT 0,
    rating_avg NUMERIC(38, 12) NOT NULL DEFAULT 0,
    rating_count BIGINT NOT NULL DEFAULT 0,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    capabilities JSONB NOT NULL DEFAULT '[]'::jsonb,
    config_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
    default_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    latest_published_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_plus_agent_skill_key ON plus_agent_skill (tenant_id, organization_id, skill_key);
CREATE INDEX IF NOT EXISTS idx_plus_agent_skill_user ON plus_agent_skill (user_id);
CREATE INDEX IF NOT EXISTS idx_plus_agent_skill_category ON plus_agent_skill (category_id);
CREATE INDEX IF NOT EXISTS idx_plus_agent_skill_package ON plus_agent_skill (package_id);
CREATE INDEX IF NOT EXISTS idx_plus_agent_skill_market ON plus_agent_skill (market_status, visibility, review_status, enabled);
CREATE INDEX IF NOT EXISTS idx_plus_agent_skill_featured ON plus_agent_skill (featured, recommend_weight);
CREATE INDEX IF NOT EXISTS idx_plus_agent_skill_seed_scope ON plus_agent_skill (tenant_id, organization_id, data_scope);
CREATE INDEX IF NOT EXISTS idx_plus_agent_skill_official_seed ON plus_agent_skill (tenant_id, organization_id, data_scope, source_type, provider, market_status, visibility, review_status, builtin, is_builtin, enabled);

CREATE TABLE IF NOT EXISTS plus_user_agent_skill (
    id BIGINT PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    v BIGINT NOT NULL DEFAULT 0,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    data_scope INTEGER NOT NULL DEFAULT 0,
    user_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    installed_at TIMESTAMPTZ,
    last_enabled_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    used_count BIGINT NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_plus_user_agent_skill ON plus_user_agent_skill (tenant_id, organization_id, user_id, skill_id);
CREATE INDEX IF NOT EXISTS idx_plus_user_agent_skill_user ON plus_user_agent_skill (user_id);
CREATE INDEX IF NOT EXISTS idx_plus_user_agent_skill_skill ON plus_user_agent_skill (skill_id);
CREATE INDEX IF NOT EXISTS idx_plus_user_agent_skill_enabled ON plus_user_agent_skill (enabled);

CREATE TABLE IF NOT EXISTS plus_feeds (
    id BIGINT PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    v BIGINT NOT NULL DEFAULT 0,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    data_scope INTEGER NOT NULL DEFAULT 0,
    user_id BIGINT,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    category_id BIGINT NOT NULL DEFAULT 0,
    content_type INTEGER NOT NULL,
    content_id BIGINT NOT NULL,
    cover_resources JSONB,
    resource_list JSONB,
    author JSONB,
    source VARCHAR(100),
    source_url VARCHAR(500),
    publish_time TIMESTAMPTZ,
    tags JSONB,
    status INTEGER NOT NULL DEFAULT 2,
    view_count BIGINT NOT NULL DEFAULT 0,
    like_count BIGINT NOT NULL DEFAULT 0,
    comment_count BIGINT NOT NULL DEFAULT 0,
    share_count BIGINT NOT NULL DEFAULT 0,
    favorite_count BIGINT NOT NULL DEFAULT 0,
    is_top BOOLEAN NOT NULL DEFAULT FALSE,
    is_hot BOOLEAN NOT NULL DEFAULT FALSE,
    is_recommended BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_feeds_status ON plus_feeds (status);
CREATE INDEX IF NOT EXISTS idx_feeds_user_id ON plus_feeds (user_id);
CREATE INDEX IF NOT EXISTS idx_feeds_category_id ON plus_feeds (category_id);
CREATE INDEX IF NOT EXISTS idx_feeds_content_type ON plus_feeds (content_type);
CREATE INDEX IF NOT EXISTS idx_feeds_publish_time ON plus_feeds (publish_time);
CREATE INDEX IF NOT EXISTS idx_feeds_status_publish_time ON plus_feeds (status, publish_time);

CREATE TABLE IF NOT EXISTS plus_comments (
    id BIGINT PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    v BIGINT NOT NULL DEFAULT 0,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    data_scope INTEGER NOT NULL DEFAULT 0,
    user_id BIGINT,
    parent_id BIGINT,
    path VARCHAR(1024),
    sort_weight INTEGER NOT NULL DEFAULT 0,
    content TEXT NOT NULL,
    content_type INTEGER NOT NULL,
    content_id BIGINT NOT NULL,
    status INTEGER NOT NULL DEFAULT 1,
    likes INTEGER NOT NULL DEFAULT 0,
    reply_count INTEGER NOT NULL DEFAULT 0,
    is_top BOOLEAN NOT NULL DEFAULT FALSE,
    ip_address VARCHAR(64),
    device_info VARCHAR(255),
    author JSONB
);

CREATE INDEX IF NOT EXISTS idx_comment_content_id_type ON plus_comments (content_id, content_type);
CREATE INDEX IF NOT EXISTS idx_comment_user_id ON plus_comments (user_id);
CREATE INDEX IF NOT EXISTS idx_comment_status ON plus_comments (status);
CREATE INDEX IF NOT EXISTS idx_comment_parent_id ON plus_comments (parent_id);

CREATE TABLE IF NOT EXISTS plus_content_vote (
    id BIGINT PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    v BIGINT NOT NULL DEFAULT 0,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    data_scope INTEGER NOT NULL DEFAULT 0,
    user_id BIGINT,
    content_type INTEGER NOT NULL,
    content_id BIGINT NOT NULL,
    rating VARCHAR(20) NOT NULL DEFAULT 'like',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    source VARCHAR(50),
    client_ip VARCHAR(50),
    device_info VARCHAR(255)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_vote_user_content ON plus_content_vote (user_id, content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_vote_content ON plus_content_vote (content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_vote_rating ON plus_content_vote (rating);
CREATE INDEX IF NOT EXISTS idx_vote_created_at ON plus_content_vote (created_at);

CREATE TABLE IF NOT EXISTS plus_favorite (
    id BIGINT PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    v BIGINT NOT NULL DEFAULT 0,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    data_scope INTEGER NOT NULL DEFAULT 0,
    user_id BIGINT,
    title VARCHAR(200),
    image JSONB,
    content_type INTEGER NOT NULL,
    content_id BIGINT NOT NULL,
    folder_id BIGINT,
    remark VARCHAR(500),
    tags VARCHAR(500),
    sort_weight INTEGER NOT NULL DEFAULT 0,
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    status INTEGER NOT NULL DEFAULT 1,
    view_count INTEGER NOT NULL DEFAULT 0,
    last_viewed_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_favorite_user_content ON plus_favorite (user_id, content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_favorite_user_id ON plus_favorite (user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_content ON plus_favorite (content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_favorite_folder_id ON plus_favorite (folder_id);
CREATE INDEX IF NOT EXISTS idx_favorite_created_at ON plus_favorite (created_at);

CREATE TABLE IF NOT EXISTS ops_referral_stat_snapshot (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    source_type VARCHAR(128),
    source_id BIGINT,
    source_version BIGINT,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rebuild_version BIGINT NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    inviter_user_id BIGINT,
    inviter_name_snapshot VARCHAR(128),
    inviter_email_snapshot VARCHAR(255),
    invitation_code_id BIGINT,
    invitation_code VARCHAR(64),
    invite_link VARCHAR(512),
    snapshot_period VARCHAR(32),
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    total_invited_count BIGINT,
    direct_invited_count BIGINT,
    secondary_invited_count BIGINT,
    paid_invitee_count BIGINT,
    total_revenue_amount NUMERIC(38, 12),
    reward_awarded_amount NUMERIC(38, 12),
    reward_pending_amount NUMERIC(38, 12),
    currency VARCHAR(10),
    snapshot_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ops_referral_stat_snapshot ON ops_referral_stat_snapshot (tenant_id, organization_id, inviter_user_id, snapshot_period, period_start);
CREATE INDEX IF NOT EXISTS idx_ops_referral_stat_snapshot_period ON ops_referral_stat_snapshot (tenant_id, organization_id, snapshot_period, period_start, total_revenue_amount);
CREATE INDEX IF NOT EXISTS idx_ops_referral_stat_snapshot_code ON ops_referral_stat_snapshot (tenant_id, organization_id, invitation_code);

CREATE TABLE IF NOT EXISTS iam_gateway_api_key (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT NOT NULL,
    owner_type INTEGER,
    owner_id BIGINT,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    legacy_api_key_id BIGINT,
    channel_group_id BIGINT,
    name VARCHAR(128),
    key_prefix VARCHAR(32),
    key_display_masked VARCHAR(64),
    key_hash VARCHAR(128),
    hash_alg VARCHAR(32),
    secret_version BIGINT,
    idempotency_key VARCHAR(128) NOT NULL,
    policy_id BIGINT,
    quota_policy_id BIGINT,
    rate_limit_policy_id BIGINT,
    environment INTEGER,
    expire_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    last_used_ip_hash VARCHAR(128),
    last_used_ip_masked VARCHAR(64),
    last_used_ip_region VARCHAR(128),
    last_revealed_at TIMESTAMPTZ,
    rotated_from_key_id BIGINT,
    revoked_at TIMESTAMPTZ,
    revoked_by BIGINT
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_iam_gateway_api_key_hash ON iam_gateway_api_key (key_hash);
CREATE UNIQUE INDEX IF NOT EXISTS uk_iam_gateway_api_key_legacy ON iam_gateway_api_key (legacy_api_key_id);
CREATE UNIQUE INDEX IF NOT EXISTS uk_iam_gateway_api_key_idempotency ON iam_gateway_api_key (tenant_id, idempotency_key);
CREATE INDEX IF NOT EXISTS idx_iam_gateway_api_key_tenant_user_status ON iam_gateway_api_key (tenant_id, organization_id, user_id, status, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_iam_gateway_api_key_ai_channel_group_status ON iam_gateway_api_key (tenant_id, organization_id, channel_group_id, status, updated_at, id);

CREATE TABLE IF NOT EXISTS ai_channel_group (
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
    group_code VARCHAR(64) NOT NULL,
    group_name VARCHAR(128) NOT NULL,
    description VARCHAR(512),
    provider_code VARCHAR(64),
    group_type VARCHAR(32),
    routing_policy_id BIGINT,
    quota_policy_id BIGINT,
    rate_limit_policy_id BIGINT,
    environment INTEGER,
    pricing_plan_id BIGINT,
    pricing_plan_code VARCHAR(64),
    rate_multiplier NUMERIC(38, 12),
    price_reference_mode INTEGER,
    official_price_multiplier NUMERIC(38, 12),
    billing_type INTEGER,
    capacity_limit BIGINT,
    allowed_origin JSONB
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_channel_group_uuid ON ai_channel_group (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_channel_group_tenant_code ON ai_channel_group (tenant_id, organization_id, group_code);
CREATE INDEX IF NOT EXISTS idx_ai_channel_group_provider_status ON ai_channel_group (tenant_id, organization_id, provider_code, status, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_channel_group_tenant_status_updated ON ai_channel_group (tenant_id, organization_id, status, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_channel_group_pricing ON ai_channel_group (tenant_id, organization_id, pricing_plan_id, status, updated_at, id);

CREATE TABLE IF NOT EXISTS ai_channel_group_member (
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
    channel_group_id BIGINT NOT NULL,
    channel_id BIGINT NOT NULL,
    priority INTEGER NOT NULL DEFAULT 100,
    weight INTEGER NOT NULL DEFAULT 100,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    effective_from TIMESTAMPTZ,
    effective_to TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_channel_group_member_uuid ON ai_channel_group_member (uuid);
CREATE INDEX IF NOT EXISTS idx_ai_channel_group_member_status ON ai_channel_group_member (tenant_id, organization_id, status, channel_group_id, priority, id);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_channel_group_member ON ai_channel_group_member (tenant_id, organization_id, channel_group_id, channel_id);
CREATE INDEX IF NOT EXISTS idx_ai_channel_group_member_group ON ai_channel_group_member (tenant_id, organization_id, channel_group_id, status, priority, weight, id);
CREATE INDEX IF NOT EXISTS idx_ai_channel_group_member_channel ON ai_channel_group_member (tenant_id, organization_id, channel_id, status, id);

CREATE TABLE IF NOT EXISTS ai_channel_group_resource (
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
    channel_group_id BIGINT NOT NULL,
    resource_id BIGINT,
    resource_code VARCHAR(192),
    resource_group_id BIGINT,
    resource_group_code VARCHAR(128),
    grant_type VARCHAR(32) NOT NULL DEFAULT 'allow',
    priority INTEGER NOT NULL DEFAULT 100,
    effective_from TIMESTAMPTZ,
    effective_to TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_channel_group_resource_uuid ON ai_channel_group_resource (uuid);
CREATE INDEX IF NOT EXISTS idx_ai_channel_group_resource_status ON ai_channel_group_resource (tenant_id, organization_id, status, channel_group_id, grant_type, priority, id);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_channel_group_resource ON ai_channel_group_resource (tenant_id, organization_id, channel_group_id, resource_code, resource_group_code);
CREATE INDEX IF NOT EXISTS idx_ai_channel_group_resource_lookup ON ai_channel_group_resource (tenant_id, organization_id, channel_group_id, status, grant_type, priority, id);

CREATE TABLE IF NOT EXISTS ai_channel_group_metric_snapshot (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    source_type VARCHAR(128),
    source_id BIGINT,
    source_version BIGINT,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rebuild_version BIGINT NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    channel_group_id BIGINT,
    group_code VARCHAR(64),
    provider_code VARCHAR(64),
    channel_available_count BIGINT,
    channel_total_count BIGINT,
    capacity_used NUMERIC(38, 12),
    capacity_limit NUMERIC(38, 12),
    request_count_today BIGINT,
    request_count_total BIGINT,
    usage_amount_today NUMERIC(38, 12),
    usage_amount_total NUMERIC(38, 12),
    health_status INTEGER,
    snapshot_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_channel_group_metric_snapshot_uuid ON ai_channel_group_metric_snapshot (uuid);
CREATE INDEX IF NOT EXISTS idx_ai_channel_group_metric_tenant_status ON ai_channel_group_metric_snapshot (tenant_id, organization_id, status, snapshot_at, id);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_channel_group_metric_snapshot ON ai_channel_group_metric_snapshot (tenant_id, organization_id, channel_group_id, snapshot_at);
CREATE INDEX IF NOT EXISTS idx_ai_channel_group_metric_status ON ai_channel_group_metric_snapshot (tenant_id, organization_id, provider_code, health_status, snapshot_at, id);

CREATE TABLE IF NOT EXISTS iam_gateway_access_policy (
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
    name VARCHAR(128),
    policy_type INTEGER,
    subject_type INTEGER,
    subject_id BIGINT,
    subject_ref_hash VARCHAR(128),
    subject_ref_masked VARCHAR(128),
    allowed_capabilities JSONB,
    denied_capabilities JSONB,
    allowed_models JSONB,
    denied_models JSONB,
    network_policy_mode INTEGER,
    ip_rule_count INTEGER,
    ip_allowlist JSONB,
    ip_denylist JSONB,
    region_allowlist JSONB,
    max_context_tokens BIGINT,
    data_retention_mode INTEGER,
    effective_from TIMESTAMPTZ,
    effective_to TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_iam_gateway_access_policy_tenant_subject_status ON iam_gateway_access_policy (tenant_id, organization_id, subject_type, subject_id, status);
CREATE INDEX IF NOT EXISTS idx_iam_gateway_access_policy_subject_ref ON iam_gateway_access_policy (tenant_id, organization_id, subject_type, subject_ref_hash, status);

CREATE TABLE IF NOT EXISTS iam_gateway_risk_rule (
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
    rule_name VARCHAR(128),
    rule_category INTEGER,
    rule_type INTEGER,
    scope_type INTEGER,
    scope_id BIGINT,
    target_type INTEGER,
    target_value VARCHAR(256),
    target_value_hash VARCHAR(128),
    target_value_masked VARCHAR(128),
    target_value_cipher_ref VARCHAR(256),
    match_mode INTEGER,
    reason VARCHAR(512),
    action INTEGER,
    priority INTEGER,
    requests_per_second BIGINT,
    requests_per_minute BIGINT,
    requests_per_day BIGINT,
    tokens_per_minute BIGINT,
    burst_limit NUMERIC(38, 12),
    block_duration_seconds BIGINT,
    effective_from TIMESTAMPTZ,
    effective_to TIMESTAMPTZ,
    hit_count BIGINT,
    last_hit_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_iam_gateway_risk_rule_tenant_target ON iam_gateway_risk_rule (tenant_id, organization_id, rule_type, target_type, target_value);
CREATE INDEX IF NOT EXISTS idx_iam_gateway_risk_rule_scope_priority ON iam_gateway_risk_rule (tenant_id, organization_id, rule_category, scope_type, scope_id, priority, status);
CREATE INDEX IF NOT EXISTS idx_iam_gateway_risk_rule_target_hash ON iam_gateway_risk_rule (tenant_id, organization_id, target_type, target_value_hash, status);

CREATE TABLE IF NOT EXISTS iam_user_preference (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT,
    owner_type INTEGER,
    owner_id BIGINT,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    language VARCHAR(32),
    timezone VARCHAR(64),
    theme_mode INTEGER,
    appearance_config JSONB,
    notification_preferences JSONB,
    default_console_path VARCHAR(256)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_iam_user_preference_user ON iam_user_preference (tenant_id, organization_id, user_id);

CREATE TABLE IF NOT EXISTS iam_user_security_setting (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT,
    owner_type INTEGER,
    owner_id BIGINT,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    mfa_enabled BOOLEAN,
    mfa_method INTEGER,
    password_last_changed_at TIMESTAMPTZ,
    security_level INTEGER,
    trusted_device_count INTEGER,
    last_login_at TIMESTAMPTZ,
    last_login_ip_hash VARCHAR(128),
    third_party_bound_snapshot JSONB
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_iam_user_security_setting_user ON iam_user_security_setting (tenant_id, organization_id, user_id);

CREATE TABLE IF NOT EXISTS iam_user_login_event (
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
    auth_method INTEGER,
    auth_provider VARCHAR(64),
    login_result INTEGER,
    risk_level INTEGER,
    failure_reason_code VARCHAR(128),
    client_ip_hash VARCHAR(128),
    client_ip_masked VARCHAR(64),
    client_ip_region VARCHAR(128),
    device_fingerprint_hash VARCHAR(128),
    device_label VARCHAR(128),
    user_agent_hash VARCHAR(128),
    mfa_verified BOOLEAN,
    session_id_hash VARCHAR(128),
    occurred_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_iam_user_login_event_user_occurred ON iam_user_login_event (tenant_id, organization_id, user_id, occurred_at, id);
CREATE INDEX IF NOT EXISTS idx_iam_user_login_event_result_occurred ON iam_user_login_event (tenant_id, organization_id, login_result, occurred_at, id);

CREATE TABLE IF NOT EXISTS iam_verification_scene_policy (
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
    scene_code VARCHAR(128) NOT NULL,
    scene_name VARCHAR(128),
    allowed_channels JSONB NOT NULL DEFAULT '[]'::jsonb,
    default_channel VARCHAR(32),
    code_length INTEGER NOT NULL DEFAULT 6,
    code_charset VARCHAR(64) NOT NULL DEFAULT 'digits',
    ttl_seconds INTEGER NOT NULL DEFAULT 300,
    resend_interval_seconds INTEGER NOT NULL DEFAULT 60,
    max_send_per_hour INTEGER NOT NULL DEFAULT 5,
    max_verify_attempts INTEGER NOT NULL DEFAULT 5,
    target_binding_required BOOLEAN NOT NULL DEFAULT TRUE,
    template_code VARCHAR(128) NOT NULL,
    risk_policy JSONB NOT NULL DEFAULT '{}'::jsonb,
    rollout_policy JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_iam_verification_scene_policy_scene ON iam_verification_scene_policy (tenant_id, organization_id, scene_code);
CREATE INDEX IF NOT EXISTS idx_iam_verification_scene_policy_status ON iam_verification_scene_policy (tenant_id, organization_id, status, scene_code);

CREATE TABLE IF NOT EXISTS iam_verification_challenge (
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
    code_id VARCHAR(128) NOT NULL,
    scene_code VARCHAR(128) NOT NULL,
    channel VARCHAR(32) NOT NULL,
    target_type VARCHAR(32) NOT NULL,
    target_hash VARCHAR(128) NOT NULL,
    target_masked VARCHAR(128),
    user_id BIGINT,
    code_hash VARCHAR(256) NOT NULL,
    hash_algorithm VARCHAR(64) NOT NULL,
    salt_ref VARCHAR(256),
    delivery_request_id BIGINT,
    policy_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    expires_at TIMESTAMPTZ NOT NULL,
    verified_at TIMESTAMPTZ,
    consumed_at TIMESTAMPTZ,
    challenge_status VARCHAR(32) NOT NULL,
    verify_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_iam_verification_challenge_code_id ON iam_verification_challenge (tenant_id, organization_id, code_id);
CREATE INDEX IF NOT EXISTS idx_iam_verification_challenge_target_scene ON iam_verification_challenge (tenant_id, organization_id, target_type, target_hash, scene_code, created_at);
CREATE INDEX IF NOT EXISTS idx_iam_verification_challenge_delivery ON iam_verification_challenge (tenant_id, organization_id, delivery_request_id);
CREATE INDEX IF NOT EXISTS idx_iam_verification_challenge_expiry ON iam_verification_challenge (tenant_id, organization_id, challenge_status, expires_at);

CREATE TABLE IF NOT EXISTS iam_verification_attempt (
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
    challenge_id BIGINT NOT NULL,
    scene_code VARCHAR(128) NOT NULL,
    target_type VARCHAR(32) NOT NULL,
    target_hash VARCHAR(128) NOT NULL,
    result VARCHAR(32) NOT NULL,
    failure_reason VARCHAR(128),
    ip_hash VARCHAR(128),
    device_hash VARCHAR(128),
    risk_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    occurred_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_iam_verification_attempt_challenge ON iam_verification_attempt (tenant_id, organization_id, challenge_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_iam_verification_attempt_target ON iam_verification_attempt (tenant_id, organization_id, target_type, target_hash, occurred_at);

CREATE TABLE IF NOT EXISTS integration_provider_account (
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
    provider_id BIGINT,
    provider_code VARCHAR(64) NOT NULL DEFAULT '',
    account_code VARCHAR(64) NOT NULL DEFAULT '',
    account_name VARCHAR(128) NOT NULL DEFAULT '',
    account_type VARCHAR(32) NOT NULL DEFAULT 'official',
    channel_type VARCHAR(32) NOT NULL DEFAULT 'official',
    auth_type INTEGER NOT NULL DEFAULT 1,
    credential_profile INTEGER NOT NULL DEFAULT 1,
    auth_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    secret_ref VARCHAR(512),
    secret_hash VARCHAR(128),
    masked_label VARCHAR(128),
    credential_version BIGINT NOT NULL DEFAULT 1,
    base_url VARCHAR(512),
    region_code VARCHAR(64),
    environment INTEGER NOT NULL DEFAULT 1,
    health_status INTEGER NOT NULL DEFAULT 1,
    last_latency_ms INTEGER,
    consecutive_error_count BIGINT NOT NULL DEFAULT 0,
    risk_level INTEGER NOT NULL DEFAULT 1,
    quota_snapshot JSONB,
    last_verified_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    last_rotated_at TIMESTAMPTZ,
    next_rotate_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_integration_provider_account_uuid ON integration_provider_account (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_integration_provider_account_code ON integration_provider_account (tenant_id, organization_id, account_code);
CREATE INDEX IF NOT EXISTS idx_integration_provider_account_provider ON integration_provider_account (tenant_id, organization_id, provider_code, account_type, status, id);
CREATE INDEX IF NOT EXISTS idx_integration_provider_account_secret ON integration_provider_account (tenant_id, organization_id, secret_hash, status, id);
CREATE INDEX IF NOT EXISTS idx_integration_provider_account_health ON integration_provider_account (tenant_id, organization_id, status, health_status, risk_level, id);

CREATE TABLE IF NOT EXISTS ai_provider (
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
    provider_code VARCHAR(64) NOT NULL,
    display_name VARCHAR(128) NOT NULL,
    description VARCHAR(512),
    icon_media_resource_id VARCHAR(128),
    icon_object_blob_id BIGINT,
    icon_resource_snapshot JSONB,
    color_token VARCHAR(64),
    docs_url VARCHAR(512),
    website_url VARCHAR(512),
    default_vendor_code VARCHAR(64),
    provider_type VARCHAR(32),
    protocol_code VARCHAR(64),
    base_url VARCHAR(512),
    auth_type INTEGER,
    resource_schema JSONB,
    metadata_schema_version VARCHAR(32),
    sort_order INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_provider_uuid ON ai_provider (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_provider_tenant_code ON ai_provider (tenant_id, organization_id, provider_code);
CREATE INDEX IF NOT EXISTS idx_ai_provider_status_sort ON ai_provider (tenant_id, organization_id, status, sort_order, id);

CREATE TABLE IF NOT EXISTS ai_site (
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
    site_code VARCHAR(64) NOT NULL,
    site_name VARCHAR(128) NOT NULL,
    display_name VARCHAR(128) NOT NULL,
    description VARCHAR(1024),
    base_url VARCHAR(512),
    website_url VARCHAR(512),
    docs_url VARCHAR(512),
    logo_media_resource_id VARCHAR(128),
    logo_object_blob_id BIGINT,
    logo_resource_snapshot JSONB,
    color_token VARCHAR(64),
    site_type VARCHAR(32) NOT NULL DEFAULT 'relay',
    owner_kind VARCHAR(32),
    region_code VARCHAR(64),
    environment INTEGER NOT NULL DEFAULT 1,
    health_status INTEGER NOT NULL DEFAULT 1,
    last_latency_ms INTEGER,
    consecutive_error_count BIGINT NOT NULL DEFAULT 0,
    last_checked_at TIMESTAMPTZ,
    last_sync_at TIMESTAMPTZ,
    sort_order INTEGER NOT NULL DEFAULT 100
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_site_uuid ON ai_site (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_site_tenant_code ON ai_site (tenant_id, organization_id, site_code);
CREATE INDEX IF NOT EXISTS idx_ai_site_status_sort ON ai_site (tenant_id, organization_id, status, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_ai_site_health_status ON ai_site (tenant_id, organization_id, status, health_status, id);

CREATE TABLE IF NOT EXISTS ai_site_service (
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
    site_id BIGINT NOT NULL,
    site_code VARCHAR(64) NOT NULL,
    service_code VARCHAR(64) NOT NULL,
    service_name VARCHAR(128) NOT NULL,
    service_type VARCHAR(64) NOT NULL DEFAULT 'ai_model_relay',
    protocol_code VARCHAR(64),
    base_url VARCHAR(512),
    auth_type INTEGER NOT NULL DEFAULT 1,
    credential_profile INTEGER NOT NULL DEFAULT 1,
    auth_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    credential_ref VARCHAR(512),
    credential_hash VARCHAR(128),
    masked_label VARCHAR(128),
    credential_version BIGINT NOT NULL DEFAULT 1,
    region_code VARCHAR(64),
    environment INTEGER NOT NULL DEFAULT 1,
    health_status INTEGER NOT NULL DEFAULT 1,
    last_latency_ms INTEGER,
    consecutive_error_count BIGINT NOT NULL DEFAULT 0,
    last_verified_at TIMESTAMPTZ,
    last_sync_at TIMESTAMPTZ,
    sort_order INTEGER NOT NULL DEFAULT 100
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_site_service_uuid ON ai_site_service (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_site_service_site_code ON ai_site_service (tenant_id, organization_id, site_id, service_code);
CREATE INDEX IF NOT EXISTS idx_ai_site_service_site_status ON ai_site_service (tenant_id, organization_id, site_id, status, id);
CREATE INDEX IF NOT EXISTS idx_ai_site_service_type_status ON ai_site_service (tenant_id, organization_id, service_type, status, id);
CREATE INDEX IF NOT EXISTS idx_ai_site_service_health_status ON ai_site_service (tenant_id, organization_id, status, health_status, id);

CREATE TABLE IF NOT EXISTS ai_channel (
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
    provider_id BIGINT,
    provider_code VARCHAR(64),
    site_id BIGINT,
    site_service_id BIGINT,
    site_code VARCHAR(64),
    site_service_code VARCHAR(64),
    site_channel_role VARCHAR(32),
    channel_code VARCHAR(64) NOT NULL,
    channel_name VARCHAR(128) NOT NULL,
    channel_type VARCHAR(32) NOT NULL,
    protocol_code VARCHAR(64),
    auth_type INTEGER,
    credential_profile INTEGER,
    external_channel_id VARCHAR(128),
    base_url VARCHAR(512),
    auth_config JSONB,
    credential_ref VARCHAR(256),
    credential_hash VARCHAR(128),
    credential_version BIGINT,
    credential_rotation_policy JSONB,
    credential_rotation_strategy VARCHAR(64) NOT NULL DEFAULT 'default',
    masked_label VARCHAR(128),
    environment INTEGER,
    region_code VARCHAR(64),
    quota_unit INTEGER,
    quota_limit NUMERIC(38, 12),
    quota_used NUMERIC(38, 12),
    upstream_balance_amount NUMERIC(38, 12),
    upstream_balance_currency VARCHAR(10),
    last_balance_checked_at TIMESTAMPTZ,
    last_rotated_at TIMESTAMPTZ,
    next_rotate_at TIMESTAMPTZ,
    last_verified_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    priority INTEGER NOT NULL DEFAULT 100,
    weight INTEGER NOT NULL DEFAULT 100,
    rpm_limit BIGINT,
    timeout_ms INTEGER,
    retry_policy JSONB,
    circuit_breaker_policy JSONB,
    health_status INTEGER NOT NULL DEFAULT 1,
    last_latency_ms INTEGER,
    consecutive_error_count BIGINT,
    proxy_id BIGINT,
    risk_level INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_channel_uuid ON ai_channel (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_channel_tenant_code ON ai_channel (tenant_id, organization_id, channel_code);
CREATE INDEX IF NOT EXISTS idx_ai_channel_provider_type_status ON ai_channel (tenant_id, organization_id, provider_code, channel_type, status, id);
CREATE INDEX IF NOT EXISTS idx_ai_channel_health_status ON ai_channel (tenant_id, organization_id, status, health_status, priority, weight, id);
CREATE INDEX IF NOT EXISTS idx_ai_channel_site_status ON ai_channel (tenant_id, organization_id, site_id, status, health_status, id);
CREATE INDEX IF NOT EXISTS idx_ai_channel_site_service_status ON ai_channel (tenant_id, organization_id, site_service_id, status, health_status, id);
CREATE INDEX IF NOT EXISTS idx_ai_channel_site_code ON ai_channel (tenant_id, organization_id, site_code, site_service_code, status, id);

CREATE TABLE IF NOT EXISTS ai_channel_credential (
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
    channel_id BIGINT NOT NULL,
    provider_code VARCHAR(64),
    channel_code VARCHAR(64),
    credential_name VARCHAR(128) NOT NULL,
    base_url VARCHAR(512) NOT NULL,
    auth_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    credential_ref VARCHAR(256) NOT NULL,
    credential_hash VARCHAR(128) NOT NULL,
    masked_label VARCHAR(128),
    priority INTEGER NOT NULL DEFAULT 100,
    weight INTEGER NOT NULL DEFAULT 100,
    health_status INTEGER NOT NULL DEFAULT 1,
    last_latency_ms INTEGER,
    consecutive_error_count BIGINT NOT NULL DEFAULT 0,
    last_verified_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_channel_credential_uuid ON ai_channel_credential (uuid);
CREATE INDEX IF NOT EXISTS idx_ai_channel_credential_channel ON ai_channel_credential (tenant_id, organization_id, channel_id, status, priority, weight, id);
CREATE INDEX IF NOT EXISTS idx_ai_channel_credential_ref ON ai_channel_credential (tenant_id, organization_id, credential_ref);

CREATE TABLE IF NOT EXISTS messaging_provider (
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
    provider_code VARCHAR(64) NOT NULL,
    display_name VARCHAR(128) NOT NULL,
    channel VARCHAR(32) NOT NULL DEFAULT 'multi',
    provider_type VARCHAR(64),
    website_url VARCHAR(512),
    docs_url VARCHAR(512),
    icon_media_resource_id VARCHAR(128),
    icon_object_blob_id BIGINT,
    icon_resource_snapshot JSONB,
    metadata_schema_version VARCHAR(32),
    sort_order INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_messaging_provider_code ON messaging_provider (tenant_id, organization_id, provider_code);
CREATE INDEX IF NOT EXISTS idx_messaging_provider_status_sort ON messaging_provider (tenant_id, organization_id, status, sort_order, id);

CREATE TABLE IF NOT EXISTS messaging_provider_account (
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
    metadata JSONB,
    provider_id BIGINT,
    provider_code VARCHAR(64) NOT NULL,
    account_code VARCHAR(64) NOT NULL,
    account_name VARCHAR(128) NOT NULL,
    channel VARCHAR(32) NOT NULL,
    delivery_purpose VARCHAR(64),
    base_url VARCHAR(512),
    auth_type VARCHAR(64),
    credential_ref VARCHAR(256),
    credential_hash VARCHAR(128),
    credential_version BIGINT,
    masked_label VARCHAR(128),
    health_status VARCHAR(32) NOT NULL DEFAULT 'unknown',
    last_verified_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_messaging_provider_account_code ON messaging_provider_account (tenant_id, organization_id, account_code);
CREATE INDEX IF NOT EXISTS idx_messaging_provider_account_provider ON messaging_provider_account (tenant_id, organization_id, provider_code, channel, status, id);

CREATE TABLE IF NOT EXISTS messaging_provider_capability (
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
    provider_code VARCHAR(64) NOT NULL,
    provider_account_id BIGINT NOT NULL DEFAULT 0,
    channel VARCHAR(32) NOT NULL,
    delivery_purpose VARCHAR(64) NOT NULL,
    country_code VARCHAR(16) NOT NULL DEFAULT '*',
    locale VARCHAR(32) NOT NULL DEFAULT '*',
    supports_template_sync BOOLEAN NOT NULL DEFAULT FALSE,
    supports_delivery_receipt BOOLEAN NOT NULL DEFAULT FALSE,
    supports_test_send BOOLEAN NOT NULL DEFAULT FALSE,
    supports_batch_send BOOLEAN NOT NULL DEFAULT FALSE,
    supports_webhook BOOLEAN NOT NULL DEFAULT FALSE,
    sandbox_supported BOOLEAN NOT NULL DEFAULT FALSE,
    capability_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
    rate_limit_policy JSONB NOT NULL DEFAULT '{}'::jsonb,
    health_status VARCHAR(32) NOT NULL DEFAULT 'unknown',
    last_verified_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_messaging_provider_capability_scope ON messaging_provider_capability (tenant_id, organization_id, provider_code, provider_account_id, channel, delivery_purpose, country_code, locale);
CREATE INDEX IF NOT EXISTS idx_messaging_provider_capability_channel ON messaging_provider_capability (tenant_id, organization_id, channel, delivery_purpose, status);

CREATE TABLE IF NOT EXISTS messaging_sender_identity (
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
    provider_account_id BIGINT NOT NULL,
    provider_code VARCHAR(64) NOT NULL,
    channel VARCHAR(32) NOT NULL,
    identity_code VARCHAR(128) NOT NULL,
    display_name VARCHAR(128),
    from_email VARCHAR(256),
    from_name VARCHAR(128),
    reply_to VARCHAR(256),
    domain_name VARCHAR(256),
    sign_name VARCHAR(128),
    sender_id VARCHAR(128),
    country_code VARCHAR(16),
    approval_status VARCHAR(32) NOT NULL DEFAULT 'draft',
    verified_at TIMESTAMPTZ,
    approval_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    rejection_reason VARCHAR(512)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_messaging_sender_identity_code ON messaging_sender_identity (tenant_id, organization_id, provider_account_id, identity_code);
CREATE INDEX IF NOT EXISTS idx_messaging_sender_identity_channel_status ON messaging_sender_identity (tenant_id, organization_id, channel, approval_status, status);

CREATE TABLE IF NOT EXISTS messaging_template (
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
    template_code VARCHAR(128) NOT NULL,
    scene_code VARCHAR(128) NOT NULL,
    channel VARCHAR(32) NOT NULL,
    delivery_purpose VARCHAR(64) NOT NULL,
    category VARCHAR(64) NOT NULL,
    owner_app_id VARCHAR(128),
    template_name VARCHAR(128) NOT NULL,
    description VARCHAR(512),
    current_version_id BIGINT,
    publish_status VARCHAR(32) NOT NULL DEFAULT 'draft'
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_messaging_template_code ON messaging_template (tenant_id, organization_id, template_code);
CREATE INDEX IF NOT EXISTS idx_messaging_template_scene_channel ON messaging_template (tenant_id, organization_id, scene_code, channel, delivery_purpose, status);

CREATE TABLE IF NOT EXISTS messaging_template_version (
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
    template_id BIGINT NOT NULL,
    version_no INTEGER NOT NULL,
    subject_template VARCHAR(512),
    text_template TEXT,
    html_template TEXT,
    variable_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
    render_engine VARCHAR(32) NOT NULL DEFAULT 'handlebars',
    content_hash VARCHAR(128) NOT NULL,
    review_status VARCHAR(32) NOT NULL DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    retired_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_messaging_template_version_no ON messaging_template_version (tenant_id, organization_id, template_id, version_no);
CREATE INDEX IF NOT EXISTS idx_messaging_template_version_status ON messaging_template_version (tenant_id, organization_id, template_id, review_status, published_at);

CREATE TABLE IF NOT EXISTS messaging_template_variant (
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
    template_version_id BIGINT NOT NULL,
    channel VARCHAR(32) NOT NULL,
    locale VARCHAR(32) NOT NULL DEFAULT 'default',
    content_format VARCHAR(32) NOT NULL,
    body_template TEXT NOT NULL,
    length_limit INTEGER,
    provider_payload_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
    render_options JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_messaging_template_variant_locale ON messaging_template_variant (tenant_id, organization_id, template_version_id, channel, locale, content_format);
CREATE INDEX IF NOT EXISTS idx_messaging_template_variant_channel ON messaging_template_variant (tenant_id, organization_id, channel, locale, status);

CREATE TABLE IF NOT EXISTS messaging_template_binding (
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
    template_variant_id BIGINT NOT NULL,
    provider_account_id BIGINT NOT NULL,
    provider_code VARCHAR(64) NOT NULL,
    provider_template_code VARCHAR(128) NOT NULL,
    approval_status VARCHAR(32) NOT NULL DEFAULT 'draft',
    provider_template_version VARCHAR(64),
    last_synced_at TIMESTAMPTZ,
    sync_payload_hash VARCHAR(128),
    rejection_reason VARCHAR(512),
    provider_payload JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_messaging_template_binding_provider ON messaging_template_binding (tenant_id, organization_id, template_variant_id, provider_account_id);
CREATE INDEX IF NOT EXISTS idx_messaging_template_binding_code ON messaging_template_binding (tenant_id, organization_id, provider_code, provider_template_code, approval_status);

CREATE TABLE IF NOT EXISTS messaging_route_rule (
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
    rule_code VARCHAR(128) NOT NULL,
    app_id VARCHAR(128),
    scene_code VARCHAR(128) NOT NULL,
    channel VARCHAR(32) NOT NULL,
    delivery_purpose VARCHAR(64) NOT NULL,
    locale VARCHAR(32) NOT NULL DEFAULT '*',
    country_code VARCHAR(16) NOT NULL DEFAULT '*',
    user_segment VARCHAR(128) NOT NULL DEFAULT '*',
    priority INTEGER NOT NULL DEFAULT 100,
    weight INTEGER NOT NULL DEFAULT 100,
    effective_from TIMESTAMPTZ,
    effective_to TIMESTAMPTZ,
    failover_policy JSONB NOT NULL DEFAULT '{}'::jsonb,
    selection_policy JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_messaging_route_rule_code ON messaging_route_rule (tenant_id, organization_id, rule_code);
CREATE INDEX IF NOT EXISTS idx_messaging_route_rule_lookup ON messaging_route_rule (tenant_id, organization_id, scene_code, channel, delivery_purpose, country_code, locale, user_segment, priority, status);

CREATE TABLE IF NOT EXISTS messaging_route_rule_target (
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
    route_rule_id BIGINT NOT NULL,
    provider_account_id BIGINT NOT NULL,
    provider_code VARCHAR(64) NOT NULL,
    sender_identity_id BIGINT,
    template_binding_id BIGINT,
    target_order INTEGER NOT NULL DEFAULT 1,
    weight INTEGER NOT NULL DEFAULT 100,
    circuit_breaker_policy JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_messaging_route_rule_target_order ON messaging_route_rule_target (tenant_id, organization_id, route_rule_id, target_order);
CREATE INDEX IF NOT EXISTS idx_messaging_route_rule_target_provider ON messaging_route_rule_target (tenant_id, organization_id, provider_account_id, status);

CREATE TABLE IF NOT EXISTS messaging_send_request (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT,
    request_id VARCHAR(128),
    trace_id VARCHAR(128),
    payload_hash VARCHAR(128) NOT NULL,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    retention_until TIMESTAMPTZ,
    legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    request_no VARCHAR(128) NOT NULL,
    idempotency_key VARCHAR(128) NOT NULL,
    app_id VARCHAR(128),
    scene_code VARCHAR(128) NOT NULL,
    channel VARCHAR(32) NOT NULL,
    delivery_purpose VARCHAR(64) NOT NULL,
    target_type VARCHAR(32) NOT NULL,
    target_hash VARCHAR(128) NOT NULL,
    target_masked VARCHAR(128),
    template_version_id BIGINT,
    template_variant_id BIGINT,
    resolved_route_rule_id BIGINT,
    resolved_provider_account_id BIGINT,
    resolved_sender_identity_id BIGINT,
    render_hash VARCHAR(128) NOT NULL,
    request_payload_redacted JSONB NOT NULL DEFAULT '{}'::jsonb,
    dry_run BOOLEAN NOT NULL DEFAULT FALSE,
    delivery_status VARCHAR(32) NOT NULL,
    scheduled_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_messaging_send_request_no ON messaging_send_request (tenant_id, organization_id, request_no);
CREATE UNIQUE INDEX IF NOT EXISTS uk_messaging_send_request_idempotency ON messaging_send_request (tenant_id, organization_id, idempotency_key);
CREATE INDEX IF NOT EXISTS idx_messaging_send_request_scene_status ON messaging_send_request (tenant_id, organization_id, scene_code, channel, delivery_status, created_at);
CREATE INDEX IF NOT EXISTS idx_messaging_send_request_target ON messaging_send_request (tenant_id, organization_id, target_type, target_hash, created_at);

CREATE TABLE IF NOT EXISTS messaging_send_attempt (
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
    send_request_id BIGINT NOT NULL,
    attempt_no INTEGER NOT NULL,
    provider_code VARCHAR(64) NOT NULL,
    provider_account_id BIGINT NOT NULL,
    provider_request_id VARCHAR(256),
    provider_message_id VARCHAR(256),
    http_status INTEGER,
    provider_status VARCHAR(64),
    latency_ms INTEGER,
    failure_code VARCHAR(128),
    failure_message_masked VARCHAR(512),
    retry_after_at TIMESTAMPTZ,
    attempted_at TIMESTAMPTZ NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_messaging_send_attempt_no ON messaging_send_attempt (tenant_id, organization_id, send_request_id, attempt_no);
CREATE INDEX IF NOT EXISTS idx_messaging_send_attempt_provider_message ON messaging_send_attempt (tenant_id, organization_id, provider_code, provider_message_id);
CREATE INDEX IF NOT EXISTS idx_messaging_send_attempt_status ON messaging_send_attempt (tenant_id, organization_id, provider_status, attempted_at);

CREATE TABLE IF NOT EXISTS messaging_delivery_event (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT,
    request_id VARCHAR(128),
    trace_id VARCHAR(128),
    payload_hash VARCHAR(128) NOT NULL,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    retention_until TIMESTAMPTZ,
    legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    send_request_id BIGINT NOT NULL,
    send_attempt_id BIGINT,
    provider_code VARCHAR(64) NOT NULL,
    provider_event_id VARCHAR(256) NOT NULL,
    provider_message_id VARCHAR(256),
    event_type VARCHAR(64) NOT NULL,
    event_at TIMESTAMPTZ NOT NULL,
    payload_redacted JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_messaging_delivery_event_provider ON messaging_delivery_event (tenant_id, organization_id, provider_code, provider_event_id);
CREATE INDEX IF NOT EXISTS idx_messaging_delivery_event_request ON messaging_delivery_event (tenant_id, organization_id, send_request_id, event_at);
CREATE INDEX IF NOT EXISTS idx_messaging_delivery_event_message ON messaging_delivery_event (tenant_id, organization_id, provider_message_id, event_type);

CREATE TABLE IF NOT EXISTS messaging_suppression (
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
    channel VARCHAR(32) NOT NULL,
    target_hash VARCHAR(128) NOT NULL,
    target_masked VARCHAR(128),
    reason_code VARCHAR(128) NOT NULL,
    scope_type VARCHAR(64) NOT NULL DEFAULT 'tenant',
    scope_id VARCHAR(128) NOT NULL DEFAULT '*',
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ,
    source VARCHAR(64) NOT NULL,
    note VARCHAR(512)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_messaging_suppression_scope_target ON messaging_suppression (tenant_id, organization_id, channel, target_hash, scope_type, scope_id, reason_code);
CREATE INDEX IF NOT EXISTS idx_messaging_suppression_active ON messaging_suppression (tenant_id, organization_id, channel, status, starts_at, ends_at);

CREATE TABLE IF NOT EXISTS messaging_rate_limit_bucket (
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
    scene_code VARCHAR(128) NOT NULL,
    channel VARCHAR(32) NOT NULL,
    target_hash VARCHAR(128) NOT NULL DEFAULT '*',
    ip_hash VARCHAR(128) NOT NULL DEFAULT '*',
    device_hash VARCHAR(128) NOT NULL DEFAULT '*',
    window_start TIMESTAMPTZ NOT NULL,
    window_seconds INTEGER NOT NULL,
    send_count INTEGER NOT NULL DEFAULT 0,
    verify_count INTEGER NOT NULL DEFAULT 0,
    reject_count INTEGER NOT NULL DEFAULT 0,
    last_event_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_messaging_rate_limit_bucket_scope ON messaging_rate_limit_bucket (tenant_id, organization_id, scene_code, channel, target_hash, ip_hash, device_hash, window_start, window_seconds);
CREATE INDEX IF NOT EXISTS idx_messaging_rate_limit_bucket_window ON messaging_rate_limit_bucket (tenant_id, organization_id, scene_code, channel, window_start);

CREATE TABLE IF NOT EXISTS open_platform_provider (
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
    provider VARCHAR(64) NOT NULL,
    name VARCHAR(128) NOT NULL,
    icon_media_resource_id VARCHAR(128),
    icon_object_blob_id BIGINT,
    icon_resource_snapshot JSONB,
    docs_url VARCHAR(512),
    website_url VARCHAR(512),
    capabilities JSONB,
    sort_order INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_open_platform_provider_tenant_provider ON open_platform_provider (tenant_id, organization_id, provider);
CREATE INDEX IF NOT EXISTS idx_open_platform_provider_status_sort ON open_platform_provider (tenant_id, organization_id, status, sort_order, id);

CREATE TABLE IF NOT EXISTS open_platform_manifest (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version VARCHAR(32) NOT NULL,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    manifest_key VARCHAR(128) NOT NULL,
    provider VARCHAR(64) NOT NULL,
    account_type VARCHAR(64) NOT NULL,
    capability_schema JSONB,
    callback_schema JSONB,
    entry_schema JSONB,
    sort_order INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_open_platform_manifest_tenant_key ON open_platform_manifest (tenant_id, organization_id, manifest_key);
CREATE INDEX IF NOT EXISTS idx_open_platform_manifest_provider_type ON open_platform_manifest (tenant_id, organization_id, provider, account_type, status, sort_order, id);

CREATE TABLE IF NOT EXISTS open_platform_account (
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
    account_key VARCHAR(128) NOT NULL,
    name VARCHAR(128) NOT NULL,
    provider VARCHAR(64) NOT NULL,
    account_type VARCHAR(64) NOT NULL,
    app_id VARCHAR(128),
    secret_ref VARCHAR(256),
    token_ref VARCHAR(256),
    aes_key_ref VARCHAR(256),
    default_entry_id BIGINT,
    qr_default BOOLEAN
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_open_platform_account_tenant_key ON open_platform_account (tenant_id, organization_id, account_key);
CREATE INDEX IF NOT EXISTS idx_open_platform_account_provider_type_status ON open_platform_account (tenant_id, organization_id, provider, account_type, status, id);

CREATE TABLE IF NOT EXISTS open_platform_entry (
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
    account_id BIGINT NOT NULL,
    entry_key VARCHAR(128) NOT NULL,
    entry_type VARCHAR(64) NOT NULL,
    entry_url VARCHAR(1024) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_open_platform_entry_account_key ON open_platform_entry (tenant_id, organization_id, account_id, entry_key);
CREATE INDEX IF NOT EXISTS idx_open_platform_entry_account_status ON open_platform_entry (tenant_id, organization_id, account_id, status, id);

CREATE TABLE IF NOT EXISTS open_platform_pay_binding (
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
    account_id BIGINT NOT NULL,
    payment_account_id VARCHAR(128) NOT NULL,
    payment_channel_id VARCHAR(128),
    scene VARCHAR(64) NOT NULL,
    mode VARCHAR(64) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_open_platform_pay_binding_account_scene ON open_platform_pay_binding (tenant_id, organization_id, account_id, payment_account_id, scene);
CREATE INDEX IF NOT EXISTS idx_open_platform_pay_binding_account_status ON open_platform_pay_binding (tenant_id, organization_id, account_id, status, id);

CREATE TABLE IF NOT EXISTS ai_channel_model (
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
    channel_id BIGINT,
    model_id BIGINT,
    catalog_key VARCHAR(256),
    model VARCHAR(256),
    vendor_code VARCHAR(64),
    provider_model VARCHAR(256),
    provider_native_model VARCHAR(256),
    api_code VARCHAR(128),
    capability INTEGER,
    model_aliases JSONB,
    default_parameters JSONB,
    max_input_tokens BIGINT,
    max_output_tokens BIGINT,
    supports_streaming BOOLEAN,
    supports_tools BOOLEAN,
    effective_from TIMESTAMPTZ,
    effective_to TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_channel_model_active ON ai_channel_model (tenant_id, organization_id, channel_id, catalog_key, provider_model, capability, effective_from);
CREATE INDEX IF NOT EXISTS idx_ai_channel_model_model_status ON ai_channel_model (tenant_id, organization_id, catalog_key, status, effective_from, id);
CREATE INDEX IF NOT EXISTS idx_ai_channel_model_model_id_status ON ai_channel_model (tenant_id, organization_id, model, status, effective_from, id);
CREATE INDEX IF NOT EXISTS idx_ai_channel_model_vendor_status ON ai_channel_model (tenant_id, organization_id, vendor_code, status, effective_from, id);

CREATE TABLE IF NOT EXISTS ai_site_model (
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
    site_id BIGINT NOT NULL,
    site_service_id BIGINT NOT NULL,
    site_code VARCHAR(64) NOT NULL,
    site_service_code VARCHAR(64),
    service_type VARCHAR(64) NOT NULL DEFAULT 'ai_model_relay',
    model_id BIGINT,
    catalog_key VARCHAR(256),
    model_code VARCHAR(256) NOT NULL,
    model_name VARCHAR(128) NOT NULL,
    display_name VARCHAR(128),
    provider_model VARCHAR(256),
    provider_native_model VARCHAR(256),
    vendor_code VARCHAR(64),
    modality VARCHAR(64),
    capability INTEGER,
    capabilities JSONB,
    model_aliases JSONB,
    default_parameters JSONB,
    context_tokens BIGINT,
    max_input_tokens BIGINT,
    max_output_tokens BIGINT,
    supports_streaming BOOLEAN,
    supports_tools BOOLEAN,
    supports_json_schema BOOLEAN,
    pricing_snapshot JSONB,
    health_status INTEGER NOT NULL DEFAULT 1,
    last_latency_ms INTEGER,
    consecutive_error_count BIGINT NOT NULL DEFAULT 0,
    last_sync_at TIMESTAMPTZ,
    effective_from TIMESTAMPTZ,
    effective_to TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_site_model_uuid ON ai_site_model (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_site_model_service_model ON ai_site_model (tenant_id, organization_id, site_id, site_service_id, model_code);
CREATE INDEX IF NOT EXISTS idx_ai_site_model_site_status ON ai_site_model (tenant_id, organization_id, site_id, status, model_code, id);
CREATE INDEX IF NOT EXISTS idx_ai_site_model_service_status ON ai_site_model (tenant_id, organization_id, site_service_id, status, model_code, id);
CREATE INDEX IF NOT EXISTS idx_ai_site_model_catalog_status ON ai_site_model (tenant_id, organization_id, catalog_key, status, id);

CREATE TABLE IF NOT EXISTS integration_proxy (
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
    proxy_code VARCHAR(64),
    proxy_type INTEGER,
    endpoint VARCHAR(512),
    secret_ref VARCHAR(256),
    secret_hash VARCHAR(128),
    region VARCHAR(64),
    health_status INTEGER,
    last_checked_at TIMESTAMPTZ,
    description VARCHAR(512)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_integration_proxy_tenant_code ON integration_proxy (tenant_id, organization_id, proxy_code);

CREATE TABLE IF NOT EXISTS integration_webhook_endpoint (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT,
    owner_type INTEGER,
    owner_id BIGINT,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    endpoint_code VARCHAR(64),
    name VARCHAR(128),
    target_url VARCHAR(1024),
    secret_ref VARCHAR(256),
    secret_hash VARCHAR(128),
    event_types JSONB,
    signing_alg VARCHAR(64),
    retry_policy JSONB,
    last_success_at TIMESTAMPTZ,
    last_failure_at TIMESTAMPTZ,
    failure_count BIGINT
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_integration_webhook_endpoint_tenant_code ON integration_webhook_endpoint (tenant_id, organization_id, endpoint_code);
CREATE INDEX IF NOT EXISTS idx_integration_webhook_endpoint_tenant_status ON integration_webhook_endpoint (tenant_id, organization_id, status, updated_at, id);

CREATE TABLE IF NOT EXISTS integration_provider_health_snapshot (
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
    provider_id BIGINT,
    channel_id BIGINT,
    provider_account_id BIGINT,
    check_type INTEGER,
    health_status INTEGER,
    latency_ms INTEGER,
    http_status INTEGER,
    error_code VARCHAR(128),
    error_message_masked VARCHAR(1024),
    quota_snapshot JSONB,
    checked_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_integration_provider_health_provider_time ON integration_provider_health_snapshot (provider_id, checked_at, id);
CREATE INDEX IF NOT EXISTS idx_integration_provider_health_channel_time ON integration_provider_health_snapshot (channel_id, checked_at, id);

CREATE TABLE IF NOT EXISTS ai_model_vendor (
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
    vendor_code VARCHAR(64) NOT NULL,
    display_name VARCHAR(128) NOT NULL,
    legal_name VARCHAR(256),
    description VARCHAR(512),
    website_url VARCHAR(512),
    docs_url VARCHAR(512),
    logo_media_resource_id VARCHAR(128),
    logo_object_blob_id BIGINT,
    logo_resource_snapshot JSONB,
    icon_media_resource_id VARCHAR(128),
    icon_object_blob_id BIGINT,
    icon_resource_snapshot JSONB,
    color_token VARCHAR(64),
    country_region VARCHAR(64),
    vendor_type INTEGER,
    model_families JSONB,
    capabilities JSONB,
    supported_protocols JSONB,
    client_api_compatibility JSONB,
    open_source BOOLEAN,
    sort_order INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_vendor_uuid ON ai_model_vendor (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_vendor_tenant_code ON ai_model_vendor (tenant_id, organization_id, vendor_code);
CREATE INDEX IF NOT EXISTS idx_ai_model_vendor_tenant_status_sort ON ai_model_vendor (tenant_id, organization_id, status, sort_order, id);

CREATE TABLE IF NOT EXISTS ai_modality (
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
    modality_code VARCHAR(64) NOT NULL,
    display_name VARCHAR(128) NOT NULL,
    modality_group VARCHAR(64),
    description VARCHAR(512),
    input_supported BOOLEAN,
    output_supported BOOLEAN,
    sort_order INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_modality_uuid ON ai_modality (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_modality_tenant_code ON ai_modality (tenant_id, organization_id, modality_code);
CREATE INDEX IF NOT EXISTS idx_ai_modality_status_sort ON ai_modality (tenant_id, organization_id, status, sort_order, id);

CREATE TABLE IF NOT EXISTS ai_api_endpoint (
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
    endpoint_code VARCHAR(128) NOT NULL,
    protocol_code VARCHAR(64) NOT NULL,
    display_name VARCHAR(128),
    method VARCHAR(16),
    path_template VARCHAR(256) NOT NULL,
    request_schema JSONB,
    response_schema JSONB,
    streaming_supported BOOLEAN,
    sort_order INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_api_endpoint_uuid ON ai_api_endpoint (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_api_endpoint_tenant_code ON ai_api_endpoint (tenant_id, organization_id, endpoint_code);
CREATE INDEX IF NOT EXISTS idx_ai_api_endpoint_status_sort ON ai_api_endpoint (tenant_id, organization_id, status, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_ai_api_endpoint_protocol_status ON ai_api_endpoint (tenant_id, organization_id, protocol_code, status, sort_order, id);

CREATE TABLE IF NOT EXISTS ai_vendor_modality (
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
    vendor_id BIGINT,
    vendor_code VARCHAR(64) NOT NULL,
    modality_id BIGINT,
    modality_code VARCHAR(64) NOT NULL,
    supported BOOLEAN,
    sort_order INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_vendor_modality_uuid ON ai_vendor_modality (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_vendor_modality ON ai_vendor_modality (tenant_id, organization_id, vendor_code, modality_code);
CREATE INDEX IF NOT EXISTS idx_ai_vendor_modality_status_sort ON ai_vendor_modality (tenant_id, organization_id, status, sort_order, id);

CREATE TABLE IF NOT EXISTS ai_vendor_api_endpoint (
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
    vendor_id BIGINT,
    vendor_code VARCHAR(64) NOT NULL,
    api_endpoint_id BIGINT,
    endpoint_code VARCHAR(128) NOT NULL,
    supported BOOLEAN,
    sort_order INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_vendor_api_endpoint_uuid ON ai_vendor_api_endpoint (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_vendor_api_endpoint ON ai_vendor_api_endpoint (tenant_id, organization_id, vendor_code, endpoint_code);
CREATE INDEX IF NOT EXISTS idx_ai_vendor_api_endpoint_status_sort ON ai_vendor_api_endpoint (tenant_id, organization_id, status, sort_order, id);

CREATE TABLE IF NOT EXISTS ai_modality_api_endpoint (
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
    modality_id BIGINT,
    modality_code VARCHAR(64) NOT NULL,
    api_endpoint_id BIGINT,
    endpoint_code VARCHAR(128) NOT NULL,
    supported BOOLEAN,
    sort_order INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_modality_api_endpoint_uuid ON ai_modality_api_endpoint (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_modality_api_endpoint ON ai_modality_api_endpoint (tenant_id, organization_id, modality_code, endpoint_code);
CREATE INDEX IF NOT EXISTS idx_ai_modality_api_endpoint_status_sort ON ai_modality_api_endpoint (tenant_id, organization_id, status, sort_order, id);

CREATE TABLE IF NOT EXISTS ai_model_modality (
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
    model_id BIGINT,
    catalog_key VARCHAR(256) NOT NULL,
    model VARCHAR(256),
    vendor_code VARCHAR(64),
    modality_id BIGINT,
    modality_code VARCHAR(64) NOT NULL,
    direction VARCHAR(32),
    supported BOOLEAN,
    sort_order INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_modality_uuid ON ai_model_modality (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_modality ON ai_model_modality (tenant_id, organization_id, catalog_key, modality_code, direction);
CREATE INDEX IF NOT EXISTS idx_ai_model_modality_status_sort ON ai_model_modality (tenant_id, organization_id, status, sort_order, id);

CREATE TABLE IF NOT EXISTS ai_model_api_endpoint (
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
    model_id BIGINT,
    catalog_key VARCHAR(256) NOT NULL,
    model VARCHAR(256),
    vendor_code VARCHAR(64),
    api_endpoint_id BIGINT,
    endpoint_code VARCHAR(128) NOT NULL,
    provider_native_model VARCHAR(256),
    default_parameters JSONB,
    supports_streaming BOOLEAN,
    supported BOOLEAN,
    sort_order INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_api_endpoint_uuid ON ai_model_api_endpoint (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_api_endpoint ON ai_model_api_endpoint (tenant_id, organization_id, catalog_key, endpoint_code);
CREATE INDEX IF NOT EXISTS idx_ai_model_api_endpoint_status_sort ON ai_model_api_endpoint (tenant_id, organization_id, status, sort_order, id);

CREATE TABLE IF NOT EXISTS ai_resource (
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
    resource_code VARCHAR(192) NOT NULL,
    resource_type VARCHAR(64) NOT NULL,
    display_name VARCHAR(128),
    vendor_id BIGINT,
    vendor_code VARCHAR(64),
    modality_id BIGINT,
    modality_code VARCHAR(64),
    api_endpoint_id BIGINT,
    api_code VARCHAR(128),
    model_id BIGINT,
    model_code VARCHAR(256),
    catalog_key VARCHAR(256),
    model VARCHAR(256),
    provider_native_model VARCHAR(256),
    resource_schema JSONB,
    metadata_schema JSONB,
    description VARCHAR(512),
    sort_order INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_resource_uuid ON ai_resource (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_resource_tenant_code ON ai_resource (tenant_id, organization_id, resource_code);
CREATE INDEX IF NOT EXISTS idx_ai_resource_status_sort ON ai_resource (tenant_id, organization_id, status, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_ai_resource_type_status ON ai_resource (tenant_id, organization_id, resource_type, status, id);
CREATE INDEX IF NOT EXISTS idx_ai_resource_vendor_model ON ai_resource (tenant_id, organization_id, vendor_code, catalog_key, status, id);

CREATE TABLE IF NOT EXISTS ai_resource_group (
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
    group_code VARCHAR(128) NOT NULL,
    group_name VARCHAR(128) NOT NULL,
    group_type VARCHAR(64),
    selection_mode VARCHAR(32),
    description VARCHAR(512),
    sort_order INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_resource_group_uuid ON ai_resource_group (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_resource_group_tenant_code ON ai_resource_group (tenant_id, organization_id, group_code);
CREATE INDEX IF NOT EXISTS idx_ai_resource_group_status_sort ON ai_resource_group (tenant_id, organization_id, status, sort_order, id);

CREATE TABLE IF NOT EXISTS ai_resource_group_item (
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
    resource_group_id BIGINT NOT NULL,
    resource_group_code VARCHAR(128),
    item_type VARCHAR(32) NOT NULL,
    resource_id BIGINT,
    resource_code VARCHAR(192),
    child_resource_group_id BIGINT,
    child_resource_group_code VARCHAR(128),
    item_role VARCHAR(32),
    sort_order INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_resource_group_item_uuid ON ai_resource_group_item (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_resource_group_item ON ai_resource_group_item (tenant_id, organization_id, resource_group_id, item_type, resource_code, child_resource_group_code);
CREATE INDEX IF NOT EXISTS idx_ai_resource_group_item_status_sort ON ai_resource_group_item (tenant_id, organization_id, status, resource_group_id, sort_order, id);

CREATE TABLE IF NOT EXISTS ai_channel_vendor (
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
    channel_id BIGINT NOT NULL,
    provider_code VARCHAR(64),
    channel_code VARCHAR(64),
    vendor_id BIGINT,
    vendor_code VARCHAR(64) NOT NULL,
    channel_type VARCHAR(32),
    supported BOOLEAN,
    sort_order INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_channel_vendor_uuid ON ai_channel_vendor (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_channel_vendor ON ai_channel_vendor (tenant_id, organization_id, channel_id, vendor_code);
CREATE INDEX IF NOT EXISTS idx_ai_channel_vendor_status ON ai_channel_vendor (tenant_id, organization_id, status, channel_id, id);

CREATE TABLE IF NOT EXISTS ai_channel_resource (
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
    channel_id BIGINT NOT NULL,
    provider_code VARCHAR(64),
    channel_code VARCHAR(64),
    resource_id BIGINT,
    resource_code VARCHAR(192),
    resource_group_id BIGINT,
    resource_group_code VARCHAR(128),
    grant_type VARCHAR(32) NOT NULL DEFAULT 'allow',
    priority INTEGER NOT NULL DEFAULT 100,
    weight INTEGER NOT NULL DEFAULT 100,
    effective_from TIMESTAMPTZ,
    effective_to TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_channel_resource_uuid ON ai_channel_resource (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_channel_resource ON ai_channel_resource (tenant_id, organization_id, channel_id, resource_code, resource_group_code);
CREATE INDEX IF NOT EXISTS idx_ai_channel_resource_lookup ON ai_channel_resource (tenant_id, organization_id, status, channel_id, grant_type, priority, id);

CREATE TABLE IF NOT EXISTS ai_channel_endpoint (
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
    channel_id BIGINT NOT NULL,
    provider_code VARCHAR(64),
    channel_code VARCHAR(64) NOT NULL,
    channel_type VARCHAR(32) NOT NULL,
    vendor_id BIGINT,
    vendor_code VARCHAR(64) NOT NULL,
    region_code VARCHAR(64) NOT NULL,
    api_endpoint_id BIGINT,
    api_code VARCHAR(128) NOT NULL,
    base_url VARCHAR(512) NOT NULL,
    path_prefix VARCHAR(256),
    priority INTEGER NOT NULL DEFAULT 100,
    weight INTEGER NOT NULL DEFAULT 100,
    timeout_ms INTEGER,
    retry_policy JSONB,
    health_status INTEGER NOT NULL DEFAULT 1,
    last_latency_ms INTEGER,
    consecutive_error_count BIGINT,
    effective_from TIMESTAMPTZ,
    effective_to TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_channel_endpoint_uuid ON ai_channel_endpoint (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_channel_endpoint_scope ON ai_channel_endpoint (tenant_id, organization_id, channel_id, vendor_code, region_code, api_code);
CREATE INDEX IF NOT EXISTS idx_ai_channel_endpoint_lookup ON ai_channel_endpoint (tenant_id, organization_id, status, channel_id, vendor_code, region_code, api_code, priority, weight, id);
CREATE INDEX IF NOT EXISTS idx_ai_channel_endpoint_channel ON ai_channel_endpoint (tenant_id, organization_id, channel_id, status, channel_type, id);

CREATE TABLE IF NOT EXISTS ai_route_candidate (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    source_type VARCHAR(128),
    source_id BIGINT,
    source_version BIGINT,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rebuild_version BIGINT NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    channel_group_id BIGINT,
    channel_id BIGINT,
    endpoint_id BIGINT,
    provider_code VARCHAR(64),
    channel_type VARCHAR(32),
    vendor_code VARCHAR(64),
    api_code VARCHAR(128),
    model_code VARCHAR(256),
    catalog_key VARCHAR(256),
    region_code VARCHAR(64),
    priority INTEGER,
    weight INTEGER,
    health_status INTEGER,
    config_version BIGINT,
    refreshed_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_route_candidate_uuid ON ai_route_candidate (uuid);
CREATE INDEX IF NOT EXISTS idx_ai_route_candidate_status ON ai_route_candidate (tenant_id, organization_id, status, channel_group_id, api_code, catalog_key, region_code, id);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_route_candidate_scope ON ai_route_candidate (tenant_id, organization_id, channel_group_id, channel_id, endpoint_id, api_code, catalog_key, region_code);
CREATE INDEX IF NOT EXISTS idx_ai_route_candidate_model ON ai_route_candidate (tenant_id, organization_id, channel_group_id, api_code, catalog_key, region_code, status, health_status, priority, weight, id);
CREATE INDEX IF NOT EXISTS idx_ai_route_candidate_api ON ai_route_candidate (tenant_id, organization_id, channel_group_id, api_code, status, health_status, priority, weight, id);

CREATE TABLE IF NOT EXISTS ai_resource_route_profile (
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
    resource_id BIGINT,
    resource_code VARCHAR(192) NOT NULL,
    route_key VARCHAR(192) NOT NULL,
    http_method VARCHAR(16),
    path_pattern VARCHAR(512),
    capability INTEGER,
    billing_meter_code VARCHAR(64),
    model_requirement VARCHAR(32) NOT NULL DEFAULT 'ignored',
    route_strategy VARCHAR(64) NOT NULL DEFAULT 'stateless_failover',
    failure_strategy VARCHAR(64) NOT NULL DEFAULT 'fail_closed',
    selection_strategy VARCHAR(64) NOT NULL DEFAULT 'priority_weighted',
    sticky_object_type VARCHAR(64),
    sticky_scope VARCHAR(64),
    parent_object_types JSONB,
    request_extractors JSONB,
    response_bindings JSONB,
    endpoint_failover_scope VARCHAR(64) NOT NULL DEFAULT 'same_channel',
    idempotency_mode VARCHAR(32) NOT NULL DEFAULT 'none',
    cache_ttl_seconds BIGINT,
    sort_order INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_resource_route_profile_uuid ON ai_resource_route_profile (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_resource_route_profile_route ON ai_resource_route_profile (tenant_id, organization_id, resource_code, route_key);
CREATE INDEX IF NOT EXISTS idx_ai_resource_route_profile_lookup ON ai_resource_route_profile (tenant_id, organization_id, status, route_key, resource_code, id);
CREATE INDEX IF NOT EXISTS idx_ai_resource_route_profile_strategy ON ai_resource_route_profile (tenant_id, organization_id, status, route_strategy, model_requirement, id);

CREATE TABLE IF NOT EXISTS ai_provider_object_route (
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
    api_key_id BIGINT,
    channel_group_id BIGINT,
    object_type VARCHAR(64) NOT NULL,
    object_id VARCHAR(256) NOT NULL,
    object_key_hash VARCHAR(128) NOT NULL,
    parent_object_type VARCHAR(64),
    parent_object_id VARCHAR(256),
    provider_code VARCHAR(64),
    channel_id BIGINT NOT NULL,
    endpoint_id BIGINT,
    vendor_code VARCHAR(64),
    api_code VARCHAR(128),
    catalog_key VARCHAR(256),
    provider_model VARCHAR(256),
    region_code VARCHAR(64),
    sticky_scope VARCHAR(64),
    expires_at TIMESTAMPTZ,
    last_seen_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_provider_object_route_uuid ON ai_provider_object_route (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_provider_object_route_object ON ai_provider_object_route (tenant_id, organization_id, object_type, object_id);
CREATE INDEX IF NOT EXISTS idx_ai_provider_object_route_fast ON ai_provider_object_route (tenant_id, organization_id, object_key_hash, status, id);
CREATE INDEX IF NOT EXISTS idx_ai_provider_object_route_parent ON ai_provider_object_route (tenant_id, organization_id, parent_object_type, parent_object_id, status, id);
CREATE INDEX IF NOT EXISTS idx_ai_provider_object_route_channel ON ai_provider_object_route (tenant_id, organization_id, channel_group_id, channel_id, status, id);
CREATE INDEX IF NOT EXISTS idx_ai_provider_object_route_expiry ON ai_provider_object_route (tenant_id, organization_id, expires_at, status, id);

CREATE TABLE IF NOT EXISTS ai_route_idempotency (
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
    api_key_id BIGINT NOT NULL,
    channel_group_id BIGINT,
    idempotency_key VARCHAR(256) NOT NULL,
    request_hash VARCHAR(128) NOT NULL,
    route_strategy VARCHAR(64),
    channel_id BIGINT,
    endpoint_id BIGINT,
    object_type VARCHAR(64),
    object_id VARCHAR(256),
    response_status INTEGER,
    expires_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_route_idempotency_uuid ON ai_route_idempotency (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_route_idempotency_key ON ai_route_idempotency (tenant_id, organization_id, api_key_id, idempotency_key);
CREATE INDEX IF NOT EXISTS idx_ai_route_idempotency_lookup ON ai_route_idempotency (tenant_id, organization_id, api_key_id, idempotency_key, status, id);
CREATE INDEX IF NOT EXISTS idx_ai_route_idempotency_expiry ON ai_route_idempotency (tenant_id, organization_id, expires_at, status, id);

CREATE TABLE IF NOT EXISTS ai_config_version (
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
    config_scope VARCHAR(64) NOT NULL,
    config_version BIGINT NOT NULL DEFAULT 0,
    changed_object_type VARCHAR(64),
    changed_object_id BIGINT,
    published_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_config_version_uuid ON ai_config_version (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_config_version_scope ON ai_config_version (tenant_id, organization_id, config_scope);
CREATE INDEX IF NOT EXISTS idx_ai_config_version_scope_updated ON ai_config_version (tenant_id, organization_id, config_scope, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_config_version_scope_status ON ai_config_version (config_scope, status, deleted_at, id);

CREATE TABLE IF NOT EXISTS ai_config_change_event (
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
    config_scope VARCHAR(64) NOT NULL,
    changed_object_type VARCHAR(64),
    changed_object_id BIGINT,
    config_version BIGINT NOT NULL,
    event_status VARCHAR(32) NOT NULL DEFAULT 'pending',
    event_payload JSONB,
    published_at TIMESTAMPTZ,
    publish_attempts INTEGER NOT NULL DEFAULT 0,
    last_error_message VARCHAR(512)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_config_change_event_uuid ON ai_config_change_event (uuid);
CREATE INDEX IF NOT EXISTS idx_ai_config_change_event_pending ON ai_config_change_event (tenant_id, organization_id, event_status, created_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_config_change_event_scope_version ON ai_config_change_event (tenant_id, organization_id, config_scope, config_version, id);

CREATE TABLE IF NOT EXISTS ai_model_family (
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
    vendor_id BIGINT,
    vendor_code VARCHAR(64) NOT NULL,
    family_code VARCHAR(64) NOT NULL,
    display_name VARCHAR(128),
    description VARCHAR(512),
    docs_url VARCHAR(512),
    icon_media_resource_id VARCHAR(128),
    icon_object_blob_id BIGINT,
    icon_resource_snapshot JSONB,
    color_token VARCHAR(64),
    family_type INTEGER,
    primary_modality INTEGER,
    model_count BIGINT,
    default_model_id BIGINT,
    default_model VARCHAR(256),
    sort_order INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_family_uuid ON ai_model_family (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_family_tenant_vendor_code ON ai_model_family (tenant_id, organization_id, vendor_code, family_code);
CREATE INDEX IF NOT EXISTS idx_ai_model_family_tenant_status_sort ON ai_model_family (tenant_id, organization_id, status, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_family_vendor_status_sort ON ai_model_family (tenant_id, organization_id, vendor_code, status, sort_order, id);

CREATE TABLE IF NOT EXISTS ai_model (
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
    catalog_key VARCHAR(256) NOT NULL,
    model VARCHAR(256),
    display_name VARCHAR(128),
    vendor_id BIGINT,
    vendor_code VARCHAR(64) NOT NULL,
    vendor_name_snapshot VARCHAR(128),
    family_id BIGINT,
    family_code VARCHAR(64),
    provider_hint VARCHAR(64),
    model_family VARCHAR(128),
    model_version VARCHAR(64),
    model_aliases JSONB,
    capability INTEGER,
    capabilities JSONB,
    modalities JSONB,
    input_modalities JSONB,
    output_modalities JSONB,
    icon_media_resource_id VARCHAR(128),
    icon_object_blob_id BIGINT,
    icon_resource_snapshot JSONB,
    color_token VARCHAR(64),
    docs_url VARCHAR(1024),
    license_type INTEGER,
    api_format VARCHAR(128),
    capability_intro TEXT,
    limitations JSONB,
    supported_languages JSONB,
    use_cases JSONB,
    training_data_cutoff VARCHAR(128),
    context_tokens BIGINT,
    max_input_tokens BIGINT,
    max_output_tokens BIGINT,
    max_duration_seconds INTEGER,
    supports_streaming BOOLEAN,
    supports_tools BOOLEAN,
    supports_json_schema BOOLEAN,
    performance_profile JSONB,
    default_pricing_id BIGINT,
    rank_score NUMERIC(38, 12),
    release_stage INTEGER,
    shelf_state INTEGER,
    routing_state INTEGER,
    deprecated_at TIMESTAMPTZ,
    retired_at TIMESTAMPTZ,
    replacement_model VARCHAR(256),
    description TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_uuid ON ai_model (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_tenant_catalog_key ON ai_model (tenant_id, organization_id, catalog_key);
CREATE INDEX IF NOT EXISTS idx_ai_model_tenant_status_updated ON ai_model (tenant_id, organization_id, status, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_vendor_status ON ai_model (tenant_id, organization_id, vendor_code, status, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_model_status ON ai_model (tenant_id, organization_id, model, status, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_family_status ON ai_model (tenant_id, organization_id, vendor_code, family_code, status, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_capability_status ON ai_model (tenant_id, organization_id, capability, status, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_public_listing ON ai_model (tenant_id, organization_id, shelf_state, routing_state, release_stage, status, rank_score, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_public_rank_desc ON ai_model (tenant_id, organization_id, status, routing_state, shelf_state, rank_score, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_catalog_search ON ai_model (tenant_id, organization_id, status, vendor_code, capability, routing_state, shelf_state, display_name, id);

CREATE TABLE IF NOT EXISTS ai_model_capability (
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
    model_id BIGINT,
    catalog_key VARCHAR(256) NOT NULL,
    model VARCHAR(256),
    vendor_code VARCHAR(64),
    capability INTEGER,
    capability_code VARCHAR(64),
    modality INTEGER,
    input_modalities JSONB,
    output_modalities JSONB,
    endpoint_formats JSONB,
    parameter_name VARCHAR(128),
    parameter_schema JSONB,
    supported BOOLEAN,
    limit_unit VARCHAR(64),
    limit_value VARCHAR(128),
    schema_version VARCHAR(32),
    sort_order INTEGER,
    description VARCHAR(512)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_capability_uuid ON ai_model_capability (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_capability_model_code ON ai_model_capability (tenant_id, organization_id, model_id, capability_code, modality, parameter_name);
CREATE INDEX IF NOT EXISTS idx_ai_model_capability_tenant_status ON ai_model_capability (tenant_id, organization_id, status, model_id, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_capability_vendor_capability ON ai_model_capability (tenant_id, organization_id, vendor_code, capability, supported, id);

CREATE TABLE IF NOT EXISTS ai_model_catalog_source (
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
    source_code VARCHAR(96) NOT NULL,
    vendor_code VARCHAR(64),
    region_code VARCHAR(64),
    provider_code VARCHAR(64),
    source_name VARCHAR(128) NOT NULL,
    source_url VARCHAR(1024),
    source_kind INTEGER NOT NULL,
    trust_level INTEGER NOT NULL,
    parser_kind VARCHAR(64) NOT NULL,
    refresh_interval_seconds BIGINT,
    last_observed_at TIMESTAMPTZ,
    last_success_at TIMESTAMPTZ,
    catalog_version VARCHAR(128),
    source_hash VARCHAR(128),
    raw_payload_ref VARCHAR(512),
    normalized_payload_hash VARCHAR(128),
    schema_version VARCHAR(32),
    error_message_masked VARCHAR(1024)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_catalog_source_uuid ON ai_model_catalog_source (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_catalog_source_tenant_code ON ai_model_catalog_source (tenant_id, organization_id, source_code);
CREATE INDEX IF NOT EXISTS idx_ai_model_catalog_source_tenant_status ON ai_model_catalog_source (tenant_id, organization_id, status, source_kind, last_success_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_catalog_source_vendor_region_status ON ai_model_catalog_source (tenant_id, organization_id, vendor_code, region_code, status, last_observed_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_catalog_source_refresh ON ai_model_catalog_source (tenant_id, organization_id, status, refresh_interval_seconds, last_success_at, id);

CREATE TABLE IF NOT EXISTS ai_model_catalog_sync_run (
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
    source_type VARCHAR(128),
    source_id BIGINT,
    source_version BIGINT,
    source_code VARCHAR(96) NOT NULL,
    vendor_code VARCHAR(64),
    region_code VARCHAR(64),
    provider_code VARCHAR(64),
    run_status INTEGER NOT NULL,
    started_at TIMESTAMPTZ NOT NULL,
    finished_at TIMESTAMPTZ,
    observed_at TIMESTAMPTZ,
    catalog_version VARCHAR(128),
    source_hash VARCHAR(128),
    observed_vendor_count BIGINT,
    observed_model_count BIGINT,
    observed_meter_count BIGINT,
    observed_price_count BIGINT,
    accepted_count BIGINT,
    rejected_count BIGINT,
    skipped_count BIGINT,
    change_summary JSONB,
    error_message_masked VARCHAR(1024)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_catalog_sync_run_uuid ON ai_model_catalog_sync_run (uuid);
CREATE INDEX IF NOT EXISTS idx_ai_model_catalog_sync_run_tenant_status ON ai_model_catalog_sync_run (tenant_id, organization_id, status, started_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_catalog_sync_run_source_latest ON ai_model_catalog_sync_run (tenant_id, organization_id, source_code, run_status, started_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_catalog_sync_run_vendor_region_latest ON ai_model_catalog_sync_run (tenant_id, organization_id, vendor_code, region_code, run_status, started_at, id);

CREATE TABLE IF NOT EXISTS ai_billing_meter (
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
    meter_code VARCHAR(64) NOT NULL,
    display_name VARCHAR(128) NOT NULL,
    description VARCHAR(512),
    modality INTEGER,
    usage_type INTEGER,
    billing_mode INTEGER NOT NULL,
    default_unit INTEGER NOT NULL,
    default_unit_size NUMERIC(38, 12) NOT NULL,
    quantity_precision INTEGER,
    quantity_source INTEGER,
    aggregation_mode INTEGER,
    result_selector VARCHAR(256),
    supports_tier BOOLEAN,
    supports_expression BOOLEAN,
    allow_negative_quantity BOOLEAN,
    canonical_price_item_type INTEGER,
    sort_order INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_billing_meter_uuid ON ai_billing_meter (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_billing_meter_tenant_code ON ai_billing_meter (tenant_id, organization_id, meter_code);
CREATE INDEX IF NOT EXISTS idx_ai_billing_meter_tenant_status_sort ON ai_billing_meter (tenant_id, organization_id, status, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_ai_billing_meter_modality_mode ON ai_billing_meter (tenant_id, organization_id, modality, billing_mode, status, sort_order, id);

CREATE TABLE IF NOT EXISTS ai_model_pricing (
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
    model_id BIGINT,
    catalog_key VARCHAR(256) NOT NULL,
    model VARCHAR(256),
    vendor_code VARCHAR(64),
    region_code VARCHAR(64) NOT NULL,
    provider_code VARCHAR(64),
    channel_id BIGINT,
    provider_model VARCHAR(256),
    platform_code VARCHAR(64),
    service_tier VARCHAR(64),
    price_side INTEGER,
    pricing_scope INTEGER,
    pricing_scope_id BIGINT,
    pricing_plan_id BIGINT,
    pricing_plan_code VARCHAR(64),
    billing_type INTEGER,
    billing_mode INTEGER,
    billing_meter_id BIGINT,
    billing_meter_code VARCHAR(64),
    price_item_type INTEGER,
    unit INTEGER,
    unit_size NUMERIC(38, 12),
    metering_mode INTEGER,
    quantity_source INTEGER,
    quantity_formula TEXT,
    result_selector VARCHAR(256),
    minimum_quantity NUMERIC(38, 12),
    quantity_step NUMERIC(38, 12),
    included_quantity NUMERIC(38, 12),
    unit_price NUMERIC(38, 12),
    currency VARCHAR(10),
    rounding_mode INTEGER,
    min_charge_amount NUMERIC(38, 12),
    reference_price_id BIGINT,
    reference_price_side INTEGER,
    reference_multiplier NUMERIC(38, 12),
    markup_amount NUMERIC(38, 12),
    pricing_formula_mode INTEGER,
    price_origin INTEGER,
    import_snapshot_id BIGINT,
    priority INTEGER,
    price_version VARCHAR(64),
    source_url VARCHAR(512),
    source_hash VARCHAR(128),
    published_at TIMESTAMPTZ,
    observed_at TIMESTAMPTZ,
    effective_from TIMESTAMPTZ,
    effective_to TIMESTAMPTZ,
    source_price_id BIGINT
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_pricing_uuid ON ai_model_pricing (uuid);
CREATE INDEX IF NOT EXISTS idx_ai_model_pricing_tenant_status_effective ON ai_model_pricing (tenant_id, organization_id, status, effective_from, effective_to, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_pricing_lookup ON ai_model_pricing (tenant_id, organization_id, catalog_key, price_side, pricing_scope, pricing_scope_id, billing_mode, billing_meter_code, status, effective_from, effective_to);
CREATE INDEX IF NOT EXISTS idx_ai_model_pricing_vendor_region_model ON ai_model_pricing (tenant_id, organization_id, vendor_code, region_code, catalog_key, price_side, status, effective_from, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_pricing_provider_channel ON ai_model_pricing (tenant_id, organization_id, provider_code, channel_id, catalog_key, price_side, status, effective_from, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_pricing_plan_effective ON ai_model_pricing (tenant_id, organization_id, pricing_plan_id, catalog_key, price_side, status, effective_from, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_pricing_meter_effective ON ai_model_pricing (tenant_id, organization_id, billing_meter_code, price_side, status, effective_from, id);

CREATE TABLE IF NOT EXISTS ai_pricing_plan (
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
    plan_code VARCHAR(64) NOT NULL,
    plan_name VARCHAR(128) NOT NULL,
    description VARCHAR(512),
    plan_scope INTEGER,
    base_price_side INTEGER NOT NULL,
    base_pricing_scope INTEGER,
    default_reference_price_id BIGINT,
    default_multiplier NUMERIC(38, 12),
    default_markup_amount NUMERIC(38, 12),
    currency VARCHAR(10) NOT NULL,
    billing_mode INTEGER,
    rounding_mode INTEGER,
    min_charge_amount NUMERIC(38, 12),
    fallback_mode INTEGER,
    priority INTEGER,
    price_version VARCHAR(64),
    effective_from TIMESTAMPTZ NOT NULL,
    effective_to TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_pricing_plan_uuid ON ai_pricing_plan (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_pricing_plan_tenant_code ON ai_pricing_plan (tenant_id, organization_id, plan_code);
CREATE INDEX IF NOT EXISTS idx_ai_pricing_plan_scope_status ON ai_pricing_plan (tenant_id, organization_id, plan_scope, status, priority, id);
CREATE INDEX IF NOT EXISTS idx_ai_pricing_plan_effective ON ai_pricing_plan (tenant_id, organization_id, status, effective_from, effective_to, id);

CREATE TABLE IF NOT EXISTS ai_pricing_plan_binding (
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
    pricing_plan_id BIGINT NOT NULL,
    pricing_plan_code VARCHAR(64),
    subject_type INTEGER NOT NULL,
    subject_id BIGINT,
    subject_code VARCHAR(128),
    binding_source INTEGER,
    multiplier_override NUMERIC(38, 12),
    rpm_override BIGINT,
    tpm_override BIGINT,
    quota_policy_id BIGINT,
    priority INTEGER NOT NULL,
    effective_from TIMESTAMPTZ NOT NULL,
    effective_to TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_pricing_plan_binding_uuid ON ai_pricing_plan_binding (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_pricing_plan_binding_subject ON ai_pricing_plan_binding (tenant_id, organization_id, subject_type, subject_id, pricing_plan_id);
CREATE INDEX IF NOT EXISTS idx_ai_pricing_plan_binding_tenant_status_effective ON ai_pricing_plan_binding (tenant_id, organization_id, status, effective_from, priority, id);
CREATE INDEX IF NOT EXISTS idx_ai_pricing_plan_binding_subject_effective ON ai_pricing_plan_binding (tenant_id, organization_id, subject_type, subject_id, status, effective_from, id);
CREATE INDEX IF NOT EXISTS idx_ai_pricing_plan_binding_plan ON ai_pricing_plan_binding (tenant_id, organization_id, pricing_plan_id, status, priority, id);

CREATE TABLE IF NOT EXISTS ai_pricing_rule (
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
    pricing_plan_id BIGINT NOT NULL,
    pricing_plan_code VARCHAR(64),
    rule_code VARCHAR(64) NOT NULL,
    rule_name VARCHAR(128),
    match_type INTEGER,
    vendor_code VARCHAR(64),
    family_code VARCHAR(64),
    model_id BIGINT,
    model VARCHAR(256),
    provider_code VARCHAR(64),
    channel_id BIGINT,
    provider_model VARCHAR(256),
    capability_code VARCHAR(64),
    platform_code VARCHAR(64),
    service_tier VARCHAR(64),
    region VARCHAR(64),
    price_side INTEGER,
    reference_price_side INTEGER,
    reference_pricing_id BIGINT,
    reference_pricing_scope INTEGER,
    price_item_type INTEGER,
    billing_type INTEGER,
    billing_mode INTEGER,
    billing_meter_id BIGINT,
    billing_meter_code VARCHAR(64) NOT NULL,
    unit INTEGER,
    unit_size NUMERIC(38, 12),
    metering_mode INTEGER,
    quantity_source INTEGER,
    quantity_formula TEXT,
    result_selector VARCHAR(256),
    minimum_quantity NUMERIC(38, 12),
    quantity_step NUMERIC(38, 12),
    included_quantity NUMERIC(38, 12),
    formula_mode INTEGER NOT NULL,
    multiplier NUMERIC(38, 12),
    markup_amount NUMERIC(38, 12),
    unit_price_override NUMERIC(38, 12),
    expression TEXT,
    expression_hash VARCHAR(128),
    fallback_mode INTEGER,
    priority INTEGER NOT NULL,
    effective_from TIMESTAMPTZ NOT NULL,
    effective_to TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_pricing_rule_uuid ON ai_pricing_rule (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_pricing_rule_plan_code ON ai_pricing_rule (tenant_id, organization_id, pricing_plan_id, rule_code);
CREATE INDEX IF NOT EXISTS idx_ai_pricing_rule_tenant_status_priority ON ai_pricing_rule (tenant_id, organization_id, status, priority, effective_from, id);
CREATE INDEX IF NOT EXISTS idx_ai_pricing_rule_model_lookup ON ai_pricing_rule (tenant_id, organization_id, pricing_plan_id, model, provider_code, channel_id, billing_meter_code, status, priority, id);
CREATE INDEX IF NOT EXISTS idx_ai_pricing_rule_meter_lookup ON ai_pricing_rule (tenant_id, organization_id, pricing_plan_id, billing_meter_code, match_type, status, priority, id);
CREATE INDEX IF NOT EXISTS idx_ai_pricing_rule_reference ON ai_pricing_rule (tenant_id, organization_id, reference_price_side, reference_pricing_id, status, id);

CREATE TABLE IF NOT EXISTS ai_pricing_tier (
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
    pricing_rule_id BIGINT,
    model_pricing_id BIGINT,
    tier_code VARCHAR(64) NOT NULL,
    tier_label VARCHAR(64),
    price_item_type INTEGER,
    billing_mode INTEGER,
    billing_meter_id BIGINT,
    billing_meter_code VARCHAR(64) NOT NULL,
    min_quantity NUMERIC(38, 12),
    max_quantity NUMERIC(38, 12),
    quantity_unit INTEGER,
    quantity_step NUMERIC(38, 12),
    included_quantity NUMERIC(38, 12),
    result_selector VARCHAR(256),
    input_unit_price NUMERIC(38, 12),
    output_unit_price NUMERIC(38, 12),
    cache_write_unit_price NUMERIC(38, 12),
    cache_read_unit_price NUMERIC(38, 12),
    image_unit_price NUMERIC(38, 12),
    audio_unit_price NUMERIC(38, 12),
    video_unit_price NUMERIC(38, 12),
    per_request_price NUMERIC(38, 12),
    multiplier NUMERIC(38, 12),
    currency VARCHAR(10),
    sort_order INTEGER NOT NULL,
    effective_from TIMESTAMPTZ NOT NULL,
    effective_to TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_pricing_tier_uuid ON ai_pricing_tier (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_pricing_tier_rule_code ON ai_pricing_tier (tenant_id, organization_id, pricing_rule_id, tier_code);
CREATE INDEX IF NOT EXISTS idx_ai_pricing_tier_tenant_status_effective ON ai_pricing_tier (tenant_id, organization_id, status, effective_from, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_ai_pricing_tier_rule_range ON ai_pricing_tier (tenant_id, organization_id, pricing_rule_id, billing_meter_code, min_quantity, max_quantity, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_ai_pricing_tier_model_pricing ON ai_pricing_tier (tenant_id, organization_id, model_pricing_id, price_item_type, sort_order, id);

CREATE TABLE IF NOT EXISTS ai_pricing_import_snapshot (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT,
    request_id VARCHAR(128) NOT NULL,
    trace_id VARCHAR(128),
    payload_hash VARCHAR(128),
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    retention_until TIMESTAMPTZ,
    legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    import_source INTEGER NOT NULL,
    source_name VARCHAR(128) NOT NULL,
    source_url VARCHAR(1024),
    source_version VARCHAR(128),
    source_hash VARCHAR(128) NOT NULL,
    upstream_commit VARCHAR(128),
    data_format VARCHAR(64),
    row_count BIGINT,
    accepted_count BIGINT,
    rejected_count BIGINT,
    currency VARCHAR(10),
    published_at TIMESTAMPTZ,
    observed_at TIMESTAMPTZ NOT NULL,
    raw_payload_ref VARCHAR(512),
    normalized_payload_hash VARCHAR(128),
    schema_version VARCHAR(32),
    error_message_masked VARCHAR(1024)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_pricing_import_snapshot_uuid ON ai_pricing_import_snapshot (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_pricing_import_snapshot_hash ON ai_pricing_import_snapshot (tenant_id, organization_id, import_source, source_hash);
CREATE INDEX IF NOT EXISTS idx_ai_pricing_import_snapshot_tenant_latest ON ai_pricing_import_snapshot (tenant_id, organization_id, status, import_source, observed_at, id);

CREATE TABLE IF NOT EXISTS ai_model_rank_snapshot (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    source_type VARCHAR(128),
    source_id BIGINT,
    source_version BIGINT,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rebuild_version BIGINT NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    snapshot_date DATE,
    snapshot_period INTEGER,
    rank_scope VARCHAR(64),
    model_id BIGINT,
    catalog_key VARCHAR(256) NOT NULL,
    model VARCHAR(256),
    vendor_code VARCHAR(64),
    region_code VARCHAR(64) NOT NULL,
    vendor_name_snapshot VARCHAR(128),
    provider_code VARCHAR(64),
    modality INTEGER,
    rank_no INTEGER,
    previous_rank_no INTEGER,
    base_volume BIGINT,
    cost_indicator INTEGER,
    context_size_text VARCHAR(64),
    is_new BOOLEAN,
    color_token VARCHAR(64),
    pricing_text VARCHAR(128),
    license_type INTEGER,
    strengths JSONB,
    request_count BIGINT,
    token_count BIGINT,
    cost_amount NUMERIC(38, 12),
    currency VARCHAR(10),
    latency_p50_ms INTEGER,
    latency_p95_ms INTEGER,
    success_rate NUMERIC(38, 12),
    win_rate NUMERIC(38, 12),
    trend_score NUMERIC(38, 12),
    rank_payload JSONB
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_rank_snapshot_uuid ON ai_model_rank_snapshot (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_rank_snapshot_scope_catalog_key ON ai_model_rank_snapshot (tenant_id, organization_id, snapshot_date, snapshot_period, rank_scope, vendor_code, region_code, catalog_key);
CREATE INDEX IF NOT EXISTS idx_ai_model_rank_snapshot_tenant_rank ON ai_model_rank_snapshot (tenant_id, organization_id, status, snapshot_date, snapshot_period, rank_scope, rank_no);
CREATE INDEX IF NOT EXISTS idx_ai_model_rank_snapshot_vendor_region_rank ON ai_model_rank_snapshot (tenant_id, organization_id, snapshot_date, snapshot_period, vendor_code, region_code, rank_no);
CREATE INDEX IF NOT EXISTS idx_ai_model_rank_snapshot_latest_scope ON ai_model_rank_snapshot (tenant_id, organization_id, status, rank_scope, snapshot_date, snapshot_period, rank_no);
CREATE INDEX IF NOT EXISTS idx_ai_model_rank_snapshot_filter_rank ON ai_model_rank_snapshot (tenant_id, organization_id, status, snapshot_date, snapshot_period, rank_scope, vendor_code, region_code, modality, rank_no);

CREATE TABLE IF NOT EXISTS ai_routing_policy (
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
    policy_code VARCHAR(64),
    name VARCHAR(128),
    policy_scope INTEGER,
    subject_id BIGINT,
    capability INTEGER,
    default_profile_id BIGINT,
    fallback_mode INTEGER,
    slo_latency_ms INTEGER,
    slo_success_rate NUMERIC(38, 12),
    cost_ceiling NUMERIC(38, 12),
    currency VARCHAR(10)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_routing_policy_tenant_code ON ai_routing_policy (tenant_id, organization_id, policy_code);

CREATE TABLE IF NOT EXISTS ai_routing_profile (
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
    policy_id BIGINT,
    profile_version BIGINT,
    profile_name VARCHAR(128),
    release_status INTEGER,
    traffic_percent NUMERIC(38, 12),
    config_hash VARCHAR(128),
    published_at TIMESTAMPTZ,
    published_by BIGINT,
    rollback_from_profile_id BIGINT
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_routing_profile_policy_version ON ai_routing_profile (policy_id, profile_version);

CREATE TABLE IF NOT EXISTS ai_routing_rule (
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
    profile_id BIGINT,
    rule_code VARCHAR(64),
    priority INTEGER,
    match_expression JSONB,
    target_model VARCHAR(256),
    candidate_channels JSONB,
    fallback_chain JSONB,
    constraints JSONB,
    rate_limit_policy_id BIGINT,
    effective_from TIMESTAMPTZ,
    effective_to TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_routing_rule_profile_code ON ai_routing_rule (profile_id, rule_code);
CREATE INDEX IF NOT EXISTS idx_ai_routing_rule_tenant_profile_priority ON ai_routing_rule (tenant_id, organization_id, profile_id, priority, status);

CREATE TABLE IF NOT EXISTS ai_routing_decision_log (
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
    api_key_id BIGINT,
    legacy_api_key_id BIGINT,
    policy_id BIGINT,
    profile_id BIGINT,
    rule_id BIGINT,
    requested_model VARCHAR(256),
    resolved_model VARCHAR(256),
    capability INTEGER,
    selected_provider_id BIGINT,
    selected_channel_id BIGINT,
    selected_account_id BIGINT,
    decision_mode INTEGER,
    decision_reason JSONB,
    candidate_snapshot JSONB,
    fallback_chain JSONB,
    decision_latency_ms INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_routing_decision_log_request ON ai_routing_decision_log (tenant_id, organization_id, request_id);
CREATE INDEX IF NOT EXISTS idx_ai_routing_decision_tenant_model_created ON ai_routing_decision_log (tenant_id, organization_id, requested_model, created_at, id);

CREATE TABLE IF NOT EXISTS ai_request_trace (
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
    attempt_no INTEGER,
    decision_log_id BIGINT,
    api_key_id BIGINT,
    legacy_api_key_id BIGINT,
    api_key_name_snapshot VARCHAR(128),
    channel_group_id BIGINT,
    channel_group_snapshot VARCHAR(128),
    owner_type INTEGER,
    owner_id BIGINT,
    owner_name_snapshot VARCHAR(128),
    provider_id BIGINT,
    channel_id BIGINT,
    channel_name_snapshot VARCHAR(128),
    requested_model VARCHAR(256),
    requested_model_catalog_key VARCHAR(256),
    provider_model VARCHAR(256),
    provider_native_model VARCHAR(256),
    region_code VARCHAR(64),
    endpoint VARCHAR(256),
    request_path VARCHAR(256),
    http_method VARCHAR(16),
    http_status INTEGER,
    provider_error_code VARCHAR(128),
    error_type INTEGER,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    latency_ms INTEGER,
    ttft_ms INTEGER,
    streaming BOOLEAN,
    request_bytes BIGINT,
    response_bytes BIGINT,
    prompt_tokens BIGINT,
    completion_tokens BIGINT,
    cached_tokens BIGINT,
    total_tokens BIGINT,
    request_payload_hash VARCHAR(128),
    response_payload_hash VARCHAR(128),
    error_message_masked VARCHAR(1024),
    reasoning_effort VARCHAR(64),
    client_ip_hash VARCHAR(128),
    client_ip_masked VARCHAR(64),
    client_ip_region VARCHAR(128),
    user_agent_hash VARCHAR(128)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_request_trace_request_attempt ON ai_request_trace (tenant_id, organization_id, request_id, attempt_no);
CREATE INDEX IF NOT EXISTS idx_ai_request_trace_tenant_trace ON ai_request_trace (tenant_id, organization_id, trace_id);
CREATE INDEX IF NOT EXISTS idx_ai_request_trace_api_key_started ON ai_request_trace (tenant_id, organization_id, api_key_id, started_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_request_trace_model_started ON ai_request_trace (tenant_id, organization_id, requested_model, started_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_request_trace_tenant_status_started ON ai_request_trace (tenant_id, organization_id, status, started_at, id);

CREATE TABLE IF NOT EXISTS ai_usage_fact (
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
    decision_log_id BIGINT,
    api_key_id BIGINT,
    legacy_api_key_id BIGINT,
    api_key_name_snapshot VARCHAR(128),
    channel_group_id BIGINT,
    channel_group_snapshot VARCHAR(128),
    owner_type INTEGER,
    owner_id BIGINT,
    owner_name_snapshot VARCHAR(128),
    catalog_key VARCHAR(256) NOT NULL,
    requested_model_catalog_key VARCHAR(256),
    model VARCHAR(256),
    provider_native_model VARCHAR(256),
    region_code VARCHAR(64),
    provider_id BIGINT,
    channel_id BIGINT,
    modality INTEGER,
    usage_type INTEGER,
    billing_type INTEGER,
    billing_mode INTEGER,
    billing_meter_id BIGINT,
    billing_meter_code VARCHAR(64),
    billing_tier VARCHAR(64),
    billable_quantity NUMERIC(38, 12),
    billable_unit INTEGER,
    prompt_tokens BIGINT,
    completion_tokens BIGINT,
    cached_tokens BIGINT,
    total_tokens BIGINT,
    request_count BIGINT,
    result_count BIGINT,
    item_count BIGINT,
    character_count BIGINT,
    image_count BIGINT,
    audio_seconds NUMERIC(38, 12),
    video_seconds NUMERIC(38, 12),
    storage_byte_hours NUMERIC(38, 12),
    bandwidth_bytes BIGINT,
    unit_price_snapshot NUMERIC(38, 12),
    base_input_unit_price NUMERIC(38, 12),
    base_output_unit_price NUMERIC(38, 12),
    cache_read_unit_price NUMERIC(38, 12),
    rate_multiplier NUMERIC(38, 12),
    reference_multiplier NUMERIC(38, 12),
    official_reference_amount NUMERIC(38, 12),
    upstream_cost_amount NUMERIC(38, 12),
    customer_charge_amount NUMERIC(38, 12),
    cost_amount NUMERIC(38, 12),
    currency VARCHAR(10),
    pricing_id BIGINT,
    pricing_plan_id BIGINT,
    pricing_plan_code VARCHAR(64),
    pricing_rule_id BIGINT,
    pricing_tier_id BIGINT,
    pricing_snapshot JSONB,
    reasoning_effort VARCHAR(64),
    occurred_at TIMESTAMPTZ,
    settlement_status INTEGER,
    settlement_id BIGINT
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_usage_fact_request ON ai_usage_fact (tenant_id, organization_id, request_id, usage_type);
CREATE INDEX IF NOT EXISTS idx_ai_usage_fact_tenant_owner_occurred ON ai_usage_fact (tenant_id, organization_id, owner_type, owner_id, occurred_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_fact_api_key_occurred ON ai_usage_fact (tenant_id, organization_id, api_key_id, occurred_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_fact_model_occurred ON ai_usage_fact (tenant_id, organization_id, catalog_key, occurred_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_fact_pricing_plan_occurred ON ai_usage_fact (tenant_id, organization_id, pricing_plan_id, occurred_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_fact_meter_occurred ON ai_usage_fact (tenant_id, organization_id, billing_meter_code, occurred_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_fact_settlement_status ON ai_usage_fact (tenant_id, organization_id, settlement_status, occurred_at, id);

CREATE TABLE IF NOT EXISTS ai_quota_policy (
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
    policy_code VARCHAR(64),
    name VARCHAR(128),
    subject_type INTEGER,
    subject_id BIGINT,
    subject_ref_hash VARCHAR(128),
    subject_ref_masked VARCHAR(128),
    scope_type INTEGER,
    scope_id BIGINT,
    channel_group_id BIGINT,
    model VARCHAR(256),
    quota_period INTEGER,
    quota_unit INTEGER,
    quota_limit NUMERIC(38, 12),
    requests_per_second BIGINT,
    requests_per_minute BIGINT,
    requests_per_day BIGINT,
    tokens_per_minute BIGINT,
    burst_limit NUMERIC(38, 12),
    block_duration_seconds BIGINT,
    reset_mode INTEGER,
    exhausted_at TIMESTAMPTZ,
    effective_from TIMESTAMPTZ,
    effective_to TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_quota_policy_tenant_subject ON ai_quota_policy (tenant_id, organization_id, subject_type, subject_id, quota_period, quota_unit);
CREATE INDEX IF NOT EXISTS idx_ai_quota_policy_subject_ref ON ai_quota_policy (tenant_id, organization_id, subject_type, subject_ref_hash, status);
CREATE INDEX IF NOT EXISTS idx_ai_quota_policy_model_channel_group ON ai_quota_policy (tenant_id, organization_id, model, channel_group_id, status);

CREATE TABLE IF NOT EXISTS ai_prompt (
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
    prompt_key VARCHAR(128) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id BIGINT,
    category_code VARCHAR(128),
    prompt_type VARCHAR(64) NOT NULL,
    visibility VARCHAR(64) NOT NULL,
    owner_user_id BIGINT,
    latest_version_id BIGINT,
    published_version_id BIGINT,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    published_at TIMESTAMPTZ,
    deprecated_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_prompt_key ON ai_prompt (tenant_id, organization_id, prompt_key);
CREATE INDEX IF NOT EXISTS idx_ai_prompt_category ON ai_prompt (tenant_id, organization_id, category_id, status, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_prompt_type ON ai_prompt (tenant_id, organization_id, prompt_type, status, updated_at, id);

CREATE TABLE IF NOT EXISTS ai_prompt_version (
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
    lifecycle_status VARCHAR(64) NOT NULL,
    review_status VARCHAR(64),
    review_comment TEXT,
    created_by BIGINT,
    published_at TIMESTAMPTZ,
    deprecated_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_prompt_version_no ON ai_prompt_version (tenant_id, organization_id, prompt_id, version_no);
CREATE INDEX IF NOT EXISTS idx_ai_prompt_version_prompt ON ai_prompt_version (tenant_id, organization_id, prompt_id, lifecycle_status, created_at, id);

CREATE TABLE IF NOT EXISTS ai_prompt_binding (
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
    prompt_id BIGINT NOT NULL,
    prompt_version_id BIGINT,
    owner_type VARCHAR(64) NOT NULL,
    owner_id BIGINT NOT NULL,
    binding_role VARCHAR(64) NOT NULL,
    priority INTEGER NOT NULL DEFAULT 0,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    policy_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    snapshot_json JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_ai_prompt_binding_owner ON ai_prompt_binding (tenant_id, organization_id, owner_type, owner_id, binding_role, priority, id);
CREATE INDEX IF NOT EXISTS idx_ai_prompt_binding_prompt ON ai_prompt_binding (tenant_id, organization_id, prompt_id, prompt_version_id, enabled, id);

CREATE TABLE IF NOT EXISTS ai_mcp_server (
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
    server_key VARCHAR(128) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id BIGINT,
    category_code VARCHAR(128),
    transport VARCHAR(64) NOT NULL,
    visibility VARCHAR(64) NOT NULL,
    owner_user_id BIGINT,
    latest_revision_id BIGINT,
    published_revision_id BIGINT,
    health_status VARCHAR(64) NOT NULL DEFAULT 'unchecked',
    last_checked_at TIMESTAMPTZ,
    last_error_masked TEXT,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    published_at TIMESTAMPTZ,
    deprecated_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_mcp_server_key ON ai_mcp_server (tenant_id, organization_id, server_key);
CREATE INDEX IF NOT EXISTS idx_ai_mcp_server_category ON ai_mcp_server (tenant_id, organization_id, category_id, status, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_mcp_server_health ON ai_mcp_server (tenant_id, organization_id, health_status, status, updated_at, id);

CREATE TABLE IF NOT EXISTS ai_mcp_server_revision (
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
    lifecycle_status VARCHAR(64) NOT NULL,
    created_by BIGINT,
    published_at TIMESTAMPTZ,
    deprecated_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_mcp_server_revision_no ON ai_mcp_server_revision (tenant_id, organization_id, server_id, revision_no);
CREATE INDEX IF NOT EXISTS idx_ai_mcp_server_revision_server ON ai_mcp_server_revision (tenant_id, organization_id, server_id, lifecycle_status, created_at, id);

CREATE TABLE IF NOT EXISTS ai_mcp_tool (
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
    sort_weight INTEGER NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_mcp_tool_key ON ai_mcp_tool (tenant_id, organization_id, server_id, tool_key);
CREATE INDEX IF NOT EXISTS idx_ai_mcp_tool_server ON ai_mcp_tool (tenant_id, organization_id, server_id, enabled, sort_weight, id);
CREATE INDEX IF NOT EXISTS idx_ai_mcp_tool_risk ON ai_mcp_tool (tenant_id, organization_id, risk_level, requires_approval, enabled, id);

CREATE TABLE IF NOT EXISTS ai_mcp_binding (
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
    snapshot_json JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_ai_mcp_binding_owner ON ai_mcp_binding (tenant_id, organization_id, owner_type, owner_id, priority, id);
CREATE INDEX IF NOT EXISTS idx_ai_mcp_binding_server ON ai_mcp_binding (tenant_id, organization_id, server_id, server_revision_id, enabled, id);

CREATE TABLE IF NOT EXISTS ai_agent (
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
    owner_user_id BIGINT NOT NULL,
    agent_code VARCHAR(96) NOT NULL,
    name VARCHAR(128) NOT NULL,
    description VARCHAR(1024),
    visibility INTEGER NOT NULL,
    default_version_id BIGINT,
    avatar_media_resource_id VARCHAR(128),
    avatar_object_blob_id BIGINT,
    avatar_resource_snapshot JSONB,
    template_source VARCHAR(128),
    governance_status INTEGER,
    published_at TIMESTAMPTZ,
    published_by BIGINT
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_agent_tenant_code ON ai_agent (tenant_id, organization_id, agent_code);
CREATE INDEX IF NOT EXISTS idx_ai_agent_owner_status_updated ON ai_agent (tenant_id, organization_id, owner_user_id, status, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_governance_status ON ai_agent (tenant_id, organization_id, governance_status, updated_at, id);

CREATE TABLE IF NOT EXISTS ai_agent_version (
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
    agent_id BIGINT NOT NULL,
    version_no BIGINT NOT NULL,
    release_status INTEGER NOT NULL,
    system_prompt TEXT,
    model_policy JSONB,
    tool_policy JSONB,
    memory_policy JSONB,
    mcp_policy JSONB,
    skill_policy JSONB,
    runtime_policy JSONB,
    config_hash VARCHAR(128),
    published_at TIMESTAMPTZ,
    published_by BIGINT
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_agent_version_agent_no ON ai_agent_version (tenant_id, organization_id, agent_id, version_no);
CREATE INDEX IF NOT EXISTS idx_ai_agent_version_release_status ON ai_agent_version (tenant_id, organization_id, agent_id, release_status, version_no);
CREATE INDEX IF NOT EXISTS idx_ai_agent_version_config_hash ON ai_agent_version (tenant_id, organization_id, config_hash);

CREATE TABLE IF NOT EXISTS ai_agent_run (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT NOT NULL,
    request_id VARCHAR(128) NOT NULL,
    trace_id VARCHAR(128),
    payload_hash VARCHAR(128),
    status VARCHAR(64) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    retention_until TIMESTAMPTZ,
    legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    agent_id BIGINT NOT NULL,
    agent_version_id BIGINT NOT NULL,
    agent_session_id VARCHAR(128),
    memory_space_id VARCHAR(128),
    runtime VARCHAR(128),
    model VARCHAR(256),
    run_uuid VARCHAR(128) NOT NULL,
    run_status VARCHAR(64) NOT NULL DEFAULT 'running',
    source_surface VARCHAR(64),
    input_message TEXT,
    output_message TEXT,
    target_modality INTEGER,
    planner_model VARCHAR(256),
    execution_mode VARCHAR(64),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    error_message_masked VARCHAR(1024),
    metering_status INTEGER,
    usage_fact_id BIGINT,
    usage_json JSONB,
    total_steps INTEGER,
    prompt_tokens BIGINT,
    completion_tokens BIGINT,
    cached_tokens BIGINT,
    total_tokens BIGINT,
    image_count BIGINT,
    audio_seconds NUMERIC(38, 12),
    video_seconds NUMERIC(38, 12)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_agent_run_request ON ai_agent_run (tenant_id, organization_id, request_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_run_agent_created ON ai_agent_run (tenant_id, organization_id, agent_id, created_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_run_user_created ON ai_agent_run (tenant_id, organization_id, user_id, created_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_run_session_created ON ai_agent_run (tenant_id, organization_id, user_id, agent_session_id, created_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_run_status_created ON ai_agent_run (tenant_id, organization_id, run_status, created_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_run_usage_fact ON ai_agent_run (tenant_id, organization_id, usage_fact_id);

CREATE TABLE IF NOT EXISTS ai_agent_run_step (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT,
    request_id VARCHAR(128),
    trace_id VARCHAR(128),
    payload_hash VARCHAR(128),
    status VARCHAR(64) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    retention_until TIMESTAMPTZ,
    legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    run_id BIGINT NOT NULL,
    agent_id BIGINT,
    agent_version_id BIGINT,
    step_index INTEGER NOT NULL,
    step_type INTEGER NOT NULL,
    step_status VARCHAR(64) NOT NULL DEFAULT 'running',
    title VARCHAR(128),
    tool_binding_id BIGINT,
    skill_id BIGINT,
    mcp_server_id BIGINT,
    tool_name VARCHAR(128),
    model VARCHAR(256),
    runtime_invocation_id VARCHAR(128),
    input_snapshot JSONB,
    output_snapshot JSONB,
    usage_json JSONB,
    error_message_masked VARCHAR(1024),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    latency_ms INTEGER,
    prompt_tokens BIGINT,
    completion_tokens BIGINT,
    cached_tokens BIGINT,
    total_tokens BIGINT,
    image_count BIGINT,
    audio_seconds NUMERIC(38, 12),
    video_seconds NUMERIC(38, 12),
    usage_fact_id BIGINT
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_agent_run_step_index ON ai_agent_run_step (tenant_id, organization_id, run_id, step_index);
CREATE INDEX IF NOT EXISTS idx_ai_agent_run_step_run_type ON ai_agent_run_step (tenant_id, organization_id, run_id, step_type, step_index);
CREATE INDEX IF NOT EXISTS idx_ai_agent_run_step_tool ON ai_agent_run_step (tenant_id, organization_id, tool_binding_id, created_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_run_step_runtime_invocation ON ai_agent_run_step (tenant_id, organization_id, runtime_invocation_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_run_step_usage_fact ON ai_agent_run_step (tenant_id, organization_id, usage_fact_id);

CREATE TABLE IF NOT EXISTS ai_agent_memory (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT,
    owner_type INTEGER,
    owner_id BIGINT,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    owner_user_id BIGINT NOT NULL,
    agent_id BIGINT NOT NULL,
    memory_scope INTEGER NOT NULL,
    memory_type INTEGER NOT NULL,
    content_ref VARCHAR(512),
    embedding_ref VARCHAR(512),
    memory_hash VARCHAR(128),
    retention_policy JSONB,
    expires_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_agent_memory_hash ON ai_agent_memory (tenant_id, organization_id, owner_user_id, agent_id, memory_hash);
CREATE INDEX IF NOT EXISTS idx_ai_agent_memory_agent_scope ON ai_agent_memory (tenant_id, organization_id, agent_id, owner_user_id, memory_scope, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_memory_retention ON ai_agent_memory (tenant_id, organization_id, status, expires_at, id);

CREATE TABLE IF NOT EXISTS ai_chat_conversation (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT NOT NULL,
    owner_type INTEGER,
    owner_id BIGINT,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(64) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    conversation_code VARCHAR(128) NOT NULL,
    title VARCHAR(256) NOT NULL,
    summary TEXT,
    visibility VARCHAR(32),
    source_surface VARCHAR(64) NOT NULL,
    default_provider VARCHAR(128),
    default_model VARCHAR(256),
    default_endpoint VARCHAR(128),
    agent_id VARCHAR(128),
    agent_session_id VARCHAR(128),
    memory_space_id VARCHAR(128),
    last_turn_id BIGINT,
    last_item_id BIGINT,
    last_message_preview TEXT,
    message_count BIGINT,
    turn_count BIGINT,
    item_count BIGINT,
    input_token_total BIGINT,
    output_token_total BIGINT,
    cached_token_total BIGINT,
    reasoning_token_total BIGINT,
    cost_amount_total NUMERIC(38, 12),
    currency VARCHAR(16)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_chat_conversation_code ON ai_chat_conversation (tenant_id, organization_id, user_id, conversation_code);
CREATE INDEX IF NOT EXISTS idx_ai_chat_conversation_user_updated ON ai_chat_conversation (tenant_id, organization_id, user_id, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_conversation_agent_session ON ai_chat_conversation (tenant_id, organization_id, agent_session_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_conversation_memory_space ON ai_chat_conversation (tenant_id, organization_id, memory_space_id);

CREATE TABLE IF NOT EXISTS ai_chat_turn (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT NOT NULL,
    request_id VARCHAR(128),
    trace_id VARCHAR(128),
    payload_hash VARCHAR(128),
    status VARCHAR(64) NOT NULL DEFAULT 'running',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    retention_until TIMESTAMPTZ,
    legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    conversation_id BIGINT NOT NULL,
    turn_no BIGINT NOT NULL,
    parent_turn_id BIGINT,
    branch_id VARCHAR(128),
    provider VARCHAR(128),
    model VARCHAR(256),
    endpoint VARCHAR(128),
    streaming BOOLEAN,
    agent_id VARCHAR(128),
    agent_session_id VARCHAR(128),
    input_item_id BIGINT,
    final_output_item_id BIGINT,
    context_snapshot_id BIGINT,
    runtime_invocation_id VARCHAR(128),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    request_snapshot JSONB,
    response_snapshot JSONB,
    usage_snapshot JSONB,
    input_token_total BIGINT,
    output_token_total BIGINT,
    cached_token_total BIGINT,
    reasoning_token_total BIGINT,
    cost_amount NUMERIC(38, 12),
    currency VARCHAR(16)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_chat_turn_no ON ai_chat_turn (tenant_id, organization_id, conversation_id, turn_no);
CREATE INDEX IF NOT EXISTS idx_ai_chat_turn_conversation_created ON ai_chat_turn (tenant_id, organization_id, conversation_id, created_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_turn_agent_session ON ai_chat_turn (tenant_id, organization_id, agent_session_id, created_at, id);

CREATE TABLE IF NOT EXISTS ai_chat_item (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT NOT NULL,
    request_id VARCHAR(128),
    trace_id VARCHAR(128),
    payload_hash VARCHAR(128),
    status VARCHAR(64) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    retention_until TIMESTAMPTZ,
    legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    conversation_id BIGINT NOT NULL,
    turn_id BIGINT,
    parent_item_id BIGINT,
    sequence_no BIGINT NOT NULL,
    item_type VARCHAR(64) NOT NULL,
    role VARCHAR(64),
    direction VARCHAR(32) NOT NULL,
    provider_item_id VARCHAR(128),
    provider_call_id VARCHAR(128),
    provider_response_id VARCHAR(128),
    provider VARCHAR(128),
    model VARCHAR(256),
    runtime VARCHAR(128),
    runtime_invocation_id VARCHAR(128),
    content_text TEXT,
    content_json JSONB,
    raw_provider_json JSONB,
    completed_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_chat_item_sequence ON ai_chat_item (tenant_id, organization_id, conversation_id, sequence_no);
CREATE INDEX IF NOT EXISTS idx_ai_chat_item_turn ON ai_chat_item (tenant_id, organization_id, turn_id, sequence_no, id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_item_provider_response ON ai_chat_item (tenant_id, organization_id, provider_response_id);

CREATE TABLE IF NOT EXISTS ai_chat_message (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT NOT NULL,
    request_id VARCHAR(128),
    trace_id VARCHAR(128),
    payload_hash VARCHAR(128),
    status VARCHAR(64) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    retention_until TIMESTAMPTZ,
    legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    conversation_id BIGINT NOT NULL,
    turn_id BIGINT,
    item_id BIGINT NOT NULL,
    message_no BIGINT NOT NULL,
    role VARCHAR(64) NOT NULL,
    message_kind VARCHAR(64) NOT NULL,
    direction VARCHAR(32) NOT NULL,
    content_text TEXT,
    content_json JSONB,
    raw_provider_json JSONB,
    model VARCHAR(256),
    provider VARCHAR(128),
    runtime VARCHAR(128),
    runtime_invocation_id VARCHAR(128),
    usage_link_id VARCHAR(128),
    finish_reason VARCHAR(128),
    token_count BIGINT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_chat_message_no ON ai_chat_message (tenant_id, organization_id, conversation_id, message_no);
CREATE INDEX IF NOT EXISTS idx_ai_chat_message_turn ON ai_chat_message (tenant_id, organization_id, turn_id, message_no, id);

CREATE TABLE IF NOT EXISTS ai_chat_message_part (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT NOT NULL,
    request_id VARCHAR(128),
    trace_id VARCHAR(128),
    payload_hash VARCHAR(128),
    status VARCHAR(64) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    retention_until TIMESTAMPTZ,
    legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    message_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    part_no INTEGER NOT NULL,
    part_type VARCHAR(64) NOT NULL,
    text_content TEXT,
    json_content JSONB,
    mime_type VARCHAR(128),
    asset_id VARCHAR(128),
    media_resource_id VARCHAR(128),
    object_blob_id BIGINT,
    resource_snapshot JSONB,
    file_name VARCHAR(512),
    file_size BIGINT,
    sha256 VARCHAR(128),
    provider_part_id VARCHAR(128)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_chat_message_part_no ON ai_chat_message_part (tenant_id, organization_id, message_id, part_no);
CREATE INDEX IF NOT EXISTS idx_ai_chat_message_part_item ON ai_chat_message_part (tenant_id, organization_id, item_id, part_no);

CREATE TABLE IF NOT EXISTS ai_chat_context_snapshot (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT NOT NULL,
    request_id VARCHAR(128),
    trace_id VARCHAR(128),
    payload_hash VARCHAR(128),
    status VARCHAR(64) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    retention_until TIMESTAMPTZ,
    legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    conversation_id BIGINT NOT NULL,
    turn_id BIGINT,
    runtime_invocation_id BIGINT,
    snapshot_no INTEGER NOT NULL,
    strategy VARCHAR(64) NOT NULL,
    included_item_ids JSONB,
    excluded_item_ids JSONB,
    included_memory_ids JSONB,
    excluded_memory_ids JSONB,
    memory_pack JSONB,
    memory_token_count BIGINT,
    provider_conversation_id VARCHAR(128),
    previous_response_id VARCHAR(128),
    input_token_estimate BIGINT,
    truncation_reason VARCHAR(256),
    context_json JSONB
);

CREATE INDEX IF NOT EXISTS idx_ai_chat_context_snapshot_turn ON ai_chat_context_snapshot (tenant_id, organization_id, turn_id, snapshot_no);
CREATE INDEX IF NOT EXISTS idx_ai_chat_context_snapshot_invocation ON ai_chat_context_snapshot (tenant_id, organization_id, runtime_invocation_id);

CREATE TABLE IF NOT EXISTS ai_agent_session (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT NOT NULL,
    owner_type INTEGER,
    owner_id BIGINT,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(64) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    agent_id VARCHAR(128) NOT NULL,
    agent_version_id VARCHAR(128),
    session_code VARCHAR(128) NOT NULL,
    title VARCHAR(256) NOT NULL,
    summary TEXT,
    session_kind VARCHAR(64) NOT NULL,
    source_surface VARCHAR(64) NOT NULL,
    visibility VARCHAR(32),
    chat_conversation_id VARCHAR(128),
    memory_space_id VARCHAR(128),
    parent_session_id VARCHAR(128),
    forked_from_run_id VARCHAR(128),
    forked_from_step_id VARCHAR(128),
    runtime VARCHAR(128),
    provider_session_id VARCHAR(128),
    provider_conversation_id VARCHAR(128),
    runtime_state_storage_key TEXT,
    resume_strategy VARCHAR(64),
    cwd TEXT,
    workspace_id VARCHAR(128),
    repository_id VARCHAR(128),
    git_branch VARCHAR(256),
    git_commit VARCHAR(128),
    sandbox_policy VARCHAR(128),
    approval_policy VARCHAR(128),
    permission_mode VARCHAR(128),
    default_model VARCHAR(256),
    execution_mode VARCHAR(64),
    last_run_id VARCHAR(128),
    last_step_id BIGINT,
    last_active_at TIMESTAMPTZ,
    run_count BIGINT,
    step_count BIGINT,
    tool_call_count BIGINT
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_agent_session_code ON ai_agent_session (tenant_id, organization_id, user_id, session_code);
CREATE INDEX IF NOT EXISTS idx_ai_agent_session_agent_updated ON ai_agent_session (tenant_id, organization_id, agent_id, user_id, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_session_conversation ON ai_agent_session (tenant_id, organization_id, chat_conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_session_provider ON ai_agent_session (tenant_id, organization_id, runtime, provider_session_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_session_status_updated ON ai_agent_session (tenant_id, organization_id, status, updated_at, id);

CREATE TABLE IF NOT EXISTS ai_memory_space (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT NOT NULL,
    owner_type VARCHAR(64),
    owner_id VARCHAR(128),
    data_scope INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(64) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    space_type VARCHAR(64) NOT NULL,
    title VARCHAR(256) NOT NULL,
    memory_enabled BOOLEAN,
    auto_extract_enabled BOOLEAN,
    auto_recall_enabled BOOLEAN,
    review_required BOOLEAN,
    max_injected_tokens BIGINT,
    retention_policy JSONB,
    sensitivity_policy JSONB,
    entry_count BIGINT
);

CREATE INDEX IF NOT EXISTS idx_ai_memory_space_owner ON ai_memory_space (tenant_id, organization_id, space_type, owner_id, status);
CREATE INDEX IF NOT EXISTS idx_ai_memory_space_user_updated ON ai_memory_space (tenant_id, organization_id, user_id, updated_at, id);

CREATE TABLE IF NOT EXISTS ai_memory_space_binding (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(64) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    memory_space_id BIGINT NOT NULL,
    binding_type VARCHAR(64) NOT NULL,
    binding_id VARCHAR(128),
    binding_role VARCHAR(64) NOT NULL,
    priority INTEGER,
    enabled BOOLEAN
);

CREATE INDEX IF NOT EXISTS idx_ai_memory_space_binding_subject ON ai_memory_space_binding (tenant_id, organization_id, binding_type, binding_id, enabled, priority);

CREATE TABLE IF NOT EXISTS ai_memory_entry (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT NOT NULL,
    owner_type INTEGER,
    owner_id BIGINT,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(64) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    space_id BIGINT NOT NULL,
    memory_code VARCHAR(128) NOT NULL,
    memory_type VARCHAR(64) NOT NULL,
    subject_type VARCHAR(64),
    subject_key VARCHAR(256),
    content_text TEXT NOT NULL,
    content_json JSONB,
    source_kind VARCHAR(64) NOT NULL,
    source_conversation_id VARCHAR(128),
    source_turn_id VARCHAR(128),
    source_item_id VARCHAR(128),
    source_invocation_id VARCHAR(128),
    importance_score NUMERIC(38, 12),
    confidence_score NUMERIC(38, 12),
    sensitivity_level VARCHAR(64) NOT NULL,
    trust_level VARCHAR(64) NOT NULL,
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    last_recalled_at TIMESTAMPTZ,
    recall_count BIGINT,
    version_no BIGINT,
    supersedes_memory_id BIGINT,
    created_by VARCHAR(128)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_memory_entry_code ON ai_memory_entry (tenant_id, organization_id, space_id, memory_code);
CREATE INDEX IF NOT EXISTS idx_ai_memory_entry_space_status ON ai_memory_entry (tenant_id, organization_id, space_id, status, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_memory_entry_subject ON ai_memory_entry (tenant_id, organization_id, subject_type, subject_key, status);
CREATE INDEX IF NOT EXISTS idx_ai_memory_entry_user_status ON ai_memory_entry (tenant_id, organization_id, user_id, status, updated_at, id);

CREATE TABLE IF NOT EXISTS ai_memory_embedding (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(64) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    memory_id BIGINT NOT NULL,
    embedding_provider VARCHAR(128),
    embedding_model VARCHAR(256),
    embedding_dimensions INTEGER,
    content_hash VARCHAR(128),
    vector_json JSONB,
    vector_storage_key TEXT,
    indexed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ai_memory_embedding_memory ON ai_memory_embedding (tenant_id, organization_id, memory_id, status);

CREATE TABLE IF NOT EXISTS ai_memory_event (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT NOT NULL,
    request_id VARCHAR(128),
    trace_id VARCHAR(128),
    payload_hash VARCHAR(128),
    status VARCHAR(64) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    retention_until TIMESTAMPTZ,
    legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    memory_id BIGINT,
    space_id BIGINT,
    event_type VARCHAR(64) NOT NULL,
    actor_type VARCHAR(64) NOT NULL,
    actor_id VARCHAR(128),
    conversation_id VARCHAR(128),
    turn_id VARCHAR(128),
    invocation_id VARCHAR(128),
    before_json JSONB,
    after_json JSONB,
    decision_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_ai_memory_event_memory ON ai_memory_event (tenant_id, organization_id, memory_id, created_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_memory_event_conversation ON ai_memory_event (tenant_id, organization_id, conversation_id, turn_id, created_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_memory_event_user_created ON ai_memory_event (tenant_id, organization_id, user_id, created_at, id);

CREATE TABLE IF NOT EXISTS ai_memory_link (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT NOT NULL,
    request_id VARCHAR(128),
    trace_id VARCHAR(128),
    payload_hash VARCHAR(128),
    status VARCHAR(64) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    retention_until TIMESTAMPTZ,
    legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    memory_id BIGINT NOT NULL,
    memory_space_id BIGINT,
    conversation_id VARCHAR(128),
    chat_turn_id VARCHAR(128),
    chat_item_id VARCHAR(128),
    message_id VARCHAR(128),
    agent_session_id VARCHAR(128),
    agent_run_id VARCHAR(128),
    agent_run_step_id VARCHAR(128),
    runtime_invocation_id VARCHAR(128),
    link_type VARCHAR(64) NOT NULL,
    recall_query TEXT,
    recall_score NUMERIC(38, 12),
    recall_rank INTEGER,
    injected_text_snapshot TEXT,
    token_count BIGINT,
    policy_decision VARCHAR(128)
);

CREATE INDEX IF NOT EXISTS idx_ai_memory_link_memory ON ai_memory_link (tenant_id, organization_id, memory_id, created_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_memory_link_chat ON ai_memory_link (tenant_id, organization_id, conversation_id, chat_turn_id, link_type);
CREATE INDEX IF NOT EXISTS idx_ai_memory_link_agent ON ai_memory_link (tenant_id, organization_id, agent_session_id, agent_run_id, link_type);
CREATE INDEX IF NOT EXISTS idx_ai_memory_link_user_created ON ai_memory_link (tenant_id, organization_id, user_id, created_at, id);

CREATE TABLE IF NOT EXISTS ai_runtime_invocation (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT NOT NULL,
    request_id VARCHAR(128),
    trace_id VARCHAR(128),
    payload_hash VARCHAR(128),
    status VARCHAR(64) NOT NULL DEFAULT 'running',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    retention_until TIMESTAMPTZ,
    legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    conversation_id VARCHAR(128),
    chat_turn_id VARCHAR(128),
    chat_item_id VARCHAR(128),
    agent_session_id VARCHAR(128),
    agent_run_id VARCHAR(128),
    agent_run_step_id VARCHAR(128),
    invocation_no BIGINT NOT NULL,
    invocation_type VARCHAR(64) NOT NULL,
    runtime VARCHAR(128) NOT NULL,
    endpoint VARCHAR(128),
    attempt_no INTEGER,
    streaming BOOLEAN NOT NULL DEFAULT FALSE,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    latency_ms BIGINT,
    ttft_ms BIGINT,
    exit_code BIGINT,
    finish_reason VARCHAR(128),
    error_type VARCHAR(128),
    error_code VARCHAR(128),
    error_message_masked VARCHAR(1024),
    provider_response_id VARCHAR(128),
    provider_session_id VARCHAR(128),
    provider_conversation_id VARCHAR(128),
    provider_step_id VARCHAR(128),
    model VARCHAR(256),
    provider VARCHAR(128),
    tool_name VARCHAR(128),
    tool_call_id VARCHAR(128),
    cwd TEXT,
    sandbox_policy VARCHAR(128),
    approval_policy VARCHAR(128),
    permission_mode VARCHAR(128),
    request_json JSONB,
    response_json JSONB,
    usage_json JSONB
);

CREATE INDEX IF NOT EXISTS idx_ai_runtime_invocation_chat ON ai_runtime_invocation (tenant_id, organization_id, conversation_id, chat_turn_id, invocation_no);
CREATE INDEX IF NOT EXISTS idx_ai_runtime_invocation_agent ON ai_runtime_invocation (tenant_id, organization_id, agent_session_id, agent_run_id, invocation_no);
CREATE INDEX IF NOT EXISTS idx_ai_runtime_invocation_request ON ai_runtime_invocation (tenant_id, organization_id, request_id, attempt_no);
CREATE INDEX IF NOT EXISTS idx_ai_runtime_invocation_user_created ON ai_runtime_invocation (tenant_id, organization_id, user_id, created_at, id);

CREATE TABLE IF NOT EXISTS ai_runtime_invocation_event (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT NOT NULL,
    request_id VARCHAR(128),
    trace_id VARCHAR(128),
    payload_hash VARCHAR(128),
    status VARCHAR(64) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    retention_until TIMESTAMPTZ,
    legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    invocation_id BIGINT NOT NULL,
    conversation_id VARCHAR(128),
    chat_turn_id VARCHAR(128),
    agent_session_id VARCHAR(128),
    agent_run_id VARCHAR(128),
    agent_run_step_id VARCHAR(128),
    event_no BIGINT NOT NULL,
    event_type VARCHAR(128) NOT NULL,
    event_source VARCHAR(64) NOT NULL,
    payload_json JSONB,
    text_delta TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_runtime_invocation_event_no ON ai_runtime_invocation_event (tenant_id, organization_id, invocation_id, event_no);
CREATE INDEX IF NOT EXISTS idx_ai_runtime_invocation_event_user_created ON ai_runtime_invocation_event (tenant_id, organization_id, user_id, created_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_runtime_invocation_event_chat ON ai_runtime_invocation_event (tenant_id, organization_id, conversation_id, chat_turn_id, created_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_runtime_invocation_event_agent ON ai_runtime_invocation_event (tenant_id, organization_id, agent_session_id, agent_run_id, created_at, id);

CREATE TABLE IF NOT EXISTS ai_runtime_usage_link (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT NOT NULL,
    request_id VARCHAR(128),
    trace_id VARCHAR(128),
    payload_hash VARCHAR(128),
    status VARCHAR(64) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    retention_until TIMESTAMPTZ,
    legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    conversation_id VARCHAR(128),
    chat_turn_id VARCHAR(128),
    chat_item_id VARCHAR(128),
    message_id VARCHAR(128),
    agent_session_id VARCHAR(128),
    agent_run_id VARCHAR(128),
    agent_run_step_id VARCHAR(128),
    agent_run_step_id_key VARCHAR(128) GENERATED ALWAYS AS (COALESCE(agent_run_step_id, '')) STORED,
    runtime_invocation_id VARCHAR(128),
    usage_fact_id BIGINT,
    usage_type VARCHAR(64) NOT NULL,
    provider VARCHAR(128),
    model VARCHAR(256),
    input_tokens BIGINT,
    output_tokens BIGINT,
    cached_tokens BIGINT,
    reasoning_tokens BIGINT,
    total_tokens BIGINT,
    cost_amount NUMERIC(38, 12),
    currency VARCHAR(16),
    occurred_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ai_runtime_usage_link_usage_fact ON ai_runtime_usage_link (tenant_id, organization_id, usage_fact_id);
CREATE INDEX IF NOT EXISTS idx_ai_runtime_usage_link_chat ON ai_runtime_usage_link (tenant_id, organization_id, conversation_id, chat_turn_id, occurred_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_runtime_usage_link_agent ON ai_runtime_usage_link (tenant_id, organization_id, agent_session_id, agent_run_id, occurred_at, id);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_runtime_usage_link_agent_scope ON ai_runtime_usage_link (tenant_id, organization_id, user_id, agent_run_id, usage_type, agent_run_step_id_key);

CREATE TABLE IF NOT EXISTS ai_runtime_artifact (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT NOT NULL,
    request_id VARCHAR(128),
    trace_id VARCHAR(128),
    payload_hash VARCHAR(128),
    status VARCHAR(64) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    retention_until TIMESTAMPTZ,
    legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    conversation_id VARCHAR(128),
    chat_turn_id VARCHAR(128),
    message_id VARCHAR(128),
    chat_item_id VARCHAR(128),
    agent_session_id VARCHAR(128),
    agent_run_id VARCHAR(128),
    agent_run_step_id VARCHAR(128),
    runtime_invocation_id VARCHAR(128),
    artifact_type VARCHAR(64) NOT NULL,
    name VARCHAR(512),
    mime_type VARCHAR(128),
    content_text TEXT,
    content_json JSONB,
    media_resource_id VARCHAR(128),
    object_blob_id BIGINT,
    resource_snapshot JSONB,
    sha256 VARCHAR(128),
    size_bytes BIGINT
);

CREATE INDEX IF NOT EXISTS idx_ai_runtime_artifact_chat ON ai_runtime_artifact (tenant_id, organization_id, conversation_id, chat_turn_id, created_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_runtime_artifact_user_created ON ai_runtime_artifact (tenant_id, organization_id, user_id, created_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_runtime_artifact_agent ON ai_runtime_artifact (tenant_id, organization_id, agent_session_id, agent_run_id, created_at, id);

CREATE TABLE IF NOT EXISTS ai_agent_tool_binding (
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
    agent_id BIGINT NOT NULL,
    agent_version_id BIGINT,
    binding_key VARCHAR(128) NOT NULL,
    binding_type INTEGER NOT NULL,
    skill_id BIGINT,
    mcp_server_id BIGINT,
    tool_name VARCHAR(128),
    permission_policy JSONB,
    runtime_config JSONB,
    credential_ref VARCHAR(256),
    enabled BOOLEAN,
    health_status INTEGER,
    last_checked_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_agent_tool_binding_key ON ai_agent_tool_binding (tenant_id, organization_id, agent_id, agent_version_id, binding_key);
CREATE INDEX IF NOT EXISTS idx_ai_agent_tool_binding_type ON ai_agent_tool_binding (tenant_id, organization_id, binding_type, status, enabled);
CREATE INDEX IF NOT EXISTS idx_ai_agent_tool_binding_skill ON ai_agent_tool_binding (tenant_id, organization_id, skill_id, status);
CREATE INDEX IF NOT EXISTS idx_ai_agent_tool_binding_mcp ON ai_agent_tool_binding (tenant_id, organization_id, mcp_server_id, status);

CREATE TABLE IF NOT EXISTS ai_agent_mcp_server (
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
    server_code VARCHAR(96) NOT NULL,
    name VARCHAR(128) NOT NULL,
    description VARCHAR(1024),
    transport_type INTEGER NOT NULL,
    connection_config JSONB,
    credential_ref VARCHAR(256),
    tool_catalog JSONB,
    prompt_catalog JSONB,
    resource_catalog JSONB,
    permission_policy JSONB,
    health_status INTEGER,
    last_checked_at TIMESTAMPTZ,
    last_error_masked VARCHAR(1024)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_agent_mcp_server_code ON ai_agent_mcp_server (tenant_id, organization_id, server_code);
CREATE INDEX IF NOT EXISTS idx_ai_agent_mcp_server_status_health ON ai_agent_mcp_server (tenant_id, organization_id, status, health_status, updated_at, id);

CREATE TABLE IF NOT EXISTS ai_rate_limit_bucket (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    source_type VARCHAR(128),
    source_id BIGINT,
    source_version BIGINT,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rebuild_version BIGINT NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    bucket_key VARCHAR(256),
    subject_type INTEGER,
    subject_id BIGINT,
    quota_policy_id BIGINT,
    window_start TIMESTAMPTZ,
    window_end TIMESTAMPTZ,
    current_count BIGINT,
    current_tokens BIGINT,
    remaining_count BIGINT,
    remaining_tokens BIGINT,
    last_request_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_rate_limit_bucket_key ON ai_rate_limit_bucket (bucket_key, window_start);
CREATE INDEX IF NOT EXISTS idx_ai_rate_limit_bucket_subject ON ai_rate_limit_bucket (subject_type, subject_id, window_end);

CREATE TABLE IF NOT EXISTS ai_generation_session (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT,
    owner_type INTEGER,
    owner_id BIGINT,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    session_code VARCHAR(64),
    title VARCHAR(200),
    active_modality INTEGER,
    selected_models JSONB,
    filter_config JSONB,
    last_prompt TEXT,
    last_opened_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_generation_session_user_code ON ai_generation_session (tenant_id, organization_id, user_id, session_code);
CREATE INDEX IF NOT EXISTS idx_ai_generation_session_user_updated ON ai_generation_session (tenant_id, organization_id, user_id, updated_at, id);

CREATE TABLE IF NOT EXISTS ai_generation_job (
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
    session_id BIGINT,
    job_type INTEGER,
    modality INTEGER,
    model VARCHAR(256),
    provider_id BIGINT,
    channel_id BIGINT,
    prompt TEXT,
    negative_prompt TEXT,
    input_asset_ids JSONB,
    parameter_snapshot JSONB,
    progress_percent INTEGER,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    failure_code VARCHAR(128),
    failure_message_masked VARCHAR(1024),
    usage_fact_id BIGINT
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_generation_job_request ON ai_generation_job (tenant_id, organization_id, request_id);
CREATE INDEX IF NOT EXISTS idx_ai_generation_job_user_modality_created ON ai_generation_job (tenant_id, organization_id, user_id, modality, created_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_generation_job_status_created ON ai_generation_job (tenant_id, organization_id, status, created_at, id);

CREATE TABLE IF NOT EXISTS ai_generation_asset (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT,
    owner_type INTEGER,
    owner_id BIGINT,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    job_id BIGINT,
    asset_type INTEGER,
    asset_media_resource_id VARCHAR(128),
    asset_object_blob_id BIGINT,
    asset_resource_snapshot JSONB,
    thumbnail_media_resource_id VARCHAR(128),
    thumbnail_object_blob_id BIGINT,
    thumbnail_resource_snapshot JSONB,
    storage_provider VARCHAR(64),
    object_key VARCHAR(1024),
    mime_type VARCHAR(128),
    file_size BIGINT,
    duration_seconds NUMERIC(38, 12),
    width INTEGER,
    height INTEGER,
    prompt_snapshot TEXT,
    model_snapshot VARCHAR(128),
    parameter_snapshot JSONB,
    active_index INTEGER,
    visibility INTEGER,
    favorite BOOLEAN,
    shared BOOLEAN,
    share_token_hash VARCHAR(128),
    download_count BIGINT,
    last_accessed_at TIMESTAMPTZ,
    expire_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ai_generation_asset_user_type_created ON ai_generation_asset (tenant_id, organization_id, user_id, asset_type, created_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_generation_asset_job ON ai_generation_asset (job_id, id);
CREATE INDEX IF NOT EXISTS idx_ai_generation_asset_favorite ON ai_generation_asset (tenant_id, organization_id, user_id, favorite, updated_at, id);

CREATE TABLE IF NOT EXISTS ai_generation_asset_action (
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
    asset_id BIGINT,
    job_id BIGINT,
    action_type INTEGER,
    action_params JSONB,
    result_asset_id BIGINT,
    client_ip_hash VARCHAR(128),
    client_ip_region VARCHAR(128),
    user_agent_hash VARCHAR(128),
    completed_at TIMESTAMPTZ,
    failure_code VARCHAR(128)
);

CREATE INDEX IF NOT EXISTS idx_ai_generation_asset_action_asset_created ON ai_generation_asset_action (asset_id, created_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_generation_asset_action_user_type ON ai_generation_asset_action (tenant_id, organization_id, user_id, action_type, created_at, id);

CREATE TABLE IF NOT EXISTS commerce_usage_settlement (
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
    settlement_no VARCHAR(128),
    usage_fact_id BIGINT,
    account_id VARCHAR(64),
    account_ledger_entry_id VARCHAR(64),
    order_id BIGINT,
    payment_id BIGINT,
    asset_type VARCHAR(32),
    direction VARCHAR(16),
    amount NUMERIC(38, 12),
    points BIGINT,
    tokens BIGINT,
    currency VARCHAR(10),
    price_snapshot JSONB,
    settlement_status INTEGER,
    settled_at TIMESTAMPTZ,
    failure_code VARCHAR(128),
    failure_message VARCHAR(512)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_usage_settlement_usage ON commerce_usage_settlement (tenant_id, organization_id, usage_fact_id);
CREATE INDEX IF NOT EXISTS idx_commerce_usage_settlement_tenant_status ON commerce_usage_settlement (tenant_id, organization_id, settlement_status, created_at, id);

CREATE TABLE IF NOT EXISTS commerce_usage_pricing_plan (
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
    plan_code VARCHAR(64),
    plan_name VARCHAR(128),
    product_id BIGINT,
    sku_id BIGINT,
    vip_level_id BIGINT,
    pricing_mode INTEGER,
    included_quota NUMERIC(38, 12),
    overage_pricing_id BIGINT,
    rate_multiplier NUMERIC(38, 12),
    effective_from TIMESTAMPTZ,
    effective_to TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_usage_pricing_plan_tenant_code ON commerce_usage_pricing_plan (tenant_id, organization_id, plan_code);

CREATE TABLE IF NOT EXISTS commerce_usage_statement (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    source_type VARCHAR(128),
    source_id BIGINT,
    source_version BIGINT,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rebuild_version BIGINT NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    statement_no VARCHAR(128),
    period VARCHAR(32),
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    owner_type INTEGER,
    owner_id BIGINT,
    total_tokens BIGINT,
    total_requests BIGINT,
    total_cost NUMERIC(38, 12),
    currency VARCHAR(10),
    statement_status INTEGER,
    generated_at TIMESTAMPTZ,
    due_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    payment_status INTEGER,
    invoice_id BIGINT,
    export_id BIGINT
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_usage_statement_owner_period ON commerce_usage_statement (tenant_id, organization_id, owner_type, owner_id, period);
CREATE INDEX IF NOT EXISTS idx_commerce_usage_statement_tenant_status ON commerce_usage_statement (tenant_id, organization_id, statement_status, period_end, id);

CREATE TABLE IF NOT EXISTS commerce_usage_statement_item (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    source_type VARCHAR(128),
    source_id BIGINT,
    source_version BIGINT,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rebuild_version BIGINT NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    statement_id BIGINT,
    item_type INTEGER,
    modality INTEGER,
    model VARCHAR(128),
    model_list JSONB,
    provider_code VARCHAR(64),
    usage_text VARCHAR(256),
    breakdown_payload JSONB,
    request_count BIGINT,
    token_count BIGINT,
    asset_count BIGINT,
    duration_seconds NUMERIC(38, 12),
    cost_amount NUMERIC(38, 12),
    currency VARCHAR(10),
    source_usage_fact_ids JSONB
);

CREATE INDEX IF NOT EXISTS idx_commerce_usage_statement_item_statement ON commerce_usage_statement_item (statement_id, item_type, model);

CREATE TABLE IF NOT EXISTS commerce_settlement_export (
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
    export_no VARCHAR(128),
    export_type INTEGER,
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    statement_id BIGINT,
    file_manifest JSONB,
    file_hash VARCHAR(128),
    expire_at TIMESTAMPTZ,
    download_count BIGINT,
    created_by BIGINT,
    approved_by BIGINT,
    audit_log_id BIGINT
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_settlement_export_no ON commerce_settlement_export (export_no);
CREATE INDEX IF NOT EXISTS idx_commerce_settlement_export_tenant_period ON commerce_settlement_export (tenant_id, organization_id, period_start, period_end, created_at, id);

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

CREATE TABLE IF NOT EXISTS studio_app_template (
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
    metadata JSONB,
    template_no VARCHAR(64),
    template_code VARCHAR(128),
    template_name VARCHAR(255),
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
    visibility INTEGER,
    publish_status INTEGER,
    featured BOOLEAN,
    sort_weight INTEGER,
    owner_user_id BIGINT,
    source_app_id BIGINT,
    git_repo_url VARCHAR(1024),
    git_ref VARCHAR(128),
    git_sub_path VARCHAR(1024),
    current_version_id BIGINT,
    app_config_schema JSONB,
    default_app_config JSONB,
    variable_schema JSONB,
    dependency_manifest JSONB,
    capability_manifest JSONB,
    published_at TIMESTAMPTZ,
    deprecated_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_studio_app_template_no ON studio_app_template (tenant_id, template_no);
CREATE UNIQUE INDEX IF NOT EXISTS uk_studio_app_template_code ON studio_app_template (tenant_id, organization_id, template_code);
CREATE INDEX IF NOT EXISTS idx_studio_app_template_scope_status ON studio_app_template (tenant_id, organization_id, visibility, publish_status, status, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_studio_app_template_category ON studio_app_template (tenant_id, organization_id, category_id, publish_status, sort_weight, id);
CREATE INDEX IF NOT EXISTS idx_studio_app_template_type_runtime ON studio_app_template (tenant_id, organization_id, template_type, runtime, framework, status, id);
CREATE INDEX IF NOT EXISTS idx_studio_app_template_git_source ON studio_app_template (tenant_id, organization_id, git_repo_url, git_sub_path, status, id);
CREATE INDEX IF NOT EXISTS idx_studio_app_template_featured ON studio_app_template (tenant_id, organization_id, featured, sort_weight, id);

CREATE TABLE IF NOT EXISTS studio_app_template_version (
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
    metadata JSONB,
    template_id BIGINT,
    version_no VARCHAR(64),
    artifact_id BIGINT,
    changelog TEXT,
    file_manifest JSONB,
    dependency_manifest JSONB,
    capability_manifest JSONB,
    variable_schema JSONB,
    app_config_schema JSONB,
    default_app_config JSONB,
    publish_status INTEGER,
    published_at TIMESTAMPTZ,
    deprecated_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_studio_app_template_version_no ON studio_app_template_version (tenant_id, organization_id, template_id, version_no);
CREATE INDEX IF NOT EXISTS idx_studio_app_template_version_template ON studio_app_template_version (tenant_id, organization_id, template_id, publish_status, created_at, id);
CREATE INDEX IF NOT EXISTS idx_studio_app_template_version_artifact ON studio_app_template_version (tenant_id, organization_id, artifact_id, status, id);

CREATE TABLE IF NOT EXISTS studio_app_template_usage (
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
    metadata JSONB,
    template_id BIGINT,
    template_version_id BIGINT,
    target_app_id BIGINT,
    user_id BIGINT,
    request_id VARCHAR(128),
    usage_type INTEGER,
    input_snapshot JSONB,
    output_snapshot JSONB
);

CREATE INDEX IF NOT EXISTS idx_studio_app_template_usage_template ON studio_app_template_usage (tenant_id, organization_id, template_id, template_version_id, created_at, id);
CREATE INDEX IF NOT EXISTS idx_studio_app_template_usage_target ON studio_app_template_usage (tenant_id, organization_id, target_app_id, created_at, id);
CREATE INDEX IF NOT EXISTS idx_studio_app_template_usage_user ON studio_app_template_usage (tenant_id, organization_id, user_id, created_at, id);
CREATE INDEX IF NOT EXISTS idx_studio_app_template_usage_request ON studio_app_template_usage (tenant_id, organization_id, request_id, id);

CREATE TABLE IF NOT EXISTS content_announcement (
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
    title VARCHAR(200),
    content TEXT,
    target_scope INTEGER,
    audience_filter JSONB,
    announcement_type INTEGER,
    pinned BOOLEAN,
    published_at TIMESTAMPTZ,
    effective_from TIMESTAMPTZ,
    effective_to TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_content_announcement_target_status ON content_announcement (tenant_id, organization_id, target_scope, status, published_at, id);

CREATE TABLE IF NOT EXISTS content_doc_page (
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
    doc_code VARCHAR(64),
    doc_type INTEGER,
    title VARCHAR(200),
    slug VARCHAR(256),
    path VARCHAR(512),
    summary VARCHAR(512),
    content_source INTEGER,
    source_ref VARCHAR(512),
    content_hash VARCHAR(128),
    sort_order INTEGER,
    published_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_content_doc_page_type_slug ON content_doc_page (doc_type, slug);

CREATE TABLE IF NOT EXISTS content_openapi_snapshot (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    source_type VARCHAR(128),
    source_id BIGINT,
    source_version BIGINT,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rebuild_version BIGINT NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    api_system INTEGER,
    api_surface INTEGER,
    version VARCHAR(64),
    title VARCHAR(200),
    source_ref VARCHAR(512),
    openapi_hash VARCHAR(128),
    endpoint_count INTEGER,
    category_tree JSONB,
    example_manifest JSONB,
    published_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_content_openapi_snapshot_system_version ON content_openapi_snapshot (api_system, version);
CREATE INDEX IF NOT EXISTS idx_content_openapi_snapshot_system_published ON content_openapi_snapshot (api_system, published_at, id);

CREATE TABLE IF NOT EXISTS content_sdk_release (
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
    api_system INTEGER,
    language VARCHAR(64),
    language_icon VARCHAR(128),
    language_description VARCHAR(512),
    package_name VARCHAR(128),
    package_manager VARCHAR(64),
    install_command VARCHAR(512),
    import_code TEXT,
    init_code TEXT,
    example_code TEXT,
    github_url VARCHAR(1024),
    source_repo VARCHAR(512),
    docs_url VARCHAR(1024),
    openapi_snapshot_id BIGINT,
    default_base_url VARCHAR(512),
    artifact_manifest JSONB,
    example_manifest JSONB,
    published_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_content_sdk_release_system_lang_version ON content_sdk_release (api_system, language, version);
CREATE INDEX IF NOT EXISTS idx_content_sdk_release_system_lang_published ON content_sdk_release (api_system, language, published_at, id);

CREATE TABLE IF NOT EXISTS content_reaction (
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
    reaction_type INTEGER,
    reaction_value VARCHAR(64),
    client_ip_hash VARCHAR(128),
    user_agent_hash VARCHAR(128),
    cancelled_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_content_reaction_user_target_type ON content_reaction (tenant_id, organization_id, user_id, target_type, target_id, reaction_type);
CREATE INDEX IF NOT EXISTS idx_content_reaction_target_type ON content_reaction (target_type, target_id, reaction_type, created_at, id);

CREATE TABLE IF NOT EXISTS content_course (
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
    course_code VARCHAR(64),
    title VARCHAR(200),
    description TEXT,
    thumbnail_media_resource_id VARCHAR(128),
    thumbnail_object_blob_id BIGINT,
    thumbnail_resource_snapshot JSONB,
    instructor_snapshot JSONB,
    duration_text VARCHAR(64),
    lessons_count INTEGER,
    rating_score NUMERIC(38, 12),
    students_count BIGINT,
    level INTEGER,
    category VARCHAR(64),
    tags JSONB,
    external_bvid VARCHAR(64),
    content TEXT,
    price_amount NUMERIC(38, 12),
    currency VARCHAR(10),
    is_collection BOOLEAN,
    published_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_content_course_code ON content_course (course_code);
CREATE INDEX IF NOT EXISTS idx_content_course_category_status ON content_course (category, status, published_at, id);

CREATE TABLE IF NOT EXISTS content_course_section (
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
    course_id BIGINT,
    section_no INTEGER,
    title VARCHAR(200),
    description TEXT,
    sort_order INTEGER,
    lesson_count INTEGER,
    duration_seconds BIGINT
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_content_course_section_no ON content_course_section (course_id, section_no);
CREATE INDEX IF NOT EXISTS idx_content_course_section_course ON content_course_section (course_id, sort_order, id);

CREATE TABLE IF NOT EXISTS content_course_lesson (
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
    course_id BIGINT,
    section_id BIGINT,
    lesson_no INTEGER,
    title VARCHAR(200),
    description TEXT,
    video_media_resource_id VARCHAR(128),
    video_object_blob_id BIGINT,
    video_resource_snapshot JSONB,
    external_bvid VARCHAR(64),
    source_provider VARCHAR(64),
    duration_seconds BIGINT,
    duration_text VARCHAR(64),
    content TEXT,
    sort_order INTEGER,
    free_preview BOOLEAN
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_content_course_lesson_no ON content_course_lesson (course_id, lesson_no);
CREATE INDEX IF NOT EXISTS idx_content_course_lesson_section ON content_course_lesson (section_id, sort_order, id);

CREATE TABLE IF NOT EXISTS content_course_relation (
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
    course_id BIGINT,
    related_course_id BIGINT,
    relation_type INTEGER,
    sort_order INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_content_course_relation ON content_course_relation (course_id, related_course_id, relation_type);

CREATE TABLE IF NOT EXISTS content_course_application (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT NOT NULL,
    owner_type INTEGER,
    owner_id BIGINT,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    source_provider VARCHAR(64) NOT NULL,
    external_bvid VARCHAR(64),
    video_media_resource_id VARCHAR(128),
    video_object_blob_id BIGINT,
    video_resource_snapshot JSONB,
    contact_name VARCHAR(128),
    contact_email VARCHAR(254),
    submitted_at TIMESTAMPTZ,
    reviewed_by BIGINT,
    reviewed_at TIMESTAMPTZ,
    review_comment VARCHAR(1000)
);

CREATE INDEX IF NOT EXISTS idx_content_course_application_status ON content_course_application (tenant_id, organization_id, status, created_at, id);
CREATE INDEX IF NOT EXISTS idx_content_course_application_user ON content_course_application (tenant_id, organization_id, user_id, created_at, id);

CREATE TABLE IF NOT EXISTS ops_gateway_instance (
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
    instance_code VARCHAR(128),
    deployment_mode INTEGER,
    region VARCHAR(64),
    cell VARCHAR(64),
    version_name VARCHAR(64),
    host_name VARCHAR(128),
    ip_address_hash VARCHAR(128),
    ip_address_masked VARCHAR(64),
    node_name VARCHAR(128),
    pod_name VARCHAR(128),
    container_id_hash VARCHAR(128),
    desktop_device_hash VARCHAR(128),
    runtime_type INTEGER,
    orchestrator INTEGER,
    started_at TIMESTAMPTZ,
    last_heartbeat_at TIMESTAMPTZ,
    health_status INTEGER,
    config_hash VARCHAR(128)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ops_gateway_instance_code ON ops_gateway_instance (instance_code);
CREATE INDEX IF NOT EXISTS idx_ops_gateway_instance_region_status ON ops_gateway_instance (region, cell, health_status, last_heartbeat_at);

CREATE TABLE IF NOT EXISTS ops_gateway_heartbeat (
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
    instance_id BIGINT,
    heartbeat_at TIMESTAMPTZ,
    cpu_percent NUMERIC(38, 12),
    memory_percent NUMERIC(38, 12),
    disk_percent NUMERIC(38, 12),
    network_in_bytes BIGINT,
    network_out_bytes BIGINT,
    active_connections BIGINT,
    uptime_seconds BIGINT,
    open_file_count BIGINT,
    thread_count BIGINT,
    payload JSONB
);

CREATE INDEX IF NOT EXISTS idx_ops_gateway_heartbeat_instance_time ON ops_gateway_heartbeat (instance_id, heartbeat_at, id);

CREATE TABLE IF NOT EXISTS ops_config_snapshot (
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
    snapshot_no VARCHAR(128),
    config_scope INTEGER,
    config_type INTEGER,
    source_table VARCHAR(128),
    source_ids JSONB,
    config_payload JSONB,
    config_hash VARCHAR(128),
    published_at TIMESTAMPTZ,
    published_by BIGINT,
    rollback_from_snapshot_id BIGINT
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ops_config_snapshot_no ON ops_config_snapshot (snapshot_no);
CREATE INDEX IF NOT EXISTS idx_ops_config_snapshot_tenant_scope ON ops_config_snapshot (tenant_id, organization_id, config_scope, config_type, created_at, id);

CREATE TABLE IF NOT EXISTS ops_audit_log (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    request_id VARCHAR(128),
    trace_id VARCHAR(128),
    operator_id BIGINT,
    action VARCHAR(128),
    target_type INTEGER,
    target_id BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    retention_until TIMESTAMPTZ,
    legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    operator_type INTEGER,
    operator_name_snapshot VARCHAR(128),
    target_uuid VARCHAR(64),
    client_ip_hash VARCHAR(128),
    user_agent_hash VARCHAR(128),
    before_hash VARCHAR(128),
    after_hash VARCHAR(128),
    change_summary JSONB,
    risk_level INTEGER,
    approval_id BIGINT
);

CREATE INDEX IF NOT EXISTS idx_ops_audit_log_tenant_operator_created ON ops_audit_log (tenant_id, organization_id, operator_type, operator_id, created_at, id);
CREATE INDEX IF NOT EXISTS idx_ops_audit_log_tenant_target_created ON ops_audit_log (tenant_id, organization_id, target_type, target_id, created_at, id);
CREATE INDEX IF NOT EXISTS idx_ops_audit_log_request ON ops_audit_log (tenant_id, organization_id, request_id);

CREATE TABLE IF NOT EXISTS ops_outbox_event (
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
    event_id VARCHAR(128),
    aggregate_type VARCHAR(128),
    aggregate_id BIGINT,
    aggregate_uuid VARCHAR(64),
    event_type VARCHAR(128),
    event_version INTEGER,
    event_payload JSONB,
    headers JSONB,
    publish_status INTEGER,
    retry_count INTEGER,
    next_retry_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    failure_reason VARCHAR(1024)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ops_outbox_event_id ON ops_outbox_event (event_id);
CREATE INDEX IF NOT EXISTS idx_ops_outbox_event_status_retry ON ops_outbox_event (publish_status, next_retry_at, created_at, id);
CREATE INDEX IF NOT EXISTS idx_ops_outbox_event_aggregate ON ops_outbox_event (aggregate_type, aggregate_id, created_at, id);

CREATE TABLE IF NOT EXISTS ops_inbox_event (
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
    source_system VARCHAR(128),
    message_id VARCHAR(128),
    consumer_name VARCHAR(128),
    event_type VARCHAR(128),
    event_version INTEGER,
    process_status INTEGER,
    retry_count INTEGER,
    processed_at TIMESTAMPTZ,
    failure_reason VARCHAR(1024)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ops_inbox_event_message ON ops_inbox_event (source_system, message_id, consumer_name);
CREATE INDEX IF NOT EXISTS idx_ops_inbox_event_status_retry ON ops_inbox_event (process_status, created_at, id);

CREATE TABLE IF NOT EXISTS ops_job_execution (
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
    job_name VARCHAR(128),
    job_type INTEGER,
    trigger_type INTEGER,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    duration_ms BIGINT,
    execution_status INTEGER,
    processed_count BIGINT,
    success_count BIGINT,
    failure_count BIGINT,
    failure_reason VARCHAR(1024),
    payload JSONB
);

CREATE INDEX IF NOT EXISTS idx_ops_job_execution_name_started ON ops_job_execution (job_name, started_at, id);
CREATE INDEX IF NOT EXISTS idx_ops_job_execution_status_started ON ops_job_execution (execution_status, started_at, id);
CREATE INDEX IF NOT EXISTS idx_ops_job_execution_model_ranking_scope_started ON ops_job_execution (tenant_id, organization_id, status, job_type, job_name, started_at, id);

CREATE TABLE IF NOT EXISTS ops_alert_event (
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
    alert_no VARCHAR(128),
    severity INTEGER,
    source VARCHAR(128),
    title VARCHAR(200),
    message VARCHAR(1024),
    alert_status INTEGER,
    first_seen_at TIMESTAMPTZ,
    last_seen_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    resolved_by BIGINT
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ops_alert_event_no ON ops_alert_event (alert_no);
CREATE INDEX IF NOT EXISTS idx_ops_alert_event_status_severity ON ops_alert_event (alert_status, severity, last_seen_at, id);

CREATE TABLE IF NOT EXISTS ops_notification_message (
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
    app_id VARCHAR(128),
    scope_type INTEGER NOT NULL DEFAULT 1,
    message_code VARCHAR(128),
    message_type INTEGER,
    title VARCHAR(200),
    summary VARCHAR(512),
    content TEXT,
    severity INTEGER,
    priority INTEGER NOT NULL DEFAULT 0,
    show_as_popup BOOLEAN NOT NULL DEFAULT FALSE,
    action_url VARCHAR(512),
    published_at TIMESTAMPTZ,
    expire_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ops_notification_message_scope ON ops_notification_message (tenant_id, organization_id, app_id, scope_type, status, published_at, id);
CREATE INDEX IF NOT EXISTS idx_ops_notification_message_popup ON ops_notification_message (tenant_id, organization_id, show_as_popup, published_at, id);

CREATE TABLE IF NOT EXISTS ops_notification_recipient (
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
    message_id BIGINT NOT NULL,
    app_id VARCHAR(128),
    recipient_type INTEGER NOT NULL,
    recipient_value VARCHAR(256),
    recipient_user_id BIGINT,
    recipient_role_code VARCHAR(128)
);

CREATE INDEX IF NOT EXISTS idx_ops_notification_recipient_message ON ops_notification_recipient (tenant_id, organization_id, message_id, status, id);
CREATE INDEX IF NOT EXISTS idx_ops_notification_recipient_user ON ops_notification_recipient (tenant_id, organization_id, recipient_type, recipient_user_id, status, id);
CREATE INDEX IF NOT EXISTS idx_ops_notification_recipient_role ON ops_notification_recipient (tenant_id, organization_id, recipient_type, recipient_role_code, status, id);

CREATE TABLE IF NOT EXISTS ops_notification_delivery (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT,
    owner_type INTEGER,
    owner_id BIGINT,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    app_id VARCHAR(128) NOT NULL DEFAULT 'default',
    message_id BIGINT,
    delivery_channel INTEGER,
    delivery_status INTEGER,
    read_at TIMESTAMPTZ,
    popup_seen_at TIMESTAMPTZ,
    archived_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    failure_code VARCHAR(128),
    retry_count INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ops_notification_delivery_user_message_app ON ops_notification_delivery (tenant_id, organization_id, message_id, user_id, app_id, delivery_channel);
CREATE INDEX IF NOT EXISTS idx_ops_notification_delivery_user_read ON ops_notification_delivery (tenant_id, organization_id, user_id, app_id, read_at, created_at, id);
CREATE INDEX IF NOT EXISTS idx_ops_notification_delivery_popup_seen ON ops_notification_delivery (tenant_id, organization_id, user_id, app_id, popup_seen_at, id);

CREATE TABLE IF NOT EXISTS ops_notification_preference (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT,
    owner_type INTEGER,
    owner_id BIGINT,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    app_id VARCHAR(128) NOT NULL DEFAULT 'default',
    message_type INTEGER NOT NULL DEFAULT 0,
    delivery_channel INTEGER NOT NULL DEFAULT 1,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    quiet_hours JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ops_notification_preference_user_app_type_channel ON ops_notification_preference (tenant_id, organization_id, user_id, app_id, message_type, delivery_channel);
CREATE INDEX IF NOT EXISTS idx_ops_notification_preference_user ON ops_notification_preference (tenant_id, organization_id, user_id, app_id, status, id);

CREATE TABLE IF NOT EXISTS ops_metric_snapshot (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    source_type VARCHAR(128),
    source_id BIGINT,
    source_version BIGINT,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rebuild_version BIGINT NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    metric_scope INTEGER,
    metric_name VARCHAR(128),
    metric_period INTEGER,
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    dimension_key VARCHAR(128),
    dimension_value VARCHAR(256),
    metric_value NUMERIC(38, 12),
    metric_unit VARCHAR(64),
    payload JSONB
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ops_metric_snapshot ON ops_metric_snapshot (metric_scope, metric_name, metric_period, period_start, dimension_key, dimension_value);

CREATE TABLE IF NOT EXISTS integration_service_provider (
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
    provider_no VARCHAR(64) NOT NULL,
    display_name VARCHAR(128) NOT NULL,
    provider_type VARCHAR(64),
    owner_tenant_id BIGINT,
    owner_organization_id BIGINT,
    owner_user_id BIGINT,
    default_currency VARCHAR(10),
    default_timezone VARCHAR(64),
    risk_level INTEGER,
    suspended_reason_code VARCHAR(128),
    activated_at TIMESTAMPTZ,
    suspended_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_integration_service_provider_no ON integration_service_provider (tenant_id, organization_id, provider_no);
CREATE INDEX IF NOT EXISTS idx_integration_service_provider_status ON integration_service_provider (tenant_id, organization_id, status, risk_level, id);

CREATE TABLE IF NOT EXISTS integration_service_provider_edge (
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
    edge_no VARCHAR(64) NOT NULL,
    seller_provider_id BIGINT NOT NULL,
    buyer_provider_id BIGINT NOT NULL,
    edge_type VARCHAR(64),
    contract_no VARCHAR(128),
    settlement_mode VARCHAR(32),
    effective_from TIMESTAMPTZ,
    effective_to TIMESTAMPTZ,
    contract_snapshot JSONB
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_integration_service_provider_edge_no ON integration_service_provider_edge (tenant_id, organization_id, edge_no);
CREATE INDEX IF NOT EXISTS idx_integration_service_provider_edge_seller ON integration_service_provider_edge (tenant_id, organization_id, seller_provider_id, status, effective_from, id);
CREATE INDEX IF NOT EXISTS idx_integration_service_provider_edge_buyer ON integration_service_provider_edge (tenant_id, organization_id, buyer_provider_id, status, effective_from, id);

CREATE TABLE IF NOT EXISTS integration_service_provider_closure (
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
    ancestor_provider_id BIGINT NOT NULL,
    descendant_provider_id BIGINT NOT NULL,
    depth INTEGER,
    path VARCHAR(2048),
    direct_edge_id BIGINT,
    effective_from TIMESTAMPTZ,
    effective_to TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_integration_service_provider_closure_pair ON integration_service_provider_closure (tenant_id, organization_id, ancestor_provider_id, descendant_provider_id, effective_from);
CREATE INDEX IF NOT EXISTS idx_integration_service_provider_closure_desc ON integration_service_provider_closure (tenant_id, organization_id, descendant_provider_id, depth, status, id);

CREATE TABLE IF NOT EXISTS integration_service_provider_member (
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
    service_provider_id BIGINT NOT NULL,
    member_user_id BIGINT NOT NULL,
    role_code VARCHAR(64),
    permission_policy_id BIGINT,
    effective_from TIMESTAMPTZ,
    effective_to TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_integration_service_provider_member_user ON integration_service_provider_member (tenant_id, organization_id, service_provider_id, member_user_id, role_code);
CREATE INDEX IF NOT EXISTS idx_integration_service_provider_member_user ON integration_service_provider_member (tenant_id, organization_id, member_user_id, status, id);

CREATE TABLE IF NOT EXISTS integration_service_provider_subject_binding (
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
    service_provider_id BIGINT NOT NULL,
    subject_type VARCHAR(64) NOT NULL,
    subject_id BIGINT NOT NULL,
    subject_code VARCHAR(128),
    binding_priority INTEGER,
    effective_from TIMESTAMPTZ,
    effective_to TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_integration_service_provider_subject_binding ON integration_service_provider_subject_binding (tenant_id, organization_id, subject_type, subject_id, effective_from);
CREATE INDEX IF NOT EXISTS idx_integration_service_provider_subject_provider ON integration_service_provider_subject_binding (tenant_id, organization_id, service_provider_id, status, binding_priority, id);

CREATE TABLE IF NOT EXISTS integration_service_provider_contract (
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
    contract_no VARCHAR(128) NOT NULL,
    edge_id BIGINT NOT NULL,
    seller_provider_id BIGINT,
    buyer_provider_id BIGINT,
    contract_type VARCHAR(64),
    current_version_id BIGINT,
    signed_at TIMESTAMPTZ,
    effective_from TIMESTAMPTZ,
    effective_to TIMESTAMPTZ,
    contract_file_ref VARCHAR(512)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_integration_service_provider_contract_no ON integration_service_provider_contract (tenant_id, organization_id, contract_no);
CREATE INDEX IF NOT EXISTS idx_integration_service_provider_contract_edge ON integration_service_provider_contract (tenant_id, organization_id, edge_id, status, id);

CREATE TABLE IF NOT EXISTS integration_service_provider_contract_version (
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
    contract_id BIGINT NOT NULL,
    version_no INTEGER NOT NULL,
    version_hash VARCHAR(128),
    contract_payload JSONB,
    approval_status VARCHAR(32),
    requested_by BIGINT,
    approved_by BIGINT,
    approved_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_integration_service_provider_contract_version ON integration_service_provider_contract_version (tenant_id, organization_id, contract_id, version_no);

CREATE TABLE IF NOT EXISTS integration_service_provider_finance_profile (
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
    service_provider_id BIGINT NOT NULL,
    settlement_mode VARCHAR(32),
    billing_cycle VARCHAR(32),
    settlement_day INTEGER,
    credit_limit_amount NUMERIC(38, 12),
    warning_threshold_amount NUMERIC(38, 12),
    suspend_threshold_amount NUMERIC(38, 12),
    currency VARCHAR(10),
    invoice_title_id BIGINT,
    tax_profile_ref VARCHAR(256),
    payment_terms_days INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_integration_service_provider_finance_profile ON integration_service_provider_finance_profile (tenant_id, organization_id, service_provider_id);

CREATE TABLE IF NOT EXISTS integration_service_provider_account_binding (
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
    service_provider_id BIGINT NOT NULL,
    commerce_account_id VARCHAR(128) NOT NULL,
    account_role VARCHAR(64),
    asset_type VARCHAR(32),
    currency VARCHAR(10)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_integration_service_provider_account_binding ON integration_service_provider_account_binding (tenant_id, organization_id, service_provider_id, account_role, asset_type, currency);

CREATE TABLE IF NOT EXISTS integration_service_provider_price_plan (
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
    seller_provider_id BIGINT,
    buyer_provider_id BIGINT,
    edge_id BIGINT NOT NULL,
    plan_code VARCHAR(64) NOT NULL,
    plan_name VARCHAR(128),
    base_amount_source VARCHAR(64),
    pricing_mode VARCHAR(64),
    default_multiplier NUMERIC(38, 12),
    default_markup_amount NUMERIC(38, 12),
    currency VARCHAR(10),
    fallback_mode VARCHAR(32),
    effective_from TIMESTAMPTZ,
    effective_to TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_integration_service_provider_price_plan_edge_code ON integration_service_provider_price_plan (tenant_id, organization_id, edge_id, plan_code);
CREATE INDEX IF NOT EXISTS idx_integration_service_provider_price_plan_buyer ON integration_service_provider_price_plan (tenant_id, organization_id, buyer_provider_id, status, effective_from, id);

CREATE TABLE IF NOT EXISTS integration_service_provider_price_rule (
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
    seller_provider_id BIGINT,
    buyer_provider_id BIGINT,
    edge_id BIGINT NOT NULL,
    price_plan_id BIGINT NOT NULL,
    catalog_key VARCHAR(256),
    model VARCHAR(256),
    provider_code VARCHAR(64),
    channel_id BIGINT,
    billing_meter_code VARCHAR(64),
    token_kind VARCHAR(64),
    unit_price NUMERIC(38, 12),
    unit_size NUMERIC(38, 12),
    minimum_charge NUMERIC(38, 12),
    rounding_mode VARCHAR(32),
    priority INTEGER,
    effective_from TIMESTAMPTZ,
    effective_to TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_integration_service_provider_price_rule_lookup ON integration_service_provider_price_rule (tenant_id, organization_id, edge_id, catalog_key, billing_meter_code, token_kind, status, priority);
CREATE INDEX IF NOT EXISTS idx_integration_service_provider_price_rule_model ON integration_service_provider_price_rule (tenant_id, organization_id, buyer_provider_id, model, billing_meter_code, token_kind, status);

CREATE TABLE IF NOT EXISTS integration_service_provider_price_change_request (
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
    change_no VARCHAR(128) NOT NULL,
    seller_provider_id BIGINT,
    buyer_provider_id BIGINT,
    change_type VARCHAR(64),
    draft_payload JSONB,
    before_hash VARCHAR(128),
    after_hash VARCHAR(128),
    approval_status VARCHAR(32),
    requested_by BIGINT,
    approved_by BIGINT,
    effective_from TIMESTAMPTZ,
    published_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_integration_service_provider_price_change_no ON integration_service_provider_price_change_request (tenant_id, organization_id, change_no);

CREATE TABLE IF NOT EXISTS object_provider (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    provider_code VARCHAR(96) NOT NULL,
    provider_type VARCHAR(64) NOT NULL,
    endpoint_url VARCHAR(512),
    region VARCHAR(64),
    credential_ref VARCHAR(256) NOT NULL,
    path_style_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    supports_multipart BOOLEAN NOT NULL DEFAULT TRUE,
    supports_lifecycle BOOLEAN NOT NULL DEFAULT FALSE,
    supports_object_lock BOOLEAN NOT NULL DEFAULT FALSE,
    health_status VARCHAR(64) NOT NULL DEFAULT 'unknown',
    last_health_check_at TIMESTAMPTZ,
    idempotency_key VARCHAR(128),
    request_id VARCHAR(128)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_object_provider_tenant_code ON object_provider (tenant_id, organization_id, provider_code);
CREATE UNIQUE INDEX IF NOT EXISTS uk_object_provider_idempotency ON object_provider (tenant_id, organization_id, idempotency_key);
CREATE INDEX IF NOT EXISTS idx_object_provider_tenant_status ON object_provider (tenant_id, organization_id, status, id);

CREATE TABLE IF NOT EXISTS object_bucket (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    provider_id BIGINT NOT NULL,
    bucket_name VARCHAR(128) NOT NULL,
    bucket_region VARCHAR(64),
    logical_scope VARCHAR(64) NOT NULL,
    data_residency_region VARCHAR(64),
    object_key_prefix VARCHAR(512) NOT NULL DEFAULT '',
    default_storage_class VARCHAR(64) NOT NULL DEFAULT 'STANDARD',
    default_encryption_mode VARCHAR(64) NOT NULL DEFAULT 'sse_s3',
    kms_key_ref VARCHAR(256),
    versioning_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    object_lock_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    lifecycle_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    public_access_blocked BOOLEAN NOT NULL DEFAULT TRUE,
    idempotency_key VARCHAR(128),
    request_id VARCHAR(128)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_object_bucket_provider_name ON object_bucket (tenant_id, organization_id, provider_id, bucket_name);
CREATE UNIQUE INDEX IF NOT EXISTS uk_object_bucket_idempotency ON object_bucket (tenant_id, organization_id, idempotency_key);
CREATE INDEX IF NOT EXISTS idx_object_bucket_scope_status ON object_bucket (tenant_id, organization_id, logical_scope, status, id);

CREATE TABLE IF NOT EXISTS storage_default_bucket_policy (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    logical_scope VARCHAR(64) NOT NULL,
    bucket_id BIGINT NOT NULL,
    bucket_logical_scope VARCHAR(64) NOT NULL,
    updated_by BIGINT NOT NULL,
    reason VARCHAR(512),
    request_id VARCHAR(128)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_storage_default_bucket_policy_scope ON storage_default_bucket_policy (tenant_id, organization_id, logical_scope);
CREATE INDEX IF NOT EXISTS idx_storage_default_bucket_policy_bucket ON storage_default_bucket_policy (tenant_id, organization_id, bucket_id, status, id);

CREATE TABLE IF NOT EXISTS storage_quota_policy (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    scope_type VARCHAR(64) NOT NULL,
    scope_id VARCHAR(128) NOT NULL,
    quota_limit_bytes BIGINT NOT NULL,
    single_file_limit_bytes BIGINT,
    enforcement VARCHAR(64),
    idempotency_key VARCHAR(128),
    request_id VARCHAR(128)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_storage_quota_policy_scope ON storage_quota_policy (tenant_id, organization_id, scope_type, scope_id);
CREATE UNIQUE INDEX IF NOT EXISTS uk_storage_quota_policy_idempotency ON storage_quota_policy (tenant_id, organization_id, idempotency_key);
CREATE INDEX IF NOT EXISTS idx_storage_quota_policy_tenant_status ON storage_quota_policy (tenant_id, organization_id, status, id);

CREATE TABLE IF NOT EXISTS storage_quota_reservation (
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
    scope_type VARCHAR(64) NOT NULL,
    scope_id VARCHAR(128) NOT NULL,
    reservation_no VARCHAR(128) NOT NULL,
    upload_session_id BIGINT,
    reserved_bytes BIGINT NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ,
    released_at TIMESTAMPTZ,
    idempotency_key VARCHAR(128)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_storage_quota_reservation_no ON storage_quota_reservation (tenant_id, organization_id, reservation_no);
CREATE INDEX IF NOT EXISTS idx_storage_quota_reservation_scope_status ON storage_quota_reservation (tenant_id, organization_id, scope_type, scope_id, status, id);

CREATE TABLE IF NOT EXISTS storage_usage_counter (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT,
    owner_type INTEGER,
    owner_id BIGINT,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    scope_type VARCHAR(64) NOT NULL,
    scope_id VARCHAR(128) NOT NULL,
    space_id VARCHAR(128),
    app_id VARCHAR(128),
    business_domain VARCHAR(128),
    used_logical_bytes BIGINT NOT NULL DEFAULT 0,
    used_physical_bytes BIGINT NOT NULL DEFAULT 0,
    reserved_bytes BIGINT NOT NULL DEFAULT 0,
    retained_bytes BIGINT NOT NULL DEFAULT 0,
    trash_bytes BIGINT NOT NULL DEFAULT 0,
    file_count BIGINT NOT NULL DEFAULT 0,
    last_ledger_id BIGINT NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_storage_usage_counter_scope ON storage_usage_counter (tenant_id, organization_id, scope_type, scope_id);
CREATE INDEX IF NOT EXISTS idx_storage_usage_counter_tenant_updated ON storage_usage_counter (tenant_id, organization_id, updated_at, id);

CREATE TABLE IF NOT EXISTS storage_usage_ledger (
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
    scope_type VARCHAR(64) NOT NULL,
    scope_id VARCHAR(128) NOT NULL,
    space_id VARCHAR(128),
    app_id VARCHAR(128),
    business_domain VARCHAR(128),
    usage_event_type VARCHAR(128) NOT NULL,
    delta_logical_bytes BIGINT NOT NULL DEFAULT 0,
    delta_physical_bytes BIGINT NOT NULL DEFAULT 0,
    delta_reserved_bytes BIGINT NOT NULL DEFAULT 0,
    delta_file_count BIGINT NOT NULL DEFAULT 0,
    reason VARCHAR(512),
    idempotency_key VARCHAR(128),
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_storage_usage_ledger_idempotency ON storage_usage_ledger (tenant_id, organization_id, idempotency_key);
CREATE INDEX IF NOT EXISTS idx_storage_usage_ledger_scope_time ON storage_usage_ledger (tenant_id, organization_id, scope_type, scope_id, occurred_at, id);

CREATE TABLE IF NOT EXISTS storage_usage_snapshot (
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
    user_id BIGINT,
    scope_type VARCHAR(64) NOT NULL,
    scope_id VARCHAR(128) NOT NULL,
    space_id VARCHAR(128),
    app_id VARCHAR(128),
    business_domain VARCHAR(128),
    snapshot_type VARCHAR(64) NOT NULL,
    snapshot_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    used_logical_bytes BIGINT NOT NULL DEFAULT 0,
    used_physical_bytes BIGINT NOT NULL DEFAULT 0,
    reserved_bytes BIGINT NOT NULL DEFAULT 0,
    retained_bytes BIGINT NOT NULL DEFAULT 0,
    trash_bytes BIGINT NOT NULL DEFAULT 0,
    file_count BIGINT NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_storage_usage_snapshot_scope_time ON storage_usage_snapshot (tenant_id, organization_id, scope_type, scope_id, snapshot_type, snapshot_at);
CREATE INDEX IF NOT EXISTS idx_storage_usage_snapshot_scope ON storage_usage_snapshot (tenant_id, organization_id, scope_type, scope_id, id);

CREATE TABLE IF NOT EXISTS storage_reconciliation_run (
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
    provider_id BIGINT,
    bucket_id BIGINT,
    run_type VARCHAR(64) NOT NULL,
    check_mode VARCHAR(64),
    dry_run BOOLEAN NOT NULL DEFAULT TRUE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    scanned_object_count BIGINT NOT NULL DEFAULT 0,
    missing_object_count BIGINT NOT NULL DEFAULT 0,
    orphan_object_count BIGINT NOT NULL DEFAULT 0,
    checksum_mismatch_count BIGINT NOT NULL DEFAULT 0,
    requested_by BIGINT NOT NULL,
    idempotency_key VARCHAR(128) NOT NULL,
    request_id VARCHAR(128),
    summary_json JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_storage_reconciliation_run_idempotency ON storage_reconciliation_run (tenant_id, organization_id, idempotency_key);
CREATE INDEX IF NOT EXISTS idx_storage_reconciliation_run_status ON storage_reconciliation_run (tenant_id, organization_id, status, started_at, id);

CREATE TABLE IF NOT EXISTS storage_reconciliation_item (
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
    run_id BIGINT NOT NULL,
    bucket_id BIGINT,
    object_blob_id BIGINT,
    object_key VARCHAR(1024) NOT NULL,
    issue_type VARCHAR(64) NOT NULL,
    expected_hash VARCHAR(128),
    actual_hash VARCHAR(128),
    expected_size_bytes BIGINT,
    actual_size_bytes BIGINT,
    repair_status VARCHAR(64),
    repair_payload JSONB
);

CREATE INDEX IF NOT EXISTS idx_storage_reconciliation_item_run ON storage_reconciliation_item (tenant_id, organization_id, run_id, issue_type, id);

CREATE TABLE IF NOT EXISTS storage_gc_job (
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
    job_type VARCHAR(64) NOT NULL,
    dry_run BOOLEAN NOT NULL DEFAULT TRUE,
    requested_by BIGINT NOT NULL,
    idempotency_key VARCHAR(128) NOT NULL,
    cursor_token VARCHAR(512),
    candidate_count BIGINT NOT NULL DEFAULT 0,
    deleted_object_count BIGINT NOT NULL DEFAULT 0,
    released_bytes BIGINT NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    request_id VARCHAR(128),
    criteria_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    result_json JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_storage_gc_job_idempotency ON storage_gc_job (tenant_id, organization_id, idempotency_key);
CREATE INDEX IF NOT EXISTS idx_storage_gc_job_status ON storage_gc_job (tenant_id, organization_id, status, created_at, id);

CREATE TABLE IF NOT EXISTS object_blob (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT,
    owner_type INTEGER,
    owner_id BIGINT,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    provider_id BIGINT,
    bucket_id BIGINT NOT NULL,
    object_key VARCHAR(1024) NOT NULL,
    version_id VARCHAR(256),
    storage_etag VARCHAR(256),
    content_sha256 VARCHAR(128) NOT NULL,
    content_type VARCHAR(256),
    original_filename VARCHAR(512),
    size_bytes BIGINT NOT NULL DEFAULT 0,
    physical_size_bytes BIGINT NOT NULL DEFAULT 0,
    storage_class VARCHAR(64),
    encryption_mode VARCHAR(64),
    kms_key_ref VARCHAR(256),
    retention_until TIMESTAMPTZ,
    legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    last_verified_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_object_blob_bucket_key_version ON object_blob (tenant_id, organization_id, bucket_id, object_key, version_id);
CREATE INDEX IF NOT EXISTS idx_object_blob_owner_status ON object_blob (tenant_id, organization_id, owner_type, owner_id, status, id);
CREATE INDEX IF NOT EXISTS idx_object_blob_bucket_status ON object_blob (tenant_id, organization_id, bucket_id, status, id);

CREATE TABLE IF NOT EXISTS media_resource (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT,
    owner_type INTEGER,
    owner_id BIGINT,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    media_resource_no VARCHAR(128) NOT NULL,
    kind VARCHAR(32) NOT NULL,
    source VARCHAR(32) NOT NULL,
    object_blob_id BIGINT,
    bucket_id BIGINT,
    object_key VARCHAR(1024),
    object_version VARCHAR(256),
    uri VARCHAR(1024),
    file_name VARCHAR(512),
    mime_type VARCHAR(256),
    size_bytes BIGINT NOT NULL DEFAULT 0,
    checksum_json JSONB,
    width INTEGER,
    height INTEGER,
    duration_seconds NUMERIC(38, 12),
    alt_text VARCHAR(512),
    title VARCHAR(255),
    access_json JSONB,
    ai_json JSONB,
    renditions_json JSONB
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_media_resource_no ON media_resource (tenant_id, organization_id, media_resource_no);
CREATE INDEX IF NOT EXISTS idx_media_resource_blob ON media_resource (tenant_id, organization_id, object_blob_id, status, id);
CREATE INDEX IF NOT EXISTS idx_media_resource_kind_status ON media_resource (tenant_id, organization_id, kind, status, id);

CREATE TABLE IF NOT EXISTS object_tag (
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
    object_blob_id BIGINT NOT NULL,
    tag_key VARCHAR(128) NOT NULL,
    tag_value VARCHAR(512) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_object_tag_blob_key ON object_tag (tenant_id, organization_id, object_blob_id, tag_key);
CREATE INDEX IF NOT EXISTS idx_object_tag_key_value ON object_tag (tenant_id, organization_id, tag_key, tag_value, id);

CREATE TABLE IF NOT EXISTS upload_session (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT,
    owner_type INTEGER,
    owner_id BIGINT,
    data_scope INTEGER NOT NULL DEFAULT 0,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    deleted_by BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    upload_session_no VARCHAR(128) NOT NULL,
    provider_id BIGINT,
    bucket_id BIGINT NOT NULL,
    logical_scope VARCHAR(64),
    object_key VARCHAR(1024) NOT NULL,
    upload_mode VARCHAR(64) NOT NULL,
    s3_upload_id VARCHAR(512),
    content_type VARCHAR(256),
    original_filename VARCHAR(512),
    expected_size_bytes BIGINT NOT NULL DEFAULT 0,
    expected_sha256 VARCHAR(128),
    part_size_bytes BIGINT NOT NULL DEFAULT 0,
    part_count INTEGER NOT NULL DEFAULT 0,
    completed_part_count INTEGER NOT NULL DEFAULT 0,
    completed_bytes BIGINT NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    aborted_at TIMESTAMPTZ,
    idempotency_key VARCHAR(128),
    request_id VARCHAR(128)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_upload_session_no ON upload_session (tenant_id, organization_id, upload_session_no);
CREATE UNIQUE INDEX IF NOT EXISTS uk_upload_session_idempotency ON upload_session (tenant_id, organization_id, idempotency_key);
CREATE INDEX IF NOT EXISTS idx_upload_session_owner_status ON upload_session (tenant_id, organization_id, owner_type, owner_id, status, id);

CREATE TABLE IF NOT EXISTS upload_part (
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
    upload_session_id BIGINT NOT NULL,
    part_number INTEGER NOT NULL,
    part_etag VARCHAR(256),
    part_sha256 VARCHAR(128),
    size_bytes BIGINT NOT NULL DEFAULT 0,
    presigned_url_expires_at TIMESTAMPTZ,
    uploaded_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_upload_part_session_part ON upload_part (tenant_id, organization_id, upload_session_id, part_number);

CREATE TABLE IF NOT EXISTS upload_presign_grant (
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
    upload_session_id BIGINT NOT NULL,
    upload_part_id BIGINT,
    provider_id BIGINT,
    bucket_id BIGINT,
    method VARCHAR(16) NOT NULL,
    object_key VARCHAR(1024) NOT NULL,
    canonical_headers JSONB,
    signed_headers JSONB,
    expires_at TIMESTAMPTZ NOT NULL,
    consumed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_upload_presign_grant_session ON upload_presign_grant (tenant_id, organization_id, upload_session_id, created_at, id);

CREATE TABLE IF NOT EXISTS upload_completion_attempt (
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
    upload_session_id BIGINT NOT NULL,
    object_blob_id BIGINT,
    attempt_no INTEGER NOT NULL,
    completion_status VARCHAR(64) NOT NULL,
    provider_request_id VARCHAR(256),
    error_code VARCHAR(128),
    error_message_masked VARCHAR(1024)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_upload_completion_attempt_no ON upload_completion_attempt (tenant_id, organization_id, upload_session_id, attempt_no);

CREATE TABLE IF NOT EXISTS ai_model_mapping_rule (
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
    source_vendor_id BIGINT,
    source_vendor_code VARCHAR(64) NOT NULL DEFAULT '',
    target_vendor_id BIGINT,
    target_vendor_code VARCHAR(64) NOT NULL DEFAULT '',
    mapping_mode VARCHAR(32) NOT NULL DEFAULT 'alias',
    match_type VARCHAR(32) NOT NULL DEFAULT 'exact',
    enabled BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_mapping_rule_uuid ON ai_model_mapping_rule (uuid);
CREATE INDEX IF NOT EXISTS idx_ai_model_mapping_rule_source_vendor ON ai_model_mapping_rule (tenant_id, organization_id, status, enabled, source_vendor_code, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_mapping_rule_target_vendor ON ai_model_mapping_rule (tenant_id, organization_id, status, enabled, target_vendor_code, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_mapping_rule_enabled ON ai_model_mapping_rule (tenant_id, organization_id, status, enabled, id);

CREATE TABLE IF NOT EXISTS ai_model_mapping_rule_item (
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
    rule_id BIGINT NOT NULL DEFAULT 0,
    rule_uuid VARCHAR(128),
    source_model VARCHAR(256) NOT NULL DEFAULT '',
    source_catalog_key VARCHAR(256),
    target_model VARCHAR(256) NOT NULL DEFAULT '',
    target_catalog_key VARCHAR(256),
    target_provider_model VARCHAR(256),
    target_provider_native_model VARCHAR(256),
    sort_order INTEGER NOT NULL DEFAULT 100,
    enabled BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_mapping_rule_item_uuid ON ai_model_mapping_rule_item (uuid);
CREATE INDEX IF NOT EXISTS idx_ai_model_mapping_rule_item_rule_lookup ON ai_model_mapping_rule_item (tenant_id, organization_id, rule_id, status, enabled, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_mapping_rule_item_source_lookup ON ai_model_mapping_rule_item (tenant_id, organization_id, source_model, status, enabled, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_mapping_rule_item_target_lookup ON ai_model_mapping_rule_item (tenant_id, organization_id, target_catalog_key, target_model, status, id);

CREATE TABLE IF NOT EXISTS ai_model_mapping_rule_binding (
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
    rule_id BIGINT NOT NULL DEFAULT 0,
    rule_uuid VARCHAR(128),
    binding_type VARCHAR(32) NOT NULL DEFAULT 'global',
    binding_id BIGINT,
    binding_code VARCHAR(128),
    binding_name_snapshot VARCHAR(256),
    sort_order INTEGER NOT NULL DEFAULT 100,
    enabled BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_mapping_rule_binding_uuid ON ai_model_mapping_rule_binding (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_mapping_rule_binding_target ON ai_model_mapping_rule_binding (tenant_id, organization_id, rule_id, binding_type, binding_id, binding_code);
CREATE INDEX IF NOT EXISTS idx_ai_model_mapping_rule_binding_rule_lookup ON ai_model_mapping_rule_binding (tenant_id, organization_id, rule_id, status, enabled, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_mapping_rule_binding_target_lookup ON ai_model_mapping_rule_binding (tenant_id, organization_id, binding_type, binding_id, binding_code, status, enabled, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_mapping_rule_binding_channel_group_lookup ON ai_model_mapping_rule_binding (tenant_id, organization_id, binding_type, binding_code, status, enabled, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_mapping_rule_binding_vendor_lookup ON ai_model_mapping_rule_binding (tenant_id, organization_id, binding_type, binding_code, status, enabled, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_mapping_rule_binding_global_lookup ON ai_model_mapping_rule_binding (tenant_id, organization_id, binding_type, status, enabled, id);

CREATE TABLE IF NOT EXISTS ai_usage_service_provider_chain (
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
    usage_fact_id BIGINT NOT NULL,
    leaf_provider_id BIGINT,
    root_provider_id BIGINT,
    chain_depth INTEGER,
    chain_path_snapshot JSONB,
    chain_hash VARCHAR(128),
    resolved_subject_type VARCHAR(64),
    resolved_subject_id BIGINT,
    occurred_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_usage_service_provider_chain_usage ON ai_usage_service_provider_chain (tenant_id, organization_id, usage_fact_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_service_provider_chain_leaf_time ON ai_usage_service_provider_chain (tenant_id, organization_id, leaf_provider_id, occurred_at, id);

CREATE TABLE IF NOT EXISTS ai_usage_service_provider_edge (
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
    usage_fact_id BIGINT NOT NULL,
    chain_id BIGINT,
    edge_id BIGINT NOT NULL,
    edge_depth INTEGER,
    seller_provider_id BIGINT,
    buyer_provider_id BIGINT,
    amount_role VARCHAR(64),
    pricing_plan_id BIGINT,
    pricing_rule_id BIGINT,
    billing_meter_code VARCHAR(64),
    token_kind VARCHAR(64),
    billable_quantity NUMERIC(38, 12),
    unit_price NUMERIC(38, 12),
    unit_size NUMERIC(38, 12),
    charge_amount NUMERIC(38, 12),
    currency VARCHAR(10),
    fx_rate_snapshot NUMERIC(38, 12),
    settlement_currency VARCHAR(10),
    converted_charge_amount NUMERIC(38, 12),
    seller_snapshot JSONB,
    buyer_snapshot JSONB,
    price_snapshot JSONB,
    occurred_at TIMESTAMPTZ,
    settlement_status INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_usage_service_provider_edge_usage_depth ON ai_usage_service_provider_edge (tenant_id, organization_id, usage_fact_id, edge_depth, amount_role);
CREATE INDEX IF NOT EXISTS idx_ai_usage_service_provider_edge_seller_time ON ai_usage_service_provider_edge (tenant_id, organization_id, seller_provider_id, occurred_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_service_provider_edge_buyer_time ON ai_usage_service_provider_edge (tenant_id, organization_id, buyer_provider_id, occurred_at, id);

CREATE TABLE IF NOT EXISTS commerce_usage_service_provider_settlement (
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
    settlement_no VARCHAR(128),
    usage_edge_id BIGINT,
    seller_provider_id BIGINT,
    buyer_provider_id BIGINT,
    buyer_account_id VARCHAR(128),
    seller_account_id VARCHAR(128),
    buyer_ledger_entry_id VARCHAR(128),
    seller_ledger_entry_id VARCHAR(128),
    settlement_mode VARCHAR(32),
    direction VARCHAR(16),
    amount NUMERIC(38, 12),
    currency VARCHAR(10),
    settlement_status INTEGER,
    settled_at TIMESTAMPTZ,
    failure_code VARCHAR(128),
    failure_message VARCHAR(512)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_usage_service_provider_settlement_edge ON commerce_usage_service_provider_settlement (tenant_id, organization_id, usage_edge_id, direction);
CREATE INDEX IF NOT EXISTS idx_commerce_usage_service_provider_settlement_status ON commerce_usage_service_provider_settlement (tenant_id, organization_id, settlement_status, created_at, id);

CREATE TABLE IF NOT EXISTS commerce_usage_service_provider_statement (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    source_type VARCHAR(128),
    source_id BIGINT,
    source_version BIGINT,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rebuild_version BIGINT NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    statement_no VARCHAR(128),
    seller_provider_id BIGINT,
    buyer_provider_id BIGINT,
    period VARCHAR(32),
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    total_requests BIGINT,
    total_tokens BIGINT,
    receivable_amount NUMERIC(38, 12),
    payable_amount NUMERIC(38, 12),
    currency VARCHAR(10),
    statement_status INTEGER,
    payment_status INTEGER,
    invoice_id BIGINT,
    generated_at TIMESTAMPTZ,
    due_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_usage_service_provider_statement_edge_period ON commerce_usage_service_provider_statement (tenant_id, organization_id, seller_provider_id, buyer_provider_id, period);
CREATE INDEX IF NOT EXISTS idx_commerce_usage_service_provider_statement_status ON commerce_usage_service_provider_statement (tenant_id, organization_id, statement_status, period_end, id);

CREATE TABLE IF NOT EXISTS commerce_usage_service_provider_statement_item (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    source_type VARCHAR(128),
    source_id BIGINT,
    source_version BIGINT,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rebuild_version BIGINT NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    statement_id BIGINT,
    usage_edge_id BIGINT,
    billing_meter_code VARCHAR(64),
    token_kind VARCHAR(64),
    model VARCHAR(128),
    request_count BIGINT,
    token_count BIGINT,
    quantity NUMERIC(38, 12),
    amount NUMERIC(38, 12),
    currency VARCHAR(10),
    source_usage_fact_ids JSONB
);

CREATE INDEX IF NOT EXISTS idx_commerce_usage_service_provider_statement_item_statement ON commerce_usage_service_provider_statement_item (tenant_id, organization_id, statement_id, billing_meter_code, token_kind);

CREATE TABLE IF NOT EXISTS commerce_usage_service_provider_adjustment (
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
    adjustment_no VARCHAR(128),
    usage_edge_id BIGINT,
    statement_id BIGINT,
    seller_provider_id BIGINT,
    buyer_provider_id BIGINT,
    adjustment_type VARCHAR(64),
    amount NUMERIC(38, 12),
    currency VARCHAR(10),
    reason_code VARCHAR(128),
    reason_message VARCHAR(512),
    approval_status VARCHAR(32),
    approved_by BIGINT,
    settled_ledger_entry_id VARCHAR(128)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_usage_service_provider_adjustment_no ON commerce_usage_service_provider_adjustment (tenant_id, organization_id, adjustment_no);
CREATE INDEX IF NOT EXISTS idx_commerce_usage_service_provider_adjustment_edge ON commerce_usage_service_provider_adjustment (tenant_id, organization_id, usage_edge_id, status, id);

CREATE TABLE IF NOT EXISTS integration_provider_invoice_import (
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
    import_no VARCHAR(128),
    provider_code VARCHAR(64),
    provider_account_id BIGINT,
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    currency VARCHAR(10),
    total_amount NUMERIC(38, 12),
    source_file_ref VARCHAR(512),
    source_hash VARCHAR(128),
    import_status INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_integration_provider_invoice_import_no ON integration_provider_invoice_import (tenant_id, organization_id, import_no);
CREATE INDEX IF NOT EXISTS idx_integration_provider_invoice_import_provider_period ON integration_provider_invoice_import (tenant_id, organization_id, provider_code, period_start, period_end, id);

CREATE TABLE IF NOT EXISTS integration_provider_invoice_item (
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
    import_id BIGINT,
    provider_request_id VARCHAR(256),
    provider_usage_id VARCHAR(256),
    model VARCHAR(128),
    billing_meter_code VARCHAR(64),
    quantity NUMERIC(38, 12),
    amount NUMERIC(38, 12),
    currency VARCHAR(10),
    raw_payload_hash VARCHAR(128),
    match_status INTEGER
);

CREATE INDEX IF NOT EXISTS idx_integration_provider_invoice_item_import ON integration_provider_invoice_item (tenant_id, organization_id, import_id, match_status, id);
CREATE INDEX IF NOT EXISTS idx_integration_provider_invoice_item_request ON integration_provider_invoice_item (tenant_id, organization_id, provider_request_id, id);

CREATE TABLE IF NOT EXISTS commerce_usage_service_provider_reconciliation_run (
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
    run_no VARCHAR(128),
    scope_type VARCHAR(64),
    scope_id VARCHAR(128),
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    matched_count BIGINT,
    mismatch_count BIGINT,
    missing_internal_count BIGINT,
    missing_external_count BIGINT,
    total_internal_amount NUMERIC(38, 12),
    total_external_amount NUMERIC(38, 12),
    difference_amount NUMERIC(38, 12)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_usage_service_provider_reconciliation_run_no ON commerce_usage_service_provider_reconciliation_run (tenant_id, organization_id, run_no);
CREATE INDEX IF NOT EXISTS idx_commerce_usage_service_provider_reconciliation_run_period ON commerce_usage_service_provider_reconciliation_run (tenant_id, organization_id, scope_type, period_start, period_end, id);

CREATE TABLE IF NOT EXISTS commerce_usage_service_provider_reconciliation_item (
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
    run_id BIGINT,
    usage_edge_id BIGINT,
    usage_fact_id BIGINT,
    provider_invoice_item_id BIGINT,
    statement_item_id BIGINT,
    match_status VARCHAR(64),
    internal_amount NUMERIC(38, 12),
    external_amount NUMERIC(38, 12),
    difference_amount NUMERIC(38, 12),
    reason_code VARCHAR(128),
    resolution_status VARCHAR(64)
);

CREATE INDEX IF NOT EXISTS idx_commerce_usage_service_provider_reconciliation_item_run ON commerce_usage_service_provider_reconciliation_item (tenant_id, organization_id, run_id, match_status, id);

CREATE TABLE IF NOT EXISTS commerce_service_provider_exposure_snapshot (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    source_type VARCHAR(128),
    source_id BIGINT,
    source_version BIGINT,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rebuild_version BIGINT NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    service_provider_id BIGINT,
    balance_amount NUMERIC(38, 12),
    frozen_amount NUMERIC(38, 12),
    credit_limit_amount NUMERIC(38, 12),
    used_credit_amount NUMERIC(38, 12),
    exposure_amount NUMERIC(38, 12),
    pending_settlement_amount NUMERIC(38, 12),
    overdue_amount NUMERIC(38, 12),
    currency VARCHAR(10),
    risk_status VARCHAR(64),
    calculated_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_service_provider_exposure_snapshot_provider ON commerce_service_provider_exposure_snapshot (tenant_id, organization_id, service_provider_id, currency);

CREATE TABLE IF NOT EXISTS analytics_service_provider_daily (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    source_type VARCHAR(128),
    source_id BIGINT,
    source_version BIGINT,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rebuild_version BIGINT NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    provider_id BIGINT,
    ancestor_provider_id BIGINT,
    report_date DATE,
    currency VARCHAR(10),
    request_count BIGINT,
    success_count BIGINT,
    failure_count BIGINT,
    token_count BIGINT,
    income_amount NUMERIC(38, 12),
    expense_amount NUMERIC(38, 12),
    margin_amount NUMERIC(38, 12),
    upstream_cost_amount NUMERIC(38, 12)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_analytics_service_provider_daily ON analytics_service_provider_daily (tenant_id, organization_id, provider_id, ancestor_provider_id, report_date, currency);

CREATE TABLE IF NOT EXISTS analytics_service_provider_edge_daily (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    source_type VARCHAR(128),
    source_id BIGINT,
    source_version BIGINT,
    status INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rebuild_version BIGINT NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    edge_id BIGINT,
    seller_provider_id BIGINT,
    buyer_provider_id BIGINT,
    report_date DATE,
    model VARCHAR(128),
    catalog_key VARCHAR(256),
    billing_meter_code VARCHAR(64),
    token_kind VARCHAR(64),
    currency VARCHAR(10),
    request_count BIGINT,
    token_count BIGINT,
    income_amount NUMERIC(38, 12),
    expense_amount NUMERIC(38, 12),
    margin_amount NUMERIC(38, 12)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_analytics_service_provider_edge_daily ON analytics_service_provider_edge_daily (tenant_id, organization_id, edge_id, report_date, model, billing_meter_code, token_kind, currency);
