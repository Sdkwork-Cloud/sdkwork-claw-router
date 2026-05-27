#![allow(dead_code)]

use sdkwork_claw_product::infrastructure::sql::installer::{
    CatalogRefreshOptions, DatabaseInstallOptions, DatabaseInstaller, CURRENT_SCHEMA_VERSION,
};
use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions};
use sqlx::{Row, SqlitePool};
use std::ffi::OsString;
use std::fs::{self, File, OpenOptions};
use std::io::ErrorKind;
use std::path::{Path, PathBuf};
use std::str::FromStr;
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};

const INSTALLED_SQLITE_TEMPLATE_REVISION: &str = "v2";
const REPAIR_SQLITE_TEMPLATE_REVISION: &str = "v1";
const SCHEMA_SQLITE_TEMPLATE_REVISION: &str = "v1";

static SQLITE_DB_COUNTER: AtomicU64 = AtomicU64::new(0);
static INSTALLED_SQLITE_TEMPLATE_LOCK: tokio::sync::Mutex<()> = tokio::sync::Mutex::const_new(());

struct TemplateFileLock {
    path: PathBuf,
    _file: File,
}

impl Drop for TemplateFileLock {
    fn drop(&mut self) {
        let _ = fs::remove_file(&self.path);
    }
}

pub async fn installed_sqlite_pool() -> SqlitePool {
    let template_path = sqlite_template_path("installed", INSTALLED_SQLITE_TEMPLATE_REVISION);
    ensure_sqlite_template(&template_path, SqliteTemplateKind::Installed).await;
    copy_sqlite_template_pool(&template_path, "installed").await
}

#[allow(dead_code)]
pub async fn repair_sqlite_pool() -> SqlitePool {
    let template_path = sqlite_template_path("repair", REPAIR_SQLITE_TEMPLATE_REVISION);
    if !sqlite_template_current(&template_path, SqliteTemplateKind::RepairBaseline).await {
        let installed_template_path =
            sqlite_template_path("installed", INSTALLED_SQLITE_TEMPLATE_REVISION);
        ensure_sqlite_template(&installed_template_path, SqliteTemplateKind::Installed).await;
    }
    ensure_sqlite_template(&template_path, SqliteTemplateKind::RepairBaseline).await;
    copy_sqlite_template_pool(&template_path, "repair").await
}

#[allow(dead_code)]
pub async fn schema_sqlite_pool() -> SqlitePool {
    let template_path = sqlite_template_path("schema", SCHEMA_SQLITE_TEMPLATE_REVISION);
    ensure_sqlite_template(&template_path, SqliteTemplateKind::SchemaOnly).await;
    copy_sqlite_template_pool(&template_path, "schema").await
}

async fn copy_sqlite_template_pool(template_path: &Path, label: &str) -> SqlitePool {
    prune_sqlite_test_databases(&template_path);
    let database_path = unique_sqlite_database_path(label);
    fs::copy(&template_path, &database_path).unwrap_or_else(|error| {
        panic!(
            "failed to copy {label} sqlite test template from {} to {}: {error}",
            template_path.display(),
            database_path.display()
        )
    });
    sqlite_file_pool(&database_path).await
}

#[allow(dead_code)]
pub async fn sqlite_memory_pool() -> SqlitePool {
    SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap()
}

pub fn test_database_install_options() -> DatabaseInstallOptions {
    DatabaseInstallOptions::new("test", "commercial").unwrap()
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum SqliteTemplateKind {
    Installed,
    RepairBaseline,
    SchemaOnly,
}

fn test_database_installer(pool: SqlitePool) -> DatabaseInstaller {
    DatabaseInstaller::for_sqlite(pool)
        .with_options(test_database_install_options())
        .unwrap()
}

async fn ensure_sqlite_template(template_path: &Path, kind: SqliteTemplateKind) {
    if sqlite_template_current(template_path, kind).await {
        return;
    }
    let _guard = INSTALLED_SQLITE_TEMPLATE_LOCK.lock().await;
    let _file_guard = acquire_template_file_lock(template_path).await;
    if sqlite_template_current(template_path, kind).await {
        return;
    }
    if let Some(parent) = template_path.parent() {
        fs::create_dir_all(parent).unwrap();
    }
    if template_path.exists() {
        fs::remove_file(template_path).unwrap();
    }

    match kind {
        SqliteTemplateKind::Installed => {
            let pool = sqlite_file_pool(template_path).await;
            test_database_installer(pool.clone())
                .ensure_installed()
                .await
                .unwrap();
            sqlx::query("VACUUM").execute(&pool).await.unwrap();
            pool.close().await;
        }
        SqliteTemplateKind::RepairBaseline => {
            let installed_template_path =
                sqlite_template_path("installed", INSTALLED_SQLITE_TEMPLATE_REVISION);
            fs::copy(&installed_template_path, template_path).unwrap_or_else(|error| {
                panic!(
                    "failed to derive repair sqlite test template from {} to {}: {error}",
                    installed_template_path.display(),
                    template_path.display()
                )
            });
            let pool = sqlite_file_pool(template_path).await;
            retain_core_skill_seed_rows(&pool).await;
            sqlx::query("VACUUM").execute(&pool).await.unwrap();
            pool.close().await;
        }
        SqliteTemplateKind::SchemaOnly => {
            let pool = sqlite_file_pool(template_path).await;
            test_database_installer(pool.clone())
                .refresh_catalog(CatalogRefreshOptions {
                    source: "schema_test_template".to_owned(),
                    mode: "dry_run".to_owned(),
                    vendor_codes: vec!["openai".to_owned()],
                    force: false,
                    catalog_root: None,
                    catalog_version: Some("2026.05.08.1".to_owned()),
                })
                .await
                .unwrap();
            sqlx::query("VACUUM").execute(&pool).await.unwrap();
            pool.close().await;
        }
    }
}

async fn acquire_template_file_lock(template_path: &Path) -> TemplateFileLock {
    let lock_path = template_lock_path(template_path);
    if let Some(parent) = lock_path.parent() {
        fs::create_dir_all(parent).unwrap();
    }
    let started_at = Instant::now();
    loop {
        match OpenOptions::new()
            .write(true)
            .create_new(true)
            .open(&lock_path)
        {
            Ok(file) => {
                return TemplateFileLock {
                    path: lock_path,
                    _file: file,
                };
            }
            Err(error) if error.kind() == ErrorKind::AlreadyExists => {
                if started_at.elapsed() > Duration::from_secs(120) {
                    panic!(
                        "timed out waiting for installed sqlite template lock {}",
                        lock_path.display()
                    );
                }
                tokio::time::sleep(Duration::from_millis(100)).await;
            }
            Err(error) => {
                panic!(
                    "failed to acquire installed sqlite template lock {}: {error}",
                    lock_path.display()
                );
            }
        }
    }
}

fn template_lock_path(template_path: &Path) -> PathBuf {
    let mut file_name = template_path
        .file_name()
        .map(OsString::from)
        .unwrap_or_else(|| OsString::from("installed-sqlite-template"));
    file_name.push(".lock");
    template_path.with_file_name(file_name)
}

async fn sqlite_template_current(template_path: &Path, kind: SqliteTemplateKind) -> bool {
    if !template_path.exists() {
        return false;
    }
    let Ok(pool) = sqlite_existing_file_pool(template_path).await else {
        return false;
    };
    let current = match kind {
        SqliteTemplateKind::Installed => installed_sqlite_template_state_current(&pool).await,
        SqliteTemplateKind::RepairBaseline => {
            installed_sqlite_template_state_current(&pool).await
                && repair_sqlite_template_state_current(&pool).await
        }
        SqliteTemplateKind::SchemaOnly => schema_sqlite_template_state_current(&pool).await,
    } && sqlite_template_objects_current(&pool).await;
    pool.close().await;
    current
}

async fn installed_sqlite_template_state_current(pool: &SqlitePool) -> bool {
    let expected_catalog_version = match test_database_installer(pool.clone()).catalog_version() {
        Ok(value) => value,
        Err(_) => return false,
    };
    let row = match sqlx::query(
        r#"
        SELECT schema_version, catalog_version, environment, seed_profile, status
        FROM system_installation_state
        WHERE id = 1
        "#,
    )
    .fetch_optional(pool)
    .await
    {
        Ok(Some(row)) => row,
        _ => return false,
    };
    row.get::<String, _>("schema_version") == CURRENT_SCHEMA_VERSION
        && row.get::<String, _>("catalog_version") == expected_catalog_version
        && row.get::<String, _>("environment") == "test"
        && row.get::<String, _>("seed_profile") == "commercial"
        && row.get::<String, _>("status") == "installed"
}

async fn repair_sqlite_template_state_current(pool: &SqlitePool) -> bool {
    let skill_count: i64 = match sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM plus_agent_skill
        WHERE tenant_id = 0
          AND organization_id = 0
        "#,
    )
    .fetch_one(pool)
    .await
    {
        Ok(count) => count,
        Err(_) => return false,
    };
    let asset_count: i64 = match sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM studio_catalog_asset
        WHERE tenant_id = 0
          AND organization_id = 0
          AND metadata ->> 'itemType' = 'skill_asset'
        "#,
    )
    .fetch_one(pool)
    .await
    {
        Ok(count) => count,
        Err(_) => return false,
    };
    let artifact_count: i64 = match sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM studio_catalog_artifact
        WHERE tenant_id = 0
          AND organization_id = 0
          AND metadata ->> 'itemType' = 'skill_artifact'
        "#,
    )
    .fetch_one(pool)
    .await
    {
        Ok(count) => count,
        Err(_) => return false,
    };
    skill_count == 3 && asset_count == 3 && artifact_count == 3
}

async fn schema_sqlite_template_state_current(pool: &SqlitePool) -> bool {
    let row = match sqlx::query(
        r#"
        SELECT schema_version, environment, seed_profile, status
        FROM system_installation_state
        WHERE id = 1
        "#,
    )
    .fetch_optional(pool)
    .await
    {
        Ok(Some(row)) => row,
        _ => return false,
    };
    row.get::<String, _>("schema_version") == CURRENT_SCHEMA_VERSION
        && row.get::<String, _>("environment") == "test"
        && row.get::<String, _>("seed_profile") == "commercial"
        && row.get::<String, _>("status") == "installing"
}

async fn sqlite_template_objects_current(pool: &SqlitePool) -> bool {
    let required_schema_objects = [
        ("table", "system_installation_state"),
        ("table", "iam_api_key_group_channel"),
        ("table", "iam_verification_scene_policy"),
        ("table", "messaging_template"),
        ("table", "plus_app"),
        ("table", "plus_agent_skill"),
        ("table", "content_course"),
        ("table", "plus_feeds"),
        ("index", "idx_studio_catalog_asset_seed_source"),
        ("index", "idx_studio_catalog_artifact_seed_source"),
        ("index", "idx_plus_agent_skill_package_seed_scope"),
        ("index", "idx_plus_agent_skill_seed_scope"),
        ("index", "idx_plus_agent_skill_official_seed"),
    ];
    for (object_type, name) in required_schema_objects {
        let exists: i64 = match sqlx::query_scalar(
            "SELECT COUNT(1) FROM sqlite_master WHERE type = ? AND name = ?",
        )
        .bind(object_type)
        .bind(name)
        .fetch_one(pool)
        .await
        {
            Ok(exists) => exists,
            Err(_) => return false,
        };
        if exists != 1 {
            return false;
        }
    }
    true
}

fn prune_sqlite_test_databases(template_path: &Path) {
    let Some(parent) = template_path.parent() else {
        return;
    };
    let Ok(entries) = fs::read_dir(parent) else {
        return;
    };
    let current_process_id = std::process::id().to_string();
    let current_template_label = sqlite_template_label(template_path);
    for entry in entries.flatten() {
        let path = entry.path();
        if path == template_path || path.extension().and_then(|value| value.to_str()) != Some("db")
        {
            continue;
        }
        let Some(file_name) = path.file_name().and_then(|value| value.to_str()) else {
            continue;
        };
        if !file_name.starts_with("sdkwork-claw-product-") {
            continue;
        }
        if file_name.ends_with(".template.db") {
            prune_stale_sqlite_template_database(&path, file_name, current_template_label);
            continue;
        }
        if file_name.contains(format!("-{current_process_id}-").as_str()) {
            continue;
        }
        let _ = fs::remove_file(path);
    }
}

fn prune_stale_sqlite_template_database(
    path: &Path,
    _file_name: &str,
    current_template_label: Option<&'static str>,
) {
    let Some(current_template_label) = current_template_label else {
        return;
    };
    if sqlite_template_label(path) != Some(current_template_label) {
        return;
    }
    if template_lock_path(path).exists() {
        return;
    }
    let _ = fs::remove_file(path);
}

fn sqlite_template_label(path: &Path) -> Option<&'static str> {
    let file_name = path.file_name()?.to_str()?;
    if file_name.starts_with("sdkwork-claw-product-installed-") {
        Some("installed")
    } else if file_name.starts_with("sdkwork-claw-product-repair-") {
        Some("repair")
    } else if file_name.starts_with("sdkwork-claw-product-schema-") {
        Some("schema")
    } else {
        None
    }
}

async fn retain_core_skill_seed_rows(pool: &SqlitePool) {
    sqlx::query(
        r#"
        DELETE FROM studio_catalog_asset
        WHERE tenant_id = 0
          AND organization_id = 0
          AND metadata ->> 'itemType' = 'skill_asset'
          AND target_id NOT IN (8101, 8102, 8103)
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        DELETE FROM studio_catalog_artifact
        WHERE tenant_id = 0
          AND organization_id = 0
          AND metadata ->> 'itemType' = 'skill_artifact'
          AND target_id NOT IN (8101, 8102, 8103)
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        DELETE FROM plus_agent_skill
        WHERE tenant_id = 0
          AND organization_id = 0
          AND id NOT IN (8101, 8102, 8103)
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
}

fn sqlite_template_path(label: &str, revision: &str) -> PathBuf {
    let mut path = sqlite_test_database_dir();
    path.push(format!(
        "sdkwork-claw-product-{label}-{CURRENT_SCHEMA_VERSION}-{revision}.template.db"
    ));
    path
}

fn unique_sqlite_database_path(label: &str) -> PathBuf {
    let nanos = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_nanos();
    let counter = SQLITE_DB_COUNTER.fetch_add(1, Ordering::Relaxed);
    let process_id = std::process::id();
    let mut path = sqlite_test_database_dir();
    fs::create_dir_all(&path).unwrap();
    path.push(format!(
        "sdkwork-claw-product-{label}-{process_id}-{nanos}-{counter}.db"
    ));
    path
}

fn sqlite_test_database_dir() -> PathBuf {
    std::env::var_os("CARGO_TARGET_DIR")
        .map(PathBuf::from)
        .map(|path| path.join("sdkwork-claw-product-test-dbs"))
        .unwrap_or_else(|| PathBuf::from("target/test-dbs"))
}

async fn sqlite_file_pool(path: &Path) -> SqlitePool {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).unwrap();
    }
    let database_url = format!("sqlite://{}", path.to_string_lossy().replace('\\', "/"));
    let options = SqliteConnectOptions::from_str(database_url.as_str())
        .unwrap()
        .create_if_missing(true);
    SqlitePoolOptions::new()
        .max_connections(1)
        .connect_with(options)
        .await
        .unwrap()
}

async fn sqlite_existing_file_pool(path: &Path) -> Result<SqlitePool, sqlx::Error> {
    let database_url = format!("sqlite://{}", path.to_string_lossy().replace('\\', "/"));
    SqlitePoolOptions::new()
        .max_connections(1)
        .connect(database_url.as_str())
        .await
}
