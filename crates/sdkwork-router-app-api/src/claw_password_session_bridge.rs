use std::sync::Arc;

use async_trait::async_trait;
use sdkwork_claw_config::{AppSessionConfig, DeploymentMode};
use sdkwork_clawrouter_router_service::api::{
    authenticate_password_and_issue_iam_session, AppSessionCreateError, IamSessionResponse,
};
use sdkwork_clawrouter_router_service::application::{
    EntityUuidGenerator, IamRuntimeContext, PasswordHasher,
};
use sdkwork_clawrouter_router_service::infrastructure::sql::LegacyGlobalTenantSigningKeyStore;
use sdkwork_clawrouter_router_service::ports::{
    AppAuthStore, AppSessionEventStore, TenantSigningKeyStore,
};
use sdkwork_router_iam_app_api::{PasswordSessionBridge, PasswordSessionBridgeResult};
use serde_json::{json, Value};

pub(crate) struct ClawPasswordSessionBridge {
    auth_store: Arc<dyn AppAuthStore + Send + Sync>,
    password_hasher: Arc<dyn PasswordHasher + Send + Sync>,
    app_session_config: AppSessionConfig,
    iam_runtime: IamRuntimeContext,
    event_store: Arc<dyn AppSessionEventStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    tenant_signing_key_store: Arc<dyn TenantSigningKeyStore + Send + Sync>,
}

impl ClawPasswordSessionBridge {
    pub(crate) fn new(
        auth_store: Arc<dyn AppAuthStore + Send + Sync>,
        password_hasher: Arc<dyn PasswordHasher + Send + Sync>,
        app_session_config: AppSessionConfig,
        event_store: Arc<dyn AppSessionEventStore + Send + Sync>,
        entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
        tenant_signing_key_store: Option<Arc<dyn TenantSigningKeyStore + Send + Sync>>,
    ) -> Self {
        let deployment_mode = DeploymentMode::from_env();
        Self {
            auth_store,
            password_hasher,
            app_session_config: app_session_config.clone(),
            iam_runtime: IamRuntimeContext::from_runtime_toml(deployment_mode, None),
            event_store,
            entity_uuid_generator,
            tenant_signing_key_store: tenant_signing_key_store.unwrap_or_else(|| {
                if deployment_mode.is_production_like() {
                    panic!(
                        "tenant signing key store is required for production-like deployments ({})",
                        deployment_mode.as_str()
                    );
                }
                Arc::new(LegacyGlobalTenantSigningKeyStore::from_app_session_config(
                    &app_session_config,
                ))
            }),
        }
    }

    fn session_json_from_response(response: &IamSessionResponse) -> Value {
        let mut value = serde_json::to_value(response).expect("iam session response serializes");
        if let Some(user) = value.get_mut("user").and_then(Value::as_object_mut) {
            user.insert("tenantId".to_string(), json!(response.context.tenant_id));
        }
        value
    }
}

#[async_trait]
impl PasswordSessionBridge for ClawPasswordSessionBridge {
    async fn authenticate_password_and_issue_session(
        &self,
        account: &str,
        password: &str,
    ) -> PasswordSessionBridgeResult {
        match authenticate_password_and_issue_iam_session(
            Arc::clone(&self.auth_store),
            Arc::clone(&self.password_hasher),
            self.app_session_config.clone(),
            self.iam_runtime.clone(),
            Arc::clone(&self.event_store),
            Arc::clone(&self.entity_uuid_generator),
            Arc::clone(&self.tenant_signing_key_store),
            account,
            password,
        )
        .await
        {
            Ok(response) => PasswordSessionBridgeResult::Authenticated(
                ClawPasswordSessionBridge::session_json_from_response(&response),
            ),
            Err(AppSessionCreateError::Unauthorized) => {
                PasswordSessionBridgeResult::InvalidCredentials
            }
            Err(AppSessionCreateError::TooManyRequests(message)) => {
                PasswordSessionBridgeResult::Failed(message)
            }
            Err(AppSessionCreateError::BadRequest(message)) => {
                PasswordSessionBridgeResult::Failed(message)
            }
            Err(AppSessionCreateError::TrustedSubjectRequired) => {
                PasswordSessionBridgeResult::Failed(
                    "trusted subject credentials are required for session bridge login".to_string(),
                )
            }
            Err(AppSessionCreateError::System(message)) => {
                PasswordSessionBridgeResult::Failed(message)
            }
        }
    }
}
