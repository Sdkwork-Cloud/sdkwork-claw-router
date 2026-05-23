pub const LOAD_VENDORS: &str = r#"
SELECT
    vendor_code,
    display_name
FROM ai_model_vendor
WHERE deleted_at IS NULL
  AND status = 1
ORDER BY sort_order ASC, display_name ASC, id ASC
"#;

pub const LOAD_MODELS: &str = r#"
WITH model_base AS (
    SELECT
        m.*
    FROM ai_model m
    WHERE m.deleted_at IS NULL
      AND m.status = 1
      AND COALESCE(m.shelf_state, 1) <> 3
      AND COALESCE(m.routing_state, 1) = 1
)
SELECT
    catalog_key,
    model,
    display_name,
    vendor_code,
    region_code,
    description,
    COALESCE(modalities, '[]') AS modalities_json,
    COALESCE(input_modalities, '[]') AS input_modalities_json,
    COALESCE(output_modalities, '[]') AS output_modalities_json,
    api_format,
    capability_intro,
    COALESCE(limitations, '[]') AS limitations_json,
    COALESCE(supported_languages, '[]') AS supported_languages_json,
    COALESCE(use_cases, '[]') AS use_cases_json,
    training_data_cutoff,
    context_tokens,
    max_output_tokens,
    COALESCE(supports_streaming, 0) AS supports_streaming,
    COALESCE(supports_tools, 0) AS supports_tools,
    COALESCE(supports_json_schema, 0) AS supports_json_schema,
    release_stage,
    shelf_state,
    routing_state,
    replacement_model,
    COALESCE(
        json_group_array(DISTINCT capability_code),
        '[]'
    ) AS capabilities_json
FROM (
    SELECT
        m.id,
        m.model,
        m.catalog_key,
        m.display_name,
        m.vendor_code,
        'global' AS region_code,
        m.description,
        m.modalities,
        m.input_modalities,
        m.output_modalities,
        m.api_format,
        m.capability_intro,
        m.limitations,
        m.supported_languages,
        m.use_cases,
        m.training_data_cutoff,
        m.context_tokens,
        m.max_output_tokens,
        m.supports_streaming,
        m.supports_tools,
        m.supports_json_schema,
        m.release_stage,
        m.shelf_state,
        m.routing_state,
        m.replacement_model,
        m.rank_score,
        CASE m.capability
            WHEN 1 THEN CASE
                WHEN COALESCE(m.modalities, '[]') LIKE '%"embedding"%' THEN 'embedding'
                WHEN COALESCE(m.input_modalities, '[]') LIKE '%"embedding"%' THEN 'embedding'
                WHEN COALESCE(m.output_modalities, '[]') LIKE '%"embedding"%' THEN 'embedding'
                ELSE 'chat'
            END
            WHEN 2 THEN 'image'
            WHEN 3 THEN 'audio'
            WHEN 4 THEN 'music'
            WHEN 5 THEN 'video'
            WHEN 6 THEN 'embedding'
            WHEN 7 THEN 'rerank'
            ELSE 'chat'
        END AS capability_code
    FROM model_base m
    UNION ALL
    SELECT m.id, m.model, m.catalog_key, m.display_name, m.vendor_code, 'global' AS region_code, m.description, m.modalities, m.input_modalities, m.output_modalities, m.api_format, m.capability_intro, m.limitations, m.supported_languages, m.use_cases, m.training_data_cutoff, m.context_tokens, m.max_output_tokens, m.supports_streaming, m.supports_tools, m.supports_json_schema, m.release_stage, m.shelf_state, m.routing_state, m.replacement_model, m.rank_score, 'responses'
    FROM model_base m
    WHERE COALESCE(m.api_format, '') = 'openai_responses'
      AND COALESCE(m.capability, 1) = 1
    UNION ALL
    SELECT m.id, m.model, m.catalog_key, m.display_name, m.vendor_code, 'global' AS region_code, m.description, m.modalities, m.input_modalities, m.output_modalities, m.api_format, m.capability_intro, m.limitations, m.supported_languages, m.use_cases, m.training_data_cutoff, m.context_tokens, m.max_output_tokens, m.supports_streaming, m.supports_tools, m.supports_json_schema, m.release_stage, m.shelf_state, m.routing_state, m.replacement_model, m.rank_score, 'tools'
    FROM model_base m
    WHERE COALESCE(m.supports_tools, 0) = 1
    UNION ALL
    SELECT m.id, m.model, m.catalog_key, m.display_name, m.vendor_code, 'global' AS region_code, m.description, m.modalities, m.input_modalities, m.output_modalities, m.api_format, m.capability_intro, m.limitations, m.supported_languages, m.use_cases, m.training_data_cutoff, m.context_tokens, m.max_output_tokens, m.supports_streaming, m.supports_tools, m.supports_json_schema, m.release_stage, m.shelf_state, m.routing_state, m.replacement_model, m.rank_score, 'json_schema'
    FROM model_base m
    WHERE COALESCE(m.supports_json_schema, 0) = 1
    UNION ALL
    SELECT m.id, m.model, m.catalog_key, m.display_name, m.vendor_code, 'global' AS region_code, m.description, m.modalities, m.input_modalities, m.output_modalities, m.api_format, m.capability_intro, m.limitations, m.supported_languages, m.use_cases, m.training_data_cutoff, m.context_tokens, m.max_output_tokens, m.supports_streaming, m.supports_tools, m.supports_json_schema, m.release_stage, m.shelf_state, m.routing_state, m.replacement_model, m.rank_score, c.capability_code
    FROM model_base m
    JOIN ai_model_capability c ON c.model_id = m.id
    WHERE c.deleted_at IS NULL
      AND c.status = 1
      AND c.capability_code IS NOT NULL
) m
GROUP BY id, catalog_key, model, display_name, vendor_code, region_code, description, modalities, input_modalities, output_modalities, api_format, capability_intro, limitations, supported_languages, use_cases, training_data_cutoff, context_tokens, max_output_tokens, supports_streaming, supports_tools, supports_json_schema, release_stage, shelf_state, routing_state, replacement_model, rank_score
ORDER BY CAST(COALESCE(rank_score, '0') AS REAL) DESC, display_name ASC, id ASC
"#;

pub const LOAD_PROVIDER_ROUTES: &str = r#"
SELECT
    m.catalog_key AS catalog_key,
    m.model AS model,
    c.provider_code,
    m.channel_id,
    m.provider_model,
    COALESCE(NULLIF(c.base_url, ''), p.base_url) AS base_url,
    a.secret_ref,
    CAST(a.auth_type AS TEXT) AS auth_type,
    CAST(a.auth_config AS TEXT) AS auth_config_json,
    c.timeout_ms,
    c.retry_policy AS retry_policy_json
FROM integration_channel_model m
JOIN integration_channel c ON c.id = m.channel_id
JOIN integration_provider p ON p.provider_code = c.provider_code
JOIN integration_provider_account a ON a.id = c.account_id
WHERE m.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND p.deleted_at IS NULL
  AND a.deleted_at IS NULL
  AND m.status = 1
  AND c.status = 1
  AND (
      COALESCE(c.health_status, 1) = 1
      OR datetime(
          COALESCE(c.updated_at, CURRENT_TIMESTAMP),
          '+' || CAST(? AS TEXT) || ' seconds'
      ) <= CURRENT_TIMESTAMP
  )
  AND p.status = 1
  AND a.status = 1
  AND COALESCE(NULLIF(c.base_url, ''), p.base_url) IS NOT NULL
  AND NULLIF(COALESCE(NULLIF(c.base_url, ''), p.base_url), '') IS NOT NULL
  AND NULLIF(a.secret_ref, '') IS NOT NULL
  AND (m.effective_from IS NULL OR datetime(m.effective_from) <= CURRENT_TIMESTAMP)
  AND (m.effective_to IS NULL OR datetime(m.effective_to) > CURRENT_TIMESTAMP)
ORDER BY c.priority ASC, c.weight DESC, m.id ASC
"#;

pub const LOAD_PROVIDER_ACCOUNT_POOL_ROUTES: &str = r#"
SELECT
    c.provider_code,
    c.id AS channel_id,
    COALESCE(NULLIF(c.base_url, ''), p.base_url) AS base_url,
    a.secret_ref,
    CAST(a.auth_type AS TEXT) AS auth_type,
    CAST(a.auth_config AS TEXT) AS auth_config_json,
    c.timeout_ms,
    c.retry_policy AS retry_policy_json
FROM integration_channel c
JOIN integration_provider p ON p.provider_code = c.provider_code
JOIN integration_provider_account a ON a.id = c.account_id
WHERE c.deleted_at IS NULL
  AND p.deleted_at IS NULL
  AND a.deleted_at IS NULL
  AND c.status = 1
  AND (
      COALESCE(c.health_status, 1) = 1
      OR datetime(
          COALESCE(c.updated_at, CURRENT_TIMESTAMP),
          '+' || CAST(? AS TEXT) || ' seconds'
      ) <= CURRENT_TIMESTAMP
  )
  AND p.status = 1
  AND a.status = 1
  AND COALESCE(NULLIF(c.base_url, ''), p.base_url) IS NOT NULL
  AND NULLIF(COALESCE(NULLIF(c.base_url, ''), p.base_url), '') IS NOT NULL
  AND NULLIF(a.secret_ref, '') IS NOT NULL
ORDER BY c.priority ASC, c.weight DESC, c.id ASC
"#;

pub const LOAD_ROUTING_POLICIES: &str = r#"
SELECT
    p.id,
    COALESCE(p.tenant_id, 0) AS tenant_id,
    COALESCE(p.organization_id, 0) AS organization_id,
    p.policy_code,
    p.policy_scope,
    p.subject_id,
    p.capability,
    p.default_profile_id,
    p.fallback_mode
FROM ai_routing_policy p
JOIN ai_routing_profile pr ON pr.id = p.default_profile_id
WHERE p.deleted_at IS NULL
  AND pr.deleted_at IS NULL
  AND p.status = 1
  AND pr.status = 1
ORDER BY p.policy_scope DESC, p.updated_at DESC, p.id DESC
"#;

pub const LOAD_ROUTING_RULES: &str = r#"
SELECT
    r.id,
    COALESCE(r.tenant_id, 0) AS tenant_id,
    COALESCE(r.organization_id, 0) AS organization_id,
    r.profile_id,
    r.rule_code,
    r.priority,
    COALESCE(r.match_expression, '{}') AS match_expression_json,
    r.target_model,
    COALESCE(r.candidate_channels, '[]') AS candidate_channels_json,
    COALESCE(r.fallback_chain, '[]') AS fallback_chain_json,
    COALESCE(r.constraints, '{}') AS constraints_json
FROM ai_routing_rule r
JOIN ai_routing_profile pr ON pr.id = r.profile_id
WHERE r.deleted_at IS NULL
  AND pr.deleted_at IS NULL
  AND r.status = 1
  AND pr.status = 1
  AND (r.effective_from IS NULL OR datetime(r.effective_from) <= CURRENT_TIMESTAMP)
  AND (r.effective_to IS NULL OR datetime(r.effective_to) > CURRENT_TIMESTAMP)
ORDER BY r.profile_id ASC, r.priority ASC, r.id ASC
"#;

pub const LOAD_PRICING_PLANS: &str = r#"
SELECT
    plan_code,
    CASE base_price_side
        WHEN 1 THEN 'official_reference'
        WHEN 2 THEN 'upstream_cost'
        WHEN 3 THEN 'customer_charge'
        WHEN 4 THEN 'internal_transfer'
        ELSE 'unknown'
    END AS base_price_side_code,
    CAST(default_multiplier AS TEXT) AS default_multiplier,
    CAST(default_markup_amount AS TEXT) AS default_markup_amount,
    currency
FROM ai_pricing_plan
WHERE deleted_at IS NULL
  AND status = 1
  AND (effective_from IS NULL OR datetime(effective_from) <= CURRENT_TIMESTAMP)
  AND (effective_to IS NULL OR datetime(effective_to) > CURRENT_TIMESTAMP)
ORDER BY priority ASC, datetime(effective_from) DESC, id DESC
"#;

pub const LOAD_API_KEY_GROUPS: &str = r#"
SELECT
    id,
    COALESCE(tenant_id, 0) AS tenant_id,
    COALESCE(organization_id, 0) AS organization_id,
    COALESCE(NULLIF(name, ''), code) AS name,
    code,
    pricing_plan_code,
    CAST(rate_multiplier AS TEXT) AS rate_multiplier,
    CAST(official_price_multiplier AS TEXT) AS official_price_multiplier
FROM iam_gateway_api_key_group
WHERE deleted_at IS NULL
  AND status = 1
ORDER BY updated_at DESC, id DESC
"#;

pub const LOAD_API_KEYS: &str = r#"
SELECT
    id,
    COALESCE(tenant_id, 0) AS tenant_id,
    COALESCE(organization_id, 0) AS organization_id,
    COALESCE(user_id, 0) AS user_id,
    COALESCE(group_id, 0) AS group_id,
    COALESCE(name, '') AS name,
    COALESCE(key_prefix, '') AS key_prefix,
    COALESCE(NULLIF(key_display_masked, ''), COALESCE(key_prefix, '') || '********') AS key_display_masked,
    COALESCE(key_hash, '') AS key_hash,
    json_extract(COALESCE(metadata, '{}'), '$.copyableKeyCiphertext') AS copyable_key,
    policy_id,
    quota_policy_id,
    CAST(created_at AS TEXT) AS created_at,
    CAST(expire_at AS TEXT) AS expire_at,
    status AS status_code
FROM iam_gateway_api_key
WHERE deleted_at IS NULL
  AND status = 1
  AND revoked_at IS NULL
  AND (expire_at IS NULL OR datetime(expire_at) > CURRENT_TIMESTAMP)
ORDER BY updated_at DESC, id DESC
"#;

pub const LOAD_ACCESS_POLICIES: &str = r#"
SELECT
    id,
    COALESCE(allowed_capabilities, '[]') AS allowed_capabilities_json,
    COALESCE(ip_allowlist, '[]') AS ip_allowlist_json
FROM iam_gateway_access_policy
WHERE deleted_at IS NULL
  AND status = 1
  AND (effective_from IS NULL OR datetime(effective_from) <= CURRENT_TIMESTAMP)
  AND (effective_to IS NULL OR datetime(effective_to) > CURRENT_TIMESTAMP)
ORDER BY updated_at DESC, id DESC
"#;

pub const LOAD_QUOTA_POLICIES: &str = r#"
SELECT
    id,
    CAST(quota_limit AS TEXT) AS quota_limit
FROM ai_quota_policy
WHERE deleted_at IS NULL
  AND status = 1
  AND (effective_from IS NULL OR datetime(effective_from) <= CURRENT_TIMESTAMP)
  AND (effective_to IS NULL OR datetime(effective_to) > CURRENT_TIMESTAMP)
ORDER BY updated_at DESC, id DESC
"#;

pub const LOAD_API_KEY_GROUP_METRIC_SNAPSHOTS: &str = r#"
SELECT
    COALESCE(group_id, 0) AS group_id,
    CAST(capacity_used AS TEXT) AS capacity_used,
    CAST(capacity_limit AS TEXT) AS capacity_limit,
    CAST(usage_amount_total AS TEXT) AS usage_amount_total,
    CAST(snapshot_at AS TEXT) AS snapshot_at
FROM iam_gateway_api_key_group_metric_snapshot
WHERE status = 1
ORDER BY group_id ASC, snapshot_at DESC, id DESC
"#;

pub const LOAD_PRICES: &str = r#"
SELECT
    catalog_key,
    model,
    CASE price_side
        WHEN 1 THEN 'official_reference'
        WHEN 2 THEN 'upstream_cost'
        WHEN 3 THEN 'customer_charge'
        WHEN 4 THEN 'internal_transfer'
        ELSE 'unknown'
    END AS price_side_code,
    billing_meter_code,
    CAST(unit_price AS TEXT) AS unit_price,
    currency,
    provider_code,
    channel_id,
    pricing_plan_code
FROM ai_model_pricing
WHERE deleted_at IS NULL
  AND status = 1
  AND (effective_from IS NULL OR datetime(effective_from) <= CURRENT_TIMESTAMP)
  AND (effective_to IS NULL OR datetime(effective_to) > CURRENT_TIMESTAMP)
ORDER BY priority ASC, datetime(effective_from) DESC, id DESC
"#;
