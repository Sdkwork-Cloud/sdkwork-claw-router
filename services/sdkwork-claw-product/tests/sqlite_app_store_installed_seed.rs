use sdkwork_claw_product::infrastructure::sql::installer::{
    DatabaseInstallOptions, DatabaseInstaller,
};
use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAppStoreReadStore;
use sdkwork_claw_product::ports::{AppStoreReadStore, AppStoreSubject};
use sqlx::sqlite::SqlitePoolOptions;

#[tokio::test]
async fn sqlite_app_store_reads_installed_seed_media_and_release_artifacts_by_app_key() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    DatabaseInstaller::for_sqlite(pool.clone())
        .with_options(DatabaseInstallOptions::new("test", "commercial").unwrap())
        .unwrap()
        .ensure_installed()
        .await
        .unwrap();

    let store = SqliteAppStoreReadStore::new(pool);
    let item = store
        .load_app_by_id("sdkwork-claw-router".to_owned(), Some(owner_subject()))
        .await
        .unwrap()
        .expect("installed AppCenter seed must be readable by stable appKey");

    assert_eq!("SDKWork Claw Router", item.name);
    assert_eq!("sdkwork-skills-app", item.developer);
    assert_eq!("HTML", item.category);
    assert_eq!(
        "https://cdn.sdkwork.com/apps/sdkwork-claw-router/assets/icon-1024.png",
        item.image
    );
    assert!(
        item.screenshots
            .iter()
            .any(|url| url == "https://cdn.sdkwork.com/apps/sdkwork-claw-router/media/desktop_windows-screenshot.png"),
        "installed AppCenter read model must consume studio_catalog_asset screenshots"
    );
    assert!(
        item.releases.iter().any(|release| release.download_url
            == "https://cdn.sdkwork.com/apps/sdkwork-claw-router/STABLE/0.1.0/web.zip"
            && release.platform_type == "Web"
            && release.os == "PC Web"
            && release.version == "0.1.0"),
        "installed AppCenter read model must consume studio_catalog_artifact release packages with normalized web platform labels"
    );
}

fn owner_subject() -> AppStoreSubject {
    AppStoreSubject {
        tenant_id: 20_001,
        organization_id: 0,
        user_id: 0,
    }
}
