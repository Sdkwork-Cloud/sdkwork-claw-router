use std::future::Future;
use std::pin::Pin;

use crate::domain::DomainResult;

pub type AdminChannelEndpointFuture<'a, T> =
    Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AdminChannelEndpointSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub operator_id: i64,
    pub operator_type: i32,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AdminChannelEndpointItem {
    pub id: i64,
    pub channel_id: i64,
    pub provider_code: String,
    pub channel_code: String,
    pub channel_type: String,
    pub vendor_code: String,
    pub region_code: String,
    pub api_endpoint_code: String,
    pub base_url: String,
    pub priority: i64,
    pub weight: i64,
    pub health_status: String,
    pub status: String,
    pub effective_from: Option<String>,
    pub effective_to: Option<String>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ListAdminChannelEndpointsQuery {
    pub subject: AdminChannelEndpointSubject,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CreateAdminChannelEndpointCommand {
    pub subject: AdminChannelEndpointSubject,
    pub endpoint_uuid: String,
    pub audit_log_uuid: String,
    pub channel_id: i64,
    pub vendor_code: String,
    pub region_code: String,
    pub api_endpoint_code: String,
    pub base_url: String,
    pub priority: i64,
    pub weight: i64,
    pub status: String,
    pub effective_from: Option<String>,
    pub effective_to: Option<String>,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UpdateAdminChannelEndpointCommand {
    pub subject: AdminChannelEndpointSubject,
    pub endpoint_id: i64,
    pub audit_log_uuid: String,
    pub vendor_code: Option<String>,
    pub region_code: Option<String>,
    pub api_endpoint_code: Option<String>,
    pub base_url: Option<String>,
    pub priority: Option<i64>,
    pub weight: Option<i64>,
    pub status: Option<String>,
    pub effective_from: Option<Option<String>>,
    pub effective_to: Option<Option<String>>,
    pub request_id: String,
    pub requested_at: String,
}

pub trait AdminChannelEndpointStore {
    fn list_channel_endpoints<'a>(
        &'a self,
        query: ListAdminChannelEndpointsQuery,
    ) -> AdminChannelEndpointFuture<'a, Vec<AdminChannelEndpointItem>>;

    fn create_channel_endpoint<'a>(
        &'a self,
        command: CreateAdminChannelEndpointCommand,
    ) -> AdminChannelEndpointFuture<'a, Option<AdminChannelEndpointItem>>;

    fn update_channel_endpoint<'a>(
        &'a self,
        command: UpdateAdminChannelEndpointCommand,
    ) -> AdminChannelEndpointFuture<'a, Option<AdminChannelEndpointItem>>;
}
