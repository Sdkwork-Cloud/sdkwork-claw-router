use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAppStoreReadStore;
use sdkwork_claw_product::ports::{AppStoreQuery, AppStoreReadStore, AppStoreSubject};
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::SqlitePool;

#[tokio::test]
async fn sqlite_app_store_reads_public_catalog_without_trusted_subject() {
    let pool = sqlite_pool().await;
    create_app_store_tables(&pool).await;
    seed_app_store(&pool).await;
    insert_app(
        &pool,
        20_001_001,
        20_001,
        0,
        0,
        "Public Seed App",
        "Product-level public catalog app",
        "1.0.0",
        "https://cdn.example.test/apps/public-seed.png",
        r#"{"standard":{"appKey":"public-seed-app"},"portal":{"developer":"SDKWork","marketStatus":"PUBLISHED"}}"#,
        1,
        "APP_HTML",
        "{}",
        "https://cdn.example.test/apps/public-seed.zip",
        "https://public-seed.example.test",
        "2026-06-05 09:30:00",
    )
    .await;

    let store = SqliteAppStoreReadStore::new(pool);
    let items = store
        .load_apps(AppStoreQuery::default(), None)
        .await
        .unwrap();

    assert!(
        items.iter().any(|item| item.id == "public-seed-app"),
        "anonymous users must be able to browse the product-level public App Store catalog"
    );
}

#[tokio::test]
async fn sqlite_app_store_loads_active_apps_for_subject_with_public_contract_fields() {
    let pool = sqlite_pool().await;
    create_app_store_tables(&pool).await;
    seed_app_store(&pool).await;

    let store = SqliteAppStoreReadStore::new(pool);
    let items = store
        .load_apps(AppStoreQuery::default(), Some(owner_subject()))
        .await
        .unwrap();

    assert_eq!(1, items.len());
    let app = &items[0];
    assert_eq!("claw-desktop", app.id);
    assert_eq!("Claw Desktop", app.name);
    assert_eq!("Portal Labs", app.developer);
    assert_eq!("HTML", app.category);
    assert_eq!("https://cdn.example.test/apps/claw.png", app.image);
    assert_eq!(4.8, app.rating);
    assert_eq!("Commercial desktop router console", app.description);
    assert_eq!("2", app.downloads);
    assert_eq!(
        vec![
            "https://cdn.example.test/apps/claw-screen-1.png".to_owned(),
            "https://cdn.example.test/apps/claw-screen-2.png".to_owned(),
        ],
        app.screenshots
    );
    assert_eq!(
        vec!["Unified routing".to_owned(), "Model fallback".to_owned()],
        app.features
    );
    assert_eq!(1, app.releases.len());
    assert_eq!("9001", app.releases[0].id);
    assert_eq!("Desktop", app.releases[0].platform_type);
    assert_eq!("Windows", app.releases[0].os);
    assert_eq!("2.1.0", app.releases[0].version);
    assert_eq!("42 MB", app.releases[0].size);
    assert_eq!("2026-05-01", app.releases[0].release_date);
    assert_eq!(
        "https://cdn.example.test/apps/claw-2.1.0.exe",
        app.releases[0].download_url
    );
    assert_eq!(
        Some("Hardened routing policies"),
        app.releases[0].whats_new.as_deref()
    );

    let payload = serde_json::to_string(&items).unwrap();
    for internal_value in [
        "internal-payload-hash",
        "internal-ip-hash",
        "internal-user-agent-hash",
        "raw-internal-metadata",
    ] {
        assert!(
            !payload.contains(internal_value),
            "app store DTO must not expose internal field value: {internal_value}"
        );
    }
}

#[tokio::test]
async fn sqlite_app_store_uses_release_note_highlights_when_portal_features_are_absent() {
    let pool = sqlite_pool().await;
    create_app_store_tables(&pool).await;
    insert_app(
        &pool,
        1700,
        10,
        20,
        30,
        "Release Highlight App",
        "Feature fallback app",
        "1.0.0",
        "https://cdn.example.test/apps/highlights.png",
        r#"{"standard":{"appKey":"release-highlight-app"},"portal":{"marketStatus":"PUBLISHED"}}"#,
        1,
        "APP_HTML",
        "{}",
        "https://cdn.example.test/apps/highlights.zip",
        "https://highlights.example.test",
        "2026-06-04 09:30:00",
    )
    .await;
    sqlx::query(
        r#"
        UPDATE plus_app
        SET release_notes = '[{"version":"1.0.0","highlights":["Seeded metadata","Package matrix","Release governance"]}]'
        WHERE id = 1700
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let store = SqliteAppStoreReadStore::new(pool);
    let detail = store
        .load_app_by_id("release-highlight-app".to_owned(), Some(owner_subject()))
        .await
        .unwrap()
        .expect("release highlight app must be visible");

    assert_eq!(
        vec![
            "Seeded metadata".to_owned(),
            "Package matrix".to_owned(),
            "Release governance".to_owned(),
        ],
        detail.features
    );
}

#[tokio::test]
async fn sqlite_app_store_does_not_fallback_disabled_install_packages_to_public_releases() {
    let pool = sqlite_pool().await;
    create_app_store_tables(&pool).await;
    insert_app(
        &pool,
        1750,
        10,
        20,
        30,
        "Disabled Package App",
        "Published app with blocked commercial package metadata",
        "0.1.0",
        "https://cdn.example.test/apps/disabled-package.png",
        r#"{"standard":{"appKey":"disabled-package-app"},"portal":{"marketStatus":"PUBLISHED"}}"#,
        1,
        "APP_HTML",
        "{}",
        "",
        "https://disabled-package.example.test",
        "2026-06-04 10:30:00",
    )
    .await;
    sqlx::query(
        r#"
        UPDATE plus_app
        SET install_config = '{"packages":[{"id":"blocked-msi","enabled":false,"version":"0.1.0","platform":"DESKTOP_WINDOWS","packageFormat":"MSI","url":"https://cdn.example.test/apps/blocked.msi"}]}'
        WHERE id = 1750
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let store = SqliteAppStoreReadStore::new(pool);
    let detail = store
        .load_app_by_id("disabled-package-app".to_owned(), Some(owner_subject()))
        .await
        .unwrap()
        .expect("published app must remain visible");

    assert!(
        detail
            .releases
            .iter()
            .all(|release| release.download_url != "https://cdn.example.test/apps/blocked.msi"),
        "public App Store fallback releases must ignore disabled install packages"
    );
}

#[tokio::test]
async fn sqlite_app_store_falls_back_to_tenant_public_apps_for_authenticated_organization_subject()
{
    let pool = sqlite_pool().await;
    create_app_store_tables(&pool).await;
    seed_app_store(&pool).await;
    insert_app(
        &pool,
        1500,
        10,
        0,
        0,
        "Public Tenant App",
        "Public catalog app for every organization in the tenant",
        "1.0.0",
        "https://cdn.example.test/apps/public.png",
        r#"{"standard":{"appKey":"public-tenant-app"},"portal":{"developer":"Public Labs","features":["Tenant public"],"marketStatus":"PUBLISHED"}}"#,
        1,
        "APP_HTML",
        r#"{"name":"Public Skill Developer"}"#,
        "https://cdn.example.test/apps/public.zip",
        "https://public.example.test",
        "2026-06-02 09:30:00",
    )
    .await;
    insert_app(
        &pool,
        1600,
        99,
        0,
        0,
        "Other Tenant Public App",
        "Must not cross tenant boundary",
        "1.0.0",
        "https://cdn.example.test/apps/other-public.png",
        r#"{"standard":{"appKey":"other-tenant-public-app"},"portal":{"developer":"Other Labs","marketStatus":"PUBLISHED"}}"#,
        1,
        "APP_HTML",
        r#"{"name":"Other Public Skill Developer"}"#,
        "https://cdn.example.test/apps/other-public.zip",
        "https://other-public.example.test",
        "2026-06-03 09:30:00",
    )
    .await;
    insert_asset_with_scope(
        &pool,
        1501,
        10,
        0,
        1500,
        "screenshot",
        "https://cdn.example.test/apps/public-screen.png",
        1,
    )
    .await;
    insert_artifact_with_scope(
        &pool,
        1502,
        10,
        0,
        1500,
        "web",
        "windows",
        "1.0.0",
        "https://cdn.example.test/apps/public.zip",
        1_048_576,
        "Tenant public release",
    )
    .await;

    let store = SqliteAppStoreReadStore::new(pool);
    let items = store
        .load_apps(
            AppStoreQuery {
                keyword: Some("public tenant".to_owned()),
                ..AppStoreQuery::default()
            },
            Some(owner_subject()),
        )
        .await
        .unwrap();

    assert_eq!(
        vec!["public-tenant-app".to_owned()],
        items.iter().map(|item| item.id.clone()).collect::<Vec<_>>(),
        "authenticated org users must see tenant public App Store apps without crossing tenant boundary"
    );
    let public_app = &items[0];
    assert_eq!(
        vec!["https://cdn.example.test/apps/public-screen.png".to_owned()],
        public_app.screenshots
    );
    assert!(public_app
        .releases
        .iter()
        .any(|release| release.download_url == "https://cdn.example.test/apps/public.zip"));

    let detail = store
        .load_app_by_id("public-tenant-app".to_owned(), Some(owner_subject()))
        .await
        .unwrap()
        .expect("tenant public app must be readable by stable appKey");
    assert_eq!("public-tenant-app", detail.id);
}

#[tokio::test]
async fn sqlite_app_store_includes_product_public_apps_for_authenticated_subjects() {
    let pool = sqlite_pool().await;
    create_app_store_tables(&pool).await;
    seed_app_store(&pool).await;
    insert_app(
        &pool,
        20_001_002,
        20_001,
        0,
        0,
        "SDKWork Router App",
        "Product-level App Center entry",
        "1.0.0",
        "https://cdn.example.test/apps/sdkwork-router.png",
        r#"{"standard":{"appKey":"sdkwork-router-app"},"portal":{"developer":"SDKWork","marketStatus":"PUBLISHED"}}"#,
        1,
        "APP_HTML",
        "{}",
        "https://cdn.example.test/apps/sdkwork-router.zip",
        "https://sdkwork-router.example.test",
        "2026-06-05 10:30:00",
    )
    .await;

    let store = SqliteAppStoreReadStore::new(pool);
    let items = store
        .load_apps(
            AppStoreQuery {
                keyword: Some("sdkwork router".to_owned()),
                ..AppStoreQuery::default()
            },
            Some(owner_subject()),
        )
        .await
        .unwrap();

    assert_eq!(
        vec!["sdkwork-router-app".to_owned()],
        items.into_iter().map(|item| item.id).collect::<Vec<_>>(),
        "logged-in users must still see product-level App Center seed data"
    );
}

#[tokio::test]
async fn sqlite_app_store_only_exposes_published_market_apps() {
    let pool = sqlite_pool().await;
    create_app_store_tables(&pool).await;
    seed_app_store(&pool).await;

    let store = SqliteAppStoreReadStore::new(pool);
    let items = store
        .load_apps(AppStoreQuery::default(), Some(owner_subject()))
        .await
        .unwrap();

    assert_eq!(
        vec!["claw-desktop".to_owned()],
        items.into_iter().map(|item| item.id).collect::<Vec<_>>()
    );
    assert!(
        store
            .load_app_by_id("draft-app".to_owned(), Some(owner_subject()))
            .await
            .unwrap()
            .is_none(),
        "draft PlusApp rows must stay hidden from public App Store reads"
    );
}

#[tokio::test]
async fn sqlite_app_store_applies_status_and_updated_time_window_filters() {
    let pool = sqlite_pool().await;
    create_app_store_tables(&pool).await;
    seed_app_store(&pool).await;

    let store = SqliteAppStoreReadStore::new(pool);
    let active_items = store
        .load_apps(
            AppStoreQuery {
                status: Some("ACTIVE".to_owned()),
                start_time: Some("2026-05-02 00:00:00".to_owned()),
                end_time: Some("2026-05-03 00:00:00".to_owned()),
                ..AppStoreQuery::default()
            },
            Some(owner_subject()),
        )
        .await
        .unwrap();
    assert_eq!(
        vec!["claw-desktop".to_owned()],
        active_items
            .into_iter()
            .map(|item| item.id)
            .collect::<Vec<_>>()
    );

    let inactive_items = store
        .load_apps(
            AppStoreQuery {
                status: Some("INACTIVE".to_owned()),
                ..AppStoreQuery::default()
            },
            Some(owner_subject()),
        )
        .await
        .unwrap();
    assert!(
        inactive_items.is_empty(),
        "public App Store status filters must not bypass active and published marketplace gates"
    );

    for unsupported_status in [
        "PUBLISHED",
        "OFFLINE",
        "ENABLED",
        "DISABLED",
        "1",
        "0",
        "active",
    ] {
        let error = store
            .load_apps(
                AppStoreQuery {
                    status: Some(unsupported_status.to_owned()),
                    ..AppStoreQuery::default()
                },
                Some(owner_subject()),
            )
            .await
            .unwrap_err();
        assert!(
            error
                .to_string()
                .contains("status must be ACTIVE or INACTIVE"),
            "store-level app status filter must reject non-standard runtime status `{unsupported_status}`"
        );
    }

    let outside_window_items = store
        .load_apps(
            AppStoreQuery {
                start_time: Some("2026-05-03 00:00:00".to_owned()),
                end_time: Some("2026-05-04 00:00:00".to_owned()),
                ..AppStoreQuery::default()
            },
            Some(owner_subject()),
        )
        .await
        .unwrap();
    assert!(outside_window_items.is_empty());
}

#[tokio::test]
async fn sqlite_app_store_filters_keyword_and_loads_detail_and_categories() {
    let pool = sqlite_pool().await;
    create_app_store_tables(&pool).await;
    seed_app_store(&pool).await;

    let store = SqliteAppStoreReadStore::new(pool);
    let query = AppStoreQuery {
        keyword: Some("fallback".to_owned()),
        page_no: Some(1),
        page_size: Some(10),
        ..AppStoreQuery::default()
    };
    let items = store.load_apps(query, Some(owner_subject())).await.unwrap();

    assert_eq!(1, items.len());
    assert_eq!("claw-desktop", items[0].id);

    let detail = store
        .load_app_by_id("101".to_owned(), Some(owner_subject()))
        .await
        .unwrap()
        .unwrap();
    assert_eq!("Claw Desktop", detail.name);

    let detail_by_app_key = store
        .load_app_by_id("claw-desktop".to_owned(), Some(owner_subject()))
        .await
        .unwrap()
        .unwrap();
    assert_eq!("claw-desktop", detail_by_app_key.id);
    assert_eq!("Claw Desktop", detail_by_app_key.name);

    let missing = store
        .load_app_by_id("does-not-exist".to_owned(), Some(owner_subject()))
        .await
        .unwrap();
    assert!(missing.is_none());

    let categories = store.load_categories(Some(owner_subject())).await.unwrap();
    assert_eq!(vec!["HTML".to_owned()], categories);
}

#[tokio::test]
async fn sqlite_app_store_loads_categories_from_all_public_apps_without_catalog_page_limit() {
    let pool = sqlite_pool().await;
    create_app_store_tables(&pool).await;
    seed_app_store(&pool).await;
    for index in 0..101 {
        insert_app(
            &pool,
            200 + index,
            10,
            20,
            30,
            &format!("HTML Catalog App {index}"),
            "High volume category",
            "1.0.0",
            "https://cdn.example.test/apps/html.png",
            r#"{"portal":{"marketStatus":"PUBLISHED"}}"#,
            1,
            "APP_HTML",
            "{}",
            "https://cdn.example.test/apps/html.zip",
            "https://html.example.test",
            "2026-06-01 09:30:00",
        )
        .await;
    }
    insert_app(
        &pool,
        400,
        10,
        20,
        30,
        "React Catalog App",
        "Category outside the first catalog page",
        "1.0.0",
        "https://cdn.example.test/apps/react.png",
        r#"{"portal":{"marketStatus":"PUBLISHED"}}"#,
        1,
        "APP_REACT",
        "{}",
        "https://cdn.example.test/apps/react.zip",
        "https://react.example.test",
        "2026-04-01 09:30:00",
    )
    .await;

    let store = SqliteAppStoreReadStore::new(pool);
    let categories = store.load_categories(Some(owner_subject())).await.unwrap();

    assert_eq!(
        vec!["HTML".to_owned(), "REACT".to_owned()],
        categories,
        "categories endpoint must scan the complete public app set, not only the first catalog page"
    );
}

#[tokio::test]
async fn sqlite_app_store_applies_keyword_filter_before_catalog_pagination() {
    let pool = sqlite_pool().await;
    create_app_store_tables(&pool).await;
    seed_app_store(&pool).await;
    for index in 0..105 {
        insert_app(
            &pool,
            500 + index,
            10,
            20,
            30,
            &format!("Catalog Filler App {index}"),
            "High volume public app that must not match the requested keyword",
            "1.0.0",
            "https://cdn.example.test/apps/filler.png",
            r#"{"portal":{"marketStatus":"PUBLISHED"}}"#,
            1,
            "APP_HTML",
            "{}",
            "https://cdn.example.test/apps/filler.zip",
            "https://filler.example.test",
            "2026-06-01 09:30:00",
        )
        .await;
    }
    insert_app(
        &pool,
        800,
        10,
        20,
        30,
        "Needle Desktop App",
        "Only this older app should match the search term",
        "1.0.0",
        "https://cdn.example.test/apps/needle.png",
        r#"{"portal":{"marketStatus":"PUBLISHED"}}"#,
        1,
        "APP_HTML",
        "{}",
        "https://cdn.example.test/apps/needle.zip",
        "https://needle.example.test",
        "2026-04-01 09:30:00",
    )
    .await;

    let store = SqliteAppStoreReadStore::new(pool);
    let items = store
        .load_apps(
            AppStoreQuery {
                keyword: Some("needle".to_owned()),
                page_no: Some(1),
                page_size: Some(10),
                ..AppStoreQuery::default()
            },
            Some(owner_subject()),
        )
        .await
        .unwrap();

    assert_eq!(
        vec!["800".to_owned()],
        items.into_iter().map(|item| item.id).collect::<Vec<_>>(),
        "keyword filtering must happen before SQL pagination so older matches are not dropped"
    );
}

#[tokio::test]
async fn sqlite_app_store_paginates_after_dto_keyword_semantics_not_raw_sql_prefilter() {
    let pool = sqlite_pool().await;
    create_app_store_tables(&pool).await;
    seed_app_store(&pool).await;
    for index in 0..105 {
        insert_app(
            &pool,
            900 + index,
            10,
            20,
            30,
            &format!("Raw Type Filler {index}"),
            "This public app should be removed by DTO keyword semantics",
            "1.0.0",
            "https://cdn.example.test/apps/raw-type-filler.png",
            r#"{"portal":{"marketStatus":"PUBLISHED"}}"#,
            1,
            "APP_HTML",
            "{}",
            "https://cdn.example.test/apps/raw-type-filler.zip",
            "https://raw-type-filler.example.test",
            "2026-07-01 09:30:00",
        )
        .await;
    }
    insert_app(
        &pool,
        1200,
        10,
        20,
        30,
        "Precise App_HTML Match",
        "Only the normalized DTO fields should decide keyword matches before pagination",
        "1.0.0",
        "https://cdn.example.test/apps/precise-match.png",
        r#"{"portal":{"marketStatus":"PUBLISHED"}}"#,
        1,
        "APP_HTML",
        "{}",
        "https://cdn.example.test/apps/precise-match.zip",
        "https://precise-match.example.test",
        "2026-04-01 09:30:00",
    )
    .await;

    let store = SqliteAppStoreReadStore::new(pool);
    let items = store
        .load_apps(
            AppStoreQuery {
                keyword: Some("app_html".to_owned()),
                page_no: Some(1),
                page_size: Some(10),
                ..AppStoreQuery::default()
            },
            Some(owner_subject()),
        )
        .await
        .unwrap();

    assert_eq!(
        vec!["1200".to_owned()],
        items.into_iter().map(|item| item.id).collect::<Vec<_>>(),
        "catalog pagination must run after DTO keyword semantics, not after a wider raw SQL prefilter"
    );
}

async fn sqlite_pool() -> SqlitePool {
    SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap()
}

fn owner_subject() -> AppStoreSubject {
    AppStoreSubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
    }
}

async fn create_app_store_tables(pool: &SqlitePool) {
    for statement in [
        r#"
        CREATE TABLE plus_app (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            created_at TEXT,
            updated_at TEXT,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            icon TEXT,
            resource_list TEXT,
            project_id INTEGER,
            description TEXT,
            version TEXT,
            icon_url TEXT,
            access_url TEXT,
            config TEXT,
            status INTEGER,
            app_type TEXT,
            platforms TEXT,
            install_platforms TEXT,
            install_skill TEXT,
            install_config TEXT,
            release_notes TEXT,
            package_name TEXT,
            bundle_id TEXT,
            store_url TEXT,
            download_url TEXT
        )
        "#,
        r#"
        CREATE TABLE studio_catalog_action (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            target_type INTEGER NOT NULL,
            target_id INTEGER NOT NULL,
            release_id INTEGER,
            action_type TEXT,
            rating_score REAL,
            created_at TEXT,
            payload_hash TEXT,
            client_ip_hash TEXT,
            user_agent_hash TEXT,
            metadata TEXT
        )
        "#,
        r#"
        CREATE TABLE studio_catalog_asset (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            target_type INTEGER NOT NULL,
            target_id INTEGER NOT NULL,
            artifact_id INTEGER,
            asset_type TEXT,
            asset_url TEXT,
            thumbnail_url TEXT,
            title TEXT,
            sort_order INTEGER,
            published_at TEXT,
            status INTEGER,
            deleted_at TEXT,
            metadata TEXT
        )
        "#,
        r#"
        CREATE TABLE studio_catalog_artifact (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            target_type INTEGER NOT NULL,
            target_id INTEGER NOT NULL,
            artifact_type TEXT,
            platform_type TEXT,
            os_name TEXT,
            version TEXT,
            artifact_ref TEXT,
            artifact_url TEXT,
            artifact_size_bytes INTEGER,
            runtime TEXT,
            frameworks TEXT,
            license_name TEXT,
            release_notes TEXT,
            published_at TEXT,
            status INTEGER,
            deleted_at TEXT,
            metadata TEXT
        )
        "#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_app_store(pool: &SqlitePool) {
    insert_app(
        pool,
        101,
        10,
        20,
        30,
        "Claw Desktop",
        "Commercial desktop router console",
        "2.1.0",
        "https://cdn.example.test/apps/claw.png",
        r#"{"standard":{"appKey":"claw-desktop"},"portal":{"developer":"Portal Labs","features":["Unified routing","Model fallback"],"marketStatus":"PUBLISHED"}}"#,
        1,
        "APP_HTML",
        r#"{"name":"Install Skill Developer"}"#,
        "",
        "https://app.example.test/claw",
        "2026-05-02 09:30:00",
    )
    .await;
    insert_app(
        pool,
        102,
        10,
        20,
        30,
        "Inactive App",
        "Must not be exposed",
        "1.0.0",
        "https://cdn.example.test/apps/inactive.png",
        "{}",
        0,
        "APP_WEB",
        "{}",
        "https://cdn.example.test/apps/inactive.zip",
        "https://inactive.example.test",
        "2026-05-03 09:30:00",
    )
    .await;
    insert_app(
        pool,
        104,
        10,
        20,
        30,
        "Draft App",
        "Must not be exposed before marketplace publication",
        "1.0.0",
        "https://cdn.example.test/apps/draft.png",
        r#"{"standard":{"appKey":"draft-app"},"portal":{"marketStatus":"DRAFT"}}"#,
        1,
        "APP_HTML",
        "{}",
        "https://cdn.example.test/apps/draft.zip",
        "https://draft.example.test",
        "2026-05-05 09:30:00",
    )
    .await;
    insert_app(
        pool,
        103,
        99,
        20,
        30,
        "Other Tenant",
        "Must not cross tenant boundary",
        "1.0.0",
        "https://cdn.example.test/apps/other.png",
        "{}",
        1,
        "APP_HTML",
        "{}",
        "https://cdn.example.test/apps/other.zip",
        "https://other.example.test",
        "2026-05-04 09:30:00",
    )
    .await;
    insert_asset(
        pool,
        501,
        101,
        "screenshot",
        "https://cdn.example.test/apps/claw-screen-1.png",
        1,
    )
    .await;
    insert_asset(
        pool,
        502,
        101,
        "screenshot",
        "https://cdn.example.test/apps/claw-screen-2.png",
        2,
    )
    .await;
    insert_artifact(pool).await;
    insert_action(pool, 101, "download", None).await;
    insert_action(pool, 101, "download", None).await;
    insert_action(pool, 101, "rating", Some(4.0)).await;
    insert_action(pool, 101, "rating", Some(5.0)).await;
    insert_action(pool, 101, "rating", Some(5.5)).await;
}

async fn insert_app(
    pool: &SqlitePool,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
    user_id: i64,
    name: &str,
    description: &str,
    version: &str,
    icon_url: &str,
    config: &str,
    status: i64,
    app_type: &str,
    install_skill: &str,
    download_url: &str,
    access_url: &str,
    updated_at: &str,
) {
    sqlx::query(
        r#"
        INSERT INTO plus_app (
            id, uuid, created_at, updated_at, tenant_id, organization_id, user_id,
            name, icon, resource_list, project_id, description, version, icon_url,
            access_url, config, status, app_type, platforms, install_platforms,
            install_skill, install_config, release_notes, package_name, bundle_id,
            store_url, download_url
        )
        VALUES (
            ?1, ?2, '2026-05-01 09:30:00', ?3, ?4, ?5, ?6,
            ?7, NULL, NULL, NULL, ?8, ?9, ?10,
            ?11, ?12, ?13, ?14, NULL, NULL,
            ?15, NULL, NULL, NULL, NULL,
            NULL, ?16
        )
        "#,
    )
    .bind(id)
    .bind(format!("uuid-{id}"))
    .bind(updated_at)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(user_id)
    .bind(name)
    .bind(description)
    .bind(version)
    .bind(icon_url)
    .bind(access_url)
    .bind(config)
    .bind(status)
    .bind(app_type)
    .bind(install_skill)
    .bind(download_url)
    .execute(pool)
    .await
    .unwrap();
}

async fn insert_asset(
    pool: &SqlitePool,
    id: i64,
    target_id: i64,
    asset_type: &str,
    asset_url: &str,
    sort_order: i64,
) {
    insert_asset_with_scope(
        pool, id, 10, 20, target_id, asset_type, asset_url, sort_order,
    )
    .await;
}

async fn insert_asset_with_scope(
    pool: &SqlitePool,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
    target_id: i64,
    asset_type: &str,
    asset_url: &str,
    sort_order: i64,
) {
    sqlx::query(
        r#"
        INSERT INTO studio_catalog_asset (
            id, tenant_id, organization_id, target_type, target_id, artifact_id,
            asset_type, asset_url, thumbnail_url, title, sort_order, published_at,
            status, deleted_at, metadata
        )
        VALUES (?1, ?2, ?3, 15, ?4, NULL, ?5, ?6, NULL, NULL, ?7, '2026-05-01 10:00:00', 1, NULL, 'raw-internal-metadata')
        "#,
    )
    .bind(id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(target_id)
    .bind(asset_type)
    .bind(asset_url)
    .bind(sort_order)
    .execute(pool)
    .await
    .unwrap();
}

async fn insert_artifact(pool: &SqlitePool) {
    insert_artifact_with_scope(
        pool,
        9001,
        10,
        20,
        101,
        "desktop",
        "windows",
        "2.1.0",
        "https://cdn.example.test/apps/claw-2.1.0.exe",
        44_040_192,
        "Hardened routing policies",
    )
    .await;
}

async fn insert_artifact_with_scope(
    pool: &SqlitePool,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
    target_id: i64,
    platform_type: &str,
    os_name: &str,
    version: &str,
    artifact_url: &str,
    artifact_size_bytes: i64,
    release_notes: &str,
) {
    sqlx::query(
        r#"
        INSERT INTO studio_catalog_artifact (
            id, tenant_id, organization_id, target_type, target_id, artifact_type,
            platform_type, os_name, version, artifact_ref, artifact_url,
            artifact_size_bytes, runtime, frameworks, license_name, release_notes,
            published_at, status, deleted_at, metadata
        )
        VALUES (
            ?1, ?2, ?3, 15, ?4, 'installer',
            ?5, ?6, ?7, 'artifact://internal/claw',
            ?8,
            ?9, NULL, NULL, NULL, ?10,
            '2026-05-01 08:00:00', 1, NULL, 'raw-internal-metadata'
        )
        "#,
    )
    .bind(id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(target_id)
    .bind(platform_type)
    .bind(os_name)
    .bind(version)
    .bind(artifact_url)
    .bind(artifact_size_bytes)
    .bind(release_notes)
    .execute(pool)
    .await
    .unwrap();
}

async fn insert_action(
    pool: &SqlitePool,
    target_id: i64,
    action_type: &str,
    rating_score: Option<f64>,
) {
    sqlx::query(
        r#"
        INSERT INTO studio_catalog_action (
            tenant_id, organization_id, user_id, target_type, target_id, release_id,
            action_type, rating_score, created_at, payload_hash, client_ip_hash,
            user_agent_hash, metadata
        )
        VALUES (
            10, 20, 30, 15, ?1, NULL,
            ?2, ?3, '2026-05-01 12:00:00', 'internal-payload-hash',
            'internal-ip-hash', 'internal-user-agent-hash', 'raw-internal-metadata'
        )
        "#,
    )
    .bind(target_id)
    .bind(action_type)
    .bind(rating_score)
    .execute(pool)
    .await
    .unwrap();
}
