use std::collections::BTreeMap;

use sdkwork_models::ModelCatalog;
use sqlx::{PgConnection, PgPool, Postgres, Row, Transaction};

use crate::infrastructure::sql::model_catalog_import::*;

pub async fn import_postgres_model_catalog(
    pool: &PgPool,
    catalog: &ModelCatalog,
) -> Result<(), sqlx::Error> {
    let mut tx = pool.begin().await?;
    import_postgres_model_catalog_tx(&mut tx, catalog).await?;
    tx.commit().await?;
    Ok(())
}

pub async fn import_postgres_model_catalog_tx(
    tx: &mut Transaction<'_, Postgres>,
    catalog: &ModelCatalog,
) -> Result<(), sqlx::Error> {
    import_postgres_model_catalog_connection(&mut **tx, catalog).await
}

async fn import_postgres_model_catalog_connection(
    conn: &mut PgConnection,
    catalog: &ModelCatalog,
) -> Result<(), sqlx::Error> {
    deactivate_removed_catalog_rows(conn, catalog).await?;
    import_meters(conn, catalog).await?;
    let vendor_ids = import_vendors(conn, catalog).await?;
    let family_ids = import_families(conn, catalog, &vendor_ids).await?;
    let model_ids = import_models(conn, catalog, &vendor_ids, &family_ids).await?;
    import_capabilities(conn, catalog, &model_ids).await?;
    import_pricing(conn, catalog, &model_ids).await?;
    import_rankings(conn, catalog, &model_ids).await?;
    update_family_defaults(conn, catalog, &model_ids).await?;
    Ok(())
}

async fn deactivate_removed_catalog_rows(
    conn: &mut PgConnection,
    catalog: &ModelCatalog,
) -> Result<(), sqlx::Error> {
    let keys = catalog_authority_keys(catalog);
    if keys.vendor_codes.is_empty() {
        return Ok(());
    }

    deactivate_postgres_rows_not_in(
        conn,
        "ai_model_rank_snapshot",
        &keys.vendor_codes,
        "uuid",
        &keys.ranking_uuids,
    )
    .await?;
    deactivate_postgres_rows_not_in(
        conn,
        "ai_model_pricing",
        &keys.vendor_codes,
        "uuid",
        &keys.price_uuids,
    )
    .await?;
    deactivate_postgres_rows_not_in(
        conn,
        "ai_model_capability",
        &keys.vendor_codes,
        "uuid",
        &keys.capability_uuids,
    )
    .await?;
    deactivate_postgres_rows_not_in(
        conn,
        "ai_model_family",
        &keys.vendor_codes,
        "uuid",
        &keys.family_uuids,
    )
    .await?;
    deactivate_postgres_rows_not_in(
        conn,
        "ai_model_vendor_region",
        &keys.vendor_codes,
        "uuid",
        &keys.vendor_region_uuids,
    )
    .await?;
    deactivate_postgres_rows_not_in(
        conn,
        "ai_model",
        &keys.vendor_codes,
        "catalog_key",
        &keys.catalog_keys,
    )
    .await?;
    Ok(())
}

async fn deactivate_postgres_rows_not_in(
    conn: &mut PgConnection,
    table_name: &str,
    vendor_codes: &[String],
    key_column: &str,
    active_keys: &[String],
) -> Result<(), sqlx::Error> {
    let sql = format!(
        "UPDATE {table_name} SET status = 0, updated_at = CURRENT_TIMESTAMP WHERE tenant_id = 0 AND organization_id = 0 AND vendor_code = ANY($1) AND status = 1 AND ($2::text[] = '{{}}' OR NOT ({key_column} = ANY($2)))"
    );
    sqlx::query(sql.as_str())
        .bind(vendor_codes)
        .bind(active_keys)
        .execute(&mut *conn)
        .await?;
    Ok(())
}

async fn import_meters(conn: &mut PgConnection, catalog: &ModelCatalog) -> Result<(), sqlx::Error> {
    for meter in &catalog.meters {
        sqlx::query(
            r#"
            INSERT INTO ai_billing_meter
                (uuid, tenant_id, organization_id, data_scope, status, metadata, meter_code, display_name, description, modality, usage_type, billing_mode, default_unit, default_unit_size, quantity_precision, quantity_source, aggregation_mode, supports_tier, supports_expression, allow_negative_quantity, canonical_price_item_type, sort_order)
            VALUES
                ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, 1, 1, 1, $11, $12, 1, 1, false, false, false, 1, $13)
            ON CONFLICT(tenant_id, organization_id, meter_code) DO UPDATE SET
                display_name = excluded.display_name,
                description = excluded.description,
                modality = excluded.modality,
                default_unit_size = excluded.default_unit_size,
                quantity_precision = excluded.quantity_precision,
                sort_order = excluded.sort_order,
                metadata = excluded.metadata,
                deleted_at = NULL,
                deleted_by = NULL,
                status = excluded.status
            "#,
        )
        .bind(stable_uuid("sdk-meter", &[&meter.meter_code]))
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(ACTIVE_STATUS)
        .bind(metadata_json(catalog, "sdkwork_models_meter", serde_json::json!({ "meterCode": meter.meter_code })))
        .bind(&meter.meter_code)
        .bind(&meter.display_name)
        .bind(&meter.description)
        .bind(modality_code(&meter.modality))
        .bind(&meter.default_unit_size)
        .bind(meter.quantity_precision.unwrap_or(0))
        .bind(meter.sort_order.unwrap_or(1000000))
        .execute(&mut *conn)
        .await?;
    }
    Ok(())
}

async fn import_vendors(
    conn: &mut PgConnection,
    catalog: &ModelCatalog,
) -> Result<BTreeMap<String, i64>, sqlx::Error> {
    for vendor in &catalog.vendors {
        let item = &vendor.vendor;
        sqlx::query(
            r#"
            INSERT INTO ai_model_vendor
                (uuid, tenant_id, organization_id, data_scope, status, metadata, vendor_code, display_name, legal_name, description, website_url, docs_url, country_region, vendor_type, model_families, capabilities, open_source, sort_order)
            VALUES
                ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12, $13, $14, $15::jsonb, $16::jsonb, $17, $18)
            ON CONFLICT(tenant_id, organization_id, vendor_code) DO UPDATE SET
                display_name = excluded.display_name,
                legal_name = excluded.legal_name,
                description = excluded.description,
                website_url = excluded.website_url,
                docs_url = excluded.docs_url,
                country_region = excluded.country_region,
                vendor_type = excluded.vendor_type,
                model_families = excluded.model_families,
                capabilities = excluded.capabilities,
                open_source = excluded.open_source,
                sort_order = excluded.sort_order,
                metadata = excluded.metadata,
                deleted_at = NULL,
                deleted_by = NULL,
                status = excluded.status
            "#,
        )
        .bind(stable_uuid("sdk-vendor", &[&item.vendor_code]))
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(ACTIVE_STATUS)
        .bind(metadata_json(catalog, "sdkwork_models_vendor", serde_json::json!({ "sourceUrl": item.source.source_url })))
        .bind(&item.vendor_code)
        .bind(&item.display_name)
        .bind(&item.legal_name)
        .bind(&item.description)
        .bind(&item.website_url)
        .bind(&item.docs_url)
        .bind(&item.country_region)
        .bind(vendor_type_code(&item.vendor_type))
        .bind(json_array(&item.model_families))
        .bind(json_array(&item.capabilities))
        .bind(item.open_source.unwrap_or(false))
        .bind(item.sort_order.unwrap_or(1000000))
        .execute(&mut *conn)
        .await?;
    }
    let vendor_ids = load_vendor_ids(conn).await?;
    import_vendor_regions(conn, catalog, &vendor_ids).await?;
    Ok(vendor_ids)
}

async fn load_vendor_ids(conn: &mut PgConnection) -> Result<BTreeMap<String, i64>, sqlx::Error> {
    let rows = sqlx::query(
        "SELECT id, vendor_code FROM ai_model_vendor WHERE tenant_id = 0 AND organization_id = 0",
    )
    .fetch_all(&mut *conn)
    .await?;
    Ok(rows
        .into_iter()
        .map(|row| (row.get("vendor_code"), row.get("id")))
        .collect())
}

async fn import_vendor_regions(
    conn: &mut PgConnection,
    catalog: &ModelCatalog,
    vendor_ids: &BTreeMap<String, i64>,
) -> Result<(), sqlx::Error> {
    for vendor in &catalog.vendors {
        let item = &vendor.vendor;
        let vendor_id = vendor_ids.get(&item.vendor_code).copied();
        sqlx::query(
            r#"
            INSERT INTO ai_model_vendor_region
                (uuid, tenant_id, organization_id, data_scope, status, metadata, vendor_id, vendor_code, region_code, display_name, legal_name, description, website_url, docs_url, country_region, market_scope, billing_currency, billing_jurisdiction, operating_regions, capabilities, open_source, sort_order)
            VALUES
                ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19::jsonb, $20::jsonb, $21, $22)
            ON CONFLICT(tenant_id, organization_id, vendor_code, region_code) DO UPDATE SET
                vendor_id = excluded.vendor_id,
                display_name = excluded.display_name,
                legal_name = excluded.legal_name,
                description = excluded.description,
                website_url = excluded.website_url,
                docs_url = excluded.docs_url,
                country_region = excluded.country_region,
                market_scope = excluded.market_scope,
                billing_currency = excluded.billing_currency,
                billing_jurisdiction = excluded.billing_jurisdiction,
                operating_regions = excluded.operating_regions,
                capabilities = excluded.capabilities,
                open_source = excluded.open_source,
                sort_order = excluded.sort_order,
                metadata = excluded.metadata,
                deleted_at = NULL,
                deleted_by = NULL,
                status = excluded.status
            "#,
        )
        .bind(stable_uuid(
            "sdk-vendor-region",
            &[&item.vendor_code, &item.region_code],
        ))
        .bind(SYSTEM_TENANT_ID)
        .bind(SYSTEM_ORGANIZATION_ID)
        .bind(SYSTEM_DATA_SCOPE)
        .bind(ACTIVE_STATUS)
        .bind(metadata_json(
            catalog,
            "sdkwork_models_vendor_region",
            serde_json::json!({
                "sourceUrl": item.source.source_url,
                "regionCode": item.region_code,
            }),
        ))
        .bind(vendor_id)
        .bind(&item.vendor_code)
        .bind(&item.region_code)
        .bind(&item.display_name)
        .bind(&item.legal_name)
        .bind(&item.description)
        .bind(&item.website_url)
        .bind(&item.docs_url)
        .bind(&item.country_region)
        .bind(&item.market_scope)
        .bind(&item.billing_currency)
        .bind(&item.billing_jurisdiction)
        .bind(json_array(&item.operating_regions))
        .bind(json_array(&item.capabilities))
        .bind(item.open_source.unwrap_or(false))
        .bind(item.sort_order.unwrap_or(1000000))
        .execute(&mut *conn)
        .await?;
    }
    Ok(())
}

async fn import_families(
    conn: &mut PgConnection,
    catalog: &ModelCatalog,
    vendor_ids: &BTreeMap<String, i64>,
) -> Result<BTreeMap<(String, String, String), i64>, sqlx::Error> {
    for vendor in &catalog.vendors {
        let vendor_id = vendor_ids.get(&vendor.vendor.vendor_code).copied();
        for family in &vendor.families {
            sqlx::query(
                r#"
                INSERT INTO ai_model_family
                    (uuid, tenant_id, organization_id, data_scope, status, metadata, vendor_id, vendor_code, region_code, family_code, display_name, description, family_type, primary_modality, default_model, sort_order)
                VALUES
                    ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
                ON CONFLICT(tenant_id, organization_id, vendor_code, region_code, family_code) DO UPDATE SET
                    vendor_id = excluded.vendor_id,
                    display_name = excluded.display_name,
                    description = excluded.description,
                    family_type = excluded.family_type,
                    primary_modality = excluded.primary_modality,
                    default_model = excluded.default_model,
                    sort_order = excluded.sort_order,
                    metadata = excluded.metadata,
                    deleted_at = NULL,
                    deleted_by = NULL,
                    status = excluded.status
                "#,
            )
            .bind(stable_uuid(
                "sdk-family",
                &[
                    &vendor.vendor.vendor_code,
                    &vendor.vendor.region_code,
                    &family.family_code,
                ],
            ))
            .bind(SYSTEM_TENANT_ID)
            .bind(SYSTEM_ORGANIZATION_ID)
            .bind(SYSTEM_DATA_SCOPE)
            .bind(ACTIVE_STATUS)
            .bind(metadata_json(catalog, "sdkwork_models_family", serde_json::json!({ "familyCode": family.family_code })))
            .bind(vendor_id)
            .bind(&vendor.vendor.vendor_code)
            .bind(&vendor.vendor.region_code)
            .bind(&family.family_code)
            .bind(&family.display_name)
            .bind(&family.description)
            .bind(family_type_code(&family.family_type))
            .bind(modality_code(&family.primary_modality))
            .bind(&family.default_model)
            .bind(family.sort_order.unwrap_or(1000000))
            .execute(&mut *conn)
            .await?;
        }
    }
    load_family_ids(conn).await
}

async fn load_family_ids(
    conn: &mut PgConnection,
) -> Result<BTreeMap<(String, String, String), i64>, sqlx::Error> {
    let rows = sqlx::query("SELECT id, vendor_code, region_code, family_code FROM ai_model_family WHERE tenant_id = 0 AND organization_id = 0")
        .fetch_all(&mut *conn)
        .await?;
    Ok(rows
        .into_iter()
        .map(|row| {
            (
                (
                    row.get("vendor_code"),
                    row.get("region_code"),
                    row.get("family_code"),
                ),
                row.get("id"),
            )
        })
        .collect())
}

async fn import_models(
    conn: &mut PgConnection,
    catalog: &ModelCatalog,
    vendor_ids: &BTreeMap<String, i64>,
    family_ids: &BTreeMap<(String, String, String), i64>,
) -> Result<BTreeMap<String, i64>, sqlx::Error> {
    for vendor in &catalog.vendors {
        for model in &vendor.models {
            let model_catalog_key = model_base_catalog_key(&model.vendor_code, &model.model_id);
            let vendor_id = vendor_ids.get(&model.vendor_code).copied();
            let family_id = family_ids
                .get(&(
                    model.vendor_code.clone(),
                    model.region_code.clone(),
                    model.family_code.clone(),
                ))
                .copied();
            sqlx::query(
                r#"
                INSERT INTO ai_model
                    (uuid, tenant_id, organization_id, data_scope, status, metadata, catalog_key, model, display_name, vendor_id, vendor_code, vendor_name_snapshot, family_id, family_code, provider_hint, model_family, capability, capabilities, modalities, input_modalities, output_modalities, color_token, docs_url, api_format, context_tokens, max_input_tokens, max_output_tokens, supports_streaming, supports_tools, supports_json_schema, performance_profile, rank_score, release_stage, shelf_state, routing_state, replacement_model, description)
                VALUES
                    ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18::jsonb, $19::jsonb, $20::jsonb, $21::jsonb, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32::jsonb, $33, $34, $35, $36, $37)
                ON CONFLICT(tenant_id, organization_id, catalog_key) DO UPDATE SET
                    display_name = excluded.display_name,
                    vendor_id = excluded.vendor_id,
                    vendor_code = excluded.vendor_code,
                    vendor_name_snapshot = excluded.vendor_name_snapshot,
                    family_id = excluded.family_id,
                    family_code = excluded.family_code,
                    model_family = excluded.model_family,
                    capability = excluded.capability,
                    capabilities = excluded.capabilities,
                    modalities = excluded.modalities,
                    input_modalities = excluded.input_modalities,
                    output_modalities = excluded.output_modalities,
                    color_token = excluded.color_token,
                    docs_url = excluded.docs_url,
                    api_format = excluded.api_format,
                    context_tokens = excluded.context_tokens,
                    max_input_tokens = excluded.max_input_tokens,
                    max_output_tokens = excluded.max_output_tokens,
                    supports_streaming = excluded.supports_streaming,
                    supports_tools = excluded.supports_tools,
                    supports_json_schema = excluded.supports_json_schema,
                    performance_profile = excluded.performance_profile,
                    rank_score = excluded.rank_score,
                    release_stage = excluded.release_stage,
                    shelf_state = excluded.shelf_state,
                    routing_state = excluded.routing_state,
                    replacement_model = excluded.replacement_model,
                    description = excluded.description,
                    metadata = excluded.metadata,
                    deleted_at = NULL,
                    deleted_by = NULL,
                    status = excluded.status
                "#,
            )
            .bind(stable_uuid(
                "sdk-model",
                &[&model.vendor_code, &model.model_id],
            ))
            .bind(SYSTEM_TENANT_ID)
            .bind(SYSTEM_ORGANIZATION_ID)
            .bind(SYSTEM_DATA_SCOPE)
            .bind(ACTIVE_STATUS)
            .bind(metadata_json(catalog, "sdkwork_models_model", serde_json::json!({ "sourceUrl": model.source.source_url, "lifecycle": model.lifecycle })))
            .bind(&model_catalog_key)
            .bind(&model.model_id)
            .bind(&model.display_name)
            .bind(vendor_id)
            .bind(&model.vendor_code)
            .bind(model.vendor_name.as_deref().unwrap_or(&vendor.vendor.display_name))
            .bind(family_id)
            .bind(&model.family_code)
            .bind(format!("{}_direct", model.vendor_code))
            .bind(&model.family_code)
            .bind(capability_code(&model.primary_capability))
            .bind(model_capabilities_json(model))
            .bind(model_modalities_json(model))
            .bind(json_array(&model.input_modalities))
            .bind(json_array(&model.output_modalities))
            .bind(&model.color_token)
            .bind(&model.source.source_url)
            .bind(&model.api_format)
            .bind(model.context_tokens)
            .bind(model.max_input_tokens)
            .bind(model.max_output_tokens)
            .bind(model.supports_streaming)
            .bind(model.supports_tools)
            .bind(model.supports_json_schema)
            .bind(serde_json::json!({
                "latencyP50Ms": model.latency_p50_ms,
                "latencyP95Ms": model.latency_p95_ms,
                "winRate": model.win_rate,
                "trendScore": model.trend_score,
                "strengths": model.strengths,
            }).to_string())
            .bind(model.rank_score.as_deref().unwrap_or("0"))
            .bind(release_stage_code(&model.release_stage))
            .bind(shelf_state_code(&model.shelf_state))
            .bind(routing_state_code(&model.routing_state))
            .bind(&model.replacement_model)
            .bind(&model.description)
            .execute(&mut *conn)
            .await?;
        }
    }
    load_model_ids(conn).await
}

async fn load_model_ids(conn: &mut PgConnection) -> Result<BTreeMap<String, i64>, sqlx::Error> {
    let rows = sqlx::query(
        "SELECT id, catalog_key FROM ai_model WHERE tenant_id = 0 AND organization_id = 0",
    )
    .fetch_all(&mut *conn)
    .await?;
    Ok(rows
        .into_iter()
        .map(|row| (row.get("catalog_key"), row.get("id")))
        .collect())
}

async fn import_capabilities(
    conn: &mut PgConnection,
    catalog: &ModelCatalog,
    model_ids: &BTreeMap<String, i64>,
) -> Result<(), sqlx::Error> {
    for vendor in &catalog.vendors {
        for model in &vendor.models {
            let model_catalog_key = model_base_catalog_key(&model.vendor_code, &model.model_id);
            let model_id = model_ids.get(&model_catalog_key).copied();
            let capabilities = if model.capabilities.is_empty() {
                vec![model.primary_capability.clone()]
            } else {
                model.capabilities.clone()
            };
            for (index, capability) in capabilities.iter().enumerate() {
                sqlx::query(
                    r#"
                    INSERT INTO ai_model_capability
                        (uuid, tenant_id, organization_id, data_scope, status, metadata, model_id, catalog_key, model, vendor_code, capability, capability_code, modality, input_modalities, output_modalities, endpoint_formats, supported, schema_version, sort_order)
                    VALUES
                        ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12, $13, $14::jsonb, $15::jsonb, $16::jsonb, true, $17, $18)
                    ON CONFLICT(uuid) DO UPDATE SET
                        model_id = excluded.model_id,
                        catalog_key = excluded.catalog_key,
                        model = excluded.model,
                        vendor_code = excluded.vendor_code,
                        capability = excluded.capability,
                        capability_code = excluded.capability_code,
                        modality = excluded.modality,
                        input_modalities = excluded.input_modalities,
                        output_modalities = excluded.output_modalities,
                        endpoint_formats = excluded.endpoint_formats,
                        supported = excluded.supported,
                        schema_version = excluded.schema_version,
                        sort_order = excluded.sort_order,
                        metadata = excluded.metadata,
                        deleted_at = NULL,
                        deleted_by = NULL,
                        status = excluded.status
                    "#,
                )
                .bind(stable_uuid(
                    "sdk-cap",
                    &[&model.vendor_code, &model.model_id, capability],
                ))
                .bind(SYSTEM_TENANT_ID)
                .bind(SYSTEM_ORGANIZATION_ID)
                .bind(SYSTEM_DATA_SCOPE)
                .bind(ACTIVE_STATUS)
                .bind(metadata_json(catalog, "sdkwork_models_capability", serde_json::json!({ "capability": capability })))
                .bind(model_id)
                .bind(&model_catalog_key)
                .bind(&model.model_id)
                .bind(&model.vendor_code)
                .bind(capability_code(capability))
                .bind(capability)
                .bind(primary_modality(model))
                .bind(json_array(&model.input_modalities))
                .bind(json_array(&model.output_modalities))
                .bind(serde_json::json!([model.api_format]).to_string())
                .bind(&catalog.manifest.schema_version)
                .bind((index as i32) + 1)
                .execute(&mut *conn)
                .await?;
            }
        }
    }
    Ok(())
}

async fn import_pricing(
    conn: &mut PgConnection,
    catalog: &ModelCatalog,
    model_ids: &BTreeMap<String, i64>,
) -> Result<(), sqlx::Error> {
    for vendor in &catalog.vendors {
        for pricing in &vendor.pricing {
            let pricing_catalog_key = catalog_key(
                &pricing.vendor_code,
                &pricing.region_code,
                &pricing.model_id,
            );
            for (index, price) in pricing.prices.iter().enumerate() {
                let model_catalog_key =
                    model_base_catalog_key(&pricing.vendor_code, &pricing.model_id);
                let model_id = model_ids.get(&model_catalog_key).copied();
                let meter_id: Option<i64> = sqlx::query_scalar(
                    "SELECT id FROM ai_billing_meter WHERE tenant_id = 0 AND organization_id = 0 AND meter_code = $1",
                )
                .bind(&price.meter_code)
                .fetch_optional(&mut *conn)
                .await?;
                sqlx::query(
                    r#"
                    INSERT INTO ai_model_pricing
                        (uuid, tenant_id, organization_id, data_scope, status, metadata, model_id, catalog_key, model, vendor_code, region_code, provider_code, price_side, pricing_scope, billing_type, billing_mode, billing_meter_id, billing_meter_code, price_item_type, unit, unit_size, metering_mode, quantity_source, minimum_quantity, quantity_step, included_quantity, unit_price, currency, rounding_mode, min_charge_amount, pricing_formula_mode, price_origin, priority, price_version, source_url, observed_at, effective_from)
                    VALUES
                        ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12, $13, $14, 1, 1, $15, $16, 1, 1, $17, 1, 1, $18, $19, 0, $20, $21, 1, 0, 1, 1, $22, $23, $24, $25, $26)
                    ON CONFLICT(uuid) DO UPDATE SET
                        model_id = excluded.model_id,
                        catalog_key = excluded.catalog_key,
                        model = excluded.model,
                        vendor_code = excluded.vendor_code,
                        region_code = excluded.region_code,
                        provider_code = excluded.provider_code,
                        price_side = excluded.price_side,
                        pricing_scope = excluded.pricing_scope,
                        billing_meter_id = excluded.billing_meter_id,
                        billing_meter_code = excluded.billing_meter_code,
                        unit_size = excluded.unit_size,
                        minimum_quantity = excluded.minimum_quantity,
                        quantity_step = excluded.quantity_step,
                        unit_price = excluded.unit_price,
                        currency = excluded.currency,
                        priority = excluded.priority,
                        price_version = excluded.price_version,
                        source_url = excluded.source_url,
                        observed_at = excluded.observed_at,
                        effective_from = excluded.effective_from,
                        metadata = excluded.metadata,
                        deleted_at = NULL,
                        deleted_by = NULL,
                        status = excluded.status
                    "#,
                )
                .bind(stable_uuid(
                    "sdk-price",
                    &[
                        &pricing.vendor_code,
                        &pricing.region_code,
                        &pricing.model_id,
                        &price.price_id,
                    ],
                ))
                .bind(SYSTEM_TENANT_ID)
                .bind(SYSTEM_ORGANIZATION_ID)
                .bind(SYSTEM_DATA_SCOPE)
                .bind(ACTIVE_STATUS)
                .bind(metadata_json(catalog, "sdkwork_models_pricing", serde_json::json!({ "priceId": price.price_id, "sourceUrl": price.source.source_url })))
                .bind(model_id)
                .bind(&pricing_catalog_key)
                .bind(&pricing.model_id)
                .bind(&pricing.vendor_code)
                .bind(&pricing.region_code)
                .bind(price_provider_code(
                    &pricing.vendor_code,
                    &pricing.region_code,
                    &price.price_side,
                    price.pricing_scope.as_deref(),
                ))
                .bind(price_side_code(&price.price_side))
                .bind(pricing_scope_code(price.pricing_scope.as_deref()))
                .bind(meter_id)
                .bind(&price.meter_code)
                .bind(&price.unit_size)
                .bind(&price.minimum_quantity)
                .bind(price.quantity_step.as_deref().unwrap_or("1"))
                .bind(&price.unit_price)
                .bind(price.currency.as_deref().unwrap_or(&pricing.currency))
                .bind((index as i32) + 1)
                .bind(&catalog.manifest.catalog_version)
                .bind(&price.source.source_url)
                .bind(&price.source.observed_at)
                .bind(&price.effective_from)
                .execute(&mut *conn)
                .await?;
            }
        }
    }
    Ok(())
}

async fn import_rankings(
    conn: &mut PgConnection,
    catalog: &ModelCatalog,
    model_ids: &BTreeMap<String, i64>,
) -> Result<(), sqlx::Error> {
    let model_map = catalog
        .vendors
        .iter()
        .flat_map(|vendor| {
            vendor.models.iter().map(|model| {
                (
                    model_base_catalog_key(&vendor.vendor.vendor_code, &model.model_id),
                    model,
                )
            })
        })
        .collect::<BTreeMap<_, _>>();
    for vendor in &catalog.vendors {
        for snapshot in &vendor.rankings {
            for item in &snapshot.items {
                let item_catalog_key = catalog_key(
                    &vendor.vendor.vendor_code,
                    &vendor.vendor.region_code,
                    &item.model_id,
                );
                let model_lookup_key =
                    model_base_catalog_key(&vendor.vendor.vendor_code, &item.model_id);
                let Some(model) = model_map.get(&model_lookup_key) else {
                    continue;
                };
                sqlx::query(
                    r#"
                    INSERT INTO ai_model_rank_snapshot
                        (uuid, tenant_id, organization_id, source_type, source_version, status, metadata, snapshot_date, snapshot_period, rank_scope, model_id, catalog_key, model, vendor_code, region_code, vendor_name_snapshot, provider_code, modality, rank_no, previous_rank_no, color_token, pricing_text, strengths, latency_p50_ms, latency_p95_ms, win_rate, trend_score, rank_payload)
                    VALUES
                        ($1, $2, $3, $4, 1, $5, $6::jsonb, $7, 1, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21::jsonb, $22, $23, $24, $25, $26::jsonb)
                    ON CONFLICT(tenant_id, organization_id, snapshot_date, snapshot_period, rank_scope, catalog_key) DO UPDATE SET
                        model_id = excluded.model_id,
                        catalog_key = excluded.catalog_key,
                        vendor_code = excluded.vendor_code,
                        region_code = excluded.region_code,
                        vendor_name_snapshot = excluded.vendor_name_snapshot,
                        provider_code = excluded.provider_code,
                        modality = excluded.modality,
                        rank_no = excluded.rank_no,
                        previous_rank_no = excluded.previous_rank_no,
                        color_token = excluded.color_token,
                        pricing_text = excluded.pricing_text,
                        strengths = excluded.strengths,
                        latency_p50_ms = excluded.latency_p50_ms,
                        latency_p95_ms = excluded.latency_p95_ms,
                        win_rate = excluded.win_rate,
                        trend_score = excluded.trend_score,
                        rank_payload = excluded.rank_payload,
                        metadata = excluded.metadata,
                        status = excluded.status
                    "#,
                )
                .bind(stable_uuid(
                    "sdk-rank",
                    &[
                        &snapshot.snapshot_date,
                        &snapshot.rank_scope,
                        &vendor.vendor.vendor_code,
                        &vendor.vendor.region_code,
                        &item.model_id,
                    ],
                ))
                .bind(SYSTEM_TENANT_ID)
                .bind(SYSTEM_ORGANIZATION_ID)
                .bind("sdkwork_models")
                .bind(ACTIVE_STATUS)
                .bind(metadata_json(catalog, "sdkwork_models_ranking", serde_json::json!({ "rankScope": snapshot.rank_scope })))
                .bind(&snapshot.snapshot_date)
                .bind(&snapshot.rank_scope)
                .bind(model_ids.get(&model_lookup_key).copied())
                .bind(&item_catalog_key)
                .bind(&item.model_id)
                .bind(&model.vendor_code)
                .bind(&vendor.vendor.region_code)
                .bind(model.vendor_name.as_deref().unwrap_or(&vendor.vendor.display_name))
                .bind(format!(
                    "{}_{}_direct",
                    model.vendor_code, vendor.vendor.region_code
                ))
                .bind(primary_modality(model))
                .bind(item.rank_no)
                .bind(item.previous_rank_no)
                .bind(&model.color_token)
                .bind(item.pricing_text.clone().unwrap_or_else(|| "catalog reference".to_owned()))
                .bind(json_array(&model.strengths))
                .bind(model.latency_p50_ms)
                .bind(model.latency_p95_ms)
                .bind(model.win_rate.as_deref().unwrap_or("0"))
                .bind(model.trend_score.as_deref().unwrap_or("0"))
                .bind(serde_json::json!({ "modelId": item.model_id, "rankNo": item.rank_no }).to_string())
                .execute(&mut *conn)
                .await?;
            }
        }
    }
    Ok(())
}

async fn update_family_defaults(
    conn: &mut PgConnection,
    catalog: &ModelCatalog,
    model_ids: &BTreeMap<String, i64>,
) -> Result<(), sqlx::Error> {
    for vendor in &catalog.vendors {
        for family in &vendor.families {
            if let Some(default_model) = &family.default_model {
                let default_catalog_key =
                    model_base_catalog_key(&vendor.vendor.vendor_code, default_model);
                sqlx::query(
                    r#"
                    UPDATE ai_model_family
                    SET default_model_id = $1, default_model = $2
                    WHERE tenant_id = 0 AND organization_id = 0 AND vendor_code = $3 AND region_code = $4 AND family_code = $5
                    "#,
                )
                .bind(model_ids.get(&default_catalog_key).copied())
                .bind(default_model)
                .bind(&vendor.vendor.vendor_code)
                .bind(&vendor.vendor.region_code)
                .bind(&family.family_code)
                .execute(&mut *conn)
                .await?;
            }
        }
    }
    Ok(())
}
