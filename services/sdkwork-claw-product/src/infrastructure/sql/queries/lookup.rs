use super::PricingCatalogSql;

impl PricingCatalogSql {
    pub fn list_models() -> &'static str {
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
  AND ($1 IS NULL OR vendor_code = $1)
ORDER BY rank_score DESC, display_name ASC, id ASC
"#
    }

    pub fn list_provider_routes() -> &'static str {
        r#"
SELECT
    rc.catalog_key AS catalog_key,
    COALESCE(NULLIF(cm.model, ''), NULLIF(rc.model_code, ''), rc.catalog_key) AS model,
    COALESCE(NULLIF(rc.provider_code, ''), c.provider_code) AS provider_code,
    rc.channel_id,
    COALESCE(NULLIF(cm.provider_native_model, ''), NULLIF(cm.provider_model, ''), NULLIF(rc.model_code, ''), NULLIF(cm.model, ''), rc.catalog_key) AS provider_model
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
WHERE rc.status = 1
  AND c.deleted_at IS NULL
  AND cm.deleted_at IS NULL
  AND c.status = 1
  AND cm.status = 1
  AND rc.catalog_key = $1
  AND (cm.effective_from IS NULL OR cm.effective_from <= CURRENT_TIMESTAMP)
  AND (cm.effective_to IS NULL OR cm.effective_to > CURRENT_TIMESTAMP)
ORDER BY COALESCE(rc.priority, c.priority, 100) ASC, COALESCE(rc.weight, c.weight, 100) DESC, rc.id ASC
"#
    }

    pub fn list_model_prices() -> &'static str {
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
  AND catalog_key = $1
  AND price_side = $2
  AND billing_meter_code = $3
  AND (effective_from IS NULL OR effective_from <= CURRENT_TIMESTAMP)
  AND (effective_to IS NULL OR effective_to > CURRENT_TIMESTAMP)
ORDER BY priority ASC, effective_from DESC, id DESC
"#
    }

    pub fn find_api_key() -> &'static str {
        r#"
SELECT
    id,
    COALESCE(channel_group_id, 0) AS group_id,
    COALESCE(name, '') AS name,
    COALESCE(key_prefix, '') AS key_prefix,
    COALESCE(NULLIF(key_display_masked, ''), COALESCE(key_prefix, '') || '********') AS key_display_masked,
    COALESCE(key_hash, '') AS key_hash,
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
  AND id = $1
LIMIT 1
"#
    }

    pub fn find_api_key_group() -> &'static str {
        r#"
SELECT
    id,
    COALESCE(tenant_id, 0) AS tenant_id,
    COALESCE(organization_id, 0) AS organization_id,
    group_code AS code,
    COALESCE(NULLIF(BTRIM(pricing_plan_code), ''), 'standard') AS pricing_plan_code,
    rate_multiplier::text AS rate_multiplier,
    official_price_multiplier::text AS official_price_multiplier
FROM ai_channel_group
WHERE deleted_at IS NULL
  AND status = 1
  AND id = $1
LIMIT 1
"#
    }

    pub fn find_pricing_plan() -> &'static str {
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
  AND plan_code = $1
  AND (effective_from IS NULL OR effective_from <= CURRENT_TIMESTAMP)
  AND (effective_to IS NULL OR effective_to > CURRENT_TIMESTAMP)
ORDER BY priority ASC, effective_from DESC, id DESC
LIMIT 1
"#
    }

    pub fn find_model() -> &'static str {
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
  AND m.catalog_key = $1
LIMIT 1
"#
    }

    pub fn find_vendor() -> &'static str {
        r#"
SELECT
    vendor_code,
    display_name
FROM ai_model_vendor
WHERE deleted_at IS NULL
  AND status = 1
  AND vendor_code = $1
LIMIT 1
"#
    }

    pub fn find_provider_route() -> &'static str {
        r#"
SELECT
    rc.catalog_key AS catalog_key,
    COALESCE(NULLIF(cm.model, ''), NULLIF(rc.model_code, ''), rc.catalog_key) AS model,
    COALESCE(NULLIF(rc.provider_code, ''), c.provider_code) AS provider_code,
    rc.channel_id,
    COALESCE(NULLIF(cm.provider_native_model, ''), NULLIF(cm.provider_model, ''), NULLIF(rc.model_code, ''), NULLIF(cm.model, ''), rc.catalog_key) AS provider_model
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
WHERE rc.status = 1
  AND c.deleted_at IS NULL
  AND cm.deleted_at IS NULL
  AND c.status = 1
  AND cm.status = 1
  AND rc.catalog_key = $1
  AND COALESCE(NULLIF(rc.provider_code, ''), c.provider_code) = $2
  AND (cm.effective_from IS NULL OR cm.effective_from <= CURRENT_TIMESTAMP)
  AND (cm.effective_to IS NULL OR cm.effective_to > CURRENT_TIMESTAMP)
ORDER BY COALESCE(rc.priority, c.priority, 100) ASC, COALESCE(rc.weight, c.weight, 100) DESC, rc.id ASC
LIMIT 1
"#
    }

    pub fn find_model_price() -> &'static str {
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
  AND catalog_key = $1
  AND price_side = $2
  AND billing_meter_code = $3
  AND (($4 IS NULL AND provider_code IS NULL) OR provider_code = $4)
  AND (($5 IS NULL AND pricing_plan_code IS NULL) OR pricing_plan_code = $5)
  AND (effective_from IS NULL OR effective_from <= CURRENT_TIMESTAMP)
  AND (effective_to IS NULL OR effective_to > CURRENT_TIMESTAMP)
ORDER BY priority ASC, effective_from DESC, id DESC
LIMIT 1
"#
    }
}
