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
    icon_url VARCHAR(512),
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
    download_url VARCHAR(512)
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
    icon VARCHAR(255),
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
    icon VARCHAR(255),
    cover_image VARCHAR(255),
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
    icon VARCHAR(255),
    cover_image VARCHAR(255),
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
    cover_images JSONB,
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

CREATE TABLE IF NOT EXISTS ops_coupon_issue_batch (
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
    coupon_id BIGINT,
    coupon_template_id BIGINT,
    batch_no VARCHAR(64),
    campaign_code VARCHAR(64),
    name VARCHAR(128),
    code_prefix VARCHAR(32),
    code_pattern VARCHAR(128),
    requested_count BIGINT,
    generated_count BIGINT,
    available_count BIGINT,
    claimed_count BIGINT,
    used_count BIGINT,
    voided_count BIGINT,
    generation_status INTEGER,
    audience_filter JSONB,
    expire_at TIMESTAMPTZ,
    generated_at TIMESTAMPTZ,
    created_by BIGINT
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ops_coupon_issue_batch_no ON ops_coupon_issue_batch (tenant_id, organization_id, batch_no);
CREATE INDEX IF NOT EXISTS idx_ops_coupon_issue_batch_coupon ON ops_coupon_issue_batch (tenant_id, organization_id, coupon_id, status, created_at, id);
CREATE INDEX IF NOT EXISTS idx_ops_coupon_issue_batch_campaign ON ops_coupon_issue_batch (tenant_id, organization_id, campaign_code, created_at, id);

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
    group_id BIGINT,
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
CREATE INDEX IF NOT EXISTS idx_iam_gateway_api_key_group_status ON iam_gateway_api_key (tenant_id, organization_id, group_id, status, updated_at, id);

CREATE TABLE IF NOT EXISTS iam_gateway_api_key_group (
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
    code VARCHAR(64),
    description VARCHAR(512),
    provider_code VARCHAR(64),
    group_type INTEGER,
    default_policy_id BIGINT,
    default_quota_policy_id BIGINT,
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

CREATE UNIQUE INDEX IF NOT EXISTS uk_iam_gateway_api_key_group_tenant_code ON iam_gateway_api_key_group (tenant_id, organization_id, code);
CREATE INDEX IF NOT EXISTS idx_iam_gateway_api_key_group_provider_status ON iam_gateway_api_key_group (tenant_id, organization_id, provider_code, status, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_iam_gateway_api_key_group_tenant_status_updated ON iam_gateway_api_key_group (tenant_id, organization_id, status, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_iam_gateway_api_key_group_pricing ON iam_gateway_api_key_group (tenant_id, organization_id, pricing_plan_id, status, updated_at, id);

CREATE TABLE IF NOT EXISTS iam_gateway_api_key_group_metric_snapshot (
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
    group_id BIGINT,
    group_code VARCHAR(64),
    provider_code VARCHAR(64),
    account_available_count BIGINT,
    account_total_count BIGINT,
    capacity_used NUMERIC(38, 12),
    capacity_limit NUMERIC(38, 12),
    request_count_today BIGINT,
    request_count_total BIGINT,
    usage_amount_today NUMERIC(38, 12),
    usage_amount_total NUMERIC(38, 12),
    health_status INTEGER,
    snapshot_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_iam_gateway_api_key_group_metric_snapshot ON iam_gateway_api_key_group_metric_snapshot (tenant_id, organization_id, group_id, snapshot_at);
CREATE INDEX IF NOT EXISTS idx_iam_gateway_api_key_group_metric_status ON iam_gateway_api_key_group_metric_snapshot (tenant_id, organization_id, provider_code, health_status, snapshot_at, id);

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

CREATE TABLE IF NOT EXISTS integration_provider (
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
    provider_code VARCHAR(64),
    display_name VARCHAR(128),
    description VARCHAR(512),
    icon_url VARCHAR(512),
    color_token VARCHAR(64),
    docs_url VARCHAR(512),
    website_url VARCHAR(512),
    default_vendor_code VARCHAR(64),
    integration_type INTEGER,
    upstream_vendor_code VARCHAR(64),
    upstream_provider_code VARCHAR(64),
    protocol INTEGER,
    base_url_template VARCHAR(512),
    auth_type INTEGER,
    capabilities JSONB,
    metadata_schema_version VARCHAR(32),
    sort_order INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_integration_provider_code ON integration_provider (provider_code);
CREATE INDEX IF NOT EXISTS idx_integration_provider_status_updated ON integration_provider (status, updated_at, id);

CREATE TABLE IF NOT EXISTS integration_channel (
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
    channel_code VARCHAR(64),
    name VARCHAR(128),
    protocol INTEGER,
    access_type INTEGER,
    base_url_override VARCHAR(512),
    model_mode INTEGER,
    environment INTEGER,
    region VARCHAR(64),
    capabilities JSONB,
    priority INTEGER,
    weight INTEGER,
    account_id BIGINT,
    proxy_id BIGINT,
    rpm_limit BIGINT,
    timeout_ms INTEGER,
    retry_policy JSONB,
    circuit_breaker_policy JSONB,
    health_status INTEGER,
    last_latency_ms INTEGER,
    consecutive_error_count BIGINT
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_integration_channel_tenant_code ON integration_channel (tenant_id, organization_id, channel_code);
CREATE INDEX IF NOT EXISTS idx_integration_channel_tenant_provider_status ON integration_channel (tenant_id, organization_id, provider_code, status);

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
    provider_code VARCHAR(64),
    account_code VARCHAR(64),
    account_name VARCHAR(128),
    auth_type INTEGER,
    credential_profile INTEGER,
    external_account_id VARCHAR(128),
    auth_config JSONB,
    secret_ref VARCHAR(256),
    secret_hash VARCHAR(128),
    secret_version BIGINT,
    secret_rotation_policy JSONB,
    masked_label VARCHAR(128),
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
    consecutive_error_count BIGINT,
    risk_level INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_integration_provider_account_tenant_code ON integration_provider_account (tenant_id, organization_id, provider_code, account_code);
CREATE UNIQUE INDEX IF NOT EXISTS uk_integration_provider_account_secret_hash ON integration_provider_account (tenant_id, organization_id, provider_code, secret_hash);

CREATE TABLE IF NOT EXISTS integration_channel_model (
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
    model VARCHAR(128),
    vendor_code VARCHAR(64),
    provider_model VARCHAR(128),
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

CREATE UNIQUE INDEX IF NOT EXISTS uk_integration_channel_model_active ON integration_channel_model (tenant_id, organization_id, channel_id, catalog_key, provider_model, capability, effective_from);
CREATE INDEX IF NOT EXISTS idx_integration_channel_model_model_status ON integration_channel_model (tenant_id, organization_id, catalog_key, status, effective_from, id);
CREATE INDEX IF NOT EXISTS idx_integration_channel_model_model_id_status ON integration_channel_model (tenant_id, organization_id, model, status, effective_from, id);
CREATE INDEX IF NOT EXISTS idx_integration_channel_model_vendor_status ON integration_channel_model (tenant_id, organization_id, vendor_code, status, effective_from, id);

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
    logo_url VARCHAR(512),
    icon_url VARCHAR(512),
    color_token VARCHAR(64),
    country_region VARCHAR(64),
    vendor_type INTEGER,
    model_families JSONB,
    capabilities JSONB,
    open_source BOOLEAN,
    sort_order INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_vendor_uuid ON ai_model_vendor (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_vendor_tenant_code ON ai_model_vendor (tenant_id, organization_id, vendor_code);
CREATE INDEX IF NOT EXISTS idx_ai_model_vendor_tenant_status_sort ON ai_model_vendor (tenant_id, organization_id, status, sort_order, id);

CREATE TABLE IF NOT EXISTS ai_model_vendor_region (
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
    region_code VARCHAR(64) NOT NULL,
    display_name VARCHAR(128) NOT NULL,
    legal_name VARCHAR(256),
    description VARCHAR(512),
    website_url VARCHAR(512),
    docs_url VARCHAR(512),
    country_region VARCHAR(64),
    market_scope VARCHAR(64) NOT NULL,
    billing_currency VARCHAR(10) NOT NULL,
    billing_jurisdiction VARCHAR(64) NOT NULL,
    operating_regions JSONB NOT NULL,
    capabilities JSONB,
    open_source BOOLEAN,
    sort_order INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_vendor_region_uuid ON ai_model_vendor_region (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_vendor_region_tenant_code ON ai_model_vendor_region (tenant_id, organization_id, vendor_code, region_code);
CREATE INDEX IF NOT EXISTS idx_ai_model_vendor_region_tenant_status ON ai_model_vendor_region (tenant_id, organization_id, status, vendor_code, region_code, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_vendor_region_vendor_status_sort ON ai_model_vendor_region (tenant_id, organization_id, vendor_code, status, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_vendor_region_market_currency ON ai_model_vendor_region (tenant_id, organization_id, market_scope, billing_currency, status, id);

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
    region_code VARCHAR(64) NOT NULL,
    family_code VARCHAR(64) NOT NULL,
    display_name VARCHAR(128),
    description VARCHAR(512),
    docs_url VARCHAR(512),
    icon_url VARCHAR(512),
    color_token VARCHAR(64),
    family_type INTEGER,
    primary_modality INTEGER,
    model_count BIGINT,
    default_model_id BIGINT,
    default_model VARCHAR(128),
    sort_order INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_family_uuid ON ai_model_family (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_family_tenant_vendor_region_code ON ai_model_family (tenant_id, organization_id, vendor_code, region_code, family_code);
CREATE INDEX IF NOT EXISTS idx_ai_model_family_tenant_status_sort ON ai_model_family (tenant_id, organization_id, status, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_family_vendor_region_status_sort ON ai_model_family (tenant_id, organization_id, vendor_code, region_code, status, sort_order, id);

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
    model VARCHAR(128),
    display_name VARCHAR(128),
    vendor_id BIGINT,
    vendor_code VARCHAR(64) NOT NULL,
    region_code VARCHAR(64) NOT NULL,
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
    icon_url VARCHAR(1024),
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
    replacement_model VARCHAR(128),
    description TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_uuid ON ai_model (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_tenant_catalog_key ON ai_model (tenant_id, organization_id, catalog_key);
CREATE INDEX IF NOT EXISTS idx_ai_model_tenant_status_updated ON ai_model (tenant_id, organization_id, status, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_vendor_region_status ON ai_model (tenant_id, organization_id, vendor_code, region_code, status, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_model_status ON ai_model (tenant_id, organization_id, model, status, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_family_status ON ai_model (tenant_id, organization_id, vendor_code, region_code, family_code, status, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_capability_status ON ai_model (tenant_id, organization_id, capability, status, updated_at, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_public_listing ON ai_model (tenant_id, organization_id, shelf_state, routing_state, release_stage, status, rank_score, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_public_rank_desc ON ai_model (tenant_id, organization_id, status, routing_state, shelf_state, rank_score, id);
CREATE INDEX IF NOT EXISTS idx_ai_model_catalog_search ON ai_model (tenant_id, organization_id, status, vendor_code, region_code, capability, routing_state, shelf_state, display_name, id);

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
    model VARCHAR(128),
    vendor_code VARCHAR(64),
    region_code VARCHAR(64) NOT NULL,
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
CREATE INDEX IF NOT EXISTS idx_ai_model_capability_vendor_region_capability ON ai_model_capability (tenant_id, organization_id, vendor_code, region_code, capability, supported, id);

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
    model VARCHAR(128),
    vendor_code VARCHAR(64),
    region_code VARCHAR(64) NOT NULL,
    provider_code VARCHAR(64),
    channel_id BIGINT,
    provider_model VARCHAR(128),
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
    model VARCHAR(128),
    provider_code VARCHAR(64),
    channel_id BIGINT,
    provider_model VARCHAR(128),
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
    model VARCHAR(128),
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
CREATE UNIQUE INDEX IF NOT EXISTS uk_ai_model_rank_snapshot_scope_catalog_key ON ai_model_rank_snapshot (tenant_id, organization_id, snapshot_date, snapshot_period, rank_scope, catalog_key);
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
    target_model VARCHAR(128),
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
    requested_model VARCHAR(128),
    resolved_model VARCHAR(128),
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
    api_key_group_id BIGINT,
    api_key_group_snapshot VARCHAR(128),
    owner_type INTEGER,
    owner_id BIGINT,
    owner_name_snapshot VARCHAR(128),
    provider_id BIGINT,
    channel_id BIGINT,
    channel_name_snapshot VARCHAR(128),
    provider_account_id BIGINT,
    requested_model VARCHAR(128),
    provider_model VARCHAR(128),
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
    api_key_group_id BIGINT,
    api_key_group_snapshot VARCHAR(128),
    owner_type INTEGER,
    owner_id BIGINT,
    owner_name_snapshot VARCHAR(128),
    catalog_key VARCHAR(256) NOT NULL,
    model VARCHAR(128),
    provider_id BIGINT,
    channel_id BIGINT,
    provider_account_id BIGINT,
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
    group_id BIGINT,
    model VARCHAR(128),
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
CREATE INDEX IF NOT EXISTS idx_ai_quota_policy_model_group ON ai_quota_policy (tenant_id, organization_id, model, group_id, status);

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
    model VARCHAR(128),
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
    asset_url VARCHAR(1024),
    thumbnail_url VARCHAR(1024),
    storage_provider VARCHAR(64),
    storage_key VARCHAR(512),
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
    account_id BIGINT,
    account_history_id BIGINT,
    order_id BIGINT,
    payment_id BIGINT,
    asset_type INTEGER,
    direction INTEGER,
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

CREATE TABLE IF NOT EXISTS commerce_billing_export (
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

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_billing_export_no ON commerce_billing_export (export_no);
CREATE INDEX IF NOT EXISTS idx_commerce_billing_export_tenant_period ON commerce_billing_export (tenant_id, organization_id, period_start, period_end, created_at, id);

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
    asset_url VARCHAR(1024),
    thumbnail_url VARCHAR(1024),
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
    artifact_url VARCHAR(1024),
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
    thumbnail_url VARCHAR(1024),
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
    video_url VARCHAR(1024),
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
    message_code VARCHAR(128),
    message_type INTEGER,
    title VARCHAR(200),
    summary VARCHAR(512),
    content TEXT,
    severity INTEGER,
    target_scope INTEGER,
    target_user_id BIGINT,
    target_owner_type INTEGER,
    target_owner_id BIGINT,
    action_url VARCHAR(512),
    published_at TIMESTAMPTZ,
    expire_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ops_notification_message_target ON ops_notification_message (tenant_id, organization_id, target_scope, target_user_id, published_at, id);

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
    message_id BIGINT,
    delivery_channel INTEGER,
    delivery_status INTEGER,
    read_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    failure_code VARCHAR(128),
    retry_count INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_ops_notification_delivery_user_message ON ops_notification_delivery (message_id, user_id, delivery_channel);
CREATE INDEX IF NOT EXISTS idx_ops_notification_delivery_user_read ON ops_notification_delivery (tenant_id, organization_id, user_id, read_at, created_at, id);

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
