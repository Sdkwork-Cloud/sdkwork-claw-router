use std::sync::Arc;

use async_trait::async_trait;
use sdkwork_claw_config::AppSessionConfig;
use sdkwork_clawrouter_router_service::api::{
    authenticate_password_and_issue_iam_session, AppSessionCreateError, IamSessionResponse,
};
use sdkwork_clawrouter_router_service::application::{EntityUuidGenerator, PasswordHasher};
use sdkwork_clawrouter_router_service::ports::{AppAuthStore, AppSessionEventStore};
use sdkwork_router_iam_app_api::{PasswordSessionBridge, PasswordSessionBridgeResult};
use serde_json::{json, Value};

pub(crate) struct ClawPasswordSessionBridge {
    auth_store: Arc<dyn AppAuthStore + Send + Sync>,
    password_hasher: Arc<dyn PasswordHasher + Send + Sync>,
    app_session_config: AppSessionConfig,
    event_store: Arc<dyn AppSessionEventStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
}

impl ClawPasswordSessionBridge {
    pub(crate) fn new(
        auth_store: Arc<dyn AppAuthStore + Send + Sync>,
        password_hasher: Arc<dyn PasswordHasher + Send + Sync>,
        app_session_config: AppSessionConfig,
        event_store: Arc<dyn AppSessionEventStore + Send + Sync>,
        entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    ) -> Self {
        Self {
            auth_store,
            password_hasher,
            app_session_config,
            event_store,
            entity_uuid_generator,
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
            self.auth_store.as_ref(),
            self.password_hasher.as_ref(),
            &self.app_session_config,
            self.event_store.as_ref(),
            self.entity_uuid_generator.as_ref(),
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
