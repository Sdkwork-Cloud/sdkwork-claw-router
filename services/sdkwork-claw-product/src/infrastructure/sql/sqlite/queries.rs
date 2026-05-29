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
    rc.catalog_key AS catalog_key,
    COALESCE(NULLIF(cm.model, ''), NULLIF(rc.model_code, ''), rc.catalog_key) AS model,
    COALESCE(NULLIF(e.region_code, ''), NULLIF(rc.region_code, ''), NULLIF(c.region_code, ''), 'global') AS region_code,
    COALESCE(NULLIF(rc.provider_code, ''), c.provider_code) AS provider_code,
    rc.channel_id,
    COALESCE(NULLIF(cm.provider_native_model, ''), NULLIF(cm.provider_model, ''), NULLIF(rc.model_code, ''), NULLIF(cm.model, ''), rc.catalog_key) AS provider_model,
    COALESCE(NULLIF(e.base_url, ''), NULLIF(c.base_url, ''), p.base_url) AS base_url,
    c.credential_ref AS secret_ref,
    CAST(c.auth_type AS TEXT) AS auth_type,
    CAST(c.auth_config AS TEXT) AS auth_config_json,
    COALESCE(e.timeout_ms, c.timeout_ms) AS timeout_ms,
    COALESCE(e.retry_policy, c.retry_policy) AS retry_policy_json
FROM ai_route_candidate rc
JOIN ai_channel c ON c.id = rc.channel_id
JOIN ai_channel_model cm
  ON cm.channel_id = rc.channel_id
 AND cm.tenant_id = rc.tenant_id
 AND cm.organization_id = rc.organization_id
 AND cm.catalog_key = rc.catalog_key
 AND (
     NULLIF(cm.api_code, '') IS NULL
     OR NULLIF(rc.api_code, '') IS NULL
     OR rc.api_code = '*'
     OR cm.api_code = rc.api_code
 )
LEFT JOIN ai_provider p
  ON p.provider_code = c.provider_code
 AND p.tenant_id = c.tenant_id
 AND p.organization_id = c.organization_id
LEFT JOIN ai_channel_endpoint e
  ON e.id = rc.endpoint_id
 AND e.channel_id = rc.channel_id
 AND e.tenant_id = rc.tenant_id
 AND e.organization_id = rc.organization_id
 AND e.deleted_at IS NULL
 AND e.status = 1
 AND (e.effective_from IS NULL OR datetime(e.effective_from) <= CURRENT_TIMESTAMP)
 AND (e.effective_to IS NULL OR datetime(e.effective_to) > CURRENT_TIMESTAMP)
 AND (
     COALESCE(e.health_status, 1) = 1
     OR datetime(
         COALESCE(e.updated_at, CURRENT_TIMESTAMP),
         '+' || CAST(? AS TEXT) || ' seconds'
     ) <= CURRENT_TIMESTAMP
 )
WHERE rc.status = 1
  AND NULLIF(rc.catalog_key, '') IS NOT NULL
  AND c.deleted_at IS NULL
  AND cm.deleted_at IS NULL
  AND (p.id IS NULL OR p.deleted_at IS NULL)
  AND c.status = 1
  AND cm.status = 1
  AND (
      COALESCE(rc.health_status, 1) = 1
      OR datetime(
          COALESCE(rc.updated_at, CURRENT_TIMESTAMP),
          '+' || CAST(? AS TEXT) || ' seconds'
      ) <= CURRENT_TIMESTAMP
  )
  AND (
      COALESCE(c.health_status, 1) = 1
      OR datetime(
          COALESCE(c.updated_at, CURRENT_TIMESTAMP),
          '+' || CAST(? AS TEXT) || ' seconds'
      ) <= CURRENT_TIMESTAMP
  )
  AND (p.id IS NULL OR p.status = 1)
  AND COALESCE(NULLIF(e.base_url, ''), NULLIF(c.base_url, ''), p.base_url) IS NOT NULL
  AND NULLIF(COALESCE(NULLIF(e.base_url, ''), NULLIF(c.base_url, ''), p.base_url), '') IS NOT NULL
  AND NULLIF(c.credential_ref, '') IS NOT NULL
  AND (cm.effective_from IS NULL OR datetime(cm.effective_from) <= CURRENT_TIMESTAMP)
  AND (cm.effective_to IS NULL OR datetime(cm.effective_to) > CURRENT_TIMESTAMP)
ORDER BY COALESCE(rc.priority, c.priority, 100) ASC, COALESCE(rc.weight, c.weight, 100) DESC, rc.id ASC
"#;

pub const LOAD_PROVIDER_CHANNEL_ROUTES: &str = r#"
SELECT
    c.provider_code,
    c.id AS channel_id,
    COALESCE(NULLIF(e.region_code, ''), NULLIF(c.region_code, ''), 'global') AS region_code,
    COALESCE(NULLIF(e.base_url, ''), NULLIF(c.base_url, ''), p.base_url) AS base_url,
    c.credential_ref AS secret_ref,
    CAST(c.auth_type AS TEXT) AS auth_type,
    CAST(c.auth_config AS TEXT) AS auth_config_json,
    COALESCE(e.timeout_ms, c.timeout_ms) AS timeout_ms,
    COALESCE(e.retry_policy, c.retry_policy) AS retry_policy_json,
    COALESCE((
        SELECT json_group_array(
            json_object(
                'groupId', binding.channel_group_id,
                'priority', binding.priority,
                'weight', binding.weight,
                'modelScope', json(binding.model_scope),
                'capabilities', json(binding.capabilities)
            )
        )
        FROM (
            SELECT
                b.channel_group_id AS channel_group_id,
                COALESCE(b.priority, 100) AS priority,
                COALESCE(b.weight, 100) AS weight,
                CASE
                    WHEN NULLIF(b.catalog_key, '') IS NULL THEN '[]'
                    ELSE json_array(b.catalog_key)
                END AS model_scope,
                CASE
                    WHEN NULLIF(b.api_code, '') IS NULL OR b.api_code = '*' THEN '[]'
                    WHEN b.api_code IN ('chat_completions', 'openai.chat_completions', 'responses', 'openai.responses', 'completions', 'openai.completions') THEN json_array('llm', 'chat', b.api_code)
                    WHEN b.api_code IN ('embeddings', 'embedding', 'openai.embeddings') THEN json_array('llm', 'embedding', b.api_code)
                    WHEN b.api_code LIKE 'image%' OR b.api_code LIKE 'openai.image%' OR b.api_code = 'openai.images' THEN json_array('image', b.api_code)
                    WHEN b.api_code LIKE 'audio%' OR b.api_code LIKE 'openai.audio%' THEN json_array('audio', b.api_code)
                    ELSE json_array(b.api_code)
                END AS capabilities
            FROM ai_route_candidate b
            WHERE b.status = 1
              AND b.tenant_id = c.tenant_id
              AND b.organization_id = c.organization_id
              AND b.channel_id = c.id
              AND b.channel_group_id IS NOT NULL
              AND (
                  COALESCE(b.health_status, 1) = 1
                  OR datetime(
                      COALESCE(b.updated_at, CURRENT_TIMESTAMP),
                      '+' || CAST(? AS TEXT) || ' seconds'
                  ) <= CURRENT_TIMESTAMP
              )
            ORDER BY COALESCE(b.priority, 100) ASC, COALESCE(b.weight, 100) DESC, b.channel_group_id ASC, b.id ASC
        ) binding
    ), '[]') AS group_bindings_json
FROM ai_channel c
LEFT JOIN ai_provider p
  ON p.provider_code = c.provider_code
 AND p.tenant_id = c.tenant_id
 AND p.organization_id = c.organization_id
LEFT JOIN ai_channel_endpoint e
  ON e.id = (
      SELECT endpoint.id
      FROM ai_channel_endpoint endpoint
      WHERE endpoint.deleted_at IS NULL
        AND endpoint.status = 1
        AND endpoint.tenant_id = c.tenant_id
        AND endpoint.organization_id = c.organization_id
        AND endpoint.channel_id = c.id
        AND endpoint.vendor_code = COALESCE(NULLIF(p.default_vendor_code, ''), c.provider_code)
        AND endpoint.api_code IN ('*', 'chat_completions', 'openai.chat_completions', 'responses', 'openai.responses')
        AND endpoint.region_code IN (COALESCE(NULLIF(c.region_code, ''), 'global'), 'global')
        AND NULLIF(endpoint.base_url, '') IS NOT NULL
        AND (endpoint.effective_from IS NULL OR datetime(endpoint.effective_from) <= CURRENT_TIMESTAMP)
        AND (endpoint.effective_to IS NULL OR datetime(endpoint.effective_to) > CURRENT_TIMESTAMP)
        AND (
            COALESCE(endpoint.health_status, 1) = 1
            OR datetime(
                COALESCE(endpoint.updated_at, CURRENT_TIMESTAMP),
                '+' || CAST(? AS TEXT) || ' seconds'
            ) <= CURRENT_TIMESTAMP
        )
      ORDER BY
        CASE WHEN endpoint.region_code = 'global' THEN 1 ELSE 0 END ASC,
        endpoint.priority ASC,
        endpoint.weight DESC,
        endpoint.id ASC
      LIMIT 1
  )
WHERE c.deleted_at IS NULL
  AND (p.id IS NULL OR p.deleted_at IS NULL)
  AND c.status = 1
  AND (
      COALESCE(c.health_status, 1) = 1
      OR datetime(
          COALESCE(c.updated_at, CURRENT_TIMESTAMP),
          '+' || CAST(? AS TEXT) || ' seconds'
      ) <= CURRENT_TIMESTAMP
  )
  AND (p.id IS NULL OR p.status = 1)
  AND EXISTS (
      SELECT 1
      FROM ai_route_candidate rc
      WHERE rc.status = 1
        AND rc.tenant_id = c.tenant_id
        AND rc.organization_id = c.organization_id
        AND rc.channel_id = c.id
  )
  AND COALESCE(NULLIF(e.base_url, ''), NULLIF(c.base_url, ''), p.base_url) IS NOT NULL
  AND NULLIF(COALESCE(NULLIF(e.base_url, ''), NULLIF(c.base_url, ''), p.base_url), '') IS NOT NULL
  AND NULLIF(c.credential_ref, '') IS NOT NULL
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
    COALESCE(NULLIF(group_name, ''), group_code) AS name,
    group_code AS code,
    COALESCE(NULLIF(TRIM(pricing_plan_code), ''), 'standard') AS pricing_plan_code,
    CAST(rate_multiplier AS TEXT) AS rate_multiplier,
    CAST(official_price_multiplier AS TEXT) AS official_price_multiplier
FROM ai_channel_group
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
    COALESCE(channel_group_id, 0) AS group_id,
    COALESCE(name, '') AS name,
    COALESCE(key_prefix, '') AS key_prefix,
    COALESCE(NULLIF(key_display_masked, ''), COALESCE(key_prefix, '') || '********') AS key_display_masked,
    COALESCE(key_hash, '') AS key_hash,
    json_extract(COALESCE(metadata, '{}'), '$.copyableKeyCiphertext') AS copyable_key,
    policy_id,
    quota_policy_id,
    CAST(created_at AS TEXT) AS created_at,
    CAST(expire_at AS TEXT) AS expire_at,
    status AS status_code,
    COALESCE(json_extract(COALESCE(metadata, '{}'), '$.runtime.defaultForRuntime'), false) AS default_for_runtime
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
    COALESCE(channel_group_id, 0) AS group_id,
    CAST(capacity_used AS TEXT) AS capacity_used,
    CAST(capacity_limit AS TEXT) AS capacity_limit,
    CAST(usage_amount_total AS TEXT) AS usage_amount_total,
    CAST(snapshot_at AS TEXT) AS snapshot_at
FROM ai_channel_group_metric_snapshot
WHERE status = 1
ORDER BY channel_group_id ASC, snapshot_at DESC, id DESC
"#;

pub const LOAD_PRICES: &str = r#"
SELECT
    catalog_key,
    model,
    COALESCE(NULLIF(region_code, ''), 'global') AS region_code,
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
