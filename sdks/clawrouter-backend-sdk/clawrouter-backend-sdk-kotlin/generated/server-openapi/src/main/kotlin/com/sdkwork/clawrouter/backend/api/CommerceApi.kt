package com.sdkwork.clawrouter.backend.api

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.sdkwork.clawrouter.backend.*
import com.sdkwork.clawrouter.backend.http.HttpClient

class CommerceApi(private val client: HttpClient) {

    /** Audit Commerce Events List */
    suspend fun auditCommerceEventsList(page: String? = null, pageSize: String? = null, status: String? = null): AuditCommerceEventsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/audit/commerce_events"), query))
        return client.convertValue(raw, object : TypeReference<AuditCommerceEventsListResult>() {})
    }

    /** Commerce Reports Order Revenue List */
    suspend fun reportsOrderRevenueList(page: String? = null, pageSize: String? = null, status: String? = null): CommerceReportsOrderRevenueListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/commerce_reports/order_revenue"), query))
        return client.convertValue(raw, object : TypeReference<CommerceReportsOrderRevenueListResult>() {})
    }

    /** Commerce Reports Payment Reconciliation Retrieve */
    suspend fun reportsPaymentReconciliationRetrieve(): CommerceReportsPaymentReconciliationRetrieveResult? {
        val raw = client.get(ApiPaths.backendPath("/commerce_reports/payment_reconciliation"))
        return client.convertValue(raw, object : TypeReference<CommerceReportsPaymentReconciliationRetrieveResult>() {})
    }

    /** Commerce Reports Refunds List */
    suspend fun reportsRefundsList(page: String? = null, pageSize: String? = null, status: String? = null): CommerceReportsRefundsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/commerce_reports/refunds"), query))
        return client.convertValue(raw, object : TypeReference<CommerceReportsRefundsListResult>() {})
    }

    /** Fulfillments List */
    suspend fun fulfillmentsList(page: String? = null, pageSize: String? = null, status: String? = null): FulfillmentsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/fulfillments"), query))
        return client.convertValue(raw, object : TypeReference<FulfillmentsListResult>() {})
    }

    /** List inventory ledger entries */
    suspend fun inventoryLedgerEntriesList(skuId: String? = null, warehouseId: String? = null, sourceType: String? = null, sourceId: String? = null, page: String? = null, pageSize: String? = null): InventoryLedgerEntriesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("sku_id", skuId, "form", true, false, null),
            QueryParameterSpec("warehouse_id", warehouseId, "form", true, false, null),
            QueryParameterSpec("source_type", sourceType, "form", true, false, null),
            QueryParameterSpec("source_id", sourceId, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/inventory/ledger_entries"), query))
        return client.convertValue(raw, object : TypeReference<InventoryLedgerEntriesListResult>() {})
    }

    /** List inventory reservations */
    suspend fun inventoryReservationsList(skuId: String? = null, orderId: String? = null, checkoutSessionId: String? = null, status: String? = null, page: String? = null, pageSize: String? = null): InventoryReservationsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("sku_id", skuId, "form", true, false, null),
            QueryParameterSpec("order_id", orderId, "form", true, false, null),
            QueryParameterSpec("checkout_session_id", checkoutSessionId, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/inventory/reservations"), query))
        return client.convertValue(raw, object : TypeReference<InventoryReservationsListResult>() {})
    }

    /** List inventory stock records */
    suspend fun inventoryStocksList(skuId: String? = null, warehouseId: String? = null, status: String? = null, page: String? = null, pageSize: String? = null): InventoryStocksListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("sku_id", skuId, "form", true, false, null),
            QueryParameterSpec("warehouse_id", warehouseId, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/inventory/stocks"), query))
        return client.convertValue(raw, object : TypeReference<InventoryStocksListResult>() {})
    }

    /** Update inventory stock */
    suspend fun inventoryStocksUpdate(stockId: String, body: CommerceInventoryStockUpdateRequest, idempotencyKey: String): InventoryStocksUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.patch(ApiPaths.backendPath("/inventory/stocks/${serializePathParameter(stockId, PathParameterSpec("stockId", "simple", false))}"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<InventoryStocksUpdateResult>() {})
    }

    /** Invoices List */
    suspend fun invoicesList(page: String? = null, pageSize: String? = null, status: String? = null): InvoicesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/invoices"), query))
        return client.convertValue(raw, object : TypeReference<InvoicesListResult>() {})
    }

    /** Invoices Titles List */
    suspend fun invoicesTitlesList(page: String? = null, pageSize: String? = null, status: String? = null): InvoicesTitlesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/invoices/titles"), query))
        return client.convertValue(raw, object : TypeReference<InvoicesTitlesListResult>() {})
    }

    /** Invoices Retrieve */
    suspend fun invoicesRetrieve(invoiceId: String): InvoicesRetrieveResult? {
        val raw = client.get(ApiPaths.backendPath("/invoices/${serializePathParameter(invoiceId, PathParameterSpec("invoiceId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<InvoicesRetrieveResult>() {})
    }

    /** Memberships Entitlements List */
    suspend fun membershipsEntitlementsList(page: String? = null, pageSize: String? = null, planId: String? = null, membershipId: String? = null, status: String? = null): MembershipsEntitlementsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("plan_id", planId, "form", true, false, null),
            QueryParameterSpec("membership_id", membershipId, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/memberships/entitlements"), query))
        return client.convertValue(raw, object : TypeReference<MembershipsEntitlementsListResult>() {})
    }

    /** Memberships Members List */
    suspend fun membershipsMembersList(page: String? = null, pageSize: String? = null, cursor: String? = null, userId: String? = null, planId: String? = null, status: String? = null): MembershipsMembersListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("cursor", cursor, "form", true, false, null),
            QueryParameterSpec("user_id", userId, "form", true, false, null),
            QueryParameterSpec("plan_id", planId, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/memberships/members"), query))
        return client.convertValue(raw, object : TypeReference<MembershipsMembersListResult>() {})
    }

    /** Memberships Members Status Update */
    suspend fun membershipsMembersStatusUpdate(membershipId: String, body: CommerceMembershipMemberStatusRequest, idempotencyKey: String): MembershipsMembersStatusUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.patch(ApiPaths.backendPath("/memberships/members/${serializePathParameter(membershipId, PathParameterSpec("membershipId", "simple", false))}/status"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<MembershipsMembersStatusUpdateResult>() {})
    }

    /** Memberships Package Groups List */
    suspend fun membershipsPackageGroupsList(page: String? = null, pageSize: String? = null, status: String? = null): MembershipsPackageGroupsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/memberships/package_groups"), query))
        return client.convertValue(raw, object : TypeReference<MembershipsPackageGroupsListResult>() {})
    }

    /** Memberships Package Groups Create */
    suspend fun membershipsPackageGroupsCreate(body: CommerceMembershipPackageGroupMutationRequest, idempotencyKey: String): MembershipsPackageGroupsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/memberships/package_groups"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<MembershipsPackageGroupsCreateResult>() {})
    }

    /** Memberships Package Groups Delete */
    suspend fun membershipsPackageGroupsDelete(packageGroupId: String): MembershipsPackageGroupsDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/memberships/package_groups/${serializePathParameter(packageGroupId, PathParameterSpec("packageGroupId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<MembershipsPackageGroupsDeleteResult>() {})
    }

    /** Memberships Package Groups Update */
    suspend fun membershipsPackageGroupsUpdate(packageGroupId: String, body: CommerceMembershipPackageGroupMutationRequest, idempotencyKey: String): MembershipsPackageGroupsUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.put(ApiPaths.backendPath("/memberships/package_groups/${serializePathParameter(packageGroupId, PathParameterSpec("packageGroupId", "simple", false))}"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<MembershipsPackageGroupsUpdateResult>() {})
    }

    /** Memberships Packages List */
    suspend fun membershipsPackagesList(page: String? = null, pageSize: String? = null, packageGroupId: String? = null, planId: String? = null, status: String? = null): MembershipsPackagesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("package_group_id", packageGroupId, "form", true, false, null),
            QueryParameterSpec("plan_id", planId, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/memberships/packages"), query))
        return client.convertValue(raw, object : TypeReference<MembershipsPackagesListResult>() {})
    }

    /** Memberships Packages Create */
    suspend fun membershipsPackagesCreate(body: CommerceMembershipPackageMutationRequest, idempotencyKey: String): MembershipsPackagesCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/memberships/packages"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<MembershipsPackagesCreateResult>() {})
    }

    /** Memberships Packages Delete */
    suspend fun membershipsPackagesDelete(packageId: String): MembershipsPackagesDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/memberships/packages/${serializePathParameter(packageId, PathParameterSpec("packageId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<MembershipsPackagesDeleteResult>() {})
    }

    /** Memberships Packages Update */
    suspend fun membershipsPackagesUpdate(packageId: String, body: CommerceMembershipPackageMutationRequest, idempotencyKey: String): MembershipsPackagesUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.put(ApiPaths.backendPath("/memberships/packages/${serializePathParameter(packageId, PathParameterSpec("packageId", "simple", false))}"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<MembershipsPackagesUpdateResult>() {})
    }

    /** Memberships Plans List */
    suspend fun membershipsPlansList(page: String? = null, pageSize: String? = null, status: String? = null): MembershipsPlansListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/memberships/plans"), query))
        return client.convertValue(raw, object : TypeReference<MembershipsPlansListResult>() {})
    }

    /** Memberships Plans Create */
    suspend fun membershipsPlansCreate(body: CommerceMembershipPlanMutationRequest, idempotencyKey: String): MembershipsPlansCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/memberships/plans"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<MembershipsPlansCreateResult>() {})
    }

    /** Memberships Plans Delete */
    suspend fun membershipsPlansDelete(planId: String): MembershipsPlansDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/memberships/plans/${serializePathParameter(planId, PathParameterSpec("planId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<MembershipsPlansDeleteResult>() {})
    }

    /** Memberships Plans Update */
    suspend fun membershipsPlansUpdate(planId: String, body: CommerceMembershipPlanMutationRequest, idempotencyKey: String): MembershipsPlansUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.put(ApiPaths.backendPath("/memberships/plans/${serializePathParameter(planId, PathParameterSpec("planId", "simple", false))}"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<MembershipsPlansUpdateResult>() {})
    }

    /** Orders List */
    suspend fun ordersList(page: String? = null, pageSize: String? = null, status: String? = null): OrdersListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/orders"), query))
        return client.convertValue(raw, object : TypeReference<OrdersListResult>() {})
    }

    /** Orders Retrieve */
    suspend fun ordersRetrieve(orderId: String): OrdersRetrieveResult? {
        val raw = client.get(ApiPaths.backendPath("/orders/${serializePathParameter(orderId, PathParameterSpec("orderId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<OrdersRetrieveResult>() {})
    }

    /** Orders Events List */
    suspend fun ordersEventsList(orderId: String, page: String? = null, pageSize: String? = null, status: String? = null): OrdersEventsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/orders/${serializePathParameter(orderId, PathParameterSpec("orderId", "simple", false))}/events"), query))
        return client.convertValue(raw, object : TypeReference<OrdersEventsListResult>() {})
    }

    /** Payments Attempts List */
    suspend fun paymentsAttemptsList(intentId: String? = null, providerCode: String? = null, page: String? = null, pageSize: String? = null, status: String? = null): PaymentsAttemptsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("intent_id", intentId, "form", true, false, null),
            QueryParameterSpec("provider_code", providerCode, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/attempts"), query))
        return client.convertValue(raw, object : TypeReference<PaymentsAttemptsListResult>() {})
    }

    /** Payments Channels List */
    suspend fun paymentsChannelsList(providerAccountId: String? = null, methodCode: String? = null, page: String? = null, pageSize: String? = null, status: String? = null): PaymentsChannelsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("provider_account_id", providerAccountId, "form", true, false, null),
            QueryParameterSpec("method_code", methodCode, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/channels"), query))
        return client.convertValue(raw, object : TypeReference<PaymentsChannelsListResult>() {})
    }

    /** Payments Intents List */
    suspend fun paymentsIntentsList(orderId: String? = null, providerCode: String? = null, page: String? = null, pageSize: String? = null, status: String? = null): PaymentsIntentsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("order_id", orderId, "form", true, false, null),
            QueryParameterSpec("provider_code", providerCode, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/intents"), query))
        return client.convertValue(raw, object : TypeReference<PaymentsIntentsListResult>() {})
    }

    /** Payments Methods List */
    suspend fun paymentsMethodsList(page: String? = null, pageSize: String? = null, status: String? = null): PaymentsMethodsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/methods"), query))
        return client.convertValue(raw, object : TypeReference<PaymentsMethodsListResult>() {})
    }

    /** Payments Provider Accounts List */
    suspend fun paymentsProviderAccountsList(providerCode: String? = null, page: String? = null, pageSize: String? = null, status: String? = null): PaymentsProviderAccountsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("provider_code", providerCode, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/provider_accounts"), query))
        return client.convertValue(raw, object : TypeReference<PaymentsProviderAccountsListResult>() {})
    }

    /** Payments Provider Accounts Create */
    suspend fun paymentsProviderAccountsCreate(body: CommercePaymentProviderAccountMutationRequest, idempotencyKey: String): PaymentsProviderAccountsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/payments/provider_accounts"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<PaymentsProviderAccountsCreateResult>() {})
    }

    /** Payments Provider Accounts Delete */
    suspend fun paymentsProviderAccountsDelete(providerAccountId: String): PaymentsProviderAccountsDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/payments/provider_accounts/${serializePathParameter(providerAccountId, PathParameterSpec("providerAccountId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<PaymentsProviderAccountsDeleteResult>() {})
    }

    /** Payments Provider Accounts Update */
    suspend fun paymentsProviderAccountsUpdate(providerAccountId: String, body: CommercePaymentProviderAccountMutationRequest, idempotencyKey: String): PaymentsProviderAccountsUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.patch(ApiPaths.backendPath("/payments/provider_accounts/${serializePathParameter(providerAccountId, PathParameterSpec("providerAccountId", "simple", false))}"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<PaymentsProviderAccountsUpdateResult>() {})
    }

    /** Payments Provider Accounts Status Update */
    suspend fun paymentsProviderAccountsStatusUpdate(providerAccountId: String, body: CommercePaymentProviderAccountStatusUpdateRequest, idempotencyKey: String): PaymentsProviderAccountsStatusUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.patch(ApiPaths.backendPath("/payments/provider_accounts/${serializePathParameter(providerAccountId, PathParameterSpec("providerAccountId", "simple", false))}/status"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<PaymentsProviderAccountsStatusUpdateResult>() {})
    }

    /** Payments Providers List */
    suspend fun paymentsProvidersList(page: String? = null, pageSize: String? = null, status: String? = null): PaymentsProvidersListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/providers"), query))
        return client.convertValue(raw, object : TypeReference<PaymentsProvidersListResult>() {})
    }

    /** Payments Reconciliation Runs List */
    suspend fun paymentsReconciliationRunsList(providerCode: String? = null, businessDate: String? = null, page: String? = null, pageSize: String? = null, status: String? = null): PaymentsReconciliationRunsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("provider_code", providerCode, "form", true, false, null),
            QueryParameterSpec("business_date", businessDate, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/reconciliation_runs"), query))
        return client.convertValue(raw, object : TypeReference<PaymentsReconciliationRunsListResult>() {})
    }

    /** Payments Route Rules List */
    suspend fun paymentsRouteRulesList(methodCode: String? = null, countryCode: String? = null, currencyCode: String? = null, page: String? = null, pageSize: String? = null, status: String? = null): PaymentsRouteRulesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("method_code", methodCode, "form", true, false, null),
            QueryParameterSpec("country_code", countryCode, "form", true, false, null),
            QueryParameterSpec("currency_code", currencyCode, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/route_rules"), query))
        return client.convertValue(raw, object : TypeReference<PaymentsRouteRulesListResult>() {})
    }

    /** Payments Runtime Snapshot Retrieve */
    suspend fun paymentsRuntimeSnapshotRetrieve(environment: String? = null): PaymentsRuntimeSnapshotRetrieveResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("environment", environment, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/runtime/snapshot"), query))
        return client.convertValue(raw, object : TypeReference<PaymentsRuntimeSnapshotRetrieveResult>() {})
    }

    /** Payments Webhook Events List */
    suspend fun paymentsWebhookEventsList(providerCode: String? = null, page: String? = null, pageSize: String? = null, status: String? = null): PaymentsWebhookEventsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("provider_code", providerCode, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/webhook_events"), query))
        return client.convertValue(raw, object : TypeReference<PaymentsWebhookEventsListResult>() {})
    }

    /** Recharges Orders List */
    suspend fun rechargesOrdersList(page: String? = null, pageSize: String? = null, status: String? = null): RechargesOrdersListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/recharges/orders"), query))
        return client.convertValue(raw, object : TypeReference<RechargesOrdersListResult>() {})
    }

    /** Recharges Packages List */
    suspend fun rechargesPackagesList(page: String? = null, pageSize: String? = null, status: String? = null): RechargesPackagesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/recharges/packages"), query))
        return client.convertValue(raw, object : TypeReference<RechargesPackagesListResult>() {})
    }

    /** Recharges Packages Create */
    suspend fun rechargesPackagesCreate(body: CommerceRechargePackageMutationRequest, idempotencyKey: String): RechargesPackagesCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/recharges/packages"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<RechargesPackagesCreateResult>() {})
    }

    /** Recharges Packages Delete */
    suspend fun rechargesPackagesDelete(packageId: String): RechargesPackagesDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/recharges/packages/${serializePathParameter(packageId, PathParameterSpec("packageId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<RechargesPackagesDeleteResult>() {})
    }

    /** Recharges Packages Update */
    suspend fun rechargesPackagesUpdate(packageId: String, body: CommerceRechargePackageMutationRequest, idempotencyKey: String): RechargesPackagesUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.patch(ApiPaths.backendPath("/recharges/packages/${serializePathParameter(packageId, PathParameterSpec("packageId", "simple", false))}"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<RechargesPackagesUpdateResult>() {})
    }

    /** Recharges Settings Retrieve */
    suspend fun rechargesSettingsRetrieve(): RechargesSettingsRetrieveResult? {
        val raw = client.get(ApiPaths.backendPath("/recharges/settings"))
        return client.convertValue(raw, object : TypeReference<RechargesSettingsRetrieveResult>() {})
    }

    /** Recharges Settings Update */
    suspend fun rechargesSettingsUpdate(body: CommerceRechargeSettingsUpdateRequest): RechargesSettingsUpdateResult? {
        val raw = client.put(ApiPaths.backendPath("/recharges/settings"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<RechargesSettingsUpdateResult>() {})
    }

    /** Refunds List */
    suspend fun refundsList(page: String? = null, pageSize: String? = null, status: String? = null): RefundsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/refunds"), query))
        return client.convertValue(raw, object : TypeReference<RefundsListResult>() {})
    }

    /** Refunds Retrieve */
    suspend fun refundsRetrieve(refundId: String): RefundsRetrieveResult? {
        val raw = client.get(ApiPaths.backendPath("/refunds/${serializePathParameter(refundId, PathParameterSpec("refundId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<RefundsRetrieveResult>() {})
    }

    /** Shipments List */
    suspend fun shipmentsList(page: String? = null, pageSize: String? = null, status: String? = null): ShipmentsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/shipments"), query))
        return client.convertValue(raw, object : TypeReference<ShipmentsListResult>() {})
    }

    /** Shipments Tracking Events List */
    suspend fun shipmentsTrackingEventsList(shipmentId: String, page: String? = null, pageSize: String? = null, status: String? = null): ShipmentsTrackingEventsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/shipments/${serializePathParameter(shipmentId, PathParameterSpec("shipmentId", "simple", false))}/tracking_events"), query))
        return client.convertValue(raw, object : TypeReference<ShipmentsTrackingEventsListResult>() {})
    }

    /** Wallet Accounts List */
    suspend fun walletAccountsList(page: String? = null, pageSize: String? = null, status: String? = null): WalletAccountsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/wallet/accounts"), query))
        return client.convertValue(raw, object : TypeReference<WalletAccountsListResult>() {})
    }

    /** Wallet Adjustments Create */
    suspend fun walletAdjustmentsCreate(body: CommerceStandardCommandRequest, idempotencyKey: String): WalletAdjustmentsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/wallet/adjustments"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<WalletAdjustmentsCreateResult>() {})
    }

    /** Wallet Exchange Rules List */
    suspend fun walletExchangeRulesList(page: String? = null, pageSize: String? = null, status: String? = null): WalletExchangeRulesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/wallet/exchange_rules"), query))
        return client.convertValue(raw, object : TypeReference<WalletExchangeRulesListResult>() {})
    }

    /** Wallet Ledger Entries List */
    suspend fun walletLedgerEntriesList(page: String? = null, pageSize: String? = null, status: String? = null): WalletLedgerEntriesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/wallet/ledger_entries"), query))
        return client.convertValue(raw, object : TypeReference<WalletLedgerEntriesListResult>() {})
    }

    private data class PathParameterSpec(val name: String, val style: String, val explode: Boolean)

    private fun serializePathParameter(value: Any?, spec: PathParameterSpec): String {
        if (value == null) return ""
        val style = spec.style.ifBlank { "simple" }
        return when (value) {
            is Iterable<*> -> serializePathArray(spec.name, value, style, spec.explode)
            is Map<*, *> -> serializePathObject(spec.name, value, style, spec.explode)
            else -> pathPrimitivePrefix(spec.name, style) + pathEncode(value.toString())
        }
    }

    private fun serializePathArray(name: String, values: Iterable<*>, style: String, explode: Boolean): String {
        val serialized = values.mapNotNull { it?.toString()?.let(::pathEncode) }
        if (serialized.isEmpty()) return pathPrefix(name, style)
        if (style == "matrix") {
            if (explode) {
                return serialized.joinToString("") { ";$name=$it" }
            }
            return ";$name=" + serialized.joinToString(",")
        }
        val separator = if (explode) "." else ","
        return pathPrefix(name, style) + serialized.joinToString(separator)
    }

    private fun serializePathObject(name: String, values: Map<*, *>, style: String, explode: Boolean): String {
        val entries = mutableListOf<String>()
        val exploded = mutableListOf<String>()
        values.forEach { (key, value) ->
            if (value == null) return@forEach
            val escapedKey = pathEncode(key.toString())
            val escapedValue = pathEncode(value.toString())
            if (explode) {
                if (style == "matrix") {
                    exploded += ";$escapedKey=$escapedValue"
                } else {
                    exploded += "$escapedKey=$escapedValue"
                }
            } else {
                entries += escapedKey
                entries += escapedValue
            }
        }
        if (style == "matrix") {
            if (explode) return exploded.joinToString("")
            return ";$name=" + entries.joinToString(",")
        }
        if (explode) {
            val separator = if (style == "label") "." else ","
            return pathPrefix(name, style) + exploded.joinToString(separator)
        }
        return pathPrefix(name, style) + entries.joinToString(",")
    }

    private fun pathPrefix(name: String, style: String): String {
        return when (style) {
            "label" -> "."
            "matrix" -> ";$name"
            else -> ""
        }
    }

    private fun pathPrimitivePrefix(name: String, style: String): String {
        return if (style == "matrix") ";$name=" else pathPrefix(name, style)
    }

    private fun pathEncode(value: String): String {
        return java.net.URLEncoder.encode(value, java.nio.charset.StandardCharsets.UTF_8).replace("+", "%20")
    }

    private data class QueryParameterSpec(
        val name: String,
        val value: Any?,
        val style: String,
        val explode: Boolean,
        val allowReserved: Boolean,
        val contentType: String?,
    )

    private val queryObjectMapper = ObjectMapper().registerKotlinModule()

    private fun buildQueryString(parameters: List<QueryParameterSpec>): String {
        val pairs = mutableListOf<String>()
        parameters.forEach { appendSerializedParameter(pairs, it) }
        return pairs.joinToString("&")
    }

    private fun appendSerializedParameter(pairs: MutableList<String>, parameter: QueryParameterSpec) {
        val value = parameter.value ?: return
        if (!parameter.contentType.isNullOrBlank()) {
            val json = queryObjectMapper.writeValueAsString(value)
            pairs += urlEncode(parameter.name) + "=" + encodeQueryValue(json, parameter.allowReserved)
            return
        }

        val style = parameter.style.ifBlank { "form" }
        when (value) {
            is Iterable<*> -> appendArrayParameter(pairs, parameter.name, value, style, parameter.explode, parameter.allowReserved)
            is Map<*, *> -> if (style == "deepObject") {
                appendDeepObjectParameter(pairs, parameter.name, value, parameter.allowReserved)
            } else {
                appendObjectParameter(pairs, parameter.name, value, style, parameter.explode, parameter.allowReserved)
            }
            else -> pairs += urlEncode(parameter.name) + "=" + encodeQueryValue(value.toString(), parameter.allowReserved)
        }
    }

    private fun appendArrayParameter(
        pairs: MutableList<String>,
        name: String,
        values: Iterable<*>,
        style: String,
        explode: Boolean,
        allowReserved: Boolean,
    ) {
        val serialized = values.mapNotNull { it?.toString() }
        if (serialized.isEmpty()) return
        if (style == "form" && explode) {
            serialized.forEach { pairs += urlEncode(name) + "=" + encodeQueryValue(it, allowReserved) }
            return
        }
        pairs += urlEncode(name) + "=" + encodeQueryValue(serialized.joinToString(","), allowReserved)
    }

    private fun appendObjectParameter(
        pairs: MutableList<String>,
        name: String,
        values: Map<*, *>,
        style: String,
        explode: Boolean,
        allowReserved: Boolean,
    ) {
        val serialized = mutableListOf<String>()
        values.forEach { (key, value) ->
            if (value == null) return@forEach
            if (style == "form" && explode) {
                pairs += urlEncode(key.toString()) + "=" + encodeQueryValue(value.toString(), allowReserved)
            } else {
                serialized += key.toString()
                serialized += value.toString()
            }
        }
        if (serialized.isNotEmpty()) {
            pairs += urlEncode(name) + "=" + encodeQueryValue(serialized.joinToString(","), allowReserved)
        }
    }

    private fun appendDeepObjectParameter(pairs: MutableList<String>, name: String, values: Map<*, *>, allowReserved: Boolean) {
        values.forEach { (key, value) ->
            if (value != null) {
                pairs += urlEncode("$name[$key]") + "=" + encodeQueryValue(value.toString(), allowReserved)
            }
        }
    }

    private fun encodeQueryValue(value: String, allowReserved: Boolean): String {
        var encoded = urlEncode(value)
        if (!allowReserved) return encoded
        mapOf(
            "%3A" to ":", "%2F" to "/", "%3F" to "?", "%23" to "#",
            "%5B" to "[", "%5D" to "]", "%40" to "@", "%21" to "!",
            "%24" to "$", "%26" to "&", "%27" to "'", "%28" to "(",
            "%29" to ")", "%2A" to "*", "%2B" to "+", "%2C" to ",",
            "%3B" to ";", "%3D" to "=",
        ).forEach { (escaped, reserved) -> encoded = encoded.replace(escaped, reserved) }
        return encoded
    }

    private fun urlEncode(value: String): String {
        return java.net.URLEncoder.encode(value, java.nio.charset.StandardCharsets.UTF_8)
    }

    private data class HeaderParameterSpec(val value: Any?, val style: String, val explode: Boolean, val contentType: String?)

    private val headerObjectMapper = ObjectMapper().registerKotlinModule()

    private fun buildRequestHeaders(headers: Map<String, HeaderParameterSpec>, cookies: Map<String, HeaderParameterSpec>): Map<String, String>? {
        val requestHeaders = linkedMapOf<String, String>()
        headers.forEach { (name, parameter) ->
            serializeParameterValue(parameter)?.let { requestHeaders[name] = it }
        }

        val cookieHeader = buildCookieHeader(cookies)
        if (cookieHeader.isNotEmpty()) {
            requestHeaders["Cookie"] = requestHeaders["Cookie"]?.let { "$it; $cookieHeader" } ?: cookieHeader
        }

        return requestHeaders.takeIf { it.isNotEmpty() }
    }

    private fun buildCookieHeader(cookies: Map<String, HeaderParameterSpec>): String {
        return cookies.mapNotNull { (name, parameter) ->
            serializeParameterValue(parameter)?.let {
                java.net.URLEncoder.encode(name, java.nio.charset.StandardCharsets.UTF_8) + "=" +
                    java.net.URLEncoder.encode(it, java.nio.charset.StandardCharsets.UTF_8)
            }
        }.joinToString("; ")
    }

    private fun serializeParameterValue(parameter: HeaderParameterSpec?): String? {
        val value = parameter?.value ?: return null
        if (!parameter.contentType.isNullOrBlank()) {
            return headerObjectMapper.writeValueAsString(value)
        }
        return when (value) {
            is Iterable<*> -> value.mapNotNull { it?.toString() }.joinToString(",")
            is Map<*, *> -> value.mapNotNull { (key, item) ->
                if (item == null) {
                    null
                } else if (parameter.explode) {
                    "$key=$item"
                } else {
                    listOf(key.toString(), item.toString()).joinToString(",")
                }
            }.joinToString(",")
            else -> value.toString()
        }
    }
}
