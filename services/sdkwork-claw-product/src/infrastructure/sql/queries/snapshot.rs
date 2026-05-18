use super::PricingCatalogSql;

impl PricingCatalogSql {
    pub fn snapshot_load_queries() -> Vec<&'static str> {
        vec![
            Self::load_vendors(),
            Self::load_models(),
            Self::load_provider_routes(),
            Self::load_provider_account_pool_routes(),
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
    region_code,
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
    m.catalog_key AS catalog_key,
    m.model AS model,
    c.provider_code,
    m.channel_id,
    m.provider_model,
    COALESCE(NULLIF(c.base_url_override, ''), p.base_url_template) AS base_url,
    a.secret_ref,
    a.auth_type::text AS auth_type,
    a.auth_config::text AS auth_config_json,
    c.timeout_ms,
    c.retry_policy::text AS retry_policy_json
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
      OR COALESCE(c.updated_at, CURRENT_TIMESTAMP) + ($1 * INTERVAL '1 second') <= CURRENT_TIMESTAMP
  )
  AND p.status = 1
  AND a.status = 1
  AND COALESCE(NULLIF(c.base_url_override, ''), p.base_url_template) IS NOT NULL
  AND NULLIF(COALESCE(NULLIF(c.base_url_override, ''), p.base_url_template), '') IS NOT NULL
  AND NULLIF(a.secret_ref, '') IS NOT NULL
  AND (m.effective_from IS NULL OR m.effective_from <= CURRENT_TIMESTAMP)
  AND (m.effective_to IS NULL OR m.effective_to > CURRENT_TIMESTAMP)
ORDER BY c.priority ASC, c.weight DESC, m.id ASC
"#
    }

    pub fn load_provider_account_pool_routes() -> &'static str {
        r#"
SELECT
    c.provider_code,
    c.id AS channel_id,
    COALESCE(NULLIF(c.base_url_override, ''), p.base_url_template) AS base_url,
    a.secret_ref,
    a.auth_type::text AS auth_type,
    a.auth_config::text AS auth_config_json,
    c.timeout_ms,
    c.retry_policy::text AS retry_policy_json
FROM integration_channel c
JOIN integration_provider p ON p.provider_code = c.provider_code
JOIN integration_provider_account a ON a.id = c.account_id
WHERE c.deleted_at IS NULL
  AND p.deleted_at IS NULL
  AND a.deleted_at IS NULL
  AND c.status = 1
  AND (
      COALESCE(c.health_status, 1) = 1
      OR COALESCE(c.updated_at, CURRENT_TIMESTAMP) + ($1 * INTERVAL '1 second') <= CURRENT_TIMESTAMP
  )
  AND p.status = 1
  AND a.status = 1
  AND COALESCE(NULLIF(c.base_url_override, ''), p.base_url_template) IS NOT NULL
  AND NULLIF(COALESCE(NULLIF(c.base_url_override, ''), p.base_url_template), '') IS NOT NULL
  AND NULLIF(a.secret_ref, '') IS NOT NULL
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
    COALESCE(NULLIF(name, ''), code) AS name,
    code,
    pricing_plan_code,
    rate_multiplier::text AS rate_multiplier,
    official_price_multiplier::text AS official_price_multiplier
FROM iam_gateway_api_key_group
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
    COALESCE(group_id, 0) AS group_id,
    COALESCE(name, '') AS name,
    COALESCE(key_prefix, '') AS key_prefix,
    COALESCE(NULLIF(key_display_masked, ''), COALESCE(key_prefix, '') || '********') AS key_display_masked,
    COALESCE(key_hash, '') AS key_hash,
    metadata ->> 'copyableKeyCiphertext' AS copyable_key,
    policy_id,
    quota_policy_id,
    created_at::text AS created_at,
    expire_at::text AS expire_at,
    status AS status_code
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
    COALESCE(group_id, 0) AS group_id,
    capacity_used::text AS capacity_used,
    capacity_limit::text AS capacity_limit,
    usage_amount_total::text AS usage_amount_total,
    snapshot_at::text AS snapshot_at
FROM iam_gateway_api_key_group_metric_snapshot
WHERE status = 1
ORDER BY group_id ASC, snapshot_at DESC, id DESC
"#
    }

    pub fn load_prices() -> &'static str {
        r#"
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
