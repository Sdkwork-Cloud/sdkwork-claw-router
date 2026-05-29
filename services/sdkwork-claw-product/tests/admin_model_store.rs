use sdkwork_claw_product::infrastructure::sql::installer::{
    CatalogRefreshOptions, DatabaseInstallOptions, DatabaseInstaller,
};
use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAdminModelStore;
use sdkwork_claw_product::ports::{
    AdminAiModelRegionPriceCommand, AdminModelStore, AdminModelSubject, CreateAdminAiModelCommand,
    ListAdminAiModelsQuery, SyncAdminModelCatalogCommand, UpdateAdminAiModelCommand,
};
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::Row;
use std::collections::BTreeSet;

#[tokio::test]
async fn sqlite_admin_model_store_creates_region_pricing_catalog_rows() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    install_admin_model_catalog(&pool, &["openai"]).await;
    let store = SqliteAdminModelStore::new(pool.clone());
    let subject = AdminModelSubject {
        tenant_id: 0,
        organization_id: 0,
        operator_id: 99,
        operator_type: 1,
    };

    let vendor_id: i64 =
        sqlx::query_scalar("SELECT id FROM ai_model_vendor WHERE vendor_code = 'openai' LIMIT 1")
            .fetch_one(&pool)
            .await
            .unwrap();

    let item = store
        .create_model(CreateAdminAiModelCommand {
            subject,
            model_uuid: "model-region-price-test".to_owned(),
            input_pricing_uuid: "pricing-region-input-test".to_owned(),
            output_pricing_uuid: "pricing-region-output-test".to_owned(),
            cache_read_pricing_uuid: "pricing-region-cache-read-test".to_owned(),
            cache_write_pricing_uuid: "pricing-region-cache-write-test".to_owned(),
            capability_uuid: "capability-region-price-test".to_owned(),
            audit_log_uuid: "audit-region-price-test".to_owned(),
            vendor_id: vendor_id.to_string(),
            model: "admin-region-model".to_owned(),
            display_name: "admin-region-model".to_owned(),
            model_type: "Chat".to_owned(),
            price_in: "0.120000".to_owned(),
            price_out: "0.450000".to_owned(),
            cache_read_price: None,
            cache_write_price: None,
            region_code: "global".to_owned(),
            region_prices: vec![
                AdminAiModelRegionPriceCommand {
                    region_code: "cn".to_owned(),
                    price_in: "0.180000".to_owned(),
                    price_out: "0.560000".to_owned(),
                    cache_read_price: Some("0.040000".to_owned()),
                    cache_write_price: Some("0.080000".to_owned()),
                },
                AdminAiModelRegionPriceCommand {
                    region_code: "global".to_owned(),
                    price_in: "0.120000".to_owned(),
                    price_out: "0.450000".to_owned(),
                    cache_read_price: None,
                    cache_write_price: None,
                },
            ],
            description: Some("Region priced model".to_owned()),
            modalities: vec!["text".to_owned()],
            input_modalities: vec!["text".to_owned()],
            output_modalities: vec!["text".to_owned()],
            api_format: "openai_responses".to_owned(),
            capability_intro: None,
            limitations: Vec::new(),
            supported_languages: Vec::new(),
            use_cases: Vec::new(),
            training_data_cutoff: None,
            context_tokens: 128000,
            max_output_tokens: None,
            supports_streaming: true,
            supports_tools: true,
            supports_json_schema: true,
            release_stage: 1,
            shelf_state: 1,
            routing_state: 1,
            replacement_model: None,
            request_id: "req-region-price-model-store".to_owned(),
            requested_at: "2026-05-07T12:00:00Z".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!("admin-region-model", item.name);
    assert_eq!(0.18, decimal_value(&item.price_in));
    assert_eq!(0.56, decimal_value(&item.price_out));

    let model_row = sqlx::query(
        r#"
        SELECT catalog_key
        FROM ai_model
        WHERE uuid = 'model-region-price-test'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        "openai/admin-region-model",
        model_row.get::<String, _>("catalog_key")
    );

    let capability_row = sqlx::query(
        r#"
        SELECT catalog_key
        FROM ai_model_capability
        WHERE uuid = 'capability-region-price-test'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        "openai/admin-region-model",
        capability_row.get::<String, _>("catalog_key")
    );

    let pricing_rows = sqlx::query(
        r#"
        SELECT catalog_key, region_code, billing_meter_code, CAST(unit_price AS TEXT) AS unit_price
        FROM ai_model_pricing
        WHERE model_id = ?
          AND price_side = 1
          AND pricing_scope = 1
          AND status = 1
          AND deleted_at IS NULL
        ORDER BY region_code ASC, priority ASC
        "#,
    )
    .bind(item.id)
    .fetch_all(&pool)
    .await
    .unwrap();
    let pricing = pricing_rows
        .iter()
        .map(|row| {
            (
                row.get::<String, _>("catalog_key"),
                row.get::<String, _>("region_code"),
                row.get::<String, _>("billing_meter_code"),
                decimal_value(&row.get::<String, _>("unit_price")),
            )
        })
        .collect::<Vec<_>>();
    assert_eq!(6, pricing.len());
    assert!(pricing.iter().any(|(catalog_key, region, meter, price)| {
        catalog_key == "openai/admin-region-model"
            && region == "cn"
            && meter == "llm_input_token"
            && *price == 0.18
    }));
    assert!(pricing.iter().any(|(catalog_key, region, meter, price)| {
        catalog_key == "openai/admin-region-model"
            && region == "global"
            && meter == "llm_output_token"
            && *price == 0.45
    }));
    assert!(pricing.iter().any(|(_, region, meter, price)| {
        region == "cn" && meter == "llm_cache_read_token" && *price == 0.04
    }));
}

#[tokio::test]
async fn sqlite_admin_model_store_updates_installed_model_graph() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    install_admin_model_catalog(&pool, &["openai"]).await;
    let model_id: i64 = sqlx::query_scalar("SELECT id FROM ai_model WHERE model = 'gpt-image-1.5'")
        .fetch_one(&pool)
        .await
        .unwrap();

    let item = SqliteAdminModelStore::new(pool.clone())
        .update_model(UpdateAdminAiModelCommand {
            subject: AdminModelSubject {
                tenant_id: 0,
                organization_id: 0,
                operator_id: 99,
                operator_type: 1,
            },
            capability_uuid: "capability-update-test".to_owned(),
            input_pricing_uuid: "pricing-update-input-test".to_owned(),
            output_pricing_uuid: "pricing-update-output-test".to_owned(),
            cache_read_pricing_uuid: "pricing-update-cache-read-test".to_owned(),
            cache_write_pricing_uuid: "pricing-update-cache-write-test".to_owned(),
            audit_log_uuid: "audit-update-model-test".to_owned(),
            model_id: model_id.to_string(),
            vendor_id: None,
            model: Some("gpt-image-commercial-edit".to_owned()),
            display_name: None,
            model_type: Some("Image".to_owned()),
            price_in: Some("0.111000".to_owned()),
            price_out: Some("0.222000".to_owned()),
            cache_read_price: None,
            cache_write_price: None,
            region_code: None,
            region_prices: None,
            status: Some("inactive".to_owned()),
            description: Some(Some("Updated commercial image model".to_owned())),
            modalities: Some(vec!["image".to_owned()]),
            input_modalities: Some(vec!["text".to_owned(), "image".to_owned()]),
            output_modalities: Some(vec!["image".to_owned()]),
            api_format: Some("openai_compatible".to_owned()),
            capability_intro: Some(Some("Image generation and editing".to_owned())),
            limitations: Some(vec!["No medical diagnosis".to_owned()]),
            supported_languages: Some(vec!["en".to_owned(), "zh".to_owned()]),
            use_cases: Some(vec!["commerce".to_owned()]),
            training_data_cutoff: Some(Some("2026-05".to_owned())),
            context_tokens: Some(2048),
            max_output_tokens: Some(None),
            supports_streaming: Some(false),
            supports_tools: Some(false),
            supports_json_schema: Some(false),
            release_stage: Some(1),
            shelf_state: Some(2),
            routing_state: Some(0),
            replacement_model: Some(Some("gpt-image-1.5".to_owned())),
            request_id: "req-update-model-store".to_owned(),
            requested_at: "2026-05-07T12:00:00Z".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!("GPT Image 1.5", item.name);
    assert_eq!("Image", item.model_type);
    assert_eq!("inactive", item.status);
    assert_eq!(Some(2048), item.context_tokens);
    assert_eq!(None, item.max_output_tokens);
    assert_eq!(vec!["image"], item.modalities);
    assert_eq!(vec!["text", "image"], item.input_modalities);
    assert_eq!(vec!["image"], item.output_modalities);
    assert_eq!(Some("openai_compatible".to_owned()), item.api_format);
    assert_eq!(Some("gpt-image-1.5".to_owned()), item.replacement_model);

    let model_row = sqlx::query(
        r#"
        SELECT model, display_name, vendor_code, vendor_name_snapshot, capability,
               CAST(modalities AS TEXT) AS modalities_json,
               CAST(input_modalities AS TEXT) AS input_modalities_json,
               CAST(output_modalities AS TEXT) AS output_modalities_json,
               status, context_tokens, max_output_tokens, supports_streaming,
               supports_tools, supports_json_schema, api_format, replacement_model, version
        FROM ai_model
        WHERE id = ?
        "#,
    )
    .bind(model_id)
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        "gpt-image-commercial-edit",
        model_row.get::<String, _>("model")
    );
    assert_eq!("GPT Image 1.5", model_row.get::<String, _>("display_name"));
    assert_eq!("openai", model_row.get::<String, _>("vendor_code"));
    assert_eq!("OpenAI", model_row.get::<String, _>("vendor_name_snapshot"));
    assert_eq!(2_i64, model_row.get::<i64, _>("capability"));
    assert_eq!(0_i64, model_row.get::<i64, _>("status"));
    assert_eq!(2048_i64, model_row.get::<i64, _>("context_tokens"));
    assert_eq!(
        None::<i64>,
        model_row.get::<Option<i64>, _>("max_output_tokens")
    );
    assert_eq!(0_i64, model_row.get::<i64, _>("supports_streaming"));
    assert_eq!(0_i64, model_row.get::<i64, _>("supports_tools"));
    assert_eq!(0_i64, model_row.get::<i64, _>("supports_json_schema"));
    assert_eq!(
        "openai_compatible",
        model_row.get::<String, _>("api_format")
    );
    assert_eq!(
        "gpt-image-1.5",
        model_row.get::<String, _>("replacement_model")
    );
    assert_eq!(1_i64, model_row.get::<i64, _>("version"));

    let capability_row = sqlx::query(
        r#"
        SELECT model, vendor_code, capability, capability_code, modality,
               CAST(input_modalities AS TEXT) AS input_modalities_json,
               CAST(output_modalities AS TEXT) AS output_modalities_json
        FROM ai_model_capability
        WHERE model_id = ?
          AND deleted_at IS NULL
        ORDER BY id ASC
        LIMIT 1
        "#,
    )
    .bind(model_id)
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        "gpt-image-commercial-edit",
        capability_row.get::<String, _>("model")
    );
    assert_eq!("openai", capability_row.get::<String, _>("vendor_code"));
    assert_eq!(2_i64, capability_row.get::<i64, _>("capability"));
    assert_eq!("image", capability_row.get::<String, _>("capability_code"));
    assert_eq!(2_i64, capability_row.get::<i64, _>("modality"));
    assert_eq!(
        r#"["text","image"]"#,
        capability_row.get::<String, _>("input_modalities_json")
    );
    assert_eq!(
        r#"["image"]"#,
        capability_row.get::<String, _>("output_modalities_json")
    );

    let pricing_rows = sqlx::query(
        r#"
        SELECT billing_meter_code, CAST(unit_price AS TEXT) AS unit_price
        FROM ai_model_pricing
        WHERE model_id = ?
          AND price_side = 1
          AND pricing_scope = 1
          AND status = 1
          AND deleted_at IS NULL
        ORDER BY priority ASC, id ASC
        "#,
    )
    .bind(model_id)
    .fetch_all(&pool)
    .await
    .unwrap();
    let pricing_pairs = pricing_rows
        .iter()
        .map(|row| {
            (
                row.get::<String, _>("billing_meter_code"),
                row.get::<String, _>("unit_price").parse::<f64>().unwrap(),
            )
        })
        .collect::<Vec<_>>();
    assert_eq!(
        3,
        pricing_pairs.len(),
        "model update must preserve additional official multimodal price rows"
    );
    assert!(
        pricing_pairs
            .iter()
            .any(|(meter, price)| meter == "image_input_token" && *price == 0.111),
        "representative input price must be updated"
    );
    assert!(
        pricing_pairs
            .iter()
            .any(|(meter, price)| meter == "image_input_token" && *price == 7.0),
        "secondary image input price must remain available"
    );
    assert!(
        pricing_pairs
            .iter()
            .any(|(meter, price)| meter == "image_output_token" && *price == 0.222),
        "representative output price must be updated"
    );

    let audit_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM ops_audit_log
        WHERE action = 'update_ai_model'
          AND target_type = 42
          AND target_id = ?
          AND request_id = 'req-update-model-store'
        "#,
    )
    .bind(model_id)
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(1, audit_count);
}

#[tokio::test]
async fn sqlite_admin_model_store_updates_preserves_and_clears_cache_prices() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    install_admin_model_catalog(&pool, &["minimax"]).await;

    let model_id: i64 = sqlx::query_scalar("SELECT id FROM ai_model WHERE model = 'MiniMax-M2.7'")
        .fetch_one(&pool)
        .await
        .unwrap();
    let store = SqliteAdminModelStore::new(pool.clone());
    let subject = AdminModelSubject {
        tenant_id: 0,
        organization_id: 0,
        operator_id: 99,
        operator_type: 1,
    };

    let cache_price_rows = sqlx::query(
        r#"
        SELECT billing_meter_code, CAST(unit_price AS TEXT) AS unit_price
        FROM ai_model_pricing
        WHERE model_id = ?
          AND price_side = 1
          AND billing_meter_code IN ('llm_cache_read_token', 'llm_cache_write_token')
          AND status = 1
          AND deleted_at IS NULL
        ORDER BY billing_meter_code ASC
        "#,
    )
    .bind(model_id)
    .fetch_all(&pool)
    .await
    .unwrap();
    let cache_price_pairs = cache_price_rows
        .iter()
        .map(|row| {
            (
                row.get::<String, _>("billing_meter_code"),
                row.get::<String, _>("unit_price"),
            )
        })
        .collect::<Vec<_>>();
    let initial_cache_read_price = cache_price_pairs
        .iter()
        .find_map(|(meter, price)| (meter == "llm_cache_read_token").then(|| decimal_value(price)))
        .unwrap_or_else(|| {
            panic!("installed cache read pricing row must exist: {cache_price_pairs:?}")
        });
    let initial_cache_write_price = cache_price_pairs
        .iter()
        .find_map(|(meter, price)| (meter == "llm_cache_write_token").then(|| decimal_value(price)))
        .unwrap_or_else(|| {
            panic!("installed cache write pricing row must exist: {cache_price_pairs:?}")
        });

    let updated = store
        .update_model(UpdateAdminAiModelCommand {
            subject,
            capability_uuid: "capability-cache-preserve-test".to_owned(),
            input_pricing_uuid: "pricing-cache-preserve-input-test".to_owned(),
            output_pricing_uuid: "pricing-cache-preserve-output-test".to_owned(),
            cache_read_pricing_uuid: "pricing-cache-preserve-read-test".to_owned(),
            cache_write_pricing_uuid: "pricing-cache-preserve-write-test".to_owned(),
            audit_log_uuid: "audit-cache-preserve-model-test".to_owned(),
            model_id: model_id.to_string(),
            vendor_id: None,
            model: Some("MiniMax-M2.7-commercial".to_owned()),
            display_name: None,
            model_type: Some("Chat".to_owned()),
            price_in: Some("0.333333".to_owned()),
            price_out: Some("1.444444".to_owned()),
            cache_read_price: None,
            cache_write_price: None,
            region_code: None,
            region_prices: None,
            status: Some("active".to_owned()),
            description: None,
            modalities: Some(vec!["text".to_owned()]),
            input_modalities: Some(vec!["text".to_owned()]),
            output_modalities: Some(vec!["text".to_owned()]),
            api_format: Some("openai_compatible".to_owned()),
            capability_intro: None,
            limitations: None,
            supported_languages: None,
            use_cases: None,
            training_data_cutoff: None,
            context_tokens: Some(204800),
            max_output_tokens: Some(Some(32768)),
            supports_streaming: Some(true),
            supports_tools: Some(true),
            supports_json_schema: Some(true),
            release_stage: Some(1),
            shelf_state: Some(1),
            routing_state: Some(1),
            replacement_model: None,
            request_id: "req-cache-preserve-model-store".to_owned(),
            requested_at: "2026-05-07T13:00:00Z".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!(
        initial_cache_read_price,
        decimal_value(&updated.cache_read_price)
    );
    assert_eq!(
        initial_cache_write_price,
        decimal_value(&updated.cache_write_price)
    );

    let cleared = store
        .update_model(UpdateAdminAiModelCommand {
            subject,
            capability_uuid: "capability-cache-clear-test".to_owned(),
            input_pricing_uuid: "pricing-cache-clear-input-test".to_owned(),
            output_pricing_uuid: "pricing-cache-clear-output-test".to_owned(),
            cache_read_pricing_uuid: "pricing-cache-clear-read-test".to_owned(),
            cache_write_pricing_uuid: "pricing-cache-clear-write-test".to_owned(),
            audit_log_uuid: "audit-cache-clear-model-test".to_owned(),
            model_id: model_id.to_string(),
            vendor_id: None,
            model: None,
            display_name: None,
            model_type: None,
            price_in: None,
            price_out: None,
            cache_read_price: Some(None),
            cache_write_price: Some(Some("".to_owned())),
            region_code: None,
            region_prices: None,
            status: None,
            description: None,
            modalities: None,
            input_modalities: None,
            output_modalities: None,
            api_format: None,
            capability_intro: None,
            limitations: None,
            supported_languages: None,
            use_cases: None,
            training_data_cutoff: None,
            context_tokens: None,
            max_output_tokens: None,
            supports_streaming: None,
            supports_tools: None,
            supports_json_schema: None,
            release_stage: None,
            shelf_state: None,
            routing_state: None,
            replacement_model: None,
            request_id: "req-cache-clear-model-store".to_owned(),
            requested_at: "2026-05-07T13:05:00Z".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!("", cleared.cache_read_price);
    assert_eq!("", cleared.cache_write_price);

    let active_cache_pricing_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM ai_model_pricing
        WHERE model_id = ?
          AND price_side = 1
          AND billing_meter_code IN ('llm_cache_read_token', 'llm_cache_write_token')
          AND status = 1
          AND deleted_at IS NULL
        "#,
    )
    .bind(model_id)
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(0, active_cache_pricing_count);
}

#[tokio::test]
async fn sqlite_admin_model_store_uses_subject_latest_commercial_ranking_snapshot_for_calls() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_admin_model_tables(&pool).await;

    sqlx::query(
        r#"
        INSERT INTO ai_model
            (id, uuid, tenant_id, organization_id, status, model, display_name, vendor_id, vendor_code, capability, modalities, input_modalities, output_modalities, rank_score)
        VALUES
            (1, 'model-current', 0, 0, 1, 'gpt-current', 'GPT Current', 1, 'openai', 1, '["text"]', '["text"]', '["text"]', 10),
            (2, 'model-old-only', 0, 0, 1, 'gpt-old-only', 'GPT Old Only', 1, 'openai', 1, '["text"]', '["text"]', '["text"]', 9),
            (3, 'model-tenant-current', 0, 0, 1, 'gpt-tenant-current', 'GPT Tenant Current', 1, 'openai', 1, '["text"]', '["text"]', '["text"]', 8)
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO ai_model_rank_snapshot
            (id, tenant_id, organization_id, status, snapshot_date, snapshot_period, rank_scope, model, vendor_code, rank_no, request_count, base_volume)
        VALUES
            (1, 0, 0, 1, '2026-05-07', 1, 'commercial-default', 'gpt-current', 'openai', 1, 100, 100),
            (2, 0, 0, 1, '2026-05-06', 1, 'commercial-default', 'gpt-old-only', 'openai', 2, 999, 999),
            (3, 0, 0, 1, '2026-05-08', 1, 'playground-local', 'gpt-old-only', 'openai', 1, 777, 777),
            (4, 10, 20, 1, '2026-05-07', 1, 'commercial-default', 'gpt-tenant-current', 'openai', 1, 321, 321),
            (5, 0, 0, 1, '2026-05-08', 1, 'commercial-default', 'gpt-current', 'openai', 1, 654, 654)
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let models = SqliteAdminModelStore::new(pool)
        .list_models(ListAdminAiModelsQuery {
            subject: AdminModelSubject {
                tenant_id: 10,
                organization_id: 20,
                operator_id: 1,
                operator_type: 1,
            },
        })
        .await
        .unwrap();

    let current = models
        .iter()
        .find(|item| item.model == "gpt-current")
        .expect("current model exists");
    let old_only = models
        .iter()
        .find(|item| item.model == "gpt-old-only")
        .expect("old-only model exists");
    let tenant_current = models
        .iter()
        .find(|item| item.model == "gpt-tenant-current")
        .expect("tenant current model exists");

    assert_eq!("0", current.calls);
    assert_eq!("0", old_only.calls);
    assert_eq!("321", tenant_current.calls);
}

#[tokio::test]
async fn sqlite_admin_model_store_does_not_use_global_tenant_organization_ranking_calls() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_admin_model_tables(&pool).await;

    sqlx::query(
        r#"
        INSERT INTO ai_model
            (id, uuid, tenant_id, organization_id, status, model, display_name, vendor_id, vendor_code, capability, modalities, input_modalities, output_modalities, rank_score)
        VALUES
            (1, 'model-current', 0, 0, 1, 'gpt-current', 'GPT Current', 1, 'openai', 1, '["text"]', '["text"]', '["text"]', 10)
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO ai_model_rank_snapshot
            (id, tenant_id, organization_id, status, snapshot_date, snapshot_period, rank_scope, model, vendor_code, rank_no, request_count, base_volume)
        VALUES
            (1, 0, 20, 1, '2026-05-08', 1, 'commercial-default', 'gpt-current', 'openai', 1, 888, 888)
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let models = SqliteAdminModelStore::new(pool)
        .list_models(ListAdminAiModelsQuery {
            subject: AdminModelSubject {
                tenant_id: 10,
                organization_id: 20,
                operator_id: 1,
                operator_type: 1,
            },
        })
        .await
        .unwrap();

    let current = models
        .iter()
        .find(|item| item.model == "gpt-current")
        .expect("current model exists");

    assert_eq!("0", current.calls);
}

#[tokio::test]
async fn sqlite_admin_model_store_sync_catalog_reapplies_sdkwork_models_catalog() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    prepare_admin_model_schema(&pool).await;

    sqlx::query(
        r#"
        DELETE FROM ai_model
        WHERE model = 'qwen3.6-max-preview'
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let synced = SqliteAdminModelStore::new(pool.clone())
        .sync_catalog(SyncAdminModelCatalogCommand {
            subject: AdminModelSubject {
                tenant_id: 0,
                organization_id: 0,
                operator_id: 99,
                operator_type: 1,
            },
            snapshot_uuid: "sync-catalog-regression".to_owned(),
            audit_log_uuid: "audit-sync-catalog-regression".to_owned(),
            source: "official_docs".to_owned(),
            mode: "official_refresh".to_owned(),
            vendor_codes: vec!["alibaba".to_owned()],
            force: true,
            catalog_root: None,
            catalog_version: Some("2026.05.08.1".to_owned()),
            request_id: "req-sync-catalog-regression".to_owned(),
            requested_at: "2026-05-07T12:30:00Z".to_owned(),
        })
        .await
        .unwrap();

    assert!(synced.synced);
    assert_eq!("official_docs", synced.source);
    assert!(synced
        .vendors
        .iter()
        .all(|vendor| vendor.vendor_code == "alibaba"));
    assert!(synced
        .models
        .iter()
        .all(|model| model.vendor_code == "alibaba"));
    assert!(synced
        .models
        .iter()
        .any(|model| model.model == "qwen3.6-max-preview"));
    assert_eq!("official_refresh", synced.mode);
    assert!(!synced.dry_run);
    assert_eq!("2026.05.08.1", synced.catalog_version);
    assert_eq!(
        Some("2026.05.08.1".to_owned()),
        synced.requested_catalog_version
    );
    assert_eq!(None, synced.catalog_root);
    assert_eq!(vec!["alibaba".to_owned()], synced.vendor_codes);
    assert_eq!(64, synced.source_hash.len());
    assert!(synced.source_hash.chars().all(|ch| ch.is_ascii_hexdigit()));

    let model_row = sqlx::query(
        r#"
        SELECT model, display_name, routing_state
        FROM ai_model
        WHERE model = 'qwen3.6-max-preview'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!("qwen3.6-max-preview", model_row.get::<String, _>("model"));
    assert_eq!(
        "Qwen3.6 Max Preview",
        model_row.get::<String, _>("display_name")
    );
    assert_eq!(1_i64, model_row.get::<i64, _>("routing_state"));

    let sync_metadata: String = sqlx::query_scalar(
        r#"
        SELECT metadata
        FROM ai_model_catalog_sync_run
        WHERE uuid = 'catalog-sync-sync-catalog-regression'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert!(sync_metadata.contains("\"syncMode\":\"official_refresh\""));
    assert!(sync_metadata.contains("\"vendorCodes\":[\"alibaba\"]"));
    assert!(sync_metadata.contains("\"force\":true"));

    let sync_run = sqlx::query(
        r#"
        SELECT observed_vendor_count, observed_model_count, observed_meter_count, observed_price_count, accepted_count, source_hash, change_summary
        FROM ai_model_catalog_sync_run
        WHERE uuid = 'catalog-sync-sync-catalog-regression'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    let bundled_catalog = sdkwork_models::load_bundled_catalog().unwrap();
    let expected_meter_count = bundled_catalog.meters.len() as i64;
    let vendor_catalog = bundled_catalog
        .vendors
        .into_iter()
        .find(|vendor| vendor.vendor.vendor_code == "alibaba")
        .expect("alibaba catalog exists");
    let model_ids = vendor_catalog
        .models
        .iter()
        .map(|model| model.model_id.clone())
        .collect::<BTreeSet<_>>();
    let expected_family_count = vendor_catalog.families.len() as i64;
    let expected_model_count = vendor_catalog.models.len() as i64;
    let expected_capability_count = vendor_catalog
        .models
        .iter()
        .map(|model| {
            if model.capabilities.is_empty() {
                1_i64
            } else {
                model.capabilities.len() as i64
            }
        })
        .sum::<i64>();
    let expected_price_count = vendor_catalog
        .pricing
        .iter()
        .map(|pricing| pricing.prices.len() as i64)
        .sum::<i64>();
    let expected_ranking_count = vendor_catalog
        .rankings
        .iter()
        .flat_map(|snapshot| snapshot.items.iter())
        .filter(|item| model_ids.contains(&item.model_id))
        .count() as i64;
    assert_eq!(1_i64, sync_run.get::<i64, _>("observed_vendor_count"));
    assert_eq!(
        expected_model_count,
        sync_run.get::<i64, _>("observed_model_count")
    );
    assert_eq!(
        expected_meter_count,
        sync_run.get::<i64, _>("observed_meter_count")
    );
    assert_eq!(
        expected_price_count,
        sync_run.get::<i64, _>("observed_price_count")
    );
    assert_eq!(
        expected_meter_count
            + 1_i64
            + expected_family_count
            + expected_model_count
            + expected_capability_count
            + expected_price_count
            + expected_ranking_count,
        sync_run.get::<i64, _>("accepted_count"),
        "sync run accepted_count must reflect every imported sdkwork-models fact"
    );
    assert_eq!(
        synced.source_hash,
        sync_run.get::<String, _>("source_hash"),
        "sync response source_hash must identify the exact persisted sync-run source hash"
    );
    let change_summary: serde_json::Value =
        serde_json::from_str(sync_run.get::<String, _>("change_summary").as_str()).unwrap();
    assert_eq!(expected_meter_count, change_summary["counts"]["meters"]);
    assert_eq!(1, change_summary["counts"]["vendors"]);
    assert_eq!(expected_family_count, change_summary["counts"]["families"]);
    assert_eq!(expected_model_count, change_summary["counts"]["models"]);
    assert_eq!(
        expected_capability_count,
        change_summary["counts"]["capabilities"]
    );
    assert_eq!(expected_price_count, change_summary["counts"]["prices"]);
    assert_eq!(expected_ranking_count, change_summary["counts"]["rankings"]);

    let audit_metadata: String = sqlx::query_scalar(
        r#"
        SELECT change_summary
        FROM ops_audit_log
        WHERE uuid = 'audit-sync-catalog-regression'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert!(audit_metadata.contains("\"mode\":\"official_refresh\""));
    assert!(audit_metadata.contains("\"vendorCodes\":[\"alibaba\"]"));
    assert!(audit_metadata.contains("\"force\":true"));
}

#[tokio::test]
async fn sqlite_admin_model_store_sync_catalog_reactivates_soft_deleted_catalog_source() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    prepare_admin_model_schema(&pool).await;
    let store = SqliteAdminModelStore::new(pool.clone());
    let subject = AdminModelSubject {
        tenant_id: 0,
        organization_id: 0,
        operator_id: 99,
        operator_type: 1,
    };

    store
        .sync_catalog(SyncAdminModelCatalogCommand {
            subject,
            snapshot_uuid: "sync-source-first".to_owned(),
            audit_log_uuid: "audit-sync-source-first".to_owned(),
            source: "official_docs".to_owned(),
            mode: "official_refresh".to_owned(),
            vendor_codes: vec!["alibaba".to_owned()],
            force: true,
            catalog_root: None,
            catalog_version: Some("2026.05.08.1".to_owned()),
            request_id: "req-sync-source-first".to_owned(),
            requested_at: "2026-05-07T12:30:00Z".to_owned(),
        })
        .await
        .unwrap();

    sqlx::query(
        r#"
        UPDATE ai_model_catalog_source
        SET status = 0,
            deleted_at = '2099-01-01T00:00:00Z',
            deleted_by = 9001
        WHERE tenant_id = 0
          AND organization_id = 0
          AND source_code = 'official_docs'
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    store
        .sync_catalog(SyncAdminModelCatalogCommand {
            subject,
            snapshot_uuid: "sync-source-second".to_owned(),
            audit_log_uuid: "audit-sync-source-second".to_owned(),
            source: "official_docs".to_owned(),
            mode: "official_refresh".to_owned(),
            vendor_codes: vec!["alibaba".to_owned()],
            force: true,
            catalog_root: None,
            catalog_version: Some("2026.05.08.1".to_owned()),
            request_id: "req-sync-source-second".to_owned(),
            requested_at: "2026-05-07T12:35:00Z".to_owned(),
        })
        .await
        .unwrap();

    let restored_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM ai_model_catalog_source
        WHERE tenant_id = 0
          AND organization_id = 0
          AND source_code = 'official_docs'
          AND status = 1
          AND deleted_at IS NULL
          AND deleted_by IS NULL
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        1, restored_count,
        "catalog source upsert must restore soft-deleted source observability rows"
    );
}

#[tokio::test]
async fn sqlite_admin_model_store_vendor_refresh_only_imports_selected_vendor() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    prepare_admin_model_schema(&pool).await;

    sqlx::query(
        r#"
        DELETE FROM ai_model
        WHERE model IN ('qwen3.6-max-preview', 'gpt-5.2')
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let synced = SqliteAdminModelStore::new(pool.clone())
        .sync_catalog(SyncAdminModelCatalogCommand {
            subject: AdminModelSubject {
                tenant_id: 0,
                organization_id: 0,
                operator_id: 99,
                operator_type: 1,
            },
            snapshot_uuid: "sync-selected-vendor".to_owned(),
            audit_log_uuid: "audit-sync-selected-vendor".to_owned(),
            source: "sdkwork_models".to_owned(),
            mode: "vendor_refresh".to_owned(),
            vendor_codes: vec!["alibaba".to_owned()],
            force: true,
            catalog_root: None,
            catalog_version: Some("2026.05.08.1".to_owned()),
            request_id: "req-sync-selected-vendor".to_owned(),
            requested_at: "2026-05-07T12:45:00Z".to_owned(),
        })
        .await
        .unwrap();

    assert!(synced.synced);
    assert_eq!("sdkwork_models", synced.source);
    assert!(synced
        .models
        .iter()
        .all(|model| model.vendor_code == "alibaba"));

    let qwen_count: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM ai_model WHERE model = 'qwen3.6-max-preview'")
            .fetch_one(&pool)
            .await
            .unwrap();
    let openai_count: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM ai_model WHERE model = 'gpt-5.2'")
            .fetch_one(&pool)
            .await
            .unwrap();

    assert_eq!(1, qwen_count);
    assert_eq!(
        0, openai_count,
        "vendor_refresh must not repair unrelated vendors"
    );
}

#[tokio::test]
async fn sqlite_admin_model_store_dry_run_reports_catalog_scope_without_importing() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    prepare_admin_model_schema(&pool).await;

    sqlx::query("DELETE FROM ai_model WHERE model = 'qwen3.6-max-preview'")
        .execute(&pool)
        .await
        .unwrap();

    let dry_run = SqliteAdminModelStore::new(pool.clone())
        .sync_catalog(SyncAdminModelCatalogCommand {
            subject: AdminModelSubject {
                tenant_id: 0,
                organization_id: 0,
                operator_id: 99,
                operator_type: 1,
            },
            snapshot_uuid: "sync-dry-run".to_owned(),
            audit_log_uuid: "audit-sync-dry-run".to_owned(),
            source: "sdkwork_models".to_owned(),
            mode: "dry_run".to_owned(),
            vendor_codes: vec!["alibaba".to_owned()],
            force: false,
            catalog_root: None,
            catalog_version: Some("2026.05.08.1".to_owned()),
            request_id: "req-sync-dry-run".to_owned(),
            requested_at: "2026-05-07T13:00:00Z".to_owned(),
        })
        .await
        .unwrap();

    assert!(!dry_run.synced);
    assert_eq!("sdkwork_models", dry_run.source);
    assert!(dry_run
        .models
        .iter()
        .any(|model| model.model == "qwen3.6-max-preview"));

    let model_count: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM ai_model WHERE model = 'qwen3.6-max-preview'")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(0, model_count, "dry_run must not mutate catalog tables");

    let sync_metadata: String = sqlx::query_scalar(
        r#"
        SELECT metadata
        FROM ai_model_catalog_sync_run
        WHERE uuid = 'catalog-sync-sync-dry-run'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert!(sync_metadata.contains("\"syncMode\":\"dry_run\""));
    assert!(sync_metadata.contains("\"dryRun\":true"));

    let source_row = sqlx::query(
        r#"
        SELECT CAST(last_success_at AS TEXT) AS last_success_at,
               catalog_version,
               source_hash
        FROM ai_model_catalog_source
        WHERE source_code = 'sdkwork_models'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert!(
        source_row
            .get::<Option<String>, _>("last_success_at")
            .is_none(),
        "dry_run must not advance catalog source last_success_at because no catalog facts were committed"
    );
    assert!(
        source_row
            .get::<Option<String>, _>("catalog_version")
            .is_none(),
        "dry_run must not publish a committed catalog source version before a real refresh succeeds"
    );
    assert!(
        source_row.get::<Option<String>, _>("source_hash").is_none(),
        "dry_run must not publish a committed catalog source hash before a real refresh succeeds"
    );
}

#[tokio::test]
async fn sqlite_admin_model_store_dry_run_preserves_existing_catalog_source_success_state() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    prepare_admin_model_schema(&pool).await;
    let store = SqliteAdminModelStore::new(pool.clone());
    let subject = AdminModelSubject {
        tenant_id: 0,
        organization_id: 0,
        operator_id: 99,
        operator_type: 1,
    };

    store
        .sync_catalog(SyncAdminModelCatalogCommand {
            subject,
            snapshot_uuid: "sync-source-success".to_owned(),
            audit_log_uuid: "audit-sync-source-success".to_owned(),
            source: "sdkwork_models".to_owned(),
            mode: "official_refresh".to_owned(),
            vendor_codes: vec!["openai".to_owned()],
            force: true,
            catalog_root: None,
            catalog_version: Some("2026.05.08.1".to_owned()),
            request_id: "req-sync-source-success".to_owned(),
            requested_at: "2026-05-07T12:00:00Z".to_owned(),
        })
        .await
        .unwrap();

    let before = sqlx::query(
        r#"
        SELECT CAST(last_observed_at AS TEXT) AS last_observed_at,
               CAST(last_success_at AS TEXT) AS last_success_at,
               catalog_version,
               source_hash,
               metadata
        FROM ai_model_catalog_source
        WHERE source_code = 'sdkwork_models'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();

    store
        .sync_catalog(SyncAdminModelCatalogCommand {
            subject,
            snapshot_uuid: "sync-source-dry-run-after-success".to_owned(),
            audit_log_uuid: "audit-sync-source-dry-run-after-success".to_owned(),
            source: "sdkwork_models".to_owned(),
            mode: "dry_run".to_owned(),
            vendor_codes: vec!["openai".to_owned()],
            force: false,
            catalog_root: None,
            catalog_version: Some("2026.05.08.1".to_owned()),
            request_id: "req-sync-source-dry-run-after-success".to_owned(),
            requested_at: "2026-05-07T13:00:00Z".to_owned(),
        })
        .await
        .unwrap();

    let after = sqlx::query(
        r#"
        SELECT CAST(last_observed_at AS TEXT) AS last_observed_at,
               CAST(last_success_at AS TEXT) AS last_success_at,
               catalog_version,
               source_hash,
               metadata
        FROM ai_model_catalog_source
        WHERE source_code = 'sdkwork_models'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();

    assert_eq!(
        before.get::<String, _>("last_success_at"),
        after.get::<String, _>("last_success_at"),
        "dry_run must not clear or rewrite the last successful catalog import timestamp"
    );
    assert_eq!(
        before.get::<String, _>("catalog_version"),
        after.get::<String, _>("catalog_version"),
        "dry_run must not replace the catalog version that was last committed"
    );
    assert_eq!(
        before.get::<String, _>("source_hash"),
        after.get::<String, _>("source_hash"),
        "dry_run must not replace the source hash that identifies the last committed import"
    );
    assert_eq!(
        before.get::<String, _>("metadata"),
        after.get::<String, _>("metadata"),
        "dry_run must not replace source metadata for the last committed import"
    );
    assert_ne!(
        before.get::<String, _>("last_observed_at"),
        after.get::<String, _>("last_observed_at"),
        "dry_run should still update last_observed_at so operators can see the source was checked"
    );

    let dry_run_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM ai_model_catalog_sync_run
        WHERE uuid = 'catalog-sync-sync-source-dry-run-after-success'
          AND run_status = 1
          AND json_extract(metadata, '$.dryRun') = 1
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        1, dry_run_count,
        "dry_run must remain visible as an independent catalog sync run"
    );
}

#[tokio::test]
async fn sqlite_admin_model_store_sync_catalog_source_hash_is_content_stable() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    prepare_admin_model_schema(&pool).await;
    let store = SqliteAdminModelStore::new(pool.clone());
    let subject = AdminModelSubject {
        tenant_id: 0,
        organization_id: 0,
        operator_id: 99,
        operator_type: 1,
    };

    let first = store
        .sync_catalog(SyncAdminModelCatalogCommand {
            subject,
            snapshot_uuid: "sync-stable-hash-first".to_owned(),
            audit_log_uuid: "audit-sync-stable-hash-first".to_owned(),
            source: "sdkwork_models".to_owned(),
            mode: "official_refresh".to_owned(),
            vendor_codes: vec!["openai".to_owned()],
            force: true,
            catalog_root: None,
            catalog_version: Some("2026.05.08.1".to_owned()),
            request_id: "req-sync-stable-hash-first".to_owned(),
            requested_at: "2026-05-07T12:00:00Z".to_owned(),
        })
        .await
        .unwrap();

    let second = store
        .sync_catalog(SyncAdminModelCatalogCommand {
            subject,
            snapshot_uuid: "sync-stable-hash-second".to_owned(),
            audit_log_uuid: "audit-sync-stable-hash-second".to_owned(),
            source: "sdkwork_models".to_owned(),
            mode: "official_refresh".to_owned(),
            vendor_codes: vec!["openai".to_owned()],
            force: true,
            catalog_root: None,
            catalog_version: Some("2026.05.08.1".to_owned()),
            request_id: "req-sync-stable-hash-second".to_owned(),
            requested_at: "2026-05-07T12:30:00Z".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!(
        first.source_hash, second.source_hash,
        "same source, catalog version, and vendor scope must produce a stable source_hash independent of request entropy"
    );

    let run_hashes = sqlx::query(
        r#"
        SELECT first_run.source_hash AS first_hash,
               second_run.source_hash AS second_hash
        FROM ai_model_catalog_sync_run first_run
        CROSS JOIN ai_model_catalog_sync_run second_run
        WHERE first_run.uuid = 'catalog-sync-sync-stable-hash-first'
          AND second_run.uuid = 'catalog-sync-sync-stable-hash-second'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        run_hashes.get::<String, _>("first_hash"),
        run_hashes.get::<String, _>("second_hash"),
        "persisted sync run source_hash must be content-stable as well"
    );
}

async fn create_admin_model_tables(pool: &sqlx::SqlitePool) {
    sqlx::query(
        r#"
        CREATE TABLE ai_model (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            status INTEGER NOT NULL DEFAULT 1,
            deleted_at TEXT,
            catalog_key TEXT,
            model TEXT,
            display_name TEXT,
            vendor_id INTEGER,
            vendor_code TEXT,
            region_code TEXT,
            capability INTEGER,
            modalities TEXT,
            input_modalities TEXT,
            output_modalities TEXT,
            description TEXT,
            api_format TEXT,
            capability_intro TEXT,
            limitations TEXT,
            supported_languages TEXT,
            use_cases TEXT,
            training_data_cutoff TEXT,
            context_tokens INTEGER,
            max_output_tokens INTEGER,
            supports_streaming INTEGER,
            supports_tools INTEGER,
            supports_json_schema INTEGER,
            rank_score REAL,
            release_stage INTEGER,
            shelf_state INTEGER,
            routing_state INTEGER,
            replacement_model TEXT
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        CREATE TABLE ai_model_pricing (
            id INTEGER PRIMARY KEY,
            model_id INTEGER,
            region_code TEXT,
            price_side INTEGER,
            billing_meter_code TEXT,
            unit_price TEXT,
            priority INTEGER,
            status INTEGER,
            deleted_at TEXT
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        CREATE TABLE ai_model_rank_snapshot (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            status INTEGER NOT NULL DEFAULT 1,
            snapshot_date TEXT,
            snapshot_period INTEGER,
            rank_scope TEXT,
            model TEXT,
            vendor_code TEXT,
            rank_no INTEGER,
            request_count INTEGER,
            base_volume INTEGER
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
}

async fn prepare_admin_model_schema(pool: &sqlx::SqlitePool) {
    DatabaseInstaller::for_sqlite(pool.clone())
        .with_options(DatabaseInstallOptions::new("test", "commercial").unwrap())
        .unwrap()
        .refresh_catalog(CatalogRefreshOptions {
            source: "admin_model_store_schema_fixture".to_owned(),
            mode: "dry_run".to_owned(),
            vendor_codes: vec!["alibaba".to_owned()],
            force: false,
            catalog_root: None,
            catalog_version: Some("2026.05.08.1".to_owned()),
        })
        .await
        .unwrap();
}

async fn install_admin_model_catalog(pool: &sqlx::SqlitePool, vendor_codes: &[&str]) {
    DatabaseInstaller::for_sqlite(pool.clone())
        .with_options(DatabaseInstallOptions::new("test", "commercial").unwrap())
        .unwrap()
        .refresh_catalog(CatalogRefreshOptions {
            source: "admin_model_store_catalog_fixture".to_owned(),
            mode: "vendor_refresh".to_owned(),
            vendor_codes: vendor_codes
                .iter()
                .map(|vendor_code| (*vendor_code).to_owned())
                .collect(),
            force: true,
            catalog_root: None,
            catalog_version: Some("2026.05.08.1".to_owned()),
        })
        .await
        .unwrap();
}

fn decimal_value(value: &str) -> f64 {
    value
        .parse::<f64>()
        .unwrap_or_else(|error| panic!("invalid decimal value {value}: {error}"))
}
