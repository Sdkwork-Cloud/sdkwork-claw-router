use std::future::Future;
use std::pin::Pin;

use crate::domain::DomainResult;

pub type AdminAiResourceReadFuture<'a, T> =
    Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AdminAiResourceSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub operator_id: i64,
    pub operator_type: i32,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AdminAiResourceMemberItem {
    pub parent_resource_code: String,
    pub member_resource_code: String,
    pub member_role: String,
    pub required: bool,
    pub sort_order: Option<i64>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AdminAiResourceItem {
    pub id: i64,
    pub resource_code: String,
    pub resource_type: String,
    pub display_name: String,
    pub vendor_code: Option<String>,
    pub modality_code: Option<String>,
    pub api_endpoint_code: Option<String>,
    pub catalog_key: Option<String>,
    pub model: Option<String>,
    pub provider_native_model: Option<String>,
    pub composition_mode: String,
    pub status: String,
    pub sort_order: Option<i64>,
    pub members: Vec<AdminAiResourceMemberItem>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ListAdminAiResourcesQuery {
    pub subject: AdminAiResourceSubject,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AdminAiResourceMemberCommand {
    pub member_resource_code: String,
    pub member_role: String,
    pub required: bool,
    pub sort_order: Option<i64>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CreateAdminAiResourceCommand {
    pub subject: AdminAiResourceSubject,
    pub resource_uuid: String,
    pub member_uuids: Vec<String>,
    pub audit_log_uuid: String,
    pub resource_code: String,
    pub resource_type: String,
    pub display_name: String,
    pub vendor_code: Option<String>,
    pub modality_code: Option<String>,
    pub api_endpoint_code: Option<String>,
    pub catalog_key: Option<String>,
    pub model: Option<String>,
    pub provider_native_model: Option<String>,
    pub composition_mode: String,
    pub status: String,
    pub sort_order: Option<i64>,
    pub members: Vec<AdminAiResourceMemberCommand>,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UpdateAdminAiResourceCommand {
    pub subject: AdminAiResourceSubject,
    pub resource_id: i64,
    pub member_uuids: Vec<String>,
    pub audit_log_uuid: String,
    pub resource_code: Option<String>,
    pub resource_type: Option<String>,
    pub display_name: Option<String>,
    pub vendor_code: Option<Option<String>>,
    pub modality_code: Option<Option<String>>,
    pub api_endpoint_code: Option<Option<String>>,
    pub catalog_key: Option<Option<String>>,
    pub model: Option<Option<String>>,
    pub provider_native_model: Option<Option<String>>,
    pub composition_mode: Option<String>,
    pub status: Option<String>,
    pub sort_order: Option<Option<i64>>,
    pub members: Option<Vec<AdminAiResourceMemberCommand>>,
    pub request_id: String,
    pub requested_at: String,
}

pub trait AdminAiResourceStore {
    fn list_ai_resources<'a>(
        &'a self,
        query: ListAdminAiResourcesQuery,
    ) -> AdminAiResourceReadFuture<'a, Vec<AdminAiResourceItem>>;

    fn create_ai_resource<'a>(
        &'a self,
        command: CreateAdminAiResourceCommand,
    ) -> AdminAiResourceReadFuture<'a, AdminAiResourceItem>;

    fn update_ai_resource<'a>(
        &'a self,
        command: UpdateAdminAiResourceCommand,
    ) -> AdminAiResourceReadFuture<'a, Option<AdminAiResourceItem>>;
}
