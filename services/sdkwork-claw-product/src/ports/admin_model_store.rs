use std::future::Future;
use std::pin::Pin;

use crate::domain::DomainResult;

pub type AdminModelCommandFuture<'a, T> =
    Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AdminModelSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub operator_id: i64,
    pub operator_type: i32,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AdminModelVendorItem {
    pub id: i64,
    pub uuid: String,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub vendor_code: String,
    pub name: String,
    pub status: String,
    pub color: String,
    pub description: String,
    pub deleted_at: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AdminAiModelItem {
    pub id: i64,
    pub uuid: String,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub vendor_id: String,
    pub vendor_code: String,
    pub region_code: String,
    pub catalog_key: String,
    pub model: String,
    pub display_name: String,
    pub name: String,
    pub model_type: String,
    pub price_in: String,
    pub price_out: String,
    pub cache_read_price: String,
    pub cache_write_price: String,
    pub status: String,
    pub calls: String,
    pub description: Option<String>,
    pub modalities: Vec<String>,
    pub input_modalities: Vec<String>,
    pub output_modalities: Vec<String>,
    pub api_format: Option<String>,
    pub capability_intro: Option<String>,
    pub limitations: Vec<String>,
    pub supported_languages: Vec<String>,
    pub use_cases: Vec<String>,
    pub training_data_cutoff: Option<String>,
    pub context_tokens: Option<i64>,
    pub max_output_tokens: Option<i64>,
    pub supports_streaming: bool,
    pub supports_tools: bool,
    pub supports_json_schema: bool,
    pub release_stage: Option<i32>,
    pub shelf_state: Option<i32>,
    pub routing_state: Option<i32>,
    pub replacement_model: Option<String>,
    pub deleted_at: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AdminModelCatalogSyncItem {
    pub synced: bool,
    pub source: String,
    pub mode: String,
    pub dry_run: bool,
    pub catalog_version: String,
    pub requested_catalog_version: Option<String>,
    pub catalog_root: Option<String>,
    pub vendor_codes: Vec<String>,
    pub source_hash: String,
    pub meter_count: usize,
    pub vendor_count: usize,
    pub family_count: usize,
    pub model_count: usize,
    pub capability_count: usize,
    pub price_count: usize,
    pub ranking_count: usize,
    pub accepted_count: i64,
    pub snapshot_id: Option<String>,
    pub sync_run_id: Option<String>,
    pub vendors: Vec<AdminModelVendorItem>,
    pub models: Vec<AdminAiModelItem>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ListAdminModelVendorsQuery {
    pub subject: AdminModelSubject,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ListAdminAiModelsQuery {
    pub subject: AdminModelSubject,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CreateAdminModelVendorCommand {
    pub subject: AdminModelSubject,
    pub vendor_uuid: String,
    pub audit_log_uuid: String,
    pub vendor_code: String,
    pub name: String,
    pub status: String,
    pub color: String,
    pub description: String,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AdminAiModelRegionPriceCommand {
    pub region_code: String,
    pub price_in: String,
    pub price_out: String,
    pub cache_read_price: Option<String>,
    pub cache_write_price: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CreateAdminAiModelCommand {
    pub subject: AdminModelSubject,
    pub model_uuid: String,
    pub input_pricing_uuid: String,
    pub output_pricing_uuid: String,
    pub cache_read_pricing_uuid: String,
    pub cache_write_pricing_uuid: String,
    pub capability_uuid: String,
    pub audit_log_uuid: String,
    pub vendor_id: String,
    pub model: String,
    pub display_name: String,
    pub model_type: String,
    pub price_in: String,
    pub price_out: String,
    pub cache_read_price: Option<String>,
    pub cache_write_price: Option<String>,
    pub region_code: String,
    pub region_prices: Vec<AdminAiModelRegionPriceCommand>,
    pub description: Option<String>,
    pub modalities: Vec<String>,
    pub input_modalities: Vec<String>,
    pub output_modalities: Vec<String>,
    pub api_format: String,
    pub capability_intro: Option<String>,
    pub limitations: Vec<String>,
    pub supported_languages: Vec<String>,
    pub use_cases: Vec<String>,
    pub training_data_cutoff: Option<String>,
    pub context_tokens: i64,
    pub max_output_tokens: Option<i64>,
    pub supports_streaming: bool,
    pub supports_tools: bool,
    pub supports_json_schema: bool,
    pub release_stage: i32,
    pub shelf_state: i32,
    pub routing_state: i32,
    pub replacement_model: Option<String>,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UpdateAdminAiModelCommand {
    pub subject: AdminModelSubject,
    pub capability_uuid: String,
    pub input_pricing_uuid: String,
    pub output_pricing_uuid: String,
    pub cache_read_pricing_uuid: String,
    pub cache_write_pricing_uuid: String,
    pub audit_log_uuid: String,
    pub model_id: String,
    pub vendor_id: Option<String>,
    pub model: Option<String>,
    pub display_name: Option<Option<String>>,
    pub model_type: Option<String>,
    pub price_in: Option<String>,
    pub price_out: Option<String>,
    pub cache_read_price: Option<Option<String>>,
    pub cache_write_price: Option<Option<String>>,
    pub region_code: Option<String>,
    pub region_prices: Option<Vec<AdminAiModelRegionPriceCommand>>,
    pub status: Option<String>,
    pub description: Option<Option<String>>,
    pub modalities: Option<Vec<String>>,
    pub input_modalities: Option<Vec<String>>,
    pub output_modalities: Option<Vec<String>>,
    pub api_format: Option<String>,
    pub capability_intro: Option<Option<String>>,
    pub limitations: Option<Vec<String>>,
    pub supported_languages: Option<Vec<String>>,
    pub use_cases: Option<Vec<String>>,
    pub training_data_cutoff: Option<Option<String>>,
    pub context_tokens: Option<i64>,
    pub max_output_tokens: Option<Option<i64>>,
    pub supports_streaming: Option<bool>,
    pub supports_tools: Option<bool>,
    pub supports_json_schema: Option<bool>,
    pub release_stage: Option<i32>,
    pub shelf_state: Option<i32>,
    pub routing_state: Option<i32>,
    pub replacement_model: Option<Option<String>>,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SyncAdminModelCatalogCommand {
    pub subject: AdminModelSubject,
    pub snapshot_uuid: String,
    pub audit_log_uuid: String,
    pub source: String,
    pub mode: String,
    pub vendor_codes: Vec<String>,
    pub force: bool,
    pub catalog_root: Option<String>,
    pub catalog_version: Option<String>,
    pub request_id: String,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DeleteAdminAiModelCommand {
    pub subject: AdminModelSubject,
    pub audit_log_uuid: String,
    pub model_id: String,
    pub request_id: String,
    pub requested_at: String,
}

pub trait AdminModelStore {
    fn list_vendors<'a>(
        &'a self,
        query: ListAdminModelVendorsQuery,
    ) -> AdminModelCommandFuture<'a, Vec<AdminModelVendorItem>>;

    fn list_models<'a>(
        &'a self,
        query: ListAdminAiModelsQuery,
    ) -> AdminModelCommandFuture<'a, Vec<AdminAiModelItem>>;

    fn create_vendor<'a>(
        &'a self,
        command: CreateAdminModelVendorCommand,
    ) -> AdminModelCommandFuture<'a, AdminModelVendorItem>;

    fn create_model<'a>(
        &'a self,
        command: CreateAdminAiModelCommand,
    ) -> AdminModelCommandFuture<'a, AdminAiModelItem>;

    fn update_model<'a>(
        &'a self,
        command: UpdateAdminAiModelCommand,
    ) -> AdminModelCommandFuture<'a, AdminAiModelItem>;

    fn sync_catalog<'a>(
        &'a self,
        command: SyncAdminModelCatalogCommand,
    ) -> AdminModelCommandFuture<'a, AdminModelCatalogSyncItem>;

    fn delete_model<'a>(
        &'a self,
        command: DeleteAdminAiModelCommand,
    ) -> AdminModelCommandFuture<'a, ()>;
}
