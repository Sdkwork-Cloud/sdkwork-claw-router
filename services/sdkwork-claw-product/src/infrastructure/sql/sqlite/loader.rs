use sqlx::SqlitePool;

use crate::domain::DomainError;
use crate::infrastructure::sql::catalog::{PricingCatalogRows, SqlPricingCatalogSnapshot};
use crate::infrastructure::sql::sqlite::error::SqlCatalogLoadError;
use crate::infrastructure::sql::sqlite::queries;
use crate::infrastructure::sql::sqlite::row_mapping;
use crate::ports::{
    ApiKeyManagementReadFuture, GatewayApiKeyManagementReadStore, GatewayApiKeyManagementSnapshot,
};

pub struct SqlitePricingCatalogLoader {
    pool: SqlitePool,
}

impl SqlitePricingCatalogLoader {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }

    pub async fn load_snapshot(&self) -> Result<SqlPricingCatalogSnapshot, SqlCatalogLoadError> {
        let rows = PricingCatalogRows {
            vendors: row_mapping::load_vendors(&self.pool, queries::LOAD_VENDORS).await?,
            models: row_mapping::load_models(&self.pool, queries::LOAD_MODELS).await?,
            provider_routes: row_mapping::load_provider_routes(
                &self.pool,
                queries::LOAD_PROVIDER_ROUTES,
            )
            .await?,
            pricing_plans: row_mapping::load_pricing_plans(&self.pool, queries::LOAD_PRICING_PLANS)
                .await?,
            api_key_groups: row_mapping::load_api_key_groups(
                &self.pool,
                queries::LOAD_API_KEY_GROUPS,
            )
            .await?,
            api_keys: row_mapping::load_api_keys(&self.pool, queries::LOAD_API_KEYS).await?,
            access_policies: row_mapping::load_access_policies(
                &self.pool,
                queries::LOAD_ACCESS_POLICIES,
            )
            .await?,
            quota_policies: row_mapping::load_quota_policies(
                &self.pool,
                queries::LOAD_QUOTA_POLICIES,
            )
            .await?,
            api_key_group_metric_snapshots: row_mapping::load_api_key_group_metric_snapshots(
                &self.pool,
                queries::LOAD_API_KEY_GROUP_METRIC_SNAPSHOTS,
            )
            .await?,
            prices: row_mapping::load_prices(&self.pool, queries::LOAD_PRICES).await?,
        };
        Ok(SqlPricingCatalogSnapshot::from_rows(rows)?)
    }
}

impl GatewayApiKeyManagementReadStore for SqlitePricingCatalogLoader {
    fn load_gateway_api_key_management_snapshot<'a>(
        &'a self,
    ) -> ApiKeyManagementReadFuture<'a, GatewayApiKeyManagementSnapshot> {
        Box::pin(async move {
            let snapshot = self.load_snapshot().await.map_err(sqlite_load_error)?;
            Ok(GatewayApiKeyManagementSnapshot::from_pricing_catalog(
                &snapshot,
            ))
        })
    }
}

fn sqlite_load_error(error: SqlCatalogLoadError) -> DomainError {
    DomainError::new(error.to_string())
}
