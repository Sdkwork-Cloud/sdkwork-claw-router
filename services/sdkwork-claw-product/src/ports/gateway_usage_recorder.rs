use std::future::Future;
use std::pin::Pin;

use crate::domain::DomainResult;

pub type GatewayUsageRecordFuture<'a> = Pin<Box<dyn Future<Output = DomainResult<()>> + Send + 'a>>;

pub trait GatewayUsageRecorder {
    fn record_gateway_usage<'a>(
        &'a self,
        command: GatewayUsageRecordCommand,
    ) -> GatewayUsageRecordFuture<'a>;
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct GatewayUsageRecordCommand {
    pub request_id: String,
    pub trace_id: Option<String>,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
    pub api_key_id: i64,
    pub api_key_name_snapshot: String,
    pub api_key_group_id: i64,
    pub api_key_group_snapshot: String,
    pub catalog_key: String,
    pub requested_model: String,
    pub provider_code: String,
    pub channel_id: i64,
    pub provider_model: String,
    pub request_path: String,
    pub http_method: String,
    pub http_status: u16,
    pub streaming: bool,
    pub prompt_tokens: i64,
    pub completion_tokens: i64,
    pub cached_tokens: i64,
    pub total_tokens: i64,
    pub base_input_unit_price: String,
    pub base_output_unit_price: String,
    pub customer_charge_amount: String,
    pub upstream_cost_amount: String,
    pub currency: String,
    pub pricing_plan_code: String,
}
