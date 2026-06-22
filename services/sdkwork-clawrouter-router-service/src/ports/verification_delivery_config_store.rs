use std::future::Future;
use std::pin::Pin;

use crate::domain::DomainResult;

pub type VerificationDeliveryConfigFuture<'a, T> =
    Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct VerificationDeliveryConfigQuery {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub channel: String,
    pub scene: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct VerificationDeliveryConfig {
    pub route_rule_id: i64,
    pub account_id: i64,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub provider_code: String,
    pub channel: String,
    pub scene: String,
    pub account_code: String,
    pub secret_ref: String,
    pub base_url: Option<String>,
    pub template_code: Option<String>,
    pub sender_identity_id: Option<i64>,
    pub sender: Option<String>,
    pub priority: i64,
    pub weight: i64,
}

pub trait VerificationDeliveryConfigStore {
    fn active_config_for<'a>(
        &'a self,
        query: VerificationDeliveryConfigQuery,
    ) -> VerificationDeliveryConfigFuture<'a, Option<VerificationDeliveryConfig>>;
}
