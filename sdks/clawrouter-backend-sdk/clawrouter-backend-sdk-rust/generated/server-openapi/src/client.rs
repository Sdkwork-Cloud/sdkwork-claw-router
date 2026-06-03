use std::sync::Arc;

use crate::api::{AgentsApi, AiApi, CommerceApi, ContentApi, EcosystemApi, IamApi, IntegrationApi, McpApi, MessagingApi, OpenPlatformApi, PlatformApi, SystemApi, PromptsApi, ServiceProvidersApi, SitesApi, StorageApi};
use crate::http::{SdkworkConfig, SdkworkError, SdkworkHttpClient};

#[derive(Clone)]
pub struct SdkworkBackendClient {
    http: Arc<SdkworkHttpClient>,
}

impl SdkworkBackendClient {
    pub fn new(config: SdkworkConfig) -> Result<Self, SdkworkError> {
        Ok(Self {
            http: Arc::new(SdkworkHttpClient::new(config)?),
        })
    }

    pub fn new_with_base_url(base_url: impl Into<String>) -> Result<Self, SdkworkError> {
        Self::new(SdkworkConfig::new(base_url))
    }

    pub fn set_api_key(&self, api_key: impl Into<String>) -> &Self {
        self.http.set_api_key(api_key);
        self
    }

    pub fn set_auth_token(&self, token: impl Into<String>) -> &Self {
        self.http.set_auth_token(token);
        self
    }

    pub fn set_access_token(&self, token: impl Into<String>) -> &Self {
        self.http.set_access_token(token);
        self
    }

    pub fn set_header(&self, key: impl Into<String>, value: impl Into<String>) -> &Self {
        self.http.set_header(key, value);
        self
    }

    pub fn http_client(&self) -> Arc<SdkworkHttpClient> {
        Arc::clone(&self.http)
    }

    pub fn agents(&self) -> AgentsApi {
            AgentsApi::new(Arc::clone(&self.http))
        }

    pub fn ai(&self) -> AiApi {
            AiApi::new(Arc::clone(&self.http))
        }

    pub fn commerce(&self) -> CommerceApi {
            CommerceApi::new(Arc::clone(&self.http))
        }

    pub fn content(&self) -> ContentApi {
            ContentApi::new(Arc::clone(&self.http))
        }

    pub fn ecosystem(&self) -> EcosystemApi {
            EcosystemApi::new(Arc::clone(&self.http))
        }

    pub fn iam(&self) -> IamApi {
            IamApi::new(Arc::clone(&self.http))
        }

    pub fn integration(&self) -> IntegrationApi {
            IntegrationApi::new(Arc::clone(&self.http))
        }

    pub fn mcp(&self) -> McpApi {
            McpApi::new(Arc::clone(&self.http))
        }

    pub fn messaging(&self) -> MessagingApi {
            MessagingApi::new(Arc::clone(&self.http))
        }

    pub fn open_platform(&self) -> OpenPlatformApi {
            OpenPlatformApi::new(Arc::clone(&self.http))
        }

    pub fn platform(&self) -> PlatformApi {
            PlatformApi::new(Arc::clone(&self.http))
        }

    pub fn system(&self) -> SystemApi {
            SystemApi::new(Arc::clone(&self.http))
        }

    pub fn prompts(&self) -> PromptsApi {
            PromptsApi::new(Arc::clone(&self.http))
        }

    pub fn service_providers(&self) -> ServiceProvidersApi {
            ServiceProvidersApi::new(Arc::clone(&self.http))
        }

    pub fn sites(&self) -> SitesApi {
            SitesApi::new(Arc::clone(&self.http))
        }

    pub fn storage(&self) -> StorageApi {
            StorageApi::new(Arc::clone(&self.http))
        }
}
