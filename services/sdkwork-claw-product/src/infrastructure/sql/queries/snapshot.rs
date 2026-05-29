use super::PricingCatalogSql;

impl PricingCatalogSql {
    pub fn snapshot_load_queries() -> Vec<&'static str> {
        vec![
            Self::load_vendors(),
            Self::load_models(),
            Self::load_provider_routes(),
            Self::load_provider_channel_routes(),
            Self::load_routing_policies(),
            Self::load_routing_rules(),
            Self::load_pricing_plans(),
            Self::load_api_key_groups(),
            Self::load_api_keys(),
            Self::load_access_policies(),
            Self::load_quota_policies(),
            Self::load_api_key_group_metric_snapshots(),
            Self::load_prices(),
        ]
    }

    pub fn load_vendors() -> &'static str {
        r#"
SELECT
    vendor_code,
    display_name
FROM ai_model_vendor
WHERE deleted_at IS NULL
  AND status = 1
ORDER BY sort_order ASC, display_name ASC, id ASC
"#
    }

    pub fn load_models() -> &'static str {
        r#"
SELECT
    catalog_key,
    model,
    display_name,
    vendor_code,
    'global' AS region_code,
    COALESCE((
        SELECT jsonb_agg(DISTINCT capability_code ORDER BY capability_code)::text
        FROM (
            SELECT CASE m.capability
                WHEN 1 THEN CASE
                    WHEN COALESCE(m.modalities, '[]'::jsonb) ? 'embedding' THEN 'embedding'
                    WHEN COALESCE(m.input_modalities, '[]'::jsonb) ? 'embedding' THEN 'embedding'
                    WHEN COALESCE(m.output_modalities, '[]'::jsonb) ? 'embedding' THEN 'embedding'
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
            UNION ALL
            SELECT 'responses'
            WHERE COALESCE(m.api_format, '') = 'openai_responses'
              AND COALESCE(m.capability, 1) = 1
            UNION ALL
            SELECT 'tools' WHERE COALESCE(m.supports_tools, false)
            UNION ALL
            SELECT 'json_schema' WHERE COALESCE(m.supports_json_schema, false)
            UNION ALL
            SELECT capability_code
            FROM ai_model_capability c
            WHERE c.model_id = m.id
              AND c.deleted_at IS NULL
              AND c.status = 1
              AND capability_code IS NOT NULL
        ) capabilities
    ), '[]') AS capabilities_json,
    description,
    COALESCE(modalities::text, '[]') AS modalities_json,
    COALESCE(input_modalities::text, '[]') AS input_modalities_json,
    COALESCE(output_modalities::text, '[]') AS output_modalities_json,
    api_format,
    capability_intro,
    COALESCE(limitations::text, '[]') AS limitations_json,
    COALESCE(supported_languages::text, '[]') AS supported_languages_json,
    COALESCE(use_cases::text, '[]') AS use_cases_json,
    training_data_cutoff,
    context_tokens,
    max_output_tokens,
    COALESCE(supports_streaming, false) AS supports_streaming,
    COALESCE(supports_tools, false) AS supports_tools,
    COALESCE(supports_json_schema, false) AS supports_json_schema,
    release_stage,
    shelf_state,
    routing_state,
    replacement_model
FROM ai_model m
WHERE deleted_at IS NULL
  AND status = 1
  AND COALESCE(shelf_state, 1) <> 3
  AND COALESCE(routing_state, 1) = 1
ORDER BY rank_score DESC, display_name ASC, id ASC
"#
    }

    pub fn load_provider_routes() -> &'static str {
        r#"
SELECT
    rc.catalog_key AS catalog_key,
    COALESCE(NULLIF(cm.model, ''), NULLIF(rc.model_code, ''), rc.catalog_key) AS model,
    COALESCE(NULLIF(e.region_code, ''), NULLIF(rc.region_code, ''), NULLIF(c.region_code, ''), 'global') AS region_code,
    COALESCE(NULLIF(rc.provider_code, ''), c.provider_code) AS provider_code,
    rc.channel_id,
    COALESCE(NULLIF(cm.provider_native_model, ''), NULLIF(cm.provider_model, ''), NULLIF(rc.model_code, ''), NULLIF(cm.model, ''), rc.catalog_key) AS provider_model,
    COALESCE(NULLIF(e.base_url, ''), NULLIF(c.base_url, ''), p.base_url) AS base_url,
    c.credential_ref AS secret_ref,
    c.auth_type::text AS auth_type,
    c.auth_config::text AS auth_config_json,
    COALESCE(e.timeout_ms, c.timeout_ms) AS timeout_ms,
    COALESCE(e.retry_policy, c.retry_policy)::text AS retry_policy_json
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
 AND (e.effective_from IS NULL OR e.effective_from <= CURRENT_TIMESTAMP)
 AND (e.effective_to IS NULL OR e.effective_to > CURRENT_TIMESTAMP)
 AND (
     COALESCE(e.health_status, 1) = 1
     OR COALESCE(e.updated_at, CURRENT_TIMESTAMP) + ($1 * INTERVAL '1 second') <= CURRENT_TIMESTAMP
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
      OR COALESCE(rc.updated_at, CURRENT_TIMESTAMP) + ($1 * INTERVAL '1 second') <= CURRENT_TIMESTAMP
  )
  AND (
      COALESCE(c.health_status, 1) = 1
      OR COALESCE(c.updated_at, CURRENT_TIMESTAMP) + ($1 * INTERVAL '1 second') <= CURRENT_TIMESTAMP
  )
  AND (p.id IS NULL OR p.status = 1)
  AND COALESCE(NULLIF(e.base_url, ''), NULLIF(c.base_url, ''), p.base_url) IS NOT NULL
  AND NULLIF(COALESCE(NULLIF(e.base_url, ''), NULLIF(c.base_url, ''), p.base_url), '') IS NOT NULL
  AND NULLIF(c.credential_ref, '') IS NOT NULL
  AND (cm.effective_from IS NULL OR cm.effective_from <= CURRENT_TIMESTAMP)
  AND (cm.effective_to IS NULL OR cm.effective_to > CURRENT_TIMESTAMP)
ORDER BY COALESCE(rc.priority, c.priority, 100) ASC, COALESCE(rc.weight, c.weight, 100) DESC, rc.id ASC
"#
    }

    pub fn load_provider_channel_routes() -> &'static str {
        r#"
SELECT
    c.provider_code,
    c.id AS channel_id,
    COALESCE(NULLIF(e.region_code, ''), NULLIF(c.region_code, ''), 'global') AS region_code,
    COALESCE(NULLIF(e.base_url, ''), NULLIF(c.base_url, ''), p.base_url) AS base_url,
    c.credential_ref AS secret_ref,
    c.auth_type::text AS auth_type,
    c.auth_config::text AS auth_config_json,
    COALESCE(e.timeout_ms, c.timeout_ms) AS timeout_ms,
    COALESCE(e.retry_policy, c.retry_policy)::text AS retry_policy_json,
    COALESCE((
        SELECT jsonb_agg(
            jsonb_build_object(
                'groupId', b.channel_group_id,
                'priority', COALESCE(b.priority, 100),
                'weight', COALESCE(b.weight, 100),
                'modelScope', CASE
                    WHEN NULLIF(b.catalog_key, '') IS NULL THEN '[]'::jsonb
                    ELSE jsonb_build_array(b.catalog_key)
                END,
                'capabilities', CASE
                    WHEN NULLIF(b.api_code, '') IS NULL OR b.api_code = '*' THEN '[]'::jsonb
                    WHEN b.api_code IN ('chat_completions', 'openai.chat_completions', 'responses', 'openai.responses', 'completions', 'openai.completions') THEN jsonb_build_array('llm', 'chat', b.api_code)
                    WHEN b.api_code IN ('embeddings', 'embedding', 'openai.embeddings') THEN jsonb_build_array('llm', 'embedding', b.api_code)
                    WHEN b.api_code LIKE 'image%' OR b.api_code LIKE 'openai.image%' OR b.api_code = 'openai.images' THEN jsonb_build_array('image', b.api_code)
                    WHEN b.api_code LIKE 'audio%' OR b.api_code LIKE 'openai.audio%' THEN jsonb_build_array('audio', b.api_code)
                    ELSE jsonb_build_array(b.api_code)
                END
            )
            ORDER BY COALESCE(b.priority, 100) ASC, COALESCE(b.weight, 100) DESC, b.channel_group_id ASC, b.id ASC
        )
        FROM ai_route_candidate b
        WHERE b.status = 1
          AND b.tenant_id = c.tenant_id
          AND b.organization_id = c.organization_id
          AND b.channel_id = c.id
          AND b.channel_group_id IS NOT NULL
          AND (
              COALESCE(b.health_status, 1) = 1
              OR COALESCE(b.updated_at, CURRENT_TIMESTAMP) + ($1 * INTERVAL '1 second') <= CURRENT_TIMESTAMP
          )
    ), '[]'::jsonb)::text AS group_bindings_json
FROM ai_channel c
LEFT JOIN ai_provider p
  ON p.provider_code = c.provider_code
 AND p.tenant_id = c.tenant_id
 AND p.organization_id = c.organization_id
LEFT JOIN LATERAL (
    SELECT endpoint.base_url, endpoint.region_code, endpoint.priority, endpoint.weight
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
      AND (endpoint.effective_from IS NULL OR endpoint.effective_from <= CURRENT_TIMESTAMP)
      AND (endpoint.effective_to IS NULL OR endpoint.effective_to > CURRENT_TIMESTAMP)
      AND (
          COALESCE(endpoint.health_status, 1) = 1
          OR COALESCE(endpoint.updated_at, CURRENT_TIMESTAMP) + ($1 * INTERVAL '1 second') <= CURRENT_TIMESTAMP
      )
    ORDER BY
      CASE WHEN endpoint.region_code = 'global' THEN 1 ELSE 0 END ASC,
      endpoint.priority ASC,
      endpoint.weight DESC,
      endpoint.id ASC
    LIMIT 1
) e ON true
WHERE c.deleted_at IS NULL
  AND (p.id IS NULL OR p.deleted_at IS NULL)
  AND c.status = 1
  AND (
      COALESCE(c.health_status, 1) = 1
      OR COALESCE(c.updated_at, CURRENT_TIMESTAMP) + ($1 * INTERVAL '1 second') <= CURRENT_TIMESTAMP
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
"#
    }

    pub fn load_routing_policies() -> &'static str {
        r#"
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
"#
    }

    pub fn load_routing_rules() -> &'static str {
        r#"
SELECT
    r.id,
    COALESCE(r.tenant_id, 0) AS tenant_id,
    COALESCE(r.organization_id, 0) AS organization_id,
    r.profile_id,
    r.rule_code,
    r.priority,
    COALESCE(r.match_expression::text, '{}') AS match_expression_json,
    r.target_model,
    COALESCE(r.candidate_channels::text, '[]') AS candidate_channels_json,
    COALESCE(r.fallback_chain::text, '[]') AS fallback_chain_json,
    COALESCE(r.constraints::text, '{}') AS constraints_json
FROM ai_routing_rule r
JOIN ai_routing_profile pr ON pr.id = r.profile_id
WHERE r.deleted_at IS NULL
  AND pr.deleted_at IS NULL
  AND r.status = 1
  AND pr.status = 1
  AND (r.effective_from IS NULL OR r.effective_from <= CURRENT_TIMESTAMP)
  AND (r.effective_to IS NULL OR r.effective_to > CURRENT_TIMESTAMP)
ORDER BY r.profile_id ASC, r.priority ASC, r.id ASC
"#
    }

    pub fn load_pricing_plans() -> &'static str {
        r#"
SELECT
    plan_code,
    CASE base_price_side
        WHEN 1 THEN 'official_reference'
        WHEN 2 THEN 'upstream_cost'
        WHEN 3 THEN 'customer_charge'
        WHEN 4 THEN 'internal_transfer'
        ELSE 'unknown'
    END AS base_price_side_code,
    default_multiplier::text AS default_multiplier,
    default_markup_amount::text AS default_markup_amount,
    currency
FROM ai_pricing_plan
WHERE deleted_at IS NULL
  AND status = 1
  AND (effective_from IS NULL OR effective_from <= CURRENT_TIMESTAMP)
  AND (effective_to IS NULL OR effective_to > CURRENT_TIMESTAMP)
ORDER BY priority ASC, effective_from DESC, id DESC
"#
    }

    pub fn load_api_key_groups() -> &'static str {
        r#"
SELECT
    id,
    COALESCE(tenant_id, 0) AS tenant_id,
    COALESCE(organization_id, 0) AS organization_id,
    COALESCE(NULLIF(group_name, ''), group_code) AS name,
    group_code AS code,
    COALESCE(NULLIF(BTRIM(pricing_plan_code), ''), 'standard') AS pricing_plan_code,
    rate_multiplier::text AS rate_multiplier,
    official_price_multiplier::text AS official_price_multiplier
FROM ai_channel_group
WHERE deleted_at IS NULL
  AND status = 1
ORDER BY updated_at DESC, id DESC
"#
    }

    pub fn load_api_keys() -> &'static str {
        r#"
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
    metadata ->> 'copyableKeyCiphertext' AS copyable_key,
    policy_id,
    quota_policy_id,
    created_at::text AS created_at,
    expire_at::text AS expire_at,
    status AS status_code,
    COALESCE((metadata #>> '{runtime,defaultForRuntime}')::boolean, false) AS default_for_runtime
FROM iam_gateway_api_key
WHERE deleted_at IS NULL
  AND status = 1
  AND revoked_at IS NULL
  AND (expire_at IS NULL OR expire_at > CURRENT_TIMESTAMP)
ORDER BY updated_at DESC, id DESC
"#
    }

    pub fn load_access_policies() -> &'static str {
        r#"
SELECT
    id,
    COALESCE(allowed_capabilities::text, '[]') AS allowed_capabilities_json,
    COALESCE(ip_allowlist::text, '[]') AS ip_allowlist_json
FROM iam_gateway_access_policy
WHERE deleted_at IS NULL
  AND status = 1
  AND (effective_from IS NULL OR effective_from <= CURRENT_TIMESTAMP)
  AND (effective_to IS NULL OR effective_to > CURRENT_TIMESTAMP)
ORDER BY updated_at DESC, id DESC
"#
    }

    pub fn load_quota_policies() -> &'static str {
        r#"
SELECT
    id,
    quota_limit::text AS quota_limit
FROM ai_quota_policy
WHERE deleted_at IS NULL
  AND status = 1
  AND (effective_from IS NULL OR effective_from <= CURRENT_TIMESTAMP)
  AND (effective_to IS NULL OR effective_to > CURRENT_TIMESTAMP)
ORDER BY updated_at DESC, id DESC
"#
    }

    pub fn load_api_key_group_metric_snapshots() -> &'static str {
        r#"
SELECT
    COALESCE(channel_group_id, 0) AS group_id,
    capacity_used::text AS capacity_used,
    capacity_limit::text AS capacity_limit,
    usage_amount_total::text AS usage_amount_total,
    snapshot_at::text AS snapshot_at
FROM ai_channel_group_metric_snapshot
WHERE status = 1
ORDER BY channel_group_id ASC, snapshot_at DESC, id DESC
"#
    }

    pub fn load_prices() -> &'static str {
        r#"
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
    unit_price::text AS unit_price,
    currency,
    provider_code,
    channel_id,
    pricing_plan_code
FROM ai_model_pricing
WHERE deleted_at IS NULL
  AND status = 1
  AND (effective_from IS NULL OR effective_from <= CURRENT_TIMESTAMP)
  AND (effective_to IS NULL OR effective_to > CURRENT_TIMESTAMP)
ORDER BY priority ASC, effective_from DESC, id DESC
"#
    }
}
