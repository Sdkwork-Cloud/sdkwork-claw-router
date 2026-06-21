-- Router-local forum runtime projection until portal forum ownership moves to a sibling content module.

CREATE TABLE IF NOT EXISTS content_reaction (
    id BIGINT NOT NULL PRIMARY KEY,
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

CREATE TABLE IF NOT EXISTS content_forum_post (
    id BIGINT NOT NULL PRIMARY KEY,
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

CREATE INDEX IF NOT EXISTS idx_content_forum_post_status ON content_forum_post (status);
CREATE INDEX IF NOT EXISTS idx_content_forum_post_user_id ON content_forum_post (user_id);
CREATE INDEX IF NOT EXISTS idx_content_forum_post_category_id ON content_forum_post (category_id);
CREATE INDEX IF NOT EXISTS idx_content_forum_post_content_type ON content_forum_post (content_type);
CREATE INDEX IF NOT EXISTS idx_content_forum_post_publish_time ON content_forum_post (publish_time);
CREATE INDEX IF NOT EXISTS idx_content_forum_post_status_publish_time ON content_forum_post (status, publish_time);

CREATE TABLE IF NOT EXISTS content_comment (
    id BIGINT NOT NULL PRIMARY KEY,
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
    parent_id BIGINT,
    root_id BIGINT,
    path VARCHAR(512),
    sort_weight INTEGER NOT NULL DEFAULT 0,
    body TEXT,
    author JSONB,
    likes BIGINT NOT NULL DEFAULT 0,
    reply_count BIGINT NOT NULL DEFAULT 0,
    is_top BOOLEAN NOT NULL DEFAULT FALSE,
    status INTEGER NOT NULL DEFAULT 1,
    ip_address VARCHAR(50),
    client_ip VARCHAR(50),
    device_info VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_content_comment_content ON content_comment (content_type, content_id, parent_id, created_at, id);
CREATE INDEX IF NOT EXISTS idx_content_comment_user ON content_comment (user_id, created_at, id);

CREATE TABLE IF NOT EXISTS content_favorite (
    id BIGINT NOT NULL PRIMARY KEY,
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
    status INTEGER NOT NULL DEFAULT 1,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    source VARCHAR(50),
    client_ip VARCHAR(50),
    device_info VARCHAR(255)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_content_favorite_user_content ON content_favorite (user_id, content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_content_favorite_content ON content_favorite (content_type, content_id);
