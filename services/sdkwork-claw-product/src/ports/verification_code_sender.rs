use std::collections::BTreeMap;
use std::future::Future;
use std::pin::Pin;
use std::sync::Arc;

use crate::domain::DomainError;
use crate::domain::DomainResult;
use crate::ports::{
    VerificationDeliveryConfig, VerificationDeliveryConfigQuery, VerificationDeliveryConfigStore,
};

pub type VerificationCodeDeliveryFuture<'a, T> =
    Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct VerificationCodeDeliveryRequest {
    pub code_id: String,
    pub target: String,
    pub scene: String,
    pub channel: String,
    pub code: String,
    pub expires_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct VerificationCodeDeliveryReceipt {
    pub provider_code: String,
    pub channel: String,
    pub message_id: String,
    pub delivered_at: String,
}

pub trait VerificationCodeSender {
    fn send_verification_code<'a>(
        &'a self,
        request: VerificationCodeDeliveryRequest,
    ) -> VerificationCodeDeliveryFuture<'a, VerificationCodeDeliveryReceipt>;
}

pub type ProviderVerificationDeliveryFuture<'a, T> =
    Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ProviderVerificationDeliveryRequest {
    pub config: VerificationDeliveryConfig,
    pub delivery: VerificationCodeDeliveryRequest,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ProviderVerificationDeliveryReceipt {
    pub message_id: String,
    pub delivered_at: String,
}

pub trait ProviderVerificationDeliverySender {
    fn send_with_config<'a>(
        &'a self,
        request: ProviderVerificationDeliveryRequest,
    ) -> ProviderVerificationDeliveryFuture<'a, ProviderVerificationDeliveryReceipt>;
}

pub struct ConfiguredVerificationCodeSender {
    config_store: Arc<dyn VerificationDeliveryConfigStore + Send + Sync>,
    provider_senders: BTreeMap<String, Arc<dyn ProviderVerificationDeliverySender + Send + Sync>>,
    tenant_id: i64,
    organization_id: i64,
}

impl ConfiguredVerificationCodeSender {
    pub fn new(config_store: Arc<dyn VerificationDeliveryConfigStore + Send + Sync>) -> Self {
        Self {
            config_store,
            provider_senders: BTreeMap::new(),
            tenant_id: 1,
            organization_id: 1,
        }
    }

    pub fn with_subject(mut self, tenant_id: i64, organization_id: i64) -> Self {
        self.tenant_id = tenant_id;
        self.organization_id = organization_id;
        self
    }

    pub fn with_provider_sender(
        mut self,
        provider_code: impl AsRef<str>,
        sender: Arc<dyn ProviderVerificationDeliverySender + Send + Sync>,
    ) -> Self {
        let provider_code = normalize_token(provider_code.as_ref());
        if !provider_code.is_empty() {
            self.provider_senders.insert(provider_code, sender);
        }
        self
    }
}

impl VerificationCodeSender for ConfiguredVerificationCodeSender {
    fn send_verification_code<'a>(
        &'a self,
        request: VerificationCodeDeliveryRequest,
    ) -> VerificationCodeDeliveryFuture<'a, VerificationCodeDeliveryReceipt> {
        Box::pin(async move {
            let config = self
                .config_store
                .active_config_for(VerificationDeliveryConfigQuery {
                    tenant_id: self.tenant_id,
                    organization_id: self.organization_id,
                    channel: request.channel.clone(),
                    scene: request.scene.clone(),
                })
                .await?
                .ok_or_else(|| {
                    DomainError::new(format!(
                        "verification code delivery provider is not configured for channel {} scene {}",
                        request.channel, request.scene
                    ))
                })?;
            let provider_code = normalize_token(&config.provider_code);
            let provider_sender = self.provider_senders.get(&provider_code).ok_or_else(|| {
                DomainError::new(format!(
                    "verification code delivery sender is not registered for provider {}",
                    config.provider_code
                ))
            })?;
            let provider_receipt = provider_sender
                .send_with_config(ProviderVerificationDeliveryRequest {
                    config: config.clone(),
                    delivery: request,
                })
                .await?;
            Ok(VerificationCodeDeliveryReceipt {
                provider_code: config.provider_code,
                channel: config.channel,
                message_id: provider_receipt.message_id,
                delivered_at: provider_receipt.delivered_at,
            })
        })
    }
}

pub struct DebugVerificationCodeSender;

impl VerificationCodeSender for DebugVerificationCodeSender {
    fn send_verification_code<'a>(
        &'a self,
        request: VerificationCodeDeliveryRequest,
    ) -> VerificationCodeDeliveryFuture<'a, VerificationCodeDeliveryReceipt> {
        Box::pin(async move {
            Ok(VerificationCodeDeliveryReceipt {
                provider_code: "debug".to_owned(),
                channel: request.channel,
                message_id: format!("debug-{}", request.code_id),
                delivered_at: request.expires_at,
            })
        })
    }
}

pub struct RequiredConfiguredVerificationCodeSender;

impl VerificationCodeSender for RequiredConfiguredVerificationCodeSender {
    fn send_verification_code<'a>(
        &'a self,
        request: VerificationCodeDeliveryRequest,
    ) -> VerificationCodeDeliveryFuture<'a, VerificationCodeDeliveryReceipt> {
        Box::pin(async move {
            Err(DomainError::new(format!(
                "verification code delivery provider is not configured for channel {} scene {}",
                request.channel, request.scene
            )))
        })
    }
}

fn normalize_token(value: &str) -> String {
    value.trim().to_ascii_lowercase().replace('-', "_")
}
