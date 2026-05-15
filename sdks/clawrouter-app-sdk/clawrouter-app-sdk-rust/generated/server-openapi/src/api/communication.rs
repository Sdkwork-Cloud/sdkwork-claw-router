use std::sync::Arc;

use crate::api::paths::app_path;
use crate::http::{SdkworkError, SdkworkHttpClient};
use crate::models::{NotificationsListResult};

#[derive(Clone)]
pub struct CommunicationApi {
    client: Arc<SdkworkHttpClient>,
}

impl CommunicationApi {
    pub fn new(client: Arc<SdkworkHttpClient>) -> Self {
        Self { client }
    }

    /// List messages
    pub async fn notifications_list(&self) -> Result<NotificationsListResult, SdkworkError> {
        let path = app_path(&"/communication/notifications".to_string());
        self.client.get(&path, None, None).await
    }

}
