import Foundation

public class BillingApi {
    private let client: HttpClient

    public init(client: HttpClient) {
        self.client = client
    }

    /// Retrieve account points
    public func accountPointsRetrieve() async throws -> AccountPointsRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/billing/account/points"), responseType: AccountPointsRetrieveResult.self)
    }

    /// Retrieve account points exchange rate
    public func accountPointsExchangeRateRetrieve() async throws -> AccountPointsExchangeRateRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/billing/account/points/exchange_rate"), responseType: AccountPointsExchangeRateRetrieveResult.self)
    }

    /// Create account points exchange
    public func accountPointsExchangesCreate(body: CommerceWalletCommandRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> AccountPointsExchangesCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/billing/account/points/exchanges"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: AccountPointsExchangesCreateResult.self)
    }

    /// List account points exchange rules
    public func accountPointsExchangesRulesList(sourceAssetType: String? = nil, targetAssetType: String? = nil) async throws -> AccountPointsExchangesRulesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "source_asset_type", value: sourceAssetType, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "target_asset_type", value: targetAssetType, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/account/points/exchanges/rules"), query), responseType: AccountPointsExchangesRulesListResult.self)
    }

    /// Retrieve account points exchange
    public func accountPointsExchangesRetrieve(exchangeNo: String) async throws -> AccountPointsExchangesRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/billing/account/points/exchanges/\(serializePathParameter(exchangeNo, PathParameterSpec(name: "exchangeNo", style: "simple", explode: false)))"), responseType: AccountPointsExchangesRetrieveResult.self)
    }

    /// List account points history
    public func accountPointsHistoryList(page: Int? = nil, pageSize: Int? = nil, cursor: String? = nil) async throws -> AccountPointsHistoryListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "cursor", value: cursor, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/account/points/history"), query), responseType: AccountPointsHistoryListResult.self)
    }

    /// Create recharge
    public func accountPointsRechargesCreate(body: SubmitRechargeRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> AccountPointsRechargesCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/billing/account/points/recharges"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: AccountPointsRechargesCreateResult.self)
    }

    /// Retrieve account points recharge order
    public func accountPointsRechargesOrdersRetrieve(orderNo: String) async throws -> AccountPointsRechargesOrdersRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/billing/account/points/recharges/orders/\(serializePathParameter(orderNo, PathParameterSpec(name: "orderNo", style: "simple", explode: false)))"), responseType: AccountPointsRechargesOrdersRetrieveResult.self)
    }

    /// Cancel account points recharge order
    public func accountPointsRechargesOrdersCancel(orderNo: String, body: CommerceRechargeOrderCancelRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> AccountPointsRechargesOrdersCancelResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/billing/account/points/recharges/orders/\(serializePathParameter(orderNo, PathParameterSpec(name: "orderNo", style: "simple", explode: false)))/cancel"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: AccountPointsRechargesOrdersCancelResult.self)
    }

    /// List packages
    public func accountPointsRechargesPackagesList() async throws -> AccountPointsRechargesPackagesListResult? {
        return try await client.get(ApiPaths.appPath("/billing/account/points/recharges/packages"), responseType: AccountPointsRechargesPackagesListResult.self)
    }

    /// List account points recharge records
    public func accountPointsRechargesRecordsList(page: Int? = nil, pageSize: Int? = nil, cursor: String? = nil) async throws -> AccountPointsRechargesRecordsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "cursor", value: cursor, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/account/points/recharges/records"), query), responseType: AccountPointsRechargesRecordsListResult.self)
    }

    /// Create account points transfer
    public func accountPointsTransfersCreate(body: CommerceWalletCommandRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> AccountPointsTransfersCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/billing/account/points/transfers"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: AccountPointsTransfersCreateResult.self)
    }

    /// List account details
    public func accountSummaryRetrieve() async throws -> AccountSummaryRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/billing/account/summary"), responseType: AccountSummaryRetrieveResult.self)
    }

    /// Retrieve account tokens
    public func accountTokensRetrieve() async throws -> AccountTokensRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/billing/account/tokens"), responseType: AccountTokensRetrieveResult.self)
    }

    /// Create account token deduction
    public func accountTokensDeductionsCreate(body: CommerceWalletCommandRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> AccountTokensDeductionsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/billing/account/tokens/deductions"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: AccountTokensDeductionsCreateResult.self)
    }

    /// List coupon catalog
    public func couponsCatalogList(status: String? = nil, page: Int? = nil, pageSize: Int? = nil, cursor: String? = nil) async throws -> CouponsCatalogListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "cursor", value: cursor, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/coupons/catalog"), query), responseType: CouponsCatalogListResult.self)
    }

    /// Retrieve coupon catalog item
    public func couponsCatalogRetrieve(couponId: String) async throws -> CouponsCatalogRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/billing/coupons/catalog/\(serializePathParameter(couponId, PathParameterSpec(name: "couponId", style: "simple", explode: false)))"), responseType: CouponsCatalogRetrieveResult.self)
    }

    /// Create coupon claim
    public func couponsClaimsCreate(body: CommerceCouponClaimRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> CouponsClaimsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/billing/coupons/claims"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: CouponsClaimsCreateResult.self)
    }

    /// Redeem code
    public func couponsRedeemCreate(body: RedeemCodeRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> CouponsRedeemCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/billing/coupons/redeem"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: CouponsRedeemCreateResult.self)
    }

    /// Create coupon usage
    public func couponsUsageCreate(body: CommerceCouponUsageRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> CouponsUsageCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/billing/coupons/usage"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: CouponsUsageCreateResult.self)
    }

    /// Create coupon usage reversal
    public func couponsUsageReversalsCreate(body: CommerceCouponUsageRollbackRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> CouponsUsageReversalsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/billing/coupons/usage_reversals"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: CouponsUsageReversalsCreateResult.self)
    }

    /// List checkout status
    public func paymentsCheckoutRetrieve(orderNo: String) async throws -> PaymentsCheckoutRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/billing/payments/checkout/\(serializePathParameter(orderNo, PathParameterSpec(name: "orderNo", style: "simple", explode: false)))"), responseType: PaymentsCheckoutRetrieveResult.self)
    }

    /// List recharge history
    public func paymentsRecordsList() async throws -> PaymentsRecordsListResult? {
        return try await client.get(ApiPaths.appPath("/billing/payments/records"), responseType: PaymentsRecordsListResult.self)
    }

    /// Retrieve payment record
    public func paymentsRecordsRetrieve(paymentId: String) async throws -> PaymentsRecordsRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/billing/payments/records/\(serializePathParameter(paymentId, PathParameterSpec(name: "paymentId", style: "simple", explode: false)))"), responseType: PaymentsRecordsRetrieveResult.self)
    }

    /// Create preflight estimate
    public func preflightEstimatesCreate(body: CommercePreflightRequest) async throws -> PreflightEstimatesCreateResult? {
        return try await client.post(ApiPaths.appPath("/billing/preflight/estimates"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: PreflightEstimatesCreateResult.self)
    }

    /// Create preflight precheck
    public func preflightPrechecksCreate(body: CommercePreflightRequest) async throws -> PreflightPrechecksCreateResult? {
        return try await client.post(ApiPaths.appPath("/billing/preflight/prechecks"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: PreflightPrechecksCreateResult.self)
    }

    /// Create preflight prehold
    public func preflightPreholdsCreate(body: CommercePreflightRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> PreflightPreholdsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/billing/preflight/preholds"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: PreflightPreholdsCreateResult.self)
    }

    /// Create preflight release
    public func preflightReleasesCreate(body: CommercePreflightRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> PreflightReleasesCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/billing/preflight/releases"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: PreflightReleasesCreateResult.self)
    }

    /// Create preflight settlement
    public func preflightSettlementsCreate(body: CommercePreflightRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> PreflightSettlementsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/billing/preflight/settlements"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: PreflightSettlementsCreateResult.self)
    }

    /// List dashboard data
    public func settlementsDashboardList(year: Int? = nil) async throws -> SettlementsDashboardListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "year", value: year, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/settlements/dashboard"), query), responseType: SettlementsDashboardListResult.self)
    }

    /// List redeem history
    public func usersCurrentCouponsList() async throws -> UsersCurrentCouponsListResult? {
        return try await client.get(ApiPaths.appPath("/billing/users/current/coupons"), responseType: UsersCurrentCouponsListResult.self)
    }

    /// Retrieve current user coupon
    public func usersCurrentCouponsRetrieve(userCouponId: String) async throws -> UsersCurrentCouponsRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/billing/users/current/coupons/\(serializePathParameter(userCouponId, PathParameterSpec(name: "userCouponId", style: "simple", explode: false)))"), responseType: UsersCurrentCouponsRetrieveResult.self)
    }

    /// List wallet accounts
    public func walletAccountsList(assetType: String? = nil) async throws -> WalletAccountsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "asset_type", value: assetType, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/wallet/accounts"), query), responseType: WalletAccountsListResult.self)
    }

    /// Create wallet exchange
    public func walletExchangesCreate(body: CommerceWalletCommandRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> WalletExchangesCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/billing/wallet/exchanges"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: WalletExchangesCreateResult.self)
    }

    /// Retrieve wallet operation
    public func walletOperationsRetrieve(requestNo: String) async throws -> WalletOperationsRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/billing/wallet/operations/\(serializePathParameter(requestNo, PathParameterSpec(name: "requestNo", style: "simple", explode: false)))"), responseType: WalletOperationsRetrieveResult.self)
    }

    /// Retrieve wallet overview
    public func walletOverviewRetrieve() async throws -> WalletOverviewRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/billing/wallet/overview"), responseType: WalletOverviewRetrieveResult.self)
    }

    /// Create wallet topup
    public func walletTopupsCreate(body: CommerceWalletCommandRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> WalletTopupsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/billing/wallet/topups"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: WalletTopupsCreateResult.self)
    }

    /// List wallet transactions
    public func walletTransactionsList(page: Int? = nil, pageSize: Int? = nil, cursor: String? = nil) async throws -> WalletTransactionsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "cursor", value: cursor, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/wallet/transactions"), query), responseType: WalletTransactionsListResult.self)
    }

    /// Retrieve wallet transaction
    public func walletTransactionsRetrieve(transactionId: String) async throws -> WalletTransactionsRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/billing/wallet/transactions/\(serializePathParameter(transactionId, PathParameterSpec(name: "transactionId", style: "simple", explode: false)))"), responseType: WalletTransactionsRetrieveResult.self)
    }

    /// Create wallet transfer
    public func walletTransfersCreate(body: CommerceWalletCommandRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> WalletTransfersCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/billing/wallet/transfers"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: WalletTransfersCreateResult.self)
    }

    /// Create wallet withdrawal
    public func walletWithdrawalsCreate(body: CommerceWalletCommandRequest, idempotencyKey: String, xRequestId: String? = nil) async throws -> WalletWithdrawalsCreateResult? {
        let requestHeaders = buildRequestHeaders(
            [
                "Idempotency-Key": HeaderParameterSpec(value: idempotencyKey, style: "simple", explode: false, contentType: nil),
                "X-Request-Id": HeaderParameterSpec(value: xRequestId, style: "simple", explode: false, contentType: nil),
            ],
            [:]
        )
        return try await client.post(ApiPaths.appPath("/billing/wallet/withdrawals"), body: body, params: nil, headers: requestHeaders, contentType: "application/json", responseType: WalletWithdrawalsCreateResult.self)
    }

    private struct PathParameterSpec {
        let name: String
        let style: String
        let explode: Bool
    }

    private func serializePathParameter(_ value: Any?, _ spec: PathParameterSpec) -> String {
        guard let value else { return "" }
        let style = spec.style.isEmpty ? "simple" : spec.style
        if let array = value as? [Any] {
            return serializePathArray(spec.name, array, style, spec.explode)
        }
        if let object = value as? [String: Any] {
            return serializePathObject(spec.name, object, style, spec.explode)
        }
        return pathPrimitivePrefix(spec.name, style) + pathEncode(String(describing: value))
    }

    private func serializePathArray(_ name: String, _ values: [Any], _ style: String, _ explode: Bool) -> String {
        let serialized = values.map { pathEncode(String(describing: $0)) }
        if serialized.isEmpty { return pathPrefix(name, style) }
        if style == "matrix" {
            if explode {
                return serialized.map { ";\(name)=\($0)" }.joined()
            }
            return ";\(name)=" + serialized.joined(separator: ",")
        }
        let separator = explode ? "." : ","
        return pathPrefix(name, style) + serialized.joined(separator: separator)
    }

    private func serializePathObject(_ name: String, _ values: [String: Any], _ style: String, _ explode: Bool) -> String {
        var entries: [String] = []
        var exploded: [String] = []
        for (key, value) in values {
            let escapedKey = pathEncode(key)
            let escapedValue = pathEncode(String(describing: value))
            if explode {
                if style == "matrix" {
                    exploded.append(";\(escapedKey)=\(escapedValue)")
                } else {
                    exploded.append("\(escapedKey)=\(escapedValue)")
                }
            } else {
                entries.append(escapedKey)
                entries.append(escapedValue)
            }
        }
        if style == "matrix" {
            if explode {
                return exploded.joined()
            }
            return ";\(name)=" + entries.joined(separator: ",")
        }
        if explode {
            let separator = style == "label" ? "." : ","
            return pathPrefix(name, style) + exploded.joined(separator: separator)
        }
        return pathPrefix(name, style) + entries.joined(separator: ",")
    }

    private func pathPrefix(_ name: String, _ style: String) -> String {
        if style == "label" { return "." }
        if style == "matrix" { return ";\(name)" }
        return ""
    }

    private func pathPrimitivePrefix(_ name: String, _ style: String) -> String {
        style == "matrix" ? ";\(name)=" : pathPrefix(name, style)
    }

    private func pathEncode(_ value: String) -> String {
        value.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? value
    }

    private struct QueryParameterSpec {
        let name: String
        let value: Any?
        let style: String
        let explode: Bool
        let allowReserved: Bool
        let contentType: String?
    }

    private func buildQueryString(_ parameters: [QueryParameterSpec]) -> String {
        var pairs: [String] = []
        for parameter in parameters {
            appendSerializedParameter(&pairs, parameter)
        }
        return pairs.joined(separator: "&")
    }

    private func appendSerializedParameter(_ pairs: inout [String], _ parameter: QueryParameterSpec) {
        guard let value = parameter.value else { return }
        if let contentType = parameter.contentType, !contentType.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            let data = (try? JSONSerialization.data(withJSONObject: value, options: [])) ?? Data(String(describing: value).utf8)
            let json = String(data: data, encoding: .utf8) ?? String(describing: value)
            pairs.append("\(urlEncode(parameter.name))=\(encodeQueryValue(json, allowReserved: parameter.allowReserved))")
            return
        }

        let style = parameter.style.isEmpty ? "form" : parameter.style
        if style == "deepObject", let object = value as? [String: Any] {
            appendDeepObjectParameter(&pairs, name: parameter.name, values: object, allowReserved: parameter.allowReserved)
        } else if let array = value as? [Any] {
            appendArrayParameter(&pairs, name: parameter.name, values: array, style: style, explode: parameter.explode, allowReserved: parameter.allowReserved)
        } else if let object = value as? [String: Any] {
            appendObjectParameter(&pairs, name: parameter.name, values: object, style: style, explode: parameter.explode, allowReserved: parameter.allowReserved)
        } else {
            pairs.append("\(urlEncode(parameter.name))=\(encodeQueryValue(String(describing: value), allowReserved: parameter.allowReserved))")
        }
    }

    private func appendArrayParameter(
        _ pairs: inout [String],
        name: String,
        values: [Any],
        style: String,
        explode: Bool,
        allowReserved: Bool
    ) {
        let serialized = values.map { String(describing: $0) }
        guard !serialized.isEmpty else { return }
        if style == "form" && explode {
            for item in serialized {
                pairs.append("\(urlEncode(name))=\(encodeQueryValue(item, allowReserved: allowReserved))")
            }
            return
        }
        pairs.append("\(urlEncode(name))=\(encodeQueryValue(serialized.joined(separator: ","), allowReserved: allowReserved))")
    }

    private func appendObjectParameter(
        _ pairs: inout [String],
        name: String,
        values: [String: Any],
        style: String,
        explode: Bool,
        allowReserved: Bool
    ) {
        var serialized: [String] = []
        for (key, value) in values {
            if style == "form" && explode {
                pairs.append("\(urlEncode(key))=\(encodeQueryValue(String(describing: value), allowReserved: allowReserved))")
            } else {
                serialized.append(key)
                serialized.append(String(describing: value))
            }
        }
        if !serialized.isEmpty {
            pairs.append("\(urlEncode(name))=\(encodeQueryValue(serialized.joined(separator: ","), allowReserved: allowReserved))")
        }
    }

    private func appendDeepObjectParameter(_ pairs: inout [String], name: String, values: [String: Any], allowReserved: Bool) {
        for (key, value) in values {
            pairs.append("\(urlEncode("\(name)[\(key)]"))=\(encodeQueryValue(String(describing: value), allowReserved: allowReserved))")
        }
    }

    private func encodeQueryValue(_ value: String, allowReserved: Bool) -> String {
        var encoded = urlEncode(value)
        if !allowReserved { return encoded }
        [
            "%3A": ":", "%2F": "/", "%3F": "?", "%23": "#",
            "%5B": "[", "%5D": "]", "%40": "@", "%21": "!",
            "%24": "$", "%26": "&", "%27": "'", "%28": "(",
            "%29": ")", "%2A": "*", "%2B": "+", "%2C": ",",
            "%3B": ";", "%3D": "=",
        ].forEach { encoded = encoded.replacingOccurrences(of: $0.key, with: $0.value) }
        return encoded
    }

    private func urlEncode(_ value: String) -> String {
        value.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? value
    }

    private struct HeaderParameterSpec {
        let value: Any?
        let style: String
        let explode: Bool
        let contentType: String?
    }

    private func buildRequestHeaders(_ headers: [String: HeaderParameterSpec], _ cookies: [String: HeaderParameterSpec]) -> [String: String]? {
        var requestHeaders: [String: String] = [:]
        for (name, parameter) in headers {
            if let serialized = serializeParameterValue(parameter) {
                requestHeaders[name] = serialized
            }
        }

        if let cookieHeader = buildCookieHeader(cookies), !cookieHeader.isEmpty {
            requestHeaders["Cookie"] = requestHeaders["Cookie"].map { "\($0); \(cookieHeader)" } ?? cookieHeader
        }

        return requestHeaders.isEmpty ? nil : requestHeaders
    }

    private func buildCookieHeader(_ cookies: [String: HeaderParameterSpec]) -> String? {
        let pairs = cookies.compactMap { name, parameter -> String? in
            guard let serialized = serializeParameterValue(parameter) else { return nil }
            return "\(urlEncode(name))=\(urlEncode(serialized))"
        }
        return pairs.isEmpty ? nil : pairs.joined(separator: "; ")
    }

    private func serializeParameterValue(_ parameter: HeaderParameterSpec?) -> String? {
        guard let parameter, let value = parameter.value else { return nil }
        if let contentType = parameter.contentType, !contentType.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            if JSONSerialization.isValidJSONObject(value),
               let data = try? JSONSerialization.data(withJSONObject: value, options: []),
               let json = String(data: data, encoding: .utf8) {
                return json
            }
            return String(describing: value)
        }
        if let array = value as? [Any?] {
            return array.compactMap { $0.map { String(describing: $0) } }.joined(separator: ",")
        }
        if let object = value as? [String: Any] {
            var values: [String] = []
            for (key, item) in object {
                if parameter.explode {
                    values.append("\(key)=\(item)")
                } else {
                    values.append(key)
                    values.append(String(describing: item))
                }
            }
            return values.joined(separator: ",")
        }
        if let date = value as? Date {
            return ISO8601DateFormatter().string(from: date)
        }
        return String(describing: value)
    }

    private func urlEncode(_ value: String) -> String {
        value.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? value
    }
}
