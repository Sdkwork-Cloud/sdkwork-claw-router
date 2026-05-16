use std::collections::BTreeSet;
use std::error::Error;
use std::fmt::{Display, Formatter};
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

use sdkwork_models::{catalog_key, ModelCatalog};
use sha2::{Digest, Sha256};
use sqlx::{PgPool, Postgres, Row, Sqlite, SqlitePool, Transaction};

use crate::application::{PasswordHasher, Pbkdf2Sha256PasswordHasher};
use crate::infrastructure::sql::app_seed::{
    bundled_app_seed_payload, import_postgres_app_seed, import_sqlite_app_seed,
    postgres_app_seed_complete, sqlite_app_seed_complete,
};
use crate::infrastructure::sql::course_seed::{
    bundled_course_seed_payload, import_postgres_course_seed, import_sqlite_course_seed,
    postgres_course_seed_complete, sqlite_course_seed_complete,
};
use crate::infrastructure::sql::forum_seed::{
    bundled_forum_seed_payload, import_postgres_forum_seed, import_sqlite_forum_seed,
    postgres_forum_seed_complete, sqlite_forum_seed_complete,
};
use crate::infrastructure::sql::model_catalog_import::{
    catalog_scope_counts, catalog_scope_vendor_codes, catalog_with_selected_vendors,
    load_catalog_root_with_pin, DEFAULT_CATALOG_REFRESH_SOURCE,
};
use crate::infrastructure::sql::skills_seed::{
    bundled_skills_seed_payload, import_postgres_skills_seed, import_sqlite_skills_seed,
    postgres_skills_seed_complete, sqlite_skills_seed_complete,
};
use crate::ports::{AdminModelStore, AdminModelSubject, SyncAdminModelCatalogCommand};

const GENERATED_POSTGRES_SCHEMA: &str =
    include_str!("../../../../../generated/schema/postgres/schema.sql");
pub const CURRENT_SCHEMA_VERSION: &str = "2026.05.08.1";
pub const DEFAULT_SEED_PROFILE: &str = "commercial";
pub const DEFAULT_INSTALL_ENVIRONMENT: &str = "production";
pub const ENV_INSTALL_ENVIRONMENT: &str = "SDKWORK_CLAW_INSTALL_ENVIRONMENT";
pub const ENV_INSTALL_SEED_PROFILE: &str = "SDKWORK_CLAW_INSTALL_SEED_PROFILE";
pub const ENV_MODELS_CATALOG_ROOT: &str = "SDKWORK_MODELS_CATALOG_ROOT";
pub const ENV_BOOTSTRAP_ADMIN_ENABLED: &str = "SDKWORK_CLAW_BOOTSTRAP_ADMIN_ENABLED";
pub const ENV_BOOTSTRAP_ADMIN_USERNAME: &str = "SDKWORK_CLAW_BOOTSTRAP_ADMIN_USERNAME";
pub const ENV_BOOTSTRAP_ADMIN_DISPLAY_NAME: &str = "SDKWORK_CLAW_BOOTSTRAP_ADMIN_DISPLAY_NAME";
pub const ENV_BOOTSTRAP_ADMIN_EMAIL: &str = "SDKWORK_CLAW_BOOTSTRAP_ADMIN_EMAIL";
pub const ENV_BOOTSTRAP_ADMIN_PASSWORD: &str = "SDKWORK_CLAW_BOOTSTRAP_ADMIN_PASSWORD";
const DEFAULT_IAM_TENANT_ID: &str = "10";
const DEFAULT_IAM_TENANT_CODE: &str = "default";
const DEFAULT_IAM_TENANT_NAME: &str = "Default Tenant";
const DEFAULT_IAM_ORGANIZATION_ID: &str = "20";
const DEFAULT_IAM_ORGANIZATION_CODE: &str = "root";
const DEFAULT_IAM_ORGANIZATION_NAME: &str = "Root Organization";
const DEFAULT_IAM_ORGANIZATION_PATH: &str = "/20";
const DEFAULT_BOOTSTRAP_ADMIN_USERNAME: &str = "admin";
const DEFAULT_BOOTSTRAP_ADMIN_DISPLAY_NAME: &str = "Administrator";
const DEFAULT_BOOTSTRAP_ADMIN_EMAIL: &str = "admin@sdkwork.local";
const MIN_BOOTSTRAP_ADMIN_PASSWORD_LEN: usize = 12;
const MAX_BOOTSTRAP_ADMIN_PASSWORD_LEN: usize = 128;
const GENERATED_BOOTSTRAP_ADMIN_PASSWORD_LEN: usize = 32;
const BOOTSTRAP_ADMIN_PASSWORD_ALPHABET: &[u8] =
    b"ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%+-_=.";
const MAX_REFRESH_SOURCE_LEN: usize = 64;
const MAX_REFRESH_MODE_LEN: usize = 64;
const MAX_REFRESH_VENDOR_CODES: usize = 32;
const MAX_REFRESH_VENDOR_CODE_LEN: usize = 64;
const MAX_REFRESH_CATALOG_ROOT_LEN: usize = 512;
const MAX_REFRESH_CATALOG_VERSION_LEN: usize = 128;
static CATALOG_REFRESH_SEQUENCE: AtomicU64 = AtomicU64::new(1);

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DatabaseInstallOptions {
    pub environment: String,
    pub seed_profile: String,
    pub models_catalog_root: Option<String>,
}

impl DatabaseInstallOptions {
    pub fn commercial() -> Self {
        Self {
            environment: DEFAULT_INSTALL_ENVIRONMENT.to_owned(),
            seed_profile: DEFAULT_SEED_PROFILE.to_owned(),
            models_catalog_root: None,
        }
    }

    pub fn from_env() -> Result<Self, DatabaseInstallError> {
        let environment = std::env::var(ENV_INSTALL_ENVIRONMENT)
            .ok()
            .unwrap_or_else(|| DEFAULT_INSTALL_ENVIRONMENT.to_owned());
        let seed_profile = std::env::var(ENV_INSTALL_SEED_PROFILE)
            .ok()
            .unwrap_or_else(|| DEFAULT_SEED_PROFILE.to_owned());
        let models_catalog_root = std::env::var(ENV_MODELS_CATALOG_ROOT)
            .ok()
            .map(|value| value.trim().to_owned())
            .filter(|value| !value.is_empty());
        Self::new(environment, seed_profile)?.with_models_catalog_root(models_catalog_root)
    }

    pub fn new(
        environment: impl Into<String>,
        seed_profile: impl Into<String>,
    ) -> Result<Self, DatabaseInstallError> {
        let environment = normalize_install_code(environment.into(), ENV_INSTALL_ENVIRONMENT)?;
        let seed_profile = normalize_install_code(seed_profile.into(), ENV_INSTALL_SEED_PROFILE)?;
        if seed_profile != DEFAULT_SEED_PROFILE {
            return Err(DatabaseInstallError::InvalidState(format!(
                "{ENV_INSTALL_SEED_PROFILE} unsupported seed profile: {seed_profile}"
            )));
        }
        Ok(Self {
            environment,
            seed_profile,
            models_catalog_root: None,
        })
    }

    pub fn with_models_catalog_root(
        mut self,
        models_catalog_root: Option<String>,
    ) -> Result<Self, DatabaseInstallError> {
        if let Some(root) = models_catalog_root {
            let root = root.trim().to_owned();
            if root.is_empty() {
                return Err(DatabaseInstallError::InvalidState(format!(
                    "{ENV_MODELS_CATALOG_ROOT} must not be blank"
                )));
            }
            if root.chars().count() > MAX_REFRESH_CATALOG_ROOT_LEN {
                return Err(DatabaseInstallError::InvalidState(format!(
                    "{ENV_MODELS_CATALOG_ROOT} must be {MAX_REFRESH_CATALOG_ROOT_LEN} characters or fewer"
                )));
            }
            if root.chars().any(char::is_control) {
                return Err(DatabaseInstallError::InvalidState(format!(
                    "{ENV_MODELS_CATALOG_ROOT} must not contain control characters"
                )));
            }
            self.models_catalog_root = Some(root);
        }
        Ok(self)
    }
}

impl Default for BootstrapAdminOptions {
    fn default() -> Self {
        Self {
            enabled: true,
            username: DEFAULT_BOOTSTRAP_ADMIN_USERNAME.to_owned(),
            display_name: DEFAULT_BOOTSTRAP_ADMIN_DISPLAY_NAME.to_owned(),
            email: DEFAULT_BOOTSTRAP_ADMIN_EMAIL.to_owned(),
            password: None,
        }
    }
}

impl BootstrapAdminOptions {
    fn from_env() -> Result<Self, DatabaseInstallError> {
        let mut options = Self::default();
        options.enabled = match std::env::var(ENV_BOOTSTRAP_ADMIN_ENABLED).ok() {
            Some(value) => parse_env_bool(ENV_BOOTSTRAP_ADMIN_ENABLED, value.as_str())?,
            None => true,
        };
        options.username = env_optional(ENV_BOOTSTRAP_ADMIN_USERNAME)
            .map(|value| normalize_bootstrap_admin_username(value, ENV_BOOTSTRAP_ADMIN_USERNAME))
            .transpose()?
            .unwrap_or_else(|| DEFAULT_BOOTSTRAP_ADMIN_USERNAME.to_owned());
        options.display_name = env_optional(ENV_BOOTSTRAP_ADMIN_DISPLAY_NAME)
            .map(|value| {
                normalize_bootstrap_admin_text(value, ENV_BOOTSTRAP_ADMIN_DISPLAY_NAME, 128, true)
            })
            .transpose()?
            .unwrap_or_else(|| DEFAULT_BOOTSTRAP_ADMIN_DISPLAY_NAME.to_owned());
        options.email = env_optional(ENV_BOOTSTRAP_ADMIN_EMAIL)
            .map(|value| normalize_bootstrap_admin_email(value, ENV_BOOTSTRAP_ADMIN_EMAIL))
            .transpose()?
            .unwrap_or_else(|| DEFAULT_BOOTSTRAP_ADMIN_EMAIL.to_owned());
        options.password = env_optional(ENV_BOOTSTRAP_ADMIN_PASSWORD)
            .map(|value| normalize_bootstrap_admin_password(value, ENV_BOOTSTRAP_ADMIN_PASSWORD))
            .transpose()?;
        Ok(options)
    }

    fn password(&self) -> Result<String, DatabaseInstallError> {
        self.password
            .clone()
            .map(|value| normalize_bootstrap_admin_password(value, ENV_BOOTSTRAP_ADMIN_PASSWORD))
            .transpose()?
            .map(Ok)
            .unwrap_or_else(generate_bootstrap_admin_password)
    }

    fn report(&self, user_id: String, initial_password: String) -> BootstrapAdminReport {
        BootstrapAdminReport {
            status: "created".to_owned(),
            tenant_id: DEFAULT_IAM_TENANT_ID.to_owned(),
            organization_id: DEFAULT_IAM_ORGANIZATION_ID.to_owned(),
            user_id,
            username: self.username.clone(),
            display_name: self.display_name.clone(),
            email: self.email.clone(),
            generated_password: self.password.is_none(),
            initial_password,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum InstallationStatus {
    NotInstalled,
    Installed,
    UpgradeRequired,
    Incomplete,
    Corrupt,
    CatalogUnavailable,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct InstallationReport {
    pub status: InstallationStatus,
    pub schema_version: &'static str,
    pub catalog_version: String,
    pub catalog_source: String,
    pub external_catalog: bool,
    pub last_catalog_refresh_status: String,
    pub environment: String,
    pub seed_profile: String,
    pub changed: bool,
    pub bootstrap_admin: Option<BootstrapAdminReport>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct BootstrapAdminReport {
    pub status: String,
    pub tenant_id: String,
    pub organization_id: String,
    pub user_id: String,
    pub username: String,
    pub display_name: String,
    pub email: String,
    pub initial_password: String,
    pub generated_password: bool,
}

pub fn log_bootstrap_admin_report(service_name: &str, report: &InstallationReport) {
    if let Some(admin) = &report.bootstrap_admin {
        tracing::warn!(
            service = service_name,
            username = %admin.username,
            tenant_id = %admin.tenant_id,
            organization_id = %admin.organization_id,
            user_id = %admin.user_id,
            generated_password = admin.generated_password,
            initial_password = %admin.initial_password,
            "SDKWork Claw Router bootstrap admin initialized; save this one-time initial password and rotate it after first login"
        );
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CatalogRefreshOptions {
    pub source: String,
    pub mode: String,
    pub vendor_codes: Vec<String>,
    pub force: bool,
    pub catalog_root: Option<String>,
    pub catalog_version: Option<String>,
}

impl Default for CatalogRefreshOptions {
    fn default() -> Self {
        Self {
            source: DEFAULT_CATALOG_REFRESH_SOURCE.to_owned(),
            mode: "official_refresh".to_owned(),
            vendor_codes: Vec::new(),
            force: true,
            catalog_root: None,
            catalog_version: None,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CatalogRefreshReport {
    pub synced: bool,
    pub source: String,
    pub mode: String,
    pub catalog_version: String,
    pub vendor_codes: Vec<String>,
    pub meter_count: usize,
    pub vendor_count: usize,
    pub family_count: usize,
    pub model_count: usize,
    pub capability_count: usize,
    pub price_count: usize,
    pub ranking_count: usize,
    pub accepted_count: i64,
    pub snapshot_id: Option<String>,
    pub sync_run_id: Option<String>,
}

pub struct DatabaseInstaller {
    backend: InstallerBackend,
    options: DatabaseInstallOptions,
    bootstrap_admin_options: BootstrapAdminOptions,
}

enum InstallerBackend {
    Sqlite(SqlitePool),
    Postgres(PgPool),
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct BootstrapAdminOptions {
    enabled: bool,
    username: String,
    display_name: String,
    email: String,
    password: Option<String>,
}

impl DatabaseInstaller {
    pub fn for_sqlite(pool: SqlitePool) -> Self {
        Self {
            backend: InstallerBackend::Sqlite(pool),
            options: DatabaseInstallOptions::commercial(),
            bootstrap_admin_options: BootstrapAdminOptions::default(),
        }
    }

    pub fn for_postgres(pool: PgPool) -> Self {
        Self {
            backend: InstallerBackend::Postgres(pool),
            options: DatabaseInstallOptions::commercial(),
            bootstrap_admin_options: BootstrapAdminOptions::default(),
        }
    }

    pub fn with_options(
        mut self,
        options: DatabaseInstallOptions,
    ) -> Result<Self, DatabaseInstallError> {
        self.options = options;
        Ok(self)
    }

    pub fn with_env_options(self) -> Result<Self, DatabaseInstallError> {
        Ok(self
            .with_options(DatabaseInstallOptions::from_env()?)?
            .with_bootstrap_admin_options(BootstrapAdminOptions::from_env()?))
    }

    fn with_bootstrap_admin_options(mut self, options: BootstrapAdminOptions) -> Self {
        self.bootstrap_admin_options = options;
        self
    }

    pub fn with_bootstrap_admin_password(mut self, password: impl Into<String>) -> Self {
        self.bootstrap_admin_options.password = Some(password.into());
        self
    }

    pub fn options(&self) -> &DatabaseInstallOptions {
        &self.options
    }

    pub fn seed_profile(&self) -> &str {
        self.options.seed_profile.as_str()
    }

    pub fn environment(&self) -> &str {
        self.options.environment.as_str()
    }

    pub fn catalog_version(&self) -> Result<String, DatabaseInstallError> {
        expected_install_catalog_version(&self.options)
    }

    pub fn schema_version(&self) -> &'static str {
        CURRENT_SCHEMA_VERSION
    }

    pub async fn detailed_status(&self) -> Result<InstallationStatus, DatabaseInstallError> {
        self.status_with_options(&self.options).await
    }

    pub async fn status(&self) -> Result<InstallationStatus, DatabaseInstallError> {
        self.detailed_status().await
    }

    pub async fn status_report(&self) -> Result<InstallationReport, DatabaseInstallError> {
        self.status_report_with_options(&self.options).await
    }

    pub async fn status_report_for_refresh_options(
        &self,
        options: &CatalogRefreshOptions,
    ) -> Result<InstallationReport, DatabaseInstallError> {
        let options = normalize_catalog_refresh_options(options.clone())?;
        let install_options = self.refresh_install_options(options.catalog_root.as_deref())?;
        self.status_report_with_options(&install_options).await
    }

    async fn status_report_with_options(
        &self,
        options: &DatabaseInstallOptions,
    ) -> Result<InstallationReport, DatabaseInstallError> {
        let options = self.effective_install_options(options).await?;
        let status = self.status_with_resolved_options(&options).await?;
        let catalog_version = self
            .status_report_catalog_version(&options, &status)
            .await?;
        let last_catalog_refresh_status = self.last_catalog_refresh_status().await?;
        Ok(InstallationReport {
            status,
            schema_version: CURRENT_SCHEMA_VERSION,
            catalog_version,
            catalog_source: catalog_source(&options),
            external_catalog: uses_external_catalog(&options),
            last_catalog_refresh_status,
            environment: options.environment.clone(),
            seed_profile: options.seed_profile.clone(),
            changed: false,
            bootstrap_admin: None,
        })
    }

    pub async fn ensure_installed(&self) -> Result<InstallationReport, DatabaseInstallError> {
        self.ensure_installed_with_options(&self.options).await
    }

    pub async fn refresh_catalog(
        &self,
        options: CatalogRefreshOptions,
    ) -> Result<CatalogRefreshReport, DatabaseInstallError> {
        let options = normalize_catalog_refresh_options(options)?;
        let full_catalog_refresh = options.vendor_codes.is_empty();
        let audit_options = options.clone();
        let install_options = self
            .effective_install_options(
                &self.refresh_install_options(options.catalog_root.as_deref())?,
            )
            .await?;
        let catalog_version_hint = options
            .catalog_version
            .clone()
            .unwrap_or_else(|| "unknown".to_owned());
        self.prepare_refresh_schema_if_needed(&install_options, catalog_version_hint.as_str())
            .await?;

        let catalog_root = options
            .catalog_root
            .clone()
            .or_else(|| install_options.models_catalog_root.clone());
        let catalog = match load_catalog_root_with_pin(
            catalog_root.as_deref(),
            options.catalog_version.as_deref(),
        ) {
            Ok(catalog) => catalog,
            Err(error) => {
                let error = DatabaseInstallError::InvalidState(error.to_string());
                self.try_record_failed_catalog_refresh(
                    &options,
                    catalog_root.as_deref(),
                    options.catalog_version.as_deref(),
                    &error,
                )
                .await;
                return Err(error);
            }
        };
        let loaded_catalog_version = catalog.manifest.catalog_version.as_str();
        let catalog = match catalog_with_selected_vendors(&catalog, &options.vendor_codes) {
            Ok(catalog) => catalog,
            Err(error) => {
                let error = DatabaseInstallError::InvalidState(error.to_string());
                self.try_record_failed_catalog_refresh(
                    &options,
                    catalog_root.as_deref(),
                    Some(loaded_catalog_version),
                    &error,
                )
                .await;
                return Err(error);
            }
        };
        let catalog_version = catalog.manifest.catalog_version.clone();
        let vendor_codes = catalog_scope_vendor_codes(&catalog);
        let counts = catalog_scope_counts(&catalog);
        let mode = options.mode;
        let source = options.source;
        let refresh_id = catalog_refresh_id(&source, &mode, &vendor_codes);
        let command = SyncAdminModelCatalogCommand {
            subject: AdminModelSubject {
                tenant_id: SYSTEM_REFRESH_TENANT_ID,
                organization_id: SYSTEM_REFRESH_ORGANIZATION_ID,
                operator_id: SYSTEM_REFRESH_OPERATOR_ID,
                operator_type: SYSTEM_REFRESH_OPERATOR_TYPE,
            },
            snapshot_uuid: format!("catalog-refresh-{refresh_id}"),
            audit_log_uuid: format!("audit-catalog-refresh-{refresh_id}"),
            source,
            mode,
            vendor_codes: options.vendor_codes,
            force: options.force,
            catalog_root,
            catalog_version: Some(catalog_version.clone()),
            request_id: format!("installer-refresh-{refresh_id}"),
            requested_at: current_utc_timestamp_string(),
        };

        let item = match &self.backend {
            InstallerBackend::Sqlite(pool) => {
                crate::infrastructure::sql::sqlite::SqliteAdminModelStore::new(pool.clone())
                    .sync_catalog(command.clone())
                    .await
            }
            InstallerBackend::Postgres(pool) => {
                crate::infrastructure::sql::postgres::PostgresAdminModelStore::new(pool.clone())
                    .sync_catalog(command.clone())
                    .await
            }
        }
        .map_err(|error| DatabaseInstallError::InvalidState(error.to_string()));
        let item = match item {
            Ok(item) => item,
            Err(error) => {
                self.try_record_failed_catalog_refresh(
                    &audit_options,
                    command.catalog_root.as_deref(),
                    Some(catalog_version.as_str()),
                    &error,
                )
                .await;
                return Err(error);
            }
        };
        if item.synced && full_catalog_refresh {
            self.import_installation_support_seeds().await?;
            self.mark_installed_with_options(&install_options, catalog_version.as_str())
                .await?;
        }

        Ok(CatalogRefreshReport {
            synced: item.synced,
            source: command.source,
            mode: command.mode,
            catalog_version,
            vendor_codes,
            meter_count: counts.meter_count,
            vendor_count: counts.vendor_count,
            family_count: counts.family_count,
            model_count: counts.model_count,
            capability_count: counts.capability_count,
            price_count: counts.price_count,
            ranking_count: counts.ranking_count,
            accepted_count: counts.accepted_count(),
            snapshot_id: item.snapshot_id,
            sync_run_id: item.sync_run_id,
        })
    }

    async fn last_catalog_refresh_status(&self) -> Result<String, DatabaseInstallError> {
        match &self.backend {
            InstallerBackend::Sqlite(pool) => Ok(sqlite_last_catalog_refresh_status(pool).await?),
            InstallerBackend::Postgres(pool) => {
                Ok(postgres_last_catalog_refresh_status(pool).await?)
            }
        }
    }

    async fn record_failed_catalog_refresh(
        &self,
        options: &CatalogRefreshOptions,
        catalog_root: Option<&str>,
        catalog_version: Option<&str>,
        error: &DatabaseInstallError,
    ) -> Result<(), DatabaseInstallError> {
        let catalog_version = catalog_version.unwrap_or("unknown");
        match &self.backend {
            InstallerBackend::Sqlite(pool) => {
                sqlite_record_failed_catalog_refresh(
                    pool,
                    options,
                    catalog_root,
                    catalog_version,
                    error,
                )
                .await?
            }
            InstallerBackend::Postgres(pool) => {
                postgres_record_failed_catalog_refresh(
                    pool,
                    options,
                    catalog_root,
                    catalog_version,
                    error,
                )
                .await?
            }
        }
        Ok(())
    }

    async fn effective_install_options(
        &self,
        options: &DatabaseInstallOptions,
    ) -> Result<DatabaseInstallOptions, DatabaseInstallError> {
        if options.models_catalog_root.is_some() {
            return Ok(options.clone());
        }
        let persisted_root = match &self.backend {
            InstallerBackend::Sqlite(pool) => sqlite_persisted_models_catalog_root(pool).await?,
            InstallerBackend::Postgres(pool) => {
                postgres_persisted_models_catalog_root(pool).await?
            }
        };
        match persisted_root {
            Some(root) => options.clone().with_models_catalog_root(Some(root)),
            None => Ok(options.clone()),
        }
    }

    async fn status_report_catalog_version(
        &self,
        options: &DatabaseInstallOptions,
        status: &InstallationStatus,
    ) -> Result<String, DatabaseInstallError> {
        match expected_install_catalog_version(options) {
            Ok(version) => Ok(version),
            Err(error)
                if !matches!(
                    status,
                    InstallationStatus::Installed | InstallationStatus::UpgradeRequired
                ) =>
            {
                Ok(self
                    .persisted_installation_catalog_version()
                    .await?
                    .unwrap_or_else(|| "unknown".to_owned()))
            }
            Err(error) => Err(error),
        }
    }

    async fn persisted_installation_catalog_version(
        &self,
    ) -> Result<Option<String>, DatabaseInstallError> {
        match &self.backend {
            InstallerBackend::Sqlite(pool) => Ok(sqlite_installation_catalog_version(pool).await?),
            InstallerBackend::Postgres(pool) => {
                Ok(postgres_installation_catalog_version(pool).await?)
            }
        }
    }

    async fn mark_installed_with_options(
        &self,
        options: &DatabaseInstallOptions,
        catalog_version: &str,
    ) -> Result<(), DatabaseInstallError> {
        match &self.backend {
            InstallerBackend::Sqlite(pool) => {
                mark_sqlite_installed_with_catalog_version(pool, options, catalog_version).await?
            }
            InstallerBackend::Postgres(pool) => {
                mark_postgres_installed_with_catalog_version(pool, options, catalog_version).await?
            }
        }
        Ok(())
    }

    async fn import_installation_support_seeds(&self) -> Result<(), DatabaseInstallError> {
        match &self.backend {
            InstallerBackend::Sqlite(pool) => {
                import_sqlite_bundled_app_seed(pool).await?;
                import_sqlite_bundled_skills_seed(pool).await?;
                import_sqlite_bundled_course_seed(pool).await?;
                import_sqlite_bundled_forum_seed(pool).await?;
                import_sqlite_default_iam_subject_seed(pool).await?;
            }
            InstallerBackend::Postgres(pool) => {
                import_postgres_bundled_app_seed(pool).await?;
                import_postgres_bundled_skills_seed(pool).await?;
                import_postgres_bundled_course_seed(pool).await?;
                import_postgres_bundled_forum_seed(pool).await?;
                import_postgres_default_iam_subject_seed(pool).await?;
            }
        }
        Ok(())
    }

    async fn try_record_failed_catalog_refresh(
        &self,
        options: &CatalogRefreshOptions,
        catalog_root: Option<&str>,
        catalog_version: Option<&str>,
        error: &DatabaseInstallError,
    ) {
        let _ = self
            .record_failed_catalog_refresh(options, catalog_root, catalog_version, error)
            .await;
    }

    fn refresh_install_options(
        &self,
        catalog_root: Option<&str>,
    ) -> Result<DatabaseInstallOptions, DatabaseInstallError> {
        let Some(catalog_root) = catalog_root else {
            return Ok(self.options.clone());
        };
        self.options
            .clone()
            .with_models_catalog_root(Some(catalog_root.to_owned()))
    }

    async fn status_with_options(
        &self,
        options: &DatabaseInstallOptions,
    ) -> Result<InstallationStatus, DatabaseInstallError> {
        let options = self.effective_install_options(options).await?;
        self.status_with_resolved_options(&options).await
    }

    async fn status_with_resolved_options(
        &self,
        options: &DatabaseInstallOptions,
    ) -> Result<InstallationStatus, DatabaseInstallError> {
        match &self.backend {
            InstallerBackend::Sqlite(pool) => {
                sqlite_status(pool, options, &self.bootstrap_admin_options).await
            }
            InstallerBackend::Postgres(pool) => {
                postgres_status(pool, options, &self.bootstrap_admin_options).await
            }
        }
    }

    async fn prepare_refresh_schema_if_needed(
        &self,
        options: &DatabaseInstallOptions,
        catalog_version_hint: &str,
    ) -> Result<(), DatabaseInstallError> {
        match &self.backend {
            InstallerBackend::Sqlite(pool) => {
                if sqlite_refresh_schema_needs_prepare(pool, options).await? {
                    prepare_sqlite_schema_with_catalog_version(pool, options, catalog_version_hint)
                        .await?;
                }
            }
            InstallerBackend::Postgres(pool) => {
                if postgres_refresh_schema_needs_prepare(pool, options).await? {
                    prepare_postgres_schema_with_catalog_version(
                        pool,
                        options,
                        catalog_version_hint,
                    )
                    .await?;
                }
            }
        }
        Ok(())
    }

    async fn ensure_installed_with_options(
        &self,
        options: &DatabaseInstallOptions,
    ) -> Result<InstallationReport, DatabaseInstallError> {
        let options = self.effective_install_options(options).await?;
        let catalog_version = expected_install_catalog_version(&options)?;
        let status = self.status_with_resolved_options(&options).await?;
        if status == InstallationStatus::Installed {
            let last_catalog_refresh_status = self.last_catalog_refresh_status().await?;
            return Ok(InstallationReport {
                status,
                schema_version: CURRENT_SCHEMA_VERSION,
                catalog_version,
                catalog_source: catalog_source(&options),
                external_catalog: uses_external_catalog(&options),
                last_catalog_refresh_status,
                environment: options.environment.clone(),
                seed_profile: options.seed_profile.clone(),
                changed: false,
                bootstrap_admin: None,
            });
        }

        let bootstrap_admin = match &self.backend {
            InstallerBackend::Sqlite(pool) => {
                install_sqlite(pool, &options, &self.bootstrap_admin_options).await?
            }
            InstallerBackend::Postgres(pool) => {
                install_postgres(pool, &options, &self.bootstrap_admin_options).await?
            }
        };

        let last_catalog_refresh_status = self.last_catalog_refresh_status().await?;
        Ok(InstallationReport {
            status: InstallationStatus::Installed,
            schema_version: CURRENT_SCHEMA_VERSION,
            catalog_version: expected_install_catalog_version(&options)?,
            catalog_source: catalog_source(&options),
            external_catalog: uses_external_catalog(&options),
            last_catalog_refresh_status,
            environment: options.environment.clone(),
            seed_profile: options.seed_profile.clone(),
            changed: true,
            bootstrap_admin,
        })
    }
}

const SYSTEM_REFRESH_TENANT_ID: i64 = 0;
const SYSTEM_REFRESH_ORGANIZATION_ID: i64 = 0;
const SYSTEM_REFRESH_OPERATOR_ID: i64 = 0;
const SYSTEM_REFRESH_OPERATOR_TYPE: i32 = 1;

fn catalog_source(options: &DatabaseInstallOptions) -> String {
    options
        .models_catalog_root
        .clone()
        .unwrap_or_else(|| "bundled".to_owned())
}

fn uses_external_catalog(options: &DatabaseInstallOptions) -> bool {
    options.models_catalog_root.is_some()
}

fn installation_metadata(options: &DatabaseInstallOptions) -> String {
    serde_json::json!({
        "catalogSource": catalog_source(options),
        "externalCatalog": uses_external_catalog(options),
        "modelsCatalogRoot": options.models_catalog_root,
    })
    .to_string()
}

fn bootstrap_password_hash(
    password: &str,
    user_id: &str,
    now: &str,
) -> Result<String, DatabaseInstallError> {
    Pbkdf2Sha256PasswordHasher
        .hash_password(password, &format!("bootstrap-admin:{user_id}:{now}"))
        .map_err(|error| DatabaseInstallError::InvalidState(error.to_string()))
}

fn generate_bootstrap_admin_password() -> Result<String, DatabaseInstallError> {
    let mut bytes = [0_u8; GENERATED_BOOTSTRAP_ADMIN_PASSWORD_LEN];
    getrandom::fill(&mut bytes).map_err(|error| {
        DatabaseInstallError::InvalidState(format!(
            "failed to generate bootstrap admin password: {error}"
        ))
    })?;
    Ok(bytes
        .iter()
        .map(|byte| {
            let index = usize::from(*byte) % BOOTSTRAP_ADMIN_PASSWORD_ALPHABET.len();
            BOOTSTRAP_ADMIN_PASSWORD_ALPHABET[index] as char
        })
        .collect())
}

async fn sqlite_next_numeric_id(
    tx: &mut Transaction<'_, Sqlite>,
    table_name: &str,
) -> Result<String, sqlx::Error> {
    let sql = format!(
        "SELECT COALESCE(MAX(CAST(id AS INTEGER)), 0) + 1 AS next_id FROM {table_name} WHERE id GLOB '[0-9]*'"
    );
    let value: i64 = sqlx::query_scalar(&sql).fetch_one(&mut **tx).await?;
    Ok(value.to_string())
}

async fn postgres_next_numeric_id(
    tx: &mut Transaction<'_, Postgres>,
    table_name: &str,
) -> Result<String, sqlx::Error> {
    let sql = format!(
        "SELECT COALESCE(MAX(NULLIF(regexp_replace(id, '[^0-9]', '', 'g'), '')::BIGINT), 0) + 1 AS next_id FROM {table_name}"
    );
    let value: i64 = sqlx::query_scalar(&sql).fetch_one(&mut **tx).await?;
    Ok(value.to_string())
}

fn persisted_models_catalog_root_from_metadata(metadata: &str) -> Option<String> {
    let value = serde_json::from_str::<serde_json::Value>(metadata).ok()?;
    let external_catalog = value
        .get("externalCatalog")
        .and_then(serde_json::Value::as_bool)
        .unwrap_or(false);
    if !external_catalog {
        return None;
    }
    value
        .get("modelsCatalogRoot")
        .and_then(serde_json::Value::as_str)
        .or_else(|| {
            value
                .get("catalogSource")
                .and_then(serde_json::Value::as_str)
        })
        .map(str::trim)
        .filter(|value| !value.is_empty() && *value != "bundled")
        .map(ToOwned::to_owned)
}

#[derive(Debug)]
pub enum DatabaseInstallError {
    Database(sqlx::Error),
    Catalog(sdkwork_models::CatalogError),
    InvalidState(String),
}

impl Display for DatabaseInstallError {
    fn fmt(&self, formatter: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Database(error) => write!(formatter, "database installation failed: {error}"),
            Self::Catalog(error) => write!(formatter, "model catalog load failed: {error}"),
            Self::InvalidState(message) => write!(
                formatter,
                "database installation state is invalid: {message}"
            ),
        }
    }
}

impl Error for DatabaseInstallError {}

impl From<sqlx::Error> for DatabaseInstallError {
    fn from(value: sqlx::Error) -> Self {
        Self::Database(value)
    }
}

impl From<sdkwork_models::CatalogError> for DatabaseInstallError {
    fn from(value: sdkwork_models::CatalogError) -> Self {
        Self::Catalog(value)
    }
}

fn normalize_catalog_refresh_options(
    options: CatalogRefreshOptions,
) -> Result<CatalogRefreshOptions, DatabaseInstallError> {
    let source = normalize_refresh_source(options.source)?;
    let mode = normalize_refresh_mode(options.mode)?;
    let vendor_codes = normalize_refresh_vendor_codes(options.vendor_codes)?;
    let catalog_root = normalize_refresh_catalog_root(options.catalog_root)?;
    let catalog_version = normalize_refresh_catalog_version(options.catalog_version)?;
    Ok(CatalogRefreshOptions {
        source,
        mode,
        vendor_codes,
        force: options.force,
        catalog_root,
        catalog_version,
    })
}

fn normalize_refresh_source(value: String) -> Result<String, DatabaseInstallError> {
    let value = value.trim();
    if value.is_empty() {
        return Ok(DEFAULT_CATALOG_REFRESH_SOURCE.to_owned());
    }
    normalize_refresh_token(value, "source", MAX_REFRESH_SOURCE_LEN)
}

fn normalize_refresh_mode(value: String) -> Result<String, DatabaseInstallError> {
    let value = value.trim();
    if value.is_empty() {
        return Ok("official_refresh".to_owned());
    }
    let value = normalize_refresh_token(value, "mode", MAX_REFRESH_MODE_LEN)?;
    if !matches!(
        value.as_str(),
        "official_refresh" | "vendor_refresh" | "catalog_version_refresh" | "dry_run"
    ) {
        return Err(DatabaseInstallError::InvalidState(
            "mode must be official_refresh, vendor_refresh, catalog_version_refresh, or dry_run"
                .to_owned(),
        ));
    }
    Ok(value)
}

fn normalize_refresh_vendor_codes(
    values: Vec<String>,
) -> Result<Vec<String>, DatabaseInstallError> {
    if values.len() > MAX_REFRESH_VENDOR_CODES {
        return Err(DatabaseInstallError::InvalidState(format!(
            "vendorCodes must contain {MAX_REFRESH_VENDOR_CODES} items or fewer"
        )));
    }
    let mut vendor_codes = Vec::new();
    for value in values {
        let value = normalize_refresh_token(&value, "vendorCodes", MAX_REFRESH_VENDOR_CODE_LEN)?;
        if !vendor_codes.iter().any(|existing| existing == &value) {
            vendor_codes.push(value);
        }
    }
    Ok(vendor_codes)
}

fn normalize_refresh_catalog_root(
    value: Option<String>,
) -> Result<Option<String>, DatabaseInstallError> {
    let Some(value) = value else {
        return Ok(None);
    };
    let value = value.trim();
    if value.is_empty() {
        return Ok(None);
    }
    if value.chars().count() > MAX_REFRESH_CATALOG_ROOT_LEN {
        return Err(DatabaseInstallError::InvalidState(format!(
            "catalogRoot must be {MAX_REFRESH_CATALOG_ROOT_LEN} characters or fewer"
        )));
    }
    if value.chars().any(char::is_control) {
        return Err(DatabaseInstallError::InvalidState(
            "catalogRoot must not contain control characters".to_owned(),
        ));
    }
    Ok(Some(value.to_owned()))
}

fn normalize_refresh_catalog_version(
    value: Option<String>,
) -> Result<Option<String>, DatabaseInstallError> {
    let Some(value) = value else {
        return Ok(None);
    };
    let value = value.trim();
    if value.is_empty() {
        return Ok(None);
    }
    if value.chars().count() > MAX_REFRESH_CATALOG_VERSION_LEN {
        return Err(DatabaseInstallError::InvalidState(format!(
            "catalogVersion must be {MAX_REFRESH_CATALOG_VERSION_LEN} characters or fewer"
        )));
    }
    if !value
        .bytes()
        .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'.' | b'-' | b'_'))
    {
        return Err(DatabaseInstallError::InvalidState(
            "catalogVersion must contain only letters, numbers, ., -, and _".to_owned(),
        ));
    }
    Ok(Some(value.to_owned()))
}

fn normalize_refresh_token(
    value: &str,
    name: &str,
    max_len: usize,
) -> Result<String, DatabaseInstallError> {
    let value = value.trim().to_ascii_lowercase();
    if value.is_empty() {
        return Err(DatabaseInstallError::InvalidState(format!(
            "{name} must not be blank"
        )));
    }
    if value.len() > max_len {
        return Err(DatabaseInstallError::InvalidState(format!(
            "{name} must be {max_len} characters or fewer"
        )));
    }
    if !value
        .bytes()
        .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_'))
    {
        return Err(DatabaseInstallError::InvalidState(format!(
            "{name} must contain only letters, numbers, -, and _"
        )));
    }
    Ok(value)
}

fn env_optional(name: &str) -> Option<String> {
    std::env::var(name)
        .ok()
        .map(|value| value.trim().to_owned())
        .filter(|value| !value.is_empty())
}

fn parse_env_bool(name: &str, value: &str) -> Result<bool, DatabaseInstallError> {
    match value.trim().to_ascii_lowercase().as_str() {
        "1" | "true" | "yes" | "y" | "on" => Ok(true),
        "0" | "false" | "no" | "n" | "off" => Ok(false),
        _ => Err(DatabaseInstallError::InvalidState(format!(
            "{name} must be one of true, false, 1, 0, yes, no, on, or off"
        ))),
    }
}

fn normalize_bootstrap_admin_username(
    value: String,
    name: &str,
) -> Result<String, DatabaseInstallError> {
    let value = value.trim().to_ascii_lowercase();
    if value.is_empty() {
        return Err(DatabaseInstallError::InvalidState(format!(
            "{name} must not be blank"
        )));
    }
    if value.len() > 128 {
        return Err(DatabaseInstallError::InvalidState(format!(
            "{name} must be 128 characters or fewer"
        )));
    }
    if !value
        .bytes()
        .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'.' | b'-' | b'_'))
    {
        return Err(DatabaseInstallError::InvalidState(format!(
            "{name} may only contain letters, digits, '.', '-' and '_'"
        )));
    }
    Ok(value)
}

fn normalize_bootstrap_admin_text(
    value: String,
    name: &str,
    max_len: usize,
    allow_blank: bool,
) -> Result<String, DatabaseInstallError> {
    let value = value.trim().to_owned();
    if value.is_empty() && !allow_blank {
        return Err(DatabaseInstallError::InvalidState(format!(
            "{name} must not be blank"
        )));
    }
    if value.chars().count() > max_len {
        return Err(DatabaseInstallError::InvalidState(format!(
            "{name} must be {max_len} characters or fewer"
        )));
    }
    if value.chars().any(char::is_control) {
        return Err(DatabaseInstallError::InvalidState(format!(
            "{name} must not contain control characters"
        )));
    }
    Ok(value)
}

fn normalize_bootstrap_admin_email(
    value: String,
    name: &str,
) -> Result<String, DatabaseInstallError> {
    let value = normalize_bootstrap_admin_text(value, name, 256, false)?;
    if !value.contains('@') {
        return Err(DatabaseInstallError::InvalidState(format!(
            "{name} must be a valid email address"
        )));
    }
    Ok(value)
}

fn normalize_bootstrap_admin_password(
    value: String,
    name: &str,
) -> Result<String, DatabaseInstallError> {
    let value = value.trim().to_owned();
    if value.chars().count() < MIN_BOOTSTRAP_ADMIN_PASSWORD_LEN
        || value.chars().count() > MAX_BOOTSTRAP_ADMIN_PASSWORD_LEN
    {
        return Err(DatabaseInstallError::InvalidState(format!(
            "{name} must be between {MIN_BOOTSTRAP_ADMIN_PASSWORD_LEN} and {MAX_BOOTSTRAP_ADMIN_PASSWORD_LEN} characters"
        )));
    }
    if value.chars().any(char::is_control) {
        return Err(DatabaseInstallError::InvalidState(format!(
            "{name} must not contain control characters"
        )));
    }
    Ok(value)
}

fn load_install_model_catalog(
    options: &DatabaseInstallOptions,
) -> Result<ModelCatalog, DatabaseInstallError> {
    match options.models_catalog_root.as_deref() {
        Some(root) => Ok(sdkwork_models::load_catalog(root)?),
        None => Ok(sdkwork_models::load_bundled_catalog()?),
    }
}

fn expected_install_catalog_version(
    options: &DatabaseInstallOptions,
) -> Result<String, DatabaseInstallError> {
    Ok(load_install_model_catalog(options)?
        .manifest
        .catalog_version)
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct CatalogCompletenessSpec {
    vendor_codes: BTreeSet<String>,
    family_keys: BTreeSet<ModelFamilyCompletenessKey>,
    catalog_keys: BTreeSet<String>,
    capability_keys: BTreeSet<ModelCapabilityCompletenessKey>,
    meter_codes: BTreeSet<String>,
    price_keys: BTreeSet<ModelPriceCompletenessKey>,
    ranking_keys: BTreeSet<ModelRankingCompletenessKey>,
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
struct ModelFamilyCompletenessKey {
    vendor_code: String,
    region_code: String,
    family_code: String,
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
struct ModelCapabilityCompletenessKey {
    catalog_key: String,
    capability: i32,
    capability_code: String,
    modality: i32,
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
struct ModelPriceCompletenessKey {
    catalog_key: String,
    meter_code: String,
    price_side: i32,
    pricing_scope: i32,
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
struct ModelRankingCompletenessKey {
    snapshot_date: String,
    rank_scope: String,
    catalog_key: String,
}

fn catalog_completeness_spec(catalog: &ModelCatalog) -> CatalogCompletenessSpec {
    let vendor_codes = catalog
        .vendors
        .iter()
        .map(|vendor| vendor.vendor.vendor_code.clone())
        .collect::<BTreeSet<_>>();
    let family_keys = catalog
        .vendors
        .iter()
        .flat_map(|vendor| {
            vendor
                .families
                .iter()
                .map(|family| ModelFamilyCompletenessKey {
                    vendor_code: vendor.vendor.vendor_code.clone(),
                    region_code: vendor.vendor.region_code.clone(),
                    family_code: family.family_code.clone(),
                })
        })
        .collect::<BTreeSet<_>>();
    let catalog_keys = catalog
        .vendors
        .iter()
        .flat_map(|vendor| {
            vendor.models.iter().map(|model| {
                catalog_key(
                    &vendor.vendor.vendor_code,
                    &vendor.vendor.region_code,
                    &model.model_id,
                )
            })
        })
        .collect::<BTreeSet<_>>();
    let capability_keys = catalog
        .vendors
        .iter()
        .flat_map(|vendor| {
            vendor.models.iter().map(|model| {
                (
                    catalog_key(
                        &vendor.vendor.vendor_code,
                        &vendor.vendor.region_code,
                        &model.model_id,
                    ),
                    model,
                )
            })
        })
        .flat_map(|(model_catalog_key, model)| {
            let modality =
                crate::infrastructure::sql::model_catalog_import::primary_modality(model);
            let capabilities = if model.capabilities.is_empty() {
                vec![model.primary_capability.clone()]
            } else {
                model.capabilities.clone()
            };
            capabilities
                .into_iter()
                .map(move |capability| ModelCapabilityCompletenessKey {
                    catalog_key: model_catalog_key.clone(),
                    capability: crate::infrastructure::sql::model_catalog_import::capability_code(
                        &capability,
                    ),
                    capability_code: capability,
                    modality,
                })
        })
        .collect::<BTreeSet<_>>();
    let meter_codes = catalog
        .meters
        .iter()
        .map(|meter| meter.meter_code.clone())
        .collect::<BTreeSet<_>>();
    let price_keys = catalog
        .vendors
        .iter()
        .flat_map(|vendor| vendor.pricing.iter().map(move |pricing| (vendor, pricing)))
        .flat_map(|(vendor, pricing)| {
            let pricing_catalog_key = catalog_key(
                &vendor.vendor.vendor_code,
                &vendor.vendor.region_code,
                &pricing.model_id,
            );
            pricing
                .prices
                .iter()
                .map(move |price| ModelPriceCompletenessKey {
                    catalog_key: pricing_catalog_key.clone(),
                    meter_code: price.meter_code.clone(),
                    price_side: crate::infrastructure::sql::model_catalog_import::price_side_code(
                        &price.price_side,
                    ),
                    pricing_scope:
                        crate::infrastructure::sql::model_catalog_import::pricing_scope_code(
                            price.pricing_scope.as_deref(),
                        ),
                })
        })
        .collect::<BTreeSet<_>>();
    let ranking_keys = catalog
        .vendors
        .iter()
        .flat_map(|vendor| {
            vendor
                .rankings
                .iter()
                .map(move |snapshot| (vendor, snapshot))
        })
        .flat_map(|(vendor, snapshot)| {
            let catalog_keys = catalog_keys.clone();
            snapshot.items.iter().filter_map(move |item| {
                let item_catalog_key = catalog_key(
                    &vendor.vendor.vendor_code,
                    &vendor.vendor.region_code,
                    &item.model_id,
                );
                if catalog_keys.contains(&item_catalog_key) {
                    Some(ModelRankingCompletenessKey {
                        snapshot_date: snapshot.snapshot_date.clone(),
                        rank_scope: snapshot.rank_scope.clone(),
                        catalog_key: item_catalog_key,
                    })
                } else {
                    None
                }
            })
        })
        .collect::<BTreeSet<_>>();

    CatalogCompletenessSpec {
        vendor_codes,
        family_keys,
        catalog_keys,
        capability_keys,
        meter_codes,
        price_keys,
        ranking_keys,
    }
}

async fn sqlite_status(
    pool: &SqlitePool,
    options: &DatabaseInstallOptions,
    bootstrap_admin_options: &BootstrapAdminOptions,
) -> Result<InstallationStatus, DatabaseInstallError> {
    if !sqlite_table_exists(pool, "system_installation_state").await? {
        return Ok(InstallationStatus::NotInstalled);
    }

    let Some(row) = sqlx::query(
        r#"
        SELECT schema_version, catalog_version, seed_profile, environment, status
        FROM system_installation_state
        WHERE id = 1
        "#,
    )
    .fetch_optional(pool)
    .await?
    else {
        return Ok(InstallationStatus::NotInstalled);
    };

    let install_status = row.get::<String, _>("status");
    if install_status != "installed" {
        return Ok(InstallationStatus::Incomplete);
    }

    let schema_version = row.get::<String, _>("schema_version");
    let catalog_version = row.get::<String, _>("catalog_version");
    let expected_catalog_version = match expected_install_catalog_version(options) {
        Ok(version) => version,
        Err(DatabaseInstallError::Catalog(_)) if options.models_catalog_root.is_some() => {
            return Ok(InstallationStatus::CatalogUnavailable);
        }
        Err(error) => return Err(error),
    };
    let seed_profile = row.get::<String, _>("seed_profile");
    let environment = row.get::<String, _>("environment");
    if schema_version != CURRENT_SCHEMA_VERSION
        || catalog_version != expected_catalog_version
        || seed_profile != options.seed_profile
        || environment != options.environment
    {
        return Ok(InstallationStatus::UpgradeRequired);
    }

    if !sqlite_generated_schema_tables_exist(pool).await? {
        return Ok(InstallationStatus::Corrupt);
    }
    if !sqlite_generated_schema_indexes_exist(pool).await? {
        return Ok(InstallationStatus::UpgradeRequired);
    }
    let catalog = match load_install_model_catalog(options) {
        Ok(catalog) => catalog,
        Err(DatabaseInstallError::Catalog(_)) if options.models_catalog_root.is_some() => {
            return Ok(InstallationStatus::CatalogUnavailable);
        }
        Err(error) => return Err(error),
    };
    let spec = catalog_completeness_spec(&catalog);
    if !sqlite_sdkwork_models_catalog_complete(pool, &spec).await? {
        return Ok(InstallationStatus::UpgradeRequired);
    }
    if !sqlite_app_seed_complete(pool).await? {
        return Ok(InstallationStatus::UpgradeRequired);
    }
    if !sqlite_skills_seed_complete(pool).await? {
        return Ok(InstallationStatus::UpgradeRequired);
    }
    if !sqlite_course_seed_complete(pool).await? {
        return Ok(InstallationStatus::UpgradeRequired);
    }
    if !sqlite_forum_seed_complete(pool).await? {
        return Ok(InstallationStatus::UpgradeRequired);
    }
    if !sqlite_default_iam_subject_seed_complete(pool).await? {
        return Ok(InstallationStatus::UpgradeRequired);
    }
    if bootstrap_admin_options.enabled
        && !sqlite_bootstrap_admin_seed_complete(pool, bootstrap_admin_options.username.as_str())
            .await?
    {
        return Ok(InstallationStatus::UpgradeRequired);
    }
    if !sqlite_seed_migration_payload_current(
        pool,
        "course",
        CURRENT_SCHEMA_VERSION,
        bundled_course_seed_payload()
            .map_err(|error| DatabaseInstallError::InvalidState(error.to_string()))?
            .as_str(),
    )
    .await?
    {
        return Ok(InstallationStatus::UpgradeRequired);
    }
    if !sqlite_seed_migration_payload_current(
        pool,
        "forum",
        CURRENT_SCHEMA_VERSION,
        bundled_forum_seed_payload()
            .map_err(|error| DatabaseInstallError::InvalidState(error.to_string()))?
            .as_str(),
    )
    .await?
    {
        return Ok(InstallationStatus::UpgradeRequired);
    }
    Ok(InstallationStatus::Installed)
}

async fn prepare_sqlite_schema_with_catalog_version(
    pool: &SqlitePool,
    options: &DatabaseInstallOptions,
    catalog_version: &str,
) -> Result<(), DatabaseInstallError> {
    create_sqlite_system_tables(pool).await?;
    upsert_sqlite_installing_state(pool, options, catalog_version).await?;
    record_sqlite_migration_started(
        pool,
        "schema",
        CURRENT_SCHEMA_VERSION,
        GENERATED_POSTGRES_SCHEMA,
    )
    .await?;
    for statement in sqlite_schema_statements() {
        execute_sqlite_statement(pool, statement.as_str()).await?;
    }
    record_sqlite_migration_completed(
        pool,
        "schema",
        CURRENT_SCHEMA_VERSION,
        GENERATED_POSTGRES_SCHEMA,
    )
    .await?;
    Ok(())
}

async fn postgres_status(
    pool: &PgPool,
    options: &DatabaseInstallOptions,
    bootstrap_admin_options: &BootstrapAdminOptions,
) -> Result<InstallationStatus, DatabaseInstallError> {
    if !postgres_table_exists(pool, "system_installation_state").await? {
        return Ok(InstallationStatus::NotInstalled);
    }

    let Some(row) = sqlx::query(
        r#"
        SELECT schema_version, catalog_version, seed_profile, environment, status
        FROM system_installation_state
        WHERE id = 1
        "#,
    )
    .fetch_optional(pool)
    .await?
    else {
        return Ok(InstallationStatus::NotInstalled);
    };

    let install_status = row.get::<String, _>("status");
    if install_status != "installed" {
        return Ok(InstallationStatus::Incomplete);
    }

    let schema_version = row.get::<String, _>("schema_version");
    let catalog_version = row.get::<String, _>("catalog_version");
    let expected_catalog_version = match expected_install_catalog_version(options) {
        Ok(version) => version,
        Err(DatabaseInstallError::Catalog(_)) if options.models_catalog_root.is_some() => {
            return Ok(InstallationStatus::CatalogUnavailable);
        }
        Err(error) => return Err(error),
    };
    let seed_profile = row.get::<String, _>("seed_profile");
    let environment = row.get::<String, _>("environment");
    if schema_version != CURRENT_SCHEMA_VERSION
        || catalog_version != expected_catalog_version
        || seed_profile != options.seed_profile
        || environment != options.environment
    {
        return Ok(InstallationStatus::UpgradeRequired);
    }

    if !postgres_generated_schema_tables_exist(pool).await? {
        return Ok(InstallationStatus::Corrupt);
    }
    if !postgres_generated_schema_indexes_exist(pool).await? {
        return Ok(InstallationStatus::UpgradeRequired);
    }
    let catalog = match load_install_model_catalog(options) {
        Ok(catalog) => catalog,
        Err(DatabaseInstallError::Catalog(_)) if options.models_catalog_root.is_some() => {
            return Ok(InstallationStatus::CatalogUnavailable);
        }
        Err(error) => return Err(error),
    };
    let spec = catalog_completeness_spec(&catalog);
    if !postgres_sdkwork_models_catalog_complete(pool, &spec).await? {
        return Ok(InstallationStatus::UpgradeRequired);
    }
    if !postgres_app_seed_complete(pool).await? {
        return Ok(InstallationStatus::UpgradeRequired);
    }
    if !postgres_skills_seed_complete(pool).await? {
        return Ok(InstallationStatus::UpgradeRequired);
    }
    if !postgres_course_seed_complete(pool).await? {
        return Ok(InstallationStatus::UpgradeRequired);
    }
    if !postgres_forum_seed_complete(pool).await? {
        return Ok(InstallationStatus::UpgradeRequired);
    }
    if !postgres_default_iam_subject_seed_complete(pool).await? {
        return Ok(InstallationStatus::UpgradeRequired);
    }
    if bootstrap_admin_options.enabled
        && !postgres_bootstrap_admin_seed_complete(pool, bootstrap_admin_options.username.as_str())
            .await?
    {
        return Ok(InstallationStatus::UpgradeRequired);
    }
    if !postgres_seed_migration_payload_current(
        pool,
        "course",
        CURRENT_SCHEMA_VERSION,
        bundled_course_seed_payload()
            .map_err(|error| DatabaseInstallError::InvalidState(error.to_string()))?
            .as_str(),
    )
    .await?
    {
        return Ok(InstallationStatus::UpgradeRequired);
    }
    if !postgres_seed_migration_payload_current(
        pool,
        "forum",
        CURRENT_SCHEMA_VERSION,
        bundled_forum_seed_payload()
            .map_err(|error| DatabaseInstallError::InvalidState(error.to_string()))?
            .as_str(),
    )
    .await?
    {
        return Ok(InstallationStatus::UpgradeRequired);
    }
    Ok(InstallationStatus::Installed)
}

async fn prepare_postgres_schema_with_catalog_version(
    pool: &PgPool,
    options: &DatabaseInstallOptions,
    catalog_version: &str,
) -> Result<(), DatabaseInstallError> {
    create_postgres_system_tables(pool).await?;
    upsert_postgres_installing_state(pool, options, catalog_version).await?;
    record_postgres_migration_started(
        pool,
        "schema",
        CURRENT_SCHEMA_VERSION,
        GENERATED_POSTGRES_SCHEMA,
    )
    .await?;
    for statement in postgres_schema_statements() {
        execute_postgres_statement(pool, statement.as_str()).await?;
    }
    record_postgres_migration_completed(
        pool,
        "schema",
        CURRENT_SCHEMA_VERSION,
        GENERATED_POSTGRES_SCHEMA,
    )
    .await?;
    Ok(())
}

async fn install_sqlite(
    pool: &SqlitePool,
    options: &DatabaseInstallOptions,
    bootstrap_admin_options: &BootstrapAdminOptions,
) -> Result<Option<BootstrapAdminReport>, DatabaseInstallError> {
    let catalog = load_install_model_catalog(options)?;
    let catalog_payload =
        crate::infrastructure::sql::model_catalog_import::catalog_payload(&catalog);
    prepare_sqlite_schema_with_catalog_version(
        pool,
        options,
        catalog.manifest.catalog_version.as_str(),
    )
    .await?;

    record_sqlite_migration_started(
        pool,
        "catalog",
        catalog.manifest.catalog_version.as_str(),
        catalog_payload.as_str(),
    )
    .await?;
    crate::infrastructure::sql::sqlite::model_catalog_import::import_sqlite_model_catalog(
        pool, &catalog,
    )
    .await?;
    record_sqlite_migration_completed(
        pool,
        "catalog",
        catalog.manifest.catalog_version.as_str(),
        catalog_payload.as_str(),
    )
    .await?;
    import_sqlite_bundled_app_seed(pool).await?;
    import_sqlite_bundled_skills_seed(pool).await?;
    import_sqlite_bundled_course_seed(pool).await?;
    import_sqlite_bundled_forum_seed(pool).await?;
    import_sqlite_default_iam_subject_seed(pool).await?;
    let bootstrap_admin =
        bootstrap_sqlite_admin_user_if_needed(pool, bootstrap_admin_options).await?;
    mark_sqlite_installed(pool).await?;
    Ok(bootstrap_admin)
}

async fn install_postgres(
    pool: &PgPool,
    options: &DatabaseInstallOptions,
    bootstrap_admin_options: &BootstrapAdminOptions,
) -> Result<Option<BootstrapAdminReport>, DatabaseInstallError> {
    let catalog = load_install_model_catalog(options)?;
    let catalog_payload =
        crate::infrastructure::sql::model_catalog_import::catalog_payload(&catalog);
    prepare_postgres_schema_with_catalog_version(
        pool,
        options,
        catalog.manifest.catalog_version.as_str(),
    )
    .await?;

    record_postgres_migration_started(
        pool,
        "catalog",
        catalog.manifest.catalog_version.as_str(),
        catalog_payload.as_str(),
    )
    .await?;
    crate::infrastructure::sql::postgres::model_catalog_import::import_postgres_model_catalog(
        pool, &catalog,
    )
    .await?;
    record_postgres_migration_completed(
        pool,
        "catalog",
        catalog.manifest.catalog_version.as_str(),
        catalog_payload.as_str(),
    )
    .await?;
    import_postgres_bundled_app_seed(pool).await?;
    import_postgres_bundled_skills_seed(pool).await?;
    import_postgres_bundled_course_seed(pool).await?;
    import_postgres_bundled_forum_seed(pool).await?;
    import_postgres_default_iam_subject_seed(pool).await?;
    let bootstrap_admin =
        bootstrap_postgres_admin_user_if_needed(pool, bootstrap_admin_options).await?;
    mark_postgres_installed(pool).await?;
    Ok(bootstrap_admin)
}

async fn import_sqlite_bundled_app_seed(pool: &SqlitePool) -> Result<(), DatabaseInstallError> {
    let payload = bundled_app_seed_payload()
        .map_err(|error| DatabaseInstallError::InvalidState(error.to_string()))?;
    record_sqlite_migration_started(pool, "app-seed", CURRENT_SCHEMA_VERSION, payload.as_str())
        .await?;
    import_sqlite_app_seed(pool).await?;
    record_sqlite_migration_completed(pool, "app-seed", CURRENT_SCHEMA_VERSION, payload.as_str())
        .await?;
    Ok(())
}

async fn import_postgres_bundled_app_seed(pool: &PgPool) -> Result<(), DatabaseInstallError> {
    let payload = bundled_app_seed_payload()
        .map_err(|error| DatabaseInstallError::InvalidState(error.to_string()))?;
    record_postgres_migration_started(pool, "app-seed", CURRENT_SCHEMA_VERSION, payload.as_str())
        .await?;
    import_postgres_app_seed(pool).await?;
    record_postgres_migration_completed(pool, "app-seed", CURRENT_SCHEMA_VERSION, payload.as_str())
        .await?;
    Ok(())
}

async fn import_sqlite_bundled_skills_seed(pool: &SqlitePool) -> Result<(), DatabaseInstallError> {
    let payload = bundled_skills_seed_payload()
        .map_err(|error| DatabaseInstallError::InvalidState(error.to_string()))?;
    record_sqlite_migration_started(pool, "skills", CURRENT_SCHEMA_VERSION, payload.as_str())
        .await?;
    import_sqlite_skills_seed(pool).await?;
    record_sqlite_migration_completed(pool, "skills", CURRENT_SCHEMA_VERSION, payload.as_str())
        .await?;
    Ok(())
}

async fn import_postgres_bundled_skills_seed(pool: &PgPool) -> Result<(), DatabaseInstallError> {
    let payload = bundled_skills_seed_payload()
        .map_err(|error| DatabaseInstallError::InvalidState(error.to_string()))?;
    record_postgres_migration_started(pool, "skills", CURRENT_SCHEMA_VERSION, payload.as_str())
        .await?;
    import_postgres_skills_seed(pool).await?;
    record_postgres_migration_completed(pool, "skills", CURRENT_SCHEMA_VERSION, payload.as_str())
        .await?;
    Ok(())
}

async fn import_sqlite_bundled_course_seed(pool: &SqlitePool) -> Result<(), DatabaseInstallError> {
    let payload = bundled_course_seed_payload()
        .map_err(|error| DatabaseInstallError::InvalidState(error.to_string()))?;
    record_sqlite_migration_started(pool, "course", CURRENT_SCHEMA_VERSION, payload.as_str())
        .await?;
    import_sqlite_course_seed(pool).await?;
    record_sqlite_migration_completed(pool, "course", CURRENT_SCHEMA_VERSION, payload.as_str())
        .await?;
    Ok(())
}

async fn import_postgres_bundled_course_seed(pool: &PgPool) -> Result<(), DatabaseInstallError> {
    let payload = bundled_course_seed_payload()
        .map_err(|error| DatabaseInstallError::InvalidState(error.to_string()))?;
    record_postgres_migration_started(pool, "course", CURRENT_SCHEMA_VERSION, payload.as_str())
        .await?;
    import_postgres_course_seed(pool).await?;
    record_postgres_migration_completed(pool, "course", CURRENT_SCHEMA_VERSION, payload.as_str())
        .await?;
    Ok(())
}

async fn import_sqlite_bundled_forum_seed(pool: &SqlitePool) -> Result<(), DatabaseInstallError> {
    let payload = bundled_forum_seed_payload()
        .map_err(|error| DatabaseInstallError::InvalidState(error.to_string()))?;
    record_sqlite_migration_started(pool, "forum", CURRENT_SCHEMA_VERSION, payload.as_str())
        .await?;
    import_sqlite_forum_seed(pool).await?;
    record_sqlite_migration_completed(pool, "forum", CURRENT_SCHEMA_VERSION, payload.as_str())
        .await?;
    Ok(())
}

async fn import_postgres_bundled_forum_seed(pool: &PgPool) -> Result<(), DatabaseInstallError> {
    let payload = bundled_forum_seed_payload()
        .map_err(|error| DatabaseInstallError::InvalidState(error.to_string()))?;
    record_postgres_migration_started(pool, "forum", CURRENT_SCHEMA_VERSION, payload.as_str())
        .await?;
    import_postgres_forum_seed(pool).await?;
    record_postgres_migration_completed(pool, "forum", CURRENT_SCHEMA_VERSION, payload.as_str())
        .await?;
    Ok(())
}

async fn import_sqlite_default_iam_subject_seed(
    pool: &SqlitePool,
) -> Result<(), DatabaseInstallError> {
    sqlite_upsert_default_iam_subject(pool).await?;
    Ok(())
}

async fn import_postgres_default_iam_subject_seed(
    pool: &PgPool,
) -> Result<(), DatabaseInstallError> {
    postgres_upsert_default_iam_subject(pool).await?;
    Ok(())
}

async fn bootstrap_sqlite_admin_user_if_needed(
    pool: &SqlitePool,
    options: &BootstrapAdminOptions,
) -> Result<Option<BootstrapAdminReport>, DatabaseInstallError> {
    if !options.enabled
        || sqlite_bootstrap_admin_seed_complete(pool, options.username.as_str()).await?
    {
        return Ok(None);
    }
    let mut tx = pool.begin().await?;
    let now = current_utc_timestamp_string();
    let user_id =
        match sqlite_bootstrap_admin_user_id_in_transaction(&mut tx, options.username.as_str())
            .await?
        {
            Some(user_id) => user_id,
            None => sqlite_next_numeric_id(&mut tx, "iam_user").await?,
        };
    let has_active_password =
        sqlite_bootstrap_admin_has_active_password_credential_in_transaction(&mut tx, &user_id)
            .await?;
    let password_and_hash = if has_active_password {
        None
    } else {
        let password = options.password()?;
        let hash = bootstrap_password_hash(&password, &user_id, now.as_str())?;
        Some((password, hash))
    };
    let password_written = upsert_sqlite_bootstrap_admin(
        &mut tx,
        options,
        &user_id,
        password_and_hash.as_ref().map(|(_, hash)| hash.as_str()),
        &now,
    )
    .await?;
    maybe_upsert_sqlite_legacy_admin(&mut tx, options, &user_id, &now).await?;
    tx.commit().await?;
    Ok(password_written.then(|| {
        let (password, _) = password_and_hash.expect("password must exist when written");
        options.report(user_id, password)
    }))
}

async fn bootstrap_postgres_admin_user_if_needed(
    pool: &PgPool,
    options: &BootstrapAdminOptions,
) -> Result<Option<BootstrapAdminReport>, DatabaseInstallError> {
    if !options.enabled
        || postgres_bootstrap_admin_seed_complete(pool, options.username.as_str()).await?
    {
        return Ok(None);
    }
    let mut tx = pool.begin().await?;
    let now = current_utc_timestamp_string();
    let user_id =
        match postgres_bootstrap_admin_user_id_in_transaction(&mut tx, options.username.as_str())
            .await?
        {
            Some(user_id) => user_id,
            None => postgres_next_numeric_id(&mut tx, "iam_user").await?,
        };
    let has_active_password =
        postgres_bootstrap_admin_has_active_password_credential_in_transaction(&mut tx, &user_id)
            .await?;
    let password_and_hash = if has_active_password {
        None
    } else {
        let password = options.password()?;
        let hash = bootstrap_password_hash(&password, &user_id, now.as_str())?;
        Some((password, hash))
    };
    let password_written = upsert_postgres_bootstrap_admin(
        &mut tx,
        options,
        &user_id,
        password_and_hash.as_ref().map(|(_, hash)| hash.as_str()),
        &now,
    )
    .await?;
    maybe_upsert_postgres_legacy_admin(&mut tx, options, &user_id, &now).await?;
    tx.commit().await?;
    Ok(password_written.then(|| {
        let (password, _) = password_and_hash.expect("password must exist when written");
        options.report(user_id, password)
    }))
}

async fn sqlite_default_iam_subject_seed_complete(pool: &SqlitePool) -> Result<bool, sqlx::Error> {
    let count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM iam_tenant t
        JOIN iam_organization o ON o.tenant_id = t.id
        WHERE t.id = ?
          AND t.code = ?
          AND t.status = 'active'
          AND o.id = ?
          AND o.code = ?
          AND o.status = 'active'
        "#,
    )
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(DEFAULT_IAM_TENANT_CODE)
    .bind(DEFAULT_IAM_ORGANIZATION_ID)
    .bind(DEFAULT_IAM_ORGANIZATION_CODE)
    .fetch_one(pool)
    .await?;
    Ok(count == 1)
}

async fn postgres_default_iam_subject_seed_complete(pool: &PgPool) -> Result<bool, sqlx::Error> {
    let count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM iam_tenant t
        JOIN iam_organization o ON o.tenant_id = t.id
        WHERE t.id = $1
          AND t.code = $2
          AND t.status = 'active'
          AND o.id = $3
          AND o.code = $4
          AND o.status = 'active'
        "#,
    )
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(DEFAULT_IAM_TENANT_CODE)
    .bind(DEFAULT_IAM_ORGANIZATION_ID)
    .bind(DEFAULT_IAM_ORGANIZATION_CODE)
    .fetch_one(pool)
    .await?;
    Ok(count == 1)
}

async fn sqlite_bootstrap_admin_seed_complete(
    pool: &SqlitePool,
    username: &str,
) -> Result<bool, sqlx::Error> {
    let count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM iam_user u
        JOIN iam_organization_member m
          ON m.tenant_id = u.tenant_id
         AND m.user_id = u.id
         AND m.status = 'active'
        JOIN iam_credential c
          ON c.tenant_id = u.tenant_id
         AND c.user_id = u.id
         AND c.credential_type = 'password'
         AND c.status = 'active'
        WHERE u.tenant_id = ?
          AND u.username = ?
          AND u.status = 'active'
          AND m.organization_id = ?
          AND LOWER(COALESCE(m.role_code, '')) = 'admin'
        "#,
    )
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(username)
    .bind(DEFAULT_IAM_ORGANIZATION_ID)
    .fetch_one(pool)
    .await?;
    Ok(count > 0)
}

async fn postgres_bootstrap_admin_seed_complete(
    pool: &PgPool,
    username: &str,
) -> Result<bool, sqlx::Error> {
    let count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM iam_user u
        JOIN iam_organization_member m
          ON m.tenant_id = u.tenant_id
         AND m.user_id = u.id
         AND m.status = 'active'
        JOIN iam_credential c
          ON c.tenant_id = u.tenant_id
         AND c.user_id = u.id
         AND c.credential_type = 'password'
         AND c.status = 'active'
        WHERE u.tenant_id = $1
          AND u.username = $2
          AND u.status = 'active'
          AND m.organization_id = $3
          AND LOWER(COALESCE(m.role_code, '')) = 'admin'
        "#,
    )
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(username)
    .bind(DEFAULT_IAM_ORGANIZATION_ID)
    .fetch_one(pool)
    .await?;
    Ok(count > 0)
}

async fn sqlite_bootstrap_admin_user_id_in_transaction(
    tx: &mut Transaction<'_, Sqlite>,
    username: &str,
) -> Result<Option<String>, sqlx::Error> {
    sqlx::query_scalar(
        r#"
        SELECT id
        FROM iam_user
        WHERE tenant_id = ?
          AND username = ?
        ORDER BY CASE status WHEN 'active' THEN 1 ELSE 0 END DESC,
                 updated_at DESC,
                 id DESC
        LIMIT 1
        "#,
    )
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(username)
    .fetch_optional(&mut **tx)
    .await
}

async fn postgres_bootstrap_admin_user_id_in_transaction(
    tx: &mut Transaction<'_, Postgres>,
    username: &str,
) -> Result<Option<String>, sqlx::Error> {
    sqlx::query_scalar(
        r#"
        SELECT id
        FROM iam_user
        WHERE tenant_id = $1
          AND username = $2
        ORDER BY CASE status WHEN 'active' THEN 1 ELSE 0 END DESC,
                 updated_at DESC,
                 id DESC
        LIMIT 1
        "#,
    )
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(username)
    .fetch_optional(&mut **tx)
    .await
}

async fn sqlite_bootstrap_admin_has_active_password_credential_in_transaction(
    tx: &mut Transaction<'_, Sqlite>,
    user_id: &str,
) -> Result<bool, sqlx::Error> {
    let count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM iam_credential
        WHERE tenant_id = ?
          AND user_id = ?
          AND credential_type = 'password'
          AND status = 'active'
        "#,
    )
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(user_id)
    .fetch_one(&mut **tx)
    .await?;
    Ok(count > 0)
}

async fn postgres_bootstrap_admin_has_active_password_credential_in_transaction(
    tx: &mut Transaction<'_, Postgres>,
    user_id: &str,
) -> Result<bool, sqlx::Error> {
    let count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM iam_credential
        WHERE tenant_id = $1
          AND user_id = $2
          AND credential_type = 'password'
          AND status = 'active'
        "#,
    )
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(user_id)
    .fetch_one(&mut **tx)
    .await?;
    Ok(count > 0)
}

async fn sqlite_bootstrap_admin_member_id_in_transaction(
    tx: &mut Transaction<'_, Sqlite>,
    user_id: &str,
) -> Result<Option<String>, sqlx::Error> {
    sqlx::query_scalar(
        r#"
        SELECT id
        FROM iam_organization_member
        WHERE tenant_id = ?
          AND organization_id = ?
          AND user_id = ?
        LIMIT 1
        "#,
    )
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(DEFAULT_IAM_ORGANIZATION_ID)
    .bind(user_id)
    .fetch_optional(&mut **tx)
    .await
}

async fn postgres_bootstrap_admin_member_id_in_transaction(
    tx: &mut Transaction<'_, Postgres>,
    user_id: &str,
) -> Result<Option<String>, sqlx::Error> {
    sqlx::query_scalar(
        r#"
        SELECT id
        FROM iam_organization_member
        WHERE tenant_id = $1
          AND organization_id = $2
          AND user_id = $3
        LIMIT 1
        "#,
    )
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(DEFAULT_IAM_ORGANIZATION_ID)
    .bind(user_id)
    .fetch_optional(&mut **tx)
    .await
}

async fn sqlite_bootstrap_admin_email_identity_id_in_transaction(
    tx: &mut Transaction<'_, Sqlite>,
    options: &BootstrapAdminOptions,
) -> Result<Option<String>, sqlx::Error> {
    sqlx::query_scalar(
        r#"
        SELECT id
        FROM iam_user_identity
        WHERE tenant_id = ?
          AND provider = 'email'
          AND subject = ?
        LIMIT 1
        "#,
    )
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(&options.email)
    .fetch_optional(&mut **tx)
    .await
}

async fn postgres_bootstrap_admin_email_identity_id_in_transaction(
    tx: &mut Transaction<'_, Postgres>,
    options: &BootstrapAdminOptions,
) -> Result<Option<String>, sqlx::Error> {
    sqlx::query_scalar(
        r#"
        SELECT id
        FROM iam_user_identity
        WHERE tenant_id = $1
          AND provider = 'email'
          AND subject = $2
        LIMIT 1
        "#,
    )
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(&options.email)
    .fetch_optional(&mut **tx)
    .await
}

async fn upsert_sqlite_bootstrap_admin(
    tx: &mut Transaction<'_, Sqlite>,
    options: &BootstrapAdminOptions,
    user_id: &str,
    password_hash: Option<&str>,
    now: &str,
) -> Result<bool, sqlx::Error> {
    sqlx::query(
        r#"
        INSERT INTO iam_user
            (id, tenant_id, username, display_name, email, phone, avatar_url, status, created_at, updated_at)
        VALUES
            (?, ?, ?, ?, ?, '', '', 'active', ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            tenant_id = excluded.tenant_id,
            username = excluded.username,
            display_name = excluded.display_name,
            email = excluded.email,
            status = excluded.status,
            updated_at = excluded.updated_at
        "#,
    )
    .bind(user_id)
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(&options.username)
    .bind(&options.display_name)
    .bind(&options.email)
    .bind(now)
    .bind(now)
    .execute(&mut **tx)
    .await?;

    let member_id = sqlite_bootstrap_admin_member_id_in_transaction(tx, user_id)
        .await?
        .unwrap_or_else(|| format!("member-{user_id}-admin"));
    sqlx::query(
        r#"
        INSERT INTO iam_organization_member
            (id, tenant_id, organization_id, user_id, role_code, status, joined_at)
        VALUES
            (?, ?, ?, ?, 'admin', 'active', ?)
        ON CONFLICT(id) DO UPDATE SET
            tenant_id = excluded.tenant_id,
            organization_id = excluded.organization_id,
            user_id = excluded.user_id,
            role_code = excluded.role_code,
            status = excluded.status
        "#,
    )
    .bind(member_id)
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(DEFAULT_IAM_ORGANIZATION_ID)
    .bind(user_id)
    .bind(now)
    .execute(&mut **tx)
    .await?;

    let mut password_written = false;
    if let Some(password_hash) = password_hash {
        sqlx::query(
            r#"
            INSERT INTO iam_credential
                (id, tenant_id, user_id, credential_type, credential_hash, status, expires_at, created_at, updated_at)
            VALUES
                (?, ?, ?, 'password', ?, 'active', NULL, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                tenant_id = excluded.tenant_id,
                user_id = excluded.user_id,
                credential_type = excluded.credential_type,
                credential_hash = excluded.credential_hash,
                status = excluded.status,
                expires_at = excluded.expires_at,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(format!("credential-{user_id}-bootstrap-password"))
        .bind(DEFAULT_IAM_TENANT_ID)
        .bind(user_id)
        .bind(password_hash)
        .bind(now)
        .bind(now)
        .execute(&mut **tx)
        .await?;
        password_written = true;
    }

    let identity_id = sqlite_bootstrap_admin_email_identity_id_in_transaction(tx, options)
        .await?
        .unwrap_or_else(|| format!("identity-{user_id}-bootstrap-email"));
    sqlx::query(
        r#"
        INSERT INTO iam_user_identity
            (id, tenant_id, user_id, provider, subject, email, created_at)
        VALUES
            (?, ?, ?, 'email', ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            tenant_id = excluded.tenant_id,
            user_id = excluded.user_id,
            provider = excluded.provider,
            subject = excluded.subject,
            email = excluded.email
        "#,
    )
    .bind(identity_id)
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(user_id)
    .bind(&options.email)
    .bind(&options.email)
    .bind(now)
    .execute(&mut **tx)
    .await?;
    Ok(password_written)
}

async fn upsert_postgres_bootstrap_admin(
    tx: &mut Transaction<'_, Postgres>,
    options: &BootstrapAdminOptions,
    user_id: &str,
    password_hash: Option<&str>,
    now: &str,
) -> Result<bool, sqlx::Error> {
    sqlx::query(
        r#"
        INSERT INTO iam_user
            (id, tenant_id, username, display_name, email, phone, avatar_url, status, created_at, updated_at)
        VALUES
            ($1, $2, $3, $4, $5, '', '', 'active', $6::timestamptz, $6::timestamptz)
        ON CONFLICT(id) DO UPDATE SET
            tenant_id = excluded.tenant_id,
            username = excluded.username,
            display_name = excluded.display_name,
            email = excluded.email,
            status = excluded.status,
            updated_at = excluded.updated_at
        "#,
    )
    .bind(user_id)
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(&options.username)
    .bind(&options.display_name)
    .bind(&options.email)
    .bind(now)
    .execute(&mut **tx)
    .await?;

    let member_id = postgres_bootstrap_admin_member_id_in_transaction(tx, user_id)
        .await?
        .unwrap_or_else(|| format!("member-{user_id}-admin"));
    sqlx::query(
        r#"
        INSERT INTO iam_organization_member
            (id, tenant_id, organization_id, user_id, role_code, status, joined_at)
        VALUES
            ($1, $2, $3, $4, 'admin', 'active', $5::timestamptz)
        ON CONFLICT(id) DO UPDATE SET
            tenant_id = excluded.tenant_id,
            organization_id = excluded.organization_id,
            user_id = excluded.user_id,
            role_code = excluded.role_code,
            status = excluded.status
        "#,
    )
    .bind(member_id)
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(DEFAULT_IAM_ORGANIZATION_ID)
    .bind(user_id)
    .bind(now)
    .execute(&mut **tx)
    .await?;

    let mut password_written = false;
    if let Some(password_hash) = password_hash {
        sqlx::query(
            r#"
            INSERT INTO iam_credential
                (id, tenant_id, user_id, credential_type, credential_hash, status, expires_at, created_at, updated_at)
            VALUES
                ($1, $2, $3, 'password', $4, 'active', NULL, $5::timestamptz, $5::timestamptz)
            ON CONFLICT(id) DO UPDATE SET
                tenant_id = excluded.tenant_id,
                user_id = excluded.user_id,
                credential_type = excluded.credential_type,
                credential_hash = excluded.credential_hash,
                status = excluded.status,
                expires_at = excluded.expires_at,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(format!("credential-{user_id}-bootstrap-password"))
        .bind(DEFAULT_IAM_TENANT_ID)
        .bind(user_id)
        .bind(password_hash)
        .bind(now)
        .execute(&mut **tx)
        .await?;
        password_written = true;
    }

    let identity_id = postgres_bootstrap_admin_email_identity_id_in_transaction(tx, options)
        .await?
        .unwrap_or_else(|| format!("identity-{user_id}-bootstrap-email"));
    sqlx::query(
        r#"
        INSERT INTO iam_user_identity
            (id, tenant_id, user_id, provider, subject, email, created_at)
        VALUES
            ($1, $2, $3, 'email', $4, $5, $6::timestamptz)
        ON CONFLICT(id) DO UPDATE SET
            tenant_id = excluded.tenant_id,
            user_id = excluded.user_id,
            provider = excluded.provider,
            subject = excluded.subject,
            email = excluded.email
        "#,
    )
    .bind(identity_id)
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(user_id)
    .bind(&options.email)
    .bind(&options.email)
    .bind(now)
    .execute(&mut **tx)
    .await?;
    Ok(password_written)
}

async fn maybe_upsert_sqlite_legacy_admin(
    tx: &mut Transaction<'_, Sqlite>,
    options: &BootstrapAdminOptions,
    user_id: &str,
    now: &str,
) -> Result<(), sqlx::Error> {
    if !sqlite_table_exists_in_transaction(tx, "plus_user").await? {
        return Ok(());
    }
    sqlx::query(
        r#"
        INSERT INTO plus_user
            (id, uuid, tenant_id, organization_id, created_at, updated_at, v, username, nickname, password, platform, type, email, status)
        VALUES
            (?, ?, ?, ?, ?, ?, 0, ?, ?, '', 0, 1, ?, 1)
        ON CONFLICT(id) DO UPDATE SET
            uuid = excluded.uuid,
            tenant_id = excluded.tenant_id,
            organization_id = excluded.organization_id,
            username = excluded.username,
            nickname = excluded.nickname,
            email = excluded.email,
            status = excluded.status,
            updated_at = excluded.updated_at
        "#,
    )
    .bind(user_id)
    .bind(format!("bootstrap-admin-{user_id}"))
    .bind(DEFAULT_IAM_TENANT_ID.parse::<i64>().unwrap_or(10))
    .bind(DEFAULT_IAM_ORGANIZATION_ID.parse::<i64>().unwrap_or(20))
    .bind(now)
    .bind(now)
    .bind(&options.username)
    .bind(&options.display_name)
    .bind(&options.email)
    .execute(&mut **tx)
    .await?;

    if sqlite_table_exists_in_transaction(tx, "plus_role").await? {
        ensure_sqlite_legacy_admin_role(tx, now).await?;
    }
    let has_plus_user_role = sqlite_table_exists_in_transaction(tx, "plus_user_role").await?;
    let has_plus_role = sqlite_table_exists_in_transaction(tx, "plus_role").await?;
    if has_plus_user_role && has_plus_role {
        let legacy_user_id = user_id.parse::<i64>().unwrap_or(0);
        sqlx::query("DELETE FROM plus_user_role WHERE user_id = ?")
            .bind(legacy_user_id)
            .execute(&mut **tx)
            .await?;
        sqlx::query(
            r#"
            INSERT INTO plus_user_role
                (user_id, role_id, created_at, updated_at, operator_id)
            SELECT ?, r.id, ?, ?, 0
            FROM plus_role r
            WHERE r.code = 'admin'
            LIMIT 1
            "#,
        )
        .bind(legacy_user_id)
        .bind(now)
        .bind(now)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn maybe_upsert_postgres_legacy_admin(
    tx: &mut Transaction<'_, Postgres>,
    options: &BootstrapAdminOptions,
    user_id: &str,
    now: &str,
) -> Result<(), sqlx::Error> {
    if !postgres_table_exists_in_transaction(tx, "plus_user").await? {
        return Ok(());
    }
    sqlx::query(
        r#"
        INSERT INTO plus_user
            (id, uuid, tenant_id, organization_id, created_at, updated_at, v, username, nickname, password, platform, type, email, status)
        VALUES
            ($1, $2, $3, $4, $5::timestamptz, $5::timestamptz, 0, $6, $7, '', 0, 1, $8, 1)
        ON CONFLICT(id) DO UPDATE SET
            uuid = excluded.uuid,
            tenant_id = excluded.tenant_id,
            organization_id = excluded.organization_id,
            username = excluded.username,
            nickname = excluded.nickname,
            email = excluded.email,
            status = excluded.status,
            updated_at = excluded.updated_at
        "#,
    )
    .bind(user_id.parse::<i64>().unwrap_or(1))
    .bind(format!("bootstrap-admin-{user_id}"))
    .bind(DEFAULT_IAM_TENANT_ID.parse::<i64>().unwrap_or(10))
    .bind(DEFAULT_IAM_ORGANIZATION_ID.parse::<i64>().unwrap_or(20))
    .bind(now)
    .bind(&options.username)
    .bind(&options.display_name)
    .bind(&options.email)
    .execute(&mut **tx)
    .await?;

    if postgres_table_exists_in_transaction(tx, "plus_role").await? {
        ensure_postgres_legacy_admin_role(tx, now).await?;
    }
    let has_plus_user_role = postgres_table_exists_in_transaction(tx, "plus_user_role").await?;
    let has_plus_role = postgres_table_exists_in_transaction(tx, "plus_role").await?;
    if has_plus_user_role && has_plus_role {
        let legacy_user_id = user_id.parse::<i64>().unwrap_or(0);
        sqlx::query("DELETE FROM plus_user_role WHERE user_id = $1")
            .bind(legacy_user_id)
            .execute(&mut **tx)
            .await?;
        sqlx::query(
            r#"
            INSERT INTO plus_user_role
                (user_id, role_id, created_at, updated_at, operator_id)
            SELECT $1, r.id, $2::timestamptz, $2::timestamptz, 0
            FROM plus_role r
            WHERE r.code = 'admin'
            LIMIT 1
            "#,
        )
        .bind(legacy_user_id)
        .bind(now)
        .execute(&mut **tx)
        .await?;
    }
    Ok(())
}

async fn ensure_sqlite_legacy_admin_role(
    tx: &mut Transaction<'_, Sqlite>,
    now: &str,
) -> Result<(), sqlx::Error> {
    let existing: Option<i64> =
        sqlx::query_scalar("SELECT id FROM plus_role WHERE code = 'admin' LIMIT 1")
            .fetch_optional(&mut **tx)
            .await?;
    if existing.is_some() {
        return Ok(());
    }
    sqlx::query(
        r#"
        INSERT INTO plus_role
            (uuid, created_at, updated_at, v, code, name, status)
        VALUES
            ('role-admin', ?, ?, 0, 'admin', 'admin', 1)
        "#,
    )
    .bind(now)
    .bind(now)
    .execute(&mut **tx)
    .await?;
    Ok(())
}

async fn ensure_postgres_legacy_admin_role(
    tx: &mut Transaction<'_, Postgres>,
    now: &str,
) -> Result<(), sqlx::Error> {
    let existing: Option<i64> =
        sqlx::query_scalar("SELECT id FROM plus_role WHERE code = 'admin' LIMIT 1 FOR UPDATE")
            .fetch_optional(&mut **tx)
            .await?;
    if existing.is_some() {
        return Ok(());
    }
    sqlx::query(
        r#"
        INSERT INTO plus_role
            (uuid, created_at, updated_at, v, code, name, status)
        VALUES
            ('role-admin', $1::timestamptz, $1::timestamptz, 0, 'admin', 'admin', 1)
        "#,
    )
    .bind(now)
    .execute(&mut **tx)
    .await?;
    Ok(())
}

async fn sqlite_table_exists(pool: &SqlitePool, table_name: &str) -> Result<bool, sqlx::Error> {
    let count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM sqlite_master
        WHERE type = 'table'
          AND name = ?
        "#,
    )
    .bind(table_name)
    .fetch_one(pool)
    .await?;
    Ok(count == 1)
}

async fn sqlite_table_exists_in_transaction(
    tx: &mut Transaction<'_, Sqlite>,
    table_name: &str,
) -> Result<bool, sqlx::Error> {
    let count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM sqlite_master
        WHERE type = 'table'
          AND name = ?
        "#,
    )
    .bind(table_name)
    .fetch_one(&mut **tx)
    .await?;
    Ok(count == 1)
}

async fn postgres_table_exists(pool: &PgPool, table_name: &str) -> Result<bool, sqlx::Error> {
    let count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM information_schema.tables
        WHERE table_schema = current_schema()
          AND table_name = $1
        "#,
    )
    .bind(table_name)
    .fetch_one(pool)
    .await?;
    Ok(count == 1)
}

async fn postgres_table_exists_in_transaction(
    tx: &mut Transaction<'_, Postgres>,
    table_name: &str,
) -> Result<bool, sqlx::Error> {
    let count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM information_schema.tables
        WHERE table_schema = current_schema()
          AND table_name = $1
        "#,
    )
    .bind(table_name)
    .fetch_one(&mut **tx)
    .await?;
    Ok(count == 1)
}

async fn sqlite_generated_schema_tables_exist(pool: &SqlitePool) -> Result<bool, sqlx::Error> {
    let installed_tables = sqlite_string_set(
        pool,
        r#"
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
        "#,
    )
    .await?;
    Ok(generated_schema_table_names().is_subset(&installed_tables))
}

async fn postgres_generated_schema_tables_exist(pool: &PgPool) -> Result<bool, sqlx::Error> {
    let installed_tables = postgres_string_set(
        pool,
        r#"
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = current_schema()
          AND table_type = 'BASE TABLE'
        "#,
    )
    .await?;
    Ok(generated_schema_table_names().is_subset(&installed_tables))
}

async fn sqlite_generated_schema_indexes_exist(pool: &SqlitePool) -> Result<bool, sqlx::Error> {
    let installed_indexes = sqlite_string_set(
        pool,
        r#"
        SELECT name
        FROM sqlite_master
        WHERE type = 'index'
        "#,
    )
    .await?;
    Ok(generated_schema_index_names().is_subset(&installed_indexes))
}

async fn postgres_generated_schema_indexes_exist(pool: &PgPool) -> Result<bool, sqlx::Error> {
    let installed_indexes = postgres_string_set(
        pool,
        r#"
        SELECT indexname
        FROM pg_indexes
        WHERE schemaname = current_schema()
        "#,
    )
    .await?;
    Ok(generated_schema_index_names().is_subset(&installed_indexes))
}

async fn sqlite_refresh_schema_needs_prepare(
    pool: &SqlitePool,
    options: &DatabaseInstallOptions,
) -> Result<bool, DatabaseInstallError> {
    if !sqlite_table_exists(pool, "system_installation_state").await? {
        return Ok(true);
    }
    if !sqlite_generated_schema_tables_exist(pool).await? {
        return Ok(true);
    }
    if !sqlite_generated_schema_indexes_exist(pool).await? {
        return Ok(true);
    }
    let Some(row) = sqlx::query(
        r#"
        SELECT schema_version, seed_profile, environment
        FROM system_installation_state
        WHERE id = 1
        "#,
    )
    .fetch_optional(pool)
    .await?
    else {
        return Ok(true);
    };
    Ok(
        row.get::<String, _>("schema_version") != CURRENT_SCHEMA_VERSION
            || row.get::<String, _>("seed_profile") != options.seed_profile
            || row.get::<String, _>("environment") != options.environment,
    )
}

async fn postgres_refresh_schema_needs_prepare(
    pool: &PgPool,
    options: &DatabaseInstallOptions,
) -> Result<bool, DatabaseInstallError> {
    if !postgres_table_exists(pool, "system_installation_state").await? {
        return Ok(true);
    }
    if !postgres_generated_schema_tables_exist(pool).await? {
        return Ok(true);
    }
    if !postgres_generated_schema_indexes_exist(pool).await? {
        return Ok(true);
    }
    let Some(row) = sqlx::query(
        r#"
        SELECT schema_version, seed_profile, environment
        FROM system_installation_state
        WHERE id = 1
        "#,
    )
    .fetch_optional(pool)
    .await?
    else {
        return Ok(true);
    };
    Ok(
        row.get::<String, _>("schema_version") != CURRENT_SCHEMA_VERSION
            || row.get::<String, _>("seed_profile") != options.seed_profile
            || row.get::<String, _>("environment") != options.environment,
    )
}

async fn sqlite_persisted_models_catalog_root(
    pool: &SqlitePool,
) -> Result<Option<String>, sqlx::Error> {
    if !sqlite_table_exists(pool, "system_installation_state").await? {
        return Ok(None);
    }
    let metadata = sqlx::query_scalar::<_, String>(
        r#"
        SELECT COALESCE(CAST(metadata AS TEXT), '{}')
        FROM system_installation_state
        WHERE id = 1
        "#,
    )
    .fetch_optional(pool)
    .await?;
    Ok(metadata
        .as_deref()
        .and_then(persisted_models_catalog_root_from_metadata))
}

async fn postgres_persisted_models_catalog_root(
    pool: &PgPool,
) -> Result<Option<String>, sqlx::Error> {
    if !postgres_table_exists(pool, "system_installation_state").await? {
        return Ok(None);
    }
    let metadata = sqlx::query_scalar::<_, String>(
        r#"
        SELECT COALESCE(metadata::text, '{}')
        FROM system_installation_state
        WHERE id = 1
        "#,
    )
    .fetch_optional(pool)
    .await?;
    Ok(metadata
        .as_deref()
        .and_then(persisted_models_catalog_root_from_metadata))
}

async fn sqlite_installation_catalog_version(
    pool: &SqlitePool,
) -> Result<Option<String>, sqlx::Error> {
    if !sqlite_table_exists(pool, "system_installation_state").await? {
        return Ok(None);
    }
    sqlx::query_scalar(
        r#"
        SELECT catalog_version
        FROM system_installation_state
        WHERE id = 1
        "#,
    )
    .fetch_optional(pool)
    .await
}

async fn postgres_installation_catalog_version(
    pool: &PgPool,
) -> Result<Option<String>, sqlx::Error> {
    if !postgres_table_exists(pool, "system_installation_state").await? {
        return Ok(None);
    }
    sqlx::query_scalar(
        r#"
        SELECT catalog_version
        FROM system_installation_state
        WHERE id = 1
        "#,
    )
    .fetch_optional(pool)
    .await
}

async fn sqlite_last_catalog_refresh_status(pool: &SqlitePool) -> Result<String, sqlx::Error> {
    if !sqlite_table_exists(pool, "ai_model_catalog_sync_run").await? {
        return Ok("not_run".to_owned());
    }
    let Some(row) = sqlx::query(
        r#"
        SELECT run_status, COALESCE(CAST(metadata AS TEXT), '') AS metadata
        FROM ai_model_catalog_sync_run
        ORDER BY started_at DESC, id DESC
        LIMIT 1
        "#,
    )
    .fetch_optional(pool)
    .await?
    else {
        return Ok("not_run".to_owned());
    };

    let run_status = row.try_get::<i32, _>("run_status").unwrap_or_default();
    let metadata = row.try_get::<String, _>("metadata").unwrap_or_default();
    Ok(catalog_refresh_status_code(run_status, metadata.as_str()))
}

async fn postgres_last_catalog_refresh_status(pool: &PgPool) -> Result<String, sqlx::Error> {
    if !postgres_table_exists(pool, "ai_model_catalog_sync_run").await? {
        return Ok("not_run".to_owned());
    }
    let Some(row) = sqlx::query(
        r#"
        SELECT run_status, COALESCE(metadata::text, '') AS metadata
        FROM ai_model_catalog_sync_run
        ORDER BY started_at DESC, id DESC
        LIMIT 1
        "#,
    )
    .fetch_optional(pool)
    .await?
    else {
        return Ok("not_run".to_owned());
    };

    let run_status = row.try_get::<i32, _>("run_status").unwrap_or_default();
    let metadata = row.try_get::<String, _>("metadata").unwrap_or_default();
    Ok(catalog_refresh_status_code(run_status, metadata.as_str()))
}

fn catalog_refresh_status_code(run_status: i32, metadata: &str) -> String {
    if run_status != 1 {
        return "failed".to_owned();
    }
    if catalog_refresh_metadata_is_dry_run(metadata) {
        return "dry_run".to_owned();
    }
    "success".to_owned()
}

fn catalog_refresh_metadata_is_dry_run(metadata: &str) -> bool {
    let Ok(value) = serde_json::from_str::<serde_json::Value>(metadata) else {
        return false;
    };
    value
        .get("dryRun")
        .and_then(serde_json::Value::as_bool)
        .unwrap_or(false)
        || value
            .get("syncMode")
            .and_then(serde_json::Value::as_str)
            .is_some_and(|mode| mode == "dry_run")
}

async fn sqlite_record_failed_catalog_refresh(
    pool: &SqlitePool,
    options: &CatalogRefreshOptions,
    catalog_root: Option<&str>,
    catalog_version: &str,
    error: &DatabaseInstallError,
) -> Result<(), sqlx::Error> {
    let now = current_utc_timestamp_string();
    let failed = failed_catalog_refresh_row(options, catalog_root, catalog_version, error, &now);
    sqlx::query(
        r#"
        INSERT INTO ai_model_catalog_sync_run
            (uuid, tenant_id, organization_id, source_type, source_id, source_version, status, metadata, source_code, vendor_code, provider_code, run_status, started_at, finished_at, observed_at, catalog_version, source_hash, observed_model_count, accepted_count, rejected_count, change_summary, error_message_masked)
        VALUES
            (?, ?, ?, 'manual_refresh', NULL, 1, 1, ?, ?, 'mixed', NULL, ?, ?, ?, ?, ?, ?, 0, 0, 1, ?, ?)
        "#,
    )
    .bind(&failed.uuid)
    .bind(SYSTEM_REFRESH_TENANT_ID)
    .bind(SYSTEM_REFRESH_ORGANIZATION_ID)
    .bind(&failed.metadata)
    .bind(&failed.source_code)
    .bind(failed.run_status)
    .bind(&failed.started_at)
    .bind(&failed.started_at)
    .bind(&failed.started_at)
    .bind(&failed.catalog_version)
    .bind(&failed.source_hash)
    .bind(&failed.change_summary)
    .bind(&failed.error_message_masked)
    .execute(pool)
    .await?;
    Ok(())
}

async fn postgres_record_failed_catalog_refresh(
    pool: &PgPool,
    options: &CatalogRefreshOptions,
    catalog_root: Option<&str>,
    catalog_version: &str,
    error: &DatabaseInstallError,
) -> Result<(), sqlx::Error> {
    let now = current_utc_timestamp_string();
    let failed = failed_catalog_refresh_row(options, catalog_root, catalog_version, error, &now);
    sqlx::query(
        r#"
        INSERT INTO ai_model_catalog_sync_run
            (uuid, tenant_id, organization_id, source_type, source_id, source_version, status, metadata, source_code, vendor_code, provider_code, run_status, started_at, finished_at, observed_at, catalog_version, source_hash, observed_model_count, accepted_count, rejected_count, change_summary, error_message_masked)
        VALUES
            ($1, $2, $3, 'manual_refresh', NULL, 1, 1, $4::jsonb, $5, 'mixed', NULL, $6, $7::timestamptz, $8::timestamptz, $9::timestamptz, $10, $11, 0, 0, 1, $12::jsonb, $13)
        "#,
    )
    .bind(&failed.uuid)
    .bind(SYSTEM_REFRESH_TENANT_ID)
    .bind(SYSTEM_REFRESH_ORGANIZATION_ID)
    .bind(&failed.metadata)
    .bind(&failed.source_code)
    .bind(failed.run_status)
    .bind(&failed.started_at)
    .bind(&failed.started_at)
    .bind(&failed.started_at)
    .bind(&failed.catalog_version)
    .bind(&failed.source_hash)
    .bind(&failed.change_summary)
    .bind(&failed.error_message_masked)
    .execute(pool)
    .await?;
    Ok(())
}

struct FailedCatalogRefreshRow {
    uuid: String,
    source_code: String,
    run_status: i32,
    started_at: String,
    catalog_version: String,
    source_hash: String,
    metadata: String,
    change_summary: String,
    error_message_masked: String,
}

fn failed_catalog_refresh_row(
    options: &CatalogRefreshOptions,
    catalog_root: Option<&str>,
    catalog_version: &str,
    error: &DatabaseInstallError,
    now: &str,
) -> FailedCatalogRefreshRow {
    let source_code = normalize_failed_refresh_source_code(&options.source);
    let error_message_masked = truncate_error_message(error.to_string().as_str());
    let source_hash = sha256_hex(
        format!(
            "{}:{}:{}:{}",
            source_code, options.mode, catalog_version, error_message_masked
        )
        .as_str(),
    );
    let uuid = format!(
        "catalog-sync-failed-{}",
        catalog_refresh_id(&source_code, &options.mode, &options.vendor_codes)
    );
    let metadata = serde_json::json!({
        "source": options.source,
        "catalogRoot": catalog_root,
        "requestedCatalogVersion": options.catalog_version,
        "catalogVersion": catalog_version,
        "syncMode": options.mode,
        "vendorCodes": options.vendor_codes,
        "force": options.force,
        "dryRun": options.mode == "dry_run",
        "error": error_message_masked,
    })
    .to_string();
    let change_summary = serde_json::json!({
        "vendors": "failed",
        "models": 0,
        "accepted": 0,
        "rejected": 1,
        "mode": options.mode,
        "vendorCodes": options.vendor_codes,
        "force": options.force,
        "catalogVersion": catalog_version,
        "error": error_message_masked,
    })
    .to_string();

    FailedCatalogRefreshRow {
        uuid,
        source_code,
        run_status: 2,
        started_at: now.to_owned(),
        catalog_version: catalog_version.to_owned(),
        source_hash,
        metadata,
        change_summary,
        error_message_masked,
    }
}

fn normalize_failed_refresh_source_code(source: &str) -> String {
    let normalized = source
        .trim()
        .to_ascii_lowercase()
        .chars()
        .map(|character| {
            if character.is_ascii_alphanumeric() || matches!(character, '-' | '_') {
                character
            } else {
                '_'
            }
        })
        .collect::<String>();
    if normalized.is_empty() {
        DEFAULT_CATALOG_REFRESH_SOURCE.to_owned()
    } else {
        normalized.chars().take(96).collect()
    }
}

fn truncate_error_message(message: &str) -> String {
    message.chars().take(1024).collect()
}

async fn sqlite_sdkwork_models_catalog_complete(
    pool: &SqlitePool,
    spec: &CatalogCompletenessSpec,
) -> Result<bool, sqlx::Error> {
    let vendor_codes = sqlite_string_set(
        pool,
        r#"
        SELECT DISTINCT vendor_code
        FROM ai_model_vendor_region
        WHERE status = 1
          AND deleted_at IS NULL
        "#,
    )
    .await?;
    let family_keys = sqlite_model_family_keys(pool).await?;
    let catalog_keys = sqlite_string_set(
        pool,
        r#"
        SELECT DISTINCT catalog_key
        FROM ai_model
        WHERE status = 1
          AND deleted_at IS NULL
        "#,
    )
    .await?;
    let capability_keys = sqlite_model_capability_keys(pool).await?;
    let meter_codes = sqlite_string_set(
        pool,
        r#"
        SELECT DISTINCT meter_code
        FROM ai_billing_meter
        WHERE status = 1
          AND deleted_at IS NULL
        "#,
    )
    .await?;
    let price_keys = sqlite_model_price_keys(pool).await?;
    let ranking_keys = sqlite_model_ranking_keys(pool).await?;

    Ok(spec.vendor_codes.is_subset(&vendor_codes)
        && spec.family_keys.is_subset(&family_keys)
        && spec.catalog_keys.is_subset(&catalog_keys)
        && spec.capability_keys.is_subset(&capability_keys)
        && spec.meter_codes.is_subset(&meter_codes)
        && spec.price_keys.is_subset(&price_keys)
        && spec.ranking_keys.is_subset(&ranking_keys))
}

async fn postgres_sdkwork_models_catalog_complete(
    pool: &PgPool,
    spec: &CatalogCompletenessSpec,
) -> Result<bool, sqlx::Error> {
    let vendor_codes = postgres_string_set(
        pool,
        r#"
        SELECT DISTINCT vendor_code
        FROM ai_model_vendor_region
        WHERE status = 1
          AND deleted_at IS NULL
        "#,
    )
    .await?;
    let family_keys = postgres_model_family_keys(pool).await?;
    let catalog_keys = postgres_string_set(
        pool,
        r#"
        SELECT DISTINCT catalog_key
        FROM ai_model
        WHERE status = 1
          AND deleted_at IS NULL
        "#,
    )
    .await?;
    let capability_keys = postgres_model_capability_keys(pool).await?;
    let meter_codes = postgres_string_set(
        pool,
        r#"
        SELECT DISTINCT meter_code
        FROM ai_billing_meter
        WHERE status = 1
          AND deleted_at IS NULL
        "#,
    )
    .await?;
    let price_keys = postgres_model_price_keys(pool).await?;
    let ranking_keys = postgres_model_ranking_keys(pool).await?;

    Ok(spec.vendor_codes.is_subset(&vendor_codes)
        && spec.family_keys.is_subset(&family_keys)
        && spec.catalog_keys.is_subset(&catalog_keys)
        && spec.capability_keys.is_subset(&capability_keys)
        && spec.meter_codes.is_subset(&meter_codes)
        && spec.price_keys.is_subset(&price_keys)
        && spec.ranking_keys.is_subset(&ranking_keys))
}

async fn sqlite_string_set(
    pool: &SqlitePool,
    query: &str,
) -> Result<BTreeSet<String>, sqlx::Error> {
    let rows = sqlx::query(query).fetch_all(pool).await?;
    Ok(rows
        .into_iter()
        .filter_map(|row| row.try_get::<String, _>(0).ok())
        .collect())
}

async fn postgres_string_set(pool: &PgPool, query: &str) -> Result<BTreeSet<String>, sqlx::Error> {
    let rows = sqlx::query(query).fetch_all(pool).await?;
    Ok(rows
        .into_iter()
        .filter_map(|row| row.try_get::<String, _>(0).ok())
        .collect())
}

async fn sqlite_model_family_keys(
    pool: &SqlitePool,
) -> Result<BTreeSet<ModelFamilyCompletenessKey>, sqlx::Error> {
    let rows = sqlx::query(
        r#"
        SELECT vendor_code, region_code, family_code
        FROM ai_model_family
        WHERE status = 1
          AND deleted_at IS NULL
        "#,
    )
    .fetch_all(pool)
    .await?;
    Ok(rows
        .into_iter()
        .map(|row| ModelFamilyCompletenessKey {
            vendor_code: row.try_get::<String, _>("vendor_code").unwrap_or_default(),
            region_code: row.try_get::<String, _>("region_code").unwrap_or_default(),
            family_code: row.try_get::<String, _>("family_code").unwrap_or_default(),
        })
        .collect())
}

async fn postgres_model_family_keys(
    pool: &PgPool,
) -> Result<BTreeSet<ModelFamilyCompletenessKey>, sqlx::Error> {
    let rows = sqlx::query(
        r#"
        SELECT vendor_code, region_code, family_code
        FROM ai_model_family
        WHERE status = 1
          AND deleted_at IS NULL
        "#,
    )
    .fetch_all(pool)
    .await?;
    Ok(rows
        .into_iter()
        .map(|row| ModelFamilyCompletenessKey {
            vendor_code: row.try_get::<String, _>("vendor_code").unwrap_or_default(),
            region_code: row.try_get::<String, _>("region_code").unwrap_or_default(),
            family_code: row.try_get::<String, _>("family_code").unwrap_or_default(),
        })
        .collect())
}

async fn sqlite_model_capability_keys(
    pool: &SqlitePool,
) -> Result<BTreeSet<ModelCapabilityCompletenessKey>, sqlx::Error> {
    let rows = sqlx::query(
        r#"
        SELECT catalog_key, capability, capability_code, modality
        FROM ai_model_capability
        WHERE status = 1
          AND deleted_at IS NULL
        "#,
    )
    .fetch_all(pool)
    .await?;
    Ok(rows
        .into_iter()
        .map(|row| ModelCapabilityCompletenessKey {
            catalog_key: row.try_get::<String, _>("catalog_key").unwrap_or_default(),
            capability: row.try_get::<i32, _>("capability").unwrap_or_default(),
            capability_code: row
                .try_get::<String, _>("capability_code")
                .unwrap_or_default(),
            modality: row.try_get::<i32, _>("modality").unwrap_or_default(),
        })
        .collect())
}

async fn postgres_model_capability_keys(
    pool: &PgPool,
) -> Result<BTreeSet<ModelCapabilityCompletenessKey>, sqlx::Error> {
    let rows = sqlx::query(
        r#"
        SELECT catalog_key, capability, capability_code, modality
        FROM ai_model_capability
        WHERE status = 1
          AND deleted_at IS NULL
        "#,
    )
    .fetch_all(pool)
    .await?;
    Ok(rows
        .into_iter()
        .map(|row| ModelCapabilityCompletenessKey {
            catalog_key: row.try_get::<String, _>("catalog_key").unwrap_or_default(),
            capability: row.try_get::<i32, _>("capability").unwrap_or_default(),
            capability_code: row
                .try_get::<String, _>("capability_code")
                .unwrap_or_default(),
            modality: row.try_get::<i32, _>("modality").unwrap_or_default(),
        })
        .collect())
}

async fn sqlite_model_price_keys(
    pool: &SqlitePool,
) -> Result<BTreeSet<ModelPriceCompletenessKey>, sqlx::Error> {
    let rows = sqlx::query(
        r#"
        SELECT catalog_key, billing_meter_code, price_side, pricing_scope
        FROM ai_model_pricing
        WHERE status = 1
          AND deleted_at IS NULL
        "#,
    )
    .fetch_all(pool)
    .await?;
    Ok(rows
        .into_iter()
        .map(|row| ModelPriceCompletenessKey {
            catalog_key: row.try_get::<String, _>("catalog_key").unwrap_or_default(),
            meter_code: row
                .try_get::<String, _>("billing_meter_code")
                .unwrap_or_default(),
            price_side: row.try_get::<i32, _>("price_side").unwrap_or_default(),
            pricing_scope: row.try_get::<i32, _>("pricing_scope").unwrap_or_default(),
        })
        .collect())
}

async fn postgres_model_price_keys(
    pool: &PgPool,
) -> Result<BTreeSet<ModelPriceCompletenessKey>, sqlx::Error> {
    let rows = sqlx::query(
        r#"
        SELECT catalog_key, billing_meter_code, price_side, pricing_scope
        FROM ai_model_pricing
        WHERE status = 1
          AND deleted_at IS NULL
        "#,
    )
    .fetch_all(pool)
    .await?;
    Ok(rows
        .into_iter()
        .map(|row| ModelPriceCompletenessKey {
            catalog_key: row.try_get::<String, _>("catalog_key").unwrap_or_default(),
            meter_code: row
                .try_get::<String, _>("billing_meter_code")
                .unwrap_or_default(),
            price_side: row.try_get::<i32, _>("price_side").unwrap_or_default(),
            pricing_scope: row.try_get::<i32, _>("pricing_scope").unwrap_or_default(),
        })
        .collect())
}

async fn sqlite_model_ranking_keys(
    pool: &SqlitePool,
) -> Result<BTreeSet<ModelRankingCompletenessKey>, sqlx::Error> {
    let rows = sqlx::query(
        r#"
        SELECT CAST(snapshot_date AS TEXT) AS snapshot_date, rank_scope, catalog_key
        FROM ai_model_rank_snapshot
        WHERE status = 1
        "#,
    )
    .fetch_all(pool)
    .await?;
    Ok(rows
        .into_iter()
        .map(|row| ModelRankingCompletenessKey {
            snapshot_date: row
                .try_get::<String, _>("snapshot_date")
                .unwrap_or_default(),
            rank_scope: row.try_get::<String, _>("rank_scope").unwrap_or_default(),
            catalog_key: row.try_get::<String, _>("catalog_key").unwrap_or_default(),
        })
        .collect())
}

async fn postgres_model_ranking_keys(
    pool: &PgPool,
) -> Result<BTreeSet<ModelRankingCompletenessKey>, sqlx::Error> {
    let rows = sqlx::query(
        r#"
        SELECT CAST(snapshot_date AS TEXT) AS snapshot_date, rank_scope, catalog_key
        FROM ai_model_rank_snapshot
        WHERE status = 1
        "#,
    )
    .fetch_all(pool)
    .await?;
    Ok(rows
        .into_iter()
        .map(|row| ModelRankingCompletenessKey {
            snapshot_date: row
                .try_get::<String, _>("snapshot_date")
                .unwrap_or_default(),
            rank_scope: row.try_get::<String, _>("rank_scope").unwrap_or_default(),
            catalog_key: row.try_get::<String, _>("catalog_key").unwrap_or_default(),
        })
        .collect())
}

async fn create_sqlite_system_tables(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    for statement in [
        r#"
        CREATE TABLE IF NOT EXISTS system_installation_state (
            id INTEGER PRIMARY KEY,
            installation_id TEXT NOT NULL,
            environment TEXT NOT NULL,
            database_engine TEXT NOT NULL,
            schema_version TEXT NOT NULL,
            catalog_version TEXT NOT NULL,
            seed_profile TEXT NOT NULL,
            status TEXT NOT NULL,
            installed_at TEXT,
            upgraded_at TEXT,
            last_checked_at TEXT,
            metadata TEXT NOT NULL DEFAULT '{}'
        )
        "#,
        r#"
        CREATE TABLE IF NOT EXISTS system_schema_migration (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            migration_key TEXT NOT NULL,
            migration_version TEXT NOT NULL,
            checksum TEXT NOT NULL,
            status TEXT NOT NULL,
            started_at TEXT NOT NULL,
            finished_at TEXT,
            error_message TEXT
        )
        "#,
        r#"
        CREATE UNIQUE INDEX IF NOT EXISTS uk_system_schema_migration_key
        ON system_schema_migration (migration_key)
        "#,
    ] {
        sqlx::query(statement).execute(pool).await?;
    }
    Ok(())
}

async fn create_postgres_system_tables(pool: &PgPool) -> Result<(), sqlx::Error> {
    for statement in [
        r#"
        CREATE TABLE IF NOT EXISTS system_installation_state (
            id BIGINT PRIMARY KEY,
            installation_id VARCHAR(64) NOT NULL,
            environment VARCHAR(64) NOT NULL,
            database_engine VARCHAR(32) NOT NULL,
            schema_version VARCHAR(64) NOT NULL,
            catalog_version VARCHAR(128) NOT NULL,
            seed_profile VARCHAR(64) NOT NULL,
            status VARCHAR(32) NOT NULL,
            installed_at TIMESTAMPTZ,
            upgraded_at TIMESTAMPTZ,
            last_checked_at TIMESTAMPTZ,
            metadata JSONB NOT NULL DEFAULT '{}'::jsonb
        )
        "#,
        r#"
        CREATE TABLE IF NOT EXISTS system_schema_migration (
            id BIGSERIAL PRIMARY KEY,
            migration_key VARCHAR(128) NOT NULL,
            migration_version VARCHAR(128) NOT NULL,
            checksum VARCHAR(128) NOT NULL,
            status VARCHAR(32) NOT NULL,
            started_at TIMESTAMPTZ NOT NULL,
            finished_at TIMESTAMPTZ,
            error_message TEXT
        )
        "#,
        r#"
        CREATE UNIQUE INDEX IF NOT EXISTS uk_system_schema_migration_key
        ON system_schema_migration (migration_key)
        "#,
    ] {
        sqlx::query(statement).execute(pool).await?;
    }
    Ok(())
}

async fn sqlite_upsert_default_iam_subject(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    let now = current_utc_timestamp_string();
    sqlx::query(
        r#"
        INSERT INTO iam_tenant
            (id, code, name, status, created_at, updated_at)
        VALUES
            (?, ?, ?, 'active', ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            code = excluded.code,
            name = excluded.name,
            status = excluded.status,
            updated_at = excluded.updated_at
        "#,
    )
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(DEFAULT_IAM_TENANT_CODE)
    .bind(DEFAULT_IAM_TENANT_NAME)
    .bind(&now)
    .bind(&now)
    .execute(pool)
    .await?;

    sqlx::query(
        r#"
        INSERT INTO iam_organization
            (id, tenant_id, parent_id, code, name, path, status, created_at, updated_at)
        VALUES
            (?, ?, NULL, ?, ?, ?, 'active', ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            tenant_id = excluded.tenant_id,
            parent_id = excluded.parent_id,
            code = excluded.code,
            name = excluded.name,
            path = excluded.path,
            status = excluded.status,
            updated_at = excluded.updated_at
        "#,
    )
    .bind(DEFAULT_IAM_ORGANIZATION_ID)
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(DEFAULT_IAM_ORGANIZATION_CODE)
    .bind(DEFAULT_IAM_ORGANIZATION_NAME)
    .bind(DEFAULT_IAM_ORGANIZATION_PATH)
    .bind(&now)
    .bind(&now)
    .execute(pool)
    .await?;
    Ok(())
}

async fn postgres_upsert_default_iam_subject(pool: &PgPool) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        INSERT INTO iam_tenant
            (id, code, name, status, created_at, updated_at)
        VALUES
            ($1, $2, $3, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
            code = excluded.code,
            name = excluded.name,
            status = excluded.status,
            updated_at = excluded.updated_at
        "#,
    )
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(DEFAULT_IAM_TENANT_CODE)
    .bind(DEFAULT_IAM_TENANT_NAME)
    .execute(pool)
    .await?;

    sqlx::query(
        r#"
        INSERT INTO iam_organization
            (id, tenant_id, parent_id, code, name, path, status, created_at, updated_at)
        VALUES
            ($1, $2, NULL, $3, $4, $5, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
            tenant_id = excluded.tenant_id,
            parent_id = excluded.parent_id,
            code = excluded.code,
            name = excluded.name,
            path = excluded.path,
            status = excluded.status,
            updated_at = excluded.updated_at
        "#,
    )
    .bind(DEFAULT_IAM_ORGANIZATION_ID)
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(DEFAULT_IAM_ORGANIZATION_CODE)
    .bind(DEFAULT_IAM_ORGANIZATION_NAME)
    .bind(DEFAULT_IAM_ORGANIZATION_PATH)
    .execute(pool)
    .await?;
    Ok(())
}

async fn upsert_sqlite_installing_state(
    pool: &SqlitePool,
    options: &DatabaseInstallOptions,
    catalog_version: &str,
) -> Result<(), sqlx::Error> {
    let metadata = installation_metadata(options);
    sqlx::query(
        r#"
        INSERT INTO system_installation_state
            (id, installation_id, environment, database_engine, schema_version, catalog_version, seed_profile, status, installed_at, upgraded_at, metadata)
        VALUES
            (1, 'sdkwork-claw-router', ?, 'sqlite', ?, ?, ?, 'installing', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)
        ON CONFLICT(id) DO UPDATE SET
            environment = excluded.environment,
            schema_version = excluded.schema_version,
            catalog_version = excluded.catalog_version,
            seed_profile = excluded.seed_profile,
            status = excluded.status,
            metadata = excluded.metadata,
            upgraded_at = CURRENT_TIMESTAMP
        "#,
    )
    .bind(&options.environment)
    .bind(CURRENT_SCHEMA_VERSION)
    .bind(catalog_version)
    .bind(&options.seed_profile)
    .bind(&metadata)
    .execute(pool)
    .await?;
    Ok(())
}

async fn upsert_postgres_installing_state(
    pool: &PgPool,
    options: &DatabaseInstallOptions,
    catalog_version: &str,
) -> Result<(), sqlx::Error> {
    let metadata = installation_metadata(options);
    sqlx::query(
        r#"
        INSERT INTO system_installation_state
            (id, installation_id, environment, database_engine, schema_version, catalog_version, seed_profile, status, installed_at, upgraded_at, metadata)
        VALUES
            (1, 'sdkwork-claw-router', $1, 'postgres', $2, $3, $4, 'installing', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $5::jsonb)
        ON CONFLICT(id) DO UPDATE SET
            environment = excluded.environment,
            schema_version = excluded.schema_version,
            catalog_version = excluded.catalog_version,
            seed_profile = excluded.seed_profile,
            status = excluded.status,
            metadata = excluded.metadata,
            upgraded_at = CURRENT_TIMESTAMP
        "#,
    )
    .bind(&options.environment)
    .bind(CURRENT_SCHEMA_VERSION)
    .bind(catalog_version)
    .bind(&options.seed_profile)
    .bind(&metadata)
    .execute(pool)
    .await?;
    Ok(())
}

async fn mark_sqlite_installed(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        UPDATE system_installation_state
        SET status = 'installed',
            installed_at = COALESCE(installed_at, CURRENT_TIMESTAMP),
            upgraded_at = CURRENT_TIMESTAMP
        WHERE id = 1
        "#,
    )
    .execute(pool)
    .await?;
    Ok(())
}

async fn mark_sqlite_installed_with_catalog_version(
    pool: &SqlitePool,
    options: &DatabaseInstallOptions,
    catalog_version: &str,
) -> Result<(), sqlx::Error> {
    let metadata = installation_metadata(options);
    sqlx::query(
        r#"
        UPDATE system_installation_state
        SET environment = ?,
            schema_version = ?,
            catalog_version = ?,
            seed_profile = ?,
            status = 'installed',
            metadata = ?,
            installed_at = COALESCE(installed_at, CURRENT_TIMESTAMP),
            upgraded_at = CURRENT_TIMESTAMP
        WHERE id = 1
        "#,
    )
    .bind(&options.environment)
    .bind(CURRENT_SCHEMA_VERSION)
    .bind(catalog_version)
    .bind(&options.seed_profile)
    .bind(&metadata)
    .execute(pool)
    .await?;
    Ok(())
}

async fn mark_postgres_installed(pool: &PgPool) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        UPDATE system_installation_state
        SET status = 'installed',
            installed_at = COALESCE(installed_at, CURRENT_TIMESTAMP),
            upgraded_at = CURRENT_TIMESTAMP
        WHERE id = 1
        "#,
    )
    .execute(pool)
    .await?;
    Ok(())
}

async fn mark_postgres_installed_with_catalog_version(
    pool: &PgPool,
    options: &DatabaseInstallOptions,
    catalog_version: &str,
) -> Result<(), sqlx::Error> {
    let metadata = installation_metadata(options);
    sqlx::query(
        r#"
        UPDATE system_installation_state
        SET environment = $1,
            schema_version = $2,
            catalog_version = $3,
            seed_profile = $4,
            status = 'installed',
            metadata = $5::jsonb,
            installed_at = COALESCE(installed_at, CURRENT_TIMESTAMP),
            upgraded_at = CURRENT_TIMESTAMP
        WHERE id = 1
        "#,
    )
    .bind(&options.environment)
    .bind(CURRENT_SCHEMA_VERSION)
    .bind(catalog_version)
    .bind(&options.seed_profile)
    .bind(&metadata)
    .execute(pool)
    .await?;
    Ok(())
}

async fn record_sqlite_migration_started(
    pool: &SqlitePool,
    key_prefix: &str,
    version: &str,
    payload: &str,
) -> Result<(), sqlx::Error> {
    let migration_key = migration_key(key_prefix, version);
    let checksum = sha256_hex(payload);
    sqlx::query(
        r#"
        INSERT INTO system_schema_migration
            (migration_key, migration_version, checksum, status, started_at)
        VALUES
            (?, ?, ?, 'running', CURRENT_TIMESTAMP)
        ON CONFLICT(migration_key) DO UPDATE SET
            migration_version = excluded.migration_version,
            checksum = excluded.checksum,
            status = excluded.status,
            started_at = CURRENT_TIMESTAMP,
            finished_at = NULL,
            error_message = NULL
        "#,
    )
    .bind(migration_key)
    .bind(version)
    .bind(checksum)
    .execute(pool)
    .await?;
    Ok(())
}

async fn record_postgres_migration_started(
    pool: &PgPool,
    key_prefix: &str,
    version: &str,
    payload: &str,
) -> Result<(), sqlx::Error> {
    let migration_key = migration_key(key_prefix, version);
    let checksum = sha256_hex(payload);
    sqlx::query(
        r#"
        INSERT INTO system_schema_migration
            (migration_key, migration_version, checksum, status, started_at)
        VALUES
            ($1, $2, $3, 'running', CURRENT_TIMESTAMP)
        ON CONFLICT(migration_key) DO UPDATE SET
            migration_version = excluded.migration_version,
            checksum = excluded.checksum,
            status = excluded.status,
            started_at = CURRENT_TIMESTAMP,
            finished_at = NULL,
            error_message = NULL
        "#,
    )
    .bind(migration_key)
    .bind(version)
    .bind(checksum)
    .execute(pool)
    .await?;
    Ok(())
}

async fn record_sqlite_migration_completed(
    pool: &SqlitePool,
    key_prefix: &str,
    version: &str,
    payload: &str,
) -> Result<(), sqlx::Error> {
    let migration_key = migration_key(key_prefix, version);
    let checksum = sha256_hex(payload);
    sqlx::query(
        r#"
        UPDATE system_schema_migration
        SET checksum = ?,
            status = 'completed',
            finished_at = CURRENT_TIMESTAMP,
            error_message = NULL
        WHERE migration_key = ?
        "#,
    )
    .bind(checksum)
    .bind(migration_key)
    .execute(pool)
    .await?;
    Ok(())
}

async fn record_postgres_migration_completed(
    pool: &PgPool,
    key_prefix: &str,
    version: &str,
    payload: &str,
) -> Result<(), sqlx::Error> {
    let migration_key = migration_key(key_prefix, version);
    let checksum = sha256_hex(payload);
    sqlx::query(
        r#"
        UPDATE system_schema_migration
        SET checksum = $1,
            status = 'completed',
            finished_at = CURRENT_TIMESTAMP,
            error_message = NULL
        WHERE migration_key = $2
        "#,
    )
    .bind(checksum)
    .bind(migration_key)
    .execute(pool)
    .await?;
    Ok(())
}

async fn sqlite_seed_migration_payload_current(
    pool: &SqlitePool,
    key_prefix: &str,
    version: &str,
    payload: &str,
) -> Result<bool, sqlx::Error> {
    let expected_checksum = sha256_hex(payload);
    let migration_key = migration_key(key_prefix, version);
    let row = sqlx::query(
        r#"
        SELECT checksum, status
        FROM system_schema_migration
        WHERE migration_key = ?
        "#,
    )
    .bind(migration_key)
    .fetch_optional(pool)
    .await?;
    Ok(row
        .map(|row| {
            row.get::<String, _>("checksum") == expected_checksum
                && row.get::<String, _>("status") == "completed"
        })
        .unwrap_or(false))
}

async fn postgres_seed_migration_payload_current(
    pool: &PgPool,
    key_prefix: &str,
    version: &str,
    payload: &str,
) -> Result<bool, sqlx::Error> {
    let expected_checksum = sha256_hex(payload);
    let migration_key = migration_key(key_prefix, version);
    let row = sqlx::query(
        r#"
        SELECT checksum, status
        FROM system_schema_migration
        WHERE migration_key = $1
        "#,
    )
    .bind(migration_key)
    .fetch_optional(pool)
    .await?;
    Ok(row
        .map(|row| {
            row.get::<String, _>("checksum") == expected_checksum
                && row.get::<String, _>("status") == "completed"
        })
        .unwrap_or(false))
}

fn postgres_schema_statements() -> Vec<String> {
    strip_line_comments(GENERATED_POSTGRES_SCHEMA)
        .split(';')
        .map(str::trim)
        .filter(|statement| !statement.is_empty())
        .map(str::to_owned)
        .collect()
}

fn sqlite_schema_statements() -> Vec<String> {
    strip_line_comments(GENERATED_POSTGRES_SCHEMA)
        .split(';')
        .map(str::trim)
        .filter(|statement| !statement.is_empty())
        .map(postgres_statement_to_sqlite)
        .collect()
}

fn generated_schema_table_names() -> BTreeSet<String> {
    postgres_schema_statements()
        .into_iter()
        .filter_map(|statement| create_table_name(&statement))
        .collect()
}

fn generated_schema_index_names() -> BTreeSet<String> {
    postgres_schema_statements()
        .into_iter()
        .filter_map(|statement| create_index_name(&statement))
        .collect()
}

fn strip_line_comments(sql: &str) -> String {
    sql.lines()
        .filter(|line| !line.trim_start().starts_with("--"))
        .collect::<Vec<_>>()
        .join("\n")
}

fn postgres_statement_to_sqlite(statement: &str) -> String {
    let mut sqlite =
        statement.replace("BIGSERIAL PRIMARY KEY", "INTEGER PRIMARY KEY AUTOINCREMENT");
    sqlite = sqlite.replace("TIMESTAMPTZ", "TEXT");
    sqlite = sqlite.replace("JSONB", "TEXT");
    sqlite = sqlite.replace("BOOLEAN", "INTEGER");
    sqlite = sqlite.replace("BIGINT", "INTEGER");
    sqlite = sqlite.replace("DEFAULT '{}'::jsonb", "DEFAULT '{}'");
    sqlite = sqlite.replace("'{}'::jsonb", "'{}'");
    sqlite = sqlite.replace("'[]'::jsonb", "'[]'");
    sqlite = sqlite.replace("DEFAULT FALSE", "DEFAULT 0");
    sqlite = sqlite.replace("DEFAULT TRUE", "DEFAULT 1");
    sqlite
}

async fn execute_sqlite_statement(pool: &SqlitePool, statement: &str) -> Result<(), sqlx::Error> {
    let statement = statement.trim();
    if statement.is_empty() {
        return Ok(());
    }
    sqlx::query(statement).execute(pool).await?;
    ensure_sqlite_table_columns(pool, statement).await?;
    Ok(())
}

async fn execute_postgres_statement(pool: &PgPool, statement: &str) -> Result<(), sqlx::Error> {
    let statement = statement.trim();
    if statement.is_empty() {
        return Ok(());
    }
    sqlx::query(statement).execute(pool).await?;
    Ok(())
}

async fn ensure_sqlite_table_columns(
    pool: &SqlitePool,
    statement: &str,
) -> Result<(), sqlx::Error> {
    let Some(table) = create_table_name(statement) else {
        return Ok(());
    };
    let columns = sqlite_create_table_columns(statement);
    if columns.is_empty() {
        return Ok(());
    }
    let existing_columns = sqlite_existing_columns(pool, &table).await?;
    for column in columns {
        if existing_columns.contains(&column.name.to_ascii_lowercase()) {
            continue;
        }
        let Some(definition) = sqlite_add_column_definition(&column) else {
            continue;
        };
        let alter = format!(
            "ALTER TABLE {} ADD COLUMN {}",
            quote_sqlite_identifier(&table),
            definition
        );
        sqlx::query(alter.as_str()).execute(pool).await?;
    }
    Ok(())
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct SqliteColumnDefinition {
    name: String,
    rest: String,
}

async fn sqlite_existing_columns(
    pool: &SqlitePool,
    table: &str,
) -> Result<std::collections::BTreeSet<String>, sqlx::Error> {
    let pragma = format!("PRAGMA table_info({})", quote_sqlite_identifier(table));
    let rows = sqlx::query(pragma.as_str()).fetch_all(pool).await?;
    Ok(rows
        .into_iter()
        .filter_map(|row| row.try_get::<String, _>("name").ok())
        .map(|name| name.to_ascii_lowercase())
        .collect())
}

fn create_table_name(statement: &str) -> Option<String> {
    let statement = statement.trim_start();
    if !statement
        .to_ascii_uppercase()
        .starts_with("CREATE TABLE IF NOT EXISTS ")
    {
        return None;
    }
    let rest = statement["CREATE TABLE IF NOT EXISTS ".len()..].trim_start();
    let table = rest
        .split(|ch: char| ch == '(' || ch.is_whitespace())
        .next()
        .unwrap_or_default()
        .trim_matches('"')
        .trim();
    if table.is_empty() {
        None
    } else {
        Some(table.to_owned())
    }
}

fn create_index_name(statement: &str) -> Option<String> {
    let statement = statement.trim_start();
    let upper = statement.to_ascii_uppercase();
    let rest = if upper.starts_with("CREATE UNIQUE INDEX IF NOT EXISTS ") {
        statement["CREATE UNIQUE INDEX IF NOT EXISTS ".len()..].trim_start()
    } else if upper.starts_with("CREATE INDEX IF NOT EXISTS ") {
        statement["CREATE INDEX IF NOT EXISTS ".len()..].trim_start()
    } else {
        return None;
    };
    let index = rest
        .split_whitespace()
        .next()
        .unwrap_or_default()
        .trim_matches('"')
        .trim();
    if index.is_empty() {
        None
    } else {
        Some(index.to_owned())
    }
}

fn sqlite_create_table_columns(statement: &str) -> Vec<SqliteColumnDefinition> {
    let Some(body) = sqlite_create_table_body(statement) else {
        return Vec::new();
    };
    split_sqlite_table_entries(body)
        .into_iter()
        .filter_map(|entry| sqlite_column_definition(entry.as_str()))
        .collect()
}

fn sqlite_create_table_body(statement: &str) -> Option<&str> {
    let open = statement.find('(')?;
    let mut depth = 0usize;
    let mut in_single_quote = false;
    let mut previous = '\0';
    for (index, ch) in statement
        .char_indices()
        .skip_while(|(index, _)| *index < open)
    {
        if ch == '\'' && previous != '\'' {
            in_single_quote = !in_single_quote;
        }
        if !in_single_quote {
            match ch {
                '(' => depth += 1,
                ')' => {
                    depth = depth.saturating_sub(1);
                    if depth == 0 {
                        return Some(&statement[open + 1..index]);
                    }
                }
                _ => {}
            }
        }
        previous = ch;
    }
    None
}

fn split_sqlite_table_entries(body: &str) -> Vec<String> {
    let mut entries = Vec::new();
    let mut start = 0usize;
    let mut depth = 0usize;
    let mut in_single_quote = false;
    let mut previous = '\0';
    for (index, ch) in body.char_indices() {
        if ch == '\'' && previous != '\'' {
            in_single_quote = !in_single_quote;
        }
        if !in_single_quote {
            match ch {
                '(' => depth += 1,
                ')' => depth = depth.saturating_sub(1),
                ',' if depth == 0 => {
                    entries.push(body[start..index].trim().to_owned());
                    start = index + 1;
                }
                _ => {}
            }
        }
        previous = ch;
    }
    let tail = body[start..].trim();
    if !tail.is_empty() {
        entries.push(tail.to_owned());
    }
    entries
}

fn sqlite_column_definition(entry: &str) -> Option<SqliteColumnDefinition> {
    let entry = entry.trim();
    if entry.is_empty() {
        return None;
    }
    let first = entry.split_whitespace().next().unwrap_or_default();
    let upper = first.trim_matches('"').to_ascii_uppercase();
    if matches!(
        upper.as_str(),
        "PRIMARY" | "UNIQUE" | "FOREIGN" | "CONSTRAINT" | "CHECK"
    ) {
        return None;
    }
    let name = first.trim_matches('"').to_owned();
    let rest = entry[first.len()..].trim().to_owned();
    if name.is_empty() || rest.is_empty() {
        None
    } else {
        Some(SqliteColumnDefinition { name, rest })
    }
}

fn sqlite_add_column_definition(column: &SqliteColumnDefinition) -> Option<String> {
    let upper = column.rest.to_ascii_uppercase();
    if upper.contains("PRIMARY KEY") {
        return None;
    }
    let mut rest = column
        .rest
        .replace("DEFAULT CURRENT_TIMESTAMP", "DEFAULT '1970-01-01 00:00:00'");
    let upper = rest.to_ascii_uppercase();
    if upper.contains(" NOT NULL") && !upper.contains(" DEFAULT ") {
        rest.push_str(sqlite_default_for_added_not_null_column(rest.as_str()));
    }
    Some(format!(
        "{} {}",
        quote_sqlite_identifier(&column.name),
        rest.trim()
    ))
}

fn sqlite_default_for_added_not_null_column(rest: &str) -> &'static str {
    let upper = rest.to_ascii_uppercase();
    if upper.contains("CHAR") || upper.contains("TEXT") {
        " DEFAULT ''"
    } else if upper.contains("JSON") {
        " DEFAULT '{}'"
    } else {
        " DEFAULT 0"
    }
}

fn quote_sqlite_identifier(value: &str) -> String {
    format!("\"{}\"", value.replace('"', "\"\""))
}

fn migration_key(prefix: &str, version: &str) -> String {
    format!("{prefix}:{version}")
}

fn sha256_hex(payload: &str) -> String {
    let digest = Sha256::digest(payload.as_bytes());
    format!("{digest:x}")
}

fn catalog_refresh_id(source: &str, mode: &str, vendor_codes: &[String]) -> String {
    let millis = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_millis())
        .unwrap_or(0);
    let sequence = CATALOG_REFRESH_SEQUENCE.fetch_add(1, Ordering::Relaxed);
    catalog_refresh_id_with_entropy(source, mode, vendor_codes, millis, sequence)
}

fn catalog_refresh_id_with_entropy(
    source: &str,
    mode: &str,
    vendor_codes: &[String],
    millis: u128,
    sequence: u64,
) -> String {
    let mut payload = format!("{source}:{mode}:{millis}:{sequence}");
    for vendor_code in vendor_codes {
        payload.push(':');
        payload.push_str(vendor_code);
    }
    sha256_hex(payload.as_str()).chars().take(24).collect()
}

fn current_utc_timestamp_string() -> String {
    let seconds = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0);
    format_unix_timestamp(seconds)
}

fn format_unix_timestamp(seconds: i64) -> String {
    let days = seconds.div_euclid(86_400);
    let seconds_of_day = seconds.rem_euclid(86_400);
    let (year, month, day) = civil_from_days(days);
    let hour = seconds_of_day / 3_600;
    let minute = (seconds_of_day % 3_600) / 60;
    let second = seconds_of_day % 60;
    format!("{year:04}-{month:02}-{day:02}T{hour:02}:{minute:02}:{second:02}Z")
}

fn civil_from_days(days: i64) -> (i64, i64, i64) {
    let days = days + 719_468;
    let era = if days >= 0 { days } else { days - 146_096 } / 146_097;
    let day_of_era = days - era * 146_097;
    let year_of_era =
        (day_of_era - day_of_era / 1_460 + day_of_era / 36_524 - day_of_era / 146_096) / 365;
    let year = year_of_era + era * 400;
    let day_of_year = day_of_era - (365 * year_of_era + year_of_era / 4 - year_of_era / 100);
    let month_prime = (5 * day_of_year + 2) / 153;
    let day = day_of_year - (153 * month_prime + 2) / 5 + 1;
    let month = month_prime + if month_prime < 10 { 3 } else { -9 };
    let year = year + if month <= 2 { 1 } else { 0 };
    (year, month, day)
}

fn normalize_install_code(value: String, name: &str) -> Result<String, DatabaseInstallError> {
    let value = value.trim().to_ascii_lowercase();
    if value.is_empty() {
        return Err(DatabaseInstallError::InvalidState(format!(
            "{name} must not be blank"
        )));
    }
    if value.len() > 64 {
        return Err(DatabaseInstallError::InvalidState(format!(
            "{name} must be 64 characters or fewer"
        )));
    }
    if !value.chars().all(|character| {
        character.is_ascii_lowercase()
            || character.is_ascii_digit()
            || matches!(character, '-' | '_')
    }) {
        return Err(DatabaseInstallError::InvalidState(format!(
            "{name} may only contain lowercase letters, digits, '-' and '_'"
        )));
    }
    Ok(value)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn catalog_refresh_id_uses_sequence_entropy_for_same_timestamp() {
        let vendors = vec!["openai".to_owned()];

        let first =
            catalog_refresh_id_with_entropy("sdkwork_models", "vendor_refresh", &vendors, 42, 1);
        let second =
            catalog_refresh_id_with_entropy("sdkwork_models", "vendor_refresh", &vendors, 42, 2);

        assert_ne!(
            first, second,
            "catalog refresh ids must remain unique for same-millisecond requests"
        );
    }
}
