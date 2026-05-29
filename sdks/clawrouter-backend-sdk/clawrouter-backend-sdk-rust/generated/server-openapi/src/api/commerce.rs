use std::sync::Arc;

use crate::api::base::{RequestHeaders};
use crate::api::paths::backend_path;
use crate::api::paths::append_query_string;
use crate::http::{SdkworkError, SdkworkHttpClient};
use crate::models::{AuditCommerceEventsListResult, CatalogAttributesCreateResult, CatalogAttributesListResult, CatalogCategoriesCreateResult, CatalogCategoriesDeleteResult, CatalogCategoriesListResult, CatalogCategoriesUpdateResult, CatalogPriceListsCreateResult, CatalogPriceListsListResult, CatalogProductsCreateResult, CatalogProductsListResult, CatalogProductsUpdateResult, CatalogSkusCreateResult, CatalogSkusListResult, CatalogSkusUpdateResult, CommerceInventoryStockUpdateRequest, CommerceMembershipMemberStatusRequest, CommerceMembershipPackageGroupMutationRequest, CommerceMembershipPackageMutationRequest, CommerceMembershipPlanMutationRequest, CommercePaymentProviderAccountMutationRequest, CommercePriceListMutationRequest, CommerceProductAttributeMutationRequest, CommerceProductCategoryMutationRequest, CommerceProductSkuMutationRequest, CommerceProductSpuMutationRequest, CommerceRechargePackageMutationRequest, CommerceReportsOrderRevenueListResult, CommerceReportsPaymentReconciliationRetrieveResult, CommerceReportsRefundsListResult, CommerceStandardCommandRequest, FulfillmentsListResult, InventoryLedgerEntriesListResult, InventoryReservationsListResult, InventoryStocksListResult, InventoryStocksUpdateResult, InvoicesListResult, InvoicesRetrieveResult, InvoicesTitlesListResult, MembershipsEntitlementsListResult, MembershipsMembersListResult, MembershipsMembersStatusUpdateResult, MembershipsPackageGroupsCreateResult, MembershipsPackageGroupsDeleteResult, MembershipsPackageGroupsListResult, MembershipsPackageGroupsUpdateResult, MembershipsPackagesCreateResult, MembershipsPackagesDeleteResult, MembershipsPackagesListResult, MembershipsPackagesUpdateResult, MembershipsPlansCreateResult, MembershipsPlansDeleteResult, MembershipsPlansListResult, MembershipsPlansUpdateResult, OrdersEventsListResult, OrdersListResult, OrdersRetrieveResult, PaymentsAttemptsListResult, PaymentsChannelsListResult, PaymentsIntentsListResult, PaymentsMethodsListResult, PaymentsProviderAccountsCreateResult, PaymentsProviderAccountsListResult, PaymentsProvidersListResult, PaymentsReconciliationRunsListResult, PaymentsRouteRulesListResult, PaymentsWebhookEventsListResult, RechargesOrdersListResult, RechargesPackagesCreateResult, RechargesPackagesDeleteResult, RechargesPackagesListResult, RechargesPackagesUpdateResult, RefundsListResult, RefundsRetrieveResult, ShipmentsListResult, ShipmentsTrackingEventsListResult, WalletAccountsListResult, WalletAdjustmentsCreateResult, WalletExchangeRulesListResult, WalletLedgerEntriesListResult};

#[derive(Clone)]
pub struct CommerceApi {
    client: Arc<SdkworkHttpClient>,
}

impl CommerceApi {
    pub fn new(client: Arc<SdkworkHttpClient>) -> Self {
        Self { client }
    }

    /// Audit Commerce Events List
    pub async fn audit_commerce_events_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<AuditCommerceEventsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/audit/commerce_events".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// List product attributes
    pub async fn catalog_attributes_list(&self, scope: Option<&str>, status: Option<&str>, page: Option<i64>, page_size: Option<i64>) -> Result<CatalogAttributesListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("scope", scope, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/catalog/attributes".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Create product attribute
    pub async fn catalog_attributes_create(&self, body: &CommerceProductAttributeMutationRequest, idempotency_key: &str) -> Result<CatalogAttributesCreateResult, SdkworkError> {
        let path = backend_path(&"/catalog/attributes".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// List product categories for admin management
    pub async fn catalog_categories_list(&self, parent_id: Option<&str>, status: Option<&str>, page: Option<i64>, page_size: Option<i64>) -> Result<CatalogCategoriesListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("parent_id", parent_id, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/catalog/categories".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Create product category
    pub async fn catalog_categories_create(&self, body: &CommerceProductCategoryMutationRequest, idempotency_key: &str) -> Result<CatalogCategoriesCreateResult, SdkworkError> {
        let path = backend_path(&"/catalog/categories".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Delete product category
    pub async fn catalog_categories_delete(&self, category_id: &str) -> Result<CatalogCategoriesDeleteResult, SdkworkError> {
        let path = backend_path(&format!("/catalog/categories/{}", serialize_path_parameter(category_id, PathParameterSpec::new("categoryId", "simple", false))));
        self.client.delete(&path, None, None).await
    }

    /// Update product category
    pub async fn catalog_categories_update(&self, category_id: &str, body: &CommerceProductCategoryMutationRequest, idempotency_key: &str) -> Result<CatalogCategoriesUpdateResult, SdkworkError> {
        let path = backend_path(&format!("/catalog/categories/{}", serialize_path_parameter(category_id, PathParameterSpec::new("categoryId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
            ],
            &[],
        );
        self.client.patch(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// List product price lists
    pub async fn catalog_price_lists(&self, currency_code: Option<&str>, market_code: Option<&str>, status: Option<&str>, page: Option<i64>, page_size: Option<i64>) -> Result<CatalogPriceListsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("currency_code", currency_code, "form", true, false, None),
            QueryParameterSpec::new("market_code", market_code, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/catalog/price_lists".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Create product price list
    pub async fn catalog_price_lists_create(&self, body: &CommercePriceListMutationRequest, idempotency_key: &str) -> Result<CatalogPriceListsCreateResult, SdkworkError> {
        let path = backend_path(&"/catalog/price_lists".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// List products for admin management
    pub async fn catalog_products_list(&self, q: Option<&str>, category_id: Option<&str>, product_type: Option<&str>, status: Option<&str>, page: Option<i64>, page_size: Option<i64>, sort: Option<&str>) -> Result<CatalogProductsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("q", q, "form", true, false, None),
            QueryParameterSpec::new("category_id", category_id, "form", true, false, None),
            QueryParameterSpec::new("product_type", product_type, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("sort", sort, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/catalog/products".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Create product SPU
    pub async fn catalog_products_create(&self, body: &CommerceProductSpuMutationRequest, idempotency_key: &str) -> Result<CatalogProductsCreateResult, SdkworkError> {
        let path = backend_path(&"/catalog/products".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Update product SPU
    pub async fn catalog_products_update(&self, product_id: &str, body: &CommerceProductSpuMutationRequest, idempotency_key: &str) -> Result<CatalogProductsUpdateResult, SdkworkError> {
        let path = backend_path(&format!("/catalog/products/{}", serialize_path_parameter(product_id, PathParameterSpec::new("productId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
            ],
            &[],
        );
        self.client.patch(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// List product SKUs for admin management
    pub async fn catalog_skus_list(&self, product_id: Option<&str>, fulfillment_type: Option<&str>, status: Option<&str>, page: Option<i64>, page_size: Option<i64>) -> Result<CatalogSkusListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("product_id", product_id, "form", true, false, None),
            QueryParameterSpec::new("fulfillment_type", fulfillment_type, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/catalog/skus".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Create product SKU
    pub async fn catalog_skus_create(&self, body: &CommerceProductSkuMutationRequest, idempotency_key: &str) -> Result<CatalogSkusCreateResult, SdkworkError> {
        let path = backend_path(&"/catalog/skus".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Update product SKU
    pub async fn catalog_skus_update(&self, sku_id: &str, body: &CommerceProductSkuMutationRequest, idempotency_key: &str) -> Result<CatalogSkusUpdateResult, SdkworkError> {
        let path = backend_path(&format!("/catalog/skus/{}", serialize_path_parameter(sku_id, PathParameterSpec::new("skuId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
            ],
            &[],
        );
        self.client.patch(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Commerce Reports Order Revenue List
    pub async fn reports_order_revenue_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<CommerceReportsOrderRevenueListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/commerce_reports/order_revenue".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Commerce Reports Payment Reconciliation Retrieve
    pub async fn reports_payment_reconciliation_retrieve(&self) -> Result<CommerceReportsPaymentReconciliationRetrieveResult, SdkworkError> {
        let path = backend_path(&"/commerce_reports/payment_reconciliation".to_string());
        self.client.get(&path, None, None).await
    }

    /// Commerce Reports Refunds List
    pub async fn reports_refunds_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<CommerceReportsRefundsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/commerce_reports/refunds".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Fulfillments List
    pub async fn fulfillments_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<FulfillmentsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/fulfillments".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// List inventory ledger entries
    pub async fn inventory_ledger_entries_list(&self, sku_id: Option<&str>, warehouse_id: Option<&str>, source_type: Option<&str>, source_id: Option<&str>, page: Option<i64>, page_size: Option<i64>) -> Result<InventoryLedgerEntriesListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("sku_id", sku_id, "form", true, false, None),
            QueryParameterSpec::new("warehouse_id", warehouse_id, "form", true, false, None),
            QueryParameterSpec::new("source_type", source_type, "form", true, false, None),
            QueryParameterSpec::new("source_id", source_id, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/inventory/ledger_entries".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// List inventory reservations
    pub async fn inventory_reservations_list(&self, sku_id: Option<&str>, order_id: Option<&str>, checkout_session_id: Option<&str>, status: Option<&str>, page: Option<i64>, page_size: Option<i64>) -> Result<InventoryReservationsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("sku_id", sku_id, "form", true, false, None),
            QueryParameterSpec::new("order_id", order_id, "form", true, false, None),
            QueryParameterSpec::new("checkout_session_id", checkout_session_id, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/inventory/reservations".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// List inventory stock records
    pub async fn inventory_stocks_list(&self, sku_id: Option<&str>, warehouse_id: Option<&str>, status: Option<&str>, page: Option<i64>, page_size: Option<i64>) -> Result<InventoryStocksListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("sku_id", sku_id, "form", true, false, None),
            QueryParameterSpec::new("warehouse_id", warehouse_id, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/inventory/stocks".to_string()), &query);
        self.client.get(&path, None, None).await
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

    /// Invoices List
    pub async fn invoices_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<InvoicesListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/invoices".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Invoices Titles List
    pub async fn invoices_titles_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<InvoicesTitlesListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/invoices/titles".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Invoices Retrieve
    pub async fn invoices_retrieve(&self, invoice_id: &str) -> Result<InvoicesRetrieveResult, SdkworkError> {
        let path = backend_path(&format!("/invoices/{}", serialize_path_parameter(invoice_id, PathParameterSpec::new("invoiceId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Memberships Entitlements List
    pub async fn memberships_entitlements_list(&self, page: Option<i64>, page_size: Option<i64>, plan_id: Option<&str>, membership_id: Option<&str>, status: Option<&str>) -> Result<MembershipsEntitlementsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("plan_id", plan_id, "form", true, false, None),
            QueryParameterSpec::new("membership_id", membership_id, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/memberships/entitlements".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Memberships Members List
    pub async fn memberships_members_list(&self, page: Option<i64>, page_size: Option<i64>, cursor: Option<&str>, user_id: Option<&str>, plan_id: Option<&str>, status: Option<&str>) -> Result<MembershipsMembersListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("cursor", cursor, "form", true, false, None),
            QueryParameterSpec::new("user_id", user_id, "form", true, false, None),
            QueryParameterSpec::new("plan_id", plan_id, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/memberships/members".to_string()), &query);
        self.client.get(&path, None, None).await
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

    /// Memberships Package Groups List
    pub async fn memberships_package_groups_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<MembershipsPackageGroupsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/memberships/package_groups".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Memberships Package Groups Create
    pub async fn memberships_package_groups_create(&self, body: &CommerceMembershipPackageGroupMutationRequest, idempotency_key: &str) -> Result<MembershipsPackageGroupsCreateResult, SdkworkError> {
        let path = backend_path(&"/memberships/package_groups".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Memberships Package Groups Delete
    pub async fn memberships_package_groups_delete(&self, package_group_id: &str) -> Result<MembershipsPackageGroupsDeleteResult, SdkworkError> {
        let path = backend_path(&format!("/memberships/package_groups/{}", serialize_path_parameter(package_group_id, PathParameterSpec::new("packageGroupId", "simple", false))));
        self.client.delete(&path, None, None).await
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

    /// Memberships Packages List
    pub async fn memberships_packages_list(&self, page: Option<i64>, page_size: Option<i64>, package_group_id: Option<&str>, plan_id: Option<&str>, status: Option<&str>) -> Result<MembershipsPackagesListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("package_group_id", package_group_id, "form", true, false, None),
            QueryParameterSpec::new("plan_id", plan_id, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/memberships/packages".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Memberships Packages Create
    pub async fn memberships_packages_create(&self, body: &CommerceMembershipPackageMutationRequest, idempotency_key: &str) -> Result<MembershipsPackagesCreateResult, SdkworkError> {
        let path = backend_path(&"/memberships/packages".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Memberships Packages Delete
    pub async fn memberships_packages_delete(&self, package_id: &str) -> Result<MembershipsPackagesDeleteResult, SdkworkError> {
        let path = backend_path(&format!("/memberships/packages/{}", serialize_path_parameter(package_id, PathParameterSpec::new("packageId", "simple", false))));
        self.client.delete(&path, None, None).await
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

    /// Memberships Plans List
    pub async fn memberships_plans_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<MembershipsPlansListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/memberships/plans".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Memberships Plans Create
    pub async fn memberships_plans_create(&self, body: &CommerceMembershipPlanMutationRequest, idempotency_key: &str) -> Result<MembershipsPlansCreateResult, SdkworkError> {
        let path = backend_path(&"/memberships/plans".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Memberships Plans Delete
    pub async fn memberships_plans_delete(&self, plan_id: &str) -> Result<MembershipsPlansDeleteResult, SdkworkError> {
        let path = backend_path(&format!("/memberships/plans/{}", serialize_path_parameter(plan_id, PathParameterSpec::new("planId", "simple", false))));
        self.client.delete(&path, None, None).await
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

    /// Orders List
    pub async fn orders_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<OrdersListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/orders".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Orders Retrieve
    pub async fn orders_retrieve(&self, order_id: &str) -> Result<OrdersRetrieveResult, SdkworkError> {
        let path = backend_path(&format!("/orders/{}", serialize_path_parameter(order_id, PathParameterSpec::new("orderId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Orders Events List
    pub async fn orders_events_list(&self, order_id: &str, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<OrdersEventsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&format!("/orders/{}/events", serialize_path_parameter(order_id, PathParameterSpec::new("orderId", "simple", false)))), &query);
        self.client.get(&path, None, None).await
    }

    /// Payments Attempts List
    pub async fn payments_attempts_list(&self, intent_id: Option<&str>, provider_code: Option<&str>, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<PaymentsAttemptsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("intent_id", intent_id, "form", true, false, None),
            QueryParameterSpec::new("provider_code", provider_code, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/payments/attempts".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Payments Channels List
    pub async fn payments_channels_list(&self, provider_account_id: Option<&str>, method_code: Option<&str>, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<PaymentsChannelsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("provider_account_id", provider_account_id, "form", true, false, None),
            QueryParameterSpec::new("method_code", method_code, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/payments/channels".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Payments Intents List
    pub async fn payments_intents_list(&self, order_id: Option<&str>, provider_code: Option<&str>, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<PaymentsIntentsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("order_id", order_id, "form", true, false, None),
            QueryParameterSpec::new("provider_code", provider_code, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/payments/intents".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Payments Methods List
    pub async fn payments_methods_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<PaymentsMethodsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/payments/methods".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Payments Provider Accounts List
    pub async fn payments_provider_accounts_list(&self, provider_code: Option<&str>, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<PaymentsProviderAccountsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("provider_code", provider_code, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/payments/provider_accounts".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Payments Provider Accounts Create
    pub async fn payments_provider_accounts_create(&self, body: &CommercePaymentProviderAccountMutationRequest, idempotency_key: &str) -> Result<PaymentsProviderAccountsCreateResult, SdkworkError> {
        let path = backend_path(&"/payments/provider_accounts".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Payments Providers List
    pub async fn payments_providers_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<PaymentsProvidersListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/payments/providers".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Payments Reconciliation Runs List
    pub async fn payments_reconciliation_runs_list(&self, provider_code: Option<&str>, business_date: Option<&str>, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<PaymentsReconciliationRunsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("provider_code", provider_code, "form", true, false, None),
            QueryParameterSpec::new("business_date", business_date, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/payments/reconciliation_runs".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Payments Route Rules List
    pub async fn payments_route_rules_list(&self, method_code: Option<&str>, country_code: Option<&str>, currency_code: Option<&str>, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<PaymentsRouteRulesListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("method_code", method_code, "form", true, false, None),
            QueryParameterSpec::new("country_code", country_code, "form", true, false, None),
            QueryParameterSpec::new("currency_code", currency_code, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/payments/route_rules".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Payments Webhook Events List
    pub async fn payments_webhook_events_list(&self, provider_code: Option<&str>, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<PaymentsWebhookEventsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("provider_code", provider_code, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/payments/webhook_events".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Recharges Orders List
    pub async fn recharges_orders_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<RechargesOrdersListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/recharges/orders".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Recharges Packages List
    pub async fn recharges_packages_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<RechargesPackagesListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/recharges/packages".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Recharges Packages Create
    pub async fn recharges_packages_create(&self, body: &CommerceRechargePackageMutationRequest, idempotency_key: &str) -> Result<RechargesPackagesCreateResult, SdkworkError> {
        let path = backend_path(&"/recharges/packages".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Recharges Packages Delete
    pub async fn recharges_packages_delete(&self, package_id: &str) -> Result<RechargesPackagesDeleteResult, SdkworkError> {
        let path = backend_path(&format!("/recharges/packages/{}", serialize_path_parameter(package_id, PathParameterSpec::new("packageId", "simple", false))));
        self.client.delete(&path, None, None).await
    }

    /// Recharges Packages Update
    pub async fn recharges_packages_update(&self, package_id: &str, body: &CommerceRechargePackageMutationRequest, idempotency_key: &str) -> Result<RechargesPackagesUpdateResult, SdkworkError> {
        let path = backend_path(&format!("/recharges/packages/{}", serialize_path_parameter(package_id, PathParameterSpec::new("packageId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
            ],
            &[],
        );
        self.client.patch(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Refunds List
    pub async fn refunds_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<RefundsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/refunds".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Refunds Retrieve
    pub async fn refunds_retrieve(&self, refund_id: &str) -> Result<RefundsRetrieveResult, SdkworkError> {
        let path = backend_path(&format!("/refunds/{}", serialize_path_parameter(refund_id, PathParameterSpec::new("refundId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Shipments List
    pub async fn shipments_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<ShipmentsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/shipments".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Shipments Tracking Events List
    pub async fn shipments_tracking_events_list(&self, shipment_id: &str, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<ShipmentsTrackingEventsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&format!("/shipments/{}/tracking_events", serialize_path_parameter(shipment_id, PathParameterSpec::new("shipmentId", "simple", false)))), &query);
        self.client.get(&path, None, None).await
    }

    /// Wallet Accounts List
    pub async fn wallet_accounts_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<WalletAccountsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/wallet/accounts".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Wallet Adjustments Create
    pub async fn wallet_adjustments_create(&self, body: &CommerceStandardCommandRequest, idempotency_key: &str) -> Result<WalletAdjustmentsCreateResult, SdkworkError> {
        let path = backend_path(&"/wallet/adjustments".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Wallet Exchange Rules List
    pub async fn wallet_exchange_rules_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<WalletExchangeRulesListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/wallet/exchange_rules".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Wallet Ledger Entries List
    pub async fn wallet_ledger_entries_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<WalletLedgerEntriesListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(backend_path(&"/wallet/ledger_entries".to_string()), &query);
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
