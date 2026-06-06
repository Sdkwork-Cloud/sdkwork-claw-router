use std::sync::Arc;

use crate::api::paths::app_path;
use crate::http::{SdkworkError, SdkworkHttpClient};
use crate::models::{RechargesSettingsRetrieveResult};

#[derive(Clone)]
pub struct CommerceApi {
    client: Arc<SdkworkHttpClient>,
}

impl CommerceApi {
    pub fn new(client: Arc<SdkworkHttpClient>) -> Self {
        Self { client }
    }

    /// Recharges Settings Retrieve
    pub async fn recharges_settings_retrieve(&self) -> Result<RechargesSettingsRetrieveResult, SdkworkError> {
        let path = app_path(&"/recharges/settings".to_string());
        self.client.get(&path, None, None).await
    }

}
