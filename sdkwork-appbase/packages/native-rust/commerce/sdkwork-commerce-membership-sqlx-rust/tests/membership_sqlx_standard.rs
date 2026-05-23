use axum::body::Body;
use axum::http::{Method, Request, StatusCode};
use sdkwork_commerce_membership_sqlx::{
    admin_membership_router_with_sqlite_pool, app_membership_router_with_sqlite_pool,
    upsert_sqlite_commerce_experience_seed, AppMembershipSubject, SqliteCommerceMembershipStore,
    SubmitMembershipPurchaseCommand,
};
use sdkwork_commerce_storage_sqlx::commerce_initial_migration_sql;
use serde_json::Value;
use sqlx::{Executor, SqlitePool};
use tower::ServiceExt;

#[test]
fn appbase_membership_sqlx_exposes_standard_store_names_without_legacy_membership_aliases() {
    let sqlite_source = include_str!("../src/sqlite.rs");
    let postgres_source = include_str!("../src/postgres.rs");
    let lib_source = include_str!("../src/lib.rs");
    let router_source = include_str!("../src/router.rs");
    let admin_router_source = include_str!("../src/admin_router.rs");
    let shared_source = include_str!("../src/shared.rs");
    let seed_source = include_str!("../src/seed.rs");
    let types_source = include_str!("../src/types.rs");
    let manifest_source = include_str!("../Cargo.toml");

    assert!(sqlite_source.contains("pub struct SqliteCommerceMembershipStore"));
    assert!(postgres_source.contains("pub struct PostgresCommerceMembershipStore"));
    assert!(lib_source.contains("pub use postgres::PostgresCommerceMembershipStore"));
    assert!(lib_source.contains("pub use sqlite::SqliteCommerceMembershipStore"));
    assert!(!lib_source.contains("pub use types::{\n    AppVip"));
    assert!(!lib_source.contains("SubmitVipPurchaseCommand as SubmitMembershipPurchaseCommand"));

    let banned_fragments = [
        "AppVip",
        "AdminVip",
        "SubmitVip",
        "CreateAdminVip",
        "UpdateAdminVip",
        "DeleteAdminVip",
        "ListAdminVip",
        "SqliteAppVipStore",
        "PostgresAppVipStore",
        "ParsedVip",
        "StoredVip",
        "VipPaymentMethod",
        "vip_",
        "vip-",
        "VIP",
        "vip_membership",
        "seed-product-vip-membership",
        concat!("level", "_id"),
        concat!("AS group", "_id"),
        concat!("\"group", "_id\""),
        concat!("ensure_admin_", "level", "_exists"),
        concat!("level", "_id_for_storage"),
        concat!("build_", "group", "_from_packages"),
        concat!("fn group", "_id_for("),
        concat!("list_", "level", "s"),
        concat!("create_", "level"),
        concat!("update_", "level"),
        concat!("delete_", "level"),
        concat!("map_admin_", "level"),
        concat!("load_", "level", "_for_package"),
        concat!("level", "_name"),
    ];

    for (name, source) in [
        ("lib.rs", lib_source),
        ("types.rs", types_source),
        ("router.rs", router_source),
        ("admin_router.rs", admin_router_source),
        ("shared.rs", shared_source),
        ("sqlite.rs", sqlite_source),
        ("postgres.rs", postgres_source),
        ("seed.rs", seed_source),
        ("Cargo.toml", manifest_source),
    ] {
        for banned in banned_fragments {
            assert!(
                !source.contains(banned),
                "{name} must not contain legacy membership fragment {banned}"
            );
        }
    }

    let test_source = include_str!("membership_sqlx_standard.rs");
    for banned in [
        concat!("created_", "level", "_id"),
        concat!("delete_", "level"),
        concat!("create_", "level"),
        concat!("update_", "level"),
    ] {
        assert!(
            !test_source.contains(banned),
            "membership SQLx tests must not keep legacy test variable fragment {banned}"
        );
    }
}

#[test]
fn appbase_membership_routers_follow_api_spec_without_compat_query_aliases() {
    let app_router_source = include_str!("../src/router.rs");
    let backend_router_source = include_str!("../src/admin_router.rs");

    for source in [app_router_source, backend_router_source] {
        assert!(!source.contains("/vip"));
        assert!(!source.contains("/billing"));
        assert!(!source.contains("alias = \"pageSize\""));
        assert!(!source.contains("alias = \"userId\""));
        assert!(!source.contains("alias = \"membershipId\""));
    }

    assert!(app_router_source.contains("/app/v3/api/memberships/package_groups/{packageGroupId}"));
    assert!(app_router_source.contains("/app/v3/api/memberships/packages/{packageId}"));
    assert!(backend_router_source.contains("/backend/v3/api/memberships/plans/{planId}"));
    assert!(
        backend_router_source.contains("/backend/v3/api/memberships/members/{membershipId}/status")
    );
}

#[tokio::test]
async fn sqlite_seed_initializes_membership_catalog_for_app_display() {
    let pool = seeded_pool().await;
    let store = SqliteCommerceMembershipStore::new(pool.clone());

    let groups = store
        .load_package_groups(None, false)
        .await
        .expect("load package groups");
    assert_eq!(4, groups.len());
    assert_eq!(
        vec![1, 2, 3, 4],
        groups.iter().map(|group| group.id).collect::<Vec<_>>()
    );
    assert_eq!(4, groups[0].packages.len());
    assert_eq!(
        vec![301, 302, 303, 304],
        groups[0]
            .packages
            .iter()
            .map(|package| package.id)
            .collect::<Vec<_>>()
    );

    let packages = store
        .load_packages(None, None)
        .await
        .expect("load packages");
    assert_eq!(16, packages.len());
    let monthly_pro = packages
        .iter()
        .find(|package| package.id == 303)
        .expect("monthly pro package exists");
    assert_eq!("69.90", monthly_pro.price);
    assert_eq!(30, monthly_pro.duration_days);
    assert!(monthly_pro.recommended);

    let manifest = sdkwork_commerce_bootstrap::commerce_experience_seed_manifest();
    assert!(!manifest.payload_json.contains("region_code"));
    assert!(!manifest.payload_json.contains("base_url_template"));
    assert!(!manifest.payload_json.contains("base_url_override"));

    assert!(
        sdkwork_commerce_membership_sqlx::sqlite_commerce_experience_seed_complete(&pool)
            .await
            .expect("seed complete check")
    );
}

#[tokio::test]
async fn sqlite_membership_router_serves_packages_and_groups_without_404() {
    let pool = seeded_pool().await;
    let router = app_membership_router_with_sqlite_pool(pool);

    for uri in [
        "/app/v3/api/memberships/package_groups",
        "/app/v3/api/memberships/package_groups/1",
        "/app/v3/api/memberships/package_groups/1/packages",
        "/app/v3/api/memberships/packages",
        "/app/v3/api/memberships/packages/303",
        "/app/v3/api/memberships/privileges/speed_ups",
    ] {
        let response = router
            .clone()
            .oneshot(
                Request::builder()
                    .method(Method::GET)
                    .uri(uri)
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_ne!(
            StatusCode::NOT_FOUND,
            response.status(),
            "{uri} returned 404"
        );
        assert_ne!(
            StatusCode::NOT_IMPLEMENTED,
            response.status(),
            "{uri} returned not implemented"
        );
    }
}

#[tokio::test]
async fn sqlite_purchase_creates_order_payment_membership_and_entitlements() {
    let pool = seeded_pool().await;
    let store = SqliteCommerceMembershipStore::new(pool.clone());

    let outcome = store
        .submit_purchase(SubmitMembershipPurchaseCommand {
            subject: AppMembershipSubject {
                tenant_id: 10,
                organization_id: 20,
                user_id: 30,
            },
            package_id: 303,
            payment_method: "wechat".to_owned(),
            order_uuid: "order-membership-303".to_owned(),
            order_item_uuid: "order-item-membership-303".to_owned(),
            payment_uuid: "payment-membership-303".to_owned(),
            attempt_uuid: "payment-attempt-membership-303".to_owned(),
            membership_uuid: "membership-303".to_owned(),
            order_no: "MEMBERSHIP20260519001".to_owned(),
            out_trade_no: "MEMBERSHIPTRADE20260519001".to_owned(),
            requested_at: "2026-05-19 00:00:00".to_owned(),
            expire_at: "2026-05-19 00:30:00".to_owned(),
            action: "purchase".to_owned(),
        })
        .await
        .expect("submit membership purchase");

    assert_eq!("MEMBERSHIP20260519001", outcome.order_id);
    assert_eq!(true, outcome.success);
    assert_eq!("MEMBERSHIP20260519001", outcome.request_no);
    assert_eq!("payment-membership-303", outcome.payment_id);
    assert_eq!(
        "https://im.sdkwork.com/pay?type=qrcode&paymentId=payment-membership-303&orderId=MEMBERSHIP20260519001",
        outcome.qr_code_payload
    );
    assert_eq!(None, outcome.qr_code_image_url);
    assert_eq!(303, outcome.package_id);
    assert_eq!("69.90", outcome.amount);
    assert_eq!(30, outcome.duration_days);
    assert_eq!(2, outcome.target_plan_rank);

    let membership: (String, String, String, String, String, String) = sqlx::query_as(
        r#"
        SELECT tenant_id, organization_id, owner_user_id, plan_id, status, expires_at
        FROM commerce_membership
        WHERE id = 'membership-303'
        "#,
    )
    .fetch_one(&pool)
    .await
    .expect("membership row");
    assert_eq!("10", membership.0);
    assert_eq!("20", membership.1);
    assert_eq!("30", membership.2);
    assert_eq!("seed-membership-plan-pro", membership.3);
    assert_eq!("pending_activation", membership.4);
    assert_eq!("2026-06-18 00:00:00", membership.5);

    let order_status: String =
        sqlx::query_scalar("SELECT status FROM commerce_order WHERE id = 'order-membership-303'")
            .fetch_one(&pool)
            .await
            .expect("order row");
    assert_eq!("pending_payment", order_status);

    let payment_status: String = sqlx::query_scalar(
        "SELECT status FROM commerce_payment_intent WHERE id = 'payment-membership-303'",
    )
    .fetch_one(&pool)
    .await
    .expect("payment row");
    assert_eq!("pending", payment_status);

    let entitlement_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM commerce_membership_entitlement WHERE membership_id = 'membership-303'",
    )
    .fetch_one(&pool)
    .await
    .expect("entitlement count");
    assert!(entitlement_count > 0);
}

#[tokio::test]
async fn sqlite_speed_up_consumes_priority_entitlement_once() {
    let pool = seeded_pool().await;
    seed_speed_up_membership(&pool).await;
    let router = app_membership_router_with_sqlite_pool(pool.clone());

    let response = router
        .clone()
        .oneshot(signed_request(
            "POST",
            "/app/v3/api/memberships/privileges/speed_ups",
            "{}",
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, response.status());
    let payload = json_payload(response).await;
    assert_eq!("2000", payload["code"]);

    let used_quantity: i64 = sqlx::query_scalar(
        "SELECT used_quantity FROM commerce_membership_entitlement WHERE id = 'membership-entitlement-speed-up'",
    )
    .fetch_one(&pool)
    .await
    .expect("speed up entitlement usage");
    assert_eq!(1, used_quantity);

    let usage_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM commerce_membership_entitlement_usage WHERE entitlement_id = 'membership-entitlement-speed-up'",
    )
    .fetch_one(&pool)
    .await
    .expect("speed up usage record count");
    assert_eq!(1, usage_count);

    let exhausted_response = router
        .oneshot(signed_request(
            "POST",
            "/app/v3/api/memberships/privileges/speed_ups",
            "{}",
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::CONFLICT, exhausted_response.status());
}

#[tokio::test]
async fn sqlite_membership_points_history_honors_pagination_query() {
    let pool = seeded_pool().await;
    seed_points_history(&pool).await;
    let router = app_membership_router_with_sqlite_pool(pool);

    let payload = request_json(
        router,
        signed_request(
            "GET",
            "/app/v3/api/memberships/points/history?page=2&page_size=1",
            "",
        ),
    )
    .await;

    assert_eq!("2000", payload["code"]);
    let items = payload["data"].as_array().expect("history item array");
    assert_eq!(1, items.len());
    assert_eq!("ledger-2", items[0]["id"]);
}

#[tokio::test]
async fn sqlite_admin_membership_router_manages_standard_membership_catalog() {
    let pool = seeded_pool().await;
    seed_membership_for_admin(&pool).await;
    let router = admin_membership_router_with_sqlite_pool(pool.clone());

    let plans = request_json(
        router.clone(),
        signed_request("GET", "/backend/v3/api/memberships/plans", ""),
    )
    .await;
    assert_eq!("2000", plans["code"]);
    assert_eq!("seed-membership-plan-pro", plans["data"]["items"][2]["id"]);
    assert_eq!("pro", plans["data"]["items"][2]["code"]);
    assert_eq!(2, plans["data"]["items"][2]["rank"]);

    let create_plan = request_json(
        router.clone(),
        signed_request(
            "POST",
            "/backend/v3/api/memberships/plans",
            r#"{"code":"team","name":"Team member","rank":40,"status":"active"}"#,
        ),
    )
    .await;
    assert_eq!("Team member", create_plan["data"]["item"]["name"]);
    assert_eq!("team", create_plan["data"]["item"]["code"]);
    assert_eq!(40, create_plan["data"]["item"]["rank"]);
    let created_plan_id = create_plan["data"]["item"]["id"]
        .as_str()
        .expect("created plan id")
        .to_owned();

    let update_plan = request_json(
        router.clone(),
        signed_request(
            "PUT",
            &format!("/backend/v3/api/memberships/plans/{created_plan_id}"),
            r#"{"code":"team","name":"Team workspace","rank":41,"status":"inactive"}"#,
        ),
    )
    .await;
    assert_eq!("Team workspace", update_plan["data"]["item"]["name"]);
    assert_eq!(41, update_plan["data"]["item"]["rank"]);
    assert_eq!("inactive", update_plan["data"]["item"]["status"]);
    assert_eq!(
        0,
        update_plan["data"]["item"]["benefits"]
            .as_array()
            .expect("updated plan benefits array")
            .len()
    );

    let update_plan_benefits = request_json(
        router.clone(),
        signed_request(
            "PUT",
            &format!("/backend/v3/api/memberships/plans/{created_plan_id}"),
            r#"{"code":"team","name":"Team workspace","rank":41,"status":"active","benefits":[{"id":9001,"name":"Priority render","benefitKey":"priority_render","type":"quota","description":"Priority rendering quota","icon":"sparkles","usageLimit":100,"usedCount":0,"claimed":false}]}"#,
        ),
    )
    .await;
    assert_eq!(
        "Priority render",
        update_plan_benefits["data"]["item"]["benefits"][0]["name"]
    );
    assert_eq!(
        "priority_render",
        update_plan_benefits["data"]["item"]["benefits"][0]["benefitKey"]
    );
    assert_eq!(
        100,
        update_plan_benefits["data"]["item"]["benefits"][0]["usageLimit"]
    );

    let update_seed_plan = request_json(
        router.clone(),
        signed_request(
            "PUT",
            "/backend/v3/api/memberships/plans/seed-membership-plan-pro",
            r#"{"code":"pro","name":"Pro member","rank":20,"status":"active"}"#,
        ),
    )
    .await;
    assert_eq!("Pro member", update_seed_plan["data"]["item"]["name"]);
    assert_eq!(20, update_seed_plan["data"]["item"]["rank"]);

    let team_app_benefits = request_json(
        app_membership_router_with_sqlite_pool(pool.clone()),
        signed_request("GET", "/app/v3/api/memberships/benefits?plan_id=41", ""),
    )
    .await;
    assert_eq!("2000", team_app_benefits["code"]);
    assert_eq!(
        "priority_render",
        team_app_benefits["data"][0]["benefitKey"]
    );

    let rewrite_plan_benefits = request_json(
        router.clone(),
        signed_request(
            "PUT",
            &format!("/backend/v3/api/memberships/plans/{created_plan_id}"),
            r#"{"code":"team","name":"Team workspace","rank":41,"status":"active","benefits":[{"id":9001,"name":"Priority queue","benefitKey":"priority_queue","type":"quota","description":"Updated priority queue quota","icon":"sparkles","usageLimit":80,"usedCount":0,"claimed":false}]}"#,
        ),
    )
    .await;
    assert_eq!(
        "Priority queue",
        rewrite_plan_benefits["data"]["item"]["benefits"][0]["name"]
    );
    assert_eq!(
        "priority_queue",
        rewrite_plan_benefits["data"]["item"]["benefits"][0]["benefitKey"]
    );

    let clear_plan_benefits = request_json(
        router.clone(),
        signed_request(
            "PUT",
            &format!("/backend/v3/api/memberships/plans/{created_plan_id}"),
            r#"{"code":"team","name":"Team workspace","rank":41,"status":"active","benefits":[]}"#,
        ),
    )
    .await;
    assert_eq!(
        0,
        clear_plan_benefits["data"]["item"]["benefits"]
            .as_array()
            .expect("cleared plan benefits array")
            .len()
    );

    let cleared_team_app_benefits = request_json(
        app_membership_router_with_sqlite_pool(pool.clone()),
        signed_request("GET", "/app/v3/api/memberships/benefits?plan_id=41", ""),
    )
    .await;
    assert_eq!("2000", cleared_team_app_benefits["code"]);
    assert_eq!(
        0,
        cleared_team_app_benefits["data"]
            .as_array()
            .expect("cleared app benefits array")
            .len()
    );

    let create_group = request_json(
        router.clone(),
        signed_request(
            "POST",
            "/backend/v3/api/memberships/package_groups",
            r#"{"code":"membership-team","name":"Team bundles","description":"Team workspace membership plans","billingCycle":"team","durationDays":30,"sortWeight":15,"status":"active"}"#,
        ),
    )
    .await;
    assert_eq!("Team bundles", create_group["data"]["item"]["name"]);
    assert_eq!("membership-team", create_group["data"]["item"]["code"]);
    assert_eq!(30, create_group["data"]["item"]["durationDays"]);
    let created_group_id = create_group["data"]["item"]["id"]
        .as_str()
        .expect("created package group id")
        .to_owned();

    let update_group = request_json(
        router.clone(),
        signed_request(
            "PUT",
            &format!("/backend/v3/api/memberships/package_groups/{created_group_id}"),
            r#"{"code":"membership-team","name":"Team bundles updated","description":"Updated team workspace membership plans","billingCycle":"team","durationDays":60,"sortWeight":16,"status":"inactive"}"#,
        ),
    )
    .await;
    assert_eq!("Team bundles updated", update_group["data"]["item"]["name"]);
    assert_eq!(60, update_group["data"]["item"]["durationDays"]);
    assert_eq!(16, update_group["data"]["item"]["sortWeight"]);
    assert_eq!("inactive", update_group["data"]["item"]["status"]);

    let create_package = request_json(
        router.clone(),
        signed_request(
            "POST",
            "/backend/v3/api/memberships/packages",
            r#"{"code":"membership-month-pro-plus","packageGroupId":"seed-membership-package-group-year","planId":"seed-membership-plan-pro","name":"Pro Plus Monthly","priceAmount":"89.90","currencyCode":"CNY","durationDays":30,"status":"active"}"#,
        ),
    )
    .await;
    assert_eq!("Pro Plus Monthly", create_package["data"]["item"]["name"]);
    assert_eq!(
        "membership-month-pro-plus",
        create_package["data"]["item"]["code"]
    );
    assert_eq!(
        "seed-membership-package-group-year",
        create_package["data"]["item"]["packageGroupId"]
    );
    let package_id = create_package["data"]["item"]["id"]
        .as_str()
        .unwrap()
        .to_owned();
    let package_group_id_after_create: String = sqlx::query_scalar(
        "SELECT package_group_id FROM commerce_membership_package WHERE id = ?1",
    )
    .bind(&package_id)
    .fetch_one(&pool)
    .await
    .expect("created package group id");
    assert_eq!(
        "seed-membership-package-group-year",
        package_group_id_after_create
    );

    let update_package = request_json(
        router.clone(),
        signed_request(
            "PUT",
            &format!("/backend/v3/api/memberships/packages/{package_id}"),
            r#"{"code":"membership-month-pro-plus","packageGroupId":"seed-membership-package-group-week","planId":"seed-membership-plan-pro","name":"Pro Plus Monthly Updated","priceAmount":"99.90","currencyCode":"CNY","durationDays":60,"status":"inactive"}"#,
        ),
    )
    .await;
    assert_eq!(
        "Pro Plus Monthly Updated",
        update_package["data"]["item"]["name"]
    );
    assert_eq!("inactive", update_package["data"]["item"]["status"]);
    assert_eq!(
        "seed-membership-package-group-week",
        update_package["data"]["item"]["packageGroupId"]
    );
    let package_group_id_after_update: String = sqlx::query_scalar(
        "SELECT package_group_id FROM commerce_membership_package WHERE id = ?1",
    )
    .bind(&package_id)
    .fetch_one(&pool)
    .await
    .expect("updated package group id");
    assert_eq!(
        "seed-membership-package-group-week",
        package_group_id_after_update
    );

    let packages = request_json(
        router.clone(),
        signed_request(
            "GET",
            "/backend/v3/api/memberships/packages?status=inactive",
            "",
        ),
    )
    .await;
    assert!(packages["data"]["items"]
        .as_array()
        .unwrap()
        .iter()
        .any(|item| item["id"] == package_id));
    assert!(packages["data"]["items"]
        .as_array()
        .unwrap()
        .iter()
        .any(|item| item["packageGroupId"] == "seed-membership-package-group-week"));

    let package_groups = request_json(
        router.clone(),
        signed_request(
            "GET",
            "/backend/v3/api/memberships/package_groups?status=active",
            "",
        ),
    )
    .await;
    assert_eq!("2000", package_groups["code"]);
    assert!(package_groups["data"]["items"]
        .as_array()
        .unwrap()
        .iter()
        .any(|item| {
            item["id"] == "seed-membership-package-group-week"
                && item["code"] == "membership-week"
                && item["durationDays"] == 7
        }));

    let memberships = request_json(
        router.clone(),
        signed_request("GET", "/backend/v3/api/memberships/members?user_id=30", ""),
    )
    .await;
    assert_eq!("membership-admin", memberships["data"]["items"][0]["id"]);
    assert_eq!("30", memberships["data"]["items"][0]["ownerUserId"]);
    assert_eq!("pro", memberships["data"]["items"][0]["planCode"]);
    assert_eq!(Value::Null, memberships["data"]["items"][0]["levelCode"]);

    let membership_status = request_json(
        router.clone(),
        signed_request(
            "PATCH",
            "/backend/v3/api/memberships/members/membership-admin/status",
            r#"{"status":"suspended"}"#,
        ),
    )
    .await;
    assert_eq!("suspended", membership_status["data"]["item"]["status"]);

    let entitlements = request_json(
        router.clone(),
        signed_request(
            "GET",
            "/backend/v3/api/memberships/entitlements?membership_id=membership-admin",
            "",
        ),
    )
    .await;
    assert_eq!(
        "membership-entitlement-admin",
        entitlements["data"]["items"][0]["id"]
    );
    assert_eq!("frontier_models", entitlements["data"]["items"][0]["code"]);
    assert_eq!("10", entitlements["data"]["items"][0]["quota"]);

    let delete_package = request_json(
        router.clone(),
        signed_request(
            "DELETE",
            &format!("/backend/v3/api/memberships/packages/{package_id}"),
            "",
        ),
    )
    .await;
    assert_eq!(true, delete_package["data"]["deleted"]);
    assert_eq!(package_id, delete_package["data"]["packageId"]);

    let delete_plan = request_json(
        router.clone(),
        signed_request(
            "DELETE",
            &format!("/backend/v3/api/memberships/plans/{created_plan_id}"),
            "",
        ),
    )
    .await;
    assert_eq!(true, delete_plan["data"]["deleted"]);
    assert_eq!(created_plan_id, delete_plan["data"]["planId"]);

    let delete_group = request_json(
        router,
        signed_request(
            "DELETE",
            &format!("/backend/v3/api/memberships/package_groups/{created_group_id}"),
            "",
        ),
    )
    .await;
    assert_eq!(true, delete_group["data"]["deleted"]);
    assert_eq!(created_group_id, delete_group["data"]["packageGroupId"]);
}

async fn seeded_pool() -> SqlitePool {
    let pool = SqlitePool::connect("sqlite::memory:").await.unwrap();
    install_schema(&pool).await;
    upsert_sqlite_commerce_experience_seed(&pool)
        .await
        .expect("seed commerce experience");
    pool
}

async fn seed_membership_for_admin(pool: &SqlitePool) {
    sqlx::query(
        r#"
        INSERT INTO commerce_membership
            (id, tenant_id, organization_id, membership_no, owner_user_id, plan_id, source_order_id, source_payment_intent_id, status, starts_at, expires_at, grace_until, request_no, idempotency_key, created_at, updated_at)
        VALUES
            ('membership-admin', '10', '20', 'membership-admin', '30', 'seed-membership-plan-pro', 'membership-order-admin', 'membership-payment-admin', 'active', '2026-05-01 00:00:00', '2026-06-01 00:00:00', NULL, 'membership-admin', 'membership-admin', '2026-05-01 00:00:00', '2026-05-01 00:00:00')
        "#,
    )
    .execute(pool)
    .await
    .expect("insert admin membership fixture");
    sqlx::query(
        r#"
        INSERT INTO commerce_membership_entitlement
            (id, tenant_id, organization_id, membership_id, entitlement_code, plan_id, name, quota_amount, granted_quantity, used_quantity, expires_at, status, created_at, updated_at)
        VALUES
            ('membership-entitlement-admin', '10', '20', 'membership-admin', 'frontier_models', 'seed-membership-plan-pro', 'Frontier models', '10', 10, 0, '2026-06-01 00:00:00', 'active', '2026-05-01 00:00:00', '2026-05-01 00:00:00')
        "#,
    )
    .execute(pool)
    .await
    .expect("insert admin entitlement fixture");
}

async fn seed_speed_up_membership(pool: &SqlitePool) {
    sqlx::query(
        r#"
        INSERT INTO commerce_membership
            (id, tenant_id, organization_id, membership_no, owner_user_id, plan_id, source_order_id, source_payment_intent_id, status, starts_at, expires_at, grace_until, request_no, idempotency_key, created_at, updated_at)
        VALUES
            ('membership-speed-up', '10', '20', 'membership-speed-up', '30', 'seed-membership-plan-pro', 'membership-order-speed-up', 'membership-payment-speed-up', 'active', '2026-05-01 00:00:00', '2026-06-01 00:00:00', NULL, 'membership-speed-up', 'membership-speed-up', '2026-05-01 00:00:00', '2026-05-01 00:00:00')
        "#,
    )
    .execute(pool)
    .await
    .expect("insert speed up membership fixture");
    sqlx::query(
        r#"
        INSERT INTO commerce_membership_entitlement
            (id, tenant_id, organization_id, membership_id, entitlement_code, plan_id, name, quota_amount, granted_quantity, used_quantity, expires_at, status, created_at, updated_at)
        VALUES
            ('membership-entitlement-speed-up', '10', '20', 'membership-speed-up', 'high_priority', 'seed-membership-plan-pro', 'High priority', '1', 1, 0, '2026-06-01 00:00:00', 'active', '2026-05-01 00:00:00', '2026-05-01 00:00:00')
        "#,
    )
    .execute(pool)
    .await
    .expect("insert speed up entitlement fixture");
}

async fn seed_points_history(pool: &SqlitePool) {
    sqlx::query(
        r#"
        INSERT INTO commerce_account
            (id, tenant_id, organization_id, owner_user_id, asset_type, currency_code, available_amount, frozen_amount, version, status, created_at, updated_at)
        VALUES
            ('membership-points-account-history', '10', '20', '30', 'points', 'PTS', '60', '0', 1, 'active', '2026-05-01 00:00:00', '2026-05-01 00:00:00')
        "#,
    )
    .execute(pool)
    .await
    .expect("insert points account fixture");

    for (id, amount, balance_after, created_at) in [
        ("ledger-1", "10", "60", "2026-05-03 00:00:00"),
        ("ledger-2", "20", "50", "2026-05-02 00:00:00"),
        ("ledger-3", "30", "30", "2026-05-01 00:00:00"),
    ] {
        sqlx::query(
            r#"
            INSERT INTO commerce_account_ledger_entry
                (id, tenant_id, organization_id, account_id, owner_user_id, asset_type, direction, amount, balance_after, business_type, transaction_no, request_no, idempotency_key, source_type, source_id, remark, created_at)
            VALUES
                (?1, '10', '20', 'membership-points-account-history', '30', 'points', 'credit', ?2, ?3, 'membership_points', ?1, ?1, ?1, 'membership', ?1, ?1, ?4)
            "#,
        )
        .bind(id)
        .bind(amount)
        .bind(balance_after)
        .bind(created_at)
        .execute(pool)
        .await
        .expect("insert points history fixture");
    }
}

fn signed_request(method: &str, uri: &str, body: &str) -> Request<Body> {
    Request::builder()
        .method(method)
        .uri(uri)
        .header("content-type", "application/json")
        .header("x-sdkwork-tenant-id", "10")
        .header("x-sdkwork-organization-id", "20")
        .header("x-sdkwork-user-id", "30")
        .header("X-Request-Id", "request-appbase-admin-membership-test")
        .body(Body::from(body.to_owned()))
        .unwrap()
}

async fn request_json(router: axum::Router, request: Request<Body>) -> Value {
    let response = router.oneshot(request).await.unwrap();
    assert_eq!(StatusCode::OK, response.status());
    json_payload(response).await
}

async fn json_payload(response: axum::response::Response) -> Value {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

async fn install_schema(pool: &SqlitePool) {
    for statement in sqlite_schema_statements() {
        pool.execute(statement.as_str())
            .await
            .unwrap_or_else(|error| panic!("failed schema statement: {statement}\n{error}"));
    }
}

fn sqlite_schema_statements() -> Vec<String> {
    commerce_initial_migration_sql()
        .split(';')
        .map(str::trim)
        .filter(|statement| !statement.is_empty())
        .map(|statement| {
            statement
                .replace("TIMESTAMPTZ", "TEXT")
                .replace("JSONB", "TEXT")
                .replace("BIGINT", "INTEGER")
                .replace("BOOLEAN", "INTEGER")
                .replace("VARCHAR", "TEXT")
        })
        .collect()
}
