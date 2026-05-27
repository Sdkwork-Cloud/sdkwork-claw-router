use std::sync::Arc;

use crate::api::paths::app_path;
use crate::http::{SdkworkError, SdkworkHttpClient};
use crate::models::{ArchivesCreateResult, DocumentationCreateResult, SdkReferenceArchiveGenerateRequest, SdkReferenceDocumentationGenerateRequest};

#[derive(Clone)]
pub struct SdkReferenceApi {
    client: Arc<SdkworkHttpClient>,
}

impl SdkReferenceApi {
    pub fn new(client: Arc<SdkworkHttpClient>) -> Self {
        Self { client }
    }

    /// Generate SDK archive
    pub async fn archives_create(&self, body: &SdkReferenceArchiveGenerateRequest) -> Result<ArchivesCreateResult, SdkworkError> {
        let path = app_path(&"/sdk_reference/archives".to_string());
        self.client.post(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Generate SDK reference documentation
    pub async fn documentation_create(&self, body: &SdkReferenceDocumentationGenerateRequest) -> Result<DocumentationCreateResult, SdkworkError> {
        let path = app_path(&"/sdk_reference/documentation".to_string());
        self.client.post(&path, Some(body), None, None, Some("application/json")).await
    }

}
