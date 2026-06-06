use std::sync::Arc;

use crate::api::base::{RequestHeaders};
use crate::api::paths::backend_path;
use crate::api::paths::append_query_string;
use crate::http::{SdkworkError, SdkworkHttpClient};
use crate::models::{CatalogCategoryAttributesCreateResult, CatalogCategoryAttributesDeleteResult, CatalogCategoryAttributesListResult, CatalogCategoryAttributesUpdateResult, CatalogCategorySeedsCreateResult, CatalogProductsDeleteResult, CatalogSkusDeleteResult, CommerceCategorySeedInitializeRequest, CommerceInventoryStockUpdateRequest, CommerceMembershipMemberStatusRequest, CommerceMembershipPackageGroupMutationRequest, CommerceMembershipPackageMutationRequest, CommerceMembershipPlanMutationRequest, CommercePaymentProviderAccountStatusUpdateRequest, CommerceProductCategoryAttributeMutationRequest, CommerceRechargeSettingsUpdateRequest, InventoryStocksUpdateResult, MembershipsMembersStatusUpdateResult, MembershipsPackageGroupsUpdateResult, MembershipsPackagesUpdateResult, MembershipsPlansUpdateResult, OrdersRetrieveResult, PaymentsProviderAccountsDeleteResult, PaymentsProviderAccountsStatusUpdateResult, PaymentsProvidersListResult, PaymentsRuntimeSnapshotRetrieveResult, RechargesPackagesDeleteResult, RechargesSettingsRetrieveResult, RechargesSettingsUpdateResult, ShipmentsTrackingEventsListResult};

#[derive(Clone)]
pub struct CommerceApi {
    client: Arc<SdkworkHttpClient>,
}

impl CommerceApi {
    pub fn new(client: Arc<SdkworkHttpClient>) -> Self {
        Self { client }
    }

    /// List category attribute bindings
    pub async fn catalog_category_attributes_list(&self, category_id: Option<&str>, attribute_id: Option<&str>, status: Option<&str>, page: Option<&str>, page_size: Option<&str>) -> Result<CatalogCategoryAttributesListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("category_id", category_id, "form", true, false, None),
            QueryParameterSpec::new("attribute_id", attribute_id, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/catalog/category_attributes".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Create category attribute binding
    pub async fn catalog_category_attributes_create(&self, body: &CommerceProductCategoryAttributeMutationRequest, idempotency_key: &str) -> Result<CatalogCategoryAttributesCreateResult, SdkworkError> {
        let path = backend_path(&"/catalog/category_attributes".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Delete category attribute binding
    pub async fn catalog_category_attributes_delete(&self, binding_id: &str) -> Result<CatalogCategoryAttributesDeleteResult, SdkworkError> {
        let path = backend_path(&format!("/catalog/category_attributes/{}", serialize_path_parameter(binding_id, PathParameterSpec::new("bindingId", "simple", false))));
        self.client.delete(&path, None, None).await
    }

    /// Update category attribute binding
    pub async fn catalog_category_attributes_update(&self, binding_id: &str, body: &CommerceProductCategoryAttributeMutationRequest, idempotency_key: &str) -> Result<CatalogCategoryAttributesUpdateResult, SdkworkError> {
        let path = backend_path(&format!("/catalog/category_attributes/{}", serialize_path_parameter(binding_id, PathParameterSpec::new("bindingId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
            ],
            &[],
        );
        self.client.patch(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Initialize admin category seed datasets
    pub async fn catalog_category_seeds_create(&self, body: &CommerceCategorySeedInitializeRequest, idempotency_key: &str) -> Result<CatalogCategorySeedsCreateResult, SdkworkError> {
        let path = backend_path(&"/catalog/category_seeds/initialize".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Delete product SPU
    pub async fn catalog_products_delete(&self, product_id: &str) -> Result<CatalogProductsDeleteResult, SdkworkError> {
        let path = backend_path(&format!("/catalog/products/{}", serialize_path_parameter(product_id, PathParameterSpec::new("productId", "simple", false))));
        self.client.delete(&path, None, None).await
    }

    /// Delete product SKU
    pub async fn catalog_skus_delete(&self, sku_id: &str) -> Result<CatalogSkusDeleteResult, SdkworkError> {
        let path = backend_path(&format!("/catalog/skus/{}", serialize_path_parameter(sku_id, PathParameterSpec::new("skuId", "simple", false))));
        self.client.delete(&path, None, None).await
    }

    /// Update inventory stock
    pub async fn inventory_stocks_update(&self, stock_id: &str, body: &CommerceInventoryStockUpdateRequest, idempotency_key: &str) -> Result<InventoryStocksUpdateResult, SdkworkError> {
        let path = backend_path(&format!("/inventory/stocks/{}", serialize_path_parameter(stock_id, PathParameterSpec::new("stockId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
            ],
            &[],
        );
        self.client.patch(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Memberships Members Status Update
    pub async fn memberships_members_status_update(&self, membership_id: &str, body: &CommerceMembershipMemberStatusRequest, idempotency_key: &str) -> Result<MembershipsMembersStatusUpdateResult, SdkworkError> {
        let path = backend_path(&format!("/memberships/members/{}/status", serialize_path_parameter(membership_id, PathParameterSpec::new("membershipId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
            ],
            &[],
        );
        self.client.patch(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Memberships Package Groups Update
    pub async fn memberships_package_groups_update(&self, package_group_id: &str, body: &CommerceMembershipPackageGroupMutationRequest, idempotency_key: &str) -> Result<MembershipsPackageGroupsUpdateResult, SdkworkError> {
        let path = backend_path(&format!("/memberships/package_groups/{}", serialize_path_parameter(package_group_id, PathParameterSpec::new("packageGroupId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
            ],
            &[],
        );
        self.client.put(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Memberships Packages Update
    pub async fn memberships_packages_update(&self, package_id: &str, body: &CommerceMembershipPackageMutationRequest, idempotency_key: &str) -> Result<MembershipsPackagesUpdateResult, SdkworkError> {
        let path = backend_path(&format!("/memberships/packages/{}", serialize_path_parameter(package_id, PathParameterSpec::new("packageId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
            ],
            &[],
        );
        self.client.put(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Memberships Plans Update
    pub async fn memberships_plans_update(&self, plan_id: &str, body: &CommerceMembershipPlanMutationRequest, idempotency_key: &str) -> Result<MembershipsPlansUpdateResult, SdkworkError> {
        let path = backend_path(&format!("/memberships/plans/{}", serialize_path_parameter(plan_id, PathParameterSpec::new("planId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
            ],
            &[],
        );
        self.client.put(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Orders Retrieve
    pub async fn orders_retrieve(&self, order_id: &str) -> Result<OrdersRetrieveResult, SdkworkError> {
        let path = backend_path(&format!("/orders/{}", serialize_path_parameter(order_id, PathParameterSpec::new("orderId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Payments Provider Accounts Delete
    pub async fn payments_provider_accounts_delete(&self, provider_account_id: &str) -> Result<PaymentsProviderAccountsDeleteResult, SdkworkError> {
        let path = backend_path(&format!("/payments/provider_accounts/{}", serialize_path_parameter(provider_account_id, PathParameterSpec::new("providerAccountId", "simple", false))));
        self.client.delete(&path, None, None).await
    }

    /// Payments Provider Accounts Status Update
    pub async fn payments_provider_accounts_status_update(&self, provider_account_id: &str, body: &CommercePaymentProviderAccountStatusUpdateRequest, idempotency_key: &str) -> Result<PaymentsProviderAccountsStatusUpdateResult, SdkworkError> {
        let path = backend_path(&format!("/payments/provider_accounts/{}/status", serialize_path_parameter(provider_account_id, PathParameterSpec::new("providerAccountId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
            ],
            &[],
        );
        self.client.patch(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Payments Providers List
    pub async fn payments_providers_list(&self, page: Option<&str>, page_size: Option<&str>, status: Option<&str>) -> Result<PaymentsProvidersListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/payments/providers".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Payments Runtime Snapshot Retrieve
    pub async fn payments_runtime_snapshot_retrieve(&self, environment: Option<&str>) -> Result<PaymentsRuntimeSnapshotRetrieveResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("environment", environment, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/payments/runtime/snapshot".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Recharges Packages Delete
    pub async fn recharges_packages_delete(&self, package_id: &str) -> Result<RechargesPackagesDeleteResult, SdkworkError> {
        let path = backend_path(&format!("/recharges/packages/{}", serialize_path_parameter(package_id, PathParameterSpec::new("packageId", "simple", false))));
        self.client.delete(&path, None, None).await
    }

    /// Recharges Settings Retrieve
    pub async fn recharges_settings_retrieve(&self) -> Result<RechargesSettingsRetrieveResult, SdkworkError> {
        let path = backend_path(&"/recharges/settings".to_string());
        self.client.get(&path, None, None).await
    }

    /// Recharges Settings Update
    pub async fn recharges_settings_update(&self, body: &CommerceRechargeSettingsUpdateRequest) -> Result<RechargesSettingsUpdateResult, SdkworkError> {
        let path = backend_path(&"/recharges/settings".to_string());
        self.client.put(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Shipments Tracking Events List
    pub async fn shipments_tracking_events_list(&self, shipment_id: &str, page: Option<&str>, page_size: Option<&str>, status: Option<&str>) -> Result<ShipmentsTrackingEventsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&format!("/shipments/{}/tracking_events", serialize_path_parameter(shipment_id, PathParameterSpec::new("shipmentId", "simple", false)))), &query);
        self.client.get(&path, None, None).await
    }

}

struct PathParameterSpec<'a> {
    name: &'a str,
    style: &'a str,
    explode: bool,
}

impl<'a> PathParameterSpec<'a> {
    fn new(name: &'a str, style: &'a str, explode: bool) -> Self {
        Self { name, style, explode }
    }
}

fn serialize_path_parameter<T: serde::Serialize>(value: T, spec: PathParameterSpec<'_>) -> String {
    let value = serde_json::to_value(value).unwrap_or(serde_json::Value::Null);
    if value.is_null() {
        return String::new();
    }
    let style = if spec.style.is_empty() { "simple" } else { spec.style };
    match value {
        serde_json::Value::Array(values) => serialize_path_array(spec.name, &values, style, spec.explode),
        serde_json::Value::Object(values) => serialize_path_object(spec.name, &values, style, spec.explode),
        value => format!("{}{}", path_primitive_prefix(spec.name, style), percent_encode(&primitive_to_string(&value))),
    }
}

fn serialize_path_array(name: &str, values: &[serde_json::Value], style: &str, explode: bool) -> String {
    let serialized = values
        .iter()
        .filter(|value| !value.is_null())
        .map(|value| percent_encode(&primitive_to_string(value)))
        .collect::<Vec<_>>();
    if serialized.is_empty() {
        return path_prefix(name, style);
    }
    if style == "matrix" {
        if explode {
            return serialized.iter().map(|item| format!(";{}={}", name, item)).collect::<Vec<_>>().join("");
        }
        return format!(";{}={}", name, serialized.join(","));
    }
    let separator = if explode { "." } else { "," };
    format!("{}{}", path_prefix(name, style), serialized.join(separator))
}

fn serialize_path_object(
    name: &str,
    values: &serde_json::Map<String, serde_json::Value>,
    style: &str,
    explode: bool,
) -> String {
    let mut entries = Vec::new();
    let mut exploded = Vec::new();
    for (key, value) in values {
        if value.is_null() {
            continue;
        }
        let escaped_key = percent_encode(key);
        let escaped_value = percent_encode(&primitive_to_string(value));
        if explode {
            if style == "matrix" {
                exploded.push(format!(";{}={}", escaped_key, escaped_value));
            } else {
                exploded.push(format!("{}={}", escaped_key, escaped_value));
            }
        } else {
            entries.push(escaped_key);
            entries.push(escaped_value);
        }
    }
    if style == "matrix" {
        if explode {
            return exploded.join("");
        }
        return format!(";{}={}", name, entries.join(","));
    }
    if explode {
        let separator = if style == "label" { "." } else { "," };
        return format!("{}{}", path_prefix(name, style), exploded.join(separator));
    }
    format!("{}{}", path_prefix(name, style), entries.join(","))
}

fn path_prefix(name: &str, style: &str) -> String {
    match style {
        "label" => ".".to_string(),
        "matrix" => format!(";{}", name),
        _ => String::new(),
    }
}

fn path_primitive_prefix(name: &str, style: &str) -> String {
    if style == "matrix" {
        format!(";{}=", name)
    } else {
        path_prefix(name, style)
    }
}

struct HeaderParameterSpec {
    value: serde_json::Value,
    explode: bool,
    content_type: Option<&'static str>,
}

impl HeaderParameterSpec {
    fn new<T: serde::Serialize>(
        value: T,
        _style: &'static str,
        explode: bool,
        content_type: Option<&'static str>,
    ) -> Self {
        Self {
            value: serde_json::to_value(value).unwrap_or(serde_json::Value::Null),
            explode,
            content_type,
        }
    }
}

fn build_request_headers(headers: &[(&str, HeaderParameterSpec)], cookies: &[(&str, HeaderParameterSpec)]) -> Option<RequestHeaders> {
    let mut request_headers = RequestHeaders::new();
    for (name, parameter) in headers {
        if let Some(value) = serialize_header_parameter(parameter) {
            request_headers.insert((*name).to_string(), value);
        }
    }

    let cookie_header = build_cookie_header(cookies);
    if !cookie_header.is_empty() {
        request_headers
            .entry("Cookie".to_string())
            .and_modify(|existing| {
                existing.push_str("; ");
                existing.push_str(&cookie_header);
            })
            .or_insert(cookie_header);
    }

    if request_headers.is_empty() {
        None
    } else {
        Some(request_headers)
    }
}

fn build_cookie_header(cookies: &[(&str, HeaderParameterSpec)]) -> String {
    cookies
        .iter()
        .filter_map(|(name, value)| {
            serialize_header_parameter(value)
                .map(|value| format!("{}={}", percent_encode(name), percent_encode(&value)))
        })
        .collect::<Vec<_>>()
        .join("; ")
}

fn serialize_header_parameter(parameter: &HeaderParameterSpec) -> Option<String> {
    if parameter.value.is_null() {
        return None;
    }
    if parameter.content_type.is_some() {
        return Some(parameter.value.to_string());
    }
    match &parameter.value {
        serde_json::Value::Null => None,
        serde_json::Value::String(value) => Some(value.clone()),
        serde_json::Value::Number(value) => Some(value.to_string()),
        serde_json::Value::Bool(value) => Some(value.to_string()),
        serde_json::Value::Array(values) => {
            let serialized = values
                .iter()
                .filter_map(serialize_json_value)
                .collect::<Vec<_>>();
            if serialized.is_empty() {
                None
            } else {
                Some(serialized.join(","))
            }
        }
        serde_json::Value::Object(values) => {
            let serialized = values
                .iter()
                .filter_map(|(key, value)| {
                    serialize_json_value(value).map(|serialized| {
                        if parameter.explode {
                            format!("{}={}", key, serialized)
                        } else {
                            format!("{},{}", key, serialized)
                        }
                    })
                })
                .collect::<Vec<_>>();
            if serialized.is_empty() {
                None
            } else {
                Some(serialized.join(","))
            }
        }
    }
}

fn serialize_json_value(value: &serde_json::Value) -> Option<String> {
    match value {
        serde_json::Value::Null => None,
        serde_json::Value::String(value) => Some(value.clone()),
        serde_json::Value::Number(value) => Some(value.to_string()),
        serde_json::Value::Bool(value) => Some(value.to_string()),
        other => Some(other.to_string()),
    }
}

struct QueryParameterSpec<'a> {
    name: &'a str,
    value: serde_json::Value,
    style: &'a str,
    explode: bool,
    allow_reserved: bool,
    content_type: Option<&'a str>,
}

impl<'a> QueryParameterSpec<'a> {
    fn new<T: serde::Serialize>(
        name: &'a str,
        value: T,
        style: &'a str,
        explode: bool,
        allow_reserved: bool,
        content_type: Option<&'a str>,
    ) -> Self {
        Self {
            name,
            value: serde_json::to_value(value).unwrap_or(serde_json::Value::Null),
            style,
            explode,
            allow_reserved,
            content_type,
        }
    }
}

fn build_query_string(parameters: &[QueryParameterSpec<'_>]) -> String {
    let mut pairs = Vec::new();
    for parameter in parameters {
        append_serialized_parameter(&mut pairs, parameter);
    }
    pairs.join("&")
}

fn append_serialized_parameter(pairs: &mut Vec<String>, parameter: &QueryParameterSpec<'_>) {
    if parameter.value.is_null() {
        return;
    }
    if parameter.content_type.is_some() {
        pairs.push(format!(
            "{}={}",
            percent_encode(parameter.name),
            encode_query_value(&parameter.value.to_string(), parameter.allow_reserved)
        ));
        return;
    }

    let style = if parameter.style.is_empty() { "form" } else { parameter.style };
    match &parameter.value {
        serde_json::Value::Array(values) => append_array_parameter(pairs, parameter.name, values, style, parameter.explode, parameter.allow_reserved),
        serde_json::Value::Object(values) if style == "deepObject" => append_deep_object_parameter(pairs, parameter.name, values, parameter.allow_reserved),
        serde_json::Value::Object(values) => append_object_parameter(pairs, parameter.name, values, style, parameter.explode, parameter.allow_reserved),
        value => pairs.push(format!("{}={}", percent_encode(parameter.name), encode_query_value(&primitive_to_string(value), parameter.allow_reserved))),
    }
}

fn append_array_parameter(
    pairs: &mut Vec<String>,
    name: &str,
    values: &[serde_json::Value],
    style: &str,
    explode: bool,
    allow_reserved: bool,
) {
    let serialized = values.iter().filter(|value| !value.is_null()).map(primitive_to_string).collect::<Vec<_>>();
    if serialized.is_empty() {
        return;
    }
    if style == "form" && explode {
        for item in serialized {
            pairs.push(format!("{}={}", percent_encode(name), encode_query_value(&item, allow_reserved)));
        }
        return;
    }
    pairs.push(format!("{}={}", percent_encode(name), encode_query_value(&serialized.join(","), allow_reserved)));
}

fn append_object_parameter(
    pairs: &mut Vec<String>,
    name: &str,
    values: &serde_json::Map<String, serde_json::Value>,
    style: &str,
    explode: bool,
    allow_reserved: bool,
) {
    let mut serialized = Vec::new();
    for (key, value) in values {
        if value.is_null() {
            continue;
        }
        if style == "form" && explode {
            pairs.push(format!("{}={}", percent_encode(key), encode_query_value(&primitive_to_string(value), allow_reserved)));
        } else {
            serialized.push(key.clone());
            serialized.push(primitive_to_string(value));
        }
    }
    if !serialized.is_empty() {
        pairs.push(format!("{}={}", percent_encode(name), encode_query_value(&serialized.join(","), allow_reserved)));
    }
}

fn append_deep_object_parameter(
    pairs: &mut Vec<String>,
    name: &str,
    values: &serde_json::Map<String, serde_json::Value>,
    allow_reserved: bool,
) {
    for (key, value) in values {
        if !value.is_null() {
            pairs.push(format!("{}={}", percent_encode(&format!("{}[{}]", name, key)), encode_query_value(&primitive_to_string(value), allow_reserved)));
        }
    }
}

fn encode_query_value(value: &str, allow_reserved: bool) -> String {
    let mut encoded = percent_encode(value);
    if !allow_reserved {
        return encoded;
    }
    for (escaped, reserved) in [
        ("%3A", ":"), ("%2F", "/"), ("%3F", "?"), ("%23", "#"),
        ("%5B", "["), ("%5D", "]"), ("%40", "@"), ("%21", "!"),
        ("%24", "$"), ("%26", "&"), ("%27", "'"), ("%28", "("),
        ("%29", ")"), ("%2A", "*"), ("%2B", "+"), ("%2C", ","),
        ("%3B", ";"), ("%3D", "="),
    ] {
        encoded = encoded.replace(escaped, reserved);
    }
    encoded
}

fn primitive_to_string(value: &serde_json::Value) -> String {
    match value {
        serde_json::Value::String(value) => value.clone(),
        serde_json::Value::Number(value) => value.to_string(),
        serde_json::Value::Bool(value) => value.to_string(),
        other => other.to_string(),
    }
}

fn percent_encode(value: &str) -> String {
    value
        .bytes()
        .flat_map(|byte| match byte {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => {
                vec![byte as char]
            }
            _ => format!("%{:02X}", byte).chars().collect(),
        })
        .collect()
}
