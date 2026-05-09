use sqlx::PgPool;

use crate::domain::DomainError;
use crate::infrastructure::sql::catalog::{PricingCatalogRows, SqlPricingCatalogSnapshot};
use crate::infrastructure::sql::postgres::error::PostgresCatalogLoadError;
use crate::infrastructure::sql::postgres::row_mapping;
use crate::infrastructure::sql::PricingCatalogSql;
use crate::ports::{
    ApiKeyManagementReadFuture, GatewayApiKeyManagementReadStore, GatewayApiKeyManagementSnapshot,
};

pub struct PostgresPricingCatalogLoader {
    pool: PgPool,
}

impl PostgresPricingCatalogLoader {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn load_snapshot(
        &self,
    ) -> Result<SqlPricingCatalogSnapshot, PostgresCatalogLoadError> {
        let rows = PricingCatalogRows {
            vendors: row_mapping::load_vendors(&self.pool, PricingCatalogSql::load_vendors())
                .await?,
            models: row_mapping::load_models(&self.pool, PricingCatalogSql::load_models()).await?,
            provider_routes: row_mapping::load_provider_routes(
                &self.pool,
                PricingCatalogSql::load_provider_routes(),
            )
            .await?,
            pricing_plans: row_mapping::load_pricing_plans(
                &self.pool,
                PricingCatalogSql::load_pricing_plans(),
            )
            .await?,
            api_key_groups: row_mapping::load_api_key_groups(
                &self.pool,
                PricingCatalogSql::load_api_key_groups(),
            )
            .await?,
            api_keys: row_mapping::load_api_keys(&self.pool, PricingCatalogSql::load_api_keys())
                .await?,
            access_policies: row_mapping::load_access_policies(
                &self.pool,
                PricingCatalogSql::load_access_policies(),
            )
            .await?,
            quota_policies: row_mapping::load_quota_policies(
                &self.pool,
                PricingCatalogSql::load_quota_policies(),
            )
            .await?,
            api_key_group_metric_snapshots: row_mapping::load_api_key_group_metric_snapshots(
                &self.pool,
                PricingCatalogSql::load_api_key_group_metric_snapshots(),
            )
            .await?,
            prices: row_mapping::load_prices(&self.pool, PricingCatalogSql::load_prices()).await?,
        };
        Ok(SqlPricingCatalogSnapshot::from_rows(rows)?)
    }
}

impl GatewayApiKeyManagementReadStore for PostgresPricingCatalogLoader {
    fn load_gateway_api_key_management_snapshot<'a>(
        &'a self,
    ) -> ApiKeyManagementReadFuture<'a, GatewayApiKeyManagementSnapshot> {
        Box::pin(async move {
            let snapshot = self.load_snapshot().await.map_err(postgres_load_error)?;
            Ok(GatewayApiKeyManagementSnapshot::from_pricing_catalog(
                &snapshot,
            ))
        })
    }
}

fn postgres_load_error(error: PostgresCatalogLoadError) -> DomainError {
    DomainError::new(error.to_string())
}
