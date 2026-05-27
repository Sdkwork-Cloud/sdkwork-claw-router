use std::sync::Arc;

use crate::api::base::{RequestHeaders};
use crate::api::paths::app_path;
use crate::api::paths::append_query_string;
use crate::http::{SdkworkError, SdkworkHttpClient};
use crate::models::{AccountsCurrentSummaryRetrieveResult, AddressesCreateResult, AddressesDefaultSelectionCreateResult, AddressesDeleteResult, AddressesListResult, AddressesUpdateResult, BillingHistoryListResult, CartCurrentRetrieveResult, CartItemsCreateResult, CartItemsDeleteResult, CartItemsUpdateResult, CatalogCategoriesListResult, CatalogProductsListResult, CatalogProductsRetrieveResult, CatalogSkusRetrieveResult, CheckoutSessionsCreateResult, CheckoutSessionsOrdersCreateResult, CheckoutSessionsQuotesCreateResult, CheckoutSessionsRetrieveResult, CommerceMembershipPurchaseRequest, CommercePaymentAttemptCreateRequest, CommercePaymentIntentCreateRequest, CommerceStandardCommandRequest, FulfillmentsListResult, FulfillmentsRetrieveResult, InvoicesCreateResult, InvoicesListResult, InvoicesRetrieveResult, MembershipsBenefitsListResult, MembershipsCurrentRetrieveResult, MembershipsCurrentStatusRetrieveResult, MembershipsPackageGroupsListResult, MembershipsPackageGroupsPackagesListResult, MembershipsPackageGroupsRetrieveResult, MembershipsPackagesListResult, MembershipsPackagesRetrieveResult, MembershipsPlansListResult, MembershipsPointsBalanceRetrieveResult, MembershipsPointsDailyRewardsCreateRequest, MembershipsPointsDailyRewardsCreateResult, MembershipsPointsDailyRewardsStatusRetrieveResult, MembershipsPointsHistoryListResult, MembershipsPrivilegesSpeedUpsCreateRequest, MembershipsPrivilegesSpeedUpsCreateResult, MembershipsPrivilegesUsageRetrieveResult, MembershipsPurchasesCreateResult, MembershipsPurchasesRenewResult, MembershipsPurchasesUpgradeResult, OrdersCancellationsCreateResult, OrdersEventsListResult, OrdersListResult, OrdersRetrieveResult, PaymentsAttemptsRetrieveResult, PaymentsIntentsAttemptsCreateResult, PaymentsIntentsCreateResult, PaymentsIntentsRetrieveResult, PaymentsMethodsListResult, RechargesOrdersCreateResult, RechargesOrdersRetrieveResult, RechargesPackagesListResult, RefundsCreateResult, RefundsListResult, RefundsRetrieveResult, ShipmentsRetrieveResult, WalletAccountsListResult, WalletExchangeRateRetrieveResult, WalletLedgerEntriesListResult, WalletOverviewRetrieveResult, WalletPointsExchangeRulesListResult, WalletTokensRetrieveResult};

#[derive(Clone)]
pub struct CommerceApi {
    client: Arc<SdkworkHttpClient>,
}

impl CommerceApi {
    pub fn new(client: Arc<SdkworkHttpClient>) -> Self {
        Self { client }
    }

    /// Accounts Current Summary Retrieve
    pub async fn accounts_current_summary_retrieve(&self) -> Result<AccountsCurrentSummaryRetrieveResult, SdkworkError> {
        let path = app_path(&"/accounts/current/summary".to_string());
        self.client.get(&path, None, None).await
    }

    /// Addresses List
    pub async fn addresses_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<AddressesListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/addresses".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Addresses Create
    pub async fn addresses_create(&self, body: &CommerceStandardCommandRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<AddressesCreateResult, SdkworkError> {
        let path = app_path(&"/addresses".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Addresses Delete
    pub async fn addresses_delete(&self, address_id: &str, idempotency_key: &str, x_request_id: Option<&str>) -> Result<AddressesDeleteResult, SdkworkError> {
        let path = app_path(&format!("/addresses/{}", serialize_path_parameter(address_id, PathParameterSpec::new("addressId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.delete(&path, None, headers.as_ref()).await
    }

    /// Addresses Update
    pub async fn addresses_update(&self, address_id: &str, body: &CommerceStandardCommandRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<AddressesUpdateResult, SdkworkError> {
        let path = app_path(&format!("/addresses/{}", serialize_path_parameter(address_id, PathParameterSpec::new("addressId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.patch(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Addresses Default Selection Create
    pub async fn addresses_default_selection_create(&self, address_id: &str, body: &CommerceStandardCommandRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<AddressesDefaultSelectionCreateResult, SdkworkError> {
        let path = app_path(&format!("/addresses/{}/default_selection", serialize_path_parameter(address_id, PathParameterSpec::new("addressId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Billing History List
    pub async fn billing_history_list(&self, page: Option<i64>, page_size: Option<i64>, r#type: Option<&str>, status: Option<&str>) -> Result<BillingHistoryListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("type", r#type, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/billing/history".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Cart Current Retrieve
    pub async fn cart_current_retrieve(&self) -> Result<CartCurrentRetrieveResult, SdkworkError> {
        let path = app_path(&"/cart/current".to_string());
        self.client.get(&path, None, None).await
    }

    /// Cart Items Create
    pub async fn cart_items_create(&self, body: &CommerceStandardCommandRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<CartItemsCreateResult, SdkworkError> {
        let path = app_path(&"/cart/items".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Cart Items Delete
    pub async fn cart_items_delete(&self, cart_item_id: &str, idempotency_key: &str, x_request_id: Option<&str>) -> Result<CartItemsDeleteResult, SdkworkError> {
        let path = app_path(&format!("/cart/items/{}", serialize_path_parameter(cart_item_id, PathParameterSpec::new("cartItemId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.delete(&path, None, headers.as_ref()).await
    }

    /// Cart Items Update
    pub async fn cart_items_update(&self, cart_item_id: &str, body: &CommerceStandardCommandRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<CartItemsUpdateResult, SdkworkError> {
        let path = app_path(&format!("/cart/items/{}", serialize_path_parameter(cart_item_id, PathParameterSpec::new("cartItemId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.patch(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// List visible product categories
    pub async fn catalog_categories_list(&self, parent_id: Option<&str>, status: Option<&str>, page: Option<i64>, page_size: Option<i64>) -> Result<CatalogCategoriesListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("parent_id", parent_id, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/catalog/categories".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// List visible catalog products
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
        let path = append_query_string(app_path(&"/catalog/products".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Retrieve catalog product detail
    pub async fn catalog_products_retrieve(&self, product_id: &str) -> Result<CatalogProductsRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/catalog/products/{}", serialize_path_parameter(product_id, PathParameterSpec::new("productId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Retrieve catalog SKU detail
    pub async fn catalog_skus_retrieve(&self, sku_id: &str) -> Result<CatalogSkusRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/catalog/skus/{}", serialize_path_parameter(sku_id, PathParameterSpec::new("skuId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Checkout Sessions Create
    pub async fn checkout_sessions_create(&self, body: &CommerceStandardCommandRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<CheckoutSessionsCreateResult, SdkworkError> {
        let path = app_path(&"/checkout/sessions".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Checkout Sessions Retrieve
    pub async fn checkout_sessions_retrieve(&self, checkout_session_id: &str) -> Result<CheckoutSessionsRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/checkout/sessions/{}", serialize_path_parameter(checkout_session_id, PathParameterSpec::new("checkoutSessionId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Checkout Sessions Orders Create
    pub async fn checkout_sessions_orders_create(&self, checkout_session_id: &str, body: &CommerceStandardCommandRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<CheckoutSessionsOrdersCreateResult, SdkworkError> {
        let path = app_path(&format!("/checkout/sessions/{}/orders", serialize_path_parameter(checkout_session_id, PathParameterSpec::new("checkoutSessionId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Checkout Sessions Quotes Create
    pub async fn checkout_sessions_quotes_create(&self, checkout_session_id: &str, body: &CommerceStandardCommandRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<CheckoutSessionsQuotesCreateResult, SdkworkError> {
        let path = app_path(&format!("/checkout/sessions/{}/quotes", serialize_path_parameter(checkout_session_id, PathParameterSpec::new("checkoutSessionId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Fulfillments List
    pub async fn fulfillments_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<FulfillmentsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/fulfillments".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Fulfillments Retrieve
    pub async fn fulfillments_retrieve(&self, fulfillment_id: &str) -> Result<FulfillmentsRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/fulfillments/{}", serialize_path_parameter(fulfillment_id, PathParameterSpec::new("fulfillmentId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Invoices List
    pub async fn invoices_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<InvoicesListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/invoices".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Invoices Create
    pub async fn invoices_create(&self, body: &CommerceStandardCommandRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<InvoicesCreateResult, SdkworkError> {
        let path = app_path(&"/invoices".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Invoices Retrieve
    pub async fn invoices_retrieve(&self, invoice_id: &str) -> Result<InvoicesRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/invoices/{}", serialize_path_parameter(invoice_id, PathParameterSpec::new("invoiceId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Memberships Benefits List
    pub async fn memberships_benefits_list(&self, plan_id: Option<i64>) -> Result<MembershipsBenefitsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("plan_id", plan_id, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/memberships/benefits".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Memberships Current Retrieve
    pub async fn memberships_current_retrieve(&self) -> Result<MembershipsCurrentRetrieveResult, SdkworkError> {
        let path = app_path(&"/memberships/current".to_string());
        self.client.get(&path, None, None).await
    }

    /// Memberships Current Status Retrieve
    pub async fn memberships_current_status_retrieve(&self) -> Result<MembershipsCurrentStatusRetrieveResult, SdkworkError> {
        let path = app_path(&"/memberships/current/status".to_string());
        self.client.get(&path, None, None).await
    }

    /// Memberships Package Groups List
    pub async fn get_memberships_package_groups_list(&self, plan_id: Option<i64>, recommended_only: Option<bool>) -> Result<MembershipsPackageGroupsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("plan_id", plan_id, "form", true, false, None),
            QueryParameterSpec::new("recommended_only", recommended_only, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/memberships/package_groups".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Memberships Package Groups Retrieve
    pub async fn memberships_package_groups_retrieve(&self, package_group_id: &str) -> Result<MembershipsPackageGroupsRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/memberships/package_groups/{}", serialize_path_parameter(package_group_id, PathParameterSpec::new("packageGroupId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Memberships Package Groups Packages List
    pub async fn get_memberships_package_groups_list_package_groups(&self, package_group_id: &str, plan_id: Option<i64>) -> Result<MembershipsPackageGroupsPackagesListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("plan_id", plan_id, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&format!("/memberships/package_groups/{}/packages", serialize_path_parameter(package_group_id, PathParameterSpec::new("packageGroupId", "simple", false)))), &query);
        self.client.get(&path, None, None).await
    }

    /// Memberships Packages List
    pub async fn memberships_packages_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<MembershipsPackagesListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/memberships/packages".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Memberships Packages Retrieve
    pub async fn memberships_packages_retrieve(&self, package_id: &str) -> Result<MembershipsPackagesRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/memberships/packages/{}", serialize_path_parameter(package_id, PathParameterSpec::new("packageId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Memberships Plans List
    pub async fn memberships_plans_list(&self) -> Result<MembershipsPlansListResult, SdkworkError> {
        let path = app_path(&"/memberships/plans".to_string());
        self.client.get(&path, None, None).await
    }

    /// Memberships Points Balance Retrieve
    pub async fn memberships_points_balance_retrieve(&self) -> Result<MembershipsPointsBalanceRetrieveResult, SdkworkError> {
        let path = app_path(&"/memberships/points/balance".to_string());
        self.client.get(&path, None, None).await
    }

    /// Memberships Points Daily Rewards Create
    pub async fn memberships_points_daily_rewards_create(&self, body: &MembershipsPointsDailyRewardsCreateRequest, x_request_id: Option<&str>) -> Result<MembershipsPointsDailyRewardsCreateResult, SdkworkError> {
        let path = app_path(&"/memberships/points/daily_rewards".to_string());
        let headers = build_request_headers(
            &[
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Memberships Points Daily Rewards Status Retrieve
    pub async fn memberships_points_daily_rewards_status_retrieve(&self) -> Result<MembershipsPointsDailyRewardsStatusRetrieveResult, SdkworkError> {
        let path = app_path(&"/memberships/points/daily_rewards/status".to_string());
        self.client.get(&path, None, None).await
    }

    /// Memberships Points History List
    pub async fn memberships_points_history_list(&self, page: Option<i64>, page_size: Option<i64>, cursor: Option<&str>) -> Result<MembershipsPointsHistoryListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("cursor", cursor, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/memberships/points/history".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Memberships Privileges Speed Ups Create
    pub async fn memberships_privileges_speed_ups_create(&self, body: &MembershipsPrivilegesSpeedUpsCreateRequest, x_request_id: Option<&str>) -> Result<MembershipsPrivilegesSpeedUpsCreateResult, SdkworkError> {
        let path = app_path(&"/memberships/privileges/speed_ups".to_string());
        let headers = build_request_headers(
            &[
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Memberships Privileges Usage Retrieve
    pub async fn memberships_privileges_usage_retrieve(&self) -> Result<MembershipsPrivilegesUsageRetrieveResult, SdkworkError> {
        let path = app_path(&"/memberships/privileges/usage".to_string());
        self.client.get(&path, None, None).await
    }

    /// Memberships Purchases Create
    pub async fn memberships_purchases_create(&self, body: &CommerceMembershipPurchaseRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<MembershipsPurchasesCreateResult, SdkworkError> {
        let path = app_path(&"/memberships/purchases".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Memberships Purchases Renew
    pub async fn memberships_purchases_renew(&self, body: &CommerceMembershipPurchaseRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<MembershipsPurchasesRenewResult, SdkworkError> {
        let path = app_path(&"/memberships/purchases/renew".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Memberships Purchases Upgrade
    pub async fn memberships_purchases_upgrade(&self, body: &CommerceMembershipPurchaseRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<MembershipsPurchasesUpgradeResult, SdkworkError> {
        let path = app_path(&"/memberships/purchases/upgrade".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Orders List
    pub async fn orders_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<OrdersListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/orders".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Orders Retrieve
    pub async fn orders_retrieve(&self, order_id: &str) -> Result<OrdersRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/orders/{}", serialize_path_parameter(order_id, PathParameterSpec::new("orderId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Orders Cancellations Create
    pub async fn orders_cancellations_create(&self, order_id: &str, body: &CommerceStandardCommandRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<OrdersCancellationsCreateResult, SdkworkError> {
        let path = app_path(&format!("/orders/{}/cancellations", serialize_path_parameter(order_id, PathParameterSpec::new("orderId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Orders Events List
    pub async fn orders_events_list(&self, order_id: &str, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<OrdersEventsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&format!("/orders/{}/events", serialize_path_parameter(order_id, PathParameterSpec::new("orderId", "simple", false)))), &query);
        self.client.get(&path, None, None).await
    }

    /// Payments Attempts Retrieve
    pub async fn payments_attempts_retrieve(&self, payment_attempt_id: &str) -> Result<PaymentsAttemptsRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/payments/attempts/{}", serialize_path_parameter(payment_attempt_id, PathParameterSpec::new("paymentAttemptId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Payments Intents Create
    pub async fn payments_intents_create(&self, body: &CommercePaymentIntentCreateRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<PaymentsIntentsCreateResult, SdkworkError> {
        let path = app_path(&"/payments/intents".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Payments Intents Retrieve
    pub async fn payments_intents_retrieve(&self, payment_intent_id: &str) -> Result<PaymentsIntentsRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/payments/intents/{}", serialize_path_parameter(payment_intent_id, PathParameterSpec::new("paymentIntentId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Payments Intents Attempts Create
    pub async fn payments_intents_attempts_create(&self, payment_intent_id: &str, body: &CommercePaymentAttemptCreateRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<PaymentsIntentsAttemptsCreateResult, SdkworkError> {
        let path = app_path(&format!("/payments/intents/{}/attempts", serialize_path_parameter(payment_intent_id, PathParameterSpec::new("paymentIntentId", "simple", false))));
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Payments Methods List
    pub async fn payments_methods_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<PaymentsMethodsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/payments/methods".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Recharges Orders Create
    pub async fn recharges_orders_create(&self, body: &CommerceStandardCommandRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<RechargesOrdersCreateResult, SdkworkError> {
        let path = app_path(&"/recharges/orders".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Recharges Orders Retrieve
    pub async fn recharges_orders_retrieve(&self, order_id: &str) -> Result<RechargesOrdersRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/recharges/orders/{}", serialize_path_parameter(order_id, PathParameterSpec::new("orderId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Recharges Packages List
    pub async fn recharges_packages_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<RechargesPackagesListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/recharges/packages".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Refunds List
    pub async fn refunds_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<RefundsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/refunds".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Refunds Create
    pub async fn refunds_create(&self, body: &CommerceStandardCommandRequest, idempotency_key: &str, x_request_id: Option<&str>) -> Result<RefundsCreateResult, SdkworkError> {
        let path = app_path(&"/refunds".to_string());
        let headers = build_request_headers(
            &[
                ("Idempotency-Key", HeaderParameterSpec::new(idempotency_key, "simple", false, None)),
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Refunds Retrieve
    pub async fn refunds_retrieve(&self, refund_id: &str) -> Result<RefundsRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/refunds/{}", serialize_path_parameter(refund_id, PathParameterSpec::new("refundId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Shipments Retrieve
    pub async fn shipments_retrieve(&self, shipment_id: &str) -> Result<ShipmentsRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/shipments/{}", serialize_path_parameter(shipment_id, PathParameterSpec::new("shipmentId", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Wallet Accounts List
    pub async fn wallet_accounts_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<WalletAccountsListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/wallet/accounts".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Wallet Exchange Rate Retrieve
    pub async fn wallet_exchange_rate_retrieve(&self) -> Result<WalletExchangeRateRetrieveResult, SdkworkError> {
        let path = app_path(&"/wallet/exchange_rate".to_string());
        self.client.get(&path, None, None).await
    }

    /// Wallet Ledger Entries List
    pub async fn wallet_ledger_entries_list(&self, page: Option<i64>, page_size: Option<i64>, status: Option<&str>) -> Result<WalletLedgerEntriesListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("page", page, "form", true, false, None),
            QueryParameterSpec::new("page_size", page_size, "form", true, false, None),
            QueryParameterSpec::new("status", status, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/wallet/ledger_entries".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Wallet Overview Retrieve
    pub async fn wallet_overview_retrieve(&self) -> Result<WalletOverviewRetrieveResult, SdkworkError> {
        let path = app_path(&"/wallet/overview".to_string());
        self.client.get(&path, None, None).await
    }

    /// Wallet Points Exchange Rules List
    pub async fn wallet_points_exchange_rules_list(&self, source_asset_type: Option<&str>, target_asset_type: Option<&str>) -> Result<WalletPointsExchangeRulesListResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("source_asset_type", source_asset_type, "form", true, false, None),
            QueryParameterSpec::new("target_asset_type", target_asset_type, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/wallet/points/exchanges/rules".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Wallet Tokens Retrieve
    pub async fn wallet_tokens_retrieve(&self) -> Result<WalletTokensRetrieveResult, SdkworkError> {
        let path = app_path(&"/wallet/tokens".to_string());
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
